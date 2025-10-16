package com.example.loanmanagement.controller;

import com.example.loanmanagement.entity.LoanDocument;
import com.example.loanmanagement.entity.enums.DocumentType;
import com.example.loanmanagement.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class DocumentController {

    private final DocumentService documentService;

    @PostMapping("/upload")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<LoanDocument> uploadDocument(
            @RequestParam("loanId") UUID loanId,
            @RequestParam("documentType") DocumentType documentType,
            @RequestParam("file") MultipartFile file) throws IOException {
        
        LoanDocument document = documentService.uploadDocument(loanId, documentType, file);
        return ResponseEntity.status(HttpStatus.CREATED).body(document);
    }

    @GetMapping("/loan/{loanId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<LoanDocument>> getDocumentsByLoanId(@PathVariable UUID loanId) {
        List<LoanDocument> documents = documentService.getDocumentsByLoanId(loanId);
        return ResponseEntity.ok(documents);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<LoanDocument> getDocumentById(@PathVariable UUID id) {
        LoanDocument document = documentService.getDocumentById(id);
        return ResponseEntity.ok(document);
    }

    @GetMapping("/{id}/download")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ByteArrayResource> downloadDocument(@PathVariable UUID id) throws IOException {
        LoanDocument document = documentService.getDocumentById(id);
        byte[] data = documentService.downloadDocument(id);
        
        ByteArrayResource resource = new ByteArrayResource(data);
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + document.getFileName() + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .contentLength(data.length)
                .body(resource);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteDocument(@PathVariable UUID id) throws IOException {
        documentService.deleteDocument(id);
        return ResponseEntity.noContent().build();
    }
}
