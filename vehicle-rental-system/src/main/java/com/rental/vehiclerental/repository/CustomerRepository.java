package com.rental.vehiclerental.repository;

import com.rental.vehiclerental.entity.Customer;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository
        extends JpaRepository<Customer, Long> {

}