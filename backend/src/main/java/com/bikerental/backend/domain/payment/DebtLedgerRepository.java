package com.bikerental.backend.domain.payment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;

public interface DebtLedgerRepository extends JpaRepository<DebtLedgerEntry, Long> {

    @Query("select coalesce(sum(d.amountDelta), 0) from DebtLedgerEntry d where d.user.id = :userId")
    BigDecimal getOutstandingBalance(Long userId);
}
