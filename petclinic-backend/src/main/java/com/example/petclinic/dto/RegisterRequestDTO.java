package com.example.petclinic.dto;

import jakarta.validation.constraints.NotBlank;

public record RegisterRequestDTO(@NotBlank String username, @NotBlank String password, @NotBlank String role) {}
