package com.chicochico.config;


import com.chicochico.common.service.AuthTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication;
import org.springframework.boot.autoconfigure.security.ConditionalOnDefaultWebSecurity;
import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;


@RequiredArgsConstructor
@EnableWebSecurity
@ConditionalOnDefaultWebSecurity
@ConditionalOnWebApplication(type = ConditionalOnWebApplication.Type.SERVLET)
public class SpringSecurity {

	private final AuthTokenProvider tokenProvider;


	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}


	@Bean
	public WebSecurityCustomizer webSecurityCustomizer() {
		return (web) -> web.ignoring()
			.antMatchers("/static/css/**", "/static/js/**", "*.ico", "/images/**", "/js/**", "/webjars/**")
			.antMatchers(
				"/v2/api-docs", "/configuration/ui",
				"/swagger-resources", "/configuration/security",
				"/swagger-ui.html", "/webjars/**", "/swagger/**",
				"/swagger-ui/**");
	}


	@Bean
	@Order(SecurityProperties.BASIC_AUTH_ORDER)
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		// CSRF 설정 Disable
		http.csrf().disable()
			.cors().disable()

			// exception handling 할 때 우리가 만든 클래스를 추가
			.exceptionHandling()

			.and()
			.headers()
			.frameOptions()
			.sameOrigin()

			// 시큐리티는 기본적으로 세션을 사용
			// 여기서는 세션을 사용하지 않기 때문에 세션 설정을 Stateless 로 설정
			.and()
			.sessionManagement()
			.sessionCreationPolicy(SessionCreationPolicy.STATELESS)

			// 로그인, 회원가입 API 는 토큰이 없는 상태에서 요청이 들어오기 때문에 permitAll 설정
			.and()
			.authorizeRequests()
			.antMatchers("/login/**", "/logout", "/user").permitAll()
			.antMatchers("/swagger-resources/**", "/swagger-ui", "/swagger-ui/**").permitAll()
			.anyRequest().authenticated()   // 나머지 API 는 전부 인증 필요

			// JwtFilter 를 addFilterBefore 로 등록했던 JwtSecurityConfig 클래스를 적용
			.and()
			.apply(new JwtSecurityConfig(tokenProvider));

		return http.build();
	}

}