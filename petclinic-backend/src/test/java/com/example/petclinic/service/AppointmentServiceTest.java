package com.example.petclinic.service;

import com.example.petclinic.model.Appointment;
import com.example.petclinic.model.Doctor;
import com.example.petclinic.model.Pet;
import com.example.petclinic.model.User;
import com.example.petclinic.repository.AppointmentRepository;
import com.example.petclinic.repository.DoctorRepository;
import com.example.petclinic.repository.PetRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AppointmentServiceTest {

    @Mock
    private AppointmentRepository appointmentRepository;

    @Mock
    private PetRepository petRepository;

    @Mock
    private DoctorRepository doctorRepository;

    @InjectMocks
    private AppointmentService appointmentService;

    private Pet testPet;
    private Doctor testDoctor;
    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("test_owner");
        testUser.setRole("OWNER");

        testPet = new Pet();
        testPet.setId(1L);
        testPet.setName("Buddy");
        testPet.setSpecies("Dog");
        testPet.setOwner(testUser);

        testDoctor = new Doctor();
        testDoctor.setDoctorId(1L);
        testDoctor.setUser(testUser);
        testDoctor.setSpecialization("General");
        testDoctor.setActive(true);
    }

    @Test
    void testCreateAppointment_Success() {
        // Arrange
        LocalDateTime appointmentTime = LocalDateTime.now().plusDays(1);
        when(petRepository.findById(1L)).thenReturn(Optional.of(testPet));
        when(doctorRepository.findById(1L)).thenReturn(Optional.of(testDoctor));
        
        Appointment savedAppointment = new Appointment();
        savedAppointment.setId(1L);
        savedAppointment.setPet(testPet);
        savedAppointment.setDoctor(testDoctor);
        savedAppointment.setAppointmentTime(appointmentTime);
        savedAppointment.setStatus("SCHEDULED");
        savedAppointment.setAppointmentCode("APT-001");
        
        when(appointmentRepository.save(any(Appointment.class))).thenReturn(savedAppointment);

        // Act
        Appointment result = appointmentService.createAppointment(1L, 1L, appointmentTime);

        // Assert
        assertNotNull(result);
        assertEquals("SCHEDULED", result.getStatus());
        assertEquals(testPet, result.getPet());
        assertEquals(testDoctor, result.getDoctor());
        verify(appointmentRepository, times(1)).save(any(Appointment.class));
    }

    @Test
    void testCreateAppointment_PetNotFound() {
        // Arrange
        LocalDateTime appointmentTime = LocalDateTime.now().plusDays(1);
        when(petRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            appointmentService.createAppointment(999L, 1L, appointmentTime);
        });
        verify(appointmentRepository, never()).save(any(Appointment.class));
    }

    @Test
    void testCreateAppointment_DoctorNotFound() {
        // Arrange
        LocalDateTime appointmentTime = LocalDateTime.now().plusDays(1);
        when(petRepository.findById(1L)).thenReturn(Optional.of(testPet));
        when(doctorRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            appointmentService.createAppointment(1L, 999L, appointmentTime);
        });
        verify(appointmentRepository, never()).save(any(Appointment.class));
    }
}
