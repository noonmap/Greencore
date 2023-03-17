package com.chicochico.feed;


import com.chicochico.common.code.IsDeletedType;
import com.chicochico.domain.feed.entity.DiaryEntity;
import com.chicochico.domain.feed.entity.DiarySetEntity;
import com.chicochico.domain.feed.entity.PostEntity;
import com.chicochico.domain.user.entity.UserEntity;

import java.time.LocalDate;


public abstract class FeedTestHelper {

	private final String DEFAULT_IMAGE_PATH = "/image/default.png";


	public PostEntity doPostEntity(UserEntity user, Long id) {
		return PostEntity.builder()
			.id(id)
			.user(user)
			.content("diary content")
			.imagePath(DEFAULT_IMAGE_PATH)
			.likeCount(0)
			.isDeleted(IsDeletedType.N)
			.build();
	}


	public PostEntity doPostEntity(UserEntity user, Long id, IsDeletedType isDeletedType) {
		return PostEntity.builder()
			.id(id)
			.user(user)
			.content("diary content")
			.imagePath(DEFAULT_IMAGE_PATH)
			.likeCount(0)
			.isDeleted(isDeletedType)
			.build();
	}


	public PostEntity doPostEntity(Long userId, Long id) {
		return doPostEntity(UserEntity.builder().id(userId).build(), id);
	}


	public PostEntity doPostEntity(Long userId, Long id, IsDeletedType isDeletedType) {
		return doPostEntity(UserEntity.builder().id(userId).build(), id, isDeletedType);
	}


	public DiaryEntity doDiaryEntity(UserEntity user, Long id) {
		return DiaryEntity.builder()
			.id(id)
			.user(user)
			.content("diary content")
			.imagePath(DEFAULT_IMAGE_PATH)
			.likeCount(0)
			.isDeleted(IsDeletedType.N)
			.diarySet(new DiarySetEntity())
			.observationDate(LocalDate.now())
			.build();
	}


	public DiaryEntity doDiaryEntity(Long userId, Long id) {
		return doDiaryEntity(UserEntity.builder().id(userId).build(), id);
	}

}
