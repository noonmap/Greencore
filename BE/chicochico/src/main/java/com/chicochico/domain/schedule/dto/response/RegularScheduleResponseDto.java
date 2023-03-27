package com.chicochico.domain.schedule.dto.response;


import com.chicochico.common.code.RegularScheduleType;
import com.chicochico.common.code.ScheduleType;
import com.chicochico.domain.plant.dto.response.PlantOnScheduleResponseDto;
import com.chicochico.domain.schedule.entity.RegularScheduleEntity;
import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;


@Data
@Builder
public class RegularScheduleResponseDto {

	private Long regularScheduleId;
	private RegularScheduleType regularScheduleCode;
	private Integer day;
	private ScheduleType scheduleCode;
	private String content;
	private PlantOnScheduleResponseDto plant;


	public static RegularScheduleResponseDto fromEntity(RegularScheduleEntity regularSchedule) {
		PlantOnScheduleResponseDto plant = PlantOnScheduleResponseDto.fromEntity(regularSchedule.getUserPlant());

		RegularScheduleResponseDto regularScheduleResponseDto = RegularScheduleResponseDto.builder()
			.regularScheduleId(regularSchedule.getId())
			.regularScheduleCode(regularSchedule.getRegularScheduleCode())
			.day(regularSchedule.getDay())
			.scheduleCode(regularSchedule.getScheduleCode())
			.content(regularSchedule.getContent())
			.plant(plant).build();
		return regularScheduleResponseDto;
	}


	public static List<RegularScheduleResponseDto> fromEntityList(List<RegularScheduleEntity> regularScheduleEntityList) {
		return regularScheduleEntityList.stream().map(regularSchedule -> fromEntity(regularSchedule)).collect(Collectors.toList());
	}

}
