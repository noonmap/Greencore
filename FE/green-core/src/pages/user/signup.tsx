import React, { useEffect, useRef } from 'react';
import AppLayout from '@/layout/AppLayout';
import { useForm } from 'react-hook-form';
import { signUp, checkEmail, checkNickname, checkAuthCode } from '~/src/core/user/userAPI';
import { checkInputFormToast } from '@/lib/utils';
import { getStorage, ref, uploadBytes, uploadString } from 'firebase/storage';
import { readFile } from 'fs';

type StateType = {
  email: string;
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

  const [email, password, checkPassword, passwordMessage, authCode, isCheckedAuthCode, nickname, isCheckedNickname] = getValues([
    'email',
    'password',
    'checkPassword',
    'passwordMessage',
    'authCode',
    'isCheckedAuthCode',
    'nickname',
    'isCheckedNickname',
  ]);

  // const inputRef = useRef(null);

  useEffect(() => {
    watch();
    // console.log(errors);
    // console.log(inputRef);
    // if (errors?.email) console.log(errors);
    return () => {};
  }, []);

  function checkVaildSignUp(): boolean {
    let flag = true;

    if (errors?.email || email == '') {
      // if (register?.ref?.email.current !== null) ref.current.focus();
      return false;
    } else if (!isCheckedAuthCode) {
      return false;
    } else if (!isCheckedNickname) {
      return false;
    } else if (errors?.password || password == '') {
      return false;
    } else if (errors?.checkPassword || checkPassword == '') {
      return false;
    } else if (errors?.nickname || nickname == '') {
      return false;
    }

    return flag;
  }

  async function handleSignUp(e: React.SyntheticEvent<EventTarget>) {
    try {
      if (checkVaildSignUp()) {
        const payload = { email, password, nickname };
        const { data } = await signUp(payload);

        if (data) handleSetUserProfile();

        console.log(data);
      } else checkInputFormToast();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleCheckEmail() {
    if (errors?.email || email == '') {
      checkInputFormToast();
      return;
    }

    try {
      const payload = { email };
      const { data } = await checkEmail(payload);
      console.log(data);
    } catch (error) {
      setValue('email', '');
      console.error(error);
    }
  }

  function handleCheckPassword(e) {
    if (password === e.target.value || checkPassword === e.target.value) return setValue('passwordMessage', '똑같음');
    else return setValue('passwordMessage', '다름');
  }

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

  async function handleCheckAuthCode() {
    if (authCode == '') {
      checkInputFormToast();
      return;
    }

    try {
      const payload = { authCode };
      const { data } = await checkAuthCode(payload);
      setValue('isCheckedAuthCode', data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleSetUserProfile() {
    const res = await fetch('/images/noProfile.png');
    const blob = await res.blob();
    const file = new File([blob], 'noProfile', { type: 'image/png' });

    const profileRef = ref(storage, `${nickname}/profileImage`);

    uploadBytes(profileRef, file, { contentType: 'image/png' }).then(() => {});
  }

  return (
    <AppLayout>
      <h1>회원가입</h1>

      <div className='space-y-2'>
        <div>
          <label>이메일</label>

          <div className='flex'>
            <input
              type='text'
              className='block'
              {...register('email', {
                required: '필수 항목입니다',
                pattern: { value: /^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/, message: '가능한 문자 입력하삼' },
              })}
              placeholder='이메일'
            />
            <button className='bg-blue-500 rounded' onClick={handleCheckEmail}>
              이메일 확인
            </button>

            <div>
              {errors?.email && errors?.email.type === 'required' && <span>{errors?.email?.message}</span>}
              {errors?.email && errors?.email.type === 'pattern' && <span>{errors?.email?.message}</span>}
            </div>
          </div>
        </div>

        <div>
          <label>이메일 인증 코드</label>
          <div className='flex'>
            <input type='text' required className='block' {...register('authCode')} placeholder='인증코드' />
            <button className='bg-blue-500 rounded' onClick={handleCheckAuthCode}>
              인증코드 확인
            </button>
          </div>
        </div>

        <div>
          <label>비밀번호</label>
          <input
            type='text'
            required
            className='block'
            {...register('password', {
              required: '필수 항목입니다',
              pattern: {
                value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/,
                message: '최소 8 자, 최소 하나의 문자, 하나의 숫자 및 하나의 특수 문자',
              },
              onChange: (e) => handleCheckPassword(e),
            })}
            placeholder='비밀번호'
          />
          <label>비밀번호 확인</label>
          <input
            type='text'
            required
            className='block'
            {...register('checkPassword', {
              required: '필수 항목입니다',
              pattern: {
                value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/,
                message: '최소 8 자, 최소 하나의 문자, 하나의 숫자 및 하나의 특수 문자',
              },
              onChange: (e) => handleCheckPassword(e),
            })}
            placeholder='비밀번호 확인'
          />

          <div>
            {errors?.password && errors?.password.type === 'required' && <span>{errors?.password?.message}</span>}
            {errors?.password && errors?.password.type === 'pattern' && <span>{errors?.password?.message}</span>}
            {passwordMessage}
          </div>
        </div>

        <div>
          <label>닉네임</label>
          <div className='flex'>
            <input
              type='text'
              required
              className='block'
              {...register('nickname', {
                required: '필수 항목입니다',
                pattern: { value: /^(?=.*[a-z0-9가-힣])[a-z0-9가-힣]{2,16}$/, message: '2자 이상 16자 이하, 영어 또는 숫자 또는 한글로 구성' },
              })}
              placeholder='닉네임'
            />
            <button className='bg-blue-500 rounded' onClick={handleCheckNickname}>
              닉네임 중복 확인
            </button>

            <div>
              {errors?.nickname && errors?.nickname.type === 'required' && <span>{errors?.nickname?.message}</span>}
              {errors?.nickname && errors?.nickname.type === 'pattern' && <span>{errors?.nickname?.message}</span>}
            </div>
          </div>
        </div>
      </div>

      <div>
        req data:
        <div>
          {email} {password} {JSON.stringify(isCheckedAuthCode)}
          <div></div>
          {getValues('email')} {getValues('password')} {getValues('checkPassword')} {getValues('nickname')}
        </div>
      </div>

      <button className='bg-blue-500 rounded' onClick={handleSignUp}>
        회원가입
      </button>
    </AppLayout>
  );
}
