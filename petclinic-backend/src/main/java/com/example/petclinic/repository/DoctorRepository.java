package com.example.petclinic.repository;

import com.example.petclinic.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Optional<Doctor> findByUserId(Long userId);
    List<Doctor> findByActiveTrue();
    Optional<Doctor> findByDoctorIdAndActiveTrue(Long doctorId);
}
