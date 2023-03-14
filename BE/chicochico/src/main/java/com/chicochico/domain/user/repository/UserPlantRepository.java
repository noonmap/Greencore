package com.chicochico.domain.user.repository;


import com.chicochico.domain.user.entity.UserPlantEntity;
import org.springframework.data.jpa.repository.JpaRepository;


public interface UserPlantRepository extends JpaRepository<UserPlantEntity, Long> {
}
