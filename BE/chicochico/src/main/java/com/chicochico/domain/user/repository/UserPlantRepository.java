package com.chicochico.domain.user.repository;


import com.chicochico.common.code.IsDeletedType;
import com.chicochico.domain.user.entity.UserPlantEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface UserPlantRepository extends JpaRepository<UserPlantEntity, Long> {

	Optional<UserPlantEntity> findByIdAndIsDeleted(Long id, IsDeletedType isDeletedType);

}
