package com.chicochico.domain.user.repository;


import com.chicochico.domain.user.entity.FollowEntity;
import com.chicochico.domain.user.entity.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


public interface FollowRepository extends JpaRepository<FollowEntity, Long> {

	List<FollowEntity> findAllByFollowerAndFollowingNicknameStartingWith(UserEntity user, String str);
	Optional<FollowEntity> findByFollowerAndFollowing(UserEntity follower, UserEntity following);

	boolean existsByFollowerIdAndFollowingId(Long follower_id, Long following_id);

	Page<FollowEntity> findByFollower(UserEntity follower, Pageable pageable);
	Page<FollowEntity> findByFollowing(UserEntity following, Pageable pageable);

}
