import * as amplitude from '@amplitude/analytics-browser';
import { useNavigate } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { response } from 'msw';
import { useAuthenticated } from 'ra-core';
import { useEffect, useState } from 'react';
import { Routes, Route, BrowserRouter } from "react-router-dom";

// TypeScript users must reference the type: `AuthProvider`
export const authProvider = {
  
    login: ({ username, password }:any) => {
      var api;
      if (process.env.NODE_ENV === 'development'){
        //api = `/api/login`
        // api =`${process.env.REACT_APP_LOCAL_SERVER}/login`
        api = `${import.meta.env.VITE_REACT_APP_LOCAL_SERVER}/login`
      }
      else if (process.env.NODE_ENV === 'production'){
        api = `${import.meta.env.REACT_APP_AWS_SERVER}/login`
      }
      return fetch(api, {
        method: 'POST',
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify({ username, password })
      })
      .then((response) => {
        if (response.status === 200) {
          sessionStorage.setItem("username", username);
          if (localStorage.getItem('userprofile')) {
            return { redirectTo: '/'}
          }
          return { redirectTo: '/userprofile' };
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
      amplitude.track("Login Page Viewed");
      sessionStorage.removeItem('username');
      return Promise.resolve();
    },
    // called when the API returns an error
    checkError: ({ status }: any) => {
      if (status === 401 || status === 403) {
        return Promise.reject();
      }
      return Promise.resolve();
    },
    // called when the user navigates to a new location, to check for authentication
    checkAuth: () => {
      //const navigate = useNavigate()
      const history = createBrowserHistory();
      if (!sessionStorage.getItem('username')) {
        return Promise.reject();
      } 
      else if (!localStorage.getItem('userprofile')) {

        return Promise.resolve({ redirectTo: '/userprofile'})
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
