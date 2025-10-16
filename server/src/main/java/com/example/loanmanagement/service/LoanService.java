package com.example.loanmanagement.service;

import com.example.loanmanagement.dto.LoanApplicationRequest;
import com.example.loanmanagement.entity.LoanApplication;
import com.example.loanmanagement.entity.enums.LoanStatus;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface LoanService {
    LoanApplication applyForLoan(UUID userId, LoanApplicationRequest request);
    List<LoanApplication> getUserLoans(UUID userId);
    List<LoanApplication> getAllLoans();
    LoanApplication getLoanById(UUID loanId);
    LoanApplication updateLoanStatus(UUID loanId, LoanStatus status, String remarks);
    BigDecimal calculateMonthlyEMI(BigDecimal principal, BigDecimal annualInterestRate, int tenureInMonths);
}
