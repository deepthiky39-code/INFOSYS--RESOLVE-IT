package com.grievance.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.List;

public class ComplaintRequest {
    
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Category is required")
    private String category;
    
    @NotBlank(message = "Transport type is required")
    private String transportType;
    
    @NotBlank(message = "Description is required")
    private String description;
    
    @NotBlank(message = "Route is required")
    private String route;
    
    @NotNull(message = "Incident date is required")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate incidentDate;

    
    private MultipartFile photo;

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

    public LocalDate getIncidentDate() { return incidentDate; }
    public void setIncidentDate(LocalDate incidentDate) { this.incidentDate = incidentDate; }

   public MultipartFile getPhoto() {
        return photo;
    }
public void setPhoto(MultipartFile photo) {
    this.photo = photo;
}}
