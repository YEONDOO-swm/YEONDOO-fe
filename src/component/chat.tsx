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
import { CounterState, SET_IS_UPDATED_DONE, SET_SECOND_PAPER } from '../reducer'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import loadingStyle from "../layout/loading.module.css"
import { SearchTap } from './searchTap'
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { ChatTextField } from './chatTextField'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import chatProfile from '../asset/chatProfile.png';
import deleteIcon from '../asset/delete.svg'
import chat from '../asset/chatProfile.png'
import search from '../asset/searchIcon.svg'
import searchBlack from '../asset/searchBlack.svg'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

type history = {
    who: boolean;
    content: string;
    id: number;
    score: number | null;
    positions?: any;
    paperDetailList: any;
    context: string;
}

const Chat = ({isChatOpen, setIsChatOpen, data, paperId, iframeRef, iframeRef2, openedPaperNumber
    , setOpenedPaperNumber, curPageIndex, paperTitle, proofPayload, setProofPayload, prevProofId, setPrevProofId, paperInfo}: 
    {isChatOpen: boolean, setIsChatOpen: any, data: any, paperId: string, iframeRef: any, iframeRef2: any, openedPaperNumber: string
        , setOpenedPaperNumber: any, curPageIndex: number, paperTitle: any,
    proofPayload: any, setProofPayload: any, prevProofId: string, setPrevProofId: any, paperInfo: any}) => {
    const notify = useNotify()
    const navigate = useNavigate()

    const api: string = useSelector((state: CounterState) => state.api)

    const workspaceId = Number(sessionStorage.getItem("workspaceId"));

    const [searchTermInPaper, setSearchTermInPaper] = useState<string>(""); // 변화하는 입력값
    const [enteredSearchTermInPaper, setEnteredSearchTermInPaper] = useState<any[]>([]); // 전체 입력값
    const [searchResultsInPaper, setSearchResultsInPaper] = useState<string[]>([])
    const [searchResultsProof, setSearchResultsProof] = useState<any[]>([])

    const [isFirstWord, setIsFirstWord] = useState<boolean>(true) // 스트리밍 응답 저장시 필요
    const [key, setKey] = useState<number>(); // 스트리밍 데이터 + 기본 데이터 받기 위해
    const [resultId, setResultId] = useState<number>(1)
    const [draggeddText, setDraggedText] = useState<string>("")
    // const [prevProofId, setPrevProofId] = useState<string>("")
    //const [proofPayload, setProofPayload] = useState<any>()

    // const [isChatOpen, setIsChatOpen] = useState<boolean>(false)
    
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);

    const refPaper = useSelector((state: CounterState) => state.refPaper)
    const {selectedText, position} = useSelector((state: CounterState) => state.chatSelected)
    const isUpdatedDone = useSelector((state: CounterState) => state.isUpdatedDone)
    const secondPaper = useSelector((state: CounterState) => state.secondPaper)

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
            setEnteredSearchTermInPaper((prevEnteredSearchTerm: any[])=>[...prevEnteredSearchTerm, 
                {searchTerm: searchTermInPaper, 
                draggedText: draggeddText,
                refPaper: refPaper}])      
        }
        setSearchTermInPaper("")
        const query = new URLSearchParams(window.location.search);
        const paperId: string = query.get('paperid') || '';
        const keyNumber = Math.floor(Math.random()*1000000000)
        const payload = {
            paperIds: refPaper.paperId?[paperId, refPaper.paperId]:[paperId],
            question: searchTermInPaper,
            context: draggeddText ? draggeddText : null,
            position: draggeddText ? position : null,
        }
        try {
            setKey(keyNumber)
            const response = await postApi(api, `/api/paper/${paperId}?workspaceId=${workspaceId}&key=${keyNumber}`, payload)

            if (response.status === 401) {
                refreshApi(api, notify, navigate)
            }

            // 일반 통신 방식
            // const data = await response.json()
            // setSearchResultsInPaper((prevResults: string[]) => [...prevResults, data.answer])
            // setSearchResultsProof((prevProof: any[]) => [...prevProof, {
            //     firstPaperPosition: (data.positions && data.positions.length > 0) && 
            //     {
            //         paperId: data.positions[0].paperId,
            //         position: {
            //             pageIndex: data.positions[0].pageIndex,
            //             rects: data.positions[0].rects,
            //         }
            //     },
            //     secondPaperPosition: (data.positions && data.positions.length > 1) && 
            //     {
            //         paperId: data.positions[1].paperId,
            //         position: {
            //             pageIndex: data.positions[1].pageIndex,
            //             rects: data.positions[1].rects,
            //         }
            //     },
            // }])
            // 스트리밍
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
            const response = await getApi(api,`/api/paper/result/chat?key=${keyNumber}&workspaceId=${workspaceId}&paperId=${paperId}`)
            const data = await response.json()
            //setSearchResultsInPaper((prevResults: string[]) => [...prevResults, data.answer])
            setSearchResultsProof((prevProof: any[]) => [...prevProof, {
                firstPaperPosition: (data.positions && data.positions.length > 0) && 
                {
                    paperId: data.positions[0].paperId,
                    position: {
                        pageIndex: data.positions[0].pageIndex,
                        rects: data.positions[0].rects,
                    }
                },
                secondPaperPosition: (data.positions && data.positions.length > 1) && 
                {
                    paperId: data.positions[1].paperId,
                    position: {
                        pageIndex: data.positions[1].pageIndex,
                        rects: data.positions[1].rects,
                    }
                },
            }])
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
        const iframeRefNum = openedPaperNumber === paperId ? iframeRef : iframeRef2
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

    const handleIndicateProof = (chatPaperId: string, rect: number[], pageIndex: number) => {
        // 히스토리일 경우에는 paperId 없음
        
        // delete position.id
        // delete position.type
        // delete position.paperId
        const proofId = generateObjectKey()
        const payload = {
            type: 'highlight',
            text: '',
            position: {
                pageIndex: pageIndex,
                rects: [rect]
            },
            color: '#000',
            comment: "",
            tags: [],
            id: proofId,
            dateCreated: (new Date()).toISOString(),
            dateModified: (new Date()).toISOString(),
            pageLabel: `${position.pageIndex+1}`,
            //sortIndex: curPageIndex+1,
        }
        if (chatPaperId === openedPaperNumber) {
            const iframeRefNum = chatPaperId === paperId ? iframeRef : iframeRef2
            if (iframeRefNum && iframeRefNum.current && iframeRefNum.current.contentWindow) {
                iframeRefNum.current.contentWindow.postMessage({proof: payload, proofId: prevProofId}, '*')
            }
            //setOpenedPaperNumber(chatPaperId)
            setPrevProofId(proofId)
        } else {
            setProofPayload(payload)
            setOpenedPaperNumber(chatPaperId)
        }
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
        sx={{
          width: '90px',
          height: '90px',
          borderRadius: '100%',
          backgroundColor: isChatOpen?color.hoverGreen: color.mainGreen,
          position: 'absolute', // 부모(상위) 요소에 대한 상대 위치로 설정
          left: chatPosition.x,
          top: chatPosition.y,
          transform: 'translate(-50%, -50%)', // 동그라미의 중심을 중앙으로 이동
          cursor: isDragging ? 'grabbing' : 'grab',
          boxShadow: '0px 5px 5px rgba(0, 0, 0, 0.1), 0px -5px 5px rgba(0, 0, 0, 0.1)',
          '&:hover':{
            bgcolor: color.hoverGreen
          }
        }}
        onClick={handleChatOpen}
        onMouseDown={handleMouseDown}
        >
            <img src={chatProfile} style={{marginTop: '25px', marginLeft: '25px'}} draggable={false}/>
        </Box>

      {/* 직사각형 (예: 채널톡 스타일) */}
      {isChatOpen && <Box
        style={{
          width: '400px',
          height: '550px',
          //backgroundColor: '#ddd',
          position: 'absolute', // 부모(상위) 요소에 대한 상대 위치로 설정
          left: chatPosition.x,
          top: chatPosition.y,
          transform: 'translate(0, -95%)', // 상단 중앙으로 이동
          
        }}
      >
        <Box sx={{width: '100%', height:'30px', bgcolor: '#333', color: color.white, px: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <Typography sx={{fontSize: '15px', fontWeight: 600}}>
                {paperTitle}
            </Typography>
            <img src={deleteIcon} style={{width: '18px', cursor: 'pointer'}} onClick={()=>{setIsChatOpen(false)}}/>
        </Box>
        <Box sx={{ border: `1px solid ${color.mainGrey}`,  height: '90%'
        , backgroundColor: '#f5f5f5', 
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        }}>
            <Box sx={{ overflowY: 'scroll', px: '20px', pt: '20px' }} ref={scrollContainerRef} className={scrollStyle.scrollBar}>
                {data.paperHistory &&
                data.paperHistory.map((history: history, index: number) => (
                <Box sx={{display: 'flex', flexDirection: history.who?'row-reverse':'row', alignItems: 'flex-start'}}>
                    {history.who ? null : 
                        <Box sx={{width: '30px', height: '30px', borderRadius: '100%', bgcolor: color.mainGreen,
                            display: 'flex', justifyContent: 'center', alignItems: 'center', mr: 1}}>
                            <img src={chat} alt="chat profile" style={{width: '15px', height: '15px'}}/>
                        </Box>}     
                    <Box
                        key={`history-${index}`}
                        sx={{
                        backgroundColor: history.who ? color.mainGreen : color.white,
                        border: history.who ? null : '1px solid #eee',
                        boxShadow: history.who ? null : '0px 5px 15px 0px rgba(0, 0, 0, 0.07)',
                        padding: '16px',
                        marginBottom: '10px',
                        borderRadius: history.who ? '15px 0px 15px 15px' : '0px 15px 15px 15px',
                        maxWidth: history.who ? '300px' : '300px'
                        }}
                    >
                        {history.who && <Box>
                                <Box sx={{display: 'flex', gap: 1}}>
                                    {history.paperDetailList.map((paper: any) => (
                                        <Box sx={{display: 'inline-flex', alignItems: 'center', gap: 1, pl: 2, pr: 1, py: 0.4, mb: 1,
                                        borderRadius: '100px', border: `1px solid ${color.white}`, cursor: 'pointer'}}>
                                        <Typography sx={{fontSize: '13px', color: color.white, fontWeight: 500}} onClick={()=>{setOpenedPaperNumber(paper.paperId)}}>
                                            #{paper.title.length > 10 ? paper.title.slice(0,10)+"..." : paper.title}
                                        </Typography>
                                        </Box>
                                        ))
                                    }
                                </Box>
                                <Box>
                                {history.context.length>20 ? 
                                <Box sx={{display: 'flex', alignItems: 'center', bgcolor: color.white, borderRadius: '100px', mb: 1}}>
                                <Box sx={{display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden', mx: 1, my: 0.5, px: 1,}}>
                                    <Typography sx={{color: color.mainGreen, fontSize: '13px', fontWeight: 500}}>
                                    {history.context} 
                                    </Typography>
                                </Box>
                                </Box>:
                                <Box sx={{display: 'flex', alignItems: 'center', mb: 1}}>
                                <Box sx={{display: 'inline-flex', px: 2, py: 0.5, alignItems: 'center',
                                            bgcolor: color.white, borderRadius: '100px'}}>
                                    <Typography sx={{color: color.mainGreen, fontSize: '13px', fontWeight: 500}}>
                                        {history.context} 
                                    </Typography>
                                </Box>
                                </Box>}
                                </Box>
                        </Box>}
                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                            
                            <Box sx={{}}>
                                <Typography sx={{fontSize: '14px' , color: history.who ? color.white : '#333'}}>
                                    {history.content}
                                </Typography>
                                   
                            </Box>
                        </Box>
                        {!history.who && <Box sx={{display: 'inline-block', mt: 1}}>
                                    {!history.positions?null:
                                    <>
                                        <Box sx={{display: 'inline-block'}}>
                                            {history.positions.length > 0&& history.positions[0].rects.map((proof: any, idx: number) => (
                                                <Box sx={{bgcolor: '#222', px: 1, borderRadius: '100px', display: 'flex', gap: 1, mr: 1}} onClick={() => handleIndicateProof(history.positions[0].paperId, proof, history.positions[0].pageIndex)}>
                                                    <img src={search} alt="search" />
                                                    <Typography sx={{fontSize: '15px', color: color.white}}>
                                                        base {idx}
                                                    </Typography>
                                                </Box>
                                            ))}
                                        </Box>
                                        <Box sx={{display: 'inline-block'}}>
                                            {history.positions.length > 1&& history.positions[1].rects.map((proof: any, idx: number) => (
                                                <Box sx={{bgcolor: '#fff', border: '1px solid #222', px: 1, borderRadius: '100px', display: 'flex', gap: 1, mr: 1}} onClick={() => handleIndicateProof(history.positions[1].paperId, proof, history.positions[1].pageIndex)}>
                                                    <img src={searchBlack} alt="search" />
                                                    <Typography sx={{fontSize: '15px', color: '#222'}}>
                                                        base {idx}
                                                    </Typography>
                                                </Box>
                                            ))}
                                    </Box>
                                    </>
                                    }
                                    {history.who? null:
                                    <Box>
                                        <Box sx={{display: 'flex'}}>
                                            <CopyClick contents={history.content}/>
                                            <Box sx={{width: '30px', height: '30px', borderRadius: '100%', border: '1px solid #ddd',
                                                    display: 'flex', justifyContent: 'center', alignItems: 'center', ml: 1}} onClick={() => handleExportAnswer(data.paperHistory[index-1].content, history.content)}>
                                                <ExitToAppIcon sx={{color: '#333', fontSize: '19px'}}/>
                                            </Box>
                                            {/* <IconButton onClick={() => handleExportAnswer(data.paperHistory[index-1].content, history.content)}>
                                                <ExitToAppIcon/>
                                            </IconButton> */}
                                        </Box>
                                    </Box>} 
                                </Box>}
                    </Box>
                </Box>
                ))}
                {
                    paperInfo && (
                        <Box sx={{display: 'flex'}}>
                            <Box sx={{width: '30px', height: '30px', borderRadius: '100%', bgcolor: color.mainGreen,
                                display: 'flex', justifyContent: 'center', alignItems: 'center', mr: 1}}>
                                <img src={chat} alt="chat profile" style={{width: '15px', height: '15px'}}/>
                            </Box>
                            <Box sx={{ backgroundColor: color.white,
                                border: '1px solid #eee',
                                boxShadow: '0px 5px 15px 0px rgba(0, 0, 0, 0.07)',
                                padding: '16px',
                                marginBottom: '10px',
                                borderRadius: '0px 15px 15px 15px',
                                maxWidth: '300px'}}>
                                <Typography sx={{fontSize: '15px', fontWeight: 600, color: '#333'}}>
                                    INSIGHTS
                                </Typography>
                                <Box sx={{}}>
                                    <Box sx={{maxWidth: '300px', mb: 1}}>
                                        {paperInfo && paperInfo.insights.map((insight: any, index: number) => (
                                            <Typography sx={{fontSize: '14px', color: '#333'}}>
                                                {index+1}. {insight}
                                            </Typography>      
                                        ))}
                                    </Box>
                                        
                                        
                                </Box>
                            </Box>
                        </Box>
                    )
                }
                {enteredSearchTermInPaper && searchResultsInPaper && (
                <>
                    {enteredSearchTermInPaper.map((term: any, index:number) => (
                    <Box key={index}>
                        <Box sx={{ display: 'flex', flexDirection: 'row-reverse'}}>
                            <Box
                                sx={{
                                backgroundColor: color.mainGreen ,
                                
                                padding: '16px',
                                marginBottom: '10px',
                                borderRadius: '15px 0px 15px 15px' ,
                                maxWidth: '300px'
                                }}
                            >
                            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                <Box>
                                    <Box sx={{display: 'flex', gap: 1}}>
                                        <Box sx={{display: 'inline-flex', alignItems: 'center', gap: 1, px: 2, py: 0.4, mb: 1,
                                        borderRadius: '100px', border: `1px solid ${color.white}`, cursor: 'pointer'}}>
                                            <Typography sx={{fontSize: '13px', color: color.white, fontWeight: 500}} onClick={()=>{setOpenedPaperNumber(paperInfo.paperId)}}>
                                                #{paperInfo && paperInfo.title.length > 10 ? paperInfo.title.slice(0,10)+"..." : paperInfo.paperTitle}
                                            </Typography>
                                        </Box>
                                        {term.refPaper.paperTitle && <Box sx={{display: 'inline-flex', alignItems: 'center', gap: 1, px: 2, py: 0.4, mb: 1,
                                        borderRadius: '100px', border: `1px solid ${color.white}`, cursor: 'pointer'}}>
                                            <Typography sx={{fontSize: '13px', color: color.white, fontWeight: 500}} onClick={()=>{setOpenedPaperNumber(term.refPaper.paperId)}}>
                                                #{term.refPaper.paperTitle.length > 10 ? term.refPaper.paperTitle.slice(0,10)+"..." : term.refPaper.paperTitle}
                                            </Typography>
                                        </Box>}
                                            
                                    </Box>
                                    <Box>
                                    {term.draggedText && (term.draggedText.length>15 ? 
                                    <Box sx={{display: 'flex', alignItems: 'center', bgcolor: color.white, borderRadius: '100px', mb: 1}}>
                                    <Box sx={{display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden', mx: 1, my: 0.5, px: 1,}}>
                                        <Typography sx={{color: color.mainGreen, fontSize: '13px', fontWeight: 500}}>
                                        {term.draggedText} 
                                        </Typography>
                                    </Box>
                                    </Box>:
                                    <Box sx={{display: 'flex', alignItems: 'center', mb: 1}}>
                                    <Box sx={{display: 'inline-flex', px: 2, py: 0.5, alignItems: 'center',
                                                bgcolor: color.white, borderRadius: '100px'}}>
                                        <Typography sx={{color: color.mainGreen, fontSize: '13px', fontWeight: 500}}>
                                            {term.draggedText} 
                                        </Typography>
                                    </Box>
                                    </Box>)}
                                    </Box>
                                    <Typography sx={{fontSize: '14px' , color: color.white}}>
                                        {term.searchTerm}
                                    </Typography>
                                    
                                </Box>
                            </Box>
                        
                            {/* <Typography variant="body1" sx={{display:'inline-block', color: color.white, fontSize: '14px'}}>{term}</Typography> */}
                        </Box>
                    </Box>
                    <Box sx={{display: 'flex'}}>
                        <Box sx={{width: '30px', height: '30px', borderRadius: '100%', bgcolor: color.mainGreen,
                            display: 'flex', justifyContent: 'center', alignItems: 'center', mr: 1}}>
                            <img src={chat} alt="chat profile" style={{width: '15px', height: '15px'}}/>
                        </Box>
                        <Box sx={{ backgroundColor: color.white,
                            border: '1px solid #eee',
                            boxShadow: '0px 5px 15px 0px rgba(0, 0, 0, 0.07)',
                            padding: '16px',
                            marginBottom: '10px',
                            borderRadius: '0px 15px 15px 15px',
                            maxWidth: '300px'}}>
                            <Box sx={{display: 'flex', alignItems: 'flex-start'}}>
                                <Box sx={{maxWidth: '300px', display: 'flex', justifyContent: 'space-between', mb: 1}}>
                                
                                    {index>=searchResultsInPaper.length?(
                                        <Typography variant="body1" className={loadingStyle.loading}> <MoreHorizIcon /> </Typography>
                                    ):(
                                        <Typography variant="body1">{searchResultsInPaper[index]}</Typography>                 
                                    )}       
                                </Box>
                            </Box>
                            <Box sx={{display: 'inline-block'}}>
                                {index>= searchResultsProof.length?null:
                                <Box sx={{display: 'inline-block'}}>
                                    {searchResultsProof[index].firstPaperPosition && searchResultsProof[index].firstPaperPosition.position.rects.map((proof: any, idx: number) => (
                                        // <Box sx={{bgcolor: color.secondaryGreen}} onClick={() => handleIndicateProof(searchResultsProof[index].firstPaperPosition.paperId, proof, searchResultsProof[index].firstPaperPosition.position.pageIndex)}>
                                        //     base {idx}
                                        // </Box>
                                        <Box sx={{bgcolor: '#222', px: 1, borderRadius: '100px', display: 'flex', gap: 1, mr: 1}} onClick={() => handleIndicateProof(searchResultsProof[index].firstPaperPosition.paperId, proof, searchResultsProof[index].firstPaperPosition.position.pageIndex)}>
                                            <img src={search} alt="search" />
                                            <Typography sx={{fontSize: '15px', color: color.white}}>
                                                base {idx}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>}
                                {index>= searchResultsProof.length?null:
                                <Box sx={{display: 'inline-block'}}>
                                    {searchResultsProof[index].secondPaperPosition && searchResultsProof[index].secondPaperPosition.position.rects.map((proof: any, idx: number) => (
                                        // <Box sx={{bgcolor: color.arxiv}} onClick={() => handleIndicateProof(searchResultsProof[index].secondPaperPosition.paperId, proof, searchResultsProof[index].secondPaperPosition.position.pageIndex)}>
                                        //     base {idx}
                                        // </Box>
                                        <Box sx={{bgcolor: '#fff', border: '1px solid #222', px: 1, borderRadius: '100px', display: 'flex', gap: 1, mr: 1}} onClick={() => handleIndicateProof(searchResultsProof[index].secondPaperPosition.paperId, proof, searchResultsProof[index].secondPaperPosition.position.pageIndex)}>
                                            <img src={searchBlack} alt="search" />
                                            <Typography sx={{fontSize: '15px', color: '#222'}}>
                                                base {idx}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>}
                                {index>= searchResultsInPaper.length?null:
                                    <Box sx={{}}>
                                        <Box sx={{display: 'flex', flexDirection: 'row'}}>
                                            <CopyClick contents={searchResultsInPaper[index]}/>
                                            {/* <IconButton onClick={() => handleExportAnswer(term, searchResultsInPaper[index])}>
                                                <ExitToAppIcon/>
                                            </IconButton> */}
                                            <Box sx={{width: '30px', height: '30px', borderRadius: '100%', border: '1px solid #ddd',
                                                    display: 'flex', justifyContent: 'center', alignItems: 'center', ml: 1}} onClick={() => handleExportAnswer(term, searchResultsInPaper[index])}>
                                                <ExitToAppIcon sx={{color: '#333', fontSize: '19px'}}/>
                                            </Box>
                                            
                                        </Box>
                                    </Box>}
                            </Box>
                        </Box>
                        </Box>
                    </Box>
                    ))}
                </>
                )}
            </Box>

            <ChatTextField
                searchTerm={searchTermInPaper}
                onChange={setSearchTermInPaper}
                onSearch={handleButtonClickInPaper}
                onSearchKeyDown={handleSearchKeyDownInPaper}
                placeholder="Ask any question"
                sx={{width: "100%", backgroundColor: "#FFFFFF"}}
                selectedText={draggeddText}
                paperInfo={paperInfo}
            />
        </Box>
    </Box>}

    </div>
  )
}

export default Chat