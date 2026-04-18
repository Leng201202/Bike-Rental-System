package com.bikerental.backend.modules.rental;

import com.bikerental.backend.common.exception.DomainException;
import com.bikerental.backend.domain.bike.Bike;
import com.bikerental.backend.domain.bike.BikeRepository;
import com.bikerental.backend.domain.bike.BikeStatus;
import com.bikerental.backend.domain.payment.DebtEntryType;
import com.bikerental.backend.domain.payment.DebtLedgerEntry;
import com.bikerental.backend.domain.payment.DebtLedgerRepository;
import com.bikerental.backend.domain.rental.Rental;
import com.bikerental.backend.domain.rental.RentalRepository;
import com.bikerental.backend.domain.rental.RentalStatus;
import com.bikerental.backend.domain.user.User;
import com.bikerental.backend.domain.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.OffsetDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Objects;

@Service
public class RentalService {

    private static final List<RentalStatus> OPEN_STATUSES = List.of(RentalStatus.RESERVED, RentalStatus.ACTIVE);
    private static final double EARTH_RADIUS_KM = 6371.0088;

    private final RentalRepository rentalRepository;
    private final UserRepository userRepository;
    private final BikeRepository bikeRepository;
    private final DebtLedgerRepository debtLedgerRepository;

    public RentalService(
        RentalRepository rentalRepository,
        UserRepository userRepository,
        BikeRepository bikeRepository,
        DebtLedgerRepository debtLedgerRepository
    ) {
        this.rentalRepository = rentalRepository;
        this.userRepository = userRepository;
        this.bikeRepository = bikeRepository;
        this.debtLedgerRepository = debtLedgerRepository;
    }

    @Transactional
    public Rental startRental(StartRentalRequest request) {
        User user = userRepository.findById(request.userId())
            .orElseThrow(() -> new DomainException("USER_NOT_FOUND", "User not found: " + request.userId()));
        Bike bike = bikeRepository.findById(request.bikeId())
            .orElseThrow(() -> new DomainException("BIKE_NOT_FOUND", "Bike not found: " + request.bikeId()));

        if (bike.getStatus() != BikeStatus.AVAILABLE) {
            throw new DomainException("BIKE_NOT_AVAILABLE", "Bike is not available");
        }

        rentalRepository.findByUserIdAndStatusIn(user.getId(), OPEN_STATUSES)
            .ifPresent(r -> {
                throw new DomainException("USER_ALREADY_HAS_OPEN_RENTAL", "User already has an active or reserved rental");
            });

        rentalRepository.findByBikeIdAndStatusIn(bike.getId(), OPEN_STATUSES)
            .ifPresent(r -> {
                throw new DomainException("BIKE_ALREADY_RENTED", "Bike already has an active or reserved rental");
            });

        Rental rental = new Rental();
        rental.setUser(user);
        rental.setBike(bike);
        rental.setMethod(request.method());
        rental.setRentalType(request.rentalType());
        rental.setStatus(RentalStatus.ACTIVE);
        rental.setStartedAt(OffsetDateTime.now());
        rental.setStartLat(bike.getCurrentLat());
        rental.setStartLng(bike.getCurrentLng());

        bike.setStatus(BikeStatus.RENTED);

        return rentalRepository.save(rental);
    }

