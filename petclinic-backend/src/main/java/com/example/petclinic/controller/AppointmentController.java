package com.example.petclinic.controller;

import com.example.petclinic.dto.AppointmentDTO;
import com.example.petclinic.model.Appointment;
import com.example.petclinic.model.User;
import com.example.petclinic.repository.UserRepository;
import com.example.petclinic.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {
    @Autowired
    private AppointmentService appointmentService;
    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public AppointmentDTO createAppointment(@Validated @RequestBody AppointmentDTO appointmentDTO, @AuthenticationPrincipal UserDetails userDetails) {
        Appointment appointment = appointmentService.createAppointment(
                appointmentDTO.petId(),
                appointmentDTO.doctorId(),
                appointmentDTO.appointmentTime()
        );
        return new AppointmentDTO(appointment.getId(), appointment.getAppointmentTime(), appointment.getPet().getId(), appointment.getDoctor().getId(), appointment.getStatus());
    }

    @GetMapping
    public List<AppointmentDTO> getAppointments(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername()).orElseThrow();
        if ("OWNER".equals(user.getRole())) {
            return appointmentService.getAppointmentsForOwner(userDetails.getUsername()).stream()
                    .map(a -> new AppointmentDTO(a.getId(), a.getAppointmentTime(), a.getPet().getId(), a.getDoctor().getId(), a.getStatus()))
                    .collect(Collectors.toList());
        } else if ("DOCTOR".equals(user.getRole())) {
            LocalDateTime startOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MIN);
            LocalDateTime endOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MAX);
            return appointmentService.getAppointmentsForDoctor(user.getId(), startOfDay, endOfDay).stream()
                    .map(a -> new AppointmentDTO(a.getId(), a.getAppointmentTime(), a.getPet().getId(), a.getDoctor().getId(), a.getStatus()))
                    .collect(Collectors.toList());
        }
        return List.of();
    }
}
