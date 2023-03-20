package com.chicochico.domain.feed.dto.response;


import com.chicochico.domain.feed.entity.PostEntity;
import com.chicochico.domain.user.dto.response.ProfileResponseDto;
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
public class PostResponseDto {

	private ProfileResponseDto user;
	private Long postId;
	private String content;
	private String imagePath;
	private Integer likeCount;
	private Integer commentCount;
	private List<String> tags;
	private LocalDateTime createdAt;


	public static PostResponseDto fromEntity(PostEntity post, Function<Long, Integer> getCommentCount, Function<Long, List<String>> getTagsList) {
		return PostResponseDto.builder()
			.user(ProfileResponseDto.fromEntity(post.getUser()))
			.postId(post.getId())
			.content(post.getContent())
			.imagePath(post.getImagePath())
			.likeCount(post.getLikeCount())
			.commentCount(getCommentCount.apply(post.getId()))
			.tags(getTagsList.apply(post.getId())) //
			.createdAt(post.getCreatedAt())
			.build();
	}


	public static List<PostResponseDto> fromEnityList(List<PostEntity> postList, Function<Long, Integer> getCommentCount, Function<Long, List<String>> getTagsList) {
		List<PostResponseDto> result = new ArrayList<>();
		for (PostEntity post : postList) {
			PostResponseDto xxResponseDto = PostResponseDto.fromEntity(post, getCommentCount, getTagsList);
			result.add(xxResponseDto);
		}
		return result;
	}


	public static Page<PostResponseDto> fromEntityPage(Page<PostEntity> page, Function<Long, Integer> getCommentCount, Function<Long, List<String>> getTagsList) {
		List<PostEntity> postList = new ArrayList<>(page.toList());
		List<PostResponseDto> postResponseDtoList = PostResponseDto.fromEnityList(postList, getCommentCount, getTagsList);
		Page<PostResponseDto> result = new PageImpl<>(postResponseDtoList, page.getPageable(), postResponseDtoList.size());
		return result;
	}

}
