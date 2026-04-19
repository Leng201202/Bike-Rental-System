package com.bikerental.backend.modules.notification;

import com.bikerental.backend.common.exception.DomainException;
import com.bikerental.backend.domain.notification.AppNotification;
import com.bikerental.backend.domain.notification.AppNotificationRepository;
import com.bikerental.backend.domain.notification.NotificationChannel;
import com.bikerental.backend.domain.notification.NotificationStatus;
import com.bikerental.backend.domain.notification.NotificationType;
import com.bikerental.backend.domain.payment.DebtLedgerRepository;
import com.bikerental.backend.domain.user.User;
import com.bikerental.backend.domain.user.UserRepository;
import com.bikerental.backend.modules.audit.AuditLogService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Service
public class NotificationService {

    private final AppNotificationRepository appNotificationRepository;
    private final UserRepository userRepository;
    private final DebtLedgerRepository debtLedgerRepository;
    private final AuditLogService auditLogService;

    public NotificationService(
        AppNotificationRepository appNotificationRepository,
        UserRepository userRepository,
        DebtLedgerRepository debtLedgerRepository,
        AuditLogService auditLogService
    ) {
        this.appNotificationRepository = appNotificationRepository;
        this.userRepository = userRepository;
        this.debtLedgerRepository = debtLedgerRepository;
        this.auditLogService = auditLogService;
    }

    @Transactional
    public AppNotification sendDebtReminder(DebtReminderRequest request) {
        User user = userRepository.findById(request.userId())
            .orElseThrow(() -> new DomainException("USER_NOT_FOUND", "User not found: " + request.userId()));

        BigDecimal balance = debtLedgerRepository.getOutstandingBalance(user.getId());
        String body = request.message();
        if (body == null || body.isBlank()) {
            body = "Outstanding bike rental balance: THB " + balance + ". Please complete payment as soon as possible.";
        }

        AppNotification notification = new AppNotification();
        notification.setUser(user);
        notification.setType(NotificationType.DEBT_REMINDER);
        notification.setChannel(NotificationChannel.IN_APP);
        notification.setSubject("Bike Rental Debt Reminder");
        notification.setBody(body);
        notification.setStatus(NotificationStatus.SENT);
        notification.setSentAt(OffsetDateTime.now());

        AppNotification saved = appNotificationRepository.save(notification);

        auditLogService.log(
            null,
            "DEBT_REMINDER_SENT",
            "USER",
            String.valueOf(user.getId()),
            "Debt reminder sent to " + user.getUsername()
        );

        return saved;
    }
}
