package com.example.loanmanagement.service.impl;

import com.example.loanmanagement.entity.EmiSchedule;
import com.example.loanmanagement.entity.LoanApplication;
import com.example.loanmanagement.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.text.NumberFormat;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;
    private static final String FROM_EMAIL = "noreply@loanmanagement.com";
    private final NumberFormat currencyFormatter = NumberFormat.getCurrencyInstance(new Locale("en", "IN"));
    private final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd-MMM-yyyy");

    @Override
    public void sendLoanApplicationConfirmation(String email, LoanApplication loan) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(FROM_EMAIL);
            message.setTo(email);
            message.setSubject("Loan Application Received - Application ID: " + loan.getId());
            message.setText(String.format(
                    "Dear %s,\n\n" +
                    "Your home loan application has been received successfully.\n\n" +
                    "Application Details:\n" +
                    "Application ID: %s\n" +
                    "Loan Amount: %s\n" +
                    "Property Value: %s\n" +
                    "Tenure: %d months (%d years)\n" +
                    "Interest Rate: %.2f%%\n" +
                    "Application Date: %s\n\n" +
                    "Your application is currently under review. We will notify you once it's processed.\n\n" +
                    "Thank you for choosing our services.\n\n" +
                    "Best Regards,\n" +
                    "Loan Management Team",
                    loan.getApplicant().getFullName(),
                    loan.getId(),
                    currencyFormatter.format(loan.getAmount()),
                    currencyFormatter.format(loan.getPropertyValue()),
                    loan.getTenureMonths(),
                    loan.getTenureMonths() / 12,
                    loan.getInterestRate(),
                    loan.getSubmittedAt().format(dateFormatter)
            ));
            
            mailSender.send(message);
            log.info("Loan application confirmation email sent to: {}", email);
        } catch (Exception e) {
            log.error("Failed to send email to: {}. Error: {}", email, e.getMessage());
        }
    }

    @Override
    public void sendLoanStatusUpdate(String email, LoanApplication loan) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(FROM_EMAIL);
            message.setTo(email);
            message.setSubject("Loan Application Status Update - ID: " + loan.getId());
            
            String statusMessage = "Your loan application status has been updated to: " + loan.getStatus();
            
            message.setText(String.format(
                    "Dear %s,\n\n" +
                    "%s\n\n" +
                    "Application ID: %s\n" +
                    "Loan Amount: %s\n\n" +
                    "For any queries, please contact our support team.\n\n" +
                    "Best Regards,\n" +
                    "Loan Management Team",
                    loan.getApplicant().getFullName(),
                    statusMessage,
                    loan.getId(),
                    currencyFormatter.format(loan.getAmount())
            ));
            
            mailSender.send(message);
            log.info("Loan status update email sent to: {}", email);
        } catch (Exception e) {
            log.error("Failed to send email to: {}. Error: {}", email, e.getMessage());
        }
    }

    @Override
    public void sendEmiPaymentConfirmation(String email, EmiSchedule emi) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(FROM_EMAIL);
            message.setTo(email);
            message.setSubject("EMI Payment Confirmation - Loan ID: " + emi.getLoan().getId());
            message.setText(String.format(
                    "Dear %s,\n\n" +
                    "Your EMI payment has been received successfully.\n\n" +
                    "Payment Details:\n" +
                    "Loan ID: %s\n" +
                    "Amount Paid: %s\n" +
                    "Due Date: %s\n" +
                    "Transaction ID: %s\n\n" +
                    "Thank you for your timely payment.\n\n" +
                    "Best Regards,\n" +
                    "Loan Management Team",
                    emi.getLoan().getApplicant().getFullName(),
                    emi.getLoan().getId(),
                    currencyFormatter.format(emi.getAmount()),
                    emi.getDueDate().format(dateFormatter),
                    emi.getTransactionId()
            ));
            
            mailSender.send(message);
            log.info("EMI payment confirmation email sent to: {}", email);
        } catch (Exception e) {
            log.error("Failed to send email to: {}. Error: {}", email, e.getMessage());
        }
    }

    @Override
    public void sendEmiReminder(String email, EmiSchedule emi) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(FROM_EMAIL);
            message.setTo(email);
            message.setSubject("EMI Payment Reminder - Due Date: " + emi.getDueDate().format(dateFormatter));
            message.setText(String.format(
                    "Dear %s,\n\n" +
                    "This is a reminder that your EMI payment is due.\n\n" +
                    "EMI Details:\n" +
                    "Loan ID: %s\n" +
                    "Due Date: %s\n" +
                    "Amount Due: %s\n\n" +
                    "Please ensure sufficient balance in your account to avoid late payment charges.\n\n" +
                    "Best Regards,\n" +
                    "Loan Management Team",
                    emi.getLoan().getApplicant().getFullName(),
                    emi.getLoan().getId(),
                    emi.getDueDate().format(dateFormatter),
                    currencyFormatter.format(emi.getAmount())
            ));
            
            mailSender.send(message);
            log.info("EMI reminder email sent to: {}", email);
        } catch (Exception e) {
            log.error("Failed to send email to: {}. Error: {}", email, e.getMessage());
        }
    }
}
