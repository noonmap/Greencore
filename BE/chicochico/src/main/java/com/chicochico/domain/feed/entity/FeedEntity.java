package com.chicochico.domain.feed.entity;


import com.chicochico.common.code.IsDeletedType;
import com.chicochico.common.entity.CommonEntity;
import com.chicochico.domain.user.entity.UserEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;


@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
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

	@Column(nullable = false)
	@Enumerated(EnumType.STRING)
	private IsDeletedType isDeleted;

	@Column(nullable = false)
	private Integer commentCount;

	@Builder.Default
	@OneToMany(mappedBy = "feed")
	private List<FeedTagEntity> feedTagList = new ArrayList<>();


	public void setIsDeleted(IsDeletedType isDeleted) {
		this.isDeleted = isDeleted;
	}


	public void setCommentCount(Integer commentCount) {
		this.commentCount = commentCount;
	}


	public void increaseLikeCount() {
		this.likeCount++;
	}


	public void decreaseLikeCount() {
		this.likeCount--;
	}


	public String getFeedCode() {
		return this.getClass().getAnnotation(DiscriminatorValue.class).value();
	}

}
