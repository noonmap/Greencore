import React, { useEffect, useState } from 'react';
import AppLayout from '@/layout/AppLayout';

import http from '@/lib/http';
import { Data } from '../api/temp';
import { getAuth, getRedirectResult } from 'firebase/auth';

export default function temp() {
  const [tempData, setTempDate] = useState<Data>(null);

  // 여기서는 간단히 쓴다고 이거 썼지만, 우리 목업 구현할 떄는 core 내에서 slice, api, type 만들어서 사용
  async function getData() {
    try {
      let { data } = await http.get('http://localhost:3000/api/temp');
      setTempDate(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getData();

    const auth = getAuth();

    return () => {};
  }, []);

  return (
    <AppLayout>
      <h1 className='text-3xl font-bold'>next api 사용해서 데이터 불러오기</h1>
      <div>(더미 데이터 주고받을 때 써보자)</div>
      <div>추후에는 삭제 예정</div>

      {tempData ? <div>{JSON.stringify(tempData)}</div> : 'no data'}
    </AppLayout>
  );
}
