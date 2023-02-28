import React from "react";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/core/hooks";
import { AppState } from "@/core/store";
import { logIn } from "@/core/tmp/userAPI";

export default function HeaderView() {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector((state: AppState) => state.user.isLoggedIn);
  const userInfo = useAppSelector((state: AppState) => state.user.data);

  const handleLogInClick = () => {
    dispatch(logIn(1));
  };

  return (
    <div>
      <Link href='/'>home</Link> | <Link href='/mypage'>마이 페이지</Link>
      {isLoggedIn ? (
        <div>{userInfo.username} 님 안녕하세요!</div>
      ) : (
        <button onClick={handleLogInClick} className='bg-gray-500'>
          로그인
        </button>
      )}
    </div>
  );
}
