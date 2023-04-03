package com.chicochico.common.service;


import com.fasterxml.jackson.databind.JsonNode;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.net.ssl.HttpsURLConnection;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;


@Log4j2
@Service
public class OauthService {

	private static final String KAKAO_API_SERVER_HOST = "https://kapi.kakao.com";
	private static final String KAKAO_OAUTH_API_SERVER_HOST = "https://kauth.kakao.com";
	private static final String KAKAO_USER_ACCESS_TOKEN_INFO = "/v1/user/access_token_info";
	private static final String KAKAO_USER_ME_PATH = "/v2/user/me";
	private static final String KAKAO_OAUTH_TOKEN = "/oauth/token";
	private static final String FIREBASE_API_SERVER_HOST = "https://securetoken.googleapis.com/v1/token?key=";
	@Value("${kakao.config.rest-api-key}")
	private String KAKAO_REST_API_KEY;
	@Value("${kakao.config.client-secret}")
	private String KAKAO_CLIENT_SECRET;
	private String accessToken;  // kakao accessToken임
	@Value("${firebase.config.rest-api-key}")
	private String FIREBASE_REST_API_KEY;


	public void setAccessToken(final String accessToken) {
		this.accessToken = accessToken;
	}


	/**
	 * 카카오 토큰 정보 보기 (유효성 확인)
	 *
	 * @return {
	 * "expiresInMillis": Long,
	 * "id": Long,
	 * }
	 */
	public String getKakaoUserAccessTokenInfo() {
		return request(KAKAO_API_SERVER_HOST + KAKAO_USER_ACCESS_TOKEN_INFO);
	}


	/**
	 * 카카오 사용자 정보 가져오기
	 *
	 * @return 사용자 정보
	 */
	public String kakaoMe() {
		return request(KAKAO_API_SERVER_HOST + KAKAO_USER_ME_PATH);
	}


	/**
	 * 카카오 토큰 갱신하기
	 *
	 * @param params params.put("refresh_token", "refresh_token");
	 * @return 재발급된 access token
	 */
	public String kakaoRefreshToken(Map<String, String> params) {
		params.put("grant_type", "refresh_token");
		params.put("client_id", KAKAO_REST_API_KEY);
		params.put("client_secret", KAKAO_CLIENT_SECRET);

		String requestUrl = KAKAO_OAUTH_API_SERVER_HOST + KAKAO_OAUTH_TOKEN;
		return request(HttpMethodType.POST, requestUrl, mapToParams(params), OauthType.KAKAO);
	}


	/**
	 * firebase refresh 토큰으로 access 토큰 갱신하기
	 *
	 * @param params params.put("refresh_token", "refresh_token");
	 * @return 재발급된 access token
	 */
	public String firebaseRefreshToken(Map<String, String> params) {
		params.put("grant_type", "refresh_token");
		String requestUrl = FIREBASE_API_SERVER_HOST + FIREBASE_REST_API_KEY;
		return request(HttpMethodType.POST, requestUrl, mapToParams(params), OauthType.FIREBASE);
	}


	public String request(final String requestUrl) {
		return request(HttpMethodType.GET, requestUrl, null, OauthType.KAKAO);
	}


	public String request(HttpMethodType httpMethod, String requestUrl, final String params, final OauthType oauthType) {

		if (httpMethod == null) {
			httpMethod = HttpMethodType.GET;
		}
		if (params != null && params.length() > 0
			&& httpMethod == HttpMethodType.GET) {
			requestUrl += params;
		}

		HttpsURLConnection conn;
		OutputStreamWriter writer = null;
		BufferedReader reader = null;
		InputStreamReader isr = null;

		try {
			final URL url = new URL(requestUrl);
			conn = (HttpsURLConnection) url.openConnection();
			conn.setRequestMethod(httpMethod.toString());

			if (oauthType == OauthType.KAKAO)
				conn.setRequestProperty("Authorization", "Bearer " + this.accessToken);

			conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
			conn.setRequestProperty("charset", "utf-8");

			if (params != null && params.length() > 0 && httpMethod == HttpMethodType.POST) {
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
			log.info(oauthType + "의 유효한 토큰이 아님");

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


	public String urlEncodeUTF8(String s) {
		return URLEncoder.encode(s, StandardCharsets.UTF_8);
	}


	public String mapToParams(Map<String, String> map) {
		StringBuilder paramBuilder = new StringBuilder();
		for (String key : map.keySet()) {
			paramBuilder.append(paramBuilder.length() > 0 ? "&" : "");
			paramBuilder.append(String.format("%s=%s", urlEncodeUTF8(key),
				urlEncodeUTF8(map.get(key).toString())));
		}
		return paramBuilder.toString();
	}


	public String getStringValue(JsonNode parentNode, String... propertyNames) {
		JsonNode node = parentNode;
		for (String propertyName : propertyNames) {
			node = node.get(propertyName);
			if (node == null) {
				return null;
			}
		}
		return node.asText();
	}


	public enum HttpMethodType {POST, GET}

	private enum OauthType {FIREBASE, KAKAO}

}