import { Provider } from 'react-redux';
import type { AppProps } from 'next/app';
import Script from 'next/script';

import '@/styles/tailwind.css';
import '@/styles/globals.scss';
import 'react-loading-skeleton/dist/skeleton.css';
import 'toastify-js/src/toastify.css';
import kakaoConfig from '~/config/kakaoConfig.json';

import store from '@/core/store';

declare global {
	interface Window {
		Kakao: any;
	}
}

export default function App({ Component, pageProps }: AppProps) {
	function kakaoInit() {
		window.Kakao.init(kakaoConfig.apiKey);
		console.log('kakao:', window.Kakao.isInitialized());
	}

	return (
		<Provider store={store}>
			<Component {...pageProps} />
			<Script
				src="https://t1.kakaocdn.net/kakao_js_sdk/2.1.0/kakao.min.js"
				integrity="sha384-dpu02ieKC6NUeKFoGMOKz6102CLEWi9+5RQjWSV0ikYSFFd8M3Wp2reIcquJOemx"
				crossOrigin="anonymous"
				onLoad={kakaoInit}></Script>
		</Provider>
	);
}
