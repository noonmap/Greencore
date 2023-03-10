package com.chicochico.domain.schedule.dto;


import com.chicochico.domain.schedule.entity.ScheduleEntity;
import lombok.Data;


/**
 * 스케줄 생성, 수정 요청
 */
@Data
public class ScheduleRequestDto {

	public ScheduleEntity toEntity() {
		return (ScheduleEntity) new Object();
	}

}
