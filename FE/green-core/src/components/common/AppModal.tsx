import React, { ReactNode, useEffect, useRef } from 'react';
import AppButton from '../button/AppButton';

type PropsType = {
  isOpen: boolean;
  title: string;
  content?: string | ReactNode | undefined;
  desc?: string | null;
  handleModalClose: () => void;
  handleModalConfirm?: (params: any) => any;
};

export default function AppModal({ isOpen, title, content, desc, handleModalClose, handleModalConfirm }: PropsType) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.addEventListener('mousedown', handleModalOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleModalOutsideClick);
    };
  }, []);

  /** 모달 바깥을 클릭 시 모달을 닫는 함수 */
  function handleModalOutsideClick(e) {
    if (modalRef.current && !modalRef.current.contains(e.target)) handleModalClose();
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
                <div className='modalTitle'>{title}</div>
                <div className='mb-5 text-sm titleLight'>{desc}</div>

                <div>{content}</div>
              </div>

              <div className='flex space-x-2'>
                <AppButton text='취소' bgColor='thin' className='w-full' handleClick={handleModalClose} />
                <AppButton text='확인' className='w-full' handleClick={handleModalConfirm} />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

AppModal.defaultProps = {
  isOpen: true,
  title: '모달 제목',
  content: (
    <div>
      삭제하시면 되돌릴 수 없습니다. <br />
      삭제하시겠습니까?
    </div>
  ),
};
