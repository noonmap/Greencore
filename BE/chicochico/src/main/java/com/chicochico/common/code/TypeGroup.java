package com.chicochico.common.code;


import lombok.Getter;

import java.util.List;


@Getter
public enum TypeGroup {
	FEED(List.of(
		FeedType.FEED_POST,
		FeedType.FEED_DIARY)),
	SCHEDULE(List.of(
		ScheduleType.SCHEDULE_WATER,
		ScheduleType.SCHEDULE_REPOT,
		ScheduleType.SCHEDULE_PRUNING,
		ScheduleType.SCHEDULE_NUTRITION,
		ScheduleType.SCHEDULE_VENTILATION,
		ScheduleType.SCHEDULE_SPRAY));

	private final List<TypeModel> typeList;


	TypeGroup(List<TypeModel> typeList) {
		this.typeList = typeList;
	}
}
