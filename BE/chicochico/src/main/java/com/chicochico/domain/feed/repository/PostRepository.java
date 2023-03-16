package com.chicochico.domain.feed.repository;


import com.chicochico.domain.feed.entity.PostEntity;
import com.chicochico.domain.user.entity.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;


public interface PostRepository extends JpaRepository<PostEntity, Long> {

	Page<PostEntity> findByUser(UserEntity user, Pageable pageable);

}
