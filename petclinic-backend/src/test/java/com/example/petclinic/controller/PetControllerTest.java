package com.example.petclinic.controller;

import com.example.petclinic.dto.PetDTO;
import com.example.petclinic.model.Pet;
import com.example.petclinic.model.User;
import com.example.petclinic.repository.PetRepository;
import com.example.petclinic.repository.UserRepository;
import com.example.petclinic.security.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import java.time.LocalDate;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class PetControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    private String ownerToken;
    private User ownerUser;

    @BeforeEach
    void setUp() {
        petRepository.deleteAll();
        userRepository.deleteAll();

        // Create test owner user
        ownerUser = new User();
        ownerUser.setUsername("test_owner");
        ownerUser.setPassword(passwordEncoder.encode("password123"));
        ownerUser.setRole("OWNER");
        ownerUser.setPhoneNumber("1234567890");
        ownerUser.setIdentityCode("ID123456");
        ownerUser = userRepository.save(ownerUser);

        // Generate JWT token
        ownerToken = jwtUtil.generateToken(ownerUser.getUsername(), ownerUser.getRole());
    }

    @Test
    void testAddPet_Success() throws Exception {
        PetDTO petDTO = new PetDTO(
                null,
                "Buddy",
                "Dog",
                "Golden Retriever",
                LocalDate.of(2021, 1, 15),
                null
        );

        mockMvc.perform(post("/api/pets")
                        .header("Authorization", "Bearer " + ownerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(petDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Buddy")))
                .andExpect(jsonPath("$.species", is("Dog")))
                .andExpect(jsonPath("$.breed", is("Golden Retriever")))
                .andExpect(jsonPath("$.id", notNullValue()));
    }

    @Test
    void testGetMyPets_Success() throws Exception {
        // Add pets
        Pet pet1 = new Pet();
        pet1.setName("Buddy");
        pet1.setSpecies("Dog");
        pet1.setBreed("Golden Retriever");
        pet1.setBirthDate(LocalDate.of(2021, 1, 15));
        pet1.setOwner(ownerUser);
        petRepository.save(pet1);

        Pet pet2 = new Pet();
        pet2.setName("Whiskers");
        pet2.setSpecies("Cat");
        pet2.setBreed("Persian");
        pet2.setBirthDate(LocalDate.of(2022, 3, 20));
        pet2.setOwner(ownerUser);
        petRepository.save(pet2);

        mockMvc.perform(get("/api/pets")
                        .header("Authorization", "Bearer " + ownerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].name", is("Buddy")))
                .andExpect(jsonPath("$[1].name", is("Whiskers")));
    }

    @Test
    void testAddPet_Unauthorized() throws Exception {
        PetDTO petDTO = new PetDTO(
                null,
                "Buddy",
                "Dog",
                "Golden Retriever",
                LocalDate.of(2021, 1, 15),
                null
        );

        mockMvc.perform(post("/api/pets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(petDTO)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void testGetPets_EmptyList() throws Exception {
        mockMvc.perform(get("/api/pets")
                        .header("Authorization", "Bearer " + ownerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }
}