    @Transactional
    public Rental endRental(Long rentalId, EndRentalRequest request) {
        Rental rental = rentalRepository.findById(rentalId)
            .orElseThrow(() -> new DomainException("RENTAL_NOT_FOUND", "Rental not found: " + rentalId));

        if (rental.getStatus() != RentalStatus.ACTIVE) {
            throw new DomainException("RENTAL_NOT_ACTIVE", "Rental must be ACTIVE to end");
        }

        OffsetDateTime endedAt = OffsetDateTime.now();
        long durationSeconds = ChronoUnit.SECONDS.between(rental.getStartedAt(), endedAt);
        if (durationSeconds < 0) {
            durationSeconds = 0;
        }

        rental.setEndedAt(endedAt);
        rental.setDurationSeconds((int) durationSeconds);
        BigDecimal calculatedDistanceKm = calculateDistanceKm(rental, request);
        rental.setDistanceKm(calculatedDistanceKm);
        rental.setStatus(RentalStatus.COMPLETED);

        BigDecimal endLat = request.endLat();
        BigDecimal endLng = request.endLng();
        EndRentalRequest.GpsPointRequest finalPoint = getFinalRoutePoint(request.routePoints());
        if (finalPoint != null) {
            endLat = finalPoint.lat();
            endLng = finalPoint.lng();
        }

        if (endLat != null && endLng != null) {
            rental.setEndLat(endLat);
            rental.setEndLng(endLng);
            rental.getBike().setCurrentLat(endLat);
            rental.getBike().setCurrentLng(endLng);
        }

        BigDecimal totalCost = calculateCost(rental);
        rental.setTotalCost(totalCost);
        rental.getBike().setStatus(BikeStatus.AVAILABLE);

        DebtLedgerEntry charge = new DebtLedgerEntry();
        charge.setUser(rental.getUser());
        charge.setRental(rental);
        charge.setEntryType(DebtEntryType.CHARGE);
        charge.setAmountDelta(totalCost);
        charge.setNote("Rental charge");
        debtLedgerRepository.save(charge);

        return rental;
    }

    @Transactional(readOnly = true)
    public List<Rental> getUserRentals(Long userId) {
        return rentalRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    private BigDecimal calculateCost(Rental rental) {
        BigDecimal cost;
        if (rental.getMethod().name().equals("HOURLY")) {
            BigDecimal hours = BigDecimal.valueOf(rental.getDurationSeconds())
                .divide(BigDecimal.valueOf(3600), 4, RoundingMode.UP);
            cost = rental.getBike().getPricePerHour().multiply(hours);
        } else {
            cost = rental.getBike().getPricePerKm().multiply(rental.getDistanceKm());
        }

        return cost.setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal calculateDistanceKm(Rental rental, EndRentalRequest request) {
        BigDecimal routeDistance = calculateRouteDistanceKm(request.routePoints());
        if (routeDistance != null) {
            return routeDistance;
        }

        BigDecimal startLat = rental.getStartLat();
        BigDecimal startLng = rental.getStartLng();
        BigDecimal endLat = request.endLat();
        BigDecimal endLng = request.endLng();
        if (startLat != null && startLng != null && endLat != null && endLng != null) {
            return haversineKm(startLat.doubleValue(), startLng.doubleValue(), endLat.doubleValue(), endLng.doubleValue());
        }

        return request.distanceKm().setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal calculateRouteDistanceKm(List<EndRentalRequest.GpsPointRequest> routePoints) {
        if (routePoints == null || routePoints.size() < 2) {
            return null;
        }

        double total = 0;
        EndRentalRequest.GpsPointRequest prev = null;
        for (EndRentalRequest.GpsPointRequest point : routePoints) {
            if (point == null || point.lat() == null || point.lng() == null) {
                continue;
            }
            if (prev != null) {
                total += haversineKm(
                    prev.lat().doubleValue(),
                    prev.lng().doubleValue(),
                    point.lat().doubleValue(),
                    point.lng().doubleValue()
                ).doubleValue();
            }
            prev = point;
        }

        if (prev == null || total == 0) {
            return null;
        }
        return BigDecimal.valueOf(total).setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal haversineKm(double lat1, double lng1, double lat2, double lng2) {
        double latDistanceRad = Math.toRadians(lat2 - lat1);
        double lngDistanceRad = Math.toRadians(lng2 - lng1);
        double a = Math.sin(latDistanceRad / 2) * Math.sin(latDistanceRad / 2)
            + Math.cos(Math.toRadians(lat1))
            * Math.cos(Math.toRadians(lat2))
            * Math.sin(lngDistanceRad / 2)
            * Math.sin(lngDistanceRad / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return BigDecimal.valueOf(EARTH_RADIUS_KM * c);
    }

    private EndRentalRequest.GpsPointRequest getFinalRoutePoint(List<EndRentalRequest.GpsPointRequest> routePoints) {
        if (routePoints == null || routePoints.isEmpty()) {
            return null;
        }

        for (int i = routePoints.size() - 1; i >= 0; i--) {
            EndRentalRequest.GpsPointRequest point = routePoints.get(i);
            if (point != null && Objects.nonNull(point.lat()) && Objects.nonNull(point.lng())) {
                return point;
            }
        }
        return null;
    }
}
