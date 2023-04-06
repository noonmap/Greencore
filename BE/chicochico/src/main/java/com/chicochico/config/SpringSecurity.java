package com.chicochico.config;


import com.chicochico.common.service.AuthTokenProvider;
import com.chicochico.common.service.OauthService;
import com.chicochico.common.service.RedisService;
import com.chicochico.domain.user.service.CustomUserDetailsService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.firebase.auth.FirebaseAuth;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication;
import org.springframework.boot.autoconfigure.security.ConditionalOnDefaultWebSecurity;
import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
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
	private final RedisService redisService;
	private final JwtExceptionFilter jwtExceptionFilter;
	private final FirebaseAuth firebaseAuth;
	private final CustomUserDetailsService userDetailsService;
	private final OauthService oauthService;
	private final ObjectMapper objectMapper;

	@Value("${spring.config.activate.on-profile}")
	private String onProfile;


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
				"/swagger-ui/**")
			.antMatchers("/login/oauth", "/login/kakao")
			.antMatchers("/login/**", "/user/nickname/{nickname}", "/user/email/{email}", "/refresh", "/mail/**", "/plant/**", "/type")
			.antMatchers(HttpMethod.POST, "/user");
	}


	@Bean
	@Order(SecurityProperties.BASIC_AUTH_ORDER)
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		// CSRF 설정 Disable
		http.csrf().disable()
			.cors()
			.and()

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
			.antMatchers("/login/**", "/user", "/user/nickname/{nickname}", "/user/email/{email}", "/refresh", "/mail/**", "/plant/**", "/type").permitAll()
			.antMatchers("/swagger-resources/**", "/swagger-ui", "/swagger-ui/**").permitAll()
			.anyRequest().authenticated()   // 나머지 API 는 전부 인증 필요

			// JwtFilter 를 addFilterBefore 로 등록했던 JwtSecurityConfig 클래스를 적용
			.and()
			.apply(new JwtSecurityConfig(tokenProvider, redisService, jwtExceptionFilter, firebaseAuth, userDetailsService, oauthService, objectMapper));

		http
			.logout()
			.logoutUrl("/logout") // 로그아웃 요청 처리를 위한 URL 설정
			.logoutSuccessUrl(getLogoutSuccessUrl()) // 로그아웃 성공 후 리다이렉트될 URL 설정
			.invalidateHttpSession(true); // 세션 무효화 여부 설정

		return http.build();
	}


	private String getLogoutSuccessUrl() {
		if (isLocal()) {
			return "http://localhost:8080/api/logout/redirect";
		} else {
			return "https://j8e101.p.ssafy.io/api/logout/redirect";
		}
	}


	private boolean isLocal() {
		return "local".equals(onProfile);
	}

}