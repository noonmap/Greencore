package com.chicochico.domain.feed.entity;


import com.chicochico.common.code.FeedType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.Table;


@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@DiscriminatorValue("FEED_POST")
@Table(name = "post") // snake_case로 설정
public class PostEntity extends FeedEntity{
}
