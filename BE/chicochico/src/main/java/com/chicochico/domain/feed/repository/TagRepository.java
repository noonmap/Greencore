package com.chicochico.domain.feed.repository;


import com.chicochico.domain.feed.entity.TagEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


public interface TagRepository extends JpaRepository<TagEntity, Long> {

	List<TagEntity> findByContentContainingIgnoreCase(String content); // 대소문자 구분 X
	Optional<TagEntity> findByContentIgnoreCase(String content); // 대소문자 구분 X

}
