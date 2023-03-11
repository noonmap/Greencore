package com.chicochico.domain.feed.repository;


import com.chicochico.domain.feed.entity.PostEntity;
import org.springframework.data.jpa.repository.JpaRepository;


public interface PostRepository extends JpaRepository<PostEntity, Long> {
}
