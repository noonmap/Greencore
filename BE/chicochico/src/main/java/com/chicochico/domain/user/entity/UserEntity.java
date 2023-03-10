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

	private String email;

	private String password;

	private String nickname;

	private String profileImagePath;

	private String introduction;

	private Integer followingCount;

	private Integer followerCount;

	@Enumerated(EnumType.STRING)
	private IsDeletedType isDeleted;

	@OneToMany(mappedBy = "user")
	private List<BookmarkEntity> bookmarkList = new ArrayList<>();

	@OneToMany(mappedBy = "user")
	private List<FollowEntity> followList = new ArrayList<>();

}
