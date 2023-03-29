package com.chicochico.config;


import io.gorse.gorse4j.Gorse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class RecommenderConfig {

	@Value("${gorse.api_key}")
	private String api_key;
	@Value("${gorse.endpoint}")
	private String gorse_endpoint;


	@Bean
	public Gorse RecommenderService() {
		return new Gorse(gorse_endpoint, api_key);
	}

}
