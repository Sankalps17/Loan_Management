package com.example.loanmanagement.service;

import com.example.loanmanagement.entity.LoanDocument;
import com.example.loanmanagement.entity.enums.DocumentType;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

public interface DocumentService {
    LoanDocument uploadDocument(UUID loanId, DocumentType documentType, MultipartFile file) throws IOException;
    List<LoanDocument> getDocumentsByLoanId(UUID loanId);
    LoanDocument getDocumentById(UUID documentId);
    byte[] downloadDocument(UUID documentId) throws IOException;
    void deleteDocument(UUID documentId) throws IOException;
}
