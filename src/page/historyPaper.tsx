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
import { getCookie, setCookie } from '../cookie';
import { useSelector } from 'react-redux';
import { CounterState } from '../reducer';
import { useQuery } from 'react-query';
import PageLayout from '../layout/pageLayout';
import { getApi, refreshApi } from '../utils/apiUtils';
import arrow from '../asset/rightarrow.svg'
import TelegramIcon from '@mui/icons-material/Telegram';
import { useQueryOption } from '../utils/useQueryOption';

type paperHistory = {
  paperId: string;
  who: boolean;
  content: string;
  title: string;
  url: string;
  userPdf: boolean;
}

type paperHistoryPair = {
  id: number;
  content: string;
  title: string;
  who: boolean;
  paperId: string;
  userPdf: boolean;
}

export const HistoryPaper = () => {
    useAuthenticated();

    const api: string = useSelector((state: CounterState) => state.api)

    const workspaceId: number = Number(sessionStorage.getItem('workspaceId'));

    const navigate = useNavigate()
    const notify = useNotify()

    const { data: searchHistory, isLoading } = useQuery(["historyPaper", workspaceId]
    , ()=>getApi(api, `/api/history/search/paper?workspaceId=${workspaceId}`)
    .then(async response => {
      if (response.status === 200) {
          return response.json()
      } else if (response.status === 401) {
          await refreshApi(api, notify, navigate)
      } else {
        throw new Error("논문 내 질의 히스토리 정보를 가져오는데 실패하였습니다")
      }
  }), {
      ...useQueryOption,
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
        <PageLayout workspace={true} number={3}>
            <MetaTag title="History - Yeondoo" description="사용자가 했던 모든 논문 내 질의를 보고, 찾을 수 있습니다." keywords="히스토리, 논문, 논문 내 질의, AI, AI와 함께 논문읽기, history"/>
            <Title title="History" />
            <Typography sx={{fontSize: '25px', fontWeight: '600'}}>
                History
            </Typography>
            <Box sx={{height: 30}}></Box>
            {isLoading?(
                <Box sx={{ height: '80vh'}} className={loadingStyle.loading}>
                
                <Box sx={{height: '75vh'}}>
                    <Box sx={{ p: 2, mb: '15px', height: '15vh', backgroundColor: color.loadingColor, opacity: '0.2', borderRadius: '10px'}}></Box>                  
                    <Box sx={{ p: 2, mb: 1, height: '15vh', backgroundColor: color.loadingColor, opacity: '0.2', borderRadius: '10px'}}></Box>                  
                </Box>
                
            </Box>
            ):(
                (searchHistory && searchHistory.length > 0) ?
                  <Box sx={{ height: '80vh' }}>
                  <Box sx={{height: '75vh', overflowY: 'scroll' }} className={scrollStyle.scrollBar}>
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
                                paperId: item.paperId,
                                userPdf: item.userPdf,
                              },
                              {
                                id: index + 1,
                                content: nextItem.content,
                                title: nextItem.title,
                                who: nextItem.who,
                                paperId: nextItem.paperId,
                                userPdf: nextItem.userPdf,
                              },
                            ]);
                          } else {
                            acc.push([
                              {
                                id: index,
                                content: item.content,
                                title: item.title,
                                who: item.who,
                                paperId: item.paperId,
                                userPdf: item.userPdf,
                              },
                            ]);
                          }
                        }
                        return acc;
                      }, []).map((mergedItems: paperHistoryPair[], mergedIndex: number) => (
                        
                            <Box sx={{ p: '20px', mb: '15px', borderRadius: '10px', border: '1px solid #ddd', boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.05)'}}>
                                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>

                                  <Typography sx={{ color: '#333', fontSize: '18px', marginBottom: 1.5, fontWeight: 600, display: 'inline-block' }}>          
                                      {mergedItems[0].title}
                                  </Typography>
                                  <Box sx={{display: 'flex', transform: 'translateY(-8px)'}} onClick={()=>{window.open(`/paper?workspaceId=${workspaceId}&paperid=${mergedItems[0].paperId}&userPdf=${mergedItems[0].userPdf}`)}}>
                                    <Typography sx={{fontWeight: 500, color: color.mainGreen, cursor: 'pointer', '&:hover':{
                                      color: '#445142'
                                    }}}>Study with AI</Typography>
                                    <img src={arrow}/>
                                  </Box>
                                </Box>
                                
                                {mergedItems.map((item: paperHistoryPair) => (
                                  <Box key={item.id} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 0.7 }}>
                                    <Box>
                                        {item.who ? 
                                        <Box sx={{display: 'flex', p: '2px 6px', justifyContent: 'center', alignItems: 'center',
                                                  borderRadius: '5px', bgcolor: '#999'}}>
                                          <Typography sx={{color: color.white, fontSize: '14px', fontWeight: 600}}>Q</Typography>
                                        </Box> :
                                        <Box sx={{display: 'flex', p: '2px 6px', justifyContent: 'center', alignItems: 'center',
                                        borderRadius: '5px', bgcolor: '#60A253'}}>
                                        <Typography sx={{color: color.white, fontSize: '14px', fontWeight: 600}}>A</Typography>
                                      </Box>}
                                    </Box>
                                    <Typography sx={{color: '#333', fontSize: item.who?'15px':'14px', fontWeight: item.who?600:400, lineHeight: item.who?'normal':'24px'}}> {item.content} </Typography>
                                  </Box>
                                ))}
                                
                            </Box>
                        
                        ))}
                        </Box>
                        </Box>
                : <Box sx={{height: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 2}}>
                    <TelegramIcon sx={{fontSize: '180px'}}/>
                    <Typography sx={{color: '#333', fontSize: '22px', fontWeight: 600}}>No Chat History</Typography>
                  </Box> 
            )}
        </PageLayout>
    )
}