package com.bikerental.backend.modules.bike;

import com.bikerental.backend.common.exception.DomainException;
import com.bikerental.backend.domain.bike.Bike;
import com.bikerental.backend.domain.bike.BikeRepository;
import com.bikerental.backend.domain.bike.BikeStatus;
import com.bikerental.backend.domain.bike.BikeType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BikeService {

    private final BikeRepository bikeRepository;

    public BikeService(BikeRepository bikeRepository) {
        this.bikeRepository = bikeRepository;
    }

    @Transactional
    public Bike createBike(CreateBikeRequest request) {
        Bike bike = new Bike();
        bike.setName(request.name());
        bike.setType(request.type());
        bike.setPricePerHour(request.pricePerHour());
        bike.setPricePerKm(request.pricePerKm());
        bike.setCurrentZone(request.currentZone());
        bike.setCurrentLat(request.currentLat());
        bike.setCurrentLng(request.currentLng());
        bike.setImageUrl(request.imageUrl());
        bike.setDescription(request.description());
        bike.setStatus(request.status() == null ? BikeStatus.AVAILABLE : request.status());
        return bikeRepository.save(bike);
    }

    @Transactional
    public Bike updateBike(Long bikeId, CreateBikeRequest request) {
        Bike bike = bikeRepository.findById(bikeId)
            .orElseThrow(() -> new DomainException("BIKE_NOT_FOUND", "Bike not found: " + bikeId));

        bike.setName(request.name());
        bike.setType(request.type());
        bike.setPricePerHour(request.pricePerHour());
        bike.setPricePerKm(request.pricePerKm());
        bike.setCurrentZone(request.currentZone());
        bike.setCurrentLat(request.currentLat());
        bike.setCurrentLng(request.currentLng());
        bike.setImageUrl(request.imageUrl());
        bike.setDescription(request.description());
        if (request.status() != null) {
            bike.setStatus(request.status());
        }
        return bike;
    }

    @Transactional
    public void deleteBike(Long bikeId) {
        Bike bike = bikeRepository.findById(bikeId)
            .orElseThrow(() -> new DomainException("BIKE_NOT_FOUND", "Bike not found: " + bikeId));
        bikeRepository.delete(bike);
    }

    @Transactional(readOnly = true)
    public List<Bike> listBikes(BikeStatus status, BikeType type) {
        if (status != null && type != null) {
            return bikeRepository.findByStatusAndType(status, type);
        }
        if (status != null) {
            return bikeRepository.findByStatus(status);
        }
        if (type != null) {
            return bikeRepository.findByType(type);
        }
        return bikeRepository.findAll();
    }

    @Transactional
    public Bike markMaintenance(Long bikeId) {
        Bike bike = bikeRepository.findById(bikeId)
            .orElseThrow(() -> new DomainException("BIKE_NOT_FOUND", "Bike not found: " + bikeId));
        bike.setStatus(BikeStatus.MAINTENANCE);
        return bike;
    }
}
