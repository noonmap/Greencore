import React, { useState } from 'react';
import Link from 'next/link';
import { useAppDispatch } from '@/core/hooks';
import { useForm } from 'react-hook-form';
import { deleteAlert, getAlertList } from '@/core/alert/alertAPI';
import { AlertType } from '@/core/alert/alertType';
import styles from '@/styles/Alert.module.scss';

type StateType = {
  checkedPostList: Array<AlertType>;
};

const initialState: StateType = {
  checkedPostList: [],
};

export default function UserAlertListItem({ alert }) {
  const dispatch = useAppDispatch();
  const { register, getValues, watch } = useForm<StateType>({ defaultValues: initialState });
  const [size, setSize] = useState<number>(10);

  // 알림 삭제
  async function handleDeleteAlert(alertId: number) {
    try {
      const { result } = await deleteAlert(alertId);

      if (result === 'SUCCESS') {
        const params = {
          page: 0,
          size: size,
        };
        dispatch(getAlertList(params));
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <div key={alert.alertId} className={`${styles.card} flex items-center justify-between space-x-20 mb-5`}>
        <div className='flex items-center'>
          {!true ? (
            <span className='material-symbols-outlined fill-small like mr-2'>fiber_manual_record</span>
          ) : (
            <span className='material-symbols-outlined fill-small alertLight mr-2'>fiber_manual_record</span>
          )}
          <Link href={alert.urlPath} className='flex items-center space-x-3'>
            <input type='checkbox' value={alert.alertId} className='w-1 h-1' {...register('checkedPostList')} />
            <span className='w-50 hover:underline'>{alert.content}</span>
          </Link>
        </div>

        <div className='flex items-center space-x-2'>
          <span className='introduction'>{alert.createdAt}</span>
          <span className='material-symbols-outlined cursor-pointer close' onClick={() => handleDeleteAlert(alert.alertId)}>
            close
          </span>
        </div>
      </div>
    </>
  );
}
