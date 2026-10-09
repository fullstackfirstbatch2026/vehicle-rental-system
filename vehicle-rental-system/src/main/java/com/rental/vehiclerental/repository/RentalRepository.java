package com.rental.vehiclerental.repository;

import com.rental.vehiclerental.entity.Rental;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RentalRepository extends JpaRepository<Rental, Long> {

    // Rental details with customer and vehicle information
    @Query(value = """
        SELECT
            r.rental_id AS rentalId,
            c.customer_id AS customerId,
            c.full_name AS customerName,
            c.email AS email,
            c.phone AS phone,
            v.vehicle_id AS vehicleId,
            v.registration_number AS registrationNumber,
            v.make AS make,
            v.model AS model,
            v.vehicle_type AS vehicleType,
            r.start_date AS startDate,
            r.expected_return_date AS expectedReturnDate,
            r.actual_return_date AS actualReturnDate,
            r.total_amount AS totalAmount,
            r.status AS status
        FROM rentals r
        JOIN customers c
            ON r.customer_id = c.customer_id
        JOIN vehicles v
            ON r.vehicle_id = v.vehicle_id
        """, nativeQuery = true)
    List<Object[]> findRentalDetails();


    // Find vehicles rented more frequently than the average
    @Query(value = """
        SELECT
            v.vehicle_id AS vehicleId,
            v.registration_number AS registrationNumber,
            v.make AS make,
            v.model AS model,
            v.vehicle_type AS vehicleType,
            COUNT(r.rental_id) AS rentalCount
        FROM vehicles v
        JOIN rentals r
            ON v.vehicle_id = r.vehicle_id
        GROUP BY
            v.vehicle_id,
            v.registration_number,
            v.make,
            v.model,
            v.vehicle_type
        HAVING COUNT(r.rental_id) >
        (
            SELECT AVG(rental_count)
            FROM
            (
                SELECT
                    vehicle_id,
                    COUNT(*) AS rental_count
                FROM rentals
                GROUP BY vehicle_id
            ) AS rental_statistics
        )
        """, nativeQuery = true)
    List<Object[]> findFrequentlyRentedVehicles();


    // Count rentals by status
    long countByStatus(String status);
}