package com.example.petclinic.service;

import com.example.petclinic.model.Pet;
import com.example.petclinic.model.User;
import com.example.petclinic.repository.PetRepository;
import com.example.petclinic.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class PetService {
    @Autowired
    private PetRepository petRepository;
    @Autowired
    private UserRepository userRepository;

    public Pet addPet(Pet pet, String username) {
        User owner = userRepository.findByUsername(username).orElseThrow();
        pet.setOwner(owner);
        return petRepository.save(pet);
    }

    public List<Pet> getPetsForOwner(String username) {
        User owner = userRepository.findByUsername(username).orElseThrow();
        return petRepository.findByOwnerId(owner.getId());
    }

    public Optional<Pet> getPetByIdForOwner(Long petId, String username) {
        User owner = userRepository.findByUsername(username).orElseThrow();
        Optional<Pet> pet = petRepository.findById(petId);
        if (pet.isPresent() && pet.get().getOwner().getId().equals(owner.getId())) {
            return pet;
        }
        return Optional.empty();
    }
}
