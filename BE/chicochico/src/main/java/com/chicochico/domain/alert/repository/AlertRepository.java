package com.chicochico.domain.alert.repository;


import com.chicochico.domain.alert.entity.AlertEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface AlertRepository extends JpaRepository<AlertEntity, Long> {

	List<AlertEntity> findAllByUserId(Long userId, Pageable pageable);

}
