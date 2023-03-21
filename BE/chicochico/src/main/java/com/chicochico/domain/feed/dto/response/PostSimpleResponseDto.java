package com.chicochico.domain.feed.dto.response;


import com.chicochico.domain.feed.entity.PostEntity;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;


@Data
@Builder
public class PostSimpleResponseDto {

	private Long postId;
	private String content;
	private Integer commentCount;
	private Integer likeCount;
	private LocalDateTime createdAt;


	public static PostSimpleResponseDto fromEntity(PostEntity post, Function<Long, Integer> getCommentCount) {

		return PostSimpleResponseDto.builder()
			.postId(post.getId())
			.content(post.getContent())
			.commentCount(getCommentCount.apply(post.getId()))
			.likeCount(post.getLikeCount())
			.createdAt(post.getCreatedAt())
			.build();
	}


	/**
	 * @param postList
	 * @param getCommentCount feedService의 commentCount 얻는 메소드를 콜백함수로 사용
	 * @return
	 */
	public static List<PostSimpleResponseDto> fromEnityList(List<PostEntity> postList, Function<Long, Integer> getCommentCount) {
		List<PostSimpleResponseDto> result = new ArrayList<>();
		for (PostEntity post : postList) {
			PostSimpleResponseDto postSimpleResponseDto = PostSimpleResponseDto.fromEntity(post, getCommentCount);
			result.add(postSimpleResponseDto);
		}
		return result;
	}


	public static Page<PostSimpleResponseDto> fromEntityPage(Page<PostEntity> page, Function<Long, Integer> getCommentCount) {
		List<PostEntity> postList = new ArrayList<>(page.toList());
		List<PostSimpleResponseDto> postSimpleResponseDtoList = fromEnityList(postList, getCommentCount);
		Page<PostSimpleResponseDto> result = new PageImpl<>(postSimpleResponseDtoList, page.getPageable(), postSimpleResponseDtoList.size());
		return result;
	}

}
