package com.chicochico.domain.schedule.entity;


import com.chicochico.common.code.IsCompletedType;
import com.chicochico.common.code.ScheduleType;
import com.chicochico.common.entity.CommonEntity;
import com.chicochico.domain.user.entity.UserEntity;
import com.chicochico.domain.user.entity.UserPlantEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;


@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "schedule") // snake_case로 설정
public class ScheduleEntity extends CommonEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_plant_id", nullable = false) // FK 이름 지정
	private UserPlantEntity userPlant;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false) // FK 이름 지정
	private UserEntity user;

	@Column(nullable = false)
	@Enumerated(EnumType.STRING)
	private ScheduleType scheduleCode;

	private LocalDate date;

	private String content;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private IsCompletedType isCompleted;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "regular_id")
	private RegularScheduleEntity regularSchedule;


	public void setIsCompleted(IsCompletedType isCompleted) {
		this.isCompleted = isCompleted;
	}


	public void setRegularSchedule(RegularScheduleEntity regularSchedule) {
		this.regularSchedule = regularSchedule;
	}

}
