package com.grievance.service;

import com.grievance.dto.JwtResponse;
import com.grievance.dto.LoginRequest;
import com.grievance.dto.SignupRequest;
import com.grievance.model.Admin;
import com.grievance.model.User;
import com.grievance.repository.AdminRepository;
import com.grievance.repository.UserRepository;
import com.grievance.security.JwtUtil;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.authentication.DisabledException;
@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private AdminRepository adminRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private EmailService emailService;
    
    
    public JwtResponse userLogin(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        // Generate token from email for users
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtUtil.generateUserToken(user);

        return new JwtResponse(token, user.getEmail(), user.getName(), "USER");
    }
    
    

public JwtResponse adminLogin(LoginRequest loginRequest) {

    Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                    loginRequest.getEmail(),
                    loginRequest.getPassword()
            )
    );

    SecurityContextHolder.getContext().setAuthentication(authentication);

    Admin admin = adminRepository.findByEmail(loginRequest.getEmail())
            .orElseThrow(() -> new RuntimeException("Admin not found"));

    // 🚫 BLOCK INACTIVE ADMINS
    if (admin.getStatus() == Admin.AdminStatus.INACTIVE) {
        throw new DisabledException("Admin account is deactivated");
    }

    String token = jwtUtil.generateAdminToken(admin);
    return new JwtResponse(token, admin.getEmail(), admin.getName(), "ADMIN");
}
public String forgotPassword(String email) {

    System.out.println("🔥 ENTERED forgotPassword()");
    System.out.println("🔥 Email param = " + email);

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    System.out.println("🔥 User found in DB");

    String token = UUID.randomUUID().toString();
    user.setResetToken(token);
    user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(15));
    userRepository.save(user);

    System.out.println("🔥 Token saved = " + token);

    System.out.println("🔥 Calling EmailService NOW");

    emailService.sendEmail(
            user.getEmail(),
            "Password Reset Request",
            "RESET LINK: http://localhost:5173/reset-password?token=" + token
    );

    System.out.println("🔥 Returned from EmailService");

    return "Password reset instructions sent to your email";
}


    public void resetPassword(String token, String newPassword) {
    User user = userRepository.findByResetToken(token)
            .orElseThrow(() -> new RuntimeException("Invalid token"));

    if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
        throw new RuntimeException("Token expired");
    }

    user.setPassword(passwordEncoder.encode(newPassword));
    user.setResetToken(null);
    user.setResetTokenExpiry(null);

    userRepository.save(user);
}

    public String userSignup(SignupRequest signupRequest) {
        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            throw new RuntimeException("Email is already registered");
        }
        
        User user = new User();
        user.setName(signupRequest.getName());
        user.setEmail(signupRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
        user.setPhoneNumber(signupRequest.getPhoneNumber());
        user.setIsActive(true);
        
        userRepository.save(user);
        
        return "User registered successfully";
    }
}
