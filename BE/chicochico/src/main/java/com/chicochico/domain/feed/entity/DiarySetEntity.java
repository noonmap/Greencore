package com.chicochico.domain.feed.entity;


import com.chicochico.common.code.IsDeletedType;
import com.chicochico.common.code.IsEnabledType;
import com.chicochico.common.entity.CommonEntity;
import com.chicochico.domain.user.entity.UserEntity;
import com.chicochico.domain.user.entity.UserPlantEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;


@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
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
	private LocalDate startDate;

	@Column(nullable = false)
	private String title;

	@Column(nullable = false)
	@Enumerated(EnumType.STRING)
	@Builder.Default
	private IsEnabledType isEnabledAddDiary = IsEnabledType.Y; // 일지를 추가할 수 있는지 여부

	@Column(nullable = false)
	@Builder.Default
	private Integer bookmarkCount = 0;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private IsDeletedType isDeleted;

	// OneToMany는 관찰일기처럼 관찰일기에서 일기 목록을 조회하는게 효율적인 경우 추가한다. (optional)
	@Builder.Default
	@OneToMany(mappedBy = "diarySet") // 연관 관계 엔티티의 매핑되는 필드 이름을 적어줌
	private List<DiaryEntity> diaryList = new ArrayList<>();


	public void setIsDeleted(IsDeletedType isDeleted) {
		this.isDeleted = isDeleted;
	}


	public void setIsEnabledAddDiary(IsEnabledType isEnabledAddDiary) {
		this.isEnabledAddDiary = isEnabledAddDiary;
	}


	public void clearBookmarkCount() {
		this.bookmarkCount = 0;
	}


	public void increaseBookmarkCount() {
		this.bookmarkCount++;
	}


	public void decreaseBookmarkCount() {
		this.bookmarkCount--;
	}


	public void clearDiaryCount() {
		this.diaryCount = 0;
	}


	public void increaseDiaryCount() {
		this.diaryCount++;
	}


	public void decreaseDiaryCount() {
		this.diaryCount--;
	}

}
