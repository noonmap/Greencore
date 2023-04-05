import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { checkPassword } from '@/core/user/userAPI';
import { checkInputFormToast } from '@/lib/utils';
import { useAppDispatch } from '@/core/hooks';

import styles from '@/styles/Settings.module.scss';
import AppButton from '@/components/button/AppButton';
import message from '@/assets/message.json';

import { SET_IS_SEARCH_STATE } from '@/core/common/commonSlice';
import { SET_IS_POSSIBLE_UPDATE_USER_FALSE, SET_IS_POSSIBLE_UPDATE_USER_TRUE } from '@/core/user/userSlice';

type StateType = {
  password: string;
  isPossible: boolean;
};

const initialState: StateType = {
  password: '',
  isPossible: true,
};

export default function UserSettingsConfirm() {
  const dispatch = useAppDispatch();

  const {
    register,
    setValue,
    formState: { errors },
    getValues,
    watch,
  } = useForm<StateType>({ defaultValues: initialState, mode: 'onChange' });
  const [password, isPossible] = getValues(['password', 'isPossible']);

  useEffect(() => {
    watch();
  }, []);

  // searchState 변경
  useEffect(() => {
    dispatch(SET_IS_SEARCH_STATE('default'));
  });

  useEffect(() => {
    checkIsPossible();
  }, [password, isPossible]);

  /** 비밀번호가 입력 완료되었는지 확인하는 함수 */
  function checkIsPossible() {
    if (errors?.password || errors?.password?.type === 'required' || password === '') setValue('isPossible', false);
    else setValue('isPossible', true);
  }

  /** 비밀번호 확인하는 함수 */
  async function handleCheckPassword() {
    if (!isPossible) {
      checkInputFormToast();
      return;
    }

    try {
      const { data } = await checkPassword({ password });
      if (data) dispatch(SET_IS_POSSIBLE_UPDATE_USER_TRUE());
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className={`${styles.container} flex flex-col mx-auto justify-center h-4/6`}>
      <div className={`${styles.wrap} flex flex-col justify-center space-y-20 h-full`}>
        <div className='space-y-5'>
          <div className='flex items-center space-x-2'>
            <label className='modalTitle'>비밀번호 확인</label>
            <div className={`${styles.help}`}>영어 소문자, 숫자, 특수문자 포함 최소 8자</div>
          </div>

          <div className='space-y-2'>
            <input
              type='password'
              placeholder='비밀번호'
              className={`${errors?.password ? 'inputError' : null} block w-full`}
              {...register('password', {
                required: message.EssentialMessage,
                pattern: {
                  value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/,
                  message: message.PasswordMessage,
                },
                onBlur(e) {
                  checkIsPossible();
                },
              })}
            />

            <div className='error'>
              {errors?.password && errors?.password.type === 'required' && <span>{errors?.password?.message}</span>}
              {errors?.password && errors?.password.type === 'pattern' && <span>{errors?.password?.message}</span>}
            </div>
          </div>
        </div>

        <AppButton text='확인' bgColor={isPossible ? 'main' : 'thin'} handleClick={handleCheckPassword} />
      </div>
    </div>
  );
}
