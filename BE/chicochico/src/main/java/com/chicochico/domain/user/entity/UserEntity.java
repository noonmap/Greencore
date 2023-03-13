package com.chicochico.domain.user.entity;


import com.chicochico.common.code.IsDeletedType;
import com.chicochico.common.entity.CommonEntity;
import com.chicochico.domain.feed.entity.BookmarkEntity;
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
@Table(name = "user")
public class UserEntity extends CommonEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String email;

	@Column(nullable = false)
	private String password;

	@Column(nullable = false)
	private String nickname;

	@Column(nullable = false)
	private String profileImagePath;

	@Column(nullable = false)
	private String introduction;

	@Column(nullable = false)
	private Integer followingCount;

	@Column(nullable = false)
	private Integer followerCount;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private IsDeletedType isDeleted;

	@OneToMany(mappedBy = "user")
	private List<BookmarkEntity> bookmarkList = new ArrayList<>();

	@OneToMany(mappedBy = "follower")
	private List<FollowEntity> followerList = new ArrayList<>();

	@OneToMany(mappedBy = "following")
	private List<FollowEntity> followingList = new ArrayList<>();

}
