import React, { FC, useEffect, useState } from 'react'
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'
//import { jwt_decode } from 'jwt-decode'
import { useGoogleLogin } from '@react-oauth/google';
import { Box, Button, Card, Paper, Typography, makeStyles, useMediaQuery } from '@mui/material';
import { color } from '../layout/color'
import { setCookie } from '../cookie';
import { useMutation } from 'react-query';
import { useSelector } from 'react-redux';
import { CounterState } from '../reducer';
import { useNotify } from 'react-admin';
import loginIllust from '../asset/login.svg'
import spinner from "../asset/spinner.gif"
import * as amplitude from '@amplitude/analytics-browser';

var api: string = '';

type loginPayload = {
    authCode: string;
}

export const Login = () => {
    const api: string = useSelector((state: CounterState) => state.api)
    const [isLoading, setIsLoading] = useState<boolean>(false)

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
                let refreshToken: string | null = response.headers.get('RefreshToken')

                if (jwtToken) {
                    setCookie('access', jwtToken)
                }

                if (refreshToken) {
                    setCookie('refresh', refreshToken)
                }

                response.json().then((data)=> {
                    setCookie('username', data.username)
                    if (process.env.NODE_ENV === 'production') {
                        amplitude.setUserId(data.username.length < 5 ? data.username + "0000" : data.username)
                        amplitude.track("Login")
                    }
                    window.location.href = "/home"
                })
                .catch(error => console.log(error))
            }
        }
    )
    const login = useGoogleLogin({
        onSuccess: async tokenResponse => {
            setIsLoading(true)
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

    const isMobile = useMediaQuery("(max-width: 1024px)")
  return (
    <React.Fragment>
        {isLoading?
        <Box sx={{display: 'flex', width: '100vw', height: '100vh', justifyContent: 'center', alignItems: 'center'}}>
            <img src={spinner} alt="로딩" width="10%"/>
        </Box>
        :<Box sx={{display: 'flex'}}>
            {!isMobile && <Box sx={{height: '100vh', width: "60%", bgcolor: color.mainGreen,
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    position: 'relative'}}>
                <Box sx={{bgcolor: '#fff', marginTop: '13vh', width: '60vh', height: '60vh',
                 opacity: 0.1, position: 'absolute', borderRadius: '60vh'}}>
                </Box>
                <img src={loginIllust} style={{marginTop: '29vh', zIndex: 2, position: 'relative',
                width: '70vh'}}/>
                <Box sx={{color: '#fff',
                    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                    height: '100%'}}>
                    <Typography sx={{fontSize: '45px', fontWeight: 700, mt: 5}}>Welcome!</Typography>
                    <Typography sx={{fontSize: '15px', fontWeight: 400}}>Experience new paper study with Yeondoo</Typography>
                </Box>
            </Box>}
            <Box sx={{height: '100vh', width: isMobile?"100%":'40%', display:'flex', justifyContent: 'center', alignItems:"center"}}>
                <Box sx={{display: 'inline-flex', padding: '50px 60px', flexDirection: 'column', alignItems: 'center', gap: '25px',
                        borderRadius: '20px', border: '1px solid #ddd', boxShadow: '0px 0px 20px 0px rgba(0, 0, 0, 0.05)'}}>
                    <Box>
                        <Box sx={{fontWeight: '600', textAlign: 'center', fontSize: '2.5vh', 
                        color: color.mainGreen}}>
                            Your research assistant,
                        </Box>
                        <Box sx={{fontWeight: '600', textAlign: 'center', fontSize: '3vh'}}>
                            Yeondoo
                        </Box>
                    </Box>
                    <Paper variant='outlined' sx={{width: '100%', p:1, display: 'flex', alignItems: 'center', "&:hover": {bgcolor: color.secondaryGrey, cursor: 'pointer', backgroundColor: '#f9f9f9'}}} onClick={()=>login()}>
                        <img src='https://static-00.iconduck.com/assets.00/google-icon-2048x2048-czn3g8x8.png' width="20px" height="20px" style={{marginLeft: '1vh'}}></img>
                        <Typography sx={{textAlign: 'center', width: '100%', fontWeight: '500', fontSize: '2vh'}}>Google Login</Typography>
                    </Paper>

                    {/* <Box sx={{width: '100%', p: 1, display: 'flex', alignItems: 'center', "&:hover": {bgcolor: color.secondaryGrey},
                            borderRadius: '8px', border: `2px solid ${color.mainGreen}`}} onClick={()=>login()}>
                        <img src='https://static-00.iconduck.com/assets.00/google-icon-2048x2048-czn3g8x8.png' width="20px" height="20px" style={{marginLeft: '1vh'}}></img>
                        <Typography sx={{textAlign: 'center', width: '100%', fontWeight: '700', fontSize: '2vh',
                                        color: color.mainGreen}}>Google Login</Typography>
                    </Box> */}

                </Box>
            </Box>
        </Box>
    }
    </React.Fragment>
  )
}