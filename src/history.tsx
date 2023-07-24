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
    const navigate = useNavigate()

    useEffect(()=>{
     fetch(`${api}/api/history/search?username=${username}`)
        .then(response => response.json())
        .then(data => {
            setPapersInNav(data.papers)
            setResults(data.results)
        })
        .catch(error => {
            console.error('히스토리 정보를 가져오는데 실패하였습니다: ', error)
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
            <Box sx={{ ml: 'auto', mr: '20px', p: '30px 40px', display: 'flex', flexDirection: 'column',borderRadius: '10px', backgroundColor: '#DCDCDC', height: '100%', justifyContent:'space-between'}}>
                <Box sx={{ height: '80vh'}}>
                    {/* <Link to="/history" replace style={{ textDecoration: 'none', color: 'black', marginRight: '10px' }}> */}
                        <Typography variant="h6" onClick={goToHistory} className={`${styles.customTypography} ${styles.currentPage}`} sx={{mb:2}}> 검색결과 </Typography>
                    {/* </Link> */}
                    <Box sx={{ borderRadius: '15px', backgroundColor: '#d8e6cd' , height: '80%'}}>
                    <Box>
                        <Typography variant="h6" sx={{textAlign: 'center'}}> 논문보관함 </Typography>
                    </Box>
                    <Box sx={{overflowY: 'scroll', height: '90%', padding: '10px'}}>                
                        {papersInNav && papersInNav.map((paper: any) => (
                            <Link to={`/paper?paperid=${paper.paperId}`} style={{ textDecoration: 'none', color: 'black' }}>
                                <Typography key={paper.paperId} sx={{textAlign: 'center'}} className={styles.customTypography}>
                                    {paper.title}
                                </Typography>
                            </Link>
                        ))}
                    </Box>
                </Box>
                </Box>
                <Link to="/history/trash" style={{ textDecoration: 'none', color: 'black' }}>
                    <Typography variant="h6" sx={{textAlign: 'center'}} className={styles.customTypography}> 휴지통 </Typography>
                </Link>
            </Box>
        </Box>
    </div>
)};
