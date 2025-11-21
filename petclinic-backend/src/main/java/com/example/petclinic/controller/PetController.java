package com.example.petclinic.controller;

import com.example.petclinic.dto.PetDTO;
import com.example.petclinic.model.Pet;
import com.example.petclinic.service.PetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/pets")
public class PetController {
    @Autowired
    private PetService petService;

    @PostMapping
    public PetDTO addPet(@Validated @RequestBody PetDTO petDTO, @AuthenticationPrincipal UserDetails userDetails) {
        Pet pet = new Pet();
        pet.setName(petDTO.name());
        pet.setSpecies(petDTO.species());
        pet.setBreed(petDTO.breed());
        pet.setBirthDate(petDTO.birthDate());
        Pet savedPet = petService.addPet(pet, userDetails.getUsername());
        return new PetDTO(savedPet.getId(), savedPet.getName(), savedPet.getSpecies(), savedPet.getBreed(), savedPet.getBirthDate(), null);
    }

    @GetMapping
    public List<PetDTO> getPets(@AuthenticationPrincipal UserDetails userDetails) {
        return petService.getPetsForOwner(userDetails.getUsername());
    }

    @GetMapping("/{id}")
    public PetDTO getPet(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        Pet pet = petService.getPetByIdForOwner(id, userDetails.getUsername()).orElseThrow();
        return new PetDTO(pet.getId(), pet.getName(), pet.getSpecies(), pet.getBreed(), pet.getBirthDate(), null);
    }
}
