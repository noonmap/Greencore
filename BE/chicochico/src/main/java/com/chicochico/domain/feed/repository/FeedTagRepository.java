package com.chicochico.domain.feed.repository;


import com.chicochico.domain.feed.entity.FeedEntity;
import com.chicochico.domain.feed.entity.FeedTagEntity;
import com.chicochico.domain.feed.entity.TagEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;


public interface FeedTagRepository extends JpaRepository<FeedTagEntity, Long> {

	List<FeedTagEntity> findByTag(TagEntity tag);

	@Query("select f from FeedTagEntity f where f.tag in (:tagList)")
	List<FeedTagEntity> findByTag(List<TagEntity> tagList);

	List<FeedTagEntity> findByFeed(FeedEntity feed);

}
