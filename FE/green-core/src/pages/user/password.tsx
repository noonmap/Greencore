import React, { useEffect } from 'react';
import AppLayout from '@/layout/AppLayout';
import { useForm } from 'react-hook-form';
import { findPassword } from '@/core/user/userAPI';
import { checkInputFormToast } from '@/lib/utils';

type StateType = {
  email: string;
};

const initialState: StateType = {
  email: '',
};

export default function password() {
  const {
    register,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: initialState, mode: 'onChange' });

  const [email] = getValues(['email']);

  async function handleFindPassword() {
    if (errors?.email || email == '') {
      checkInputFormToast();
      return;
    }

    try {
      const payload = { email };
      const { data } = await findPassword(payload);
      console.log(data);
    } catch (error) {
      console.error(error);
    }

    setValue('email', '');
  }

  useEffect(() => {
    watch();
    return () => {};
  }, []);

  return (
    <AppLayout>
      <h2>비밀번호 찾기</h2>

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
          <button className='bg-blue-500 rounded' onClick={handleFindPassword}>
            비밀번호 전송
          </button>

          <div>
            {errors?.email && errors?.email.type === 'required' && <span>{errors?.email?.message}</span>}
            {errors?.email && errors?.email.type === 'pattern' && <span>{errors?.email?.message}</span>}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
