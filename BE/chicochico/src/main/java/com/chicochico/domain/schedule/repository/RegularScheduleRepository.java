package com.chicochico.domain.schedule.repository;


import com.chicochico.common.code.IsDeletedType;
import com.chicochico.domain.schedule.entity.RegularScheduleEntity;
import com.chicochico.domain.user.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;


public interface RegularScheduleRepository extends JpaRepository<RegularScheduleEntity, Long> {

	Optional<RegularScheduleEntity> findById(Long regularId);
	List<RegularScheduleEntity> findAllByUserAndIsDeleted(UserEntity user, IsDeletedType isDeleted);
	List<RegularScheduleEntity> findAllByUserAndLastDateBeforeAndIsDeleted(UserEntity user, LocalDate date, IsDeletedType isDeleted);

}
