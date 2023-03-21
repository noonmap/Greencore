package com.chicochico.domain.feed.dto.request;


import com.chicochico.common.code.IsDeletedType;
import com.chicochico.domain.feed.entity.CommentEntity;
import com.chicochico.domain.feed.entity.FeedEntity;
import com.chicochico.domain.user.entity.UserEntity;
import lombok.Builder;
import lombok.Data;


/**
 * 댓글 생성, 수정 요청
 */
@Builder
@Data
public class CommentRequestDto {

	private String content;
	private String mentionNickname;


	public CommentEntity toEntity(FeedEntity feed, UserEntity user, Long mentionUserID) {
		return CommentEntity.builder()
			.content(content)
			.feed(feed)
			.user(user)
			.mentionUserId(mentionUserID)
			.isDeleted(IsDeletedType.N)
			.build();
	}


	public CommentEntity toEntity(FeedEntity feed, UserEntity user) {
		return CommentEntity.builder()
			.content(content)
			.feed(feed)
			.user(user)
			.isDeleted(IsDeletedType.N)
			.build();
	}


	public CommentEntity toEntity(Long commentId, FeedEntity feed, UserEntity user, Long mentionUserID) {
		return CommentEntity.builder()
			.id(commentId)
			.content(content)
			.feed(feed)
			.user(user)
			.mentionUserId(mentionUserID)
			.isDeleted(IsDeletedType.N)
			.build();
	}


	public CommentEntity toEntity(Long commentId, FeedEntity feed, UserEntity user) {
		return CommentEntity.builder()
			.id(commentId)
			.content(content)
			.feed(feed)
			.user(user)
			.isDeleted(IsDeletedType.N)
			.build();
	}

}
