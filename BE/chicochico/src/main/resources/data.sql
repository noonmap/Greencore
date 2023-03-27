-- user 3 추가 (비밀번호 : 1234)
INSERT INTO `chicochico`.`user_table`
(`created_at`,`updated_at`,`email`,`follower_count`,`following_count`,`introduction`,`is_deleted`,`nickname`,`password`,`profile_image_path`)
VALUES
(now(),now(), "test1@test.com",2,2,"김씨의 한 줄 소개입니다",'N',"김씨","$2a$10$EhMcbc0IBbz9SNcKOlImDuTUpEFO1BeR8KyRcu8PXTPN0zFXtI2di","/user/default.jpg"),
(now(),now(), "test2@test.com",1,1,"임씨의 한 줄 소개입니다",'N',"임씨","$2a$10$EhMcbc0IBbz9SNcKOlImDuTUpEFO1BeR8KyRcu8PXTPN0zFXtI2di","/user/default.jpg"),
(now(),now(), "test3@test.com",1,1,"양씨의 한 줄 소개입니다",'N',"양씨","$2a$10$EhMcbc0IBbz9SNcKOlImDuTUpEFO1BeR8KyRcu8PXTPN0zFXtI2di","/user/default.jpg");
SET @user1 := last_insert_id();
SET @user2 := @user1 + 1;
SET @user3 := @user2 + 1;

-- 팔로우 추가
INSERT INTO `chicochico`.`follow`
(`follower_id`,`following_id`)
VALUES
-- 유저1 -> 유저2
(@user1,@user2),
-- 유저1 -> 유저3
(@user1,@user3),
-- 유저2 -> 유저1
(@user2,@user1),
-- 유저3 -> 유저1
(@user3,@user1);

-- 식물 5 추가
INSERT INTO `chicochico`.`plant`
(`image_path`,`name`,`user_count`)
VALUES
("/plant/default.jpg","딸기",2),
("/plant/default.jpg","토마토",3),
("/plant/default.jpg","오이",1),
("/plant/default.jpg","대파",1),
("/plant/default.jpg","쪽파",0);
SET @plant1 := last_insert_id();
SET @plant2 := @plant1 + 1;
SET @plant3 := @plant2 + 1;
SET @plant4 := @plant3 + 1;
SET @plant5 := @plant4 + 1;

-- 내키식 추가
INSERT INTO `chicochico`.`user_plant`
(`created_at`,`updated_at`,`is_deleted`,`plant_image_path`,`plant_nickname`,`plant_id`,`user_id`)
VALUES
-- 유저1 내키식 2개 추가 (딸기, 토마토)
(now(), now(), 'N', "/plant/default.jpg", "딸기케이크",@plant1,@user1),
(now(), now(), 'N', "/plant/default.jpg", "카프레제",	@plant2,@user1),
-- 유저2 내키식 3개 추가 (딸기, 토마토, 오이)
(now(), now(), 'N', "/plant/default.jpg", "딸기스무디",@plant1,@user2),
(now(), now(), 'N', "/plant/default.jpg", "아라비아따",@plant2,@user2),
(now(), now(), 'N', "/plant/default.jpg", "시원한오이무침",@plant3,@user2),
-- 유저3 내키식 2개 추가 (토마토, 대파)
(now(), now(), 'N', "/plant/default.jpg", "마르게리따",@plant2,@user3),
(now(), now(), 'N', "/plant/default.jpg", "대파볶음밥",@plant4,@user3);
SET @user_plant1 := last_insert_id();
SET @user_plant2 := @user_plant1 + 1;
SET @user_plant3 := @user_plant2 + 1;
SET @user_plant4 := @user_plant3 + 1;
SET @user_plant5 := @user_plant4 + 1;
SET @user_plant6 := @user_plant5 + 1;
SET @user_plant7 := @user_plant6 + 1;

