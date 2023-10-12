import React, { useEffect, useRef, useState, KeyboardEvent, MouseEvent } from 'react'
import { Button, Box, Typography, IconButton } from '@mui/material'
import { color } from '../layout/color'
import scrollStyle from "../layout/scroll.module.css"
import CopyClick from './copyClick'
import ScoreSlider from './scoreSlider'
import * as amplitude from '@amplitude/analytics-browser';
import { StringMap, useNotify } from 'react-admin'
import * as Sentry from '@sentry/react';
import { getApi, postApi, refreshApi } from '../utils/apiUtils'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { CounterState } from '../reducer'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import loadingStyle from "../layout/loading.module.css"
import { SearchTap } from './searchTap'
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { ChatTextField } from './chatTextField'

type history = {
    who: boolean;
    content: string;
    id: number;
    score: number | null;
}

const Chat = ({isChatOpen, setIsChatOpen, data, paperId, selectedText, iframeRef, iframeRef2, openedPaperNumber, isDragged, setIsDragged, curPageIndex}: 
    {isChatOpen: boolean, setIsChatOpen: any, data: any, paperId: string, selectedText: string, iframeRef: any, iframeRef2: any, openedPaperNumber: number, isDragged: boolean, setIsDragged: any, curPageIndex: number}) => {
    const notify = useNotify()
    const navigate = useNavigate()

    const api: string = useSelector((state: CounterState) => state.api)

    const workspaceId = Number(sessionStorage.getItem("workspaceId"));

    const [searchTermInPaper, setSearchTermInPaper] = useState<string>(""); // 변화하는 입력값
    const [enteredSearchTermInPaper, setEnteredSearchTermInPaper] = useState<string[]>([]); // 전체 입력값
    const [searchResultsInPaper, setSearchResultsInPaper] = useState<string[]>([])

    const [isFirstWord, setIsFirstWord] = useState<boolean>(true) // 스트리밍 응답 저장시 필요
    const [key, setKey] = useState<number>(); // 스트리밍 데이터 + 기본 데이터 받기 위해
    const [resultId, setResultId] = useState<number>(1)
    const [draggeddText, setDraggedText] = useState<string>("")

    // const [isChatOpen, setIsChatOpen] = useState<boolean>(false)
    
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (isChatOpen) {
            scrollContainerRef.current?.scrollTo(0, scrollContainerRef.current.scrollHeight);
        }
      }, [isChatOpen, data, enteredSearchTermInPaper, searchResultsInPaper]);

    useEffect(() => {
        setDraggedText(selectedText.trim())
    }, [selectedText])

    const handleChatOpen = (e: any) => {
        e.preventDefault();
        if (isDragged){
            setIsDragged(false)
        } else {
            if (isChatOpen) {
                setDraggedText("")
            }
            setIsChatOpen(!isChatOpen)
        }
    }

    const handleSearchKeyDownInPaper = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && event.nativeEvent.isComposing === false){
            event.preventDefault();
            amplitude.track('논문 내 질의', {paperId: paperId})
            if (searchTermInPaper === '') {
                notify('Please enter your question', {type: 'error'})
                return ;
            }
            performSearchInPaper()
        }
    }

    const handleButtonClickInPaper = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        amplitude.track('논문 내 질의', {paperId: paperId})
        if (searchTermInPaper === '') {
            notify('Please enter your question', {type: 'error'})
            return ;
        }
        performSearchInPaper();
    }

    const performSearchInPaper = async () => {
        if (searchTermInPaper != ''){
            setEnteredSearchTermInPaper((prevEnteredSearchTerm: string[])=>[...prevEnteredSearchTerm, searchTermInPaper])      
        }
        setSearchTermInPaper("")
        const query = new URLSearchParams(window.location.search);
        const paperId: string = query.get('paperid') || '';
        const keyNumber = Math.floor(Math.random()*1000000000)
        try {
            setKey(keyNumber)
            const response = await postApi(api, `/api/paper/${paperId}?workspaceId=${workspaceId}&key=${keyNumber}`, {question: searchTermInPaper})

            if (response.status === 401) {
                refreshApi(api, notify, navigate)
              }
            const reader = response.body!.getReader()
            const decoder = new TextDecoder()

            while (true) {
                const { value, done } = await reader.read()
                if (done) {
                    setIsFirstWord(true)
                    break
                }

                const decodedChunk = decoder.decode(value, { stream: true });

                setSearchResultsInPaper((prevSearchResults: string[]) => {
                    if (isFirstWord) {
                        setIsFirstWord(false)
                        return [...prevSearchResults, decodedChunk]
                    } else {
                        const lastItem = prevSearchResults[prevSearchResults.length -1]
                        const updatedResults = prevSearchResults.slice(0, -1)
                        return [...updatedResults, lastItem + decodedChunk]
                    }

                })

                
            }
        } 
        catch(error) {
            console.error("논문 내 질문 오류")
            Sentry.captureException(error)
        } finally {
            const response = await getApi(api,`/api/paper/${paperId}?workspaceId=${workspaceId}&key=${keyNumber}`)
            const data = await response.json()
            setResultId(data)
        }
    }
    const generateObjectKey = () => {
		let len = 8;
		let allowedKeyChars = '23456789ABCDEFGHIJKLMNPQRSTUVWXYZ';

		var randomstring = '';
		for (var i = 0; i < len; i++) {
			var rnum = Math.floor(Math.random() * allowedKeyChars.length);
			randomstring += allowedKeyChars.substring(rnum, rnum + 1);
		}
		return randomstring;
	}

    const handleExportAnswer = (question: string, answer: string) => {
        const iframeRefNum = openedPaperNumber === 1 ? iframeRef : iframeRef2
        const combinedText = `${question}\n\n${answer}`
        const chatNote = {
            type: 'note',
            position: { pageIndex: curPageIndex, rects: [[575.9580509977826, 420.80943015521063, 597.9580509977826, 442.80943015521063]] },
            color: '#000',
            comment: combinedText,
            tags: [],
            id: generateObjectKey(),
            dateCreated: (new Date()).toISOString(),
            dateModified: (new Date()).toISOString(),
            pageLabel: curPageIndex+1,
            sortIndex: curPageIndex+1,
        }
        iframeRefNum.current.contentWindow.postMessage({chatNote: chatNote}, '*')
    }
  return (
    <div>
        <Box
        style={{
          width: '100px',
          height: '100px',
          borderRadius: '100%',
          backgroundColor: '#bbb',
          position: 'absolute', // 부모(상위) 요소에 대한 상대 위치로 설정
          left: '50%', // 동그라미의 가로 중앙으로 이동
          top: '50%', // 동그라미의 세로 중앙으로 이동
          transform: 'translate(-50%, -50%)', // 동그라미의 중심을 중앙으로 이동
        }}
        onClick={handleChatOpen}
        ></Box>

      {/* 직사각형 (예: 채널톡 스타일) */}
      {isChatOpen && <Box
        style={{
          width: '350px',
          height: '500px',
          backgroundColor: '#ddd',
          position: 'absolute', // 부모(상위) 요소에 대한 상대 위치로 설정
          left: '0', // 동그라미의 왼쪽에 위치
          top: '100%', // 동그라미의 아래에 위치
          transform: 'translate(0, -100%)', // 상단 중앙으로 이동
        }}
      >
        <Box sx={{ border: `1px solid ${color.mainGrey}`,  padding: '20px', height: '100%', borderRadius: '15px', backgroundColor: color.mainGrey, 
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        }}>
            <Box sx={{ overflowY: 'scroll' }} ref={scrollContainerRef} className={scrollStyle.scrollBar}>
                {data.paperHistory &&
                data.paperHistory.map((history: history, index: number) => (
                <Box
                    key={`history-${index}`}
                    sx={{
                    backgroundColor: history.who ? 'white' : color.secondaryGrey,
                    padding: '10px',
                    marginBottom: '10px',
                    borderRadius: '10px',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        {history.who ? <Typography sx={{mr: '10px'}}>👤</Typography> : 
                                <Typography sx={{mr: '10px'}}>🍀</Typography>
                            }
                        <Box sx={{width: '100%'}}>
                            {history.content}
                            {history.who? null:
                            <Box sx={{ display: 'flex', flexDirection: 'row-reverse', mt: 1}}>
                                <Box sx={{ml: 1, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                    <CopyClick contents={history.content}/>
                                    <IconButton onClick={() => handleExportAnswer(data.paperHistory[index-1].content, history.content)}>
                                        <ExitToAppIcon/>
                                    </IconButton>
                                </Box>
                                <ScoreSlider id={history.id} score={history.score} paper={true}/>
                            </Box>}
                            {/* {history.who? null:
                            <ScoreSlider id={history.id} score={history.score} paper={true}/>} */}
                            
                        </Box>
                        
                    </Box>
                    
                </Box>
                
                ))}
                {enteredSearchTermInPaper && searchResultsInPaper && (
                <>
                    {enteredSearchTermInPaper.map((term: string, index:number) => (
                    <div key={index}>
                        
                        <Box sx={{ display: 'flex', backgroundColor: "white", padding: '10px', marginBottom: '10px', borderRadius: '10px'}}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', marginRight: '10px' }}>
                                <Typography>👤</Typography>
                            </Box>
                            <Typography variant="body1">{term}</Typography>
                        </Box> 
                        <Box sx={{ backgroundColor: color.secondaryGrey, padding: '10px', marginBottom: '10px', borderRadius: '10px'}}>
                            <Box sx={{display: 'flex', alignItems: 'flex-start'}}>
                                <Box sx={{ marginRight: '10px' }}>
                                    <Typography>🍀</Typography>
                                </Box>
                                <Box sx={{width: '100%'}}>
                                
                                    {index>=searchResultsInPaper.length?(
                                        <Typography variant="body1" className={loadingStyle.loading}> <MoreHorizIcon /> </Typography>
                                    ):(
                                        <Typography variant="body1">{searchResultsInPaper[index]}</Typography>                 
                                    )}
                                    
                                    {index>= searchResultsInPaper.length?null:
                                    <Box sx={{display: 'flex', flexDirection: 'row-reverse', mt: 1}}>
                                        <Box sx={{ml: 1, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                            <CopyClick contents={searchResultsInPaper[index]}/>
                                            <IconButton onClick={() => handleExportAnswer(term, searchResultsInPaper[index])}>
                                                <ExitToAppIcon/>
                                            </IconButton>
                                        </Box>
                                        <ScoreSlider id={resultId} paper={true}/>
                                    </Box>}
                                
                                </Box>
                            </Box>
                            
                        </Box>
                        
                    </div>
                    ))}
                </>
                )}
            </Box>

            <ChatTextField
                searchTerm={searchTermInPaper}
                onChange={setSearchTermInPaper}
                onSearch={handleButtonClickInPaper}
                onSearchKeyDown={handleSearchKeyDownInPaper}
                placeholder="이 논문에서 실험 1의 결과를 요약해줘"
                sx={{width: "100%", backgroundColor: "#FFFFFF"}}
                selectedText={draggeddText}
            />
        </Box>
    </Box>}

    </div>
  )
}

export default Chat