package com.rental.vehiclerental.dto;

import java.math.BigDecimal;

public class DashboardStats {

    private long totalVehicles;
    private long availableVehicles;
    private long activeRentals;
    private long totalCustomers;
    private BigDecimal totalRevenue;

    public DashboardStats() {
    }

    public DashboardStats(long totalVehicles,
                          long availableVehicles,
                          long activeRentals,
                          long totalCustomers,
                          BigDecimal totalRevenue) {
        this.totalVehicles = totalVehicles;
        this.availableVehicles = availableVehicles;
        this.activeRentals = activeRentals;
        this.totalCustomers = totalCustomers;
        this.totalRevenue = totalRevenue;
    }

    public long getTotalVehicles() {
        return totalVehicles;
    }

    public void setTotalVehicles(long totalVehicles) {
        this.totalVehicles = totalVehicles;
    }

    public long getAvailableVehicles() {
        return availableVehicles;
    }

    public void setAvailableVehicles(long availableVehicles) {
        this.availableVehicles = availableVehicles;
    }

    public long getActiveRentals() {
        return activeRentals;
    }

    public void setActiveRentals(long activeRentals) {
        this.activeRentals = activeRentals;
    }

    public long getTotalCustomers() {
        return totalCustomers;
    }

    public void setTotalCustomers(long totalCustomers) {
        this.totalCustomers = totalCustomers;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }
}