package com.chicochico.common.code;


import lombok.Getter;


@Getter
public enum RegularScheduleType implements TypeModel {
	MONTHLY_SCHEDULE("월별정기일정"),
	WEEKLY_SCHEDULE("주별정기일정");

	private final String description;


	RegularScheduleType(String description) {
		this.description = description;
	}


	@Override
	public String getName() {
		return name();
	}

}
