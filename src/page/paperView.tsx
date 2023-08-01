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

    const sizeTitleInInfo = "h6"
    const sizeContentInInfo = "body1"


    return (
        <div>
            <Title title="자세히보기" />
            
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
                    <Box sx={{margin: '20px 12px'}}>
                        <Typography variant="h5">{paperInfo.title}</Typography>
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
                        <Typography variant="body1">{paperInfo.year} / {paperInfo.conference} / cites: {paperInfo.cites}</Typography>
                    </Box>
                    <div>
                        <Box display="flex" justifyContent="space-between">
                            <Box width="50%" sx={{margin: '10px'}}>
                                <Typography variant="h6">정보</Typography>
                                <Card sx={{ border: `1px solid ${color.mainGreen}`,  padding: '20px', height: '75vh', borderRadius: '15px', backgroundColor: color.mainGreen, 
                                    overflowY: 'scroll'
                                }} className={scrollStyle.scrollBar}>
                                    <GoToArxiv url={paperInfo.url} paperId={paperInfo.paperId}/>
                                    <Typography variant={sizeTitleInInfo}>핵심 인사이트</Typography>
                                    <Box>
                                    {paperInfo.insights && paperInfo.insights.map((insight: string) => (
                                        <Typography variant={sizeContentInInfo}>{insight}</Typography>
                                    ))}
                                    </Box>
                                    
                                    <Typography variant={sizeTitleInInfo}>질문</Typography>
                                    <Box>
                                    {paperInfo.questions && paperInfo.questions.map((question: any, index: number) => (
                                        <Typography key={index} variant={sizeContentInInfo}>{question}</Typography>
                                    ))}
                                    </Box>
                                    <Typography variant={sizeTitleInInfo}>향후 연구주제 추천</Typography>
                                    <Box>
                                    {paperInfo.subjectRecommends && paperInfo.subjectRecommends.map((subjectRecommend: any, index: number) => (
                                        <Typography key={index} variant={sizeContentInInfo}>{subjectRecommend}</Typography>
                                    ))}
                                    </Box>
                                    
                                </Card>
                            </Box>
                            <Box width="50%" sx={{margin: '10px'}}>
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
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                backgroundColor: history.who ? 'white' : color.secondaryGrey,
                                                padding: '10px',
                                                marginBottom: '10px',
                                                borderRadius: '10px',
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'flex-start', marginRight: '10px' }}>
                                                    {history.who ? <Typography>👤</Typography> : 
                                                            <Typography>🍀</Typography>
                                                        }
                                                </Box>
                                                
                                                <Typography variant="body1">{history.content}{history.who? null:
                                                    <Box sx={{display: 'flex', flexDirection: 'row-reverse'}}>
                                                        <CopyClick contents={history.content}/>
                                                    </Box>}
                                                </Typography>
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
                                                            {index>=searchResultsInPaper.length?(
                                                                <Typography variant="body1" className={loadingStyle.loading}> <MoreHorizIcon /> </Typography>
                                                            ):(
                                                                <Typography variant="body1">{searchResultsInPaper[index]}</Typography>                 
                                                            )}
                                                        </Box>
                                                        <Box sx={{display: 'flex', flexDirection: 'row-reverse'}}><CopyClick contents={searchResultsInPaper[index]}/></Box>
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