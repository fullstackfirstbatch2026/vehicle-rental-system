package com.rental.vehiclerental.service;

import com.rental.vehiclerental.dto.DashboardStats;
import com.rental.vehiclerental.repository.CustomerRepository;
import com.rental.vehiclerental.repository.PaymentRepository;
import com.rental.vehiclerental.repository.RentalRepository;
import com.rental.vehiclerental.repository.VehicleRepository;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class DashboardService {

    private final VehicleRepository vehicleRepository;
    private final CustomerRepository customerRepository;
    private final RentalRepository rentalRepository;
    private final PaymentRepository paymentRepository;

    public DashboardService(
            VehicleRepository vehicleRepository,
            CustomerRepository customerRepository,
            RentalRepository rentalRepository,
            PaymentRepository paymentRepository) {

        this.vehicleRepository = vehicleRepository;
        this.customerRepository = customerRepository;
        this.rentalRepository = rentalRepository;
        this.paymentRepository = paymentRepository;
    }

    public DashboardStats getDashboardStats() {

        long totalVehicles = vehicleRepository.count();

        long availableVehicles =
                vehicleRepository.findByStatus("AVAILABLE").size();

        long activeRentals =
                rentalRepository.countByStatus("ACTIVE");

        long totalCustomers =
                customerRepository.count();

        BigDecimal totalRevenue =
                paymentRepository.getTotalRevenue();

        return new DashboardStats(
                totalVehicles,
                availableVehicles,
                activeRentals,
                totalCustomers,
                totalRevenue
        );
    }
}