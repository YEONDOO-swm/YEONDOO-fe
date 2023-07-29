import * as React from "react";
import { Card, CardContent, Typography, Box } from '@mui/material';
import { Title, useAuthenticated } from 'react-admin';
import { useEffect, useState } from "react";
import * as amplitude from '@amplitude/analytics-browser';
import { UserProfileCheck } from "../component/userProfileCheck";
import { SearchTap } from "../component/searchTap";
import { Link, useNavigate } from 'react-router-dom';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import styles from '../layout/hoverButton.module.css'
import { HistoryNav } from "../component/historyNav";
import loadingStyle from "../layout/loading.module.css"
import scrollStyle from "../layout/scroll.module.css"
import { color } from "../layout/color";

export const History = () => {
    useAuthenticated();
    UserProfileCheck();

    var api = '';
    if (process.env.NODE_ENV === 'development'){
      api = `${import.meta.env.VITE_REACT_APP_LOCAL_SERVER}`
    }
    else if (process.env.NODE_ENV === 'production'){
      api = `${process.env.VITE_REACT_APP_AWS_SERVER}`
    }

    const username = sessionStorage.getItem('username');
    const [papersInNav, setPapersInNav] = useState<any>([])
    const [results, setResults] = useState<any>([])
    const [urlParam, setUrlParam] = useState('')
    const [eachQueryResult, setEachQueryResult] = useState<any>('')
    const [loading, setLoading] = useState<boolean>(false)
    const navigate = useNavigate()

    useEffect(()=>{
        amplitude.track("전체 검색 History Page Viewed");
        setLoading(true)
        fetch(`${api}/api/history/search?username=${username}`)
        .then(response => response.json())
        .then(data => {
            setPapersInNav(data.papers)
            setResults(data.results)
            setLoading(false)
        })
        .catch(error => {
            console.error('히스토리 정보를 가져오는데 실패하였습니다: ', error)
            setLoading(false)
        })

        setEachQueryResult('')

        const query = new URLSearchParams(window.location.search);
        const resultid = query.get('resultid') || ''

        if (resultid !== ''){
            setUrlParam(resultid)
            fetch(`${api}/api/history/search/result/${resultid}?username=${username}`)
            .then(response => response.json())
            .then(data => {
                setEachQueryResult(data)
            })
        }
    },[])

    var api = '';
    if (process.env.NODE_ENV === 'development'){
      api = `${import.meta.env.VITE_REACT_APP_LOCAL_SERVER}`
    }
    else if (process.env.NODE_ENV === 'production'){
      api = `${process.env.VITE_REACT_APP_AWS_SERVER}`
    }

    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchKeyDown = (event: any) => {
        if (event.key === 'Enter'){
            event.preventDefault();
            window.location.href = `/home?query=${searchTerm}`
        }
    }
    
    const handleButtonClick = (event: any) => {
        event.preventDefault();
        window.location.href = `/home?query=${searchTerm}`
    }

    const handleResultClick = (event: any, resultId: string) => {
        event.preventDefault();
        amplitude.track("전체 검색 History List Clicked")
        window.location.href = `/history?resultid=${resultId}`

        // const query = new URLSearchParams(window.location.search);
        // const resultid = query.get('resultid') || ''
        // console.log(resultid)
        // setUrlParam(resultid)
    }
    
    return (

    <div>
        <Title title="히스토리"/>
        <Box sx={{height: 50}}></Box>
        {loading?(
            <Box sx={{ height: '80vh'}} className={loadingStyle.loading}>
                <HistoryNav page="totalSearch" />
                <Box sx={{ width: '90%', m: 2}}>
                    <Card sx={{ p: 2, height: '20vh', backgroundColor: color.loadingColor, opacity: '0.2', marginBottom: '15px'}}></Card>                  
                </Box>
                
            </Box>
        ):(
        <Box sx={{ height: '80vh'}}>
            <HistoryNav page="totalSearch" />
            <Box sx={{ width: '90%', m: 2, overflowY: 'scroll'}} className={scrollStyle.scrollBar}>
                { urlParam !== '' ? ( eachQueryResult && 
                    <Card sx={{ p: 2, backgroundColor: color.secondaryGrey }}>
                        <Typography variant="h6"> {eachQueryResult.query} </Typography>
                        <Typography> {eachQueryResult.answer} </Typography>
                        <br />
                        <b>reference:</b> {eachQueryResult.papers.map((paper:any, index:number) =>(
                            <Box>
                                [{index + 1}] {paper.title} (
                                {paper.authors.map((author: any) => (
                                    author
                                ))}, {paper.year}, {paper.conference}, cites: {paper.cites})
                                <Typography >
                                    <a href={paper.url} target="_blank" rel="noopener noreferrer">{paper.url}</a>
                                </Typography>
                            </Box>
                        ))}
                    </Card>
                    
                ) : 
                (results && results.map((result: any) => (
                    <Card key={result.rid} sx={{ p:2, mb: 1}}>
                        <Box onClick={()=>handleResultClick(event, result.rid)} sx={{ display: 'flex', alignItems: 'flex-start'}}>
                            <ContactSupportIcon sx={{mr:1}}/>
                            <Typography sx={{cursor: 'pointer'}}> {result.query} </Typography>
                        </Box>
                    </Card>
                )))
                }
            </Box>
            
        </Box>
        )}
    </div>
)};
