import React, { useEffect } from 'react';
import AppLayout from '@/layout/AppLayout';
import { useForm } from 'react-hook-form';
import { signUp, checkEmail } from '~/src/core/user/userAPI';

type StateType = {
  email: string;
  password: string;
  checkPassword: string;
  passwordMessage: string;
  authCode: string;
  nickname: string;
};

const initialState: StateType = {
  email: '',
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

  useEffect(() => {
    watch();
    return () => {};
  }, []);

  async function handleSignUp(e: React.SyntheticEvent<EventTarget>) {
    e.preventDefault();
    try {
      const email = getValues('email');
      const password = getValues('password');
      const nickname = getValues('nickname');

      const payload = { email, password, nickname };
      const { data } = await signUp(payload);

      console.log(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleCheckEmail() {
    try {
      const email = getValues('email');

      const payload = { email };
      const { data } = await checkEmail(payload);
      console.log('hi:', errors['email'].message);

      setValue('email', '');
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }

  function handleCheckPassword(e) {
    const password = getValues('password');
    if (password === e.target.value) return setValue('passwordMessage', '똑같음');
    else return setValue('passwordMessage', '다름');
  }

  function handleCheckNickname() {
    console.log('handleCheckNickname');
  }

  function handleCheckAuthCode() {
    console.log('handleCheckNickname');
  }

  return (
    <AppLayout>
      <h1>회원가입</h1>

      <div className='space-y-2'>
        <div>
          <label>이메일</label>

          <form className='flex'>
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
          </form>
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
