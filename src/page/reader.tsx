import { Box, Button, Popper } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react'
import { getCookie } from '../cookie';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { CounterState, SET_ANNOTATIONS, SET_CHAT_SELECTED, SET_IS_UPDATED_DONE, SET_PAPERS_IN_STORAGE, SET_SECOND_PAPER } from '../reducer';
import { getApi, refreshApi } from '../utils/apiUtils';
import { SET_PAGE, useNotify } from 'react-admin';
import { useNavigate } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import Chat from '../component/chat'

type paperInfo = {
  paperId: string;
  paperItems: any
}

const Reader = () => {
  const api: string = useSelector((state: CounterState) => state.api)
  
  const readerUrl = process.env.NODE_ENV === 'development' ? import.meta.env.VITE_READER_URL : process.env.VITE_READER_URL

  const notify = useNotify()
  const navigate = useNavigate()
  
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const iframeRef2 = useRef<HTMLIFrameElement | null>(null);

  const query = new URLSearchParams(window.location.search);
  const paperId: string = query.get('paperid') || '';
  const workspaceId: number = Number(query.get('workspaceId'));

  const [isPdfCompleted, setIsPdfCompleted] = useState<boolean>(false)
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false)
  //const [selectedText, setSelectedText] = useState<string>("")
  const [isMultiplePaper, setIsMultiplePaper] = useState<boolean>(false)
  const [openedPaperNumber, setOpenedPaperNumber] = useState<string>(paperId)
  const [paperInfo, setPaperInfo] = useState<any>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [data, setData] = useState()
  const [curPageIndex, setCurPageIndex] = useState<number>(0)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const secondPaper = useSelector((state: CounterState) => state.secondPaper)
  const dispatch = useDispatch()

  const [proofPayload, setProofPayload] = useState<any>()
  const isUpdatedDone = useSelector((state: CounterState) => state.isUpdatedDone)
  const [prevProofId, setPrevProofId] = useState<string>("")

  const receiveIsPdfRender = (e: MessageEvent) => {
    if (e.data.isPdfRender) {
      setIsPdfCompleted(e.data.isPdfRender)
    }
    else if (e.data.selectedText && e.data.position) {
      setIsChatOpen(true)
      dispatch({
        type: SET_CHAT_SELECTED,
        data: {
          selectedText: e.data.selectedText,
          position: e.data.position
        }
      })
    } else if (e.data && e.data.pageIndex >=0) {
      setCurPageIndex(e.data.pageIndex)
    }
    else if (e.data.annotations) {
      dispatch({
        type: SET_ANNOTATIONS,
        data: e.data.annotations
      })
      navigate('/export')
    }
    else if (e.data.isUpdatedDone) {
      dispatch({
        type: SET_IS_UPDATED_DONE,
        data: true
      })
    }
  }

  useEffect(()=>{
    if (isUpdatedDone && proofPayload) {
      const timeoutId = setTimeout(() => {
        let iframeRefNum = openedPaperNumber === paperId ? iframeRef : iframeRef2;
        if (iframeRefNum && iframeRefNum.current && iframeRefNum.current.contentWindow) {
          iframeRefNum.current.contentWindow.postMessage({
            proof: proofPayload,
            proofId: prevProofId
          }, '*');
        }
        setPrevProofId(proofPayload.id);
        setProofPayload(null);
        dispatch({
          type: SET_IS_UPDATED_DONE,
          data: false
        });
      }, 800);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [isUpdatedDone, proofPayload])

  useEffect(()=>{
    window.addEventListener('message', receiveIsPdfRender, false)
  },[])

  useEffect(()=>{
    if (isPdfCompleted) {
      getApi(api, `/api/paper/${paperId}?workspaceId=${workspaceId}`) 
        .then(response => {
            if (response.status === 200) {
                return response.json().then(data => {
                  setData(data)
                  const firstPayload = {
                    paperId: paperId,
                    paperItems: data.paperInfo.paperItems
                  }
                  sessionStorage.setItem("firstPaper", JSON.stringify(firstPayload))
                  if (iframeRef && iframeRef.current && iframeRef.current.contentWindow) {
                    iframeRef.current.contentWindow.postMessage({ 
                      workspaceId: workspaceId,
                      access: getCookie('access'),
                      refresh: getCookie('refresh'),
                      paperId: paperId,
                      paperItems: data.paperInfo.paperItems,
                    }, '*');
                    setPaperInfo(data.paperInfo)
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
      if (openedPaperNumber === paperId) {
        const firstPayload = sessionStorage.getItem("firstPaper")
        if (firstPayload) {
          const firstPayloadParse = JSON.parse(firstPayload)
          if (iframeRef && iframeRef.current && iframeRef.current.contentWindow) {
              iframeRef.current.contentWindow.postMessage(firstPayloadParse, '*');
            }
        }
      } else {
        const secondPayload = sessionStorage.getItem("secondPaper")
        const storeSecondPaper = () => getApi(api, `/api/paper/${openedPaperNumber}?workspaceId=${workspaceId}`) 
          .then(response => {
              if (response.status === 200) {
                  return response.json().then(data => {
                    //let iframeRefNum = openedPaperNumber === paperInfo.paperId ? iframeRef : iframeRef2
                    
                    const secondPayload = {
                      paperId: openedPaperNumber,
                      paperItems: data.paperInfo.paperItems
                    }
                    sessionStorage.setItem("secondPaper", JSON.stringify(secondPayload))
                    dispatch({
                      type: SET_SECOND_PAPER,
                      data: {
                        paperId: openedPaperNumber,
                        paperTitle: data.paperInfo.title,
                      }
                    })
                    if (iframeRef2 && iframeRef2.current && iframeRef2.current.contentWindow) {
                        iframeRef2.current.contentWindow.postMessage({
                          paperId: openedPaperNumber,
                          paperItems: data.paperInfo.paperItems,
                        }, '*');
                    }
                  })
              } else if (response.status === 401) {
                  refreshApi(api, notify, navigate)
                }
              throw new Error("논문 정보를 가져오는데 실패하였습니다")
          })
        if (secondPayload) {
          const secondPayloadParse = JSON.parse(secondPayload)
          
          if (secondPayloadParse.paperId === openedPaperNumber) {
            if (iframeRef2 && iframeRef2.current && iframeRef2.current.contentWindow) {
                iframeRef2.current.contentWindow.postMessage(secondPayloadParse, '*');
            }
          }
          else {
            storeSecondPaper()
          }
        } else {
          storeSecondPaper()
        }
      }
  }, [openedPaperNumber])


  const handleClickTab1 = () => {
      setOpenedPaperNumber(paperId)
  }

  const handleClickTab2 = () => {
      setOpenedPaperNumber(secondPaper.paperId)
  }

  const handleClickExportButton = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event?.currentTarget)
  }

  const handleClickSummary = () => {
    let iframeRefNum = openedPaperNumber === paperInfo.paperId ? iframeRef : iframeRef2

    if (iframeRefNum && iframeRefNum.current && iframeRefNum.current.contentWindow) {
      iframeRefNum.current.contentWindow.postMessage({
        isExportClicked: true
      }, '*');
    }
  }


  const tabHeight = 5
  const exportOpen = Boolean(anchorEl)
  const exportId = exportOpen ? 'simple-popper' : undefined

  return (
    <div>
      <Box sx={{height: '100vh'}}>
        <Box sx={{height: `${tabHeight}%`, display: 'flex', justifyContent: 'space-between'}}>
          <Box>
            
            <Box>
              <Button onClick={handleClickTab1}> {data && paperInfo.title} </Button>
              {secondPaper.paperId && <Button onClick={handleClickTab2}> {secondPaper.paperTitle} </Button>}
            </Box>
          </Box>
          <Button variant='contained' onClick={handleClickExportButton}>
            Export
          </Button>
          <Popper id={exportId} open={exportOpen} anchorEl={anchorEl} sx={{zIndex: 999}}>
            <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper',
            display: 'flex', flexDirection: 'column' }}>
              <Button>
                Download PDF
              </Button>
              <Button onClick={handleClickSummary}>
                Generate Summary
              </Button>
            </Box>
          </Popper>
        </Box>
        <Box >
          {!isLoading && (<Chat isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} 
                              data={data} paperId={paperId}
                              iframeRef={iframeRef} iframeRef2={iframeRef2} openedPaperNumber={openedPaperNumber}
                              curPageIndex={curPageIndex} setOpenedPaperNumber={setOpenedPaperNumber}
                              paperTitle={data && paperInfo?.title}
                              proofPayload={proofPayload} setProofPayload={setProofPayload}
                              prevProofId={prevProofId} setPrevProofId={setPrevProofId}
                              />)}
        </Box>
        <Box sx={{height: `${100-tabHeight}%`}}> 
          {openedPaperNumber === paperId
          ?<iframe src={readerUrl} width="100%" height="100%" ref={iframeRef}></iframe>
          :<iframe src={readerUrl} width="100%" height="100%" ref={iframeRef2}></iframe>}
        </Box>
      </Box>
    </div>
  )
}

export default Reader