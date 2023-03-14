import React, { useEffect } from 'react';
import AppLayout from '@/layout/AppLayout';
import { useForm } from 'react-hook-form';
import { updatePassword } from '@/core/user/userAPI';
import { checkInputFormToast } from '@/lib/utils';

type StateType = {
  password: string;
  checkPassword: string;
  passwordMessage: string;
};

const initialState: StateType = {
  password: '',
  checkPassword: '',
  passwordMessage: '',
};

export default function password() {
  const {
    register,
    formState: { errors },
    setValue,
    getValues,
    watch,
  } = useForm<StateType>({ defaultValues: initialState, mode: 'onChange' });

  const [password, checkPassword, passwordMessage] = getValues(['password', 'checkPassword', 'passwordMessage']);

  function handleCheckPassword(e) {
    if (password === e.target.value || checkPassword === e.target.value) return setValue('passwordMessage', '똑같음');
    else return setValue('passwordMessage', '다름');
  }

  async function handlePasswordUpdate() {
    if (errors.password || password == '' || checkPassword == '') {
      checkInputFormToast();
      return;
    }

    try {
      const { data } = await updatePassword({ newPassword: password });
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

        <button className='rounded bg-blue-500' onClick={handlePasswordUpdate}>
          비밀번호 수정
        </button>
      </div>
    </AppLayout>
  );
}
