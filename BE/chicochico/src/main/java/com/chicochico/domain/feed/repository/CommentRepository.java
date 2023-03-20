package com.chicochico.domain.feed.repository;


import com.chicochico.common.code.IsDeletedType;
import com.chicochico.domain.feed.entity.CommentEntity;
import com.chicochico.domain.feed.entity.FeedEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface CommentRepository extends JpaRepository<CommentEntity, Long> {

	List<CommentEntity> findByFeed(FeedEntity feed);
	Page<CommentEntity> findByFeedAndIsDeleted(FeedEntity feed, Pageable pageable, IsDeletedType isDeletedType);
	Integer countByFeed(FeedEntity feed);

}
