-- script가 비면 안돼서 임시로 넣어둠
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