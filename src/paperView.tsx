import * as React from "react"
import { SearchTap } from "./component/searchTap";
import { useState, useEffect, useRef } from "react";
import { Typography, Grid, Box, IconButton, TextField, InputAdornment, Icon } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Title, useAuthenticated } from 'react-admin';
import { useParams } from "react-router";
import { GoToArxiv } from "./component/goToArxiv";
import SearchIcon from "@mui/icons-material/Search";
import { UserProfileCheck } from "./component/userProfileCheck";
// TODO1: list 제한 걸기
// TODO2: 스크롤

export const PaperView = () => {
    useAuthenticated();
    UserProfileCheck();

    const [searchTerm, setSearchTerm] = useState("");
    const [enteredSearchTermInPaper, setEnteredSearchTermInPaper] = useState<any>([]);
    const username = sessionStorage.getItem("username");
    
    const [paperInfo, setPaperInfo] = useState<any>('');
    const [isExpanded, setIsExpanded] = useState(false);
    const [paperHistory, setPaperHistory] = useState<any>('');
    const [searchTermInPaper, setSearchTermInPaper] = useState("");
    const [searchResultsInPaper, setSearchResultsInPaper] = useState<any>([])
    
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

    useEffect(()=> {
        console.log("in useeffect")

        const query = new URLSearchParams(window.location.search);
        const paperId = query.get('paperid') || '';
        
        fetch(`${api}/api/paper/${paperId}?username=${username}`)
            .then(response => response.json())
            .then(data => {
                setPaperInfo(data.paperinfo)
                setPaperHistory(data.paperhistory)
            })
            .catch(error => {
                console.error('논문 정보를 불러오는 데 실패하였습니다:', error)
            })
    }, [])
    
    const handleSearchKeyDown = (event: any) => {
        if (event.key === 'Enter'){
            event.preventDefault();
            //setEnteredSearch(searchResults);
            window.location.href = `/home?query=${searchTerm}`
        }
    }
    
    const handleButtonClick = (event: any) => {
        event.preventDefault();
        //setEnteredSearch(searchResults);
        window.location.href = `/home?query=${searchTerm}`
        //performSearch();
    }

    const handleSearchKeyDownInPaper = (event: any) => {
        if (event.key === 'Enter'){
            event.preventDefault();
            performSearchInPaper()
        }
    }

    const handleButtonClickInPaper = (event: any) => {
        event.preventDefault();
        performSearchInPaper();
    }

    const handleViewMoreAuthors = () => {
        setIsExpanded(true)
    }

    const performSearchInPaper = async () => {
        //console.log(searchTermInPaper)
        //const a = searchTermInPaper
        //console.log(a)
        setEnteredSearchTermInPaper([...enteredSearchTermInPaper, searchTermInPaper])
        console.log(enteredSearchTermInPaper)
        const query = new URLSearchParams(window.location.search);
        const paperId = query.get('paperid') || '';
        fetch(`${api}/api/paper/${paperId}`,{
            method: 'POST',
            headers : { 'Content-Type' : 'application/json' },
            body: JSON.stringify({question: searchTermInPaper})
        })
        .then(response => response.json())
        .then(data => {
            //console.log(data.answer)
            setSearchResultsInPaper([...searchResultsInPaper, data.answer])
            setSearchTermInPaper("")
        })
        .catch(error => {
            console.error("논문 내 질문 오류")
        })

        // try {
        //     console.log(searchTermInPaper)
        //     const query = new URLSearchParams(window.location.search);
        //     const paperId = query.get('paperid') || '';
        //     const response = await fetch(`${api}/api/${paperId}`)


        // } catch (error) {
        //     console.log('검색 결과에서 오류가 발생했습니다.')
        // }
    }

    const handleViewLessAuthors = () => {
        setIsExpanded(false)
    }

    const sizeTitleInInfo = "body1"
    const sizeContentInInfo = "body2"


    return (
        <div>
            <Title title="자세히보기" />
            <SearchTap
                searchTerm={searchTerm}
                onChange={setSearchTerm}
                onSearch={handleButtonClick}
                onSearchKeyDown={handleSearchKeyDown}
                placeholder="CNN과 관련된 논문을 찾아줘"
                firstBoxSx={{ margin: '30px auto' }}
                middleBoxSx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                sx={{width: "80%"}}
            />
            <Box sx={{margin: '10px'}}>
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
                                {paperInfo.authors.map((author: any) => (
                                    <Typography
                                    key={author}
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
                <Typography variant="body1">{paperInfo.year} / {paperInfo.conference} / {paperInfo.cites}</Typography>
            </Box>
            <div>
                <Box display="flex" justifyContent="space-between">
                    <Box width="50%" sx={{margin: '10px'}}>
                        <Typography variant="h6">Information</Typography>
                        <Box sx={{ border: '1px solid #E6E6FA',  padding: '20px', height: '75vh', borderRadius: '15px', backgroundColor: '#E6E6FA', 
                            overflowY: 'scroll',
                            scrollbarWidth: 'thin',
                        }}>
                            <GoToArxiv url={paperInfo.url} />
                            <Typography variant={sizeTitleInInfo}>요약</Typography>
                            <Typography variant={sizeContentInInfo}> {paperInfo.summary} </Typography>
                            <Typography variant={sizeTitleInInfo}>인사이트</Typography>
                            <Box>
                            {paperInfo.insights && paperInfo.insights.map((insight: string) => (
                                <Typography variant={sizeContentInInfo}>{insight}</Typography>
                            ))}
                            </Box>
                            <Typography variant={sizeTitleInInfo}>질문</Typography>
                            <Box>
                            {paperInfo.questions && paperInfo.questions.map((question: any) => (
                                <Typography variant={sizeContentInInfo}>{question}</Typography>
                            ))}
                            </Box>
                            <Typography variant={sizeTitleInInfo}>향후 연구주제 추천</Typography>
                            <Box>
                            {paperInfo.subjectrecommends && paperInfo.subjectrecommends.map((subjectrecommend: any) => (
                                <Typography variant={sizeContentInInfo}>{subjectrecommend}</Typography>
                            ))}
                            </Box>
                            <Typography variant={sizeTitleInInfo}>레퍼런스</Typography>
                            <Box>
                            {paperInfo.references && paperInfo.references.map((reference: any) => (
                                <Typography variant={sizeContentInInfo}>{reference}</Typography>
                            ))}
                            </Box>
                        </Box>
                    </Box>
                    <Box width="50%" sx={{margin: '10px'}}>
                    {/* true: user(question) false: gpt (answer) */}
                        <Box>
                            <Typography variant="h6">현 논문 내 질의</Typography>
                            <Box sx={{ border: '1px solid #DCDCDC',  padding: '20px', height: '75vh', borderRadius: '15px', backgroundColor: '#DCDCDC', 
                            display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                            }}>
                                <Box sx={{ overflowY: 'scroll' }}>
                                    {paperHistory &&
                                    paperHistory.map((history: any, index: number) => (
                                    <Box key={index} sx={{ backgroundColor: '#FFFFFF', padding: '10px', marginBottom: '10px' }}>
                                        <Typography variant="body1">{history.content}</Typography>
                                    </Box>
                                    ))}
                                    {enteredSearchTermInPaper && searchResultsInPaper && enteredSearchTermInPaper.length === searchResultsInPaper.length && (
                                    <>
                                        {enteredSearchTermInPaper.map((term:any, index:number) => (
                                        <>
                                            <Box sx={{ backgroundColor: '#FFFFFF', padding: '10px', marginBottom: '10px' }}>
                                            <Typography variant="body1">{term}</Typography>
                                            </Box> 
                                            <Box sx={{ backgroundColor: '#FFFFFF', padding: '10px', marginBottom: '10px' }}>
                                            <Typography variant="body1">{searchResultsInPaper[index]}</Typography>
                                            </Box>
                                        </>
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
    );
}