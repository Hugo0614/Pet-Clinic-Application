package com.example.petclinic.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public record AppointmentDTO(
    Long id,
    String appointmentCode,
    @NotNull LocalDateTime appointmentTime,
    @NotNull Long petId,
    @NotNull Long doctorId,
    String status,
    String petName,
    String doctorName
) {}
