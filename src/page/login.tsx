import React, { FC, useEffect } from 'react'
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'
//import { jwt_decode } from 'jwt-decode'
import { useGoogleLogin } from '@react-oauth/google';
import { Box, Button, Card, Paper, Typography } from '@mui/material';
import { color } from '../layout/color'
import { setCookie, getCookie, removeCookie } from '../cookie';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { CounterState } from '../reducer';
import { useNotify } from 'react-admin';

var api: string = '';

type loginPayload = {
    authCode: string;
}

export const Login = () => {
    const api: string = useSelector((state: CounterState) => state.api)

    const notify = useNotify()

    const { mutate } = useMutation(
        (value: loginPayload) => fetch(`${api}/api/login/google`, {
            method: 'POST',
            headers: { 'Content-Type' : 'application/json' },
            body: JSON.stringify(value)
        }),
        {
            onSuccess: (data) => {
                const response = data

                if (response.status === 401) {
                    notify('Invalid user')
                    console.log("유효하지 않음")
                    return
                } else if (response.status === 500) {
                    console.log("서버 에러")
                    return
                }
                let jwtToken: string | null = response.headers.get('Gauth')
                let refreshToken: string | null = response.headers.get('refresh')

                if (jwtToken) {
                    setCookie('access', jwtToken)
                }

                if (refreshToken) {
                    setCookie('refresh', refreshToken)
                }

                response.json().then((data)=> {
                    setCookie('username', data.username)
                    window.location.href = "/workspaces"
                }).catch(error => console.log(error))
            }
        }
    )
    const login = useGoogleLogin({
        onSuccess: async tokenResponse => {
            const payload: loginPayload = {
                authCode: tokenResponse.code
            }
            mutate(payload)
        },
        onError: (errorResponse: unknown) => {
            console.error(errorResponse);
        },
        flow: "auth-code",
        redirect_uri: 'postmessage'
        //cookiePolicy: 'single_host_origin'
      });
  return (
    <React.Fragment>
        <Box sx={{height: '100vh', display:'flex', justifyContent: 'center', alignItems:"center", backgroundColor: color.mainGreen}}>
            <Box sx={{height: '18vh', width: '50vh', borderRadius: '13px', p:3}}>
                <Box sx={{fontWeight: '500', textAlign: 'center', fontSize: '3.5vh', color: color.appbarGreen}}>
                    Your research assistant,
                </Box>
                <Box sx={{fontWeight: 'bold', textAlign: 'center', mb: 2, fontSize: '3.5vh'}}>
                    Yeondoo
                </Box>
                <Box sx={{ width: '100%', display: 'flex', alignItems: 'center'}}>
                    <Paper variant='outlined' sx={{width: '100%', p:1, display: 'flex', alignItems: 'center', "&:hover": {bgcolor: color.secondaryGrey}}} onClick={()=>login()}>
                        <img src='https://static-00.iconduck.com/assets.00/google-icon-2048x2048-czn3g8x8.png' width="20px" height="20px" style={{marginLeft: '1vh'}}></img>
                        <Typography sx={{textAlign: 'center', width: '100%', fontWeight: '400', fontSize: '2vh'}}>Google Login</Typography>
                    </Paper>
                </Box>
            </Box>
        </Box>

    </React.Fragment>
  )
}