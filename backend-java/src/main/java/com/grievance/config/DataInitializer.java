package com.grievance.config;

import com.grievance.model.Admin;
import com.grievance.model.User;
import com.grievance.repository.AdminRepository;
import com.grievance.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.context.annotation.Profile;

@Component
@Profile("!test")
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private AdminRepository adminRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        // Create default admin if not exists
        if (!adminRepository.existsByEmail("admin@transport.gov")) {
            Admin admin = new Admin();
            admin.setName("System Administrator");
            admin.setEmail("admin@transport.gov");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setPhoneNumber("+1234567890");
            admin.setRole(Admin.AdminRole.SENIOR_ADMIN);
            admin.setDepartment(Admin.AdminDepartment.ALL_OPERATIONS);
            admin.setEmployeeId("ADM-2024-001");
            admin.setStatus(Admin.AdminStatus.ACTIVE);
            
            adminRepository.save(admin);
            System.out.println("Default admin created - Email: admin@transport.gov, Password: admin123");
        }
        
        // Create sample user for testing
        if (!userRepository.existsByEmail("user@example.com")) {
            User user = new User();
            user.setName("Test User");
            user.setEmail("user@example.com");
            user.setPassword(passwordEncoder.encode("password123"));
            user.setPhoneNumber("+1987654321");
            user.setIsActive(true);
            
            userRepository.save(user);
            System.out.println("Sample user created - Email: user@example.com, Password: password123");
        }
    }
}
