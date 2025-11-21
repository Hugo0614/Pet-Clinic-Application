package com.example.petclinic.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record RegisterRequestDTO(
    @NotBlank String username,
    @NotBlank 
    @Pattern(regexp = "^(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]{8,16}$", 
             message = "Password must be 8-16 characters, contain at least one uppercase letter and one number")
    String password,
    @NotBlank String role,
    @NotBlank 
    @Pattern(regexp = "^[A-Z]\\d{3}$", 
             message = "Identity code must start with an uppercase letter followed by 3 digits")
    String identityCode,
    @NotBlank String phoneNumber
) {}
