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
        <title>치코치코</title>
        <meta name='description' content='특화프로젝트' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
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
