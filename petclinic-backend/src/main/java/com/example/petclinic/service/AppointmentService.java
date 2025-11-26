package com.example.petclinic.service;

import com.example.petclinic.model.Appointment;
import com.example.petclinic.model.Doctor;
import com.example.petclinic.model.Pet;
import com.example.petclinic.model.User;
import com.example.petclinic.repository.AppointmentRepository;
import com.example.petclinic.repository.DoctorRepository;
import com.example.petclinic.repository.PetRepository;
import com.example.petclinic.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class AppointmentService {
    @Autowired
    private AppointmentRepository appointmentRepository;
    @Autowired
    private PetRepository petRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private DoctorRepository doctorRepository;

    /**
     * Generate appointment code in format: APT-YYYYMMDD-DXXX-XXX
     * Example: APT-20251122-D001-001
     */
    private String generateAppointmentCode(Long doctorId, LocalDateTime appointmentTime) {
        LocalDate date = appointmentTime.toLocalDate();
        String dateStr = date.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String doctorStr = String.format("D%03d", doctorId);
        
        // Get count of appointments for this doctor on this date
        long count = appointmentRepository.findByDoctorDoctorId(doctorId).stream()
                .filter(a -> a.getAppointmentTime().toLocalDate().equals(date))
                .count();
        
        String sequenceStr = String.format("%03d", count + 1);
        
        return String.format("APT-%s-%s-%s", dateStr, doctorStr, sequenceStr);
    }

    public Appointment createAppointment(Long petId, Long doctorId, LocalDateTime appointmentTime) {
        Pet pet = petRepository.findById(petId).orElseThrow(() -> 
            new IllegalArgumentException("Pet not found"));
        
        // Find doctor by ID
        Doctor doctor = doctorRepository.findById(doctorId).orElseThrow(() -> 
            new IllegalArgumentException("Doctor not found"));
        
        if (!doctor.isActive()) {
            throw new IllegalArgumentException("Doctor is not active");
        }
        
        // Check for scheduling conflicts (doctor-specific)
        List<Appointment> conflicts = appointmentRepository.findByDoctorDoctorId(doctorId).stream()
                .filter(a -> a.getAppointmentTime().equals(appointmentTime))
                .toList();
        
        if (!conflicts.isEmpty()) {
            throw new IllegalArgumentException("该时间段此医生已被预约 (Time slot unavailable for this doctor)");
        }
        
        Appointment appointment = new Appointment();
        appointment.setPet(pet);
        appointment.setDoctor(doctor);
        appointment.setAppointmentTime(appointmentTime);
        appointment.setStatus("SCHEDULED");
        appointment.setAppointmentCode(generateAppointmentCode(doctorId, appointmentTime));
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
        return appointmentRepository.findByDoctorDoctorId(doctorId).stream()
                .filter(a -> !a.getAppointmentTime().isBefore(start) && !a.getAppointmentTime().isAfter(end))
                .toList();
    }

    public Appointment updateAppointment(Long appointmentId, Long petId, Long doctorId, LocalDateTime appointmentTime) {
        // Find the existing appointment
        Appointment existingAppointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new IllegalArgumentException("Appointment not found"));
        
        // Validate pet exists
        Pet pet = petRepository.findById(petId).orElseThrow(() -> 
            new IllegalArgumentException("Pet not found"));
        
        // Find doctor by ID
        Doctor doctor = doctorRepository.findById(doctorId).orElseThrow(() -> 
            new IllegalArgumentException("Doctor not found"));
        
        if (!doctor.isActive()) {
            throw new IllegalArgumentException("Doctor is not active");
        }
        
        // Check for scheduling conflicts (doctor-specific), excluding current appointment
        List<Appointment> conflicts = appointmentRepository.findByDoctorDoctorId(doctorId).stream()
                .filter(a -> !a.getId().equals(appointmentId)) // Exclude current appointment
                .filter(a -> a.getAppointmentTime().equals(appointmentTime))
                .toList();
        
        if (!conflicts.isEmpty()) {
            throw new IllegalArgumentException("该时间段此医生已被预约 (Time slot unavailable for this doctor)");
        }
        
        // Update the appointment
        existingAppointment.setPet(pet);
        existingAppointment.setDoctor(doctor);
        existingAppointment.setAppointmentTime(appointmentTime);
        
        // Regenerate appointment code if doctor or date changed
        if (!existingAppointment.getDoctor().getDoctorId().equals(doctorId) ||
            !existingAppointment.getAppointmentTime().toLocalDate().equals(appointmentTime.toLocalDate())) {
            existingAppointment.setAppointmentCode(generateAppointmentCode(doctorId, appointmentTime));
        }
        
        return appointmentRepository.save(existingAppointment);
    }

    public void deleteAppointment(Long appointmentId, String ownerUsername) {
        // Find the appointment
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new IllegalArgumentException("Appointment not found"));
        
        // Verify ownership: Check if the appointment belongs to one of the owner's pets
        User owner = userRepository.findByUsername(ownerUsername).orElseThrow();
        List<Pet> ownerPets = petRepository.findByOwnerId(owner.getId());
        
        boolean isOwner = ownerPets.stream()
                .anyMatch(pet -> pet.getId().equals(appointment.getPet().getId()));
        
        if (!isOwner) {
            throw new IllegalArgumentException("Unauthorized: You can only delete your own appointments");
        }
        
        appointmentRepository.delete(appointment);
    }
}
