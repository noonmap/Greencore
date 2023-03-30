package com.chicochico.config;


import com.chicochico.common.service.AuthTokenProvider;
import com.chicochico.common.service.OuathService;
import com.chicochico.common.service.RedisService;
import com.chicochico.domain.user.service.CustomUserDetailsService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.firebase.auth.FirebaseAuth;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.config.annotation.SecurityConfigurerAdapter;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.DefaultSecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


// 직접 만든 TokenProvider 와 JwtFilter 를 SecurityConfig 에 적용할 때 사용
@Log4j2
@RequiredArgsConstructor
public class JwtSecurityConfig extends SecurityConfigurerAdapter<DefaultSecurityFilterChain, HttpSecurity> {

	private final AuthTokenProvider tokenProvider;
	private final RedisService redisService;
	private final JwtExceptionFilter jwtExceptionFilter;
	private final FirebaseAuth firebaseAuth;
	private final CustomUserDetailsService userDetailsService;
	private final OuathService ouathService;
	private final ObjectMapper objectMapper;


	// TokenProvider 를 주입받아서 JwtFilter 를 통해 Security 로직에 필터를 등록
	@Override
	public void configure(HttpSecurity http) {
		JwtFilter customFilter = new JwtFilter(tokenProvider, redisService, firebaseAuth, userDetailsService, ouathService, objectMapper);
		http.addFilterBefore(customFilter, UsernamePasswordAuthenticationFilter.class);
		http.addFilterBefore(jwtExceptionFilter, customFilter.getClass());
	}

}