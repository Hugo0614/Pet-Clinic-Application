package com.example.petclinic.controller;

import com.example.petclinic.dto.AuthResponseDTO;
import com.example.petclinic.dto.LoginRequestDTO;
import com.example.petclinic.dto.RegisterRequestDTO;
import com.example.petclinic.model.Doctor;
import com.example.petclinic.model.User;
import com.example.petclinic.repository.DoctorRepository;
import com.example.petclinic.repository.UserRepository;
import com.example.petclinic.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private DoctorRepository doctorRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public AuthResponseDTO register(@Validated @RequestBody RegisterRequestDTO request) {
        // Check for duplicate username
        if (userRepository.findByUsername(request.username()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User already registered, please login");
        }
        // Check for duplicate phone number
        if (userRepository.findByPhoneNumber(request.phoneNumber()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User already registered, please login");
        }
        // Check for duplicate identity code
        if (userRepository.findByIdentityCode(request.identityCode()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User already registered, please login");
        }
        
        User user = new User();
        user.setUsername(request.username());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(request.role());
        user.setPhoneNumber(request.phoneNumber());
        user.setIdentityCode(request.identityCode());
        userRepository.save(user);
        
        // If registering as a doctor, create a Doctor record
        if ("DOCTOR".equalsIgnoreCase(request.role())) {
            Doctor doctor = new Doctor();
            doctor.setUser(user);
            doctor.setSpecialization("General"); // Default specialization
            doctor.setRegisteredAt(LocalDateTime.now());
            doctor.setActive(true);
            doctorRepository.save(doctor);
        }
        
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());
        return new AuthResponseDTO(token, user.getUsername(), user.getRole());
    }

    @PostMapping("/login")
    public AuthResponseDTO login(@Validated @RequestBody LoginRequestDTO request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password()));
        User user = userRepository.findByUsername(request.username()).orElseThrow();
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());
        return new AuthResponseDTO(token, user.getUsername(), user.getRole());
    }
}
