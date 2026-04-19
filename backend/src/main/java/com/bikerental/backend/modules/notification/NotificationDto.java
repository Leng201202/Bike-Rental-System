package com.bikerental.backend.modules.notification;

import com.bikerental.backend.domain.notification.AppNotification;

import java.time.OffsetDateTime;

public record NotificationDto(
    Long id,
    Long userId,
    String type,
    String channel,
    String subject,
    String body,
    String status,
    OffsetDateTime sentAt
) {

    public static NotificationDto from(AppNotification notification) {
        return new NotificationDto(
            notification.getId(),
            notification.getUser().getId(),
            notification.getType().name(),
            notification.getChannel().name(),
            notification.getSubject(),
            notification.getBody(),
            notification.getStatus().name(),
            notification.getSentAt()
        );
    }
}
