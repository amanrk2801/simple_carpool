package com.carpool.controller;

import com.carpool.dto.UserLoginDto;
import com.carpool.dto.UserRegistrationDto;
import com.carpool.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@Valid @RequestBody UserRegistrationDto registrationDto) {
        Map<String, Object> response = userService.registerUser(registrationDto);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody UserLoginDto loginDto) {
        Map<String, Object> response = userService.loginUser(loginDto);
        return ResponseEntity.ok(response);
    }
}

