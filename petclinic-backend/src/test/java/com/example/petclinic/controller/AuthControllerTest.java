package com.example.petclinic.controller;

import com.example.petclinic.dto.AuthResponseDTO;
import com.example.petclinic.dto.LoginRequestDTO;
import com.example.petclinic.dto.RegisterRequestDTO;
import com.example.petclinic.model.User;
import com.example.petclinic.repository.DoctorRepository;
import com.example.petclinic.repository.UserRepository;
import com.example.petclinic.security.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
        doctorRepository.deleteAll();
    }

    @Test
    void testRegisterOwner_Success() throws Exception {
        RegisterRequestDTO request = new RegisterRequestDTO(
                "john_doe",
                "password123",
                "OWNER",
                "1234567890",
                "ID123456"
        );

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token", notNullValue()))
                .andExpect(jsonPath("$.username", is("john_doe")))
                .andExpect(jsonPath("$.role", is("OWNER")));
    }

    @Test
    void testRegisterDoctor_Success() throws Exception {
        RegisterRequestDTO request = new RegisterRequestDTO(
                "dr_smith",
                "password123",
                "DOCTOR",
                "9876543210",
                "DOC123456"
        );

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token", notNullValue()))
                .andExpect(jsonPath("$.username", is("dr_smith")))
                .andExpect(jsonPath("$.role", is("DOCTOR")));
    }

    @Test
    void testRegisterDuplicateUsername_Failure() throws Exception {
        // Create first user
        User existingUser = new User();
        existingUser.setUsername("john_doe");
        existingUser.setPassword(passwordEncoder.encode("password123"));
        existingUser.setRole("OWNER");
        existingUser.setPhoneNumber("1234567890");
        existingUser.setIdentityCode("ID123456");
        userRepository.save(existingUser);

        // Try to register with same username
        RegisterRequestDTO request = new RegisterRequestDTO(
                "john_doe",
                "password456",
                "OWNER",
                "9999999999",
                "ID999999"
        );

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

    @Test
    void testRegisterDuplicatePhone_Failure() throws Exception {
        // Create first user
        User existingUser = new User();
        existingUser.setUsername("john_doe");
        existingUser.setPassword(passwordEncoder.encode("password123"));
        existingUser.setRole("OWNER");
        existingUser.setPhoneNumber("1234567890");
        existingUser.setIdentityCode("ID123456");
        userRepository.save(existingUser);

        // Try to register with same phone
        RegisterRequestDTO request = new RegisterRequestDTO(
                "jane_doe",
                "password456",
                "OWNER",
                "1234567890",
                "ID999999"
        );

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

    @Test
    void testLogin_Success() throws Exception {
        // Create test user
        User testUser = new User();
        testUser.setUsername("john_doe");
        testUser.setPassword(passwordEncoder.encode("password123"));
        testUser.setRole("OWNER");
        testUser.setPhoneNumber("1234567890");
        testUser.setIdentityCode("ID123456");
        userRepository.save(testUser);

        // Login
        LoginRequestDTO loginRequest = new LoginRequestDTO("john_doe", "password123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token", notNullValue()))
                .andExpect(jsonPath("$.username", is("john_doe")))
                .andExpect(jsonPath("$.role", is("OWNER")));
    }

    @Test
    void testLogin_InvalidCredentials() throws Exception {
        // Create test user
        User testUser = new User();
        testUser.setUsername("john_doe");
        testUser.setPassword(passwordEncoder.encode("password123"));
        testUser.setRole("OWNER");
        testUser.setPhoneNumber("1234567890");
        testUser.setIdentityCode("ID123456");
        userRepository.save(testUser);

        // Try login with wrong password
        LoginRequestDTO loginRequest = new LoginRequestDTO("john_doe", "wrongpassword");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void testLogin_UserNotFound() throws Exception {
        LoginRequestDTO loginRequest = new LoginRequestDTO("nonexistent", "password123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized());
    }
}
