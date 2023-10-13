import { Box, Button } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react'
import { getCookie } from '../cookie';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { CounterState, SET_CHAT_SELECTED_TEXT, SET_PAPERS_IN_STORAGE } from '../reducer';
import { getApi, refreshApi } from '../utils/apiUtils';
import { SET_PAGE, useNotify } from 'react-admin';
import { useNavigate } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import Chat from '../component/chat'
import { error } from 'console';

type paperInfo = {
  paperId: string;
  paperItems: any
}

const Reader = () => {
  const api: string = useSelector((state: CounterState) => state.api)
  const workspaceId = Number(sessionStorage.getItem("workspaceId"));
  const readerUrl = process.env.NODE_ENV === 'development' ? import.meta.env.VITE_READER_URL : process.env.VITE_READER_URL

  const notify = useNotify()
  const navigate = useNavigate()
  
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const iframeRef2 = useRef<HTMLIFrameElement | null>(null);

  const query = new URLSearchParams(window.location.search);
  const paperId: string = query.get('paperid') || '';

  const [isPdfCompleted, setIsPdfCompleted] = useState<boolean>(false)
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false)
  //const [selectedText, setSelectedText] = useState<string>("")
  const [isMultiplePaper, setIsMultiplePaper] = useState<boolean>(false)
  const [openedPaperNumber, setOpenedPaperNumber] = useState<number>(1)
  const [firstPaperId, setFirstPaperId] = useState<string>("")
  const [secondPaperId, setSecondPaperId] = useState<string>("2310.03745")
  const [isTabClicked, setIsTabClicked] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [data, setData] = useState()
  const [curPageIndex, setCurPageIndex] = useState<number>(0)
  
  const dispatch = useDispatch()

  const receiveIsPdfRender = (e: MessageEvent) => {
    if (e.data.isPdfRender) {
      setIsPdfCompleted(e.data.isPdfRender)
    }
    else if (e.data.selectedText) {
      setIsChatOpen(true)
      dispatch({
        type: SET_CHAT_SELECTED_TEXT,
        data: e.data.selectedText
      })
      //setSelectedText(e.data.selectedText)
    } else if (e.data && e.data.pageIndex >=0) {
      setCurPageIndex(e.data.pageIndex)
    }
  }
  window.addEventListener('message', receiveIsPdfRender)

  useEffect(()=>{
    if (isPdfCompleted) {
      getApi(api, `/api/paper/${paperId}?workspaceId=${workspaceId}`) 
        .then(response => {
            if (response.status === 200) {
                return response.json().then(data => {
                  setData(data)
                  if (iframeRef && iframeRef.current && iframeRef.current.contentWindow) {
                    iframeRef.current.contentWindow.postMessage({ 
                      workspaceId: workspaceId,
                      access: getCookie('access'),
                      refresh: getCookie('refresh'),
                      paperId: paperId,
                      paperItems: data.paperInfo.paperItems,
                    }, '*');
                    setFirstPaperId(paperId)
                  }
                })
            } else if (response.status === 401) {
                refreshApi(api, notify, navigate)
              }
            throw new Error("논문 정보를 가져오는데 실패하였습니다")
        })
      setIsLoading(false)
      getApi(api, `/api/container?workspaceId=${workspaceId}`)
      .then(response => 
        {
          if (response.status === 200) {
            return response.json().then(data => {
              dispatch({
                type: SET_PAPERS_IN_STORAGE,
                data: data
              })
            })
          } else if (response.status === 401) {
            refreshApi(api, notify, navigate)
          }
        })
      
      .catch(error => {
        console.error('관심 논문 정보를 불러오는데 실패하였습니다: ', error)
        Sentry.captureException(error)
      })
    }
  }, [isPdfCompleted])

  useEffect(()=>{
    if (isTabClicked){
      getApi(api, `/api/paper/${openedPaperNumber=== 1 ? firstPaperId : secondPaperId}?workspaceId=${workspaceId}`) 
        .then(response => {
            if (response.status === 200) {
                return response.json().then(data => {
                  let iframeRefNum = openedPaperNumber === 1 ? iframeRef : iframeRef2

                  if (iframeRefNum && iframeRefNum.current && iframeRefNum.current.contentWindow) {
                    iframeRefNum.current.contentWindow.postMessage({
                      paperId: openedPaperNumber=== 1 ? firstPaperId : secondPaperId,
                      paperItems: data.paperInfo.paperItems,
                    }, '*');
                  }
                })
            } else if (response.status === 401) {
                refreshApi(api, notify, navigate)
              }
            throw new Error("논문 정보를 가져오는데 실패하였습니다")
        })
      setIsTabClicked(false)
    }
  }, [isTabClicked])

  const handleClickTab1 = () => {
    if (openedPaperNumber === 2) {
      setOpenedPaperNumber(1)
      setIsTabClicked(true)
    }
  }

  const handleClickTab2 = () => {
    if (openedPaperNumber === 1){
      setOpenedPaperNumber(2)
      setIsTabClicked(true)
    }
  }

  const tabHeight = 5

  return (
    <div>
      <Box sx={{height: '100vh'}}>
        <Box sx={{height: `${tabHeight}%`}}>
          {isMultiplePaper ?<Button disabled>
            Tap1
          </Button>:
          <Box>
            <Button onClick={handleClickTab1}> Tab1 </Button>
            <Button onClick={handleClickTab2}> Tab2 </Button>
          </Box>}
        </Box>
        <Box >
          {!isLoading && (<Chat isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} 
                              data={data} paperId={paperId}
                              iframeRef={iframeRef} iframeRef2={iframeRef2} openedPaperNumber={openedPaperNumber}
                              curPageIndex={curPageIndex}
                              paperTitle={data && data?.paperInfo?.title}
                              />)}
        </Box>
        <Box sx={{height: `${100-tabHeight}%`}}> 
          {openedPaperNumber === 1
          ?<iframe src={readerUrl} width="100%" height="100%" ref={iframeRef}></iframe>
          :<iframe src={readerUrl} width="100%" height="100%" ref={iframeRef2}></iframe>}
        </Box>
      </Box>
    </div>
  )
}

export default Reader