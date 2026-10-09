package com.rental.vehiclerental.repository;

import com.rental.vehiclerental.entity.Payment;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import org.springframework.data.jpa.repository.Query;
import java.math.BigDecimal;

public interface PaymentRepository
        extends JpaRepository<Payment, Long> {

    List<Payment> findByRentalId(Long rentalId);
    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.paymentStatus = 'PAID'")
    BigDecimal getTotalRevenue();
}