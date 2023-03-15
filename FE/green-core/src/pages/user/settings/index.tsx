import React, { useEffect } from 'react';
import AppLayout from '@/layout/AppLayout';
import { useForm } from 'react-hook-form';
import { checkPassword } from '@/core/user/userAPI';
import { checkInputFormToast } from '@/lib/utils';

type StateType = {
  password: string;
};

const initialState: StateType = {
  password: '',
};

export default function index() {
  const {
    register,
    formState: { errors },
    getValues,
    watch,
  } = useForm<StateType>({ defaultValues: initialState, mode: 'onChange' });

  const [password] = getValues(['password']);

  async function handleCheckPassword() {
    if (errors.password || password == '') {
      checkInputFormToast();
      return;
    }

    try {
      const { data } = await checkPassword({ password });
      console.log(data);
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
      <div>
        <label>비밀번호 확인</label>
        <div>비밀번호 확인하고 닉네임, 비밀번호 수정 페이지로</div>
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
          })}
          placeholder='비밀번호'
        />

        <div>
          {errors?.password && errors?.password.type === 'required' && <span>{errors?.password?.message}</span>}
          {errors?.password && errors?.password.type === 'pattern' && <span>{errors?.password?.message}</span>}
        </div>

        <button className='bg-blue-500 rounded' onClick={handleCheckPassword}>
          비밀번호 확인
        </button>
      </div>
    </AppLayout>
  );
}
