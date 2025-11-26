package com.example.petclinic.controller;

import com.example.petclinic.dto.AppointmentDTO;
import com.example.petclinic.model.Appointment;
import com.example.petclinic.model.Doctor;
import com.example.petclinic.model.User;
import com.example.petclinic.repository.DoctorRepository;
import com.example.petclinic.repository.UserRepository;
import com.example.petclinic.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {
    @Autowired
    private AppointmentService appointmentService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private DoctorRepository doctorRepository;

    @PostMapping
    public AppointmentDTO createAppointment(@Validated @RequestBody AppointmentDTO appointmentDTO, @AuthenticationPrincipal UserDetails userDetails) {
        Appointment appointment = appointmentService.createAppointment(
                appointmentDTO.petId(),
                appointmentDTO.doctorId(),
                appointmentDTO.appointmentTime()
        );
        return new AppointmentDTO(
                appointment.getId(),
                appointment.getAppointmentCode(),
                appointment.getAppointmentTime(),
                appointment.getPet().getId(),
                appointment.getDoctor().getDoctorId(),
                appointment.getStatus(),
                appointment.getPet().getName(),
                appointment.getDoctor().getUser().getUsername()
        );
    }

    @GetMapping
    public List<AppointmentDTO> getAppointments(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername()).orElseThrow();
        if ("OWNER".equals(user.getRole())) {
            return appointmentService.getAppointmentsForOwner(userDetails.getUsername()).stream()
                    .map(a -> new AppointmentDTO(
                            a.getId(),
                            a.getAppointmentCode(),
                            a.getAppointmentTime(),
                            a.getPet().getId(),
                            a.getDoctor().getDoctorId(),
                            a.getStatus(),
                            a.getPet().getName(),
                            a.getDoctor().getUser().getUsername()
                    ))
                    .collect(Collectors.toList());
        } else if ("DOCTOR".equals(user.getRole())) {
            // Get the doctor record for this user
            Doctor doctor = doctorRepository.findByUserId(user.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Doctor record not found for user"));
            
            // Show all upcoming appointments (from now onwards) instead of just today
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime farFuture = LocalDateTime.now().plusYears(1); // Next year
            return appointmentService.getAppointmentsForDoctor(doctor.getDoctorId(), now, farFuture).stream()
                    .map(a -> new AppointmentDTO(
                            a.getId(),
                            a.getAppointmentCode(),
                            a.getAppointmentTime(),
                            a.getPet().getId(),
                            a.getDoctor().getDoctorId(),
                            a.getStatus(),
                            a.getPet().getName(),
                            a.getDoctor().getUser().getUsername()
                    ))
                    .collect(Collectors.toList());
        }
        return List.of();
    }

    @PutMapping("/{id}")
    public AppointmentDTO updateAppointment(
            @PathVariable Long id,
            @Validated @RequestBody AppointmentDTO appointmentDTO,
            @AuthenticationPrincipal UserDetails userDetails) {
        Appointment appointment = appointmentService.updateAppointment(
                id,
                appointmentDTO.petId(),
                appointmentDTO.doctorId(),
                appointmentDTO.appointmentTime()
        );
        return new AppointmentDTO(
                appointment.getId(),
                appointment.getAppointmentCode(),
                appointment.getAppointmentTime(),
                appointment.getPet().getId(),
                appointment.getDoctor().getDoctorId(),
                appointment.getStatus(),
                appointment.getPet().getName(),
                appointment.getDoctor().getUser().getUsername()
        );
    }

    @DeleteMapping("/{id}")
    public void deleteAppointment(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        appointmentService.deleteAppointment(id, userDetails.getUsername());
    }
}
