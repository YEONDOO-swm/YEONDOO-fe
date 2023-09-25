import * as React from "react"
import { SearchTap } from "../component/searchTap";
import { useState, useEffect, useRef, KeyboardEvent, MouseEvent } from "react";
import { Typography, Grid, Box, IconButton, TextField, InputAdornment, Icon, Card, CardContent } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Title, useAuthenticated, useNotify } from 'react-admin';
import { useParams } from "react-router";
import { GoToArxiv } from "../component/goToArxiv";
import SearchIcon from "@mui/icons-material/Search";
import { UserProfileCheck } from "../component/userProfileCheck";
import loadingStyle from "../layout/loading.module.css"
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import scrollStyle from "../layout/scroll.module.css"
import { color } from "../layout/color"
import * as amplitude from '@amplitude/analytics-browser';
import CopyClick from "../component/copyClick";
import { HeartClick } from "../component/heartClick";
import MetaTag from "../SEOMetaTag";
import ScoreSlider from "../component/scoreSlider";
import * as Sentry from '@sentry/react';
import { getCookie, setCookie } from "../cookie";
import { useSelector } from "react-redux";
import { CounterState } from "../reducer";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import PageLayout from "../layout/pageLayout";

// TODO1: list 제한 걸기
// TODO2: 스크롤

type history = {
    who: boolean;
    content: string;
    id: number;
    score: number | null;
}

