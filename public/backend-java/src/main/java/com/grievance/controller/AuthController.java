package com.grievance.controller;

import com.grievance.dto.JwtResponse;
import com.grievance.dto.LoginRequest;
import com.grievance.dto.SignupRequest;
import com.grievance.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @PostMapping("/login")
    public ResponseEntity<JwtResponse> userLogin(@Valid @RequestBody LoginRequest loginRequest) {
        JwtResponse response = authService.userLogin(loginRequest);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/admin/login")
    public ResponseEntity<JwtResponse> adminLogin(@Valid @RequestBody LoginRequest loginRequest) {
        JwtResponse response = authService.adminLogin(loginRequest);
        return ResponseEntity.ok(response);
    }
    @PostMapping("/reset-password")
public ResponseEntity<String> resetPassword(
        @RequestParam String token,
        @RequestParam String newPassword
) {
    authService.resetPassword(token, newPassword);
    return ResponseEntity.ok("Password reset successful");
}

    @PostMapping("/signup")
    public ResponseEntity<Map<String, String>> userSignup(@Valid @RequestBody SignupRequest signupRequest) {
        String message = authService.userSignup(signupRequest);
        Map<String, String> response = new HashMap<>();
        response.put("message", message);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@RequestParam String email) {
        String message = authService.forgotPassword(email);
        Map<String, String> response = new HashMap<>();
        response.put("message", message);
        return ResponseEntity.ok(response);
    }
}
