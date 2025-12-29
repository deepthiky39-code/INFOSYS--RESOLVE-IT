package com.grievance.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path uploadDir = Paths.get("uploads/complaints");

    // ✅ Already correct – saves photo
    public String storeComplaintPhoto(MultipartFile file) {
        try {
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }

String cleanName = file.getOriginalFilename().replaceAll("\\s+", "_");
String fileName = UUID.randomUUID() + "_" + cleanName;
            Path filePath = uploadDir.resolve(fileName);

            Files.copy(file.getInputStream(), filePath);

            // path stored in DB
            return  fileName;

        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }

    // 🔥 ADD THIS METHOD (THIS FIXES RED UNDERLINE)
    public Path getFilePath(String fileName) {
        return uploadDir.resolve(fileName).normalize();
    }
}
