package com.example.loanmanagement.service;

import com.example.loanmanagement.dto.AuthRequest;
import com.example.loanmanagement.dto.AuthResponse;
import com.example.loanmanagement.dto.SignupRequest;

public interface AuthService {

    AuthResponse signup(SignupRequest request);

    AuthResponse login(AuthRequest request);

    AuthResponse refreshToken(String refreshToken);
}