export const PaperView = () => {
    useAuthenticated();

    const notify = useNotify()

    const [searchTermInPaper, setSearchTermInPaper] = useState<string>(""); // 변화하는 입력값
    const [enteredSearchTermInPaper, setEnteredSearchTermInPaper] = useState<string[]>([]); // 전체 입력값
    const workspaceId = Number(sessionStorage.getItem("workspaceId"));
    
    const [isExpanded, setIsExpanded] = useState<boolean>(false); // author
    
    const [searchResultsInPaper, setSearchResultsInPaper] = useState<string[]>([])

    const [isFirstWord, setIsFirstWord] = useState<boolean>(true) // 스트리밍 응답 저장시 필요
    const [key, setKey] = useState<number>(); // 스트리밍 데이터 + 기본 데이터 받기 위해
    const [resultId, setResultId] = useState<number>(1)

    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    
    const api: string = useSelector((state: CounterState) => state.api)

    const navigate = useNavigate()

    const query = new URLSearchParams(window.location.search);
    const paperId: string = query.get('paperid') || '';
    const { data, isLoading } = useQuery(["paperView", api, paperId, workspaceId], 
        ()=> fetch(`${api}/api/paper/${paperId}?workspaceId=${workspaceId}`,{
            headers: {
                "Gauth": getCookie('access')
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
            throw new Error("논문 내 질의 히스토리 정보를 가져오는데 실패하였습니다")
        }),
        {
            onError: (error) => {
                console.error('논문 정보를 불러오는 데 실패하였습니다:', error)
                Sentry.captureException(error)
            }
        })


    useEffect(() => {
        if (process.env.NODE_ENV === 'production') {
            amplitude.track('AI와 논문 읽기 Page Viewed', {paperId: paperId})
        }
    }, [])

    useEffect(() => {
        scrollContainerRef.current?.scrollTo(0, scrollContainerRef.current.scrollHeight);
      }, [data, enteredSearchTermInPaper, searchResultsInPaper]);
    

    const handleSearchKeyDownInPaper = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && event.nativeEvent.isComposing === false){
            event.preventDefault();
            const query = new URLSearchParams(window.location.search);
            const paperId: string = query.get('paperid') || '';
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
        const query = new URLSearchParams(window.location.search);
        const paperId: string = query.get('paperid') || '';
        amplitude.track('논문 내 질의', {paperId: paperId})
        if (searchTermInPaper === '') {
            notify('Please enter your question', {type: 'error'})
            return ;
        }
        performSearchInPaper();
    }

    const handleViewMoreAuthors = () => {
        const query = new URLSearchParams(window.location.search);
        const paperId: string = query.get('paperid') || '';
        amplitude.track('저자 더보기 Button Clicked', {paperId: paperId})
        setIsExpanded(true)
    }

    const performSearchInPaper = async () => {
        if (searchTermInPaper != ''){
            setEnteredSearchTermInPaper((prevEnteredSearchTerm: string[])=>[...prevEnteredSearchTerm, searchTermInPaper])      
        }
        setSearchTermInPaper("")
        const query = new URLSearchParams(window.location.search);
        const paperId: string = query.get('paperid') || '';
        try {
            setKey(Math.floor(Math.random()*1000000000))
            const response = await fetch(`${api}/api/paper/${paperId}?workspaceId=${workspaceId}&key=${key}`,{
                method: 'POST',
                headers : { 'Content-Type' : 'application/json',
            'Gauth': getCookie('access') },
                body: JSON.stringify({question: searchTermInPaper})
            })

            if (response.status === 401) {

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
            const response = await fetch(`${api}/api/paper/${paperId}?workspaceId=${workspaceId}&key=${key}`)
            const data = await response.json()
            setResultId(data)
        }
    }

    const handleViewLessAuthors = () => {
        setIsExpanded(false)
    }

    const sizeTitleInInfo = "body1"
    const sizeContentInInfo = "body1"

    return (
        <PageLayout workspace={true} number={2}>
            <MetaTag title="Chat with AI - Yeondoo" description="AI가 제공한 논문의 핵심 인사이트, 질문, 향후 연구주제 추천을 볼 수 있고, 직접 AI에게 논문에 대해서 궁금한 내용을 질문할 수 있습니다." keywords="논문, AI, 질문, 핵심 인사이트, 질문, 향후 연구주제 추천, 현 논문 내 질의, gpt"/>
            <Title title="Chat with AI" />
            {isLoading ? (<div className={loadingStyle.loading}>
            <Box sx={{m:2, p:3, color: color.loadingColor, opacity: '0.8'}}>
                <Typography>This may take about 1 minute</Typography>
            </Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Card sx={{ border: `1px solid ${color.loadingColor}`, margin: '10px', padding: '20px', height: '70vh', borderRadius: '15px', backgroundColor: color.loadingColor, opacity: '0.2'}}></Card>
                </Grid>
                <Grid item xs={6}>
                <Card sx={{ border: `1px solid ${color.loadingColor}`, margin: '10px', padding: '20px', height: '70vh', borderRadius: '15px', backgroundColor: color.loadingColor, opacity: '0.2'}}></Card>
                </Grid>
              </Grid>
            </div>) :(
                    <div>
                    <Box sx={{display: 'flex', justifyContent: 'space-between',margin: '20px 12px'}}>
                    <Box sx={{}}>
                        <Box sx={{display: 'flex', alignItems: 'flex-start'}}>
                            <Typography variant="h5" sx={{mr: 2}}>{data.paperInfo.title}</Typography>
                            <GoToArxiv url={data.paperInfo.url} paperId={data.paperInfo.paperId}/>
                        </Box>
                        { data.paperInfo.authors && (data.paperInfo.authors.length > 3 
                        ? (
                            !isExpanded ? (
                            <Box sx={{display: 'flex', alignItems: 'center'}}> 
                                <Typography variant="body1"> {data.paperInfo.authors.slice(0, 3).join(", ")} </Typography>
                                <IconButton onClick={handleViewMoreAuthors}>
                                    <ExpandMoreIcon />
                                </IconButton>
                            </Box>
                            ) : (
                                <Box sx={{display: 'flex',alignItems: 'flex-end', marginTop: '10px'}}>
                                    <Box> 
                                        {data.paperInfo.authors.map((author: string, index: number) => (
                                            <Typography
                                            key={index}
                                            variant="body1"
                                            sx={{ marginRight: '10px' }}
                                            >
                                            {author}
                                            </Typography>
                                        ))}
                                    </Box>
                                    <IconButton onClick={handleViewLessAuthors}>
                                        <ExpandLessIcon />
                                    </IconButton>
                                </Box>
                            )
                        )           
                        : <Typography variant="body1"> {data.paperInfo.authors.join(", ")} </Typography>) }
                        {/* <Typography variant="h6">{data.paperInfo.authors && (data.paperInfo.authors.length > 3 ? data.paperInfo.authors.slice(0, 3).join(", ") : data.paperInfo.authors.join(", "))}</Typography> */}
                        <Typography variant="body1"> {data.paperInfo.year} </Typography>
                    </Box>
                    <Box sx={{}}>
                        <HeartClick currentItem={data.paperInfo} paperlike={data.paperInfo.isLike} />
                    </Box>
                    </Box>
                    <div>
                        <Box display="flex" justifyContent="space-between">
                            <Box width="50%" sx={{margin: '0 10px 10px 10px'}}>
                                <Typography variant="h6">Information</Typography>
                                <Card sx={{ border: `1px solid ${color.mainGreen}`, padding: '20px', height: '75vh', borderRadius: '15px', backgroundColor: color.mainGreen, 
                                    overflowY: 'scroll'
                                }} className={scrollStyle.scrollBar}>
                                    <Box>   
                                        <Typography variant={sizeTitleInInfo} sx={{fontWeight: 'bold'}}>Key Insights</Typography>
                                        <Box sx={{mb: 2, marginLeft: '5px'}}>
                                        {data.paperInfo.insights && data.paperInfo.insights.map((insight: string, index: number) => (
                                            <Typography key={index} variant={sizeContentInInfo}>{insight}</Typography>
                                        ))}
                                        </Box>
                                        
                                        <Typography variant={sizeTitleInInfo} sx={{fontWeight: 'bold'}}>Questions</Typography>
                                        <Box sx={{mb: 2, marginLeft: '5px'}}>
                                        {data.paperInfo.questions && data.paperInfo.questions.map((question: string, index: number) => (
                                            <Typography key={index} variant={sizeContentInInfo}>{question}</Typography>
                                        ))}
                                        </Box>
                                        <Typography variant={sizeTitleInInfo} sx={{fontWeight: 'bold'}}>Recommended Future Topics</Typography>
                                        <Box sx={{mb: 2, marginLeft: '5px'}}>
                                        {data.paperInfo.subjectRecommends && data.paperInfo.subjectRecommends.map((subjectRecommend: string, index: number) => (
                                            <Typography key={index} variant={sizeContentInInfo}>{subjectRecommend}</Typography>
                                        ))}
                                        </Box>
                                    </Box>
                                </Card>
                            </Box>
                            <Box width="50%" sx={{margin: '0 10px 10px 10px'}}>
                            {/* true: user(question) false: gpt (answer) */}
                                <Box>
                                    <Typography variant="h6">Chat</Typography>
                                    <Box sx={{ border: `1px solid ${color.mainGrey}`,  padding: '20px', height: '75vh', borderRadius: '15px', backgroundColor: color.mainGrey, 
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
                                                            <Box sx={{ml: 1}}>
                                                                <CopyClick contents={history.content}/>
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
                                                                    <Box sx={{ml: 1}}>
                                                                        <CopyClick contents={searchResultsInPaper[index]}/>
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
        
                                        <SearchTap
                                            searchTerm={searchTermInPaper}
                                            onChange={setSearchTermInPaper}
                                            onSearch={handleButtonClickInPaper}
                                            onSearchKeyDown={handleSearchKeyDownInPaper}
                                            placeholder="이 논문에서 실험 1의 결과를 요약해줘"
                                            sx={{width: "100%", backgroundColor: "#FFFFFF"}}
                                        />
                                    </Box>
                                </Box>
        
                            </Box>
                        </Box>
                    </div>
                    </div>
            )}
        </PageLayout>
    );
}