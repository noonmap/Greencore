package com.chicochico.common.entity;


import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "common_code")
public class CommonCodeEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "code_seq")
	private String code;

	@ManyToOne
	@JoinColumn(name = "group_code")
	private CommonGroupCodeEntity groupCode;

	private String codeName;

}