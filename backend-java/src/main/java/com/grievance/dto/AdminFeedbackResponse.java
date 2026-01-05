package com.grievance.dto;

import java.time.LocalDateTime;

public class AdminFeedbackResponse {

    private Long id;
    private int rating;
    private String comment;
    private LocalDateTime submittedAt;

    private String userName;
    private String complaintTitle;
    private String transportType;

    public AdminFeedbackResponse(
            Long id,
            int rating,
            String comment,
            LocalDateTime submittedAt,
            String userName,
            String complaintTitle,
            String transportType
    ) {
        this.id = id;
        this.rating = rating;
        this.comment = comment;
        this.submittedAt = submittedAt;
        this.userName = userName;
        this.complaintTitle = complaintTitle;
        this.transportType = transportType;
    }

    public Long getId() { return id; }
    public int getRating() { return rating; }
    public String getComment() { return comment; }
    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public String getUserName() { return userName; }
    public String getComplaintTitle() { return complaintTitle; }
    public String getTransportType() { return transportType; }
}
