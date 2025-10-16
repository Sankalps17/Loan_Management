package com.example.loanmanagement.repository;

import com.example.loanmanagement.entity.LoanApplication;
import com.example.loanmanagement.entity.LoanDocument;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoanDocumentRepository extends JpaRepository<LoanDocument, UUID> {
    List<LoanDocument> findByLoan(LoanApplication loan);
    List<LoanDocument> findByLoanId(UUID loanId);
}
