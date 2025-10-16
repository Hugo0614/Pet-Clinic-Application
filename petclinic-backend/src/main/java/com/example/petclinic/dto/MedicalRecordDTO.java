package com.example.petclinic.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record MedicalRecordDTO(
    Long id,
    @NotNull LocalDate visitDate,
    @NotBlank String diagnosis,
    @NotBlank String prescription,
    @NotNull Long petId,
    @NotNull Long appointmentId
) {}
