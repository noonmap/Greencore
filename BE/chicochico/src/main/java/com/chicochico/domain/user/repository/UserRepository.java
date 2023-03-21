package com.chicochico.domain.user.repository;


import com.chicochico.common.code.IsDeletedType;
import com.chicochico.domain.user.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface UserRepository extends JpaRepository<UserEntity, Long> {

	Optional<UserEntity> findByEmail(String email);
	Optional<UserEntity> findByNickname(String nickname);
	Optional<UserEntity> findByNicknameAndIsDeleted(String nickname, IsDeletedType isDeletedType);
	Optional<UserEntity> findByIdAndIsDeleted(Long id, IsDeletedType isDeletedType);

	Optional<UserEntity> findByNicknameAndIsDeletedEquals(String nickname, IsDeletedType isDeletedType);

}
