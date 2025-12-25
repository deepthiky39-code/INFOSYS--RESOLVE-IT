package com.grievance.service;

import com.grievance.dto.AdminRequest;
import com.grievance.model.Admin;
import com.grievance.model.Complaint;
import com.grievance.repository.AdminRepository;
import com.grievance.repository.ComplaintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminManagementService {

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    

    public long getPendingCount() {
        return complaintRepository.countByStatus(Complaint.ComplaintStatus.PENDING);
    }

    public long getInProgressCount() {
        return complaintRepository.countByStatus(Complaint.ComplaintStatus.IN_PROGRESS);
    }

    public long getResolvedCount() {
        return complaintRepository.countByStatus(Complaint.ComplaintStatus.RESOLVED);
    }

    public long getBusCount() {
        return complaintRepository.countByTransportType("Bus");
    }

    public long getTrainCount() {
        return complaintRepository.countByTransportType("Train");
    }

    public long getMetroCount() {
        return complaintRepository.countByTransportType("Metro");
    }
    
    /* ================= ADMIN CRUD ================= */

    public String createAdmin(AdminRequest request) {
        if (adminRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Admin with this email already exists");
        }

        Admin admin = new Admin();
        admin.setName(request.getName());
        admin.setEmail(request.getEmail());
        admin.setPassword(passwordEncoder.encode(request.getPassword()));
        admin.setPhoneNumber(request.getPhoneNumber());

        // parse role string into enum (default ADMIN)
        String roleStr = request.getRole();
        if (roleStr != null && roleStr.toLowerCase().contains("senior")) {
            admin.setRole(Admin.AdminRole.SENIOR_ADMIN);
        } else {
            admin.setRole(Admin.AdminRole.ADMIN);
        }

        // parse department string into enum
        String deptStr = request.getDepartment();
        Admin.AdminDepartment dept = Admin.AdminDepartment.ALL_OPERATIONS;
        if (deptStr != null) {
            String d = deptStr.toLowerCase();
            if (d.contains("bus")) dept = Admin.AdminDepartment.BUS_OPERATIONS;
            else if (d.contains("train")) dept = Admin.AdminDepartment.TRAIN_OPERATIONS;
            else if (d.contains("metro")) dept = Admin.AdminDepartment.METRO_OPERATIONS;
            else dept = Admin.AdminDepartment.ALL_OPERATIONS;
        }
        admin.setDepartment(dept);

        // Simple unique employee id generator; replace with a better strategy if needed
        admin.setEmployeeId("EMP" + System.currentTimeMillis());
        admin.setStatus(Admin.AdminStatus.ACTIVE);

        adminRepository.save(admin);
        return "Admin created successfully";
    }

    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    public String updateAdminStatus(Long id, String status) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        try {
            admin.setStatus(Admin.AdminStatus.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status value");
        }

        adminRepository.save(admin);
        return "Admin status updated successfully";
    }

    public String deleteAdmin(Long id) {
        if (!adminRepository.existsById(id)) {
            throw new RuntimeException("Admin not found");
        }

        adminRepository.deleteById(id);
        return "Admin deleted successfully";
    }

    /* ================= ANALYTICS ================= */

    public Map<String, Object> getAnalyticsOverview() {
        Map<String, Object> overview = new HashMap<>();
        overview.put("pending", getPendingCount());
        overview.put("inProgress", getInProgressCount());
        overview.put("resolved", getResolvedCount());
        overview.put("bus", getBusCount());
        overview.put("train", getTrainCount());
        overview.put("metro", getMetroCount());
        overview.put("adminCount", adminRepository.count());
        return overview;
    }

    public Map<String, Object> getAdminPerformance() {
        List<Complaint> complaints = complaintRepository.findAll();

        Map<String, Map<String, Object>> perAdmin = new HashMap<>();

        // Aggregate complaints by assigned admin
        complaints.stream()
                .filter(c -> c.getAssignedAdmin() != null)
                .forEach(c -> {
                    String name = c.getAssignedAdmin().getName();
                    Map<String, Object> stats = perAdmin.computeIfAbsent(name, k -> {
                        Map<String, Object> m = new HashMap<>();
                        m.put("assignedCount", 0L);
                        m.put("resolvedCount", 0L);
                        m.put("totalResolutionDays", 0L);
                        return m;
                    });

                    stats.put("assignedCount", (Long) stats.get("assignedCount") + 1);

                    if (c.getResolvedAt() != null && c.getSubmittedAt() != null) {
                        long days = Duration.between(c.getSubmittedAt(), c.getResolvedAt()).toDays();
                        stats.put("resolvedCount", (Long) stats.get("resolvedCount") + 1);
                        stats.put("totalResolutionDays", (Long) stats.get("totalResolutionDays") + days);
                    }
                });

        // Build result with average resolution time
        Map<String, Object> result = new HashMap<>();
        perAdmin.forEach((name, stats) -> {
            long assigned = (Long) stats.get("assignedCount");
            long resolved = (Long) stats.get("resolvedCount");
            long totalDays = (Long) stats.get("totalResolutionDays");
            double avgResolutionDays = resolved > 0 ? (double) totalDays / resolved : 0.0;

            Map<String, Object> summary = new HashMap<>();
            summary.put("assignedCount", assigned);
            summary.put("resolvedCount", resolved);
            summary.put("averageResolutionDays", avgResolutionDays);

            result.put(name, summary);
        });

        return new HashMap<>(Map.of("perAdmin", result));
    }
}
