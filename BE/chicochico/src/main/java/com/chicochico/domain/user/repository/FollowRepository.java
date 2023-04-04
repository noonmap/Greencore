package com.chicochico.domain.user.repository;


import com.chicochico.domain.user.entity.FollowEntity;
import com.chicochico.domain.user.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


public interface FollowRepository extends JpaRepository<FollowEntity, Long> {

	List<FollowEntity> findAllByFollowerAndFollowingNicknameStartingWith(UserEntity user, String str);
	Optional<FollowEntity> findByFollowerAndFollowing(UserEntity follower, UserEntity following);

	boolean existsByFollowerIdAndFollowingId(Long follower_id, Long following_id);

	List<FollowEntity> findByFollowerOrderByIdDesc(UserEntity follower);
	List<FollowEntity> findByFollowingOrderByIdDesc(UserEntity following);
	void deleteByFollowerId(Long userId);
	void deleteByFollowingId(Long userId);

}
