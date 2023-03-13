package com.chicochico.domain.user.repository;


import com.chicochico.domain.user.entity.FollowEntity;
import org.springframework.data.jpa.repository.JpaRepository;


public interface FollowRepository extends JpaRepository<FollowEntity, Long> {
}
