package com.grievance.controller;

import com.grievance.model.User;
import com.grievance.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ✅ GET profile (for loading data)
    @GetMapping("/profile")
    public ResponseEntity<User> getProfile(Authentication authentication) {
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(user);
    }

    // ✅ UPDATE profile
    @PutMapping("/profile")
    public ResponseEntity<Map<String, String>> updateProfile(
            @RequestBody Map<String, String> request,
            Authentication authentication
    ) {
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(request.get("name"));
        user.setEmail(request.get("email"));
        user.setPhoneNumber(request.get("phoneNumber"));

        // ✅ Password optional
        if (request.get("password") != null && !request.get("password").isBlank()) {
            user.setPassword(passwordEncoder.encode(request.get("password")));
        }

        userRepository.save(user);

        return ResponseEntity.ok(
                Map.of("message", "Profile updated successfully")
        );
    }
}
