package com.chicochico.domain.feed.entity;


import com.chicochico.common.code.IsDeletedType;
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
@DiscriminatorValue("FEED_DIARY")
@Table(name = "diary") // snake_case로 설정
public class DiaryEntity extends FeedEntity {

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "diary_set_id", nullable = false)
	private DiarySetEntity diarySet;

	@Column(nullable = false)
	private LocalDate observationDate;

	@Column(nullable = false)
	@Enumerated(EnumType.STRING)
	private IsDeletedType isDeleted;

}
