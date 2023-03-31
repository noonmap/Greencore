package com.chicochico.domain.feed.repository;


import com.chicochico.common.code.IsDeletedType;
import com.chicochico.domain.feed.entity.DiarySetEntity;
import com.chicochico.domain.user.entity.UserEntity;
import com.chicochico.domain.user.entity.UserPlantEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


public interface DiarySetRepository extends JpaRepository<DiarySetEntity, Long> { // <Entity 객체, ID 타입>

	Page<DiarySetEntity> findByUserAndIsDeleted(UserEntity user, IsDeletedType isDeletedType, Pageable pageable);

	Optional<DiarySetEntity> findByIdAndIsDeleted(Long id, IsDeletedType isDeletedType);

	List<DiarySetEntity> findTop2ByOrderByBookmarkCountDesc();

	Optional<DiarySetEntity> findByUserAndUserPlant(UserEntity user, UserPlantEntity userPlant);

}
