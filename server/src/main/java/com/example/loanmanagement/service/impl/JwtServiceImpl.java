package com.example.loanmanagement.service.impl;

import com.example.loanmanagement.dto.AuthResponse;
import com.example.loanmanagement.entity.User;
import com.example.loanmanagement.repository.UserRepository;
import com.example.loanmanagement.service.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtServiceImpl implements JwtService {

	private static final String CLAIM_TOKEN_TYPE = "type";
	private static final String TOKEN_TYPE_ACCESS = "access";
	private static final String TOKEN_TYPE_REFRESH = "refresh";

	private final UserRepository userRepository;
	private final Key signingKey;
	private final long accessTokenValidity;
	private final long refreshTokenValidity;
	private final String issuer;

	public JwtServiceImpl(UserRepository userRepository,
						  @Value("${security.jwt.secret}") String secret,
						  @Value("${security.jwt.access-token-validity}") long accessTokenValidity,
						  @Value("${security.jwt.refresh-token-validity}") long refreshTokenValidity,
						  @Value("${security.jwt.issuer}") String issuer) {
		this.userRepository = userRepository;
		this.signingKey = buildSigningKey(secret);
		this.accessTokenValidity = accessTokenValidity;
		this.refreshTokenValidity = refreshTokenValidity;
		this.issuer = issuer;
	}

	@Override
	public AuthResponse generateTokens(User user) {
		String accessToken = buildToken(user, accessTokenValidity, TOKEN_TYPE_ACCESS);
		String refreshToken = buildToken(user, refreshTokenValidity, TOKEN_TYPE_REFRESH);
		return new AuthResponse(accessToken, refreshToken);
	}

	@Override
	public AuthResponse refreshTokens(String refreshToken) {
		Claims claims = parseClaims(refreshToken);
		if (!TOKEN_TYPE_REFRESH.equals(claims.get(CLAIM_TOKEN_TYPE, String.class))) {
			throw new IllegalArgumentException("Invalid refresh token");
		}

		UUID userId = UUID.fromString(claims.getSubject());
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new IllegalArgumentException("User not found for refresh token"));
		return generateTokens(user);
	}

	@Override
	public UUID extractUserId(String token) {
		Claims claims = parseClaims(token);
		return UUID.fromString(claims.getSubject());
	}

	@Override
	public boolean isRefreshToken(String token) {
		Claims claims = parseClaims(token);
		return TOKEN_TYPE_REFRESH.equals(claims.get(CLAIM_TOKEN_TYPE, String.class));
	}

	private String buildToken(User user, long validity, String type) {
		Instant now = Instant.now();
		return Jwts.builder()
				.setSubject(user.getId().toString())
				.setIssuer(issuer)
				.claim("email", user.getEmail())
				.claim("role", user.getRole().name())
				.claim(CLAIM_TOKEN_TYPE, type)
				.setIssuedAt(Date.from(now))
				.setExpiration(Date.from(now.plusMillis(validity)))
				.signWith(signingKey, SignatureAlgorithm.HS256)
				.compact();
	}

	private Claims parseClaims(String token) {
		try {
			return Jwts.parserBuilder()
					.setSigningKey(signingKey)
					.requireIssuer(issuer)
					.build()
					.parseClaimsJws(token)
					.getBody();
		} catch (ExpiredJwtException ex) {
			throw new IllegalArgumentException("Token expired", ex);
		} catch (JwtException ex) {
			throw new IllegalArgumentException("Invalid token", ex);
		}
	}

	private Key buildSigningKey(String secret) {
		byte[] keyBytes;
		try {
			keyBytes = Decoders.BASE64.decode(secret);
		} catch (IllegalArgumentException ex) {
			keyBytes = secret.getBytes(StandardCharsets.UTF_8);
		}

		if (keyBytes.length < 32) {
			throw new IllegalArgumentException("JWT secret must be at least 256 bits");
		}

		return Keys.hmacShaKeyFor(keyBytes);
	}
}
