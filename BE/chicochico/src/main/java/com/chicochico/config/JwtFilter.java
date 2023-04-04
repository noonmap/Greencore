package com.chicochico.config;


import com.chicochico.common.service.AuthTokenProvider;
import com.chicochico.common.service.OauthService;
import com.chicochico.common.service.RedisService;
import com.chicochico.domain.user.service.CustomUserDetailsService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;


@Log4j2
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

	public static final String AUTHORIZATION_HEADER = "authorization";
	public static final String BEARER_PREFIX = "Bearer ";

	private final AuthTokenProvider tokenProvider;
	private final RedisService redisService;
	private final FirebaseAuth firebaseAuth;
	private final CustomUserDetailsService userDetailsService;
	private final OauthService oauthService;
	private final ObjectMapper objectMapper;


	// 실제 필터링 로직은 doFilterInternal 에 들어감
	// JWT 토큰의 인증 정보를 현재 쓰레드의 SecurityContext 에 저장하는 역할 수행
	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws IOException, ServletException {
		// 1. Request Header 에서 토큰을 꺼냄
		String token = resolveToken(request);
		FirebaseToken decodedToken;

		log.info("여기: {}", request.getRequestURI());

		// 2. validateToken 으로 토큰 유효성 검사
		// 정상 토큰이면 해당 토큰으로 Authentication 을 가져와서 SecurityContext 에 저장
		if (StringUtils.hasText(token)) {

			if (tokenProvider.validate(token)) {
				// 3. Redis에 해당 accessToken 로그아웃 여부 확인
				String isLogout = redisService.getData(token);
				if (ObjectUtils.isEmpty(isLogout)) {
					Authentication authentication = tokenProvider.getAuthentication(token);
					SecurityContextHolder.getContext().setAuthentication(authentication);
				} else {
					throw new JwtException("로그아웃 된 accessToken 유효하지 않음");
				}
			} else {
				// FirebaseAuth를 이용하여 Token을 검증한다.
				try {
					decodedToken = firebaseAuth.verifyIdToken(token);
					// id를 firebase에서 제공하는 email를 사용함
					// 있는 유저라면 계속 진행하기
					UserDetails user = userDetailsService.loadUserByEmail(decodedToken.getEmail());
					UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
						user, null, user.getAuthorities());
					SecurityContextHolder.getContext().setAuthentication(authentication);

				} catch (FirebaseAuthException e) {
					oauthService.setAccessToken(token);
					String result = oauthService.getKakaoUserAccessTokenInfo();
					if (result == null)
						throw new JwtException("accessToken 유효하지 않음");

					String userInfo = oauthService.kakaoMe();

					JsonNode jsonNode = null;
					try {
						jsonNode = objectMapper.readTree(userInfo);
					} catch (JsonProcessingException ex) {
						throw new JwtException("accessToken 유효하지 않음");
					}

					JsonNode kakaoAccount = jsonNode.get("kakao_account");

					String kakaoEmail = oauthService.getStringValue(kakaoAccount, "email");

					UserDetails user = userDetailsService.loadUserByEmail(kakaoEmail);
					UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
						user, null, user.getAuthorities());
					SecurityContextHolder.getContext().setAuthentication(authentication);

				}
			}

		}
		filterChain.doFilter(request, response);
	}


	// Request Header 에서 토큰 정보를 꺼내오기
	private String resolveToken(HttpServletRequest request) {
		String bearerToken = request.getHeader(AUTHORIZATION_HEADER);
		if (StringUtils.hasText(bearerToken) && bearerToken.startsWith(BEARER_PREFIX)) {
			return bearerToken.substring(7);
		}
		return null;
	}

}