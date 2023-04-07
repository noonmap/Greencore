package com.chicochico.common.code;


import lombok.Getter;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;


@Getter
public enum TypeGroup {
	FEED(Arrays.stream(FeedType.values()).collect(Collectors.toList())), // FeedType 안에 있는 enum 요소들을 모두 list로 추가함
	SCHEDULE(Arrays.stream(ScheduleType.values()).collect(Collectors.toList())),
	REGURALSCHEDULE(Arrays.stream(RegularScheduleType.values()).collect(Collectors.toList())),
	ALERT(Arrays.stream(AlertType.values()).collect(Collectors.toList()));

	private final List<TypeModel> typeList;


	TypeGroup(List<TypeModel> typeList) {
		this.typeList = typeList;
	}
}
