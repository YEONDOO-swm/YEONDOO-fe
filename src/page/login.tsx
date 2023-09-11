import React, { useEffect } from 'react'
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'
//import { jwt_decode } from 'jwt-decode'
import { useGoogleLogin } from '@react-oauth/google';
import { Box, Button, Card, Paper, Typography } from '@mui/material';
import { color } from '../layout/color'
import { setCookie, getCookie, removeCookie } from '../cookie';

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

            const payload = {
                authCode: tokenResponse.code
            }
            fetch(`${api}/api/login/google`, {
                method: 'POST',
                headers: { 'Content-Type' : 'application/json' },
                body: JSON.stringify(payload)
            })
            .then((response) => {
                let jwtToken = response.headers.get("X_auth_token")
                console.log(jwtToken)
                if (jwtToken) {
                    setCookie('jwt', jwtToken)
                }
                return response.json()
            })
            .then(data => {
                console.log(data)
                //sessionStorage.setItem('username', data.jwt)
                setCookie('username', data.username)
                
                //window.location.href = "/home"
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
                redirect_uri='postmessage'
                />
        </GoogleOAuthProvider> */}
        <Box sx={{height: '100vh', display:'flex', justifyContent: 'center', alignItems:"center", backgroundColor: color.mainGreen}}>
            <Card sx={{height: '18vh', width: '40vh', backgroundColor: 'white', borderRadius: '13px', p:3}}>
                <Typography variant="h4" sx={{fontWeight: 'bold', textAlign: 'center', mb: 2}}>
                    Login
                </Typography>
                <Box sx={{ width: '100%', display: 'flex', alignItems: 'center'}}>
                    <Paper variant='outlined' sx={{width: '100%', p:1, display: 'flex', alignItems: 'center', "&:hover": {bgcolor: color.secondaryGrey}}} onClick={()=>login()}>
                        <img src='https://static-00.iconduck.com/assets.00/google-icon-2048x2048-czn3g8x8.png' width="20px" height="20px"></img>
                        <Typography sx={{ml: 1}}>구글로 로그인하기</Typography>
                    </Paper>
                </Box>
                {/* <Button variant='contained' onClick={() => login()} >
                    구글로 로그인하기
                </Button> */}
            </Card>
        </Box>

    </React.Fragment>
  )
}