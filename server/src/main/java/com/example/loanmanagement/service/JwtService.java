package com.example.loanmanagement.service;

import com.example.loanmanagement.dto.AuthResponse;
import com.example.loanmanagement.entity.User;

import java.util.UUID;

public interface JwtService {

	AuthResponse generateTokens(User user);

	AuthResponse refreshTokens(String refreshToken);

	UUID extractUserId(String token);

	boolean isRefreshToken(String token);
}
