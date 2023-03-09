package com.chicochico.domain.feed.repository;


import com.chicochico.domain.feed.entity.FeedEntity;
import org.springframework.data.jpa.repository.JpaRepository;


public interface FeedRepository extends JpaRepository<FeedEntity, Long> {
}
