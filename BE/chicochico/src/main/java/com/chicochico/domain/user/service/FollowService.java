package com.chicochico.domain.user.service;


import com.chicochico.domain.user.entity.FollowEntity;
import com.chicochico.domain.user.repository.FollowRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
public class FollowService {

	private FollowRepository followRepository;


	/**
	 * 필로잉합니다. (팔로잉 생성)
	 *
	 * @param nickname 내가 팔로잉 할 유저 nickname
	 */
	public void createFollowing(String nickname) {
	}


	/**
	 * 팔로잉 목록을 조회합니다.
	 *
	 * @param nickname 피드 주인 nickname
	 * @return 피드주인의 팔로잉 목록
	 */
	public List<FollowEntity> getFollowingList(String nickname) {
		return new ArrayList<>();
	}


	/**
	 * 팔로잉을 삭제합니다. (언팔로우)
	 *
	 * @param nickname 내가 팔로잉한 유저 nickname
	 */
	public void deleteFollowing(String nickname) {
	}


	/**
	 * 팔로워 목록을 조회합니다.
	 *
	 * @param nickname 피드 주인 nickname
	 * @return 피드 주인의 팔로워 목록
	 */
	public List<FollowEntity> getFollowerList(String nickname) {
		return new ArrayList<>();
	}


	/**
	 * 팔로워를 삭제합니다.
	 *
	 * @param nickname 날 팔로우한 유저 nickname
	 */
	public void deleteFollower(String nickname) {
	}

}
