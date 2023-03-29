package com.chicochico.common.code;


import lombok.Getter;


@Getter
public enum AlertType implements TypeModel {
	ALERT_LIKE("좋아요 알림"),
	ALERT_COMMENT("댓글 알림"),
	ALERT_FOLLOW("팔로우 알림");

	private final String description;


	AlertType(String description) {
		this.description = description;
	}


	@Override
	public String getName() {
		return name();
	}
}
