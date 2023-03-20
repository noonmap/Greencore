package com.chicochico.domain.plant.repository;


import com.chicochico.domain.plant.entity.PlantEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


public interface PlantRepository extends JpaRepository<PlantEntity, Long> {

	Page<PlantEntity> findAllByNameContaining(String search, Pageable pageable);
	Page<PlantEntity> findAllByNameBetween(String str1, String str2, Pageable pageable);
	Optional<PlantEntity> findById(Long plantId);
	List<PlantEntity> findTop5ByOrderByUserCountDesc();

}
