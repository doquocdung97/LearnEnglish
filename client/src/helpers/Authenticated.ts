import { Variables } from '../constants';
import { isEmptyObject } from '../common/utils';

export const saveAccessToken = ({ accessToken, expiredTime }:any) => {
  const normalDate = expiredTime ? new Date(expiredTime).toLocaleString('vi-VN', { timeZone: 'UTC' }) : null;
  const storedToken = {
    accessToken,
    expiredTime,
    dateTime: normalDate,
  };
  localStorage.setItem(Variables.TOKEN_KEY, JSON.stringify(storedToken));
};

export const getAccessTokenFromStorage = () => {
  const data = localStorage.getItem(Variables.TOKEN_KEY)
  if (data)
    return JSON.parse(data);
  return null
};

export const removeAccessToken = () => {
  localStorage.removeItem(Variables.TOKEN_KEY);
};

export const checkAuthenticated = () => {
  const token = getAccessTokenFromStorage();

  if (isEmptyObject(token)) return false;

  if (!token?.accessToken) return false;

  const timeNow = new Date().getTime();
  if (timeNow >= token?.expiredTime) return false;

  return true;
};

export const LocalStorageEventTarget = new EventTarget();