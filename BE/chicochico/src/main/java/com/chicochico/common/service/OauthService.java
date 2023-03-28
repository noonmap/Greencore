package com.chicochico.common.service;


import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.net.ssl.HttpsURLConnection;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Map;


@Service
@RequiredArgsConstructor
public class OauthService {

	// refresh 토큰을 ID 토큰으로 교환
	private static final String API_SERVER_HOST = "https://securetoken.googleapis.com/v1/token?key=";
	private final KakaoService kakaoService;
	@Value("${firebase.config.rest-api-key}")
	private String FIREBASE_REST_API_KEY;


	/**
	 * firebase refresh 토큰으로 access 토큰 갱신하기
	 *
	 * @param params params.put("refresh_token", "refresh_token");
	 * @return 재발급된 access token
	 */
	public String oauthRefreshToken(Map<String, String> params) {
		params.put("grant_type", "refresh_token");
		String requestUrl = API_SERVER_HOST + FIREBASE_REST_API_KEY;
		return request(KakaoService.HttpMethodType.POST, requestUrl, kakaoService.mapToParams(params));
	}


	public String request(KakaoService.HttpMethodType httpMethod, final String requestUrl, final String params) {

		HttpsURLConnection conn;
		OutputStreamWriter writer = null;
		BufferedReader reader = null;
		InputStreamReader isr = null;

		try {
			final URL url = new URL(requestUrl);
			conn = (HttpsURLConnection) url.openConnection();
			conn.setRequestMethod(httpMethod.toString());

			conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
			conn.setRequestProperty("charset", "utf-8");

			if (params != null && params.length() > 0 && httpMethod == KakaoService.HttpMethodType.POST) {
				conn.setDoOutput(true);
				writer = new OutputStreamWriter(conn.getOutputStream());
				writer.write(params);
				writer.flush();
			}

			final int responseCode = conn.getResponseCode();
			System.out.println(String.format("\nSending '%s' request to URL : %s", httpMethod, requestUrl));
			System.out.println("Response Code : " + responseCode);
			if (responseCode == 200)
				isr = new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8);
			else
				isr = new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8);

			reader = new BufferedReader(isr);
			final StringBuffer buffer = new StringBuffer();
			String line;
			while ((line = reader.readLine()) != null) {
				buffer.append(line);
			}
			System.out.println(buffer);
			return buffer.toString();

		} catch (IOException e) {
			e.printStackTrace();

		} finally {
			if (writer != null) try {
				writer.close();
			} catch (Exception ignore) {
			}
			if (reader != null) try {
				reader.close();
			} catch (Exception ignore) {
			}
			if (isr != null) try {
				isr.close();
			} catch (Exception ignore) {
			}
		}

		return null;
	}

}
