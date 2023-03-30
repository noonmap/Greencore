package com.chicochico.domain.user.service;


import com.chicochico.common.code.IsDeletedType;
import com.chicochico.domain.user.entity.UserEntity;
import com.chicochico.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
@Log4j2
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

	private final UserRepository userRepository;


	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		log.info("[loadUserByUsername] username: {}", username);

		Optional<UserEntity> user = userRepository.findByIdAndIsDeleted(Long.parseLong(username), IsDeletedType.N);
		if (user.isEmpty()) {
			throw new UsernameNotFoundException(username);
		}
		return user.get();
	}


	public UserDetails loadUserByEmail(String email) throws UsernameNotFoundException {
		log.info("[loadUserByEmail] email: {}", email);

		Optional<UserEntity> user = userRepository.findByEmailAndIsDeleted(email, IsDeletedType.N);
		log.info("[loadUserByEmail] 유저 있나요?: {}", user.isEmpty());
		if (user.isEmpty()) {
			throw new UsernameNotFoundException(email);
		}
		return user.get();
	}

}
