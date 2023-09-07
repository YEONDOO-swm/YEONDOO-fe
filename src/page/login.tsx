import React, { useEffect } from 'react'
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'
//import { jwt_decode } from 'jwt-decode'
import { useGoogleLogin } from '@react-oauth/google';
import { Box, Button, Typography } from '@mui/material';
import { color } from '../layout/color'

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
            
            console.log(tokenResponse.code)

            const payload = {
                authCode: tokenResponse.code
            }
            fetch(`${api}/api/login/google`, {
                method: 'POST',
                headers: { 'Content-Type' : 'application/json' },
                body: JSON.stringify(payload)
            })
            .then((response) => response.json())
            .then(data => {
                console.log(data)
            })
            .catch(error => {
                console.log(error)
            })
        },
        onError: (errorResponse) => {
        console.error(errorResponse);
        },
        flow: "auth-code",
        redirect_uri: 'postmessage'
        //cookiePolicy: 'single_host_origin'
      });
  return (
    <React.Fragment>

        <GoogleOAuthProvider clientId="499303710660-ps4rmdcpmci178dbaqro07ial11bevlj.apps.googleusercontent.com">
            <GoogleLogin
                buttonText="google"
                onSuccess={credentialResponse => {
                    console.log(credentialResponse);
                }}
                onError={() => {
                    console.log('Login Failed');
                }}
                cookiePolicy={'single_host_origin'}
                redirect_uri='postmessage'
                />
        </GoogleOAuthProvider>
        <Box sx={{height: '100vh', display:'flex', justifyContent: 'center', alignItems:"center", backgroundColor: color.mainGreen}}>
            <Box sx={{height: '30vh', width: '40vh', backgroundColor: 'white', borderRadius: '13px', p:3}}>
                <Typography variant="h4" sx={{fontWeight: 'bold'}}>
                    Login
                </Typography>
                {/* <Box sx={{border: '1px solid'}} onClick={()=>login()}>
                    구글로 로그인하기
                </Box> */}
                <Button variant='contained' onClick={() => login()} >
                    구글로 로그인하기
                </Button>
            </Box>
        </Box>

    </React.Fragment>
  )
}