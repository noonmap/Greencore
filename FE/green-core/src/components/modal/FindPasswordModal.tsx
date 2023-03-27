import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { findPassword } from '@/core/user/userAPI';
import { checkInputFormToast } from '@/lib/utils';
import { useAppSelector } from '@/core/hooks';
import AppButton from '../button/AppButton';

import { EssentialMessage, EmailMessage } from '@/assets/message.json';

type PropsType = {
  isOpen: boolean;
  handleModalClose: () => void;
};

type StateType = {
  email: string;
};

const initialState: StateType = {
  email: '',
};

export default function AppModal({ isOpen, handleModalClose }: PropsType) {
  const modalRef = useRef<HTMLDivElement>(null);

  const {
    register,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: initialState, mode: 'onChange' });
  const [email] = getValues(['email']);

  useEffect(() => {
    watch();
    document.addEventListener('mousedown', handleModalOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleModalOutsideClick);
    };
  }, []);

  /** 모달 바깥을 클릭 시 모달을 닫는 함수 */
  function handleModalOutsideClick(e) {
    if (modalRef.current && !modalRef.current.contains(e.target)) handleModalClose();
  }

  /** 새로운 비밀번호 전송하는 함수 */
  async function handleFindPassword() {
    if (errors?.email || email == '') {
      checkInputFormToast();
      return;
    }

    try {
      const payload = { email };
      const { data } = await findPassword(payload);
      handleModalClose();
    } catch (error) {
      console.error(error);
    }

    setValue('email', '');
  }

  return (
    <>
      {isOpen ? (
        <div className='modalContainer'>
          <div className='modalWrap' ref={modalRef}>
            {/* 모달 내부 */}
            <div className='relative'>
              <span className='modalClose material-symbols-outlined' onClick={() => handleModalClose()}>
                close
              </span>
            </div>

            {/* 모달 컨텐츠 */}
            <div className='modalContent flex justify-between'>
              <div>
                <div className='modalTitle'>비밀번호 찾기</div>
                <div className='mb-4 text-sm titleLight'>해당 이메일로 새 비밀번호가 전송됩니다</div>

                <div className='flex flex-col'>
                  <div className='flex flex-col space-y-2'>
                    <input
                      type='email'
                      className={`${errors?.email ? 'inputError' : null} block w-full`}
                      placeholder='이메일을 입력해주세요'
                      {...register('email', {
                        required: EssentialMessage,
                        pattern: { value: /^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/, message: EmailMessage },
                      })}
                    />

                    <div className={`error`}>
                      {errors?.email && errors?.email.type === 'required' && <span>{errors?.email?.message}</span>}
                      {errors?.email && errors?.email.type === 'pattern' && <span>{errors?.email?.message}</span>}
                    </div>
                  </div>
                </div>
              </div>

              <AppButton text='새로운 비밀번호 전송' handleClick={handleFindPassword}></AppButton>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

AppModal.defaultProps = {
  isOpen: true,
};
