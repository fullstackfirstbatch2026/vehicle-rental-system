package com.rental.vehiclerental.service;

import java.util.List;
import com.rental.vehiclerental.dto.RentVehicleRequest;
import com.rental.vehiclerental.entity.Rental;
import com.rental.vehiclerental.repository.CustomerRepository;
import com.rental.vehiclerental.repository.RentalRepository;
import com.rental.vehiclerental.repository.VehicleRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.ParameterMode;
import jakarta.persistence.StoredProcedureQuery;

import org.springframework.stereotype.Service;

@Service
public class RentalService {

    private final EntityManager entityManager;
    private final RentalRepository rentalRepository;
    private final VehicleRepository vehicleRepository;
    private final CustomerRepository customerRepository;

    public RentalService(
            EntityManager entityManager,
            RentalRepository rentalRepository,
            VehicleRepository vehicleRepository,
            CustomerRepository customerRepository) {

        this.entityManager = entityManager;
        this.rentalRepository = rentalRepository;
        this.vehicleRepository = vehicleRepository;
        this.customerRepository = customerRepository;
    }

    public Rental rentVehicle(RentVehicleRequest request) {

        // Check vehicle
        if (!vehicleRepository.existsById(request.getVehicleId())) {
            throw new RuntimeException("Vehicle not found");
        }

        // Check customer
        if (!customerRepository.existsById(request.getCustomerId())) {
            throw new RuntimeException("Customer not found");
        }

        // Check dates
        if (request.getStartDate() == null ||
            request.getEndDate() == null) {

            throw new RuntimeException("Start date and end date are required");
        }

        if (!request.getEndDate().isAfter(request.getStartDate())) {
            throw new RuntimeException(
                    "End date must be after start date");
        }

        try {

            StoredProcedureQuery query =
                    entityManager.createStoredProcedureQuery("rent_vehicle");

            query.registerStoredProcedureParameter(
                    "p_vehicle_id",
                    Long.class,
                    ParameterMode.IN);

            query.registerStoredProcedureParameter(
                    "p_customer_id",
                    Long.class,
                    ParameterMode.IN);

            query.registerStoredProcedureParameter(
                    "p_start_date",
                    java.sql.Date.class,
                    ParameterMode.IN);

            query.registerStoredProcedureParameter(
                    "p_end_date",
                    java.sql.Date.class,
                    ParameterMode.IN);

            query.registerStoredProcedureParameter(
                    "p_rental_id",
                    Long.class,
                    ParameterMode.OUT);

            query.setParameter(
                    "p_vehicle_id",
                    request.getVehicleId());

            query.setParameter(
                    "p_customer_id",
                    request.getCustomerId());

            query.setParameter(
                    "p_start_date",
                    java.sql.Date.valueOf(request.getStartDate()));

            query.setParameter(
                    "p_end_date",
                    java.sql.Date.valueOf(request.getEndDate()));

            query.execute();

            Long rentalId =
                    ((Number) query.getOutputParameterValue(
                            "p_rental_id")).longValue();

            return rentalRepository.findById(rentalId)
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Rental created but could not be found"));

        } catch (Exception e) {

            throw new RuntimeException(
                    "Unable to rent vehicle: " + e.getMessage(), e);
        }
    }
    public Rental returnVehicle(Long rentalId) {

        Rental rental = rentalRepository.findById(rentalId)
                .orElseThrow(() ->
                        new RuntimeException("Rental not found"));

        if (!"ACTIVE".equals(rental.getStatus())) {
            throw new RuntimeException(
                    "Rental is not currently active");
        }

        rental.setStatus("RETURNED");
        rental.setActualReturnDate(
                java.time.LocalDate.now());

        return rentalRepository.save(rental);
    }
    public List<Object[]> getRentalDetails() {

        return rentalRepository.findRentalDetails();
    }
    public List<Object[]> getFrequentlyRentedVehicles() {

        return rentalRepository.findFrequentlyRentedVehicles();
    }
    public List<Rental> getAllRentals() {
        return rentalRepository.findAll();
    }
}