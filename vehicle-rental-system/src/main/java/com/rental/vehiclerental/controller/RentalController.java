package com.rental.vehiclerental.controller;

import com.rental.vehiclerental.dto.RentVehicleRequest;
import com.rental.vehiclerental.entity.Rental;
import com.rental.vehiclerental.service.RentalService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rentals")
@CrossOrigin(origins = "http://localhost:5173")
public class RentalController {

    private final RentalService rentalService;

    public RentalController(RentalService rentalService) {
        this.rentalService = rentalService;
    }

    // Rent a vehicle
    @PostMapping("/rent")
    public ResponseEntity<Rental> rentVehicle(
            @RequestBody RentVehicleRequest request) {

        Rental rental = rentalService.rentVehicle(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(rental);
    }

    // Return a vehicle
    @PutMapping("/{id}/return")
    public ResponseEntity<Rental> returnVehicle(
            @PathVariable Long id) {

        Rental rental = rentalService.returnVehicle(id);

        return ResponseEntity.ok(rental);
    }

    // Get all rentals
    @GetMapping
    public ResponseEntity<List<Rental>> getAllRentals() {

        return ResponseEntity.ok(
                rentalService.getAllRentals()
        );
    }

    // Get rental details with customer and vehicle information
    @GetMapping("/details")
    public ResponseEntity<List<Object[]>> getRentalDetails() {

        return ResponseEntity.ok(
                rentalService.getRentalDetails()
        );
    }

    // Get frequently rented vehicles
    @GetMapping("/frequent-vehicles")
    public ResponseEntity<List<Object[]>> getFrequentlyRentedVehicles() {

        return ResponseEntity.ok(
                rentalService.getFrequentlyRentedVehicles()
        );
    }
}