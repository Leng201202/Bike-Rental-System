package com.bikerental.backend.modules.notification;

import com.bikerental.backend.common.api.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping("/debt-reminder")
    public ApiResponse<NotificationDto> sendDebtReminder(@Valid @RequestBody DebtReminderRequest request) {
        return ApiResponse.ok(NotificationDto.from(notificationService.sendDebtReminder(request)));
    }
}
