package com.grievance.controller;
import com.grievance.dto.ComplaintRequest;
import com.grievance.dto.ComplaintResponse;
import com.grievance.service.ComplaintService;
import com.grievance.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.util.List;
@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = "*")
public class ComplaintController {

    @Autowired
    private ComplaintService complaintService;

    @Autowired
    private FileStorageService fileStorageService;

    // 🔥 FINAL FIX — DO NOT USE @ModelAttribute FOR MULTIPART
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ComplaintResponse> submitComplaint(
            @RequestPart("title") String title,
            @RequestPart("category") String category,
            @RequestPart("transportType") String transportType,
            @RequestPart("route") String route,
            @RequestPart("incidentDate") String incidentDate,
            @RequestPart("description") String description,
            @RequestPart(value = "photo", required = false) MultipartFile photo,
            Authentication authentication
    ) {

        ComplaintRequest request = new ComplaintRequest();
        request.setTitle(title);
        request.setCategory(category);
        request.setTransportType(transportType);
        request.setRoute(route);
        request.setIncidentDate(LocalDate.parse(incidentDate)); // ✅

        request.setDescription(description);
        request.setPhoto(photo); // ✅ PHOTO WILL NOT BE NULL NOW

        return ResponseEntity.ok(
                complaintService.submitComplaint(request, authentication.getName())
        );
    }

    @GetMapping("/user")
    public ResponseEntity<List<ComplaintResponse>> getUserComplaints(
            Authentication authentication) {

        return ResponseEntity.ok(
                complaintService.getUserComplaints(authentication.getName())
        );
    }

    @GetMapping
    public ResponseEntity<List<ComplaintResponse>> getAllComplaints() {
        return ResponseEntity.ok(complaintService.getAllComplaints());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ComplaintResponse> getComplaint(@PathVariable Long id) {
        return ResponseEntity.ok(complaintService.getComplaintById(id));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ComplaintResponse> updateComplaintStatus(
            @PathVariable Long id,
            @RequestParam String status,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                complaintService.updateComplaintStatus(
                        id,
                        status,
                        authentication.getName()
                )
        );
    }

   @GetMapping("/photos/{fileName:.+}")
public ResponseEntity<Resource> getPhoto(@PathVariable String fileName) {
    try {
        Path filePath = fileStorageService.getFilePath(fileName);
        Resource resource = new UrlResource(filePath.toUri());

        if (!resource.exists() || !resource.isReadable()) {
            return ResponseEntity.notFound().build();
        }

        // Detect correct content type
        String contentType = Files.probeContentType(filePath);
        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);

    } catch (Exception e) {
        return ResponseEntity.notFound().build();
    }
}

}
