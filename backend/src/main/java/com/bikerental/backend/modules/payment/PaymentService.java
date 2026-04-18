package com.bikerental.backend.modules.payment;

import com.bikerental.backend.common.exception.DomainException;
import com.bikerental.backend.domain.payment.DebtEntryType;
import com.bikerental.backend.domain.payment.DebtLedgerEntry;
import com.bikerental.backend.domain.payment.DebtLedgerRepository;
import com.bikerental.backend.domain.payment.Payment;
import com.bikerental.backend.domain.payment.PaymentRepository;
import com.bikerental.backend.domain.payment.PaymentStatus;
import com.bikerental.backend.domain.rental.Rental;
import com.bikerental.backend.domain.rental.RentalRepository;
import com.bikerental.backend.domain.rental.RentalStatus;
import com.bikerental.backend.domain.user.User;
import com.bikerental.backend.domain.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final RentalRepository rentalRepository;
    private final UserRepository userRepository;
    private final DebtLedgerRepository debtLedgerRepository;

    public PaymentService(
        PaymentRepository paymentRepository,
        RentalRepository rentalRepository,
        UserRepository userRepository,
        DebtLedgerRepository debtLedgerRepository
    ) {
        this.paymentRepository = paymentRepository;
        this.rentalRepository = rentalRepository;
        this.userRepository = userRepository;
        this.debtLedgerRepository = debtLedgerRepository;
    }

    @Transactional
    public Payment payRental(Long rentalId, PayRentalRequest request) {
        Rental rental = rentalRepository.findById(rentalId)
            .orElseThrow(() -> new DomainException("RENTAL_NOT_FOUND", "Rental not found: " + rentalId));

        if (rental.getStatus() != RentalStatus.COMPLETED) {
            throw new DomainException("RENTAL_NOT_COMPLETED", "Rental must be COMPLETED before payment");
        }

        User user = userRepository.findById(request.userId())
            .orElseThrow(() -> new DomainException("USER_NOT_FOUND", "User not found: " + request.userId()));

        if (!rental.getUser().getId().equals(user.getId())) {
            throw new DomainException("USER_RENTAL_MISMATCH", "Rental does not belong to user");
        }

        BigDecimal amount = rental.getTotalCost();

        Payment payment = new Payment();
        payment.setTransactionCode("TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        payment.setUser(user);
        payment.setRental(rental);
        payment.setAmount(amount);
        payment.setMethod(request.method());
        payment.setStatus(PaymentStatus.COMPLETED);
        payment.setPaidAt(OffsetDateTime.now());
        Payment savedPayment = paymentRepository.save(payment);

        DebtLedgerEntry paymentEntry = new DebtLedgerEntry();
        paymentEntry.setUser(user);
        paymentEntry.setRental(rental);
        paymentEntry.setPayment(savedPayment);
        paymentEntry.setEntryType(DebtEntryType.PAYMENT);
        paymentEntry.setAmountDelta(amount.negate());
        paymentEntry.setNote("Rental payment");
        debtLedgerRepository.save(paymentEntry);

        return savedPayment;
    }

    @Transactional(readOnly = true)
    public UserBalanceDto getOutstandingBalance(Long userId) {
        userRepository.findById(userId)
            .orElseThrow(() -> new DomainException("USER_NOT_FOUND", "User not found: " + userId));
        return new UserBalanceDto(userId, debtLedgerRepository.getOutstandingBalance(userId));
    }

    @Transactional(readOnly = true)
    public List<Payment> listUserPayments(Long userId) {
        return paymentRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
}
