package com.chicochico.common.service;


import com.chicochico.common.code.FeedbackType;
import io.gorse.gorse4j.Feedback;
import io.gorse.gorse4j.Gorse;
import io.gorse.gorse4j.Item;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class RecommenderService {

	private final Gorse client;

	private final ZoneId zone = ZoneId.of("Asia/Seoul");


	/**
	 * 아이템 추가
	 */
	public void insertItem(Item item) {
		try {
			this.client.insertItem(item);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}


	public void insertItem(Long itemId, Boolean isHidden, List<String> labels, List<String> categories, LocalDateTime timestamp, String comment) {
		String timestampStr = timestamp.atZone(zone).format(DateTimeFormatter.ISO_INSTANT);
		Item item = new Item(String.valueOf(itemId), isHidden, labels, categories, timestampStr, comment);
		this.insertItem(item);
	}


	/**
	 * 아이템 삭제
	 */
	public void deleteItem(Long itemId) {
		try {
			String itemIdStr = String.valueOf(itemId);
			this.client.deleteItem(itemIdStr);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}


	/**
	 * 피드백 추가
	 * (피드백 삭제는 없음)
	 */
	public void insertFeedback(List<Feedback> feedbacks) {
		try {
			this.client.insertFeedback(feedbacks);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}


	public void insertFeedback(Feedback feedback) {
		this.insertFeedback(List.of(feedback));
	}


	public void insertFeedback(FeedbackType feedbackType, Long userId, Long itemId, LocalDateTime timestamp) {
		String timestampStr = timestamp.atZone(zone).format(DateTimeFormatter.ISO_INSTANT);
		Feedback feedback = new Feedback(feedbackType.name(), String.valueOf(userId), String.valueOf(itemId), timestampStr);
		this.insertFeedback(feedback);
	}


	/**
	 * 피드백 생성
	 */
	public Feedback createFeedback(FeedbackType feedbackType, Long userId, Long itemId, LocalDateTime timestamp) {
		String timestampStr = timestamp.atZone(zone).format(DateTimeFormatter.ISO_INSTANT);
		return new Feedback(feedbackType.name(), String.valueOf(userId), String.valueOf(itemId), timestampStr);
	}


	/**
	 * 추천 피드 목록 조회
	 */
	public List<Long> getRecommendFeedIdList(Long userId, Integer page, Integer size) {
		String charset = "UTF-8";
		Integer offset = page * size;
		String query = "";
		try {
			query = String.format("?n=%s&offset=%s", URLEncoder.encode(String.valueOf(size), charset), URLEncoder.encode(String.valueOf(offset), charset));
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		return this.getRecommendFeedIdList(userId + query);
	}


	public List<Long> getRecommendFeedIdList(Long userId) {
		return this.getRecommendFeedIdList(String.valueOf(userId));
	}


	public List<Long> getRecommendFeedIdList(String userId) {
		List<Long> feedIdList = new ArrayList<>();
		try {
			List<String> feedIdStrList = this.client.getRecommend(userId);
			feedIdList = feedIdStrList.stream().map(m -> Long.valueOf(m)).collect(Collectors.toList());
		} catch (IOException e) {
			e.printStackTrace();
		}
		return feedIdList;
	}

}
