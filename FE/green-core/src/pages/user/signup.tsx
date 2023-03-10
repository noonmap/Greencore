import React from 'react';
import AppLayout from '@/layout/AppLayout';
import { useInput } from '@/core/hooks';
import { signUp } from '~/src/core/user/userAPI';

export default function signup() {
  const [email, onChangeEmail] = useInput('');
  const [authCode, onChangeAuthCode] = useInput('');
  const [password, onChangePassword] = useInput('');
  const [checkPassword, onChangeCheckPassword] = useInput('');
  const [nickname, onChangeNickname] = useInput('');

  async function handleSignUp(e: React.SyntheticEvent<EventTarget>) {
    e.preventDefault();
    try {
      const payload = { email, password, nickname };
      const { data } = await signUp(payload);
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  }

  function handleCheckEmail() {
    console.log('handleCheckEmail');
  }

  function handleCheckNickname() {
    console.log('handleCheckNickname');
  }

  return (
    <AppLayout>
      <h1>회원가입</h1>

      <div className='space-y-2'>
        <div>
          <label>이메일</label>
          <div className='flex'>
            <input type='text' required className='block' onChange={onChangeEmail} />
            <button className='bg-blue-500 rounded' onClick={handleCheckEmail}>
              이메일 확인
            </button>
          </div>

          <div>
            <label>이메일 인증 코드</label>
            <div className='flex'>
              <input type='text' required className='block' onChange={onChangeEmail} />
              <button className='bg-blue-500 rounded' onClick={onChangeAuthCode}>
                인증코드 확인
              </button>
            </div>
          </div>
        </div>

        <div>
          <label>비밀번호</label>
          <input type='text' required className='block' onChange={onChangePassword} />
          <label>비밀번호 확인</label>
          <input type='text' required className='block' onChange={onChangeCheckPassword} />
        </div>

        <div>
          <label>닉네임</label>
          <div className='flex'>
            <input type='text' required className='block' onChange={onChangeNickname} />
            <button className='bg-blue-500 rounded' onClick={handleCheckNickname}>
              닉네임 중복 확인
            </button>
          </div>
        </div>
      </div>

      <div>
        req data:
        <div>
          {email} {password} {checkPassword} {nickname}
        </div>
      </div>

      <button className='bg-blue-500 rounded' onClick={handleSignUp}>
        회원가입
      </button>
    </AppLayout>
  );
}
