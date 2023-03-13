package com.chicochico.common.service;


import com.chicochico.domain.user.entity.UserEntity;
import com.chicochico.domain.user.repository.UserRepository;
import com.chicochico.exception.CustomException;
import com.chicochico.exception.ErrorCode;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import io.jsonwebtoken.*;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.*;


@Log4j2
@Component
public class AuthTokenProvider {

	private final String secretKey;
	private final UserRepository userRepository;
	@Value("${jwt.expire.access}")
	private String accessExpiry; // 토큰 만료일
	@Value("${jwt.expire.refresh}")
	private String refreshExpiry; // 토큰 만료일
	private ObjectMapper objectMapper;


	@Autowired
	public AuthTokenProvider(UserRepository userRepository, @Value("${jwt.secret}") String secretKey) {
		this.secretKey = Base64.getEncoder().encodeToString(secretKey.getBytes());
		objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());
		this.userRepository = userRepository;
	}


	/**
	 * 토큰 생성
	 */
	private String createToken(Long userId, String nickname, TokenType tokenType) {
		// 토큰에 넣을 정보를 string으로 생성
		Map<String, String> tokenInfo = new HashMap<>();
		tokenInfo.put("userId", String.valueOf(userId));
		tokenInfo.put("nickname", nickname);
		tokenInfo.put("tokenType", tokenType.name());
		String tokenInfoStr;
		try {
			tokenInfoStr = objectMapper.writeValueAsString(tokenInfo);
		} catch (JsonProcessingException e) {
			log.error("토큰에 넣을 정보를 json으로 변환하는 것을 실패하였습니다");
			throw new CustomException(ErrorCode.TOKEN_ERROR);
		}

		// 토큰 발행일, 만료일 설정
		Date issuedDate = new Date();
		String expiryTime = tokenType.equals(TokenType.ACCESS) ? accessExpiry : refreshExpiry;
		Date expiryDate = new Date(issuedDate.getTime() + expiryTime);

		return Jwts.builder()
			.setSubject(tokenInfoStr)
			.setIssuedAt(issuedDate)
			.setExpiration(expiryDate)
			.signWith(SignatureAlgorithm.HS256, secretKey)
			.compact();
	}


	/**
	 * accessToken 생성
	 */
	public String createAccessToken(Long userId, String nickname) {
		return createToken(userId, nickname, TokenType.ACCESS);
	}


	/**
	 * refreshToken 생성
	 */
	public String createRefreshToken(Long userId, String nickname) {
		return createToken(userId, nickname, TokenType.REFRESH);
	}


	/**
	 * 토큰에 저장된 Subject(유저 정보)를 조회
	 */
	private String getSubject(String token) {
		try {
			return Jwts.parser()
				.setSigningKey(secretKey)
				.parseClaimsJws(token)
				.getBody() // token의 Body가 하기 exception들로 인해 유효하지 않으면 각각에 해당하는 로그 콘솔에 찍음
				.getSubject();
		} catch (SecurityException e) {
			log.error("Invalid JWT signature.");
			throw new CustomException(ErrorCode.TOKEN_ERROR);
		} catch (MalformedJwtException e) {
			log.error("Invalid JWT token.");
			// 처음 로그인(/auth/kakao, /auth/google) 시, AccessToken(AppToken) 없이 접근해도 token validate을 체크하기 때문에 exception 터트리지 않고 catch합니다.
			throw new CustomException(ErrorCode.TOKEN_ERROR);
		} catch (ExpiredJwtException e) {
			log.error("Expired JWT token.");
			throw new CustomException(ErrorCode.TOKEN_ERROR);
		} catch (UnsupportedJwtException e) {
			log.error("Unsupported JWT token.");
			throw new CustomException(ErrorCode.TOKEN_ERROR);
		} catch (IllegalArgumentException e) {
			log.error("JWT token compact of handler are invalid.");
			throw new CustomException(ErrorCode.TOKEN_ERROR);
		}
	}


	/**
	 * 토큰에서 유저 아이디(PK) 추출
	 */
	public Long getUserId(String token) {
		String subject = getSubject(token);
		try {
			Map<String, String> tokenInfo = objectMapper.readValue(subject, Map.class);
			return Long.valueOf(tokenInfo.get("userId"));
		} catch (JsonProcessingException e) {
			log.error("JWT token을 Map으로 변환하는 것을 실패했습니다.");
			throw new CustomException(ErrorCode.TOKEN_ERROR);
		}
	}


	/**
	 * 토큰에서 유저 닉네임 추출
	 */
	public String getUserNickname(String token) {
		String subject = getSubject(token);
		try {
			Map<String, String> tokenInfo = objectMapper.readValue(subject, Map.class);
			return tokenInfo.get("nickname");
		} catch (JsonProcessingException e) {
			log.error("JWT token을 Map으로 변환하는 것을 실패했습니다.");
			throw new CustomException(ErrorCode.TOKEN_ERROR);
		}
	}


	/**
	 * Redis에서 refresh token 삭제
	 */
	public void removeRefreshToken(String nickname) {
		// TODO
	}


	/**
	 * 토큰의 유효성 및 만료기간 검사
	 */
	public boolean validate(String token) {
		try {
			Jws<Claims> claims = Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token);
			return !claims.getBody().getExpiration().before(new Date());
		} catch (Exception e) {
			return false;
		}
	}


	/**
	 * 사용자가 DB에 저장되어있는 유효한 사용자인지 인증 후,
	 * SecurityContextHolder에 저장할 Authentication 객체 생성.
	 */
	public Authentication getAuthentication(String token) {
		Optional<UserEntity> user = userRepository.findById(this.getUserId(token));
		if (user.isEmpty()) throw new CustomException(ErrorCode.USER_NOT_FOUND);
		return new UsernamePasswordAuthenticationToken(user.get(), token);
	}


	private enum TokenType {
		ACCESS, REFRESH;
	}

}