package com.chicochico.domain.feed.repository;


import com.chicochico.domain.feed.entity.BookmarkEntity;
import com.chicochico.domain.feed.entity.DiarySetEntity;
import com.chicochico.domain.user.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


public interface BookmarkRepository extends JpaRepository<BookmarkEntity, Long> {

	void deleteByDiarySet(DiarySetEntity diarySet);
	List<BookmarkEntity> findByDiarySet(DiarySetEntity diarySet);
	List<BookmarkEntity> findByUser(UserEntity user);
	Optional<BookmarkEntity> findByDiarySetAndUser(DiarySetEntity diarySet, UserEntity user);

}
