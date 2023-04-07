package com.chicochico.domain.feed.entity;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import javax.persistence.*;
import java.time.LocalDate;


@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@DiscriminatorValue("FEED_DIARY")
@Table(name = "diary") // snake_case로 설정
public class DiaryEntity extends FeedEntity {

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "diary_set_id", nullable = false)
	private DiarySetEntity diarySet;

	@Column(nullable = false)
	private LocalDate observationDate;

}
