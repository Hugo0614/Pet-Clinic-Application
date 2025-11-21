package com.example.petclinic.repository;

import com.example.petclinic.model.MedicalRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {
    List<MedicalRecord> findByPetId(Long petId);
    
    @Query("SELECT MAX(mr.visitDate) FROM MedicalRecord mr WHERE mr.pet.id = :petId")
    Optional<LocalDate> findLastVisitDateByPetId(@Param("petId") Long petId);
}
