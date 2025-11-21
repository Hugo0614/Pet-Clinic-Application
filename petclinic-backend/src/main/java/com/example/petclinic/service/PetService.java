package com.example.petclinic.service;

import com.example.petclinic.dto.PetDTO;
import com.example.petclinic.model.Pet;
import com.example.petclinic.model.User;
import com.example.petclinic.repository.MedicalRecordRepository;
import com.example.petclinic.repository.PetRepository;
import com.example.petclinic.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PetService {
    @Autowired
    private PetRepository petRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    public Pet addPet(Pet pet, String username) {
        User owner = userRepository.findByUsername(username).orElseThrow();
        pet.setOwner(owner);
        return petRepository.save(pet);
    }

    public List<PetDTO> getPetsForOwner(String username) {
        User owner = userRepository.findByUsername(username).orElseThrow();
        List<Pet> pets = petRepository.findByOwnerId(owner.getId());
        return pets.stream()
                .map(this::convertToPetDTO)
                .collect(Collectors.toList());
    }

    public Optional<Pet> getPetByIdForOwner(Long petId, String username) {
        User owner = userRepository.findByUsername(username).orElseThrow();
        Optional<Pet> pet = petRepository.findById(petId);
        if (pet.isPresent() && pet.get().getOwner().getId().equals(owner.getId())) {
            return pet;
        }
        return Optional.empty();
    }
    
    private PetDTO convertToPetDTO(Pet pet) {
        LocalDate lastVisitDate = medicalRecordRepository
                .findLastVisitDateByPetId(pet.getId())
                .orElse(null);
        return new PetDTO(
                pet.getId(),
                pet.getName(),
                pet.getSpecies(),
                pet.getBreed(),
                pet.getBirthDate(),
                lastVisitDate
        );
    }
}
