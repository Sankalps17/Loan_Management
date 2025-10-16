package com.example.loanmanagement.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class LoanApplicationRequest {

    @NotNull
    @DecimalMin(value = "10000.00", message = "Amount must be at least 10,000")
    private BigDecimal amount;

    @NotNull
    @Min(value = 6, message = "Tenure must be at least 6 months")
    private Integer tenureMonths;

    @NotNull
    @DecimalMin(value = "0.1", message = "Interest rate must be positive")
    private BigDecimal interestRate;

    @DecimalMin(value = "0.0", message = "Property value cannot be negative")
    private BigDecimal propertyValue;

    @NotBlank
    private String purpose;

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public Integer getTenureMonths() {
        return tenureMonths;
    }

    public void setTenureMonths(Integer tenureMonths) {
        this.tenureMonths = tenureMonths;
    }

    public BigDecimal getInterestRate() {
        return interestRate;
    }

    public void setInterestRate(BigDecimal interestRate) {
        this.interestRate = interestRate;
    }

    public BigDecimal getPropertyValue() {
        return propertyValue;
    }

    public void setPropertyValue(BigDecimal propertyValue) {
        this.propertyValue = propertyValue;
    }

    public String getPurpose() {
        return purpose;
    }

    public void setPurpose(String purpose) {
        this.purpose = purpose;
    }
}
