package com.chicochico.common.code;


import lombok.Getter;


@Getter
public enum ScheduleType implements TypeModel {
	SCHEDULE_WATER("물주기"),
	SCHEDULE_REPOT("분갈이"),
	SCHEDULE_PRUNING("가지치기"),
	SCHEDULE_NUTRITION("영양관리"),
	SCHEDULE_VENTILATION("환기하기"),
	SCHEDULE_SPRAY("분무하기");

	private final String description;


	ScheduleType(String description) {
		this.description = description;
	}


	@Override
	public String getName() {
		return name();
	}
}
