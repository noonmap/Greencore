package com.chicochico.domain.plant.entity;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;


@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "plant") // snake_case로 설정
public class PlantEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	// 식물 이름 (ex, "name":"선인장")
	@Column(nullable = false)
	private String name;

	// TODO 아래 식물 특성은 변동 가능성 있음

	// 식물 서식지 (ex, "habitat":"습지")
	@Column(nullable = false)
	private String habitat;

	// 적정 온도 환경 (ex, "temperature":"따뜻한 곳")
	@Column(nullable = false)
	private String temperature;

	// 물 주기 (ex, "water":"3일에 한번")
	@Column(nullable = false)
	private String water;

	// 햇빛 일조량 (ex, "sunlight":"햇빛이 잘 안드는 곳")
	@Column(nullable = false)
	private String sunlight;

	// 학명 (ex, "specificName":"선인장")
	@Column(nullable = false)
	private String specificName;

	// 원산지 (ex, "origin":"사막")
	@Column(nullable = false)
	private String origin;

	// 뿌리 형태 (ex, "rootForm":"모름")
	@Column(nullable = false)
	private String rootForm;

	// 관리수준 (ex, "managementLevel":"쉬움")
	@Column(nullable = false)
	private String managementLevel;

	// 배치장소 (ex, "placement":"습한 곳")
	@Column(nullable = false)
	private String placement;

	// 광 (ex, "light":"안남")
	@Column(nullable = false)
	private String light;

	// 생장속도 (ex, "growthRate":"빠름")
	@Column(nullable = false)
	private String growthRate;

	// 생장형 (ex, "growthType":"모름")
	@Column(nullable = false)
	private String growthType;

}
