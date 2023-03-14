import { useAppDispatch, useAppSelector } from '@/core/hooks';
import { deleteUser, logOut } from '@/core/user/userAPI';
import AppLayout from '@/layout/AppLayout';
import React from 'react';

export default function UserDelete() {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.user.accessToken);

  async function handleUserDelete() {
    dispatch(deleteUser(accessToken));
  }

  return (
    <AppLayout>
      <div>진짜 회원탈퇴?</div>
      <button className='bg-blue-500 rounded' onClick={handleUserDelete}>
        회원탈퇴
      </button>
    </AppLayout>
  );
}
