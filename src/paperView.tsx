import * as React from "react"
import { SearchTap } from "./component/searchTap";
import { useState, useEffect } from "react";
import { Typography, Grid, Box, IconButton, TextField, InputAdornment, Icon } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Title, useAuthenticated } from 'react-admin';
import { useParams } from "react-router";
import { GoToArxiv } from "./component/goToArxiv";
import SearchIcon from "@mui/icons-material/Search";


export const PaperView = () => {
    useAuthenticated();

    const [paperInfo, setPaperInfo] = useState<any>('');
    const [isExpanded, setIsExpanded] = useState(false);
    const [paperHistory, setPaperHistory] = useState<any>('');

    var api = '';
    if (process.env.NODE_ENV === 'development'){
      api = `${import.meta.env.VITE_REACT_APP_LOCAL_SERVER}`
    }
    else if (process.env.NODE_ENV === 'production'){
      api = `${process.env.VITE_REACT_APP_AWS_SERVER}`
    }

    const [searchTerm, setSearchTerm] = useState("");
    const username = sessionStorage.getItem("username");

    const handleChange = (event: any) => {
        setSearchTerm(event.target.value)
    };

    useEffect(()=> {
        const query = new URLSearchParams(window.location.search);
        const paperId = query.get('paperid') || '';
        
        fetch(`${api}/api/paper/${paperId}?username=${username}`)
            .then(response => response.json())
            .then(data => {
                setPaperInfo(data.paperinfo)
                setPaperHistory(data.paperhistory)
            })
            .catch(error => {
                console.error('논문 정보를 불러오는 데 실패하였습니다.')
            })
    }, [])
    
    const handleSearchKeyDown = (event: any) => {
        if (event.key === 'Enter'){
            event.preventDefault();
            //setEnteredSearch(searchResults);
            window.location.href = `/home?query=${searchTerm}`
            //const query = new URLSearchParams();
            //query.set('query', searchTerm);
            //window.history.pushState(null, '', `?query=${searchTerm}`);
            //performSearch();
        }
    }
    
    const handleButtonClick = (event: any) => {
        event.preventDefault();
        //setEnteredSearch(searchResults);
        window.location.href = `/home?query=${searchTerm}`
        //performSearch();
    }

    const handleViewMoreAuthors = () => {
        setIsExpanded(true)
    }

    const handleViewLessAuthors = () => {
        setIsExpanded(false)
    }


    return (
        <div>
            <Title title="자세히보기" />
            <SearchTap
                searchTerm={searchTerm}
                onChange={setSearchTerm}
                onSearch={handleButtonClick}
                onSearchKeyDown={handleSearchKeyDown}
            />
            <Box sx={{margin: '10px'}}>
                <Typography variant="h4">{paperInfo.title}</Typography>
                { paperInfo.authors && (paperInfo.authors.length > 3 
                 ? (
                    !isExpanded ? (
                     <Box sx={{display: 'flex', alignItems: 'center'}}> 
                        <Typography variant="h6"> {paperInfo.authors.slice(0, 3).join(", ")} </Typography>
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
                                    variant="h6"
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
                 : <Typography variant="h6"> {paperInfo.authors.join(", ")} </Typography>) }
                {/* <Typography variant="h6">{paperInfo.authors && (paperInfo.authors.length > 3 ? paperInfo.authors.slice(0, 3).join(", ") : paperInfo.authors.join(", "))}</Typography> */}
                <Typography variant="h6">{paperInfo.year} / {paperInfo.conference} / {paperInfo.cites}</Typography>
            </Box>
            <div>
                <Box display="flex" justifyContent="space-between">
                    <Box width="50%" sx={{margin: '10px'}}>
                        <Typography variant="h5">Information</Typography>
                        <Box sx={{ border: '1px solid #E6E6FA',  padding: '20px', height: '75vh', borderRadius: '15px', backgroundColor: '#E6E6FA', 
                            overflowY: 'scroll',
                            scrollbarWidth: 'thin',
                        }}>
                            <GoToArxiv url={paperInfo.url} />
                            <Typography variant="h5">요약</Typography>
                            <Typography variant="h6"> {paperInfo.summary} </Typography>
                            <Typography variant="h5">인사이트</Typography>
                            <Box>
                            {paperInfo.insights && paperInfo.insights.map((insight: string) => (
                                <Typography variant="h6">{insight}</Typography>
                            ))}
                            </Box>
                            <Typography variant="h5">질문</Typography>
                            <Box>
                            {paperInfo.questions && paperInfo.questions.map((question: any) => (
                                <Typography variant="h6">{question}</Typography>
                            ))}
                            </Box>
                            <Typography variant="h5">향후 연구주제 추천</Typography>
                            <Box>
                            {paperInfo.subjectrecommends && paperInfo.subjectrecommends.map((subjectrecommend: any) => (
                                <Typography variant="h6">{subjectrecommend}</Typography>
                            ))}
                            </Box>
                            <Typography variant="h5">레퍼런스</Typography>
                            <Box>
                            {paperInfo.references && paperInfo.references.map((reference: any) => (
                                <Typography variant="h6">{reference}</Typography>
                            ))}
                            </Box>
                        </Box>
                    </Box>
                    <Box width="50%" sx={{margin: '10px'}}>
                    {/* true: user(question) false: gpt (answer) */}
                        <Box>
                            <Typography variant="h5">현 논문 내 질의</Typography>
                            <Box sx={{ border: '1px solid #DCDCDC',  padding: '20px', height: '75vh', borderRadius: '15px', backgroundColor: '#DCDCDC', 
                            overflowY: 'scroll',
                            display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'
                            }}>
                                {paperHistory &&
                                paperHistory.map((history: any, index: number) => (
                                <Box key={index} sx={{ backgroundColor: '#FFFFFF', padding: '10px', marginBottom: '10px' }}>
                                    <Typography variant="body1">{history.content}</Typography>
                                </Box>
                                ))}
                                <TextField 
                                type="search"
                                placeholder="이 논문에서 실험1 내용을 요약해줘"
                                label="Search"
                                sx={{width: "100%", backgroundColor: "#FFFFFF"}}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton>
                                                <SearchIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}/>
                            </Box>
                        </Box>

                    </Box>
                </Box>
            </div>
        </div>
    );
}