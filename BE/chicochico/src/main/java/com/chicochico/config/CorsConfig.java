package com.chicochico.config;


@Configuration
public class CorsConfig implements WebMvcConfigurer {

	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/**")
			.allowedOrigins("http://localhost:8080", "https://i8e201.p.ssafy.io/", "http://localhost:3000")
			.allowedMethods("GET", "POST", "PUT", "DELETE")
			.allowCredentials(true);
	}

}

