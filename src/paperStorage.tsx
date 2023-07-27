import * as React from "react";
import { Card, CardContent, Box, Typography, IconButton } from '@mui/material';
import { Title, useAuthenticated } from 'react-admin';
import * as amplitude from '@amplitude/analytics-browser';
import { useEffect, useState } from "react";
import { SearchTap } from "./component/searchTap";
import { GoToArxiv } from "./component/goToArxiv";
import { GoToViewMore } from "./component/goToViewMore";
import { UserProfileCheck } from "./component/userProfileCheck";
import { HeartClick } from "./component/heartClick";
import loadingStyle from "../layout/loading.module.css"
import scrollStyle from "../layout/scroll.module.css"
import ClearIcon from '@mui/icons-material/Clear';
import { color } from '../layout/color'


export const PaperStorage = () => {
    useAuthenticated();
    UserProfileCheck();

    var api = '';
    if (process.env.NODE_ENV === 'development'){
      api = `${import.meta.env.VITE_REACT_APP_LOCAL_SERVER}`
    }
    else if (process.env.NODE_ENV === 'production'){
      api = `${process.env.VITE_REACT_APP_AWS_SERVER}`
    }

    const [searchTerm, setSearchTerm] = useState("");
    const [papersInStorage, setPapersInStorage] = useState<any>("");
    const [loading, setLoading] = useState<boolean>(false)
    const username = sessionStorage.getItem("username");
    const [paperIdArray, setPaperIdArray] = useState<string[]>([])

    const handleHeartClick = (paperId: any, paperTitle:any) => {
        const isConfirmed = window.confirm(`정말 "${paperTitle}"을 논문보관함에서 삭제하시겠습니까?`)
        if (!isConfirmed){
            return
        }
        else {
            setPaperIdArray(prevArray => [...prevArray, paperId])
        }
        
        var payload = {
            username: sessionStorage.getItem('username'),
            paperId: paperId,
            onoff: false
        }

        fetch(`${api}/api/paperlikeonoff`, {
            method:'POST',
            headers: { 'Content-Type' : 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(response => {
            return response;
        })
        .catch(error => {
            console.log("논문 보관함 삭제에 실패하였습니다", error)
        })
    }

    const callGetApi = async () => {
        console.log("call get api")
        setLoading(true)
        try {
            const response = await fetch(`${api}/api/container?username=${username}`)
            const data = await response.json()
            setPapersInStorage(data)
            setLoading(false)
        } catch (error) {
            console.error('논문 보관함 정보를 불러오는데 실패하였습니다: ', error)
            setLoading(false)
        }
    }

    useEffect(() => {
        amplitude.track("논문보관함 Page Viewed");
        callGetApi()
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
    
    return (
    <div>
        <Title title="논문보관함" />
        <Box sx={{height: 50}}></Box>
          {loading?(
            <Box sx={{height: '75vh', margin: '0 30px 0 10px', padding: '10px'}} className={loadingStyle.loading}>
                <Card sx={{height: '15vh', padding: '15px', borderRadius: '15px', margin: '15px', display: 'flex', justifyContent:'space-between', backgroundColor: color.loadingColor, opacity: '0.2'}}>
                </Card>
                <Card sx={{height: '15vh', padding: '15px', borderRadius: '15px', margin: '15px', display: 'flex', justifyContent:'space-between', backgroundColor: color.loadingColor, opacity: '0.2'}}>
                </Card>
            </Box>
          ):(
            <Box sx={{height: '75vh', margin: '0 30px 0 10px', padding: '10px', overflowY: 'scroll'}} className={scrollStyle.scrollBar}>
                {papersInStorage && papersInStorage.map((paper:any) => (
                    !paperIdArray.includes(paper.paperId) && (
                        <Card sx={{padding: '15px', borderRadius: '15px', margin: '15px', display: 'flex', justifyContent:'space-between'}}>
                            <Box>
                                <Typography variant="h6">
                                    {paper.title}
                                </Typography>
                                <Typography variant="body1">
                                    {paper.authors?.length >1 ?paper.authors.join(', '):paper.authors} / {paper.year} / {paper.conference}
                                </Typography>
                                <Typography variant="body1">
                                    cites: {paper.cites}
                                </Typography>
                            </Box>
                            <Box sx={{ margin:'0px 10px', width: '20vh' ,display: 'flex', flexDirection:'column', justifyContent: 'space-between', alignItems: 'flex-end'}}>
                                {/* <HeartClick currentItem={paper} home={false} callGetApi={callGetApi}/> */}
                                <IconButton onClick={()=> handleHeartClick(paper.paperId, paper.title)} >
                                    <ClearIcon />
                                </IconButton>
                                
                                <GoToArxiv url={paper.url}/>
                                <Box sx={{height:'5px'}}></Box>
                                <GoToViewMore paperid={paper.paperId} />
                            </Box>
                        </Card>
                    )
                ))}
            </Box>
          )}

    </div>
)};
