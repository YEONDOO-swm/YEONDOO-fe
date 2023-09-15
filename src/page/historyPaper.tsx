import { Typography, Box, Card } from '@mui/material';
import { Title, useAuthenticated, useNotify } from 'react-admin';
import { useEffect, useState } from 'react';
import { UserProfileCheck } from "../component/userProfileCheck";
import { HistoryNav } from '../component/historyNav';
import loadingStyle from "../layout/loading.module.css"
import scrollStyle from "../layout/scroll.module.css"
import { color } from "../layout/color";
import * as amplitude from '@amplitude/analytics-browser';
import MetaTag from '../SEOMetaTag';
import { Link, useNavigate } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import { getCookie } from '../cookie';
import { useSelector } from 'react-redux';
import { CounterState } from '../reducer';
import { useQuery } from 'react-query';

type paperHistory = {
  paperId: string;
  who: boolean;
  content: string;
  title: string;
  url: string;
}

type paperHistoryPair = {
  id: number;
  content: string;
  title: string;
  who: boolean;
  paperId: string;
}

export const HistoryPaper = () => {
    useAuthenticated();

    const api: string = useSelector((state: CounterState) => state.api)

    const workspaceId: number = Number(sessionStorage.getItem('workspaceId'));

    const navigate = useNavigate()
    const notify = useNotify()

    const { data: searchHistory, isLoading } = useQuery(["historyPaper", workspaceId]
    , ()=>fetch(`${api}/api/history/search/paper?workspaceId=${workspaceId}`,{
      headers: {
        "Gauth": getCookie('jwt')
    }
    }).then(response => {
      if (response.status === 200) {
          return response.json()
      } else if (response.status === 401) {
          navigate('/login')
          notify('Login time has expired')
          throw new Error('로그아웃')
      }
      throw new Error("논문 내 질의 히스토리 정보를 가져오는데 실패하였습니다")
  }), {
      onError: (error) => {
        console.error('논문 내 질의 히스토리 정보를 가져오는데 실패하였습니다: ', error)
        Sentry.captureException(error)
      }
    })

    useEffect(() => {
        if (process.env.NODE_ENV === 'production') {
            amplitude.track("논문 내 질의 히스토리 Page Viewed")
        }

    }, [])
    return (
        <Box>
            <MetaTag title="History - Yeondoo" description="사용자가 했던 모든 논문 내 질의를 보고, 찾을 수 있습니다." keywords="히스토리, 논문, 논문 내 질의, AI, AI와 함께 논문읽기, history"/>
            <Title title="History" />
            <Box sx={{height: 50}}></Box>
            {isLoading?(
                <Box sx={{ height: '80vh'}} className={loadingStyle.loading}>
                <HistoryNav page="historyInPaper" />
                <Box sx={{ m: 2, p:1, height: '75vh'}}>
                    <Card sx={{ p: 2, mb: 1, height: '15vh', backgroundColor: color.loadingColor, opacity: '0.2'}}></Card>                  
                    <Card sx={{ p: 2, mb: 1, height: '15vh', backgroundColor: color.loadingColor, opacity: '0.2'}}></Card>                  
                </Box>
                
            </Box>
            ):(
                <Box sx={{ height: '80vh' }}>
  <HistoryNav page="historyInPaper" />
  <Box sx={{ m: 2, p:1, height: '75vh', overflowY: 'scroll' }} className={scrollStyle.scrollBar}>
    {searchHistory &&
      searchHistory.reduce((acc: paperHistoryPair[][], item: paperHistory, index: number) => {
        if (index % 2 === 0) {
          const nextItem = searchHistory[index + 1];
          if (nextItem) {
            acc.push([
              {
                id: index,
                content: item.content,
                title: item.title,
                who: item.who,
                paperId: item.paperId
              },
              {
                id: index + 1,
                content: nextItem.content,
                title: nextItem.title,
                who: nextItem.who,
                paperId: nextItem.paperId
              },
            ]);
          } else {
            acc.push([
              {
                id: index,
                content: item.content,
                title: item.title,
                who: item.who,
                paperId: item.paperId
              },
            ]);
          }
        }
        return acc;
      }, []).map((mergedItems: paperHistoryPair[], mergedIndex: number) => (
        <Link to={`/paper?paperid=${mergedItems[0].paperId}`} key={mergedIndex} style={{ textDecoration: 'none', color: 'black' }}>
            <Card  sx={{ p: 2, mb: 1, pt:1 }}>
            
                <Typography sx={{ fontSize: '10px', borderRadius: '20px', p: '0 10px', marginBottom: '5px', backgroundColor: color.secondaryGrey, display: 'inline-block' }}>          
                    {mergedItems[0].title}
                </Typography>
                
                {mergedItems.map((item: paperHistoryPair) => (
                    
                    
                        <Box key={item.id} sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <Box sx={{ mr: 1 }}>
                            {item.who ? <Typography>👤</Typography> : <Typography>🍀</Typography>}
                        </Box>
                        <Typography> {item.content} </Typography>
                        </Box>
                    
                ))}
                
            </Card>
        </Link>
      ))}
  </Box>
</Box>

            )}
        </Box>
    )
}