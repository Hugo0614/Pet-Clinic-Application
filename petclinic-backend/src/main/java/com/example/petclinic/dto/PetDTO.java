package com.example.petclinic.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record PetDTO(
    Long id,
    @NotBlank String name,
    @NotBlank String species,
    @NotBlank String breed,
    @NotNull LocalDate birthDate,
    LocalDate lastVisitDate
) {}
