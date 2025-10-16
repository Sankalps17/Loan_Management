package com.example.loanmanagement.service;

import com.example.loanmanagement.entity.EmiSchedule;
import com.example.loanmanagement.entity.LoanApplication;

public interface EmailService {
    void sendLoanApplicationConfirmation(String email, LoanApplication loan);
    void sendLoanStatusUpdate(String email, LoanApplication loan);
    void sendEmiPaymentConfirmation(String email, EmiSchedule emi);
    void sendEmiReminder(String email, EmiSchedule emi);
}
