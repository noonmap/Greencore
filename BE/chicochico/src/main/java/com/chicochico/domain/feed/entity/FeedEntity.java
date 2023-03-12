package com.chicochico.domain.feed.entity;


import com.chicochico.common.code.FeedType;
import com.chicochico.common.code.IsDeletedType;
import com.chicochico.common.entity.CommonEntity;
import com.chicochico.domain.user.entity.UserEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;


@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
//@Builder
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "feed_code")
@Table(name = "feed")
public class FeedEntity extends CommonEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false)
	private UserEntity user;

	@Column(nullable = false)
	private String content;

	private String imagePath;

	@Column(nullable = false)
	private Integer likeCount;

	@Column(name = "feed_code", nullable = false)
	@Enumerated(EnumType.STRING)
	private FeedType feedCode;

	@Column(nullable = false)
	@Enumerated(EnumType.STRING)
	private IsDeletedType isDeletedType;

}
