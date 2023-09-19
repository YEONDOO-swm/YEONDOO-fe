import * as React from "react";
import { Card, CardContent, Typography, Box } from '@mui/material';
import { Title, useAuthenticated, useNotify } from 'react-admin';
import { useEffect, useState } from "react";
import * as amplitude from '@amplitude/analytics-browser';
import { UserProfileCheck } from "../component/userProfileCheck";
import { SearchTap } from "../component/searchTap";
import { Link, useNavigate } from 'react-router-dom';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import styles from '../layout/hoverButton.module.css'
import { HistoryNav } from "../component/historyNav";
import loadingStyle from "../layout/loading.module.css"
import scrollStyle from "../layout/scroll.module.css"
import { color } from "../layout/color";
import { S } from "msw/lib/glossary-de6278a9";
import MetaTag from "../SEOMetaTag";
import * as Sentry from '@sentry/react';
import { getCookie, setCookie } from "../cookie";
import { useSelector } from "react-redux";
import { CounterState } from "../reducer";
import { useQuery } from "react-query";

type historySearchType = {
    results: resultType[]
}

type resultType = {
    query: string;
    rid: number;
}

export const History = () => {
    useAuthenticated();

    const api: string = useSelector((state: CounterState) => state.api)

    const workspaceId = Number(sessionStorage.getItem('workspaceId'));
    const navigate = useNavigate()
    const notify = useNotify()

    const {data: results, isLoading} = useQuery(["historySearch", workspaceId], ()=>
        fetch(`${api}/api/history/search?workspaceId=${workspaceId}`, {
        headers: {
            "Gauth": getCookie('jwt')
        }
        }).then(response => {
            if (response.status === 200) {
                return response.json()
            } else if (response.status === 401) {

                fetch(`${api}/api/update/token`, {
                  headers: { 
                    'Refresh' : getCookie('refresh') 
                  }
                }).then(response => {
                  if (response.status === 401) {
                    navigate('/login')
                    notify('Login time has expired')
                    throw new Error('로그아웃')
                  }
                  else if (response.status === 200) {
                    let jwtToken: string | null = response.headers.get('Gauth')
                    let refreshToken: string | null = response.headers.get('RefreshToken')
    
                    if (jwtToken) {
                        setCookie('access', jwtToken)
                    }
    
                    if (refreshToken) {
                        setCookie('refresh', refreshToken)
                    }
                  }
                })
                
              }
            throw new Error("히스토리 정보를 가져오는데 실패하였습니다")
        })
        .then(data => data.results),
        {   
            onError: (error) => {
                console.error('히스토리 정보를 가져오는데 실패하였습니다: ', error)
                Sentry.captureException(error)
            }
        })


    const handleResultClick = (event: Event | undefined, resultQuery: string) => {
        if (event !== undefined) {
            event.preventDefault();
        }
        if (process.env.NODE_ENV === 'production') {
            
            amplitude.track("전체 검색 히스토리 List Clicked")
        }
        navigate(`/home?query=${resultQuery}&type=1`)
    }
    
    return (

    <div>
        <MetaTag title="History - Yeondoo" description="사용자가 전체 검색했던 내용을 보고, 찾을 수 있습니다." keywords="히스토리, 검색결과, 검색, 전체검색, history, yeondoo, 연두"/>
        <Title title="History"/>
        <Box sx={{height: 50}}></Box>
        {isLoading?(
            <Box sx={{ height: '80vh'}} className={loadingStyle.loading}>
                <HistoryNav page="totalSearch" />
                <Box sx={{ m: 2, p: 1}}>
                    <Card sx={{ p: 2, height: '20vh', backgroundColor: color.loadingColor, opacity: '0.2'}}></Card>                  
                </Box>
                
            </Box>
        ):(
        <Box sx={{ height: '80vh'}}>
            <HistoryNav page="totalSearch" />
            <Box sx={{  m: 2, p:1, height: '75vh', overflowY: 'scroll'}} className={scrollStyle.scrollBar}>
                 
                {results && results.map((result: any) => (
                    <Card key={result.rid} sx={{ p:2, mb: 1}}>
                        <Box onClick={()=>handleResultClick(event, result.query)} sx={{ display: 'flex', alignItems: 'flex-start'}}>
                            <ContactSupportIcon sx={{mr:1}}/>
                            <Typography sx={{cursor: 'pointer'}}> {result.query} </Typography>
                        </Box>
                    </Card>
                ))}
                
            </Box>
            
        </Box>
        )}
    </div>
)};
