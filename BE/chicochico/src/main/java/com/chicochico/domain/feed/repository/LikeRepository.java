package com.chicochico.domain.feed.repository;


import com.chicochico.domain.feed.entity.FeedEntity;
import com.chicochico.domain.feed.entity.LikeEntity;
import com.chicochico.domain.user.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface LikeRepository extends JpaRepository<LikeEntity, Long> {

	Optional<LikeEntity> findByUserAndFeed(UserEntity user, FeedEntity feed);

}
