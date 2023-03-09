import React, { useEffect } from "react";
import AppLayout from "@/layout/AppLayout";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/core/hooks";
import { getAlertList, deleteAlert } from "@/core/alert/alertAPI";

export default function Alert() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.alert.isLoading);
  const alertList = useAppSelector((state) => state.alert.alertList);

  useEffect(() => {
    dispatch(getAlertList());
    return () => {};
  }, []);

  const handleDeleteAlert = async (alertId) => {
    await dispatch(deleteAlert(alertId));
    // Todo : 알림 리스트 다시 조회하기
  };

  return (
    <AppLayout>
      {isLoading ? (
        <></>
      ) : (
        <div>
          {alertList.map((alert) => (
            <div key={alert.alertId}>
              <Link href={alert.urlPath}>
                {alert.content}
                <span>{alert.createdAt}</span>
              </Link>

              <button className='bg-blue-500 px-3 rounded' onClick={() => handleDeleteAlert(alert.alertId)}>
                삭제
              </button>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
