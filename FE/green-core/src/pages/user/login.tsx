import React, { useEffect } from 'react';

import AppLayout from '@/layout/AppLayout';
import { logIn } from '@/core/user/userAPI';
import { useForm } from 'react-hook-form';
import { useAppDispatch } from '@/core/hooks';

type StateType = {
  email: string;
  password: string;
  files: Object;
};

const initialState: StateType = {
  email: '',
  password: '',
  files: null,
};

export default function login() {
  const dispatch = useAppDispatch();
  const {
    register,
    formState: { errors },
    setValue,
    getValues,
    watch,
  } = useForm<StateType>({ defaultValues: initialState });
  const [email, password, files] = getValues(['email', 'password', 'files']);

  async function handleLogIn() {
    const payload = { email, password };

    if (files != null) console.log(files[0]);

    console.log(payload);
    try {
      dispatch(logIn(payload));
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    watch();
    return () => {};
  }, []);

  return (
    <AppLayout>
      <h1>로그인</h1>

      <input type='file' accept='image/*' {...register('files')} />

      <div className='space-y-2'>
        <label>이메일</label>
        <input type='text' required className='block' {...register('email')} />
        <label>비밀번호</label>
        <input type='text' required className='block' {...register('password')} />
      </div>

      <div>
        req data:
        <div>
          {getValues('email')} {getValues('password')} {JSON.stringify(getValues('files'))}
        </div>
      </div>

      <button className='bg-blue-500 rounded' onClick={handleLogIn}>
        로그인
      </button>
    </AppLayout>
  );
}
