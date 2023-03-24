package com.chicochico.domain.user.service;


import com.chicochico.common.code.IsDeletedType;
import com.chicochico.common.service.AuthService;
import com.chicochico.domain.user.entity.FollowEntity;
import com.chicochico.domain.user.entity.UserEntity;
import com.chicochico.domain.user.repository.FollowRepository;
import com.chicochico.domain.user.repository.UserRepository;
import com.chicochico.exception.CustomException;
import com.chicochico.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class FollowService {

	// follower: 팔로우를 신청한 유저
	// following: 팔로우를 신청받은 유저

	// follower 나를 팔로우 하고 있는 유저
	// following 내가 팔로잉 하고 있는 유저

	private final FollowRepository followRepository;
	private final UserRepository userRepository;
	private final AuthService authService;


	/**
	 * 필로잉합니다. (팔로잉 생성)
	 *
	 * @param nickname 내가 팔로잉 할 유저 nickname
	 */
	@Transactional
	public void createFollowing(String nickname) {
		Long userId = authService.getUserId(); // 로그인 유저 & 팔로우를 신청한 유저
		UserEntity follower = userRepository.findById(userId).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
		Optional<UserEntity> following = userRepository.findByNicknameAndIsDeleted(nickname, IsDeletedType.N); // 팔로우 신청 받은 유저

		if (following.isEmpty()) {
			throw new CustomException(ErrorCode.USER_NOT_FOUND); // 팔로우를 신청 받은 유저가 존재 하지 않음 (OR 탈퇴한 유저임)
		}

		// 이미 팔로우하고 있는지 확인 (팔로잉 상태인지 확인)
		// 이미 팔로우 하고 있는 경우
		if (followRepository.existsByFollowerIdAndFollowingId(follower.getId(), following.get().getId())) {
			throw new CustomException(ErrorCode.DUPLICATE_RESOURCE);
		}

		// 안하고 있다면 팔로우 하기
		FollowEntity follow = FollowEntity.builder().follower(follower).following(following.get()).build();
		followRepository.save(follow);

		// 내 followingCount, 상대 followerCount ++해주기
		follower.increaseFollowingCount();
		following.get().increaseFollowerCount();
		userRepository.save(follower);
		userRepository.save(following.get());
	}


	/**
	 * 팔로잉 목록을 조회합니다.
	 *
	 * @param nickname 피드 주인 nickname
	 * @return 피드주인의 팔로잉 목록
	 */
	public Page<UserEntity> getFollowingList(String nickname, Pageable pageable) {

		Optional<UserEntity> follower = userRepository.findByNicknameAndIsDeleted(nickname, IsDeletedType.N); // 피드 주인

		if (follower.isEmpty()) { // 피드 주인이 존재 하지 않음
			throw new CustomException(ErrorCode.USER_NOT_FOUND);
		}

		// 피드 주인이 follower 인 Page 조회
		Page<FollowEntity> followPage = followRepository.findByFollower(follower.get(), pageable);
		return followPage.map(FollowEntity::getFollowing);

	}


	/**
	 * 팔로잉을 삭제합니다. (언팔로우)
	 *
	 * @param nickname 내가 팔로잉한 유저 nickname
	 */
	@Transactional
	public void deleteFollowing(String nickname) {
		Long userId = authService.getUserId(); // 로그인 유저 & 팔로우를 신청한 유저
		UserEntity follower = userRepository.findById(userId).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
		Optional<UserEntity> following = userRepository.findByNicknameAndIsDeleted(nickname, IsDeletedType.N); // 내가 팔로잉한 유저

		if (following.isEmpty()) { // 내가 팔로잉한 유저가 존재하지 않음
			throw new CustomException(ErrorCode.USER_NOT_FOUND);
		}

		// 팔로우 여부 확인
		Optional<FollowEntity> follow = followRepository.findByFollowerAndFollowing(follower, following.get());
		// 이미 팔로잉 안하고 있음
		if (follow.isEmpty()) {
			throw new CustomException(ErrorCode.ENTITY_NOT_FOUND);
		}

		// 팔로잉 삭제
		followRepository.delete(follow.get());

		// 내 followingCount, 상대 followerCount --해주기
		follower.decreaseFollowingCount();
		following.get().decreaseFollowerCount();
		userRepository.save(follower);
		userRepository.save(following.get());

	}


	/**
	 * 팔로워 목록을 조회합니다.
	 *
	 * @param nickname 피드 주인 nickname
	 * @return 피드 주인의 팔로워 목록
	 */
	public Page<UserEntity> getFollowerList(String nickname, Pageable pageable) {
		Optional<UserEntity> following = userRepository.findByNicknameAndIsDeleted(nickname, IsDeletedType.N); // 피드 주인

		if (following.isEmpty()) { // 피드 주인이 존재 하지 않음
			throw new CustomException(ErrorCode.USER_NOT_FOUND);
		}

		// 피드 주인이 following 인 List 조회
		Page<FollowEntity> followPage = followRepository.findByFollowing(following.get(), pageable);
		return followPage.map(FollowEntity::getFollower);
	}


	/**
	 * 팔로워를 삭제합니다.
	 *
	 * @param nickname 날 팔로우한 유저 nickname
	 */
	@Transactional
	public void deleteFollower(String nickname) {
		Long userId = authService.getUserId(); // 로그인 유저 & 팔로우를 신청받은 유저
		UserEntity following = userRepository.findById(userId)
			.orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
		Optional<UserEntity> follower = userRepository.findByNicknameAndIsDeleted(nickname,
			IsDeletedType.N); // 나를 팔로잉한 유저

		if (follower.isEmpty()) { // 나를 팔로잉한 유저가 존재하지 않음
			throw new CustomException(ErrorCode.USER_NOT_FOUND);
		}

		// 팔로우 여부 확인
		Optional<FollowEntity> follow = followRepository.findByFollowerAndFollowing(follower.get(), following);
		// 이미 팔로잉 안하고 있음
		if (follow.isEmpty()) {
			throw new CustomException(ErrorCode.ENTITY_NOT_FOUND);
		}

		// 팔로잉 삭제
		followRepository.delete(follow.get());

		// 내 followerCount와 상대의 followgingCount를 --해주기
		following.decreaseFollowerCount();
		follower.get().decreaseFollowingCount();
		userRepository.save(following);
		userRepository.save(follower.get());

	}


	/**
	 * 로그인 유저가 followerId 팔로우 했는지 여부 확인
	 *
	 * @param followingId 내가 팔로잉 하고 있는 유저 & 팔로우를 신청받은 유저
	 * @return 내가 팔로잉 했는지 여부
	 */
	public Boolean isFollowed(Long followingId) {
		Long userId = authService.getUserId();

		return followRepository.existsByFollowerIdAndFollowingId(userId, followingId);
	}


	@Transactional
	public void deleteAllFollowerByUserId(Long userId) {
		followRepository.deleteByFollowerId(userId);
	}


	@Transactional
	public void deleteAllFollowingByUserId(Long userId) {
		followRepository.deleteByFollowingId(userId);
	}

}
