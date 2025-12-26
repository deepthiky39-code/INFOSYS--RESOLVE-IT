package com.grievance.controller;

import com.grievance.dto.AdminRequest;
import com.grievance.dto.ComplaintResponse;
import com.grievance.model.Admin;
import com.grievance.service.AdminManagementService;
import com.grievance.service.ComplaintService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private ComplaintService complaintService;

    @Autowired
    private AdminManagementService adminManagementService;

    /* ================= COMPLAINT MANAGEMENT ================= */

   @GetMapping("/complaints")
public ResponseEntity<List<ComplaintResponse>> getComplaintsForAdmin(
        Authentication authentication) {

    return ResponseEntity.ok(
            complaintService.getComplaintsForAdmin(authentication.getName())
    );
}



    @GetMapping("/complaints/transport/{type}")
    public ResponseEntity<List<ComplaintResponse>> getComplaintsByTransport(
            @PathVariable String type) {

        return ResponseEntity.ok(
                complaintService.getComplaintsByTransportType(type)
        );
    }

    @GetMapping("/complaints/{id}")
    public ResponseEntity<ComplaintResponse> getComplaintDetail(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                complaintService.getComplaintById(id)
        );
    }

    @PutMapping("/complaints/{id}/status")
    public ResponseEntity<ComplaintResponse> updateComplaintStatus(
            @PathVariable Long id,
            @RequestParam String status,
            Authentication authentication) {

        return ResponseEntity.ok(
                complaintService.updateComplaintStatus(
                        id,
                        status,
                        authentication.getName()
                )
        );
    }

    /* ================= ADMIN MANAGEMENT ================= */

    @PostMapping("/create")
    public ResponseEntity<Map<String, String>> createAdmin(
            @Valid @RequestBody AdminRequest request) {

        String message = adminManagementService.createAdmin(request);

        Map<String, String> response = new HashMap<>();
        response.put("message", message);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/list")
    public ResponseEntity<List<Admin>> getAllAdmins() {
        return ResponseEntity.ok(
                adminManagementService.getAllAdmins()
        );
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Map<String, String>> updateAdminStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        String message = adminManagementService.updateAdminStatus(id, status);

        Map<String, String> response = new HashMap<>();
        response.put("message", message);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteAdmin(
            @PathVariable Long id) {

        String message = adminManagementService.deleteAdmin(id);

        Map<String, String> response = new HashMap<>();
        response.put("message", message);

        return ResponseEntity.ok(response);
    }

    /* ================= ANALYTICS ================= */

    @GetMapping("/analytics/overview")
    public ResponseEntity<?> getAnalyticsOverview() {
        return ResponseEntity.ok(
                adminManagementService.getAnalyticsOverview()
        );
    }

    @GetMapping("/analytics/performance")
    public ResponseEntity<?> getAdminPerformance() {
        return ResponseEntity.ok(
                adminManagementService.getAdminPerformance()
        );
    }
    @GetMapping("/profile")
public ResponseEntity<?> getAdminProfile(Authentication authentication) {

    return ResponseEntity.ok(
            adminManagementService.getAdminByEmail(authentication.getName())
    );
}
}



