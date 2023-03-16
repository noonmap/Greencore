package com.chicochico.domain.schedule.dto.response;


import com.chicochico.domain.schedule.entity.ScheduleEntity;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;


/**
 * 스케줄 조회 응답
 */
@Data
public class ScheduleResponseDto {

	public static ScheduleResponseDto fromEntityMonth(ScheduleEntity scheduleEntity) {
		return new ScheduleResponseDto();
	}


	public static ScheduleResponseDto fromEntityWeek(ScheduleEntity scheduleEntity) {
		return new ScheduleResponseDto();
	}


	public static List<ScheduleResponseDto> fromEnityMonthList(List<ScheduleEntity> scheduleList) {
		List<ScheduleResponseDto> result = new ArrayList<>();
		for (ScheduleEntity schedule : scheduleList) {
			ScheduleResponseDto scheduleResponseDto = ScheduleResponseDto.fromEntityMonth(schedule);
			result.add(scheduleResponseDto);
		}
		return result;
	}


	public static List<ScheduleResponseDto> fromEnityWeeekList(List<ScheduleEntity> scheduleList) {
		List<ScheduleResponseDto> result = new ArrayList<>();
		for (ScheduleEntity schedule : scheduleList) {
			ScheduleResponseDto scheduleMonthResponseDto = ScheduleResponseDto.fromEntityWeek(schedule);
			result.add(scheduleMonthResponseDto);
		}
		return result;
	}

}
