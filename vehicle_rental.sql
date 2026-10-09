CREATE DATABASE IF NOT EXISTS vehicle_rental;
USE vehicle_rental;

DROP TRIGGER IF EXISTS trg_rental_after_insert;
DROP TRIGGER IF EXISTS trg_rental_after_update;
DROP TRIGGER IF EXISTS trg_rental_after_delete;
DROP PROCEDURE IF EXISTS rent_vehicle;
DROP FUNCTION IF EXISTS calculate_rental_charges;

DROP TABLE IF EXISTS PAYMENTS;
DROP TABLE IF EXISTS RENTALS;
DROP TABLE IF EXISTS CUSTOMERS;
DROP TABLE IF EXISTS VEHICLES;

CREATE TABLE IF NOT EXISTS VEHICLES (
    vehicle_id INT PRIMARY KEY AUTO_INCREMENT,
    vehicle_number VARCHAR(20) NOT NULL UNIQUE,
    brand VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    vehicle_type VARCHAR(30) NOT NULL,
    rent_per_day DECIMAL(10,2) NOT NULL,
    availability BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS CUSTOMERS (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    address VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS RENTALS (
    rental_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    vehicle_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    status ENUM('RENTED','RETURNED') NOT NULL DEFAULT 'RENTED',
    CONSTRAINT fk_rental_customer FOREIGN KEY (customer_id) REFERENCES CUSTOMERS(customer_id) ON DELETE CASCADE,
    CONSTRAINT fk_rental_vehicle FOREIGN KEY (vehicle_id) REFERENCES VEHICLES(vehicle_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS PAYMENTS (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    rental_id INT NOT NULL,
    payment_date DATE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_mode VARCHAR(30) NOT NULL,
    CONSTRAINT fk_payment_rental FOREIGN KEY (rental_id)
        REFERENCES RENTALS(rental_id) ON DELETE CASCADE
);

DELIMITER $$

CREATE FUNCTION calculate_rental_charges(
    p_vehicle_id INT,
    p_start_date DATE,
    p_end_date DATE
)
RETURNS DECIMAL(10,2)
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_rate DECIMAL(10,2);
    DECLARE v_days INT;

    SELECT rent_per_day INTO v_rate
    FROM VEHICLES
    WHERE vehicle_id = p_vehicle_id;

    IF v_rate IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Vehicle not found';
    END IF;

    SET v_days = GREATEST(DATEDIFF(p_end_date, p_start_date), 1);
    RETURN v_days * v_rate;
END$$

CREATE PROCEDURE rent_vehicle(
    IN p_customer_id INT,
    IN p_vehicle_id INT,
    IN p_start_date DATE,
    IN p_end_date DATE,
    OUT p_rental_id INT
)
BEGIN
    DECLARE v_available BOOLEAN DEFAULT FALSE;
    DECLARE v_vehicle_found INT DEFAULT 0;
    DECLARE v_customer_found INT DEFAULT 0;
    DECLARE v_charge DECIMAL(10,2);

    SELECT COUNT(*) INTO v_customer_found
    FROM CUSTOMERS WHERE customer_id = p_customer_id;

    IF v_customer_found = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Customer not found';
    END IF;

    SELECT COUNT(*), COALESCE(MAX(availability), FALSE)
    INTO v_vehicle_found, v_available
    FROM VEHICLES
    WHERE vehicle_id = p_vehicle_id;

    IF v_vehicle_found = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Vehicle not found';
    END IF;

    IF v_available = FALSE THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Vehicle is currently rented';
    END IF;

    IF p_end_date < p_start_date THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'End date cannot be before start date';
    END IF;

    SET v_charge = calculate_rental_charges(p_vehicle_id, p_start_date, p_end_date);

    INSERT INTO RENTALS(customer_id, vehicle_id, start_date, end_date, total_amount, status)
    VALUES(p_customer_id, p_vehicle_id, p_start_date, p_end_date, v_charge, 'RENTED');

    SET p_rental_id = LAST_INSERT_ID();
END$$

CREATE TRIGGER trg_rental_after_insert
AFTER INSERT ON RENTALS
FOR EACH ROW
BEGIN
    IF NEW.status = 'RENTED' THEN
        UPDATE VEHICLES SET availability = FALSE
        WHERE vehicle_id = NEW.vehicle_id;
    END IF;
END$$

CREATE TRIGGER trg_rental_after_update
AFTER UPDATE ON RENTALS
FOR EACH ROW
BEGIN
    IF NEW.status = 'RETURNED' AND OLD.status <> 'RETURNED' THEN
        UPDATE VEHICLES SET availability = TRUE
        WHERE vehicle_id = NEW.vehicle_id;
    ELSEIF NEW.status = 'RENTED' AND OLD.status <> 'RENTED' THEN
        UPDATE VEHICLES SET availability = FALSE
        WHERE vehicle_id = NEW.vehicle_id;
    END IF;
END$$

CREATE TRIGGER trg_rental_after_delete
AFTER DELETE ON RENTALS
FOR EACH ROW
BEGIN
    UPDATE VEHICLES SET availability = TRUE
    WHERE vehicle_id = OLD.vehicle_id;
END$$

DELIMITER ;

-- 1. Insert 10 Sample Vehicles
INSERT INTO VEHICLES(vehicle_id, vehicle_number, brand, model, vehicle_type, rent_per_day, availability) VALUES
(1, 'TN01AB1234', 'Toyota', 'Innova Crysta', 'SUV', 2800.00, TRUE),
(2, 'TN02CD5678', 'Hyundai', 'Creta', 'SUV', 2200.00, TRUE),
(3, 'TN03EF9012', 'Honda', 'City', 'Sedan', 1900.00, TRUE),
(4, 'TN04GH3456', 'Maruti', 'Baleno', 'Hatchback', 1400.00, TRUE),
(5, 'TN05JK7890', 'Kia', 'Seltos', 'SUV', 2400.00, TRUE),
(6, 'TN06LM2468', 'Tata', 'Nexon', 'SUV', 1700.00, TRUE),
(7, 'TN07NP1357', 'Mahindra', 'Thar', 'SUV', 2600.00, TRUE),
(8, 'TN08RS2468', 'Skoda', 'Slavia', 'Sedan', 2100.00, TRUE),
(9, 'TN09TU3579', 'BMW', '3 Series', 'Luxury', 5500.00, TRUE),
(10, 'TN10VW4680', 'Toyota', 'Commuter', 'Van', 3800.00, TRUE);

-- 2. Insert 8 Sample Customers
INSERT INTO CUSTOMERS(customer_id, name, email, phone, address) VALUES
(1, 'Arun Kumar', 'arun.kumar@example.com', '9876543210', 'Chennai'),
(2, 'Meera Raj', 'meera.raj@example.com', '9876501234', 'Coimbatore'),
(3, 'Vikram S', 'vikram.s@example.com', '9845012345', 'Bengaluru'),
(4, 'Nisha Devi', 'nisha.devi@example.com', '9791012345', 'Chennai'),
(5, 'Karthik Raman', 'karthik.r@example.com', '9884012345', 'Madurai'),
(6, 'Ananya Iyer', 'ananya.i@example.com', '9789012345', 'Trichy'),
(7, 'Rahul Verma', 'rahul.v@example.com', '9840123456', 'Chennai'),
(8, 'Divya Krishnan', 'divya.k@example.com', '9884567890', 'Salem');

-- 3. Insert 15 Sample Rentals (12 completed, 3 currently rented)
INSERT INTO RENTALS(rental_id, customer_id, vehicle_id, start_date, end_date, total_amount, status) VALUES
(1, 1, 1, '2026-09-01', '2026-09-04', 8400.00, 'RETURNED'),
(2, 2, 2, '2026-09-03', '2026-09-05', 4400.00, 'RETURNED'),
(3, 3, 3, '2026-09-05', '2026-09-08', 5700.00, 'RETURNED'),
(4, 4, 4, '2026-09-08', '2026-09-10', 2800.00, 'RETURNED'),
(5, 5, 5, '2026-09-10', '2026-09-13', 7200.00, 'RETURNED'),
(6, 6, 6, '2026-09-12', '2026-09-15', 5100.00, 'RETURNED'),
(7, 7, 1, '2026-09-16', '2026-09-19', 8400.00, 'RETURNED'),
(8, 8, 3, '2026-09-18', '2026-09-20', 3800.00, 'RETURNED'),
(9, 1, 6, '2026-09-21', '2026-09-24', 5100.00, 'RETURNED'),
(10, 2, 2, '2026-09-25', '2026-09-27', 4400.00, 'RETURNED'),
(11, 3, 3, '2026-09-27', '2026-09-30', 5700.00, 'RETURNED'),
(12, 4, 6, '2026-09-29', '2026-10-02', 5100.00, 'RETURNED'),
(13, 5, 1, '2026-10-03', '2026-10-07', 11200.00, 'RENTED'),
(14, 6, 5, '2026-10-04', '2026-10-08', 9600.00, 'RENTED'),
(15, 7, 7, '2026-10-04', '2026-10-06', 5200.00, 'RENTED');

-- Ensure availability is correctly set according to current rentals (vehicle 1, 5, 7 are RENTED)
UPDATE VEHICLES SET availability = FALSE WHERE vehicle_id IN (1, 5, 7);
UPDATE VEHICLES SET availability = TRUE WHERE vehicle_id NOT IN (1, 5, 7);

-- 4. Insert 15 Sample Payments matching the 15 rentals
INSERT INTO PAYMENTS(payment_id, rental_id, payment_date, amount, payment_mode) VALUES
(1, 1, '2026-09-01', 8400.00, 'UPI'),
(2, 2, '2026-09-03', 4400.00, 'CARD'),
(3, 3, '2026-09-05', 5700.00, 'CASH'),
(4, 4, '2026-09-08', 2800.00, 'UPI'),
(5, 5, '2026-09-10', 7200.00, 'CARD'),
(6, 6, '2026-09-12', 5100.00, 'UPI'),
(7, 7, '2026-09-16', 8400.00, 'CASH'),
(8, 8, '2026-09-18', 3800.00, 'CARD'),
(9, 9, '2026-09-21', 5100.00, 'UPI'),
(10, 10, '2026-09-25', 4400.00, 'CARD'),
(11, 11, '2026-09-27', 5700.00, 'UPI'),
(12, 12, '2026-09-29', 5100.00, 'CASH'),
(13, 13, '2026-10-03', 11200.00, 'UPI'),
(14, 14, '2026-10-04', 9600.00, 'CARD'),
(15, 15, '2026-10-04', 5200.00, 'UPI');

-- Reset Auto-Increment pointers
ALTER TABLE VEHICLES AUTO_INCREMENT = 11;
ALTER TABLE CUSTOMERS AUTO_INCREMENT = 9;
ALTER TABLE RENTALS AUTO_INCREMENT = 16;
ALTER TABLE PAYMENTS AUTO_INCREMENT = 16;

-- Required JOIN Test Query
SELECT r.rental_id, c.name AS customer_name, c.phone,
       v.vehicle_number, CONCAT(v.brand,' ',v.model) AS vehicle,
       v.vehicle_type, r.start_date, r.end_date,
       r.total_amount, r.status
FROM RENTALS r
JOIN CUSTOMERS c ON c.customer_id = r.customer_id
JOIN VEHICLES v ON v.vehicle_id = r.vehicle_id
ORDER BY r.rental_id DESC;

-- Required Subquery Test Query
SELECT v.vehicle_id, v.vehicle_number,
       CONCAT(v.brand,' ',v.model) AS vehicle,
       COUNT(r.rental_id) AS rental_count
FROM VEHICLES v
JOIN RENTALS r ON r.vehicle_id = v.vehicle_id
GROUP BY v.vehicle_id, v.vehicle_number, v.brand, v.model
HAVING COUNT(r.rental_id) > (
    SELECT AVG(rental_count)
    FROM (
        SELECT vehicle_id, COUNT(*) AS rental_count
        FROM RENTALS
        GROUP BY vehicle_id
    ) counts
)
ORDER BY rental_count DESC;
