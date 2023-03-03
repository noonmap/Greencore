import React from "react";
import Link from "next/link";

export default function AppHeader() {
  return (
    <div className='flex space-x-4 items-center'>
      <Link href='/'>Home</Link>
      <Link href='/post'>Post</Link>
      <Link href='/todo'>ToDo</Link>

      <button className='bg-white p-2 rounded-lg shadow-sm font-medium'>로그인</button>
    </div>
  );
}
