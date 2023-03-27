import React, { useEffect, useRef, useState } from 'react';
import AppLayout from '@/layout/AppLayout';
import { useForm } from 'react-hook-form';
import { signUp, checkEmail, checkNickname, checkAuthCode } from '~/src/core/user/userAPI';
import { checkInputFormToast } from '@/lib/utils';
import { getStorage, ref, uploadBytes, uploadString } from 'firebase/storage';

import styles from '@/styles/Auth.module.scss';
import Image from 'next/image';
import AppButton from '@/components/button/AppButton';
import { EssentialMessage, EmailMessage, PasswordMessage, NicknameMessage } from '@/assets/message.json';

type StateType = {
  email: string;
  isCheckedEmail: boolean;
  password: string;
  checkPassword: string;
  passwordMessage: string;
  authCode: string;
  isCheckedAuthCode: boolean;
  nickname: string;
  isCheckedNickname: boolean;
};

const initialState: StateType = {
  email: '',
  isCheckedEmail: false,
  password: '',
  checkPassword: '',
  passwordMessage: '',
  authCode: '',
  isCheckedAuthCode: false,
  nickname: '',
  isCheckedNickname: false,
};

export default function signup() {
  const storage = getStorage();

  const {
    register,
    formState: { errors },
    setValue,
    getValues,
    watch,
  } = useForm<StateType>({ defaultValues: initialState, mode: 'onChange' });
  const [email, isCheckedEmail, password, checkPassword, passwordMessage, authCode, isCheckedAuthCode, nickname, isCheckedNickname] = getValues([
    'email',
    'isCheckedEmail',
    'password',
    'checkPassword',
    'passwordMessage',
    'authCode',
    'isCheckedAuthCode',
    'nickname',
    'isCheckedNickname',
  ]);

  const [isPossibleSignUp, setIsPossibleSignUp] = useState<boolean>(false);

  useEffect(() => {
    watch();
    return () => {};
  }, []);

  useEffect(() => {
    checkIsPossibleSignUp();
  }, [email, isCheckedAuthCode, isCheckedNickname, password, checkPassword, nickname, isPossibleSignUp]);

  /** 회원가입 가능한지 확인하는 함수 */
  function checkIsPossibleSignUp() {
    let flag = true;

    if (errors?.email || email == '') flag = false;
    else if (!isCheckedAuthCode) flag = false;
    else if (!isCheckedNickname) flag = false;
    else if (errors?.password || password == '') flag = false;
    else if (errors?.checkPassword || checkPassword == '') flag = false;
    else if (errors?.nickname || nickname == '') flag = false;

    if (flag) setIsPossibleSignUp(true);
    else setIsPossibleSignUp(false);
  }

  /** 회원가입 함수 */
  async function handleSignUp() {
    try {
      // 배포 테스트 중 임시로 주석
      if (isPossibleSignUp) {
        const payload = { email, password, nickname };
        const { data } = await signUp(payload);

        if (data.result) handleSetUserProfile();

        // 배포 테스트 중 임시로 주석
      } else checkInputFormToast();
    } catch (err) {
      console.error(err);
    }
  }

  /** 올바른 이메일인지 확인하는 함수 */
  async function handleCheckEmail() {
    if (errors?.email || email == '') {
      checkInputFormToast();
      return;
    }

    try {
      const payload = { email };
      const { data } = await checkEmail(payload);

      if (data) setValue('isCheckedEmail', true);
      else setValue('isCheckedEmail', false);
    } catch (error) {
      setValue('email', '');
      console.error(error);
    }
  }

  /** 비밀번호랑 비밀번호 확인이랑 같은지 확인하는 함수 */
  function handleCheckPassword(e) {
    if (password === e.target.value || checkPassword === e.target.value) return setValue('passwordMessage', '');
    else return setValue('passwordMessage', '비밀번호가 다릅니다');
  }

  /** 닉네임 중복 확인하는 함수 */
  async function handleCheckNickname() {
    if (errors?.nickname || nickname == '') {
      checkInputFormToast();
      return;
    }

    try {
      const { data } = await checkNickname(nickname);
      setValue('isCheckedNickname', data);
    } catch (error) {
      setValue('nickname', '');
      console.error(error);
    }
  }

  /** 인증코드 확인하는 함수 */
  async function handleCheckAuthCode() {
    if (authCode == '') {
      checkInputFormToast();
      return;
    }

    try {
      const payload = { authCode };
      const { data } = await checkAuthCode(payload);
      // setValue('isCheckedAuthCode', data);
      setValue('isCheckedAuthCode', true);
    } catch (error) {
      console.error(error);
    }
  }

  /** 회원가입하면 firebase storage 에 프로필 이미지 초기 등록하도록 하는 함수 */
  async function handleSetUserProfile() {
    const res = await fetch('/images/noProfile.png');
    const blob = await res.blob();
    const file = new File([blob], 'noProfile', { type: 'image/png' });

    const profileRef = ref(storage, `${nickname}/profileImage`);

    uploadBytes(profileRef, file, { contentType: 'image/png' }).then(() => {});
  }

  return (
    <AppLayout>
      <div className={`${styles.container} h-full`}>
        <Image src='/images/leaf1.png' width={512} height={512} alt='' className={`${styles.leaf1} `} />
        <Image src='/images/leaf2.png' width={512} height={512} alt='' className={`${styles.leaf2}`} />
        <Image src='/images/leaf3.png' width={512} height={512} alt='' className={`${styles.leaf3}`} />

        <div className={`${styles.wrap} ${styles.signup} flex flex-col justify-between`}>
          <div>
            <div className={`${styles.content}`}>
              <div className={`${styles.title}`}>SIGNUP</div>

              {/* 이메일 */}
              <div className={`${styles.content} space-y-2 mb-10`}>
                <label className={`${styles.email}`}>이메일</label>
                <div className='flex space-x-2'>
                  <input
                    type='email'
                    placeholder='ssafy@ssafy.com'
                    className={`${errors?.email ? 'inputError' : null} block w-full`}
                    {...register('email', {
                      required: EssentialMessage,
                      pattern: { value: /^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/, message: EmailMessage },
                    })}
                  />
                  <AppButton text='이메일 확인' className='w-1' handleClick={handleCheckEmail} />
                </div>

                <div className={`${styles.error}`}>
                  {errors?.email && errors?.email.type === 'required' && <span>{errors?.email?.message}</span>}
                  {errors?.email && errors?.email.type === 'pattern' && <span>{errors?.email?.message}</span>}
                </div>

                {/* 이메일 인증 */}
                {isCheckedEmail ? (
                  <div className={`${styles.content} space-y-2 mb-10`}>
                    <label className={`${styles.email}`}>이메일 인증 코드</label>
                    <div className='flex space-x-2'>
                      <input type='email' placeholder='인증 코드' className='block w-full' {...register('authCode')} />
                      <AppButton text='인증코드 확인' className='w-1' handleClick={handleCheckAuthCode} />
                    </div>
                  </div>
                ) : null}
              </div>

              {/* 비밀번호 */}
              <div className={`${styles.content} space-y-2 mb-10`}>
                <div className='flex items-center space-x-2'>
                  <label className={`${styles.password}`}>비밀번호</label>
                  <div className={`${styles.help}`}>영어 소문자, 숫자, 특수문자 포함 최소 8자</div>
                </div>

                <div className='flex space-x-2'>
                  <input
                    type='password'
                    placeholder='비밀번호'
                    className={`${errors?.password ? 'inputError' : null} block w-full`}
                    {...register('password', {
                      required: EssentialMessage,
                      pattern: {
                        value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/,
                        message: PasswordMessage,
                      },
                      onChange: (e) => handleCheckPassword(e),
                    })}
                  />
                </div>
                {/* 비밀번호 확인 */}
                <div className='flex space-x-2'>
                  <input
                    type='password'
                    placeholder='비밀번호 확인'
                    className={`${errors?.checkPassword ? 'inputError' : null} block w-full`}
                    {...register('checkPassword', {
                      required: EssentialMessage,
                      pattern: {
                        value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/,
                        message: PasswordMessage,
                      },
                      onChange: (e) => handleCheckPassword(e),
                    })}
                  />
                </div>

                <div className={`${styles.error}`}>
                  {/* {errors?.password && errors?.password.type === 'required' && <span>{errors?.password?.message}</span>} */}
                  {errors?.password && errors?.password.type === 'pattern' ? <span>{errors?.password?.message}</span> : passwordMessage}
                </div>
              </div>

              {/* 닉네임 */}
              <div className={`${styles.content} space-y-2 mb-10`}>
                <label className={`${styles.nickname}`}>닉네임</label>
                <div className='flex space-x-2'>
                  <input
                    type='text'
                    placeholder='닉네임'
                    className={`${errors?.nickname ? 'inputError' : null} block w-full`}
                    {...register('nickname', {
                      required: EssentialMessage,
                      pattern: { value: /^(?=.*[a-z0-9가-힣])[a-z0-9가-힣]{2,16}$/, message: NicknameMessage },
                    })}
                  />
                  <AppButton text='닉네임 중복 확인' className='w-1' handleClick={handleCheckNickname} />
                </div>

                <div className={`${styles.error}`}>
                  {errors?.nickname && errors?.nickname.type === 'required' && <span>{errors?.nickname?.message}</span>}
                  {errors?.nickname && errors?.nickname.type === 'pattern' && <span>{errors?.nickname?.message}</span>}
                </div>
              </div>
            </div>
          </div>

          {/* 간편 로그인 */}
          <div className={`flex flex-col gap-2 items-center justify-center mb-10`}>
            <div className={`${styles.help} ${styles.line} `}>간편 회원가입</div>
            <div className={`${styles.oauth} flex space-x-5 items-center justify-center`}>
              <div className='flex items-center justify-center'>
                <Image src='/images/kakao.png' alt='hi' width={24} height={24} />
              </div>
              <div className='flex items-center justify-center'>
                <i className='fa-brands fa-google text-2xl'></i>
              </div>
              <div className='flex items-center justify-center'>
                <i className='fa-brands fa-github text-2xl'></i>
              </div>
            </div>
          </div>

          <AppButton text='회원가입' bgColor={isPossibleSignUp ? 'main' : 'thin'} handleClick={handleSignUp} />
        </div>
      </div>
    </AppLayout>
  );
}
