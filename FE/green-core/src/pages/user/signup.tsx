import React, { useEffect, useRef } from 'react';
import AppLayout from '@/layout/AppLayout';
import { useForm } from 'react-hook-form';
import { signUp, checkEmail, checkNickname, checkAuthCode } from '~/src/core/user/userAPI';

import Toastify from 'toastify-js';
import message from '@/assets/message.json';
import toastifyCSS from '@/assets/toastify.json';

type StateType = {
  email: string;
  password: string;
  checkPassword: string;
  passwordMessage: string;
  authCode: string;
  nickname: string;
};

const initialState: StateType = {
  email: '1',
  password: '',
  checkPassword: '',
  passwordMessage: '',
  authCode: '',
  nickname: '',
};

export default function signup() {
  const {
    register,
    formState: { errors },
    setValue,
    getValues,
    watch,
  } = useForm<StateType>({ defaultValues: initialState, mode: 'onBlur' });

  const [email, password, checkPassword, passwordMessage, authCode, nickname] = getValues([
    'email',
    'password',
    'checkPassword',
    'passwordMessage',
    'authCode',
    'nickname',
  ]);

  const inputRef = useRef(null);

  useEffect(() => {
    watch();
    console.log(errors);
    console.log(inputRef);
    if (errors?.email) console.log(errors);
    return () => {};
  }, []);

  function checkVaildSignUp(): boolean {
    let flag = true;

    if (errors?.email || email == '') {
      // if (register?.ref?.email.current !== null) ref.current.focus();
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
    e.preventDefault();
    try {
      if (checkVaildSignUp()) {
        const payload = { email, password, nickname };
        const { data } = await signUp(payload);
        console.log(data);
      } else {
        Toastify({
          text: message.CheckInputForm,
          duration: 1500,
          position: 'center',
          stopOnFocus: true,
          style: toastifyCSS.fail,
        }).showToast();
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleCheckEmail() {
    try {
      const payload = { email };
      const { data } = await checkEmail(payload);
      console.log(errors);
      console.log(data);
    } catch (error) {
      setValue('email', '');
      console.error(error);
    }
  }

  function handleCheckPassword(e) {
    if (password === e.target.value) return setValue('passwordMessage', '똑같음');
    else return setValue('passwordMessage', '다름');
  }

  async function handleCheckNickname() {
    try {
      const { data } = await checkNickname(nickname);
      console.log(data);
    } catch (error) {
      setValue('nickname', '');
      console.error(error);
    }
  }

  async function handleCheckAuthCode() {
    try {
      const payload = { authCode };
      const { data } = await checkAuthCode(payload);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
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
              ref={(e) => {
                inputRef.current = e;
              }}
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
          <input type='text' required className='block' {...register('password')} placeholder='비밀번호' />
          <label>비밀번호 확인</label>
          <input
            type='text'
            required
            className='block'
            {...register('checkPassword', { onBlur: (e) => handleCheckPassword(e) })}
            placeholder='비밀번호 확인'
          />

          <div>
            {errors?.email && errors?.email.type === 'required' && <span>{errors?.email?.message}</span>}
            {errors?.email && errors?.email.type === 'pattern' && <span>{errors?.email?.message}</span>}
            {getValues('passwordMessage')}
          </div>
        </div>

        <div>
          <label>닉네임</label>
          <div className='flex'>
            <input type='text' required className='block' {...register('nickname')} placeholder='닉네임' />
            <button className='bg-blue-500 rounded' onClick={handleCheckNickname}>
              닉네임 중복 확인
            </button>
          </div>
        </div>
      </div>

      <div>
        req data:
        <div>
          {getValues('email')} {getValues('password')} {getValues('checkPassword')} {getValues('nickname')}
        </div>
      </div>

      <button className='bg-blue-500 rounded' onClick={handleSignUp}>
        회원가입
      </button>
    </AppLayout>
  );
}
