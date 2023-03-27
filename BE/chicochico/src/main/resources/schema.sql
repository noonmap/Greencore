DROP TABLE IF EXISTS `alert`;
DROP TABLE IF EXISTS `feed_like`;
DROP TABLE IF EXISTS `bookmark`;
DROP TABLE IF EXISTS `feed_tag`;
DROP TABLE IF EXISTS `comment`;
DROP TABLE IF EXISTS `diary`;
DROP TABLE IF EXISTS `diary_set`;
DROP TABLE IF EXISTS `schedule`;
DROP TABLE IF EXISTS `user_plant`;
DROP TABLE IF EXISTS `post`;
DROP TABLE IF EXISTS `feed`;
DROP TABLE IF EXISTS `follow`;
DROP TABLE IF EXISTS `tag`;
DROP TABLE IF EXISTS `plant`;
DROP TABLE IF EXISTS `user_table`;
DROP TABLE IF EXISTS `code`;
DROP TABLE IF EXISTS `group_code`;

CREATE TABLE `group_code` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `description` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `code` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `description` varchar(255) NOT NULL,
  `group_id` bigint NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `user_table` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `email` varchar(255) NOT NULL,
  `follower_count` int NOT NULL,
  `following_count` int NOT NULL,
  `introduction` varchar(255) NOT NULL,
  `is_deleted` varchar(255) NOT NULL,
  `nickname` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `profile_image_path` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `alert` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `content` varchar(255) NOT NULL,
  `url_path` varchar(255) NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKf7a0a2h9v7oq5ix09aoul6gil` (`user_id`),
  CONSTRAINT `FKf7a0a2h9v7oq5ix09aoul6gil` FOREIGN KEY (`user_id`) REFERENCES `user_table` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `plant` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `growth_rate` varchar(255) DEFAULT NULL,
  `growth_type` varchar(255) DEFAULT NULL,
  `habitat` varchar(255) DEFAULT NULL,
  `image_path` varchar(255) NOT NULL,
  `light` varchar(255) DEFAULT NULL,
  `management_level` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `origin` varchar(255) DEFAULT NULL,
  `placement` varchar(255) DEFAULT NULL,
  `root_form` varchar(255) DEFAULT NULL,
  `specific_name` varchar(255) DEFAULT NULL,
  `sunlight` varchar(255) DEFAULT NULL,
  `temperature` varchar(255) DEFAULT NULL,
  `user_count` int NOT NULL,
  `water` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `user_plant` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `is_deleted` varchar(255) NOT NULL,
  `plant_image_path` varchar(255) NOT NULL,
  `plant_nickname` varchar(255) NOT NULL,
  `plant_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK5k0ey84cknl8qgd36tw6ara86` (`plant_id`),
  KEY `FKbaw2l85ueq1jk59ga6ia8bp5n` (`user_id`),
  CONSTRAINT `FK5k0ey84cknl8qgd36tw6ara86` FOREIGN KEY (`plant_id`) REFERENCES `plant` (`id`),
  CONSTRAINT `FKbaw2l85ueq1jk59ga6ia8bp5n` FOREIGN KEY (`user_id`) REFERENCES `user_table` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `feed` (
  `feed_code` varchar(31) NOT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `comment_count` int NOT NULL,
  `content` varchar(255) NOT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `is_deleted` varchar(255) NOT NULL,
  `like_count` int NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKojifc8e4q343idqn9chonkc1p` (`user_id`),
  CONSTRAINT `FKojifc8e4q343idqn9chonkc1p` FOREIGN KEY (`user_id`) REFERENCES `user_table` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `post` (
  `id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `FK71na0pi3dcws28qx6lqy9rgiq` FOREIGN KEY (`id`) REFERENCES `feed` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `follow` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `follower_id` bigint NOT NULL,
  `following_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK9yv15wq6ri9iafil8sks04xfc` (`follower_id`),
  KEY `FKs31vrssavuf9xvi5ostnj8sfv` (`following_id`),
  CONSTRAINT `FK9yv15wq6ri9iafil8sks04xfc` FOREIGN KEY (`follower_id`) REFERENCES `user_table` (`id`),
  CONSTRAINT `FKs31vrssavuf9xvi5ostnj8sfv` FOREIGN KEY (`following_id`) REFERENCES `user_table` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `tag` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `content` varchar(255) NOT NULL,
  `count` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `diary_set` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `start_date` date NOT NULL,
  `bookmark_count` int NOT NULL,
  `diary_count` int NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `is_deleted` varchar(255) NOT NULL,
  `is_enabled_add_diary` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `user_id` bigint NOT NULL,
  `user_plant_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKshfbhin6ux5934gopfel710p8` (`user_id`),
  KEY `FKtpoghmc0iw3o0708u40dwghmw` (`user_plant_id`),
  CONSTRAINT `FKshfbhin6ux5934gopfel710p8` FOREIGN KEY (`user_id`) REFERENCES `user_table` (`id`),
  CONSTRAINT `FKtpoghmc0iw3o0708u40dwghmw` FOREIGN KEY (`user_plant_id`) REFERENCES `user_plant` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `diary` (
  `observation_date` date NOT NULL,
  `id` bigint NOT NULL,
  `diary_set_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKkw1tkqel9u82ltgoa6mycil2y` (`diary_set_id`),
  CONSTRAINT `FKd2y54p56unx9aj1jk1y2t2vjv` FOREIGN KEY (`id`) REFERENCES `feed` (`id`),
  CONSTRAINT `FKkw1tkqel9u82ltgoa6mycil2y` FOREIGN KEY (`diary_set_id`) REFERENCES `diary_set` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `comment` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `content` varchar(255) NOT NULL,
  `is_deleted` varchar(255) NOT NULL,
  `mention_user_id` bigint DEFAULT NULL,
  `feed_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKmq57ocw5jrw8rd2lot1g8t0v2` (`feed_id`),
  KEY `FK99qtupwiidpsy7g0o8ppdgaur` (`user_id`),
  CONSTRAINT `FK99qtupwiidpsy7g0o8ppdgaur` FOREIGN KEY (`user_id`) REFERENCES `user_table` (`id`),
  CONSTRAINT `FKmq57ocw5jrw8rd2lot1g8t0v2` FOREIGN KEY (`feed_id`) REFERENCES `feed` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `feed_tag` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `feed_id` bigint NOT NULL,
  `tag_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK62bjxf2ug56taebkuhhyqch85` (`feed_id`),
  KEY `FKsvdflgl0mnqvpirg0yc8dmcn6` (`tag_id`),
  CONSTRAINT `FK62bjxf2ug56taebkuhhyqch85` FOREIGN KEY (`feed_id`) REFERENCES `feed` (`id`),
  CONSTRAINT `FKsvdflgl0mnqvpirg0yc8dmcn6` FOREIGN KEY (`tag_id`) REFERENCES `tag` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `bookmark` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `diary_set_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKe99na2k6pq7wd3gq91lswx70y` (`diary_set_id`),
  KEY `FKbk9ha3k5m66n848xk59v9tpg1` (`user_id`),
  CONSTRAINT `FKbk9ha3k5m66n848xk59v9tpg1` FOREIGN KEY (`user_id`) REFERENCES `user_table` (`id`),
  CONSTRAINT `FKe99na2k6pq7wd3gq91lswx70y` FOREIGN KEY (`diary_set_id`) REFERENCES `diary_set` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `feed_like` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `feed_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKgurobtyio3jh1vn4n8tmqt842` (`feed_id`),
  KEY `FK236lxkd3hxjinw2eltwa35wnt` (`user_id`),
  CONSTRAINT `FK236lxkd3hxjinw2eltwa35wnt` FOREIGN KEY (`user_id`) REFERENCES `user_table` (`id`),
  CONSTRAINT `FKgurobtyio3jh1vn4n8tmqt842` FOREIGN KEY (`feed_id`) REFERENCES `feed` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `schedule` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `content` varchar(255) DEFAULT NULL,
  `date` date NOT NULL,
  `is_completed` varchar(255) NOT NULL,
  `is_deleted` varchar(255) NOT NULL,
  `schedule_code` varchar(255) NOT NULL,
  `user_id` bigint NOT NULL,
  `user_plant_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKruqlgul0dhbr1uvpfkb6rjxya` (`user_id`),
  KEY `FKm20ak9xp1tsvdpi88lpd3cy6e` (`user_plant_id`),
  CONSTRAINT `FKm20ak9xp1tsvdpi88lpd3cy6e` FOREIGN KEY (`user_plant_id`) REFERENCES `user_plant` (`id`),
  CONSTRAINT `FKruqlgul0dhbr1uvpfkb6rjxya` FOREIGN KEY (`user_id`) REFERENCES `user_table` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
