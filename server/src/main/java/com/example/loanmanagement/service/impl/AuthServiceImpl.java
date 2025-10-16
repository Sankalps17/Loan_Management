package com.example.loanmanagement.service.impl;

import com.example.loanmanagement.dto.AuthRequest;
import com.example.loanmanagement.dto.AuthResponse;
import com.example.loanmanagement.dto.SignupRequest;
import com.example.loanmanagement.entity.User;
import com.example.loanmanagement.entity.enums.Role;
import com.example.loanmanagement.repository.UserRepository;
import com.example.loanmanagement.service.AuthService;
import com.example.loanmanagement.service.JwtService;
import java.time.OffsetDateTime;
import java.util.Optional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Override
    public AuthResponse signup(SignupRequest request) {
        Optional<User> existing = userRepository.findByEmailIgnoreCase(request.getEmail());
        if (existing.isPresent()) {
            throw new IllegalArgumentException("Email already registered");
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);
        user.setCreatedAt(OffsetDateTime.now());
        userRepository.save(user);

        return jwtService.generateTokens(user);
    }

    @Override
    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmailIgnoreCase(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        return jwtService.generateTokens(user);
    }

    @Override
    public AuthResponse refreshToken(String refreshToken) {
        return jwtService.refreshTokens(refreshToken);
    }
}
