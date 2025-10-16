package com.example.loanmanagement.repository;

import com.example.loanmanagement.entity.LoanApplication;
import com.example.loanmanagement.entity.User;
import com.example.loanmanagement.entity.enums.LoanStatus;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoanApplicationRepository extends JpaRepository<LoanApplication, UUID> {
    List<LoanApplication> findByApplicant(User applicant);
    List<LoanApplication> findByApplicantId(UUID applicantId);
    List<LoanApplication> findByStatus(LoanStatus status);
}
