import style from "./AppLayout.module.scss";
import React from "react";
import Head from "next/head";

import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";

type AppLayoutProps = {
  children: React.ReactNode;
  home?: boolean;
};

export default function Layout({ children, home }: AppLayoutProps) {
  return (
    <>
      <Head>
        <title>안뇽</title>
      </Head>

      <AppHeader />
      <main className={style.container}>
        {home ? (
          <div>
            home
            <div>{children}</div>
          </div>
        ) : (
          <div>{children}</div>
        )}
      </main>
      <AppFooter />
    </>
  );
}
