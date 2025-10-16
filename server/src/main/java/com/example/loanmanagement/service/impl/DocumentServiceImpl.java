package com.example.loanmanagement.service.impl;

import com.example.loanmanagement.entity.LoanApplication;
import com.example.loanmanagement.entity.LoanDocument;
import com.example.loanmanagement.entity.enums.DocumentType;
import com.example.loanmanagement.repository.LoanApplicationRepository;
import com.example.loanmanagement.repository.LoanDocumentRepository;
import com.example.loanmanagement.service.DocumentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class DocumentServiceImpl implements DocumentService {

    private final LoanDocumentRepository documentRepository;
    private final LoanApplicationRepository loanRepository;

    @Value("${file.upload.dir:uploads/documents}")
    private String uploadDir;

    @Override
    @Transactional
    public LoanDocument uploadDocument(UUID loanId, DocumentType documentType, MultipartFile file) throws IOException {
        // Validate loan exists
        LoanApplication loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found with id: " + loanId));

        // Validate file
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        // Create upload directory if not exists
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : "";
        String uniqueFilename = UUID.randomUUID().toString() + extension;
        Path filePath = uploadPath.resolve(uniqueFilename);

        // Save file
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Save document metadata to database
        LoanDocument document = new LoanDocument();
        document.setLoan(loan);
        document.setDocumentType(documentType);
        document.setFileName(originalFilename);
        document.setFilePath(filePath.toString());
        document.setUploadedAt(OffsetDateTime.now());

        LoanDocument savedDocument = documentRepository.save(document);
        log.info("Document uploaded successfully: {}", uniqueFilename);

        return savedDocument;
    }

    @Override
    public List<LoanDocument> getDocumentsByLoanId(UUID loanId) {
        return documentRepository.findByLoanId(loanId);
    }

    @Override
    public LoanDocument getDocumentById(UUID documentId) {
        return documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found with id: " + documentId));
    }

    @Override
    public byte[] downloadDocument(UUID documentId) throws IOException {
        LoanDocument document = getDocumentById(documentId);
        Path filePath = Paths.get(document.getFilePath());
        
        if (!Files.exists(filePath)) {
            throw new RuntimeException("File not found: " + document.getFileName());
        }
        
        return Files.readAllBytes(filePath);
    }

    @Override
    @Transactional
    public void deleteDocument(UUID documentId) throws IOException {
        LoanDocument document = getDocumentById(documentId);
        Path filePath = Paths.get(document.getFilePath());
        
        // Delete physical file
        if (Files.exists(filePath)) {
            Files.delete(filePath);
        }
        
        // Delete database record
        documentRepository.delete(document);
        log.info("Document deleted successfully: {}", document.getFileName());
    }
}
