import React, { InputHTMLAttributes, useEffect, useState } from 'react';

import AppLayout from '@/layout/AppLayout';
import { useInput } from '@/core/hooks';
import { logIn } from '@/core/user/userAPI';

export default function login() {
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');
  const [image, setImage] = useState('');

  function handleLogIn() {
    console.log('login');
    const payload = { email, password };
  }

  function handleChangeFile(e: any) {
    console.log(e.target.files);
  }

  useEffect(() => {
    console.log(image);
    return () => {};
  }, [image]);

  return (
    <AppLayout>
      <h1>로그인</h1>

      <input type='file' accept='image/*' value={image} onChange={handleChangeFile} />

      <div className='space-y-2'>
        <label>이메일</label>
        <input type='text' required className='block' onChange={onChangeEmail} />
        <label>비밀번호</label>
        <input type='text' required className='block' onChange={onChangePassword} />
      </div>

      <div>
        req data:
        <div>
          {email} {password}
        </div>
      </div>

      <button className='bg-blue-500 rounded' onClick={handleLogIn}>
        로그인
      </button>
    </AppLayout>
  );
}
