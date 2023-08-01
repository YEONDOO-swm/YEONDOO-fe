
import * as amplitude from '@amplitude/analytics-browser';
import { redirect, useNavigate } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { response } from 'msw';
import { useAuthenticated } from 'ra-core';
import { useEffect, useState } from 'react';
import { Routes, Route, BrowserRouter } from "react-router-dom";


// TypeScript users must reference the type: `AuthProvider`
export const authProvider = {
    login: ({ username, password }:any) => {
      
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
            console.log(data['isFirst'])
            if (data.isFirst) {
              localStorage.setItem('isFirst', 'true')
              return Promise.resolve({ redirectTo: '/userprofile' });
            } else {
              localStorage.setItem('isFirst', 'false')
              return Promise.resolve({ redirectTo: '/' });
            }
          })
        } else {
          throw new Error ('로그인에 실패했습니다.');
        }
      })
      .catch((error) => {
        console.error('로그인 에러:', error);
        throw error;
      });
    },
    // called when the user clicks on the logout button
    logout: () => {
      // const amp = async () => {
      //   await amplitude.track("Logout");
      //   await amplitude.reset()
      // }
      // amp()
      if (process.env.NODE_ENV === 'production'){
        amplitude.track("Logout");
      }
      sessionStorage.removeItem('username');
      //amplitude.reset()
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
      if (!sessionStorage.getItem('username')) {
        return Promise.reject();
      } 
      else if (localStorage.getItem('isFirst')==='true') {
        return Promise.resolve({ redirectTo: '/userprofile' });
      }
      else {
        return Promise.resolve();
      }
    }, 
    // called when the user navigates to a new location, to check for permissions / roles
    getPermissions: () => Promise.resolve(),
    getIdentity: () => {
          return Promise.resolve({
              fullName: sessionStorage.getItem('username'),
          });
      },
    
  };