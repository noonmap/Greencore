package com.chicochico.domain.feed.repository;


import com.chicochico.common.code.IsDeletedType;
import com.chicochico.domain.feed.entity.FeedEntity;
import com.chicochico.domain.user.entity.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface FeedRepository extends JpaRepository<FeedEntity, Long> {

	Page<FeedEntity> findByUserInAndIsDeletedOrderByCreatedAtDesc(List<UserEntity> userIds, IsDeletedType isDeletedType, Pageable pageable);
	Page<FeedEntity> findByIdInAndIsDeleted(List<Long> feedIds, IsDeletedType isDeletedType, Pageable pageable);

	List<FeedEntity> findByIdInAndIsDeletedOrderByCreatedAtDesc(List<Long> feedIds, IsDeletedType isDeletedType);

	//	@Query("SELECT feed FROM FeedEntity feed where feed.isDeleted = 'N' order by rand()")
	//	List<FeedEntity> findByIsDeletedOrderByRandom(IsDeletedType isDeletedType, Pageable pageable);
	List<FeedEntity> findByIsDeletedOrderByCreatedAtDesc(IsDeletedType isDeletedType, Pageable pageable);

}