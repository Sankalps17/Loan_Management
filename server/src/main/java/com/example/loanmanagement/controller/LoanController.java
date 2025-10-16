package com.example.loanmanagement.controller;

import com.example.loanmanagement.dto.LoanApplicationRequest;
import com.example.loanmanagement.entity.LoanApplication;
import com.example.loanmanagement.service.JwtService;
import com.example.loanmanagement.service.LoanService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/loans")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class LoanController {

    private final LoanService loanService;
    private final JwtService jwtService;

    @PostMapping("/apply")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<LoanApplication> applyForLoan(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody LoanApplicationRequest request) {
        
        UUID userId = jwtService.extractUserId(token.replace("Bearer ", ""));
        LoanApplication loan = loanService.applyForLoan(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(loan);
    }

    @GetMapping("/my-loans")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<LoanApplication>> getMyLoans(
            @RequestHeader("Authorization") String token) {
        
        UUID userId = jwtService.extractUserId(token.replace("Bearer ", ""));
        List<LoanApplication> loans = loanService.getUserLoans(userId);
        return ResponseEntity.ok(loans);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<LoanApplication> getLoanById(@PathVariable UUID id) {
        LoanApplication loan = loanService.getLoanById(id);
        return ResponseEntity.ok(loan);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<LoanApplication>> getAllLoans() {
        List<LoanApplication> loans = loanService.getAllLoans();
        return ResponseEntity.ok(loans);
    }
}
