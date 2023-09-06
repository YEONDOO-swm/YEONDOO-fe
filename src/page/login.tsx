import React, { useEffect } from 'react'
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
import { useGoogleLogin } from '@react-oauth/google';
import { Button } from '@mui/material';

export const Login = () => {
    const login = useGoogleLogin({
        onSuccess: tokenResponse => console.log(tokenResponse),
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
                />
        </GoogleOAuthProvider> */}

        <Button variant='contained' onClick={() => login()} >
            구글로 로그인하기
        </Button>

    </React.Fragment>
  )
}