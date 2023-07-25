import * as React from "react";
import { Card, CardContent, Typography, Box } from '@mui/material';
import { Title, useAuthenticated } from 'react-admin';
import { useEffect, useState } from "react";
import * as amplitude from '@amplitude/analytics-browser';
import { UserProfileCheck } from "./component/userProfileCheck";
import { SearchTap } from "./component/searchTap";
import { Link, useNavigate } from 'react-router-dom';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import styles from '../layout/hoverButton.module.css'
import { HistoryNav } from "./component/historyNav";
import loadingStyle from "../layout/loading.module.css"

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

    useEffect(() => {
        amplitude.track("History Page Viewed");
    }, []);

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
        window.location.href = `/history?resultid=${resultId}`

        // const query = new URLSearchParams(window.location.search);
        // const resultid = query.get('resultid') || ''
        // console.log(resultid)
        // setUrlParam(resultid)
    }

    const goToHistory = () => {
        navigate('/history')
        setUrlParam('')
    }
    
    return (

    <div>
        <Title title="히스토리"/>
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
        <Typography variant="h5" sx={{ml: 1}}> 전체검색 히스토리 </Typography>
        {loading?(
            <Box sx={{ display: 'flex', height: '70vh'}} className={loadingStyle.loading}>
                <Box sx={{ width: '80%', m: 2}}>
                    <Card sx={{ p: 2, height: '10vh', backgroundColor: '#999999', opacity: '0.2', marginBottom: '15px'}}></Card>
                    <Card sx={{ p: 2, height: '10vh', backgroundColor: '#999999', opacity: '0.2'}}></Card>
                </Box>
                <Card sx={{ ml: 'auto', mr: '20px', p: '30px 40px', display: 'flex', flexDirection: 'column',borderRadius: '10px', backgroundColor: '#999999', opacity: '0.2', height: '100%', width: '35vh', justifyContent:'space-between'}}>

                </Card>
            </Box>
        ):(
        <Box sx={{ display: 'flex', height: '70vh'}}>
            <Box sx={{ width: '80%', m: 2}}>
                { urlParam !== '' ? ( eachQueryResult && 
                    <Card sx={{ p: 2}}>
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
                    <Card key={result.resultId} sx={{ p:2, mb: 1}}>
                        <Box onClick={()=>handleResultClick(event, result.resultId)} sx={{ display: 'flex', alignItems: 'flex-start'}}>
                            <ContactSupportIcon sx={{mr:1}}/>
                            <Typography sx={{cursor: 'pointer'}}> {result.query} </Typography>
                        </Box>
                    </Card>
                )))
                }
            </Box>
            <HistoryNav goToHistory={goToHistory} papersInNav={papersInNav} trash={false} />
        </Box>
        )}
    </div>
)};
