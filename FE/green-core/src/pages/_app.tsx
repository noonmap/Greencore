import { Provider } from 'react-redux';
import type { AppProps } from 'next/app';
import '@/styles/tailwind.css';
import '@/styles/globals.scss';
import 'react-loading-skeleton/dist/skeleton.css';
import 'toastify-js/src/toastify.css';

import store from '@/core/store';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}
