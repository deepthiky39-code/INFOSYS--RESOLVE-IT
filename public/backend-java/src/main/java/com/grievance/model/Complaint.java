package com.grievance.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "complaints")
public class Complaint {

    public Complaint() {}
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String category;
    @Column(name = "assigned_admin_name")
private String assignedAdminName;

    
    @Column(name = "transport_type", nullable = false)
    private String transportType; // Bus, Train, Metro
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false)
    private String route;
    
    @Column(name = "incident_date", nullable = false)
    private LocalDate incidentDate;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ComplaintStatus status = ComplaintStatus.PENDING;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_admin_id")
    private Admin assignedAdmin;
    
    @OneToMany(mappedBy = "complaint", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ComplaintPhoto> photos = new ArrayList<>();
    
    @CreationTimestamp
    @Column(name = "submitted_at", nullable = false, updatable = false)
    private LocalDateTime submittedAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;
    
    public enum ComplaintStatus {
        PENDING, IN_PROGRESS, RESOLVED, REJECTED
    }
    
    public void addPhoto(ComplaintPhoto photo) {
        photos.add(photo);
        photo.setComplaint(this);
    }
    
    public void removePhoto(ComplaintPhoto photo) {
        photos.remove(photo);
        photo.setComplaint(null);
    }
    
    public void setStatus(ComplaintStatus status) {
        this.status = status;
    }
    
    public void setStatus(String status) {
        if (status == null) {
            this.status = null;
            return;
        }
        try {
            this.status = ComplaintStatus.valueOf(status.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            switch (status.trim().toLowerCase()) {
                case "in progress":
                case "in_progress":
                case "inprogress":
                    this.status = ComplaintStatus.IN_PROGRESS;
                    break;
                case "resolved":
                    this.status = ComplaintStatus.RESOLVED;
                    break;
                case "rejected":
                    this.status = ComplaintStatus.REJECTED;
                    break;
                default:
                    this.status = ComplaintStatus.PENDING;
            }
        }
    }
    
    public void setAssignedAdminName(String assignedAdminName) {
        this.assignedAdminName = assignedAdminName;
    }
    
    public String getAssignedAdminName() {
        return assignedAdminName;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getTransportType() { return transportType; }
    public void setTransportType(String transportType) { this.transportType = transportType; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getRoute() { return route; }
    public void setRoute(String route) { this.route = route; }

    public java.time.LocalDate getIncidentDate() { return incidentDate; }
    public void setIncidentDate(java.time.LocalDate incidentDate) { this.incidentDate = incidentDate; }

    public ComplaintStatus getStatus() { return status; }
    public void setSubmittedAt(java.time.LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
    public void setUpdatedAt(java.time.LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Admin getAssignedAdmin() { return assignedAdmin; }
    public void setAssignedAdmin(Admin assignedAdmin) { this.assignedAdmin = assignedAdmin; }

    public java.time.LocalDateTime getSubmittedAt() { return submittedAt; }
    public java.time.LocalDateTime getUpdatedAt() { return updatedAt; }

    public java.time.LocalDateTime getResolvedAt() { return resolvedAt; } 

}
