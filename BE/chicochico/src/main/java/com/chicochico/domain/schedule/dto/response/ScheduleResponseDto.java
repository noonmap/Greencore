package com.chicochico.domain.schedule.dto.response;


import com.chicochico.common.code.IsCompletedType;
import com.chicochico.common.code.ScheduleType;
import com.chicochico.domain.plant.dto.response.PlantOnScheduleResponseDto;
import com.chicochico.domain.schedule.entity.ScheduleEntity;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;


/**
 * 스케줄 조회 응답
 */
@Data
@Builder
public class ScheduleResponseDto {

	private Long scheduleId;
	private LocalDate scheduleDate;
	private ScheduleType scheduleCode;
	private IsCompletedType isCompleted;
	private String content;
	private PlantOnScheduleResponseDto plant;


	public static ScheduleResponseDto fromEntityMonth(ScheduleEntity scheduleEntity) {
		PlantOnScheduleResponseDto plant = PlantOnScheduleResponseDto.fromEntity(scheduleEntity.getUserPlant());

		ScheduleResponseDto scheduleResponseDto = ScheduleResponseDto.builder()
			.scheduleId(scheduleEntity.getId())
			.scheduleDate(scheduleEntity.getDate())
			.isCompleted(scheduleEntity.getIsCompleted())
			.scheduleCode(scheduleEntity.getScheduleCode())
			.content(scheduleEntity.getContent())
			.plant(plant).build();
		return scheduleResponseDto;
	}


	public static ScheduleResponseDto fromEntityWeek(ScheduleEntity scheduleEntity) {
		PlantOnScheduleResponseDto plant = PlantOnScheduleResponseDto.fromEntity(scheduleEntity.getUserPlant());

		ScheduleResponseDto scheduleResponseDto = ScheduleResponseDto.builder()
			.scheduleId(scheduleEntity.getId())
			.scheduleDate(scheduleEntity.getDate())
			.scheduleCode(scheduleEntity.getScheduleCode())
			.isCompleted(scheduleEntity.getIsCompleted())
			.content(scheduleEntity.getContent())
			.plant(plant).build();
		return scheduleResponseDto;
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
