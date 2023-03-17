import React, { useEffect, useRef } from 'react';

export default function AppModal({ isOpen, handleModalClose, handleModalConfirm }) {
  const modalRef = useRef<HTMLDivElement>(null);

  function handleModalOutsideClick(e) {
    // 모달 바깥 클릭 시
    if (modalRef.current && !modalRef.current.contains(e.target)) handleModalClose(false);
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
          <div className='modalWrap' ref={modalRef}>
            {/* 모달 내부 */}
            <div onClick={() => handleModalClose()}>X</div>

            {/* 모달 컨텐츠 */}
            <div className='modalContent'>
              <div>모달 제목</div>
              <div>모달 내용</div>

              <div className='flex'>
                <button onClick={() => handleModalClose()}>취소</button>
                <button onClick={handleModalConfirm}>확인</button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
