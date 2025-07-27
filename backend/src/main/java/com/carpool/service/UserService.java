package com.carpool.service;

import com.carpool.dto.UserLoginDto;
import com.carpool.dto.UserRegistrationDto;
import com.carpool.entity.User;
import com.carpool.repository.UserRepository;
import com.carpool.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public Map<String, Object> registerUser(UserRegistrationDto registrationDto) {
        Map<String, Object> response = new HashMap<>();
        
        if (userRepository.existsByEmail(registrationDto.getEmail())) {
            response.put("success", false);
            response.put("message", "Email already exists");
            return response;
        }

        User user = new User();
        user.setName(registrationDto.getName());
        user.setEmail(registrationDto.getEmail());
        user.setPassword(passwordEncoder.encode(registrationDto.getPassword()));
        user.setPhoneNumber(registrationDto.getPhoneNumber());

        User savedUser = userRepository.save(user);
        String token = jwtUtil.generateToken(savedUser.getEmail());

        response.put("success", true);
        response.put("message", "User registered successfully");
        response.put("token", token);
        response.put("user", getUserInfo(savedUser));
        
        return response;
    }

    public Map<String, Object> loginUser(UserLoginDto loginDto) {
        Map<String, Object> response = new HashMap<>();
        
        User user = userRepository.findByEmail(loginDto.getEmail()).orElse(null);
        
        if (user == null || !passwordEncoder.matches(loginDto.getPassword(), user.getPassword())) {
            response.put("success", false);
            response.put("message", "Invalid email or password");
            return response;
        }

        String token = jwtUtil.generateToken(user.getEmail());
        
        response.put("success", true);
        response.put("message", "Login successful");
        response.put("token", token);
        response.put("user", getUserInfo(user));
        
        return response;
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    private Map<String, Object> getUserInfo(User user) {
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("id", user.getId());
        userInfo.put("name", user.getName());
        userInfo.put("email", user.getEmail());
        userInfo.put("phoneNumber", user.getPhoneNumber());
        return userInfo;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                new ArrayList<>()
        );
    }
}

