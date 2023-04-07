package com.chicochico.common.service;


import com.chicochico.exception.CustomException;
import com.chicochico.exception.ErrorCode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;


@Service
public class FileService {

	public static final String NGINX_PATH = "/resources/";
	private final String DEFAULT_IMAGE_NAME = "default.png";
	@Value("${file.dir}")
	private String fileDir;
	// GreenCore가 지원하는 이미지 확장자 종류
	private String[] imageExtensions = { ".jpg", ".jpeg", ".jfif", ".gif", ".png" };


	private Boolean isImageFile(String extension) {
		if (extension.isEmpty()) return false;
		// 소문자로 바꿔서 테스트
		String lowerExtension = extension.toLowerCase();
		for (String test : imageExtensions) {
			if (lowerExtension.equals(test)) return true;
		}
		return false;
	}


	/**
	 * 이미지 파일을 물리 서버에 저장
	 *
	 * @param file       저장할 이미지 파일
	 * @param subFileDir 서브 파일 저장 경로 (ex: 프로필 이미지 : profile, 게시글 이미지 : post)
	 * @return (file.dir 경로를 생략한) 파일 저장 경로
	 * @throws IOException
	 */
	public String storeImageFile(MultipartFile file, String subFileDir) {
		// 파일 저장 경로 디렉토리 확인, 없으면 생성
		File fileDirFile = new File(fileDir);
		if (!fileDirFile.exists()) {
			fileDirFile.mkdir();
		}
		File fileSubDirFile = new File(fileDir + '/' + subFileDir);
		if (!fileSubDirFile.exists()) {
			fileSubDirFile.mkdir();
		}

		// 파일이 비어있는지 확인
		if (file == null || file.isEmpty()) {
			return subFileDir + '/' + DEFAULT_IMAGE_NAME;
			//			throw new CustomException(ErrorCode.FILE_IS_EMPTY);
		}

		// 원래 파일 이름 추출
		String origName = file.getOriginalFilename();

		// 파일 이름으로 쓸 uuid 생성
		String uuid = UUID.randomUUID().toString();

		// 확장자 추출(ex : .png)
		String extension = origName.substring(origName.lastIndexOf("."));

		// 이미지 파일인지 확인 (확장자만 체크)
		if (isImageFile(extension) == false) throw new CustomException(ErrorCode.FILE_IS_NOT_IMAGE);

		// uuid와 확장자 결합
		String savedName = subFileDir + '/' + uuid + extension;

		// 파일을 불러올 때 사용할 파일 경로
		String savedPath = fileDir + '/' + savedName;

		try {
			// 실제로 로컬에 uuid를 파일명으로 저장
			file.transferTo(new File(savedPath));
		} catch (IOException e) {
			e.printStackTrace();
			throw new CustomException(ErrorCode.FILE_UPLOAD_FAIL);
		}

		return savedName;
	}


	public void deleteImageFile(String savedName) {
		String[] savedFileName = savedName.split("/");
		if (savedFileName[savedFileName.length - 1].equals(DEFAULT_IMAGE_NAME)) return; // 기본 이미지는 삭제하지 않음
		String savedPath = fileDir + '/' + savedName;
		File savedFile = new File(savedPath);
		if (savedFile.exists()) {
			savedFile.delete();
		}
	}

}
