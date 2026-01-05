package com.grievance.repository;

import com.grievance.model.ComplaintPhoto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComplaintPhotoRepository
        extends JpaRepository<ComplaintPhoto, Long> {

    List<ComplaintPhoto> findByComplaintId(Long complaintId);
}
