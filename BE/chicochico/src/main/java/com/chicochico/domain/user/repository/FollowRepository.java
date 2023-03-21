package com.chicochico.domain.user.repository;


import com.chicochico.domain.user.entity.FollowEntity;
import com.chicochico.domain.user.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface FollowRepository extends JpaRepository<FollowEntity, Long> {

	List<FollowEntity> findAllByFollowerAndFollowingNicknameStartingWith(UserEntity user, String str);

}
