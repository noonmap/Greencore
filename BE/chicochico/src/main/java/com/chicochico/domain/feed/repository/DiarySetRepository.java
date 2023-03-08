package com.chicochico.domain.feed.repository;


import com.chicochico.domain.feed.entity.DiarySetEntity;
import org.springframework.data.jpa.repository.JpaRepository;


public interface DiarySetRepository extends JpaRepository<DiarySetEntity, Long> { // <Entity 객체, ID 타입>
}
