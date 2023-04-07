package com.chicochico.domain.feed.service;


import com.chicochico.common.code.FeedbackType;
import com.chicochico.common.code.IsDeletedType;
import com.chicochico.common.service.AuthService;
import com.chicochico.common.service.FileService;
import com.chicochico.common.service.RecommenderService;
import com.chicochico.domain.feed.dto.request.PostRequestDto;
import com.chicochico.domain.feed.entity.PostEntity;
import com.chicochico.domain.feed.repository.PostRepository;
import com.chicochico.domain.user.entity.UserEntity;
import com.chicochico.domain.user.repository.UserRepository;
import com.chicochico.exception.CustomException;
import com.chicochico.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;


@Service
@RequiredArgsConstructor
public class PostService {

	private final PostRepository postRepository;
	private final UserRepository userRepository;
	private final AuthService authService;
	private final FileService fileService;
	private final FeedService feedService;
	private final RecommenderService recommenderService;

	//	private Page<PostEntity> getUnDeletedPostPage(Page<PostEntity> postPage, Pageable pageable) {
	//		List<PostEntity> postList = new ArrayList<>(postPage.toList());
	//		// 삭제된 피드 삭제
	//		postList.removeIf(post -> post.getIsDeleted().equals(IsDeletedType.Y));
	//		Page<PostEntity> noDeletedPostPage = new PageImpl<>(postList, pageable, postList.size());
	//		return noDeletedPostPage;
	//	}


	/**
	 * 게시글 목록을 조회합니다.
	 *
	 * @param nickname
	 * @return
	 */
	public List<PostEntity> getPostList(String nickname) {
		UserEntity writer = userRepository.findByNickname(nickname).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
		if (writer.getIsDeleted().equals(IsDeletedType.Y)) throw new CustomException(ErrorCode.USER_NOT_FOUND); // 이미 탈퇴한 유저
		List<PostEntity> postList = postRepository.findByUserAndIsDeleted(writer, IsDeletedType.N);

		return postList;
	}


	/**
	 * 게시글 상세 조회합니다.
	 *
	 * @param postId
	 * @return
	 */
	public PostEntity getPost(Long postId) {
		PostEntity post = postRepository.findById(postId).orElseThrow(() -> new CustomException(ErrorCode.POST_NOT_FOUND));

		// 삭제된 게시글인지 확인
		if (post.getIsDeleted() == IsDeletedType.Y) throw new CustomException(ErrorCode.POST_NOT_FOUND);

		// Recommender System에 read Feedback 추가
		Long userId = authService.getUserId();
		recommenderService.insertFeedback(FeedbackType.read, userId, postId, LocalDateTime.now());

		return post;
	}


	/**
	 * 게시글을 생성합니다.
	 *
	 * @param postRequestDto
	 */
	@Transactional
	public Long createPost(PostRequestDto postRequestDto) {
		// 작성자 조회
		Long userId = authService.getUserId();
		UserEntity writer = userRepository.findById(userId).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

		// 이미지 저장
		MultipartFile image = postRequestDto.getImage();
		String savedPath = fileService.storeImageFile(image, FeedService.IMAGE_FILE_SUB_DIR);

		// PostEntity 저장
		PostEntity post = PostEntity.builder()
			.user(writer)
			.content(postRequestDto.getContent())
			.imagePath(savedPath)
			.likeCount(0)
			.commentCount(0)
			.isDeleted(IsDeletedType.N)
			.build();
		post = postRepository.save(post);

		// tags들 저장 & 연결
		List<String> tags = postRequestDto.getTags();
		feedService.createAndConnectTags(tags, post);

		// Recommender system에 추가
		recommenderService.insertItem(post.getId(), false, tags, null, post.getCreatedAt(), post.getContent().substring(0, Math.min(30, post.getContent().length())));

		return post.getId();
	}


	/**
	 * 게시글을 수정합니다.
	 *
	 * @param postId
	 * @param postRequestDto
	 */
	@Transactional
	public void modifyPost(Long postId, PostRequestDto postRequestDto) {
		// 삭제된 게시글인지 확인
		PostEntity originPost = postRepository.findById(postId).orElseThrow(() -> new CustomException(ErrorCode.POST_NOT_FOUND));
		if (originPost.getIsDeleted() == IsDeletedType.Y) throw new CustomException(ErrorCode.POST_NOT_FOUND);

		// 작성자와 현재 유저 같은 사람인지 확인
		Long userId = authService.getUserId();
		UserEntity writer = originPost.getUser();
		if (writer.getId() != userId) throw new CustomException(ErrorCode.NO_ACCESS);

		// 기존 연결된 이미지 삭제 -> 이것도 isDelected처럼 남겨야 할 것 같은데.. 고민
		String originImagePath = originPost.getImagePath();
		fileService.deleteImageFile(originImagePath);

		// 기존 tag 연결 삭제
		feedService.deleteConnectedTags(originPost);

		// 새로운 이미지 저장
		MultipartFile multipartFile = postRequestDto.getImage();
		String newImagePath = fileService.storeImageFile(multipartFile, FeedService.IMAGE_FILE_SUB_DIR);

		// PostEntity 수정한 내용 저장
		PostEntity newPost = PostEntity.builder()
			.id(originPost.getId())
			.user(writer)
			.content(postRequestDto.getContent())
			.imagePath(newImagePath)
			.likeCount(originPost.getLikeCount())
			.commentCount(originPost.getCommentCount())
			.isDeleted(IsDeletedType.N)
			.createdAt(originPost.getCreatedAt())
			.updatedAt(originPost.getUpdatedAt())
			.build();
		newPost = postRepository.save(newPost);

		// tags 새로 연결
		feedService.createAndConnectTags(postRequestDto.getTags(), newPost);

		// Recommender system에 삭제 후 새로 추가
		recommenderService.deleteItem(newPost.getId());
		recommenderService.insertItem(newPost.getId(), false, postRequestDto.getTags(), null, newPost.getCreatedAt(), newPost.getContent().substring(0, Math.min(30, newPost.getContent().length())));
	}


	/**
	 * 게시글을 삭제합니다.
	 *
	 * @param postId
	 */
	@Transactional
	public void deletePost(Long postId) {
		// 삭제된 게시글인지 확인
		PostEntity post = postRepository.findById(postId).orElseThrow(() -> new CustomException(ErrorCode.POST_NOT_FOUND));
		if (post.getIsDeleted() == IsDeletedType.Y) throw new CustomException(ErrorCode.POST_NOT_FOUND);

		// 작성자와 현재 유저 같은 사람인지 확인
		Long userId = authService.getUserId();
		UserEntity writer = post.getUser();
		if (writer.getId() != userId) throw new CustomException(ErrorCode.NO_ACCESS);

		// feed(post)와 연결된 요소들 일괄 삭제 (이미지, 태그, 댓글, 좋아요)
		feedService.deleteConnectedComponents(post);

		// Recommender system에서 삭제
		recommenderService.deleteItem(post.getId());

		// post 삭제
		post.setIsDeleted(IsDeletedType.Y);
		postRepository.save(post);
	}

}
