
import * as amplitude from '@amplitude/analytics-browser';
import { redirect, useNavigate } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { response } from 'msw';
import { useAuthenticated } from 'ra-core';
import { useEffect, useState } from 'react';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import * as Sentry from '@sentry/react';
import { useNotify } from "react-admin";
import { setCookie, getCookie, removeCookie } from './cookie';
import { getApi } from './utils/apiUtils';


// TypeScript users must reference the type: `AuthProvider`
export const authProvider = {
    login: ({ username, password }:any) => {
      
      if (username.length>20 || password.length>20) {
        return Promise.reject('아이디/패스워드는 20자까지 입력할 수 있습니다.');
      }
      // const usernameRegex = /^[A-Za-z][A-Za-z0-9]{6,19}$/;
      // const passwordRegex = /^[A-Za-z][A-Za-z0-9!@#$%^&*()]{6,19}$/;
      // if (!usernameRegex.test(username)){
      //   return Promise.reject('아이디는 영어, 숫자만 가능합니다.')
      // }
      // if (!passwordRegex.test(password)){
      //   return Promise.reject('패스워드는 영어, 숫자, 특수문자(!@#$%^&*)만 가능합니다.')
      // }
      
      var api ='';
      if (process.env.NODE_ENV === 'development'){
        api = `${import.meta.env.VITE_REACT_APP_LOCAL_SERVER}`
      }
      else if (process.env.NODE_ENV === 'production'){
        api = `${process.env.VITE_REACT_APP_AWS_SERVER}`
        amplitude.track("Login");
        amplitude.setUserId(username)
      }
      return fetch(`${api}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify({ username, password })
      })
      .then((response) => {
        if (response.status === 200) {
          sessionStorage.setItem("username", username);
          return response.json().then((data) => {
            if (data.isFirst) {
              localStorage.setItem('isFirst', 'true')
              return Promise.resolve({ redirectTo: '/userprofile' });
            } else {
              localStorage.setItem('isFirst', 'false')
              return Promise.resolve({ redirectTo: '/home' });
            }
          })
        } else {
          throw new Error ('로그인에 실패했습니다.');
        }
      })
      .catch((error) => {
        console.error('로그인 에러:', error);
        Sentry.captureException(error);
        throw error;
      });
    },
    // called when the user clicks on the logout button
    logout: () => {

      var api ='';
      if (process.env.NODE_ENV === 'development'){
        api = `${import.meta.env.VITE_REACT_APP_LOCAL_SERVER}`
      }
      else if (process.env.NODE_ENV === 'production'){
        api = `${process.env.VITE_REACT_APP_AWS_SERVER}`
        amplitude.track("Logout");
      }
      
      getApi(api, '/api/logout')

      removeCookie('username')
      removeCookie('access')
      removeCookie('refresh')
      return Promise.resolve();
    },
    // called when the API returns an error
    checkError: ({ status }: any) => {
      if (status === 401 || status === 403) {
        localStorage.removeItem("username");
        return Promise.reject();
      }
      return Promise.resolve();
    },
    // called when the user navigates to a new location, to check for authentication
    checkAuth: () => {
      //const navigate = useNavigate()
      if (!getCookie('username')) {
        return Promise.reject();
      } 
      // else if (localStorage.getItem('isFirst')==='true') {
      //   if (window.location.pathname === '/login') {
      //     window.location.href= `/userprofile`
      //   }
      //   return Promise.resolve({ redirectTo: '/userprofile' });
      // }
      else {
        if (window.location.pathname === '/login') {
          window.location.href= `/home`
          return Promise.resolve({ redirectTo: '/home'})
        }
        //window.location.href= `/home`
        return Promise.resolve();
      }
    }, 
    // called when the user navigates to a new location, to check for permissions / roles
    getPermissions: () => Promise.resolve(),
    getIdentity: () => {
          return Promise.resolve({
              fullName: getCookie('username'),
          });
      },
    
  };