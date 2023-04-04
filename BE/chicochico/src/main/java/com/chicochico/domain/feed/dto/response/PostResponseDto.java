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

import static com.chicochico.common.service.FileService.NGINX_PATH;


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
	private Boolean isLiked;


	public static PostResponseDto fromEntity(PostEntity post, Function<Long, Integer> getCommentCount, Function<Long, List<String>> getTagsList, Function<Long, Boolean> isFollowed,
		Function<Long, Boolean> isLiked) {
		String path = post.getImagePath();
		if (!path.startsWith("http")) {
			path = NGINX_PATH + path;
		}
		return PostResponseDto.builder()
			.user(ProfileResponseDto.fromEntity(post.getUser(), isFollowed))
			.postId(post.getId())
			.content(post.getContent())
			.imagePath(path)
			.likeCount(post.getLikeCount())
			.commentCount(getCommentCount.apply(post.getId()))
			.tags(getTagsList.apply(post.getId())) //
			.createdAt(post.getCreatedAt())
			.isLiked(isLiked.apply(post.getId()))
			.build();
	}


	public static List<PostResponseDto> fromEnityList(List<PostEntity> postList, Function<Long, Integer> getCommentCount, Function<Long, List<String>> getTagsList,
		Function<Long, Boolean> isFollowed, Function<Long, Boolean> isLiked) {
		List<PostResponseDto> result = new ArrayList<>();
		for (PostEntity post : postList) {
			PostResponseDto xxResponseDto = PostResponseDto.fromEntity(post, getCommentCount, getTagsList, isFollowed, isLiked);
			result.add(xxResponseDto);
		}
		return result;
	}


	public static Page<PostResponseDto> fromEntityPage(Page<PostEntity> page, Function<Long, Integer> getCommentCount, Function<Long, List<String>> getTagsList, Function<Long, Boolean> isFollowed,
		Function<Long, Boolean> isLiked) {
		List<PostEntity> postList = new ArrayList<>(page.toList());
		List<PostResponseDto> postResponseDtoList = PostResponseDto.fromEnityList(postList, getCommentCount, getTagsList, isFollowed, isLiked);

		try {
			Page<PostResponseDto> result = new PageImpl<>(postResponseDtoList, page.getPageable(), postResponseDtoList.size());
			return result;
		} catch (IllegalArgumentException e) {
			return Page.empty();
			//			throw new CustomException(ErrorCode.PAGE_NOT_FOUND);
		}

	}

}
