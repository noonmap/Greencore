import React from 'react';
import AppLayout from '@/layout/AppLayout';
import { useAppDispatch, useAppSelector } from '@/core/hooks';
import { SET_IS_LOADING_FALSE, SET_IS_LOADING_TRUE } from '@/core/common/commonSlice';

export default function index() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.common.isLoading);
  const firebase = useAppSelector((state) => state.common.firebase);
  console.log('hi:', isLoading);
  console.log('firebase:', firebase);

  function handleIsLoadingTrue() {
    dispatch(SET_IS_LOADING_TRUE());
  }
  function handleIsLoadingFalse() {
    dispatch(SET_IS_LOADING_FALSE());
  }

  return (
    <AppLayout>
      <h1>내 프로필</h1>

      <div>redux-persist test</div>
      <div>isLoading: {JSON.stringify(isLoading)}</div>
      <button className='bg-blue-500 rounded mr-2' onClick={handleIsLoadingTrue}>
        로딩 true 변경
      </button>
      <button className='bg-blue-500 rounded' onClick={handleIsLoadingFalse}>
        로딩 false 변경
      </button>

      <div>프로필 라인</div>
      <div>내키식 라인</div>
      <div>나의 관찰일지 라인</div>
      <div>포스트 라인</div>
    </AppLayout>
  );
}
