package com.chicochico.domain.alert.dto;


import com.chicochico.domain.alert.entity.AlertEntity;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;


/**
 * 알림 목록 조회 응답
 */
@Data
public class AlertResponseDto {

	public static AlertResponseDto fromEntity(AlertEntity alert) {
		return new AlertResponseDto();
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
