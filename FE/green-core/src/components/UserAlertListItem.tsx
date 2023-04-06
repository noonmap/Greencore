import React from 'react';
import Link from 'next/link';
import { useAppDispatch } from '@/core/hooks';
import { deleteAlert } from '@/core/alert/alertAPI';
import { AlertType } from '@/core/alert/alertType';
import styles from '@/styles/user/alert.module.scss';

export default function UserAlertListItem({ alert, nickname, selectedAlertList }) {
  const dispatch = useAppDispatch();

  /** 알림 단일 삭제하는 함수 */
  async function handleDeleteAlert(alertId: string) {
    try {
      const payload = { nickname, alertId };
      dispatch(deleteAlert(payload));
    } catch (err) {
      console.error(err);
    }
  }

  /** 알림 리스트 선택 핸들링 함수 */
  function handleSelctedAlertListChange(e) {
    let selected = e.target.value;

    if (!selectedAlertList.includes(selected)) {
      selectedAlertList.push(selected);
    } else {
      let idx = selectedAlertList.indexOf(selected);
      selectedAlertList.splice(idx, 1);
    }
  }

  return (
    <>
      <div key={alert.alertId} className={`${styles.introduction} flex items-center justify-between space-x-2 mb-5`}>
        <div className='flex items-center'>
          <input type='checkbox' value={alert.alertId} className='w-1 h-1 mr-2' onChange={handleSelctedAlertListChange} />
          <div className='flex items-center space-x-2'>
            {alert.isRead ? (
              <span className='material-symbols-outlined fill-small alertLight'>fiber_manual_record</span>
            ) : (
              <span className='material-symbols-outlined fill-small like'>fiber_manual_record</span>
            )}
            <Link href={alert.urlPath} className='w-full hover:underline'>
              {alert.content}
            </Link>
          </div>
        </div>

        <div className='flex items-center'>
          <span className='introduction'>{alert.createdAt}</span>
          <span className='material-symbols-outlined cursor-pointer like close' onClick={() => handleDeleteAlert(alert.alertId)}>
            close
          </span>
        </div>
      </div>
    </>
  );
}
