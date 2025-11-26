-- Initial database setup for Pet Clinic
-- This file runs when MySQL container starts for the first time

CREATE DATABASE IF NOT EXISTS pet_clinic;
USE pet_clinic;

-- Tables will be created automatically by Spring Boot JPA (spring.jpa.hibernate.ddl-auto=update)
-- This file is here for any additional setup or seed data

-- You can add seed data here if needed:
-- Example:
-- INSERT INTO users (username, password, role, phone_number, identity_code) 
-- VALUES ('admin', '$2a$10$...', 'ADMIN', '1234567890', 'ADMIN001');

SET CHARACTER SET utf8mb4;
SET COLLATE utf8mb4_unicode_ci;
