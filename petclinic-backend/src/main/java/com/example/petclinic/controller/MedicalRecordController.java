package com.example.petclinic.controller;

import com.example.petclinic.dto.MedicalRecordDTO;
import com.example.petclinic.model.MedicalRecord;
import com.example.petclinic.repository.MedicalRecordRepository;
import com.example.petclinic.repository.PetRepository;
import com.example.petclinic.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/medical-records")
public class MedicalRecordController {
    @Autowired
    private MedicalRecordRepository medicalRecordRepository;
    @Autowired
    private PetRepository petRepository;
    @Autowired
    private AppointmentRepository appointmentRepository;

    @PreAuthorize("hasAuthority('DOCTOR')")
    @PostMapping
    public MedicalRecordDTO addMedicalRecord(@Validated @RequestBody MedicalRecordDTO dto, @AuthenticationPrincipal UserDetails userDetails) {
        MedicalRecord record = new MedicalRecord();
        record.setVisitDate(dto.visitDate());
        record.setDiagnosis(dto.diagnosis());
        record.setPrescription(dto.prescription());
        record.setPet(petRepository.findById(dto.petId()).orElseThrow());
        record.setAppointment(appointmentRepository.findById(dto.appointmentId()).orElseThrow());
        MedicalRecord saved = medicalRecordRepository.save(record);
        return new MedicalRecordDTO(saved.getId(), saved.getVisitDate(), saved.getDiagnosis(), saved.getPrescription(), saved.getPet().getId(), saved.getAppointment().getId());
    }

    @PreAuthorize("hasAuthority('DOCTOR')")
    @GetMapping("/pet/{petId}")
    public List<MedicalRecordDTO> getMedicalRecordsForPet(@PathVariable Long petId) {
        return medicalRecordRepository.findByPetId(petId).stream()
                .map(r -> new MedicalRecordDTO(r.getId(), r.getVisitDate(), r.getDiagnosis(), r.getPrescription(), r.getPet().getId(), r.getAppointment().getId()))
                .collect(Collectors.toList());
    }
}
