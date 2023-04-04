import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { updatePassword } from '@/core/user/userAPI';
import { checkInputFormToast } from '@/lib/utils';
import AppButton from '@/components/button/AppButton';
import message from '@/assets/message.json';
import styles from '@/styles/Settings.module.scss';
import { useAppDispatch } from '@/core/hooks';
import { SET_IS_POSSIBLE_UPDATE_USER_FALSE } from '@/core/user/userSlice';

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

export default function UserSettingsPassword() {
  const dispatch = useAppDispatch();

  const {
    register,
    formState: { errors },
    setValue,
    getValues,
    watch,
  } = useForm<StateType>({ defaultValues: initialState, mode: 'onChange' });
  const [password, checkPassword, passwordMessage] = getValues(['password', 'checkPassword', 'passwordMessage']);

  useEffect(() => {
    watch();
    return () => {
      dispatch(SET_IS_POSSIBLE_UPDATE_USER_FALSE());
    };
  }, []);

  function handleCheckPassword(e) {
    if (password === e.target.value || checkPassword === e.target.value) return setValue('passwordMessage', '');
    else return setValue('passwordMessage', '비밀번호가 다릅니다');
  }

  async function handlePasswordUpdate() {
    if (errors.password || password == '' || checkPassword == '') {
      checkInputFormToast();
      return;
    }

    try {
      const { data } = await updatePassword({ password: password });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className={`${styles.container} flex flex-col mx-auto justify-center h-4/6`}>
      <div className={`${styles.wrap} flex flex-col justify-center space-y-20 h-full`}>
        <div className='space-y-5'>
          <div className='modalTitle'>회원정보 수정</div>

          <div className='space-y-2'>
            {/* 비밀번호 */}
            <div className='flex items-center space-x-2'>
              <label className={styles.main}>비밀번호</label>
              <div className={`${styles.help}`}>영어 소문자, 숫자, 특수문자 포함 최소 8자</div>
            </div>

            <input
              type='text'
              required
              placeholder='비밀번호'
              className={`${errors?.password ? 'inputError' : null} block w-full`}
              {...register('password', {
                required: message.EssentialMessage,
                pattern: {
                  value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/,
                  message: message.PasswordMessage,
                },
                onChange: (e) => handleCheckPassword(e),
              })}
            />
          </div>

          {/* 비밀번호 확인 */}

          <div className='space-y-2'>
            <label className={styles.main}>비밀번호 확인</label>

            <input
              type='password'
              required
              placeholder='비밀번호 확인'
              className={`${errors?.checkPassword ? 'inputError' : null} block w-full`}
              {...register('checkPassword', {
                required: message.EssentialMessage,
                pattern: {
                  value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/,
                  message: message.PasswordMessage,
                },
                onChange: (e) => handleCheckPassword(e),
              })}
            />

            <div className='error'>
              {/* {errors?.password && errors?.password.type === 'required' && <span>{errors?.password?.message}</span>} */}
              {/* <br /> */}
              {errors?.password && errors?.password.type === 'pattern' ? <span>{errors?.password?.message}</span> : passwordMessage}
            </div>
          </div>
        </div>

        <AppButton text='확인' handleClick={handlePasswordUpdate} />
      </div>
    </div>
  );
}
