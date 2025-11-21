package com.example.petclinic.dto;

public record DoctorDTO(
    Long doctorId,
    Long userId,
    String username,
    String specialization,
    Boolean active
) {}
