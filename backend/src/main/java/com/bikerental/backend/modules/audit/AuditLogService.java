package com.bikerental.backend.modules.audit;

import com.bikerental.backend.domain.audit.AuditLog;
import com.bikerental.backend.domain.audit.AuditLogRepository;
import com.bikerental.backend.domain.user.User;
import com.bikerental.backend.domain.user.UserRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;

    public AuditLogService(AuditLogRepository auditLogRepository, UserRepository userRepository) {
        this.auditLogRepository = auditLogRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public void log(Long actorUserId, String action, String targetType, String targetId, String detail) {
        AuditLog log = new AuditLog();
        if (actorUserId != null) {
            User actor = userRepository.findById(actorUserId).orElse(null);
            log.setActorUser(actor);
        }
        log.setAction(action);
        log.setTargetType(targetType);
        log.setTargetId(targetId);
        log.setDetail(detail);
        auditLogRepository.save(log);
    }

    @Transactional(readOnly = true)
    public List<AuditLog> listRecent(int requestedLimit) {
        int safeLimit = Math.max(1, Math.min(requestedLimit, 500));
        return auditLogRepository.findAll(PageRequest.of(0, safeLimit, Sort.by(Sort.Direction.DESC, "createdAt"))).getContent();
    }
}
