package com.grievance.controller;

import com.grievance.dto.AdminFeedbackResponse;
import com.grievance.model.Complaint;
import com.grievance.model.Feedback;
import com.grievance.model.User;
import com.grievance.repository.ComplaintRepository;
import com.grievance.repository.FeedbackRepository;
import com.grievance.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "*")
public class FeedbackController {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ComplaintRepository complaintRepository;

    /* =========================================================
       USER → SUBMIT FEEDBACK (GENERAL)
       ========================================================= */
    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<String> submitFeedback(
            @RequestBody Feedback feedback,
            Authentication authentication
    ) {
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        feedback.setUser(user);
        feedback.setSubmittedAt(LocalDateTime.now());

        feedbackRepository.save(feedback);

        return ResponseEntity.ok("Feedback submitted successfully");
    }

    /* =========================================================
       USER → SUBMIT FEEDBACK FOR A COMPLAINT
       ========================================================= */
    @PostMapping("/complaint/{complaintId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<String> submitFeedbackForComplaint(
            @PathVariable Long complaintId,
            @RequestBody Feedback feedback,
            Authentication authentication
    ) {
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        feedback.setUser(user);
        feedback.setComplaint(complaint);
        feedback.setSubmittedAt(LocalDateTime.now());

        feedbackRepository.save(feedback);

        return ResponseEntity.ok("Feedback submitted successfully");
    }

    /* =========================================================
       ADMIN / SENIOR_ADMIN → VIEW ALL FEEDBACK
       ========================================================= */
    @GetMapping("/admin")
    @PreAuthorize("hasAnyRole('ADMIN', 'SENIOR_ADMIN')")
    public List<AdminFeedbackResponse> getAllFeedbackForAdmin() {

    return feedbackRepository.findAll()
            .stream()
            .map(f -> new AdminFeedbackResponse(
                    f.getId(),
                    f.getRating(),
                    f.getComment(),
                    f.getSubmittedAt(),

                    // 👇 THIS IS WHAT YOU WERE MISSING
                    f.getUser() != null ? f.getUser().getName() : "Unknown",
                    f.getComplaint() != null ? f.getComplaint().getTitle() : "N/A",
                    f.getComplaint() != null ? f.getComplaint().getTransportType()
                     : "N/A"
            ))
            .toList();
}
}
