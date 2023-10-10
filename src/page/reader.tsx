import { Box } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react'
import { getCookie } from '../cookie';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { CounterState } from '../reducer';
import { getApi, refreshApi } from '../utils/apiUtils';
import { useNotify } from 'react-admin';
import { useNavigate } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import Chat from '../component/chat'

const Reader = () => {
  const api: string = useSelector((state: CounterState) => state.api)
  const workspaceId = Number(sessionStorage.getItem("workspaceId"));

  const notify = useNotify()
  const navigate = useNavigate()
  
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const query = new URLSearchParams(window.location.search);
  const paperId: string = query.get('paperid') || '';

  const [isPdfCompleted, setIsPdfCompleted] = useState<boolean>(false)
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false)
  const [selectedText, setSelectedText] = useState<string>("")

  const { data, isLoading } = useQuery(["paperView", api, paperId, workspaceId], 
        ()=> getApi(api, `/api/paper/${paperId}?workspaceId=${workspaceId}`) 
        .then(response => {
            if (response.status === 200) {
                return response.json()
            } else if (response.status === 401) {
                refreshApi(api, notify, navigate)
              }
            throw new Error("논문 내 질의 히스토리 정보를 가져오는데 실패하였습니다")
        }),
        {
            onError: (error) => {
                console.error('논문 정보를 불러오는 데 실패하였습니다:', error)
                Sentry.captureException(error)
            }
        })

  const receiveIsPdfRender = (e: MessageEvent) => {
    if (e.data.isPdfRender) {
      setIsPdfCompleted(e.data.isPdfRender)
    }
    else if (e.data.selectedText) {
      setIsChatOpen(true)
      setSelectedText(e.data.selectedText)
    }
  }
  window.addEventListener('message', receiveIsPdfRender)

  useEffect(()=>{
    if (isPdfCompleted && !isLoading) {
      if (iframeRef && iframeRef.current && iframeRef.current.contentWindow) {
        console.log(Number(sessionStorage.getItem('workspaceId')))
        iframeRef.current.contentWindow.postMessage({ 
          workspaceId: workspaceId,
          access: getCookie('access'),
          refresh: getCookie('refresh'),
          paperId: paperId,
          paperItems: data.paperInfo.paperItems,
        }, '*');
      }
    }
  }, [isPdfCompleted, isLoading])


  return (
    <div>
      <Box sx={{height: '100vh'}}>
        <Box sx={{
            position: 'absolute',
            left: '15vw',
            top: '85vh',
            zIndex: 999, // iframe 위로 보이게 하려면 zIndex 설정
          }}>
          {!isLoading && <Chat isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} 
                              data={data} paperId={paperId} selectedText={selectedText}
                              iframeRef={iframeRef}/>}
        </Box>
        {process.env.NODE_ENV === 'development' && <iframe src={import.meta.env.VITE_READER_URL} width="100%" height="100%" ref={iframeRef}></iframe>}
        {process.env.NODE_ENV === 'production' && <iframe src={process.env.VITE_READER_URL} width="100%" height="100%" ref={iframeRef}></iframe>}
      </Box>
    </div>
  )
}

export default Reader