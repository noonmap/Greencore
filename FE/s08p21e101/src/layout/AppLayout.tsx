import React from "react";
import Head from "next/head";
import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";

type AppLayoutProps = {
  children: React.ReactNode;
  home?: boolean;
};

export default function AppLayout({ children, home }: AppLayoutProps) {
  return (
    <>
      <Head>
        <title>공통 타이틀</title>
      </Head>

      <AppHeader />
      <main>
        {home ? (
          <div>
            <div className='mx-auto max-w-7xl p-6 lg:px-8'>home</div>
            {children}
          </div>
        ) : (
          children
        )}
      </main>
      <AppFooter />
    </>
  );
}
