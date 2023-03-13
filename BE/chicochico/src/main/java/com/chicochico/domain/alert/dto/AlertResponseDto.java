package com.chicochico.domain.alert.dto;


import com.chicochico.domain.alert.entity.AlertEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


/**
 * 알림 목록 조회 응답
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlertResponseDto {

	private Long alertId;
	private String content;
	private String urlPath;
	private LocalDateTime createdAt;


	public static AlertResponseDto fromEntity(AlertEntity alert) {
		AlertResponseDto response = AlertResponseDto.builder()
			.alertId(alert.getId())
			.content(alert.getContent())
			.urlPath(alert.getUrlPath())
			.createdAt(alert.getCreatedAt())
			.build();
		
		return response;
	}


	public static List<AlertResponseDto> fromEntityList(List<AlertEntity> alertList) {
		List<AlertResponseDto> result = new ArrayList<>();
		for (AlertEntity alert : alertList) {
			AlertResponseDto alertResponseDto = AlertResponseDto.fromEntity(alert);
			result.add(alertResponseDto);
		}
		return result;
	}

}
