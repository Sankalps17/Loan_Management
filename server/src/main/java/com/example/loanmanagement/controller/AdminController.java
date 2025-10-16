package com.example.loanmanagement.controller;

import com.example.loanmanagement.entity.LoanApplication;
import com.example.loanmanagement.entity.enums.LoanStatus;
import com.example.loanmanagement.repository.EmiScheduleRepository;
import com.example.loanmanagement.repository.LoanApplicationRepository;
import com.example.loanmanagement.repository.UserRepository;
import com.example.loanmanagement.service.LoanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AdminController {

    private final LoanService loanService;
    private final LoanApplicationRepository loanRepository;
    private final UserRepository userRepository;
    private final EmiScheduleRepository emiRepository;

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getDashboard() {
        Map<String, Object> dashboard = new HashMap<>();
        
        long totalUsers = userRepository.count();
        long totalLoans = loanRepository.count();
        long pendingLoans = loanRepository.findByStatus(LoanStatus.SUBMITTED).size();
        long approvedLoans = loanRepository.findByStatus(LoanStatus.APPROVED).size();
        long rejectedLoans = loanRepository.findByStatus(LoanStatus.REJECTED).size();
        
        // Calculate total loan amount
        List<LoanApplication> allLoans = loanRepository.findAll();
        BigDecimal totalLoanAmount = allLoans.stream()
                .map(LoanApplication::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal approvedLoanAmount = loanRepository.findByStatus(LoanStatus.APPROVED).stream()
                .map(LoanApplication::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        dashboard.put("totalUsers", totalUsers);
        dashboard.put("totalLoans", totalLoans);
        dashboard.put("pendingLoans", pendingLoans);
        dashboard.put("approvedLoans", approvedLoans);
        dashboard.put("rejectedLoans", rejectedLoans);
        dashboard.put("totalLoanAmount", totalLoanAmount);
        dashboard.put("approvedLoanAmount", approvedLoanAmount);
        
        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/loans")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<LoanApplication>> getAllLoans() {
        List<LoanApplication> loans = loanService.getAllLoans();
        return ResponseEntity.ok(loans);
    }

    @GetMapping("/loans/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<LoanApplication>> getPendingLoans() {
        List<LoanApplication> loans = loanRepository.findByStatus(LoanStatus.SUBMITTED);
        return ResponseEntity.ok(loans);
    }

    @PutMapping("/loans/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LoanApplication> updateLoanStatus(
            @PathVariable UUID id,
            @RequestBody Map<String, String> payload) {
        
        String statusStr = payload.get("status");
        String remarks = payload.get("remarks");
        
        if (statusStr == null) {
            throw new IllegalArgumentException("Status is required");
        }
        
        LoanStatus status = LoanStatus.valueOf(statusStr.toUpperCase());
        LoanApplication updatedLoan = loanService.updateLoanStatus(id, status, remarks);
        
        return ResponseEntity.ok(updatedLoan);
    }

    @PutMapping("/loans/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LoanApplication> approveLoan(@PathVariable UUID id) {
        LoanApplication updatedLoan = loanService.updateLoanStatus(id, LoanStatus.APPROVED, null);
        return ResponseEntity.ok(updatedLoan);
    }

    @PutMapping("/loans/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LoanApplication> rejectLoan(
            @PathVariable UUID id,
            @RequestBody Map<String, String> payload) {
        
        String reason = payload.get("reason");
        LoanApplication updatedLoan = loanService.updateLoanStatus(id, LoanStatus.REJECTED, reason);
        return ResponseEntity.ok(updatedLoan);
    }
}

