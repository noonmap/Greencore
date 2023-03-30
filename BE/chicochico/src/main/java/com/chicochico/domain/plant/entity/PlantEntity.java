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

	// 식물 이름 (ex, "name":"삼색 달개비")
	@Column(nullable = false)
	private String name;

	// 학명 (ex, "specificName":"Tradescantia albiflora 'Nanouk'")
	private String specificName;

	// 물 주기 (ex, "water":"평균 주 1~2회 흙 표면부터 3cm까지 마르면, 듬뿍 주세요")
	private String water;

	// 빛 (ex, "light":"반양지 하루 2~3시간 정도의 은은한 햇빛이 필요해요")
	private String light;

	// 습도 (ex, "humidity":"40~70% 주변 공기가 너무 축축하지 않게 관리해주세요")
	private String humidity;

	// 적정 온도 환경 (ex, "temperature":"잘 자라는 온도 15~25℃의 온도에서 잘 자라요")
	private String temperature;

	//  식물 이미지 (ex, "imagePath":"https://huga.s3.ap-northeast-2.amazonaws.com/plantImages/16781037244642.jpg")
	@Column(nullable = false, length = 500)
	private String imagePath;

	@Column(nullable = false)
	private Integer userCount;


	public void increaseUserCount() {
		this.userCount++;
	}


	public void decreaseUserCount() {
		this.userCount--;
	}

}
