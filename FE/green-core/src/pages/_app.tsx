import { Provider } from 'react-redux';
import { CookiesProvider } from 'react-cookie';
import type { AppProps } from 'next/app';
import { PersistGate } from 'redux-persist/integration/react';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import store, { persistor } from '@/core/store';
import { AxiosInterceptor } from '@/lib/http';
import { getCookieToken } from '@/lib/cookies';

import '@/styles/tailwind.css';
import '@/styles/globals.scss';
import '@fortawesome/fontawesome-svg-core/styles.css';
import 'react-loading-skeleton/dist/skeleton.css';
import 'toastify-js/src/toastify.css';

import kakaoConfig from '~/config/kakaoConfig.json';
import { useAppDispatch, useAppSelector } from '@/core/hooks';
import { getAccessToken } from '@/core/user/userAPI';
import AppLoading from '@/components/common/AppLoading';

import { getFirestore, collection, query, orderBy, startAfter, onSnapshot, limit } from 'firebase/firestore';
import { getAlertList } from '@/core/alert/alertAPI';

declare global {
  interface Window {
    Kakao: any;
  }
}

const onBeforeLift = () => {
  // take some action before the gate lifts
};

function App() {
  const dispatch = useAppDispatch();
  const db = getFirestore();

  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
  const page = useAppSelector((state) => state.alert.page);
  const size = useAppSelector((state) => state.alert.size);

  const alertInit = () => {
    let lastPage = null;
    let alertQuery = null;

    const nickname = 'test';
    const alertRef = collection(db, nickname);

    if (page) alertQuery = query(alertRef, orderBy('createdAt', 'desc'), startAfter(lastPage), limit(size));
    else alertQuery = query(alertRef, orderBy('createdAt', 'desc'), limit(size));

    const alertSnapshot = onSnapshot(alertQuery, { includeMetadataChanges: true }, (snapShot: any) => {
      snapShot.docChanges().forEach((change) => {
        // if (change.type === 'added') {
        // 	console.log('New city: ', change.doc.data());
        // }
        // if (change.type === 'modified') {
        // 	console.log('Modified city: ', change.doc.data());
        // }
        // if (change.type === 'removed') {
        // 	console.log('Removed city: ', change.doc.data());
        // }
        const payload = { nickname, page, size };
        dispatch(getAlertList(payload));
      });
    });
  };

  function sayHi() {
    var styles = [
      'background-image: radial-gradient( circle 1259px at 2.8% 48.8%,  rgba(255,243,110,1) 0%, rgba(30,204,214,1) 45.6%, rgba(5,54,154,1) 65.9% );',
      // "border: 1px solid #3E0E02",
      'color: black',
      // "display: block",
      // "text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3)",
      // "box-shadow: 0 1px 0 rgba(255, 255, 255, 0.4) inset, 0 5px 3px -5px rgba(0, 0, 0, 0.5), 0 -13px 5px -10px rgba(255, 255, 255, 0.4) inset",
      'line-height: 40px',
      'border-radius: 10px',
      'text-align: center',
      'font-weight: bold',
    ].join(';');

    console.log('%c  😀 Welcome To GREEN-CORE!  ', styles);

    // console.group("일해라일조");
    // console.log("그룹 메시지");
    // console.groupEnd();
  }

  useEffect(() => {
    if (getCookieToken()) alertInit();
    return () => {
      alertInit();
    };
  }, [alertInit]);

  useEffect(() => {
    if (getCookieToken()) dispatch(getAccessToken());
    // sayHi();
    return () => {};
  }, []);

  return <></>;
}

export default function AppWraper({ Component, pageProps }: AppProps) {
  function kakaoInit() {
    window.Kakao.init(kakaoConfig.apiKey);
    window.Kakao.isInitialized();
  }

  return (
    <CookiesProvider>
      <Provider store={store}>
        <PersistGate loading={<AppLoading />} onBeforeLift={onBeforeLift} persistor={persistor}>
          <AxiosInterceptor>
            <App />
            <Component {...pageProps} />

            <link
              rel='stylesheet'
              href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css'
              integrity='sha512-MV7K8+y+gLIBoVD59lQIYicR65iaqukzvf/nwasF0nqhPay5w/9lJmVM2hMDcnK1OnMGCdVK+iQrJ7lzPJQd1w=='
              crossOrigin='anonymous'
              referrerPolicy='no-referrer'
            />
            <link
              href='https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200'
              rel='stylesheet'
            />
            <Script
              src='https://t1.kakaocdn.net/kakao_js_sdk/2.1.0/kakao.js'
              integrity='sha384-OfbOqPoV2XcfZpqrLgqYCNSNBJW4JU/lLrtKk0cpkWvCrDRotHaQ9SSMGeP7u8NB'
              crossOrigin='anonymous'
              onLoad={kakaoInit}></Script>
          </AxiosInterceptor>
        </PersistGate>
      </Provider>
    </CookiesProvider>
  );
}