-- 게시글 추가
INSERT INTO `chicochico`.`feed`
(`feed_code`,`created_at`,`updated_at`,`comment_count`,`content`,`image_path`,`is_deleted`,`like_count`,`user_id`)
VALUES
-- 유저1 게시글 2개 추가
('FEED_POST',now(),now(),2,'김씨의 게시글1','/post/default.jpg','N',1,@user1),
('FEED_POST',now(),now(),2,'김씨의 게시글2','/post/default.jpg','N',1,@user1),
-- 유저2 게시글 2개 추가
('FEED_POST',now(),now(),2,'임씨의 게시글1','/post/default.jpg','N',1,@user2),
('FEED_POST',now(),now(),2,'임씨의 게시글2','/post/default.jpg','N',1,@user2),
-- 유저3 게시글 2개 추가
('FEED_POST',now(),now(),2,'양씨의 게시글1','/post/default.jpg','N',1,@user3),
('FEED_POST',now(),now(),2,'양씨의 게시글2','/post/default.jpg','N',1,@user3);
SET @post1 := last_insert_id();
SET @post2 := @post1 + 1;
SET @post3 := @post2 + 1;
SET @post4 := @post3 + 1;
SET @post5 := @post4 + 1;
SET @post6 := @post5 + 1;

INSERT INTO `chicochico`.`post`
(`id`)
VALUES
(@post1),(@post2),(@post3),(@post4),(@post5),(@post6);

-- 관찰일지 추가
INSERT INTO `chicochico`.`diary_set`
(`created_at`,`updated_at`,`bookmark_count`,`diary_count`,`image_path`,`is_deleted`,`is_enabled_add_diary`,`title`,`user_id`,`user_plant_id`)
VALUES
(now(),now(),1,6,"/diaryset/default.jpg",'N','Y','김씨의 딸기 관찰일지', 	@user1, @user_plant1),
(now(),now(),1,0,"/diaryset/default.jpg",'N','Y','김씨의 토마토 관찰일지', 	@user1, @user_plant2),
(now(),now(),1,0,"/diaryset/default.jpg",'N','Y','임씨의 딸기 관찰일지', 	@user2, @user_plant3),
(now(),now(),1,6,"/diaryset/default.jpg",'N','Y','임씨의 토마토 관찰일지', 	@user2, @user_plant4),
(now(),now(),1,0,"/diaryset/default.jpg",'N','Y','임씨의 오이 관찰일지', 	@user2, @user_plant5),
(now(),now(),0,0,"/diaryset/default.jpg",'N','Y','양씨의 토마토 관찰일지', 	@user3, @user_plant6),
(now(),now(),1,8,"/diaryset/default.jpg",'N','Y','양씨의 대파 관찰일지', 	@user3, @user_plant7);
SET @diaryset1 := last_insert_id();
SET @diaryset2 := @diaryset1 + 1;
SET @diaryset3 := @diaryset2 + 1;
SET @diaryset4 := @diaryset3 + 1;
SET @diaryset5 := @diaryset4 + 1;
SET @diaryset6 := @diaryset5 + 1;
SET @diaryset7 := @diaryset6 + 1;

