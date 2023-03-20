import React, { useState, useEffect } from 'react';
import AppLayout from '@/layout/AppLayout';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/core/hooks';
import { getAlertList, getAlertListMore, deleteAlert } from '@/core/alert/alertAPI';

export default function Alert() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.alert.isLoading);

  // ----------------------- 인피니티 스크롤 변수 ------------------------
  const alertList = useAppSelector((state) => state.alert.alertList);
  const isStoped = useAppSelector((state) => state.alert.isStoped);
  const page = useAppSelector((state) => state.alert.page);

  const [size, setSize] = useState<number>(10);
  const [target, setTarget] = useState(null); // 관찰 대상 target
  const [isLoaded, setIsLoaded] = useState(true); // 데이터 로딩 상태

  useEffect(() => {
    const params = {
      page: 0,
      size: size,
    };
    dispatch(getAlertList(params));
    setIsLoaded(false);
  }, []);

  // 타겟 설정
  useEffect(() => {
    let observer;
    if (target && !isStoped) {
      setTimeout(() => {
        observer = new IntersectionObserver(onIntersect, {
          threshold: 1, // 배열의 요소가 100% 보여질때마다 콜백을 실행
        });
        observer.observe(target);
      }, 100);
    }
    return () => observer && observer.disconnect();
  }, [target, isLoaded]);

  // 타겟을 만났을 때 실행하는 로직
  const onIntersect = async ([entry]: any, observer: any) => {
    if (entry.isIntersecting && !isLoaded) {
      observer.unobserve(entry.target); // 관찰 멈춤
      getMoreItem(); // isLoaded를 바꿈
      observer.observe(entry.target); // 관찰 재시작
    }
  };

  // 추가 데이터 요청
  const getMoreItem = () => {
    setIsLoaded(true);
  };

  // isLoaded 가 변할 때 실행
  useEffect(() => {
    if (isLoaded && page !== 0) {
      fetchAlertList();
    }
    return () => {};
  }, [isLoaded]);

  // 추가 데이터 요청하기
  async function fetchAlertList() {
    const params = {
      page: page,
      size: size,
    };
    await dispatch(getAlertListMore(params));
    setIsLoaded(false);
  }

  // -----------------------------------------------------------------------------------------------------------------------------------------

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
    <AppLayout>
      {isLoading ? (
        <></>
      ) : alertList.length == 0 ? (
        <div>
          <span>조회된 데이터가 없습니다.</span>
        </div>
      ) : (
        <>
          <div>
            {alertList.map((alert) => (
              <div key={alert.alertId}>
                <Link href={alert.urlPath}>
                  <span>Id : {alert.alertId}</span>
                  <span>{alert.content}</span>
                  <span>{alert.createdAt}</span>
                </Link>

                <button className='bg-blue-500 px-3 rounded' onClick={() => handleDeleteAlert(alert.alertId)}>
                  삭제
                </button>
              </div>
            ))}
            <div ref={setTarget} />
          </div>
          <div />
        </>
      )}
    </AppLayout>
  );
}
