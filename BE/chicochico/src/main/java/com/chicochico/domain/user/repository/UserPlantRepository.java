package com.chicochico.domain.user.repository;


import com.chicochico.common.code.IsDeletedType;
import com.chicochico.domain.user.entity.UserEntity;
import com.chicochico.domain.user.entity.UserPlantEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.Set;


public interface UserPlantRepository extends JpaRepository<UserPlantEntity, Long> {

	Optional<UserPlantEntity> findByIdAndIsDeleted(Long id, IsDeletedType isDeletedType);
	Page<UserPlantEntity> findByUserAndIsDeletedOrderByPlantNickname(UserEntity user, IsDeletedType isDeletedType, Pageable pageable);
	List<UserPlantEntity> findByUserIdAndIsDeletedOrderByPlantNickname(Long userId, IsDeletedType isDeleted);

	List<UserPlantEntity> findByUser(UserEntity user);

	@Query("SELECT DISTINCT up.user FROM UserPlantEntity up WHERE up.plant.id IN :plantIds AND up.isDeleted = 'N' AND up.user.isDeleted = 'N' AND up.user.id != :excludeUserId ORDER BY RAND()")
	List<UserEntity> findDistinctUsersByPlantIdsRandom(@Param("plantIds") Set<Long> plantIds, @Param("excludeUserId") Long excludeUserId, Pageable pageable);

}
