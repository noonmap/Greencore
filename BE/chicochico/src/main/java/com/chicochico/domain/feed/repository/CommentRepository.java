package com.chicochico.domain.feed.repository;


import com.chicochico.domain.feed.entity.CommentEntity;
import com.chicochico.domain.feed.entity.FeedEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface CommentRepository extends JpaRepository<CommentEntity, Long> {

	List<CommentEntity> findByFeed(FeedEntity feed);
	Integer countByFeed(FeedEntity feed);

}
