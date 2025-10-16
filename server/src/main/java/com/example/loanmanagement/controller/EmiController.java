package com.example.loanmanagement.controller;

import com.example.loanmanagement.entity.EmiSchedule;
import com.example.loanmanagement.service.EmiService;
import com.example.loanmanagement.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/emi")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class EmiController {

    private final EmiService emiService;
    private final JwtService jwtService;

    @GetMapping("/schedule/{loanId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<EmiSchedule>> getEmiSchedule(@PathVariable UUID loanId) {
        List<EmiSchedule> schedule = emiService.getEmiScheduleByLoanId(loanId);
        return ResponseEntity.ok(schedule);
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<EmiSchedule>> getPendingEmis(
            @RequestHeader("Authorization") String token) {
        
        UUID userId = jwtService.extractUserId(token.replace("Bearer ", ""));
        List<EmiSchedule> pendingEmis = emiService.getPendingEmis(userId);
        return ResponseEntity.ok(pendingEmis);
    }

    @PutMapping("/{id}/pay")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<EmiSchedule> payEmi(
            @PathVariable UUID id,
            @RequestBody Map<String, String> payload) {
        
        String transactionId = payload.get("transactionId");
        if (transactionId == null || transactionId.isEmpty()) {
            throw new IllegalArgumentException("Transaction ID is required");
        }
        
        EmiSchedule paidEmi = emiService.payEmi(id, transactionId);
        return ResponseEntity.ok(paidEmi);
    }
}
