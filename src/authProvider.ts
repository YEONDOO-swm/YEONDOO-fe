import * as amplitude from '@amplitude/analytics-browser';
import { response } from 'msw';
import { useAuthenticated } from 'ra-core';
import { useEffect, useState } from 'react';

// TypeScript users must reference the type: `AuthProvider`
export const authProvider = {
    // called when the user attempts to log in
    // login: ({ username }: any) => {
    //   localStorage.setItem("username", username);
    //   // accept all username/password combinations
    //   return Promise.resolve({ redirectTo: '/userprofile'});
    // },
    isLoggedIn: false,

    login: ({ username, password }:any) => {
      return fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify({ username, password })
      })
      .then((response) => {
        if (response.status === 200) {
          authProvider.isLoggedIn = true;
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
      authProvider.isLoggedIn = false;
      return Promise.resolve();
    },
    // called when the API returns an error
    checkError: ({ status }: any) => {
      if (status === 401 || status === 403) {
        authProvider.isLoggedIn = false;
        return Promise.reject();
      }
      return Promise.resolve();
    },
    // called when the user navigates to a new location, to check for authentication
    checkAuth: () => {
      console.log("check auth!!");
      if (authProvider.isLoggedIn) {
        return Promise.resolve();
      } else {
        return Promise.reject({ redirectTo: '/login' });
      }
    },
    
    // called when the user navigates to a new location, to check for permissions / roles
    getPermissions: () => Promise.resolve(),
    
  };



// export const authProvider = {
    // login: ({ username, password }:any) => {
    //     return fetch('/api/login', {
    //       method: 'POST',
    //       headers: { 'Content-Type' : 'application/json' },
    //       body: JSON.stringify({ username, password })
    //     })
    //     .then((response) => {
    //       if (response.status === 200) {
    //         return { redirectTo: '/userprofile' };
    //       } else {
    //         throw new Error ('로그인에 실패했습니다.');
    //       }
    //     })
    //     .catch((error) => {
    //       console.error('로그인 에러:', error);
    //       throw error;
    //     });
    // },
//     logout: () => {
//         amplitude.track("Login Page Viewed");
//         return Promise.resolve();
//     },
//     checkError: ({ status }:any) => {
//         return status === 401 || status === 403
//             ? Promise.reject()
//             : Promise.resolve();
//     },
//     checkAuth: () => {
//         return localStorage.getItem('not_authenticated')
//             ? Promise.reject()
//             : Promise.resolve();
//     },
//     getPermissions: () => {
//         const role = localStorage.getItem('role');
//         return Promise.resolve(role);
//     },
    // getIdentity: () => {
    //     return Promise.resolve({
    //         id: localStorage.getItem('login'),
    //         fullName: localStorage.getItem('user'),
    //         // avatar: localStorage.getItem('avatar'),
    //     });
    // },
// };