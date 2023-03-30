import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import AppButton from '../button/AppButton';
import styles from './CommentDeleteModal.module.scss';

type PropsType = {
  isOpen: boolean;
  modalTitle: string;
  handleDelete: () => void;
  handleModalClose: () => void;
};

type StateType = {
  content: string;
};

const initialState: StateType = {
  content: '',
};

export default function CommentDeleteModal({ isOpen, modalTitle, handleModalClose, handleDelete }: PropsType) {
  const { register, setValue, getValues, watch } = useForm({ defaultValues: initialState, mode: 'onChange' });
  const modalRef = useRef<HTMLDivElement>(null);
  const content = getValues('content');

  // 모달 바깥 클릭 시
  function handleModalOutsideClick(e: any) {
    if (modalRef.current && !modalRef.current.contains(e.target)) handleModalClose();
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleModalOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleModalOutsideClick);
    };
  }, []);

  return (
    <>
      {isOpen ? (
        <div className='modalContainer'>
          <div className={`modalWrap`} ref={modalRef}>
            {/* 모달 내부 */}
            <div className='relative'>
              <span className='modalClose material-symbols-outlined' onClick={() => handleModalClose()}>
                close
              </span>
            </div>

            {/* 모달 컨텐츠 */}
            <div className={`modalContent flex justify-between ${styles.modalContentSub}`}>
              <div className='modalTitle'>{modalTitle}</div>

              <div>
                <div>삭제하시면 다시 되돌릴 수 없습니다.</div>
                <div>삭제 하시겠습니까?</div>
              </div>

              <div className={`flex justify-between`}>
                <AppButton text='취소' bgColor='thin' handleClick={() => handleModalClose()} />
                <AppButton text='확인' handleClick={() => handleDelete()} />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