-- 일지 추가
INSERT INTO `chicochico`.`feed`
(`feed_code`,`created_at`,`updated_at`,`comment_count`,`content`,`image_path`,`is_deleted`,`like_count`,`user_id`)
VALUES
-- user1
('FEED_DIARY',now()-interval 60 day,now()-interval 60 day,2,'오늘은 새싹이 났다.',		'/diary/default.jpg','N',1,@user1),
('FEED_DIARY',now()-interval 55 day,now()-interval 55 day,2,'오늘은 줄기가 더 자랐다.',	'/diary/default.jpg','N',1,@user1),
('FEED_DIARY',now()-interval 45 day,now()-interval 45 day,2,'떡잎이 하나 생겼다',		'/diary/default.jpg','N',1,@user1),
('FEED_DIARY',now()-interval 39 day,now()-interval 39 day,2,'뿌리가 점점 커지는게 보인다. 뿌듯하다.','/diary/default.jpg','N',0,@user1),
('FEED_DIARY',now()-interval 21 day,now()-interval 21 day,2,'꽃이 폈다!',				'/diary/default.jpg','N',0,@user1),
('FEED_DIARY',now()-interval 10 day,now()-interval 10 day,2,'열매가 맺혔다!',			'/diary/default.jpg','N',2,@user1),
-- user2
('FEED_DIARY',now()-interval 70 day,now()-interval 70 day,2,'오늘은 새싹이 났다.',		'/diary/default.jpg','N',2,@user2),
('FEED_DIARY',now()-interval 55 day,now()-interval 55 day,2,'오늘은 줄기가 더 자랐다.',	'/diary/default.jpg','N',2,@user2),
('FEED_DIARY',now()-interval 35 day,now()-interval 35 day,2,'떡잎이 하나 생겼다',		'/diary/default.jpg','N',1,@user2),
('FEED_DIARY',now()-interval 29 day,now()-interval 29 day,2,'뿌리가 점점 커지는게 보인다. 뿌듯하다.','/diary/default.jpg','N',1,@user2),
('FEED_DIARY',now()-interval 21 day,now()-interval 21 day,2,'꽃이 폈다!',				'/diary/default.jpg','N',0,@user2),
('FEED_DIARY',now()-interval 10 day,now()-interval 10 day,2,'열매가 맺혔다!',			'/diary/default.jpg','N',1,@user2),
-- user3
('FEED_DIARY',now()-interval 30 day,now()-interval 30 day,2,'대파 뿌리를 물에 담궜다',	'/diary/default.jpg','N',1,@user3),
('FEED_DIARY',now()-interval 25 day,now()-interval 25 day,2,'싱싱하다',				'/diary/default.jpg','N',1,@user3),
('FEED_DIARY',now()-interval 23 day,now()-interval 23 day,2,'줄기가 하나 튀어나왔다.',	'/diary/default.jpg','N',1,@user3),
('FEED_DIARY',now()-interval 17 day,now()-interval 17 day,2,'뿌리가 점점 커지는게 보인다. 뿌듯하다.','/diary/default.jpg','N',0,@user3),
('FEED_DIARY',now()-interval 15 day,now()-interval 15 day,2,'꼬랑지가 예쁘게 휘어졌다.',	'/diary/default.jpg','N',0,@user3),
('FEED_DIARY',now()-interval 10 day,now()-interval 10 day,2,'대파가 쑥쑥 자란다',		'/diary/default.jpg','N',0,@user3),
('FEED_DIARY',now()-interval 5 day,now()-interval 5 day,2,'대파를 잘랐다',				'/diary/default.jpg','N',0,@user3),
('FEED_DIARY',now()-interval 1 day,now()-interval 1 day,2,'맛있는 대파 볶음밥!',			'/diary/default.jpg','N',0,@user3);
-- user1
SET @diary1 := last_insert_id();
SET @diary2 := @diary1 + 1;
SET @diary3 := @diary2 + 1;
SET @diary4 := @diary3 + 1;
SET @diary5 := @diary4 + 1;
SET @diary6 := @diary5 + 1;
-- user2
SET @diary7 := @diary6 + 1;
SET @diary8 := @diary7 + 1;
SET @diary9 := @diary8 + 1;
SET @diary10 := @diary9 + 1;
SET @diary11 := @diary10 + 1;
SET @diary12 := @diary11 + 1;
-- user 3
SET @diary13 := @diary12 + 1;
SET @diary14 := @diary13 + 1;
SET @diary15 := @diary14 + 1;
SET @diary16 := @diary15 + 1;
SET @diary17 := @diary16 + 1;
SET @diary18 := @diary17 + 1;
SET @diary19 := @diary18 + 1;
SET @diary20 := @diary19 + 1;

INSERT INTO `chicochico`.`diary`
(`id`, `observation_date`,`diary_set_id`)
VALUES
-- user1 - 딸기
(@diary1,date(curdate() - interval 60 day),@diaryset1),
(@diary2,date(curdate() - interval 55 day),@diaryset1),
(@diary3,date(curdate() - interval 45 day),@diaryset1),
(@diary4,date(curdate() - interval 39 day),@diaryset1),
(@diary5,date(curdate() - interval 21 day),@diaryset1),
(@diary6,date(curdate() - interval 10 day),@diaryset1),
-- user2 - 토마토
(@diary7,date(curdate() - interval 70 day),@diaryset4),
(@diary8,date(curdate() - interval 55 day),@diaryset4),
(@diary9,date(curdate() - interval 35 day),@diaryset4),
(@diary10,date(curdate() - interval 29 day),@diaryset4),
(@diary11,date(curdate() - interval 21 day),@diaryset4),
(@diary12,date(curdate() - interval 10 day),@diaryset4),
-- user3 - 토마토
(@diary13,date(curdate() - interval 30 day),@diaryset7),
(@diary14,date(curdate() - interval 25 day),@diaryset7),
(@diary15,date(curdate() - interval 23 day),@diaryset7),
(@diary16,date(curdate() - interval 17 day),@diaryset7),
(@diary17,date(curdate() - interval 15 day),@diaryset7),
(@diary18,date(curdate() - interval 10 day),@diaryset7),
(@diary19,date(curdate() - interval 5 day), @diaryset7),
(@diary20,date(curdate() - interval 1 day), @diaryset7);

