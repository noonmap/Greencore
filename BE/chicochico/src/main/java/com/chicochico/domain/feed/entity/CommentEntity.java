package com.chicochico.domain.feed.entity;


import com.chicochico.common.code.IsDeletedType;
import com.chicochico.common.entity.CommonEntity;
import com.chicochico.domain.user.entity.UserEntity;
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
@Table(name = "comment") // snake_case로 설정
public class CommentEntity extends CommonEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "feed_id", nullable = false) // FK 이름 지정
	private FeedEntity feed;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false) // FK 이름 지정
	private UserEntity user;

	@Column(nullable = false)
	private String content;

	private Long mentionUserId; // 역정규화(?). FK로 엮지 않았음

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private IsDeletedType isDeleted;


	public void setIsDeleted() {
		this.isDeleted = IsDeletedType.Y;
	}


	public void setIsNotDeleted() {
		this.isDeleted = IsDeletedType.N;
	}

}
