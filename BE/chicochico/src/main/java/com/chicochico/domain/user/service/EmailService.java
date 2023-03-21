package com.chicochico.domain.user.service;


import com.chicochico.common.service.RedisService;
import com.chicochico.domain.user.dto.request.AuthCodeRequestDto;
import com.chicochico.domain.user.dto.request.EmailRequestDto;
import com.chicochico.domain.user.entity.UserEntity;
import com.chicochico.domain.user.repository.UserRepository;
import com.chicochico.exception.CustomException;
import com.chicochico.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.io.UnsupportedEncodingException;
import java.util.Random;


@Log4j2
@Service
@RequiredArgsConstructor
public class EmailService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final JavaMailSender emailSender;// Bean 등록해둔 MailConfig 를 emailsender 라는 이름으로 autowired

	private final RedisService redisService;
	private final String MESSAGE_EMAIL = "email";
	private final String MESSAGE_PASSWORD = "password";
	private String ePw; // 인증번호
	@Value("${spring.mail.username}")
	private String id;


	/**
	 * 인증 이메일을 발송합니다
	 *
	 * @param emailRequestDto 이메일(email)
	 */
	public void sendVerificationEmail(EmailRequestDto emailRequestDto) {
		log.info("[sendVerificationEmail] {}", emailRequestDto.getEmail());
		// 인증 이메일 보내기
		String code = sendSimpleMessage(emailRequestDto, MESSAGE_EMAIL);

		// 유효시간 30분으로 Redis에 저장 (key, value, duration)
		redisService.setDataExpire(code, emailRequestDto.getEmail(), 60 * 30L);

	}


	/**
	 * 이메일 인증을 확인합니다
	 *
	 * @param authCodeRequestDto 인증코드(authCode)
	 */
	public Boolean confirmEmail(AuthCodeRequestDto authCodeRequestDto) {
		String memberEmail = redisService.getData(authCodeRequestDto.getAuthCode());
		if (memberEmail == null) {
			return Boolean.FALSE;
		}

		redisService.deleteData(authCodeRequestDto.getAuthCode());
		return Boolean.TRUE;
	}


	/**
	 * 임시 비밀번호를 전송합니다
	 *
	 * @param emailRequestDto 이메일(email)
	 */
	public void sendTemporaryPassword(EmailRequestDto emailRequestDto) {

		// email이 존재하는 지 확인
		UserEntity user = userRepository.findByEmail(emailRequestDto.getEmail()).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

		// 임시 비밀번호를 포함한 메일 발송
		String temporaryPassword = sendSimpleMessage(emailRequestDto, MESSAGE_PASSWORD);

		// 임시 비밀번호로 변경
		user.setPassword(passwordEncoder.encode(temporaryPassword));

		// 저장
		userRepository.save(user);
	}


	public MimeMessage createMessage(String to, String type) throws MessagingException, UnsupportedEncodingException {
		log.info("[createMessage] {}", to);
		MimeMessage message = emailSender.createMimeMessage();
		log.info("[createMessage] emailSender: {}", to);

		message.addRecipients(MimeMessage.RecipientType.TO, to);// 보내는 대상
		message.setSubject("GreenCore 회원가입 이메일 인증");// 제목

		log.info("[createMessage] emailSender: {}", id);
		String msgg = "";
		msgg += "<div style='margin:100px;'>";
		msgg += "<h1> 안녕하세요</h1>";
		msgg += "<h1> 반려식물 SNS플랫폼 GreenCore 입니다</h1>";
		msgg += "<br>";
		if (type.equals(MESSAGE_EMAIL)) {
			msgg += "<p>아래 코드를 회원가입 창으로 돌아가 입력해주세요<p>";
			msgg += "<br>";
			msgg += "<p>행복한 하루되세요 감사합니다!<p>";
			msgg += "<br>";
			msgg += "<div align='center' style='border:1px solid black; font-family:verdana';>";
			msgg += "<h3 style='color:blue;'>회원가입 인증 코드입니다.</h3>";
			msgg += "<div style='font-size:130%'>";
			msgg += "CODE : <strong>";
		} else if (type.equals(MESSAGE_PASSWORD)) {
			msgg += "<p>아래 임시비밀번호를 로그인 창으로 돌아가 입력해주세요.<p>";
			msgg += "<br>";
			msgg += "<p>행복한 하루되세요 감사합니다!<p>";
			msgg += "<br>";
			msgg += "<div align='center' style='border:1px solid black; font-family:verdana';>";
			msgg += "<h3 style='color:blue;'>임시 발급된 비밀번호입니다. 로그인 후 비밀번호를 변경해주세요.</h3>";
			msgg += "<div style='font-size:130%'>";
			msgg += "임시 비밀번호 : <strong>";
		}

		msgg += ePw + "</strong><div><br/> "; // 메일에 인증번호 넣기
		msgg += "</div>";

		message.setText(msgg, "utf-8", "html");// 내용, charset 타입, subtype
		// 보내는 사람의 이메일 주소, 보내는 사람 이름
		message.setFrom(new InternetAddress(id, "GreenCore"));// 보내는 사람

		return message;
	}


	private String createKey() {
		StringBuffer key = new StringBuffer();
		Random rnd = new Random();

		for (int i = 0; i < 8; i++) { // 인증코드 8자리
			int index = rnd.nextInt(3); // 0~2 까지 랜덤, rnd 값에 따라서 아래 switch 문이 실행됨

			switch (index) {
			case 0:
				key.append((char) ((int) (rnd.nextInt(26)) + 97));
				// a~z (ex. 1+97=98 => (char)98 = 'b')
				break;
			case 1:
				key.append((char) ((int) (rnd.nextInt(26)) + 65));
				// A~Z
				break;
			case 2:
				key.append((rnd.nextInt(10)));
				// 0~9
				break;
			}
		}

		return key.toString();
	}


	// 메일 발송
	// sendSimpleMessage 의 매개변수로 들어온 emailRequestDto 에서 보낼 이메일 주소를 얻고,
	// MimeMessage 객체 안에 내가 전송할 메일의 내용을 담는다.
	// 그리고 bean 으로 등록해둔 javaMail 객체를 사용해서 이메일 send
	private String sendSimpleMessage(EmailRequestDto emailRequestDto, String type) {
		log.info("[sendSimpleMessage] {}", emailRequestDto.getEmail());
		ePw = createKey(); // 랜덤 인증번호 생성
		log.info("[sendSimpleMessage] createKey: {}", emailRequestDto.getEmail());
		MimeMessage message = null; // 메일 발송
		try {
			message = createMessage(emailRequestDto.getEmail(), type);
			emailSender.send(message);
		} catch (MessagingException | UnsupportedEncodingException e) {
			throw new CustomException(ErrorCode.EMAIL_SEND_FAIL);
		}

		return ePw; // 메일로 보냈던 인증 코드를 서버로 반환
	}

}
