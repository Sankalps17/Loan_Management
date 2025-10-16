package com.example.loanmanagement.service.impl;

import com.example.loanmanagement.entity.EmiSchedule;
import com.example.loanmanagement.entity.LoanApplication;
import com.example.loanmanagement.entity.enums.PaymentStatus;
import com.example.loanmanagement.repository.EmiScheduleRepository;
import com.example.loanmanagement.repository.LoanApplicationRepository;
import com.example.loanmanagement.service.EmailService;
import com.example.loanmanagement.service.EmiService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EmiServiceImpl implements EmiService {

    private final EmiScheduleRepository emiRepository;
    private final LoanApplicationRepository loanRepository;
    private final EmailService emailService;

    @Override
    @Transactional
    public void generateEmiSchedule(LoanApplication loan) {
        List<EmiSchedule> schedules = new ArrayList<>();
        LocalDate startDate = LocalDate.now().plusMonths(1);
        
        BigDecimal principal = loan.getAmount();
        BigDecimal monthlyRate = loan.getInterestRate()
                .divide(BigDecimal.valueOf(12), 10, RoundingMode.HALF_UP)
                .divide(BigDecimal.valueOf(100), 10, RoundingMode.HALF_UP);
        
        // Calculate EMI amount
        BigDecimal onePlusR = BigDecimal.ONE.add(monthlyRate);
        BigDecimal onePlusRPowerN = onePlusR.pow(loan.getTenureMonths());
        BigDecimal numerator = principal.multiply(monthlyRate).multiply(onePlusRPowerN);
        BigDecimal denominator = onePlusRPowerN.subtract(BigDecimal.ONE);
        BigDecimal emiAmount = numerator.divide(denominator, 2, RoundingMode.HALF_UP);

        for (int i = 1; i <= loan.getTenureMonths(); i++) {
            EmiSchedule emi = new EmiSchedule();
            emi.setLoan(loan);
            emi.setDueDate(startDate.plusMonths(i - 1));
            emi.setAmount(emiAmount);
            emi.setPaymentStatus(PaymentStatus.PENDING);
            schedules.add(emi);
        }

        emiRepository.saveAll(schedules);
    }

    @Override
    public List<EmiSchedule> getEmiScheduleByLoanId(UUID loanId) {
        LoanApplication loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));
        return emiRepository.findByLoan(loan);
    }

    @Override
    @Transactional
    public EmiSchedule payEmi(UUID emiId, String transactionId) {
        EmiSchedule emi = emiRepository.findById(emiId)
                .orElseThrow(() -> new RuntimeException("EMI not found with id: " + emiId));

        if (emi.getPaymentStatus() == PaymentStatus.PAID) {
            throw new RuntimeException("EMI already paid");
        }

        emi.setPaymentStatus(PaymentStatus.PAID);
        emi.setTransactionId(transactionId);

        EmiSchedule savedEmi = emiRepository.save(emi);
        
        // Send payment confirmation email
        try {
            emailService.sendEmiPaymentConfirmation(
                    emi.getLoan().getApplicant().getEmail(), 
                    savedEmi
            );
        } catch (Exception e) {
            // Log but don't fail
        }

        return savedEmi;
    }

    @Override
    public List<EmiSchedule> getPendingEmis(UUID userId) {
        List<LoanApplication> userLoans = loanRepository.findByApplicantId(userId);
        List<EmiSchedule> pendingEmis = new ArrayList<>();
        
        for (LoanApplication loan : userLoans) {
            pendingEmis.addAll(emiRepository.findByLoanAndPaymentStatus(loan, PaymentStatus.PENDING));
        }
        
        return pendingEmis;
    }
}
