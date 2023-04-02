import React, { useEffect, useRef } from 'react';
import styles from './UploadGuideModal.module.scss';

type PropsType = {
  isOpen: boolean;
  modalTitle: string;
  handleModalClose: () => void;
};

export default function UploadGuideModal({ isOpen, modalTitle, handleModalClose }: PropsType) {
  const modalRef = useRef<HTMLDivElement>(null);

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
          <div className='modalWrap' ref={modalRef} style={{ maxWidth: 'fit-content' }}>
            {/* 모달 내부 */}
            <div className='relative'>
              <span className='modalClose material-symbols-outlined' onClick={() => handleModalClose()}>
                close
              </span>
            </div>

            {/* 모달 컨텐츠 */}
            <div className='modalContent flex justify-between'>
              <div className='modalTitle'>{modalTitle}</div>
              <div className='mt-2'>
                {'예시)'}
                <img src='/images/guide.jpg' className={`${styles.guideImg}`} />
              </div>
              <div className='text-lg font-semibold'>{'❗ 주의사항'}</div>
              <ul>
                <li className='mt-2 ml-3'>병충해가 의심되는 잎을 중점적으로 찍어주세요.</li>
                <li className='mt-2 ml-3'>잎 주변에 다른 물체가 있으면 정확도가 떨어집니다.</li>
                <li className='mt-2 ml-3'>해상도에 따라 정확도가 달라지니 주의하세요!</li>
              </ul>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
