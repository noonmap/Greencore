package com.chicochico.domain.feed.entity;


import com.chicochico.common.code.IsDeletedType;
import com.chicochico.common.entity.CommonEntity;
import com.chicochico.domain.user.entity.UserEntity;
import com.chicochico.domain.user.entity.UserPlantEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;


@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "diary_set") // snake_case로 설정
public class DiarySetEntity extends CommonEntity {
	// createdAt, updatedAt은 CommonEntity에 들어있으므로 포함하지 않아도 됨.

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false) // FK 이름 지정
	private UserEntity user;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_plant_id", nullable = false) // FK 이름 지정
	private UserPlantEntity userPlant;

	@Column(nullable = false)
	private String imagePath;

	@Column(nullable = false)
	private Integer diaryCount;

	@Column(nullable = false)
	private String title;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private IsDeletedType isDeleted;

	// OneToMany는 관찰일기처럼 관찰일기에서 일기 목록을 조회하는게 효율적인 경우 추가한다. (optional)
	@OneToMany(mappedBy = "diarySet") // 연관 관계 엔티티의 매핑되는 필드 이름을 적어줌
	private List<DiaryEntity> diaryList = new ArrayList<>();

}
