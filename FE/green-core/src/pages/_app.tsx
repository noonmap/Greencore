import { Provider } from 'react-redux';
import { CookiesProvider } from 'react-cookie';
import type { AppProps } from 'next/app';
import { PersistGate } from 'redux-persist/integration/react';

import { useEffect } from 'react';
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
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);

  useEffect(() => {
    if (getCookieToken()) dispatch(getAccessToken());

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

    // console.log('%c  😀 Welcome To GREEN-CORE!  ', styles);

    // console.group("일해라일조");
    // console.log("그룹 메시지");
    // console.groupEnd();

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
