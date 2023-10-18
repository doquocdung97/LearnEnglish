/* eslint-disable func-names */
import axios from 'axios';
import {Config} from '../constants';
import { getTokenFromStorage } from './utils';

const BASE_URL = Config.MIDDLEWARE_ENDPOINT;

const request = axios.create({
  baseURL: BASE_URL,
  timeout: 60000, // Waiting 1m for request timeout
  headers: {
    'Cache-Control': 'no-cache',
  },
});
request.interceptors.request.use(config => {
  const token = getTokenFromStorage();
  const accessToken = token?.accessToken;
  if (accessToken && config.headers) {
    // eslint-disable-next-line no-param-reassign
    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  }
  return config;
});

request.interceptors.response.use(
  function (res) {
    return res?.data;
  },
  function (error) {
    if (error.response.status === 401) {
      // const clearLSEvent = new Event('clearLS');
      // LocalStorageEventTarget.dispatchEvent(clearLSEvent);
    }
    return Promise.reject(error);
  },
);

export { request };
