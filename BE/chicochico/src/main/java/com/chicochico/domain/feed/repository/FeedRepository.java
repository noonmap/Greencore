package com.chicochico.domain.feed.repository;


import com.chicochico.domain.feed.entity.FeedEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


public interface FeedRepository extends JpaRepository<FeedEntity, Long> {

	@Query("select f from FeedEntity f where f.user in (:userIds)")
	Page<FeedEntity> findByUserIn(Long[] userIds, Pageable pageable);

}
