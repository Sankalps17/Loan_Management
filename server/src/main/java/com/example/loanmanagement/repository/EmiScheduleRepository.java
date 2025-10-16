package com.example.loanmanagement.repository;

import com.example.loanmanagement.entity.EmiSchedule;
import com.example.loanmanagement.entity.LoanApplication;
import com.example.loanmanagement.entity.enums.PaymentStatus;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmiScheduleRepository extends JpaRepository<EmiSchedule, UUID> {
    List<EmiSchedule> findByLoan(LoanApplication loan);
    List<EmiSchedule> findByLoanAndPaymentStatus(LoanApplication loan, PaymentStatus status);
    List<EmiSchedule> findByDueDateBeforeAndPaymentStatus(LocalDate dueDate, PaymentStatus status);
}
