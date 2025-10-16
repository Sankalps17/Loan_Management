package com.example.loanmanagement.service.impl;

import com.example.loanmanagement.dto.LoanApplicationRequest;
import com.example.loanmanagement.entity.LoanApplication;
import com.example.loanmanagement.entity.User;
import com.example.loanmanagement.entity.enums.LoanStatus;
import com.example.loanmanagement.repository.LoanApplicationRepository;
import com.example.loanmanagement.repository.UserRepository;
import com.example.loanmanagement.service.EmailService;
import com.example.loanmanagement.service.EmiService;
import com.example.loanmanagement.service.LoanService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LoanServiceImpl implements LoanService {

    private final LoanApplicationRepository loanRepository;
    private final UserRepository userRepository;
    private final EmiService emiService;
    private final EmailService emailService;

    @Override
    @Transactional
    public LoanApplication applyForLoan(UUID userId, LoanApplicationRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LoanApplication loan = new LoanApplication();
        loan.setApplicant(user);
        loan.setAmount(request.getAmount());
        loan.setPropertyValue(request.getPropertyValue());
        loan.setTenureMonths(request.getTenureMonths());
        loan.setInterestRate(request.getInterestRate());
        loan.setPurpose(request.getPurpose());
        loan.setStatus(LoanStatus.SUBMITTED);
        loan.setSubmittedAt(OffsetDateTime.now());

        LoanApplication savedLoan = loanRepository.save(loan);
        
        // Generate EMI schedule
        emiService.generateEmiSchedule(savedLoan);
        
        // Send email notification
        try {
            emailService.sendLoanApplicationConfirmation(user.getEmail(), savedLoan);
        } catch (Exception e) {
            // Log but don't fail the transaction
        }

        return savedLoan;
    }

    @Override
    public List<LoanApplication> getUserLoans(UUID userId) {
        return loanRepository.findByApplicantId(userId);
    }

    @Override
    public List<LoanApplication> getAllLoans() {
        return loanRepository.findAll();
    }

    @Override
    public LoanApplication getLoanById(UUID loanId) {
        return loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found with id: " + loanId));
    }

    @Override
    @Transactional
    public LoanApplication updateLoanStatus(UUID loanId, LoanStatus status, String remarks) {
        LoanApplication loan = getLoanById(loanId);
        loan.setStatus(status);
        loan.setUpdatedAt(OffsetDateTime.now());
        
        LoanApplication updatedLoan = loanRepository.save(loan);
        
        // Send email notification
        try {
            emailService.sendLoanStatusUpdate(loan.getApplicant().getEmail(), updatedLoan);
        } catch (Exception e) {
            // Log but don't fail the transaction
        }
        
        return updatedLoan;
    }

    @Override
    public BigDecimal calculateMonthlyEMI(BigDecimal principal, BigDecimal annualInterestRate, int tenureInMonths) {
        // EMI = [P x R x (1+R)^N]/[(1+R)^N-1]
        // P = Principal loan amount
        // R = Monthly interest rate (annual rate / 12 / 100)
        // N = Loan tenure in months
        
        if (annualInterestRate.compareTo(BigDecimal.ZERO) == 0) {
            return principal.divide(BigDecimal.valueOf(tenureInMonths), 2, RoundingMode.HALF_UP);
        }
        
        BigDecimal monthlyRate = annualInterestRate
                .divide(BigDecimal.valueOf(12), 10, RoundingMode.HALF_UP)
                .divide(BigDecimal.valueOf(100), 10, RoundingMode.HALF_UP);
        
        BigDecimal onePlusR = BigDecimal.ONE.add(monthlyRate);
        BigDecimal onePlusRPowerN = onePlusR.pow(tenureInMonths);
        
        BigDecimal numerator = principal
                .multiply(monthlyRate)
                .multiply(onePlusRPowerN);
        
        BigDecimal denominator = onePlusRPowerN.subtract(BigDecimal.ONE);
        
        return numerator.divide(denominator, 2, RoundingMode.HALF_UP);
    }
}
