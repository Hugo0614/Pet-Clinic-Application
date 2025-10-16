package com.example.petclinic.service;

import com.example.petclinic.model.Appointment;
import com.example.petclinic.model.Pet;
import com.example.petclinic.model.User;
import com.example.petclinic.repository.AppointmentRepository;
import com.example.petclinic.repository.PetRepository;
import com.example.petclinic.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AppointmentService {
    @Autowired
    private AppointmentRepository appointmentRepository;
    @Autowired
    private PetRepository petRepository;
    @Autowired
    private UserRepository userRepository;

    public Appointment createAppointment(Long petId, Long doctorId, LocalDateTime appointmentTime) {
        Pet pet = petRepository.findById(petId).orElseThrow();
        User doctor = userRepository.findById(doctorId).orElseThrow();
        // Check for scheduling conflicts
        List<Appointment> conflicts = appointmentRepository.findByDoctorId(doctorId).stream()
                .filter(a -> a.getAppointmentTime().equals(appointmentTime))
                .toList();
        if (!conflicts.isEmpty()) {
            throw new IllegalArgumentException("Doctor already has an appointment at this time.");
        }
        Appointment appointment = new Appointment();
        appointment.setPet(pet);
        appointment.setDoctor(doctor);
        appointment.setAppointmentTime(appointmentTime);
        appointment.setStatus("SCHEDULED");
        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getAppointmentsForOwner(String username) {
        User owner = userRepository.findByUsername(username).orElseThrow();
        List<Pet> pets = petRepository.findByOwnerId(owner.getId());
        return appointmentRepository.findAll().stream()
                .filter(a -> pets.stream().anyMatch(p -> p.getId().equals(a.getPet().getId())))
                .toList();
    }

    public List<Appointment> getAppointmentsForDoctor(Long doctorId, LocalDateTime start, LocalDateTime end) {
        return appointmentRepository.findByDoctorId(doctorId).stream()
                .filter(a -> !a.getAppointmentTime().isBefore(start) && !a.getAppointmentTime().isAfter(end))
                .toList();
    }
}
