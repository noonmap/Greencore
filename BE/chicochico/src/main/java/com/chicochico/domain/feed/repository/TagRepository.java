package com.chicochico.domain.feed.repository;


import com.chicochico.domain.feed.entity.TagEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface TagRepository extends JpaRepository<TagEntity, Long> {

	List<TagEntity> findByContentContainingIgnoreCase(String content); // 대소문자 구분 X

}
