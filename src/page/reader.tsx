import { Box, Button, Modal, Popper, Typography } from '@mui/material';
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
import { color } from '../layout/color';
import scrollStyle from "../layout/scroll.module.css"
import Export from './export';
import deleteIcon from '../asset/deleteIcon.svg'
import spinner from '../asset/spinner.gif'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import download from 'downloadjs';
// import pdfWorker from '../../pdf-worker/src';
// import { createRequire } from "module";
// const require = createRequire(import.meta.url);

type paperInfo = {
  paperId: string;
  paperTitle: string;
  paperItems: any;
}
const PopUpButton = ({title, clickEvent}: {title: string, clickEvent: any}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false)
  return (
    <Box sx={{p: 1, '&:hover':{cursor: 'pointer'}}} onClick={clickEvent}
          onMouseEnter={()=>{setIsHovered(true)}}
          onMouseLeave={()=>{setIsHovered(false)}}>
      <Typography sx={{fontSize: '15px', fontWeight: isHovered?600:500}}>
        {title}
      </Typography>
    </Box>
  )
}
const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #eee',
  borderRadius: '50px 0px 0px 0px',
  boxShadow: 24,
  
};

const LoadingCompletedBox = ({text, setIsSecondPageLoading}: {text: string, setIsSecondPageLoading: any}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // 1초 후에 로딩 박스를 숨깁니다.
    const timeoutId = setTimeout(() => {
      setVisible(false);
      setIsSecondPageLoading(1)
    }, 1000);

    return () => {
      // 컴포넌트가 언마운트되면 타이머를 클리어합니다.
      clearTimeout(timeoutId);
    };
  }, []);

  if (!visible) {
    return null; // 로딩 박스가 숨겨진 경우 null을 반환하여 렌더링하지 않습니다.
  }

  return (
    <Box sx={{position: 'absolute', width: '100%', top: '85vh', display: 'flex',
      justifyContent: 'center', alignItems: 'center'}}>
      <Box sx={{height: '7vh', bgcolor: '#505053', width: '500px', borderRadius: '100px',
        boxShadow: 10, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <CheckCircleIcon sx={{color: color.white, mr: 1}}/>
        <Typography sx={{fontSize: '15px', fontWeight: 500, color: '#eee'}}> {text} </Typography>
      </Box>
    </Box>
  );
};

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
  // const [isLoading, setIsLoading] = useState<boolean>(true)
  const [data, setData] = useState()
  const [curPageIndex, setCurPageIndex] = useState<number>(0)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const secondPaper = useSelector((state: CounterState) => state.secondPaper)
  const dispatch = useDispatch()

  const [proofPayload, setProofPayload] = useState<any>()
  const isUpdatedDone = useSelector((state: CounterState) => state.isUpdatedDone)
  const [prevProofId, setPrevProofId] = useState<string>("")

  const [curTab, setCurTab] = useState<number>(1)

  const [isOpenExport, setIsOpenExport] = useState<boolean>(false)

  const [isFirstPageLoading, setIsFirstPageLoading] = useState<boolean>(true)
  const [isSecondPageLoading, setIsSecondPageLoading] = useState<number>(1)

  const [downloadPdfAnnotations, setDownloadPdfAnnotations] = useState<any>(undefined)

  const handleClose = () => {
    setIsOpenExport(false)
  }

  const receiveIsPdfRender = (e: MessageEvent) => {
    if (e.data.isPdfRender) {
      setIsPdfCompleted(true)
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
      setIsOpenExport(true)
    }
    else if (e.data.pdfAnnotations) {
      const annotationsWithAuthor = e.data.pdfAnnotations.map((anno: any) => {
        const changeItem = {
          ...anno,
          authorName: ""
        }
        return changeItem
      })
      setDownloadPdfAnnotations(annotationsWithAuthor)
    }
    else if (e.data.isUpdatedDone) {
      dispatch({
        type: SET_IS_UPDATED_DONE,
        data: true
      })
    }
  }

  useEffect(()=>{
    if (downloadPdfAnnotations !== undefined) {
      const pdfWorker = require('../../pdf-worker/src');
      let userPdfCheck;
      if (paperId === openedPaperNumber) {
        const firstPayload = sessionStorage.getItem("firstPaper")
        if (firstPayload) {
          const firstPayloadParse = JSON.parse(firstPayload)
          userPdfCheck = firstPayloadParse.userPdf
        }
      } else {
        const secondPayload = sessionStorage.getItem("secondPaper")
        if (secondPayload) {
          const secondPayloadParse = JSON.parse(secondPayload)
          userPdfCheck = secondPayloadParse.userPdf
        }
      }

      fetch(userPdfCheck ?`https://yeondoo-upload-pdf.s3.ap-northeast-2.amazonaws.com/${openedPaperNumber}.pdf` : `https://browse.arxiv.org/pdf/${openedPaperNumber}.pdf`)
      .then((response) => response.arrayBuffer())
      .then(async(arrayBuffer) => {
        let buf = await pdfWorker.writeAnnotations(arrayBuffer, downloadPdfAnnotations);

        const uint8Array = new Uint8Array(buf)
        const blob = new Blob([uint8Array], {type: 'application/pdf'})
        const blobUrl = URL.createObjectURL(blob)

        const a = document.createElement('a')
        a.href = blobUrl
        a.download = `${openedPaperNumber}.pdf`
        a.style.display = 'none'

        document.body.appendChild(a)
        a.click()

        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);

      })
      .catch((error) => {
        console.error('파일을 가져오는 중 오류가 발생했습니다.', error);
      });
      setDownloadPdfAnnotations(undefined)
    }
  }, [downloadPdfAnnotations])

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
      }, 1200);

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
      
      getApi(api, `/api/container?workspaceId=${workspaceId}`)
      .then(async response => 
        {
          if (response.status === 200) {
            return response.json().then(data => {
              dispatch({
                type: SET_PAPERS_IN_STORAGE,
                data: data
              })
            })
          } else if (response.status === 401) {
            await refreshApi(api, notify, navigate)
          }
        })
      .catch(error => {
        console.error('관심 논문 정보를 불러오는데 실패하였습니다: ', error)
        Sentry.captureException(error)
      })
      getApi(api, `/api/paper/${paperId}?workspaceId=${workspaceId}`) 
        .then(async response => {
            if (response.status === 200) {
              const data = await response.json();
              setData(data);
              const firstPayload = {
                paperId: paperId,
                paperTitle: data.paperInfo.title,
                paperItems: data.paperInfo.paperItems,
                userPdf: data.paperInfo.userPdf,
              };
              sessionStorage.setItem("firstPaper", JSON.stringify(firstPayload));
              if (iframeRef && iframeRef.current && iframeRef.current.contentWindow) {
                iframeRef.current.contentWindow.postMessage({
                  workspaceId: workspaceId,
                  access: getCookie('access'),
                  refresh: getCookie('refresh'),
                  paperId: paperId,
                  paperItems: data.paperInfo.paperItems,
                  userPdf: data.paperInfo.userPdf,
                }, '*');
                setPaperInfo(data.paperInfo);
              }
            } else if (response.status === 401) {
                await refreshApi(api, notify, navigate)
            } else {
              throw new Error("논문 정보를 가져오는데 실패하였습니다")
            }
        })
        .finally(()=> {
          console.log('????')
          setIsFirstPageLoading(false)
        })
    }
  }, [isPdfCompleted])

  useEffect(()=>{
      if (openedPaperNumber === paperId) {
        setCurTab(1)
        const firstPayload = sessionStorage.getItem("firstPaper")
        if (firstPayload) {
          const firstPayloadParse = JSON.parse(firstPayload)
          if (iframeRef && iframeRef.current && iframeRef.current.contentWindow) {
              iframeRef.current.contentWindow.postMessage(firstPayloadParse, '*');
            }
        }
      } else {
        setCurTab(2)
        const secondPayload = sessionStorage.getItem("secondPaper")
        const storeSecondPaper = () => getApi(api, `/api/paper/${openedPaperNumber}?workspaceId=${workspaceId}`) 
          .then(async response => {
              if (response.status === 200) {
                  return response.json().then(data => {
                    //let iframeRefNum = openedPaperNumber === paperInfo.paperId ? iframeRef : iframeRef2
                    
                    const secondPayload = {
                      paperId: openedPaperNumber,
                      paperTitle: data.paperInfo.title,
                      paperItems: data.paperInfo.paperItems,
                      userPdf: data.paperInfo.userPdf,
                    }
                    sessionStorage.setItem("secondPaper", JSON.stringify(secondPayload))
                    dispatch({
                      type: SET_SECOND_PAPER,
                      data: {
                        paperId: openedPaperNumber,
                        paperTitle: data.paperInfo.title,
                      }
                    })
                    if (data.userPdf) {
                      fetch(`https://yeondoo-upload-pdf.s3.ap-northeast-2.amazonaws.com/${openedPaperNumber}.pdf`);
                    } else {
                      fetch(`https://browse.arxiv.org/pdf/${openedPaperNumber}.pdf`);
                    }
                    if (iframeRef2 && iframeRef2.current && iframeRef2.current.contentWindow) {
                        iframeRef2.current.contentWindow.postMessage({
                          paperId: openedPaperNumber,
                          paperItems: data.paperInfo.paperItems,
                          userPdf: data.paperInfo.userPdf,
                        }, '*');
                    }
                  })
              } else if (response.status === 401) {
                await refreshApi(api, notify, navigate)
              } else {
                throw new Error("논문 정보를 가져오는데 실패하였습니다")
              }
          })
          .finally(() => {
            setIsSecondPageLoading(3)
          })
        if (secondPayload) {
          const secondPayloadParse = JSON.parse(secondPayload)
          
          if (secondPayloadParse.paperId === openedPaperNumber) {
            console.log('yes', openedPaperNumber)
            dispatch({
              type: SET_SECOND_PAPER,
              data: {
                paperId: openedPaperNumber,
                paperTitle: secondPayloadParse.paperTitle,
              }
            })
            if (iframeRef2 && iframeRef2.current && iframeRef2.current.contentWindow) {
                iframeRef2.current.contentWindow.postMessage(secondPayloadParse, '*');
            }
          }
          else {
            setIsSecondPageLoading(2)
            storeSecondPaper()
          }
        } else {
          setIsSecondPageLoading(2)
          storeSecondPaper()
        }
      }
  }, [openedPaperNumber])


  const handleClickTab1 = () => {
      setOpenedPaperNumber(paperId)
      setCurTab(1)
  }

  const handleClickTab2 = () => {
      setOpenedPaperNumber(secondPaper.paperId)
      setCurTab(2)
  }

  const handleClickExportButton = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event?.currentTarget)
  }

  const handleClickSummary = () => {
    let iframeRefNum = openedPaperNumber === paperId ? iframeRef : iframeRef2
    if (iframeRefNum && iframeRefNum.current && iframeRefNum.current.contentWindow) {
      iframeRefNum.current.contentWindow.postMessage({
        isExportClicked: true
      }, '*');
    }
  }

  const handleClickDownloadPdf = async() => {
    let iframeRefNum = openedPaperNumber === paperId ? iframeRef : iframeRef2
    if (iframeRefNum && iframeRefNum.current && iframeRefNum.current.contentWindow) {
      iframeRefNum.current.contentWindow.postMessage({
        isDownloadPdfClicked: true
      }, '*');
    }
  }

  const loadingBox = (text: string) => (
    <Box sx={{position: 'absolute', width: '100%', top: '85vh', display: 'flex',
      justifyContent: 'center', alignItems: 'center'}}>
        <Box sx={{height: '7vh', bgcolor: '#505053', width: '500px', borderRadius: '100px',
      boxShadow: 10, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <img src={spinner} alt="로딩" width="8%"/>
          <Typography sx={{fontSize: '15px', fontWeight: 500, color: '#eee'}}> {text} </Typography>
        </Box>
      </Box>
  )

  // const loadingCompletedBox = (text: string) => (
  //   <Box sx={{position: 'absolute', width: '100%', top: '85vh', display: 'flex',
  //     justifyContent: 'center', alignItems: 'center',
  //     opacity: 1, // 초기 투명도를 설정
  //     transition: 'opacity 1s', // 투명도에 1초 트랜지션 적용
  //   }}>
  //       <Box sx={{height: '7vh', bgcolor: '#505053', width: '500px', borderRadius: '100px',
  //     boxShadow: 10, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
  //         <img src={spinner} alt="로딩" width="8%"/>
  //         <Typography sx={{fontSize: '15px', fontWeight: 500, color: '#eee'}}> {text} </Typography>
  //       </Box>
  //     </Box>
  // )


  const tabHeight = 5
  const exportOpen = Boolean(anchorEl)
  const exportId = exportOpen ? 'simple-popper' : undefined

  const [isHoveredOne, setIsHoveredOne] = useState<boolean>(false)
  const [isHoveredTwo, setIsHoveredTwo] = useState<boolean>(false)
  console.log(isFirstPageLoading, isPdfCompleted)

  return (
    <div>
      <Box sx={{height: '100vh', overflow: 'hidden'}}>
        <Modal
          open={isOpenExport}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Box sx={{height: '70vh'}}>
            <img src={deleteIcon} style={{width: '20px', position: 'absolute', left: '90%',
                                            transform: 'translate(150%, -80%)', cursor: 'pointer'}}
                      onClick={handleClose}/>
              <Export/>
            </Box>
          </Box>
        </Modal>
        <Box sx={{height: '5px', bgcolor: color.mainGreen}}></Box>
        <Box sx={{height: `45px`, display: 'flex', justifyContent: 'space-between', bgcolor: color.mainGreen}}>
          <Box sx={{height: '100%', display: 'flex'}}>
            <Box onClick={handleClickTab1}
                onMouseEnter={()=>{setIsHoveredOne(true)}}
                onMouseLeave={()=>{setIsHoveredOne(false)}}
                sx={{height: '100%', px: 4, cursor: 'pointer', display: 'flex', alignItems: 'center',
                bgcolor: curTab === 1?color.white:(isHoveredOne?"rgba(255, 255, 255, 0.5)":null),
                borderRadius: '15px 15px 0px 0px'}}> 
                <Typography sx={{fontSize: '15px', fontWeight: curTab === 1?600:500, color:curTab === 1?color.appbarGreen:(isHoveredOne?color.appbarGreen:color.white)}}>
                  {data && (paperInfo.title.length>25?paperInfo.title.slice(0,25)+"...":paperInfo.title)} 
                </Typography>
            </Box>
            {secondPaper.paperId && 
            <Box onClick={handleClickTab2}
              onMouseEnter={()=>{setIsHoveredTwo(true)}}
              onMouseLeave={()=>{setIsHoveredTwo(false)}}
              sx={{height: '100%', px: 4, cursor: 'pointer', display: 'flex', alignItems: 'center',
                bgcolor: curTab === 2?color.white:(isHoveredTwo?"rgba(255, 255, 255, 0.5)":null),
                borderRadius: '15px 15px 0px 0px'}}
              >
              <Typography sx={{fontSize: '15px', fontWeight: curTab === 2?600:500, color:curTab === 2?color.appbarGreen:(isHoveredTwo?color.appbarGreen:color.white)}}>
                {secondPaper.paperTitle.length>25?secondPaper.paperTitle.slice(0,25)+"...":secondPaper.paperTitle} 
              </Typography>
            </Box>}
          </Box>
          <Box sx={{height: '100%', display: 'flex', alignItems: 'center', px: 4}}>
            <Box onClick={handleClickExportButton}
                  sx={{borderRadius: '7px', border: '1px solid rgba(255, 255, 255, 0.30)', bgcolor: color.white, px: 4, py:0.5,
                    boxShadow: '0px 2px 0px 0px #D4DBE1', '&:hover': {cursor: 'pointer'}}}>
                <Typography sx={{fontSize: '15px', fontWeight: 600, color: color.appbarGreen}}>
                  EXPORT
                </Typography>
            </Box>
          </Box>
          <Popper id={exportId} open={exportOpen} anchorEl={anchorEl} sx={{zIndex: 999, width: '250px'}}>
            <Box sx={{ p: 1, bgcolor: 'background.paper',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            borderRadius: '5px', border: '1px solid #ddd', boxShadow: '0px 5px 5px rgba(0, 0, 0, 0.1), 0px -5px 5px rgba(0, 0, 0, 0.1)',
            mr: 4, mt: 1 }}>
              <PopUpButton title="Download PDF" clickEvent={handleClickDownloadPdf}/>
              <PopUpButton title="Generate Summary" clickEvent={handleClickSummary} />
            </Box>
          </Popper>
        </Box>
        <Box>
          {(!isFirstPageLoading) && (<Chat isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} 
                              data={data} paperId={paperId}
                              iframeRef={iframeRef} iframeRef2={iframeRef2} openedPaperNumber={openedPaperNumber}
                              curPageIndex={curPageIndex} setOpenedPaperNumber={setOpenedPaperNumber}
                              paperTitle={data && paperInfo?.title}
                              proofPayload={proofPayload} setProofPayload={setProofPayload}
                              prevProofId={prevProofId} setPrevProofId={setPrevProofId}
                              paperInfo={paperInfo} setCurTab={setCurTab}
                              />)}
        </Box>
        <Box sx={{height: `calc(100vh - 45px)`}}>
          {(isFirstPageLoading ? loadingBox('Paper Information Loading...') : <LoadingCompletedBox text='Loading Completed' setIsSecondPageLoading={setIsSecondPageLoading}/>)}
          {(isSecondPageLoading === 2 && loadingBox('Reference Paper Information Loading...'))}
          {(isSecondPageLoading === 3 && <LoadingCompletedBox text='Loading Completed' setIsSecondPageLoading={setIsSecondPageLoading}/>)}
          {openedPaperNumber === paperId
          ?<iframe src={readerUrl} width="100%" height="100%" ref={iframeRef}></iframe>
          :<iframe src={readerUrl} width="100%" height="100%" ref={iframeRef2}></iframe>}
        </Box>
      </Box>
    </div>
  )
}

export default Reader