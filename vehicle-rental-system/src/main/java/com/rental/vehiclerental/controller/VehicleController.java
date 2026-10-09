package com.rental.vehiclerental.controller;

import com.rental.vehiclerental.entity.Vehicle;
import com.rental.vehiclerental.repository.VehicleRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@CrossOrigin(origins = "http://localhost:5173")
public class VehicleController {

    private final VehicleRepository vehicleRepository;

    public VehicleController(
            VehicleRepository vehicleRepository) {

        this.vehicleRepository = vehicleRepository;
    }


    @GetMapping
    public List<Vehicle> getAllVehicles() {

        return vehicleRepository.findAll();
    }


    @GetMapping("/{id}")
    public Vehicle getVehicle(
            @PathVariable Long id) {

        return vehicleRepository.findById(id)
                .orElseThrow(() ->
                    new RuntimeException(
                        "Vehicle not found"));
    }


    @GetMapping("/available")
    public List<Vehicle> getAvailableVehicles() {

        return vehicleRepository
                .findByStatus("AVAILABLE");
    }
}
