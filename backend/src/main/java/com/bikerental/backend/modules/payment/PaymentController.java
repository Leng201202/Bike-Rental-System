package com.bikerental.backend.modules.payment;

import com.bikerental.backend.common.api.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/rentals/{rentalId}/pay")
    public ApiResponse<PaymentDto> payRental(
        @PathVariable Long rentalId,
        @Valid @RequestBody PayRentalRequest request
    ) {
        return ApiResponse.ok(PaymentDto.from(paymentService.payRental(rentalId, request)));
    }

    @GetMapping("/users/{userId}/balance")
    public ApiResponse<UserBalanceDto> getBalance(@PathVariable Long userId) {
        return ApiResponse.ok(paymentService.getOutstandingBalance(userId));
    }

    @GetMapping("/users/{userId}")
    public ApiResponse<List<PaymentDto>> getPayments(@PathVariable Long userId) {
        List<PaymentDto> result = paymentService.listUserPayments(userId).stream()
            .map(PaymentDto::from)
            .toList();
        return ApiResponse.ok(result);
    }
}
