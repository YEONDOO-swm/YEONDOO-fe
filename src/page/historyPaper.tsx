import { Typography, Box, Card } from '@mui/material';
import { Title, useAuthenticated } from 'react-admin';
import { useEffect, useState } from 'react';
import { UserProfileCheck } from "../component/userProfileCheck";
import { HistoryNav } from '../component/historyNav';
import loadingStyle from "../layout/loading.module.css"
import scrollStyle from "../layout/scroll.module.css"
import { color } from "../layout/color";
import * as amplitude from '@amplitude/analytics-browser';

export const HistoryPaper = () => {
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
    const [loading, setLoading] = useState<boolean>(false)
    const [searchHistory, setSearchHistory] = useState<any>("")

    useEffect(() => {
        amplitude.track("논문 내 질의 히스토리 Page Viewed")
        setLoading(true)
        fetch(`${api}/api/history/search/paper?username=${username}`)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            setSearchHistory(data)
            setLoading(false)
        })
        .catch(error => {
            console.error('논문 내 질의 히스토리 정보를 가져오는데 실패하였습니다: ', error)
            setLoading(false)
        })

    }, [])
    return (
        <Box>
            <Title title="히스토리" />
            <Box sx={{height: 50}}></Box>
            {loading?(
                <Box sx={{ height: '80vh'}} className={loadingStyle.loading}>
                <HistoryNav page="historyInPaper" />
                <Box sx={{ width: '90%', m: 2}}>
                    <Card sx={{ p: 2, height: '10vh', backgroundColor: color.loadingColor, opacity: '0.2', marginBottom: '15px'}}></Card>                  
                    <Card sx={{ p: 2, height: '10vh', backgroundColor: color.loadingColor, opacity: '0.2', marginBottom: '15px'}}></Card>                  
                </Box>
                
            </Box>
            ):(
                <Box sx={{ height: '80vh'}}>
                    <HistoryNav page="historyInPaper" />
                    <Box sx={{ width: '90%', m: 2, overflowY: 'scroll'}} className={scrollStyle.scrollBar}>
                        {searchHistory && searchHistory.map((item: any) =>
                            (<Card sx={{ p: item.who?"8px 15px 15px 15px":2, mb: 1}}>
                                {item.who && <Typography sx={{fontSize: "10px", borderRadius: '20px', p:"0 10px", backgroundColor: color.secondaryGrey, display: 'inline-block'}}> {item.title} </Typography>}
                                <Box sx= {{ display: 'flex', alignItems: 'flex-start'}}>
                                    <Box sx={{mr:1}}>
                                        {item.who ? <Typography>👤</Typography> : <Typography>🍀</Typography>}
                                    </Box>
                                    <Typography> {item.content} </Typography>
                                </Box>
                            </Card>)
                        )}
                    </Box>
                </Box>
            )}
        </Box>
    )
}