import React, { useEffect, useRef, useState, KeyboardEvent, MouseEvent } from 'react'
import { Button, Box, Typography, IconButton } from '@mui/material'
import { color } from '../layout/color'
import scrollStyle from "../layout/scroll.module.css"
import CopyClick from './copyClick'
import * as amplitude from '@amplitude/analytics-browser';
import { StringMap, useNotify } from 'react-admin'
import * as Sentry from '@sentry/react';
import { getApi, postApi, refreshApi } from '../utils/apiUtils'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { CounterState } from '../reducer'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import loadingStyle from "../layout/loading.module.css"
import { SearchTap } from './searchTap'
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { ChatTextField } from './chatTextField'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

type history = {
    who: boolean;
    content: string;
    id: number;
    score: number | null;
    position?: any;
    text?: any;
}

const Chat = ({isChatOpen, setIsChatOpen, data, paperId, iframeRef, iframeRef2, openedPaperNumber, curPageIndex, paperTitle}: 
    {isChatOpen: boolean, setIsChatOpen: any, data: any, paperId: string, iframeRef: any, iframeRef2: any, openedPaperNumber: number, curPageIndex: number, paperTitle: any}) => {
    const notify = useNotify()
    const navigate = useNavigate()

    const api: string = useSelector((state: CounterState) => state.api)

    const workspaceId = Number(sessionStorage.getItem("workspaceId"));

    const [searchTermInPaper, setSearchTermInPaper] = useState<string>(""); // 변화하는 입력값
    const [enteredSearchTermInPaper, setEnteredSearchTermInPaper] = useState<string[]>([]); // 전체 입력값
    const [searchResultsInPaper, setSearchResultsInPaper] = useState<string[]>([])
    const [searchResultsProof, setSearchResultsProof] = useState<any[]>([])

    const [isFirstWord, setIsFirstWord] = useState<boolean>(true) // 스트리밍 응답 저장시 필요
    const [key, setKey] = useState<number>(); // 스트리밍 데이터 + 기본 데이터 받기 위해
    const [resultId, setResultId] = useState<number>(1)
    const [draggeddText, setDraggedText] = useState<string>("")
    const [prevProofId, setPrevProofId] = useState<string>("")

    // const [isChatOpen, setIsChatOpen] = useState<boolean>(false)
    
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);

    const refPaper = useSelector((state: CounterState) => state.refPaper)
    const selectedText = useSelector((state: CounterState) => state.chatSelectedText)

    const dispatch = useDispatch()

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
        const payload = {
            paperIds: refPaper.paperId?[paperId, refPaper.paperId]:[paperId],
            question: searchTermInPaper,
            context: draggeddText,
        }
        try {
            setKey(keyNumber)
            const response = await postApi(api, `/api/paper/${paperId}?workspaceId=${workspaceId}&key=${keyNumber}`, payload)

            if (response.status === 401) {
                refreshApi(api, notify, navigate)
            }

            // 일반 통신 방식
            const data = await response.json()
            setSearchResultsInPaper((prevResults: string[]) => [...prevResults, data.answer])
            setSearchResultsProof((prevProof: any[]) => [...prevProof, {
                position: data.position,
                text: data.text
            }])
            // 스트리밍
            // const reader = response.body!.getReader()
            // const decoder = new TextDecoder()

            // while (true) {
            //     const { value, done } = await reader.read()
            //     if (done) {
            //         setIsFirstWord(true)
            //         break
            //     }

            //     const decodedChunk = decoder.decode(value, { stream: true });

            //     setSearchResultsInPaper((prevSearchResults: string[]) => {
            //         if (isFirstWord) {
            //             setIsFirstWord(false)
            //             return [...prevSearchResults, decodedChunk]
            //         } else {
            //             const lastItem = prevSearchResults[prevSearchResults.length -1]
            //             const updatedResults = prevSearchResults.slice(0, -1)
            //             return [...updatedResults, lastItem + decodedChunk]
            //         }
            //     })
            // }
        } 
        catch(error) {
            console.error("논문 내 질문 오류")
            Sentry.captureException(error)
        } finally {
            const response = await getApi(api,`/api/paper/resultId?key=${keyNumber}`)
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
            pageLabel: `${curPageIndex+1}`,
            //sortIndex: curPageIndex+1,
        }
        iframeRefNum.current.contentWindow.postMessage({chatNote: chatNote}, '*')
    }

    const handleIndicateProof = (position: any, proofText: string) => {
        // 히스토리일 경우에는 paperId 없음
        const paperId = position.paperId
        
        // delete position.id
        // delete position.type
        // delete position.paperId
        const proofId = generateObjectKey()
        const payload = {
            type: 'highlight',
            text: proofText,
            position: position,
            color: '#000',
            comment: "답변 근거입니다. 다른 답변 근거를 클릭하면 사라집니다.",
            tags: [],
            id: proofId,
            dateCreated: (new Date()).toISOString(),
            dateModified: (new Date()).toISOString(),
            pageLabel: `${position.pageIndex+1}`,
            //sortIndex: curPageIndex+1,
        }
        
        const iframeRefNum = openedPaperNumber === 1 ? iframeRef : iframeRef2
        iframeRefNum.current.contentWindow.postMessage({proof: payload, proofId: prevProofId}, '*')
        setPrevProofId(proofId)
    }

    // 채팅 버튼 드래그 시 이동
    const [chatPosition, setChatPosition] = useState({ x: 15 * window.innerWidth / 100, y: 85 * window.innerHeight / 100 });
    const [isDragging, setIsDragging] = useState(false);
    const [isDragged, setIsDragged] = useState(false)

    const handleMouseDown = (e: any) => {
        setIsDragging(true);
    };

    useEffect(()=>{
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        } 
        return () => { // useEffect 동작 전에 실행
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging])

    const handleMouseMove = (e: any) => {
        if (!isDragging) return;
        setIsDragged(true)

        setChatPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };
    return (
    <div>
        <Box
        style={{
          width: '100px',
          height: '100px',
          borderRadius: '100%',
          backgroundColor: '#bbb',
          position: 'absolute', // 부모(상위) 요소에 대한 상대 위치로 설정
          left: chatPosition.x,
            top: chatPosition.y,
          transform: 'translate(-50%, -50%)', // 동그라미의 중심을 중앙으로 이동
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
        onClick={handleChatOpen}
        onMouseDown={handleMouseDown}
        ></Box>

      {/* 직사각형 (예: 채널톡 스타일) */}
      {isChatOpen && <Box
        style={{
          width: '350px',
          height: '500px',
          backgroundColor: '#ddd',
          position: 'absolute', // 부모(상위) 요소에 대한 상대 위치로 설정
          left: chatPosition.x,
          top: chatPosition.y,
          transform: 'translate(0, -100%)', // 상단 중앙으로 이동
          
        }}
      >
        <Box sx={{width: '100%', bgcolor: '#fff'}}>{paperTitle}</Box>
        <Box sx={{ border: `1px solid ${color.mainGrey}`,  padding: '20px', height: '90%', borderRadius: '15px', backgroundColor: color.mainGrey, 
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
                        <Box sx={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
                            {history.content}
                            {history.who? null:
                            <Box sx={{ display: 'flex', flexDirection: 'row-reverse', mt: 1}}>
                                <Box sx={{ml: 1, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                    <CopyClick contents={history.content}/>
                                    <IconButton onClick={() => handleExportAnswer(data.paperHistory[index-1].content, history.content)}>
                                        <ExitToAppIcon/>
                                    </IconButton>
                                    <IconButton onClick={() => handleIndicateProof(history.position, history?.text)}>
                                        <HelpOutlineIcon/>
                                    </IconButton>
                                </Box>
                            </Box>}
                            
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
                                <Box sx={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
                                
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
                                            <IconButton onClick={() => handleIndicateProof(searchResultsProof[index].position, searchResultsProof[index].text)}>
                                                <HelpOutlineIcon/>
                                            </IconButton>
                                        </Box>
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