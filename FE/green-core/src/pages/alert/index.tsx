import React, { useState, useEffect } from 'react';
import AppLayout from '@/layout/AppLayout';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/core/hooks';
import http from '@/lib/http.js';
import { getAlertList, deleteAlert } from '@/core/alert/alertAPI';

export default function Alert() {
  // 페이지네이션 적용 전 ---------------------------------------------------------------

  // const dispatch = useAppDispatch();
  // const isLoaded = useAppSelector((state) => state.alert.isLoaded);
  // const alertList = useAppSelector((state) => state.alert.alertList);
  // const [pageNum, setPageNum] = useState(0);

  // useEffect(() => {
  //   const payload = {
  //     page: pageNum,
  //   };

  //   try {
  //     dispatch(getAlertList(payload));
  //     return () => {};
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }, []);

  // 페이지네이션 적용 후 ---------------------------------------------------------------

  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false); // 아직 의미없음
  const [isLoaded, setIsLoaded] = useState(false); // 데이터 로딩 상태
  const [alertList, setAlertList] = useState([]);
  const [target, setTarget] = useState(null); // 관찰 대상 target
  const [pageNum, setPageNum] = useState(0);
  const [stop, setStop] = useState(false); // 마지막 데이터까지 다 불러온 경우 스탑

  // 타겟을 만났을때 실행?
  useEffect(() => {
    let observer;
    if (target && !stop) {
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
      getMoreItem(); // 데이터 요청
      observer.observe(entry.target); // 관찰 재시작
    }
  };

  // 데이터를 불러오는 로직
  async function fetch(page: number) {
    if (!stop) {
      const payload = {
        page: page,
      };
      setPageNum((page) => page + 1);

      const { data }: any = await http.get('/alert', { params: { page: payload.page } });

      // 전체 페이지를 다 불러온 경우
      if (data.data.length == 0) {
        setStop(true);
      }
      // AlertList 추가
      await setAlertList((prev) => [...prev, ...data.data]);
      setIsLoaded(false);
    }
  }

  const getMoreItem = () => {
    // 데이터를 받아오도록 true로 변경
    setIsLoaded(true);
  };

  useEffect(() => {
    fetch(pageNum);
  }, [isLoaded]);

  // -----------------------------------------------------------------------------------------------------------------------------------------

  async function handleDeleteAlert(alertId: number) {
    try {
      const { data } = await deleteAlert(alertId);
      const payload = {
        page: pageNum,
      };
      dispatch(getAlertList(payload));
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
