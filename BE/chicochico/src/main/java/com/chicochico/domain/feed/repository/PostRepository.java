package com.chicochico.domain.feed.repository;


import com.chicochico.common.code.IsDeletedType;
import com.chicochico.domain.feed.entity.PostEntity;
import com.chicochico.domain.user.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface PostRepository extends JpaRepository<PostEntity, Long> {

	List<PostEntity> findByUserAndIsDeleted(UserEntity user, IsDeletedType isDeletedType);

}