-- 댓글 추가
INSERT INTO `chicochico`.`comment`
(`created_at`,
`updated_at`,
`content`,
`is_deleted`,
`mention_user_id`,
`feed_id`,
`user_id`)
VALUES
-- 게시글
-- u2 -> p1
(now(), now(), '무플방지위원회입니다', 'N', null, @post1, @user2),
-- u3 -> p1
(now(), now(), '너무 멋져요~', 'N', null, @post1, @user3),
-- u2 -> p2
(now(), now(), '무플방지위원회입니다', 'N', null, @post2, @user2),
-- u3 -> p2
(now(), now(), '너무 멋져요~', 'N', null, @post2, @user3),
-- u1 -> p3
(now(), now(), '너무 멋져요~', 'N', null, @post3, @user1),
-- u3 -> p3
(now(), now(), '무플방지위원회입니다', 'N', null, @post3, @user3),
-- u1 -> p4
(now(), now(), '너무 멋져요~', 'N', null, @post4, @user1),
-- u3 -> p4
(now(), now(), '무플방지위원회입니다', 'N', null, @post4, @user3),
-- u1 -> p5
(now(), now(), '너무 멋져요~', 'N', null, @post5, @user1),
-- u2 -> p5
(now(), now(), '무플방지위원회입니다', 'N', null, @post5, @user2),
-- u1 -> p6
(now(), now(), '너무 멋져요~', 'N', null, @post6, @user1),
-- u2 -> p6
(now(), now(), '무플방지위원회입니다', 'N', null, @post6, @user2),
-- 일지
-- u1 -> d6 ~ d19
(now(), now(), '무플방지위원회입니다', 'N', null, @diary6, @user1),
(now(), now(), '무플방지위원회입니다', 'N', null, @diary7, @user1),
(now(), now(), '무플방지위원회입니다', 'N', null, @diary8, @user1),
(now(), now(), '무플방지위원회입니다', 'N', null, @diary9, @user1),
(now(), now(), '무플방지위원회입니다', 'N', null, @diary10, @user1),
(now(), now(), '무플방지위원회입니다', 'N', null, @diary11, @user1),
(now(), now(), '무플방지위원회입니다', 'N', null, @diary12, @user1),
(now(), now(), '무플방지위원회입니다', 'N', null, @diary13, @user1),
(now(), now(), '무플방지위원회입니다', 'N', null, @diary14, @user1),
(now(), now(), '무플방지위원회입니다', 'N', null, @diary15, @user1),
(now(), now(), '무플방지위원회입니다', 'N', null, @diary16, @user1),
(now(), now(), '무플방지위원회입니다', 'N', null, @diary17, @user1),
(now(), now(), '무플방지위원회입니다', 'N', null, @diary18, @user1),
(now(), now(), '무플방지위원회입니다', 'N', null, @diary19, @user1),
-- u2 -> d1 ~ d5, d12 ~ d19
(now(), now(), '무플방지위원회입니다', 'N', null, @diary1, @user2),
(now(), now(), '무플방지위원회입니다', 'N', null, @diary2, @user2),
(now(), now(), '무플방지위원회입니다', 'N', null, @diary3, @user2),
(now(), now(), '무플방지위원회입니다', 'N', null, @diary4, @user2),
(now(), now(), '무플방지위원회입니다', 'N', null, @diary5, @user2),
(now(), now(), '무플방지위원회입니다', 'N', null, @diary12, @user2),
(now(), now(), '무플방지위원회입니다', 'N', null, @diary13, @user2),
(now(), now(), '무플방지위원회입니다', 'N', null, @diary14, @user2),
(now(), now(), '무플방지위원회입니다', 'N', null, @diary15, @user2),
(now(), now(), '무플방지위원회입니다', 'N', null, @diary16, @user2),
(now(), now(), '무플방지위원회입니다', 'N', null, @diary17, @user2),
(now(), now(), '무플방지위원회입니다', 'N', null, @diary18, @user2),
(now(), now(), '무플방지위원회입니다', 'N', null, @diary19, @user2),
-- u3 -> d1 ~ d11
(now(), now(), '무플방지위원회입니다', 'N', null, @diary1, @user3),
(now(), now(), '무플방지위원회입니다', 'N', null, @diary2, @user3),
(now(), now(), '무플방지위원회입니다', 'N', null, @diary3, @user3),
(now(), now(), '무플방지위원회입니다', 'N', null, @diary4, @user3),
(now(), now(), '무플방지위원회입니다', 'N', null, @diary5, @user3),
(now(), now(), '무플방지위원회입니다', 'N', null, @diary6, @user3),
(now(), now(), '무플방지위원회입니다', 'N', null, @diary7, @user3),
(now(), now(), '무플방지위원회입니다', 'N', null, @diary8, @user3),
(now(), now(), '무플방지위원회입니다', 'N', null, @diary9, @user3),
(now(), now(), '무플방지위원회입니다', 'N', null, @diary10, @user3),
(now(), now(), '무플방지위원회입니다', 'N', null, @diary11, @user3);


