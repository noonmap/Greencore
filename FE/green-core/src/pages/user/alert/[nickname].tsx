import React, { useState, useEffect } from 'react';
import AppLayout from '@/layout/AppLayout';
import { useAppDispatch, useAppSelector } from '@/core/hooks';
import { createAlert, deleteSelectedAlert, getAlertList, updateAllAlert, updateSelectedAlert, checkIsAlert } from '@/core/alert/alertAPI';
import AppLoading from '@/components/common/AppLoading';
import UserAlertListItem from '@/components/UserAlertListItem';
import { SET_IS_SEARCH_STATE } from '@/core/common/commonSlice';

export default function Alert() {
  const dispatch = useAppDispatch();
  const nickname = useAppSelector((state) => state.common?.userInfo?.nickname);

  const isLoading = useAppSelector((state) => state.alert.isLoading);
  const alertList = useAppSelector((state) => state.alert.alertList);
  const page = useAppSelector((state) => state.alert.page);
  const size = useAppSelector((state) => state.alert.size);

  const [selectedAlertList, setSelectedAlertList] = useState<Array<string>>([]);

  // searchState 변경
  useEffect(() => {
    dispatch(SET_IS_SEARCH_STATE('default'));
  });

  useEffect(() => {
    fetchAlertList();
    return () => {};
  }, []);

  /** 알림 리스트 가져오는 함수 */
  async function fetchAlertList() {
    const payload = { nickname, page, size };
    dispatch(getAlertList(payload));
  }

  /** 알림 읽음 확인 함수 */
  async function handleSelectedAlertRead() {
    try {
      const payload = { nickname, selectedAlertList };
      dispatch(updateSelectedAlert(payload));
      dispatch(checkIsAlert(nickname));
    } catch (error) {
      console.error(error);
    }
  }

  /** 알림 전체 읽음 확인 함수 */
  async function handleAllAlertRead() {
    try {
      dispatch(updateAllAlert(nickname));
    } catch (error) {
      console.error(error);
    }
  }

  /** 알림 리스트 선택 삭제 함수 */
  async function handleSelectedAlertDelete() {
    try {
      const payload = { nickname, selectedAlertList };
      dispatch(deleteSelectedAlert(payload));
    } catch (error) {
      console.error(error);
    }
  }

  /** 알림 생성 함수 */
  async function handleAlertCreate() {
    try {
      const payload = {
        nickname,
        mentionNickname: 'hi',
        type: 'ALERT_FOLLOW',
        urlPath: '/',
        createdAt: '2',
        isRead: false,
      };
      dispatch(createAlert(payload));
    } catch (error) {
      console.error(error);
    }
  }

  /** 알림 체크하기 기능 */
  async function handleIsAlertCheck() {
    try {
      dispatch(checkIsAlert(nickname));
    } catch (error) {
      console.error(error);
    }
  }

  if (isLoading)
    return (
      <AppLayout>
        <AppLoading />
      </AppLayout>
    );

  return (
    <AppLayout>
      {alertList.length == 0 ? (
        <>알림 리스트가 없습니다</>
      ) : (
        <div className='py-5 px-10'>
          <h1 className='main mb-5'>알림</h1>

          <div className='flex justify-between px-20 main mb-5'>
            <div className='flex space-x-2'>
              <div className='hover:underline cursor-pointer' onClick={handleIsAlertCheck}>
                알림 안 읽은거 확인 test
              </div>
              <div className='hover:underline cursor-pointer' onClick={handleAlertCreate}>
                알림 생성
              </div>
              <div className='hover:underline cursor-pointer' onClick={handleAllAlertRead}>
                전체 읽음 확인
              </div>
              <div className='hover:underline cursor-pointer' onClick={handleSelectedAlertRead}>
                읽음 확인
              </div>
            </div>
            <div className='hover:underline cursor-pointer' onClick={handleSelectedAlertDelete}>
              삭제
            </div>
          </div>

          <div className='flex flex-col px-20'>
            {alertList.map((alert) => (
              <UserAlertListItem key={alert.alertId} alert={alert} selectedAlertList={selectedAlertList} />
            ))}
          </div>
        </div>
      )}
    </AppLayout>
  );
}
