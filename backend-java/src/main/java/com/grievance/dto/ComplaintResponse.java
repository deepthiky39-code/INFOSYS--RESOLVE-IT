package com.grievance.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class ComplaintResponse {

    private Long id;
    private String title;
    private String category;
    private String transportType;
    private String description;
    private String route;

    // used by frontend
    private LocalDate date;

    // backend compatibility
    private LocalDate incidentDate;

    private String status;
    private LocalDateTime submittedAt;
    private LocalDateTime updatedAt;

    // ✅ PHOTO URLs SENT TO FRONTEND
    private List<String> photoUrls;

    private String userName;
    private String userEmail;
    private String assignedAdminName;

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

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public LocalDate getIncidentDate() { return incidentDate; }
    public void setIncidentDate(LocalDate incidentDate) { this.incidentDate = incidentDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<String> getPhotoUrls() { return photoUrls; }
    public void setPhotoUrls(List<String> photoUrls) { this.photoUrls = photoUrls; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getAssignedAdminName() { return assignedAdminName; }
    public void setAssignedAdminName(String assignedAdminName) { this.assignedAdminName = assignedAdminName; }
}