-- 태그 추가
INSERT INTO `chicochico`.`tag`
(`created_at`,`updated_at`,`content`,`count`)
VALUES
(now(),now(),"귀여움",8),
(now(),now(),"쑥쑥자라라",8),
(now(),now(),"사랑스러움",10),
(now(),now(),"고양이",5),
(now(),now(),"리트리버",4),
(now(),now(),"잎사귀",1),
(now(),now(),"치코리타",0);
SET @tag1 := last_insert_id();
SET @tag2 := @tag1 + 1;
SET @tag3 := @tag2 + 1;
SET @tag4 := @tag3 + 1;
SET @tag5 := @tag4 + 1;
SET @tag6 := @tag5 + 1;
SET @tag7 := @tag6 + 1;

-- 태그 - 피드 추가
INSERT INTO `chicochico`.`feed_tag`
(`feed_id`,`tag_id`)
VALUES
-- 게시글 태그 추가
-- p1 - t1,t2,t3
(@post1, @tag1),
(@post1, @tag2),
(@post1, @tag3),
-- p3 - t1,t2,t3
(@post3, @tag1),
(@post3, @tag2),
(@post3, @tag3),
-- p5 - t3,t4,t5,t6
(@post5, @tag3),
(@post5, @tag4),
(@post5, @tag5),
(@post5, @tag6),
-- 일지 태그 추가
-- user1
-- d1 - t1,t2
(@diary1, @tag1),
(@diary1, @tag2),
-- d2 - t1,t2,t3
(@diary2, @tag1),
(@diary2, @tag2),
(@diary2, @tag3),
-- d3 - t3,t4,t5
(@diary3, @tag3),
(@diary3, @tag4),
(@diary3, @tag5),
-- user2
-- d6 - t1,t2
(@diary6, @tag1),
(@diary6, @tag2),
-- d7 - t1,t2,t3
(@diary7, @tag1),
(@diary7, @tag2),
(@diary7, @tag3),
-- d8 - t3,t4,t5
(@diary8, @tag3),
(@diary8, @tag4),
(@diary8, @tag5),
-- user3
-- d12 - t1,t2,t3
(@diary12, @tag1),
(@diary12, @tag2),
(@diary12, @tag3),
-- d13 - t1,t2,t3,t4
(@diary13, @tag1),
(@diary13, @tag2),
(@diary13, @tag3),
(@diary13, @tag4),
-- d14 - t3,t4,t5
(@diary14, @tag3),
(@diary14, @tag4),
(@diary14, @tag5);

-- 관찰일지 북마크 추가
INSERT INTO `chicochico`.`bookmark`
(`diary_set_id`,`user_id`)
VALUES
-- u1 -> ds3, ds5
(@diaryset3, @user1),
(@diaryset5, @user1),
-- u2 -> ds2, ds7
(@diaryset2, @user2),
(@diaryset7, @user2),
-- u3 -> ds1, ds4
(@diaryset1, @user3),
(@diaryset3, @user3);

-- 피드 좋아요 추가 p1~6, d1~19
INSERT INTO `chicochico`.`feed_like`
(`feed_id`,`user_id`)
VALUES
-- 게시글
-- u1 -> p3, p5
(@post3, @user1),
(@post5, @user1),
-- u2 -> p1, p5
(@post1, @user2),
(@post5, @user2),
-- u3 -> p2, p4
(@post2, @user3),
(@post4, @user3),
-- 일지
-- u1 -> d6,d7,d8/d12,d13
(@diary6, @user1),
(@diary7, @user1),
(@diary8, @user1),
(@diary12, @user1),
(@diary13, @user1),
-- u2 -> d1,d2,d3/d14,d15
(@diary1, @user2),
(@diary2, @user2),
(@diary3, @user2),
(@diary14, @user2),
(@diary15, @user2),
-- u3 -> d6,d7,d8/d9,d10
(@diary6, @user3),
(@diary7, @user3),
(@diary8, @user3),
(@diary9, @user3),
(@diary10, @user3);
