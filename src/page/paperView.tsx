import * as React from "react"
import { SearchTap } from "../component/searchTap";
import { useState, useEffect, useRef } from "react";
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

// TODO1: list 제한 걸기
// TODO2: 스크롤

export const PaperView = () => {
    useAuthenticated();
    UserProfileCheck();

    const notify = useNotify()

    const [searchTerm, setSearchTerm] = useState("");
    const [enteredSearchTermInPaper, setEnteredSearchTermInPaper] = useState<any>([]);
    const username = sessionStorage.getItem("username");
    
    const [paperInfo, setPaperInfo] = useState<any>('');
    const [isExpanded, setIsExpanded] = useState(false);
    const [paperHistory, setPaperHistory] = useState<any>('');
    const [searchTermInPaper, setSearchTermInPaper] = useState("");
    const [searchResultsInPaper, setSearchResultsInPaper] = useState<any>([])
    const [loading, setLoading] = useState<boolean>(false)

    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    
    var api = '';
    if (process.env.NODE_ENV === 'development'){
      api = `${import.meta.env.VITE_REACT_APP_LOCAL_SERVER}`
    }
    else if (process.env.NODE_ENV === 'production'){
      api = `${process.env.VITE_REACT_APP_AWS_SERVER}`
    }

    const handleChange = (event: any) => {
        setSearchTerm(event.target.value)
    };

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const paperId = query.get('paperid') || '';
        if (process.env.NODE_ENV === 'production') {
            
            amplitude.track('AI와 논문 읽기 Page Viewed', {paperId: paperId})
        }

        setLoading(true)
        
        fetch(`${api}/api/paper/${paperId}?username=${username}`)
            .then(response => response.json())
            .then(data => {
                setPaperInfo(data.paperInfo)
                setPaperHistory(data.paperHistory)
                setLoading(false)
            })
            .catch(error => {
                console.error('논문 정보를 불러오는 데 실패하였습니다:', error)
                setLoading(false)
            })
    }, [])

    useEffect(() => {
        scrollContainerRef.current?.scrollTo(0, scrollContainerRef.current.scrollHeight);
      }, [paperHistory, enteredSearchTermInPaper, searchResultsInPaper]);
    

    const handleSearchKeyDownInPaper = (event: any) => {
        if (event.key === 'Enter' && event.nativeEvent.isComposing === false){
            event.preventDefault();
            const query = new URLSearchParams(window.location.search);
            const paperId = query.get('paperid') || '';
            amplitude.track('논문 내 질의', {paperId: paperId})
            if (searchTermInPaper === '') {
                notify('질문을 입력해 주세요.', {type: 'error'})
                return ;
            }
            performSearchInPaper()
        }
    }

    const handleButtonClickInPaper = (event: any) => {
        event.preventDefault();
        const query = new URLSearchParams(window.location.search);
        const paperId = query.get('paperid') || '';
        amplitude.track('논문 내 질의', {paperId: paperId})
        if (searchTermInPaper === '') {
            notify('질문을 입력해 주세요.', {type: 'error'})
            return ;
        }
        performSearchInPaper();
    }

    const handleViewMoreAuthors = () => {
        const query = new URLSearchParams(window.location.search);
        const paperId = query.get('paperid') || '';
        amplitude.track('저자 더보기 Button Clicked', {paperId: paperId})
        setIsExpanded(true)
    }

    const performSearchInPaper = async () => {
        if (searchTermInPaper != ''){
            setEnteredSearchTermInPaper((prevEnteredSearchTerm: any)=>[...prevEnteredSearchTerm, searchTermInPaper])      
        }
        setSearchTermInPaper("")
        const query = new URLSearchParams(window.location.search);
        const paperId = query.get('paperid') || '';
        await fetch(`${api}/api/paper/${paperId}?username=${username}`,{
            method: 'POST',
            headers : { 'Content-Type' : 'application/json' },
            body: JSON.stringify({question: searchTermInPaper})
        })
        .then(response => response.json())
        .then(data => {
            setSearchResultsInPaper((prevSearchResults: any) => [...prevSearchResults, data.answer])
            //setSearchTermInPaper("")
        })
        .catch(error => {
            console.error("논문 내 질문 오류")
        })
    }

    const handleViewLessAuthors = () => {
        setIsExpanded(false)
    }

    const sizeTitleInInfo = "body1"
    const sizeContentInInfo = "body1"


    return (
        <div>
            <MetaTag title="AI와 논문읽기" description="AI가 제공한 논문의 핵심 인사이트, 질문, 향후 연구주제 추천을 볼 수 있고, 직접 AI에게 논문에 대해서 궁금한 내용을 질문할 수 있습니다." keywords="논문, AI, 질문, 핵심 인사이트, 질문, 향후 연구주제 추천, 현 논문 내 질의, gpt"/>
            <Title title="AI와 논문읽기" />
            {loading ? (<div className={loadingStyle.loading}>
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
                        <Box sx={{display: 'flex'}}>
                            <Typography variant="h5" sx={{mr: 2}}>{paperInfo.title}</Typography>
                            <GoToArxiv url={paperInfo.url} paperId={paperInfo.paperId}/>
                        </Box>
                        { paperInfo.authors && (paperInfo.authors.length > 3 
                        ? (
                            !isExpanded ? (
                            <Box sx={{display: 'flex', alignItems: 'center'}}> 
                                <Typography variant="body1"> {paperInfo.authors.slice(0, 3).join(", ")} </Typography>
                                <IconButton onClick={handleViewMoreAuthors}>
                                    <ExpandMoreIcon />
                                </IconButton>
                            </Box>
                            ) : (
                                <Box sx={{display: 'flex',alignItems: 'flex-end', marginTop: '10px'}}>
                                    <Box> 
                                        {paperInfo.authors.map((author: any, index: number) => (
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
                        : <Typography variant="body1"> {paperInfo.authors.join(", ")} </Typography>) }
                        {/* <Typography variant="h6">{paperInfo.authors && (paperInfo.authors.length > 3 ? paperInfo.authors.slice(0, 3).join(", ") : paperInfo.authors.join(", "))}</Typography> */}
                        <Typography variant="body1"> Arxiv 제출: {paperInfo.year} / 컨퍼런스 제출: {paperInfo.conference} / cites: {paperInfo.cites}</Typography>
                    </Box>
                    <Box sx={{}}>
                        <HeartClick currentItem={paperInfo} paperlike={paperInfo.isLike} />
                    </Box>
                    </Box>
                    <div>
                        <Box display="flex" justifyContent="space-between">
                            <Box width="50%" sx={{margin: '0 10px 10px 10px'}}>
                                <Typography variant="h6">정보</Typography>
                                <Card sx={{ border: `1px solid ${color.mainGreen}`, padding: '20px', height: '75vh', borderRadius: '15px', backgroundColor: color.mainGreen, 
                                    overflowY: 'scroll'
                                }} className={scrollStyle.scrollBar}>
                                    <Box>   
                                        <Typography variant={sizeTitleInInfo} sx={{fontWeight: 'bold'}}>핵심 인사이트</Typography>
                                        <Box sx={{mb: 2, marginLeft: '5px'}}>
                                        {paperInfo.insights && paperInfo.insights.map((insight: string, index: number) => (
                                            <Typography key={index} variant={sizeContentInInfo}>{insight}</Typography>
                                        ))}
                                        </Box>
                                        
                                        <Typography variant={sizeTitleInInfo} sx={{fontWeight: 'bold'}}>질문</Typography>
                                        <Box sx={{mb: 2, marginLeft: '5px'}}>
                                        {paperInfo.questions && paperInfo.questions.map((question: any, index: number) => (
                                            <Typography key={index} variant={sizeContentInInfo}>{question}</Typography>
                                        ))}
                                        </Box>
                                        <Typography variant={sizeTitleInInfo} sx={{fontWeight: 'bold'}}>향후 연구주제 추천</Typography>
                                        <Box sx={{mb: 2, marginLeft: '5px'}}>
                                        {paperInfo.subjectRecommends && paperInfo.subjectRecommends.map((subjectRecommend: any, index: number) => (
                                            <Typography key={index} variant={sizeContentInInfo}>{subjectRecommend}</Typography>
                                        ))}
                                        </Box>
                                    </Box>
                                </Card>
                            </Box>
                            <Box width="50%" sx={{margin: '0 10px 10px 10px'}}>
                            {/* true: user(question) false: gpt (answer) */}
                                <Box>
                                    <Typography variant="h6">현 논문 내 질의</Typography>
                                    <Box sx={{ border: `1px solid ${color.mainGrey}`,  padding: '20px', height: '75vh', borderRadius: '15px', backgroundColor: color.mainGrey, 
                                    display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                                    }}>
                                        <Box sx={{ overflowY: 'scroll' }} ref={scrollContainerRef} className={scrollStyle.scrollBar}>
                                            {paperHistory &&
                                            paperHistory.map((history: any, index: number) => (
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
                                                    <Box>
                                                        {history.content}
                                                        {history.who? null:
                                                        <Box sx={{display: 'flex', flexDirection: 'row-reverse'}}>
                                                            <CopyClick contents={history.content}/>
                                                            
                                                        </Box>}
                                                        {history.who? null:
                                                        <ScoreSlider id={history.id} score={history.score}/>}
                                                        
                                                    </Box>
                                                    
                                                </Box>
                                                
                                            </Box>
                                            
                                            ))}
                                            {enteredSearchTermInPaper && searchResultsInPaper && (
                                            <>
                                                {enteredSearchTermInPaper.map((term:any, index:number) => (
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
                                                            <Box>
                                                                {index>=searchResultsInPaper.length?(
                                                                    <Typography variant="body1" className={loadingStyle.loading}> <MoreHorizIcon /> </Typography>
                                                                ):(
                                                                    <Typography variant="body1">{searchResultsInPaper[index]}</Typography>                 
                                                                )}
                                                                {index>= searchResultsInPaper.length?null:<Box sx={{display: 'flex', flexDirection: 'row-reverse'}}><CopyClick contents={searchResultsInPaper[index]}/></Box>}
                                                            <ScoreSlider />
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
        </div>
    );
}