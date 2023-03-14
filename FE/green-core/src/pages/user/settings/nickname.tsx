import React, { useEffect } from 'react';
import AppLayout from '@/layout/AppLayout';
import { useForm } from 'react-hook-form';
import { checkInputFormToast } from '@/lib/utils';
import { checkNickname, getProfile, updateProfile } from '@/core/user/userAPI';
import { useAppSelector } from '@/core/hooks';
import { getAdditionalUserInfo } from 'firebase/auth';

type StateType = {
  nickname: string;
  isCheckedNickname: boolean;
  introduction: string;
};

const initialState: StateType = {
  nickname: '',
  isCheckedNickname: false,
  introduction: '',
};

export default function nickname() {
  const {
    register,
    formState: { errors },
    setValue,
    getValues,
    watch,
  } = useForm<StateType>({ defaultValues: initialState, mode: 'onChange' });

  const [nickname, isCheckedNickname, introduction] = getValues(['nickname', 'isCheckedNickname', 'introduction']);
  const { nickname: userNickname } = useAppSelector((state) => state.common.userInfo);

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

  async function handleUserProfileUpdate() {
    if (errors.nickname || nickname == '' || !isCheckedNickname) {
      checkInputFormToast();
      return;
    }

    try {
      const payload = {};
      const { data } = await updateProfile(payload);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function getUserProfile() {
    try {
      const { data } = await getProfile(userNickname);
      setValue('nickname', userNickname);
      setValue('introduction', data.introduction);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getUserProfile();
    watch();
    return () => {};
  }, []);

  return (
    <AppLayout>
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

        <label>한 줄 자기소개</label>
        <div className='flex'>
          <input type='text' className='block' {...register('introduction')} placeholder='자기소개' />
        </div>

        <button className='bg-blue-500 rounded' onClick={handleUserProfileUpdate}>
          프로필 수정
        </button>
      </div>
    </AppLayout>
  );
}
