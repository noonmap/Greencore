package com.chicochico.config;


import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import lombok.extern.log4j.Log4j2;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.io.InputStream;


// FirebaseAuth(인증 관련 모듈)을 초기화
@Log4j2
@Configuration
public class FirebaseConfig {

	//	@Value("${firebase.config.path}")
	//	private String firebaseConfig; // firebaseConfig


	@Bean
	public FirebaseApp firebaseApp() throws IOException {
		log.info("Initializing Firebase.");
		ClassPathResource firebase = new ClassPathResource("properties/firebaseAccountKey.json");
		InputStream serviceAccount = firebase.getInputStream();
		//		FileInputStream serviceAccount = new FileInputStream(firebaseConfig);
		//		FileInputStream serviceAccount = new FileInputStream(firebase.getFile());
		log.info("serviceAccount: {}", serviceAccount.toString());

		FirebaseOptions options = new FirebaseOptions.Builder()
			.setCredentials(GoogleCredentials.fromStream(serviceAccount))
			.setStorageBucket("ssafy-green-core.appspot.com")
			.build();

		FirebaseApp app = FirebaseApp.initializeApp(options);
		log.info("FirebaseApp initialized" + app.getName());
		return app;
	}


	//TODO Exception 처리
	@Bean
	public FirebaseAuth getFirebaseAuth() throws IOException {
		FirebaseAuth firebaseAuth = FirebaseAuth.getInstance(firebaseApp());
		return firebaseAuth;
	}

}