import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { checkNickname, updateProfile } from '@/core/user/userAPI';
import { checkInputFormToast } from '@/lib/utils';
import { ProfileType } from '@/core/user/userType';
import AppButton from '../button/AppButton';
import { getStorage, ref, deleteObject, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/router';
import { SET_USER_INFO } from '@/core/common/commonSlice';

type PropsType = {
  isOpen: boolean;
  userProfile: ProfileType;
  handleModalClose: () => void;
};

type StateType = {
  nickname: string;
  introduction: string;
};

const initialState: StateType = {
  nickname: '',
  introduction: '',
};

export default function AppModal({ isOpen, userProfile, handleModalClose }: PropsType) {
  const router = useRouter();
  const storage = getStorage();
  const modalRef = useRef<HTMLDivElement>(null);

  const {
    register,
    formState: { errors },
    setValue,
    getValues,
    watch,
  } = useForm<StateType>({ defaultValues: initialState, mode: 'onChange' });

  const [prevNickname, setPrevNickname] = useState('');
  const [prevProfileImagePath, setProfileImagePath] = useState('');
  const [nickname, introduction] = getValues(['nickname', 'introduction']);
  const [isCheckedNickname, setIsCheckedNickname] = useState<boolean>(false);

  useEffect(() => {
    watch();
    document.addEventListener('mousedown', handleModalOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleModalOutsideClick);
    };
  }, []);

  useEffect(() => {
    setUserProfile();
  }, [userProfile]);

  /** 모달 바깥을 클릭 시 모달을 닫는 함수 */
  function handleModalOutsideClick(e) {
    if (modalRef.current && !modalRef.current.contains(e.target)) handleModalClose();
  }

  /** 사용자 정보 세팅하는 함수 (nickname, introduction) */
  function setUserProfile() {
    try {
      setPrevNickname(userProfile?.nickname);
      setValue('nickname', userProfile?.nickname);
      setValue('introduction', userProfile?.introduction);
    } catch (error) {
      console.error(error);
    }
  }

  /** 닉네임 중복 확인 함수 */
  async function handleCheckNickname() {
    if (errors?.nickname || nickname == '') {
      checkInputFormToast();
      return;
    }

    try {
      const { data } = await checkNickname(nickname);
      setIsCheckedNickname(data);
    } catch (error) {
      setValue('nickname', '');
      console.error(error);
    }
  }

  /** 사용자 프로필 정보 수정 함수 */
  async function handleUserProfileUpdate() {
    if (errors.nickname || nickname == '' || !isCheckedNickname) {
      checkInputFormToast();
      return;
    }

    try {
      const payload = { nickname, introduction };
      const { data } = await updateProfile(payload);

      if (data) {
        handleSetUserProfileImage();
        SET_USER_INFO({ nickname });
        router.push(`${nickname}`);
      }

      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }

  /** 이미지 파일 등록하는 함수 */
  async function handleSetUserProfileImage() {
    const prevProfileRef = ref(storage, `${prevNickname}/profileImage`);
    const newProfileRef = ref(storage, `${nickname}/profileImage`);

    // 1. 이전 프로필 이미지 다운
    getDownloadURL(prevProfileRef).then((url) => {
      setProfileImagePath(url);
    });

    // 2. 이전 프로필 삭제
    deleteObject(ref(storage, `${prevNickname}/profileImage`)).then(() => {});

    // 3. 새로운 프로필 이미지 등록
    // const res = await fetch(prevProfileImagePath);
    const res = await fetch('/images/noProfile.png');
    const blob = await res.blob();
    const file = new File([blob], 'noProfile', { type: 'image/png' });
    uploadBytes(newProfileRef, file, { contentType: 'image/png' }).then(() => {});
  }

  return (
    <div>
      {isOpen ? (
        <div className='modalContainer'>
          <div className='modalWrap' ref={modalRef}>
            {/* 모달 내부 */}
            <div className='relative'>
              <span className='modalClose material-symbols-outlined' onClick={() => handleModalClose()}>
                close
              </span>
            </div>

            {/* 모달 컨텐츠 */}
            <div className='modalContent flex justify-between'>
              <div className='modalTitle mb-5'>프로필 수정</div>

              <div className='flex flex-col space-y-5 mb-20'>
                <div className='space-y-5'>
                  {/* 닉네임 라인 */}
                  <div>
                    <label className='label'>닉네임</label>
                    <div className='flex flex-col space-y-2'>
                      <div className='flex space-x-2'>
                        <input
                          type='text'
                          required
                          className={`${errors?.nickname ? 'inputError' : null} block w-full`}
                          {...register('nickname', {
                            required: '필수 항목입니다',
                            pattern: {
                              value: /^(?=.*[a-z0-9가-힣])[a-z0-9가-힣]{2,16}$/,
                              message: '2자 이상 16자 이하, 영어 또는 숫자 또는 한글로 구성',
                            },
                          })}
                          placeholder='닉네임'
                        />

                        <AppButton text='닉네임 중복 확인' handleClick={handleCheckNickname} />
                      </div>

                      <div className={`error`}>
                        {errors?.nickname && errors?.nickname.type === 'required' && <span>{errors?.nickname?.message}</span>}
                        {errors?.nickname && errors?.nickname.type === 'pattern' && <span>{errors?.nickname?.message}</span>}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className='label'>한 줄 자기소개</label>
                    <div className='flex'>
                      <input type='text' className='block w-full' {...register('introduction')} placeholder='한 줄로 자신을 표현해보세요!' />
                    </div>
                  </div>
                </div>
              </div>

              <AppButton text='프로필 수정' handleClick={handleUserProfileUpdate} />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

AppModal.defaultProps = {
  isOpen: true,
};
