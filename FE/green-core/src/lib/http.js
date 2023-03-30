import axios from 'axios';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getCookieToken } from './cookies';
import { useAppSelector } from '@/core/hooks';

const serverUrl = process.env.NODE_ENV == 'production' ? process.env.APP_SERVER_URL : 'http://localhost:3000';
const testUrl = 'http://localhost:8080';

const instance = axios.create({
  // baseURL: serverUrl + '/api',
  baseURL: testUrl + '/api',
  // timeout: 1000,

  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
    'Access-Control-Allow-Headers': '*',
    // 'X-CSRF-Token, X-Requested-With, X-Refresh-Token, Authorization, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
    // 'Access-Control-Expose-Headers': '*',
  },

  withCredentials: true,
});

const AxiosInterceptor = ({ children }) => {
  const router = useRouter();
  const accessToken = useAppSelector((state) => state.user.accessToken);

  useEffect(() => {
    const reqInterceptor = async (config) => {
      console.log('cnofig', config.headers);

      if (accessToken != null) {
        console.log(getCookieToken(), accessToken);
        config.headers['Content-Type'] = 'application/json; charset=utf-8';
        config.headers['X-Refresh-Token'] = getCookieToken();
        config.headers['Authorization'] = accessToken;
      }
      return config;
    };

    const resInterceptor = (response) => {
      return response;
    };

    const errInterceptor = (error) => {
      if (error.response.status === 401) {
        router.push('/login');
      }

      if (error.response.status == 404) {
        console.log('hi 404');
        // router.push('/login');
      }

      return Promise.reject(error);
    };

    const requestInterceptor = instance.interceptors.request.use(reqInterceptor);
    const responseInterceptor = instance.interceptors.response.use(resInterceptor, errInterceptor);

    return () => {
      instance.interceptors.request.eject(requestInterceptor);
      instance.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken]);
  return children;
};

export default instance;
export { AxiosInterceptor };
