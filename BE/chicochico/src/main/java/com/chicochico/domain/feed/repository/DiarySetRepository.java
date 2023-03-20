package com.chicochico.domain.feed.repository;


import com.chicochico.common.code.IsDeletedType;
import com.chicochico.domain.feed.entity.DiarySetEntity;
import com.chicochico.domain.user.entity.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;


public interface DiarySetRepository extends JpaRepository<DiarySetEntity, Long> { // <Entity 객체, ID 타입>

	Page<DiarySetEntity> findByUserAndIsDeleted(UserEntity user, IsDeletedType isDeletedType, Pageable pageable);

}
