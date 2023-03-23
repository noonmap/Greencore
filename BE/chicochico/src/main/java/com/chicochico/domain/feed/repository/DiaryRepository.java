package com.chicochico.domain.feed.repository;


import com.chicochico.common.code.IsDeletedType;
import com.chicochico.domain.feed.entity.DiaryEntity;
import com.chicochico.domain.feed.entity.DiarySetEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


public interface DiaryRepository extends JpaRepository<DiaryEntity, Long> {

	List<DiaryEntity> findByDiarySetAndIsDeleted(DiarySetEntity diarySet, IsDeletedType isDeletedType);
	Optional<DiaryEntity> findByIdAndIsDeleted(Long diaryId, IsDeletedType isDeletedType);

}
