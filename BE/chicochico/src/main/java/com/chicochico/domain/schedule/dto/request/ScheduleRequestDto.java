package com.chicochico.domain.schedule.dto.request;


import com.chicochico.common.code.IsCompletedType;
import com.chicochico.common.code.RegularScheduleType;
import com.chicochico.common.code.ScheduleType;
import com.chicochico.domain.schedule.entity.RegularScheduleEntity;
import com.chicochico.domain.schedule.entity.ScheduleEntity;
import com.chicochico.domain.user.entity.UserEntity;
import com.chicochico.domain.user.entity.UserPlantEntity;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;


/**
 * 스케줄 생성, 수정 요청
 */
@Builder
@Data
public class ScheduleRequestDto {

	private LocalDate scheduleDate;
	private ScheduleType scheduleCode;
	private Long userPlantId;
	private String content;
	private RegularScheduleType regularScheduleCode;
	private Integer day;


	//일반 일정
	public ScheduleEntity toEntity(UserPlantEntity userPlant, UserEntity user) {
		return ScheduleEntity.builder()
			.date(scheduleDate)
			.userPlant(userPlant)
			.content(content)
			.user(user)
			.scheduleCode(scheduleCode)
			.isCompleted(IsCompletedType.N)
			.build();
	}


	//정기 일정
	public RegularScheduleEntity toEntity(UserEntity user, UserPlantEntity userPlant) {
		return RegularScheduleEntity.builder()
			.user(user)
			.day(day)
			.regularScheduleCode(regularScheduleCode)
			.content(content)
			.scheduleCode(scheduleCode)
			.userPlant(userPlant)
			.build();
	}


	public RegularScheduleEntity toEntity(Long regularId, UserEntity user, UserPlantEntity userPlant) {
		return RegularScheduleEntity.builder()
			.id(regularId)
			.regularScheduleCode(regularScheduleCode)
			.day(day)
			.user(user)
			.content(content)
			.scheduleCode(scheduleCode)
			.userPlant(userPlant)
			.build();
	}


	public ScheduleEntity toEntity(UserEntity user, RegularScheduleEntity regularSchedule, LocalDate date) {
		return ScheduleEntity.builder()
			.userPlant(regularSchedule.getUserPlant())
			.user(user)
			.regularSchedule(regularSchedule)
			.content(regularSchedule.getContent())
			.scheduleCode(regularSchedule.getScheduleCode())
			.date(date)
			.isCompleted(IsCompletedType.N)
			.build();
	}

}
