package com.example.loanmanagement.service;

import com.example.loanmanagement.entity.EmiSchedule;
import com.example.loanmanagement.entity.LoanApplication;

import java.util.List;
import java.util.UUID;

public interface EmiService {
    void generateEmiSchedule(LoanApplication loan);
    List<EmiSchedule> getEmiScheduleByLoanId(UUID loanId);
    EmiSchedule payEmi(UUID emiId, String transactionId);
    List<EmiSchedule> getPendingEmis(UUID userId);
}
