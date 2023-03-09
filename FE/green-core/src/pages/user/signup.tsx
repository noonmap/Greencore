import React, { useState } from 'react';
import AppLayout from '@/layout/AppLayout';
import http from '@/lib/http';
// import Toastify from 'toastify-js';
import { useAppDispatch, useInput } from '@/core/hooks';
import { signUp } from '~/src/core/user/userAPI';

import { Data } from '../api/user/index';

export default function signup() {
  const dispatch = useAppDispatch();
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');
  const [nickname, onChangeNickname] = useInput('');
  const [data, setData] = useState<Data>(null);

  async function handleSignUp() {
    console.log('회원가입');
    const payload = { email, password, nickname };
    // const { data } = await signUp(payload);
    // setData(data);

    dispatch(signUp(payload));
    // console.log(res);
    // if (data.result === 'SUCCESS') {
    //   console.log(data);

    //   Toastify({
    //     text: '회원가입 성공!',
    //     duration: 2000,
    //     // destination: 'https://github.com/apvarun/toastify-js',
    //     newWindow: true,
    //     close: true,
    //     gravity: 'top', // `top` or `bottom`
    //     position: 'center', // `left`, `center` or `right`
    //     stopOnFocus: true, // Prevents dismissing of toast on hover
    //     style: {
    //       background: 'linear-gradient(to right, #00b09b, #96c93d)',
    //     },
    //     onClick: function () {}, // Callback after click
    //   }).showToast();
    // } else {
    //   Toastify({
    //     text: '오류입니다 ❌',
    //     duration: 2000,
    //     // destination: 'https://github.com/apvarun/toastify-js',
    //     newWindow: true,
    //     close: true,
    //     gravity: 'top', // `top` or `bottom`
    //     position: 'center', // `left`, `center` or `right`
    //     stopOnFocus: true, // Prevents dismissing of toast on hover
    //     style: {
    //       background: 'linear-gradient(to right, #00b09b, #96c93d)',
    //     },
    //     onClick: function () {}, // Callback after click
    //   }).showToast();
    // }
  }

  return (
    <AppLayout>
      <h1>회원가입</h1>

      <div className='space-y-2'>
        <label>이메일</label>
        <input type='text' required className='block' onChange={onChangeEmail} />
        <label>비밀번호</label>
        <input type='text' required className='block' onChange={onChangePassword} />
        <label>닉네임</label>
        <input type='text' required className='block' onChange={onChangeNickname} />
      </div>

      <div>
        req data:
        <div>
          {email} {password} {nickname}
        </div>
      </div>

      <button className='bg-blue-500 rounded' onClick={handleSignUp}>
        회원가입
      </button>

      <div>
        res data:
        {/* <div>{isLoading ? <div>{data}</div> : null}</div> */}
      </div>
    </AppLayout>
  );
}
