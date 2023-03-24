package com.chicochico;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;

import javax.annotation.PostConstruct;
import java.util.Date;
import java.util.TimeZone;


@SpringBootApplication
@EnableScheduling
@EnableJpaAuditing
public class ChicochicoApplication {

	public static void main(String[] args) {
		SpringApplication.run(ChicochicoApplication.class, args);
	}


	@PostConstruct
	public void started() {
		TimeZone.setDefault(TimeZone.getTimeZone("Asia/Seoul"));
		System.out.println("Current Time: " + new Date());
	}

}
