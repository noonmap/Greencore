import React, { useEffect } from "react";
import AppLayout from "@/layout/AppLayout";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/core/hooks";
import { getAlertList } from "@/core/alert/alertAPI";

export default function Alert() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.alert.isLoading);
  const alertList = useAppSelector((state) => state.alert.alertList);

  useEffect(() => {
    dispatch(getAlertList());

    if (!isLoading) {
      console.log(alertList);
    }

    return () => {
      console.log("unmounted");
    };
  }, []);

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

              <button className='bg-blue-500 px-3 rounded'>삭제</button>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
