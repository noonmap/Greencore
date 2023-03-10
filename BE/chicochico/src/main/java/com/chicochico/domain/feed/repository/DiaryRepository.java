package com.chicochico.domain.feed.repository;


import com.chicochico.domain.feed.entity.DiaryEntity;
import org.springframework.data.jpa.repository.JpaRepository;


public interface DiaryRepository extends JpaRepository<DiaryEntity, Long> {
}
