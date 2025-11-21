package com.example.petclinic.controller;

import com.example.petclinic.dto.DoctorDTO;
import com.example.petclinic.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private DoctorRepository doctorRepository;

    @GetMapping("/doctors")
    public List<DoctorDTO> getAllDoctors() {
        return doctorRepository.findByActiveTrue().stream()
                .map(doctor -> new DoctorDTO(
                        doctor.getDoctorId(),
                        doctor.getUser().getId(),
                        doctor.getUser().getUsername(),
                        doctor.getSpecialization(),
                        doctor.getActive()
                ))
                .collect(Collectors.toList());
    }
}
