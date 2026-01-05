package com.grievance.repository;

import com.grievance.model.Complaint;
import com.grievance.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
List<Complaint> findByUser_Id(Long userId);


List<Complaint> findByUser(User user);

    // ================= USER =================
    List<Complaint> findByUserOrderBySubmittedAtDesc(User user);
List<Complaint> findAllByOrderBySubmittedAtDesc();

    // ================= FILTERS =================
    List<Complaint> findByTransportType(String transportType);

    // ================= COUNTS (ADMIN DASHBOARD) =================
    long countByStatus(Complaint.ComplaintStatus status);

    long countByTransportType(String transportType);
}
