package com.grievance.repository;

import com.grievance.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {
    Optional<Admin> findByEmail(String email);
    Boolean existsByEmail(String email);
    Optional<Admin> findByEmployeeId(String employeeId);
    List<Admin> findByStatus(Admin.AdminStatus status);
    
    @Query("SELECT a FROM Admin a WHERE a.status = 'ACTIVE'")
    List<Admin> findAllActiveAdmins();
}
