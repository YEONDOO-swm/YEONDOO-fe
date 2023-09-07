import React, { useEffect } from 'react'
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
import { useGoogleLogin } from '@react-oauth/google';
import { Button } from '@mui/material';

export const Login = () => {
    var api = '';
    if (process.env.NODE_ENV === 'development'){
      api = `${import.meta.env.VITE_REACT_APP_LOCAL_SERVER}`
    }
    else if (process.env.NODE_ENV === 'production'){
      api = `${process.env.VITE_REACT_APP_AWS_SERVER}`
    }

    const login = useGoogleLogin({
        onSuccess: tokenResponse => {
            console.log(tokenResponse)
            fetch(`${api}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type' : 'application/json' },
                body: JSON.stringify(tokenResponse)
            })
            .then((response) => {
                console.log(response);
              })
            .catch(error => {
                console.log(error)
            })
        },
        onError: (errorResponse) => {
        console.error(errorResponse);
        },
        flow: "auth-code",
        //cookiePolicy: 'single_host_origin'
      });
  return (
    <React.Fragment>

        {/* <GoogleOAuthProvider clientId="499303710660-ps4rmdcpmci178dbaqro07ial11bevlj.apps.googleusercontent.com">
            <GoogleLogin
                buttonText="google"
                onSuccess={credentialResponse => {
                    console.log(credentialResponse);
                }}
                onError={() => {
                    console.log('Login Failed');
                }}
                cookiePolicy={'single_host_origin'}
                />
        </GoogleOAuthProvider> */}

        <Button variant='contained' onClick={() => login()} >
            구글로 로그인하기
        </Button>

    </React.Fragment>
  )
}