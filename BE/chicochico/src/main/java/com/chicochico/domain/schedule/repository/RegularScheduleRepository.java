package com.chicochico.domain.schedule.repository;


import com.chicochico.domain.schedule.entity.RegularScheduleEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


public interface RegularScheduleRepository extends JpaRepository<RegularScheduleEntity, Long> {

	Optional<RegularScheduleEntity> findById(Long regularId);
	List<RegularScheduleEntity> findAll();

}
