package com.chicochico.domain.feed.repository;


import com.chicochico.domain.feed.entity.CommentEntity;
import org.springframework.data.jpa.repository.JpaRepository;


public interface CommentRepository extends JpaRepository<CommentEntity, Long> {
}
