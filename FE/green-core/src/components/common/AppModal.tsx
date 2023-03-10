import React from 'react';
import styles from './AppModal.module.scss';

export default function AppModal() {
  return (
    <div className={styles.modalContainer}>
      {/* 모달 내부 */}
      <div className={styles.modalWrap}>
        <div>X</div>

        {/* 모달 컨텐트 */}
        <div className={styles.modalContent}>
          <div>모달 제목</div>
          <div>모달 내용</div>

          <div className='flex'>
            <button>취소</button>
            <button>확인</button>
          </div>
        </div>
      </div>
    </div>
  );
}
