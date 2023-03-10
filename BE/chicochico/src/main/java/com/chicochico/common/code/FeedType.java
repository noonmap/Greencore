package com.chicochico.common.code;


import lombok.Getter;


@Getter
public enum FeedType implements TypeModel {
	FEED_POST("게시글"),
	FEED_DIARY("일지");

	private final String description;


	FeedType(String description) {
		this.description = description;
	}


	@Override
	public String getName() {
		return name();
	}
}
