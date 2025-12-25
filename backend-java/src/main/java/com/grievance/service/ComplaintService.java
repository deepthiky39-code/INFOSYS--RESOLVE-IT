package com.grievance.service;

import com.grievance.dto.ComplaintRequest;
import com.grievance.dto.ComplaintResponse;
import com.grievance.model.Admin;
import com.grievance.model.Complaint;
import com.grievance.model.ComplaintPhoto;
import com.grievance.model.User;
import com.grievance.repository.AdminRepository;
import com.grievance.repository.ComplaintPhotoRepository;
import com.grievance.repository.ComplaintRepository;
import com.grievance.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.grievance.service.FileStorageService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ComplaintService {

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private ComplaintPhotoRepository complaintPhotoRepository;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private AdminRepository adminRepository;

    /* ================= SUBMIT ================= */
public List<ComplaintResponse> getComplaintsForAdmin(String adminEmail) {

    Admin admin = adminRepository.findByEmail(adminEmail)
            .orElseThrow(() -> new RuntimeException("Admin not found"));

    // 👑 Senior admin → all complaints
    if (admin.getRole() == Admin.AdminRole.SENIOR_ADMIN) {
        return complaintRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // 🚍🚆🚇 Department admins
    return complaintRepository
            .findByTransportType(
                admin.getDepartment().name().replace("_OPERATIONS", "")
            )
            .stream()
            .map(this::mapToResponse)
            .toList();
}


    public ComplaintResponse submitComplaint(
        ComplaintRequest request,
        String userEmail) {

    User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));

    // 1️⃣ Save complaint first
    Complaint complaint = new Complaint();
    complaint.setTitle(request.getTitle());
    complaint.setCategory(request.getCategory());
    complaint.setTransportType(request.getTransportType());
    complaint.setDescription(request.getDescription());
    complaint.setRoute(request.getRoute());
    complaint.setIncidentDate(request.getIncidentDate());
    complaint.setStatus(Complaint.ComplaintStatus.PENDING);
    complaint.setSubmittedAt(LocalDateTime.now());
    complaint.setUser(user);

    Complaint savedComplaint = complaintRepository.save(complaint);

    // 2️⃣ SAVE PHOTO (🔥 THIS WAS MISSING)
    if (request.getPhoto() != null && !request.getPhoto().isEmpty()) {

    String filePath = fileStorageService.storeComplaintPhoto(
        request.getPhoto()
);

    ComplaintPhoto photo = new ComplaintPhoto();
    photo.setComplaint(savedComplaint);
    photo.setFileName(request.getPhoto().getOriginalFilename());
    photo.setContentType(request.getPhoto().getContentType());
    photo.setFileSize(request.getPhoto().getSize());
    photo.setFilePath(filePath);

    // ❌ DO NOT set uploadedAt manually
    // Hibernate handles it via @CreationTimestamp

    complaintPhotoRepository.save(photo);
}

    

    return mapToResponse(savedComplaint);
}


    /* ================= USER ================= */

    public List<ComplaintResponse> getUserComplaints(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return complaintRepository.findByUserOrderBySubmittedAtDesc(user)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /* ================= ADMIN ================= */

    public List<ComplaintResponse> getAllComplaints() {
    return complaintRepository.findAllByOrderBySubmittedAtDesc()
            .stream()
            .map(this::mapToResponse)
            .toList();
}


    public List<ComplaintResponse> getComplaintsByTransportType(String type) {
        return complaintRepository.findByTransportType(type)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ComplaintResponse getComplaintById(Long id) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
        return mapToResponse(complaint);
    }

    public ComplaintResponse updateComplaintStatus(
            Long id,
            String status,
            String adminEmail) {

        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        Admin admin = adminRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        complaint.setStatus(Complaint.ComplaintStatus.valueOf(status.toUpperCase()));
        complaint.setAssignedAdmin(admin);
        complaint.setUpdatedAt(LocalDateTime.now());

        return mapToResponse(complaintRepository.save(complaint));
    }

    /* ================= MAPPER ================= */

    private ComplaintResponse mapToResponse(Complaint complaint) {

        List<String> photoUrls = complaintPhotoRepository
        .findByComplaintId(complaint.getId())
        .stream()
        .map(photo ->
            "https://noble-adventure-production.up.railway.app/uploads/complaints/"
            + photo.getFilePath())
        .toList();


        ComplaintResponse response = new ComplaintResponse();
        response.setId(complaint.getId());
        response.setTitle(complaint.getTitle());
        response.setCategory(complaint.getCategory());
        response.setTransportType(complaint.getTransportType());
        response.setDescription(complaint.getDescription());
        response.setRoute(complaint.getRoute());
        response.setDate(complaint.getIncidentDate());
        response.setIncidentDate(complaint.getIncidentDate());
        response.setStatus(complaint.getStatus().name());
        response.setSubmittedAt(complaint.getSubmittedAt());
        response.setUpdatedAt(complaint.getUpdatedAt());
        response.setPhotoUrls(photoUrls);
        response.setUserName(complaint.getUser().getName());
        response.setUserEmail(complaint.getUser().getEmail());
        response.setAssignedAdminName(
                complaint.getAssignedAdmin() != null
                        ? complaint.getAssignedAdmin().getName()
                        : null
        );

        return response;
    }
}
