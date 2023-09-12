import * as React from "react";
import { Card, CardContent, Box, Typography, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { Title, useAuthenticated } from 'react-admin';
import * as amplitude from '@amplitude/analytics-browser';
import { useEffect, useState } from "react";
import { SearchTap } from "../component/searchTap";
import { GoToArxiv } from "../component/goToArxiv";
import { GoToViewMore } from "../component/goToViewMore";
import { UserProfileCheck } from "../component/userProfileCheck";
import { HeartClick } from "../component/heartClick";
import loadingStyle from "../layout/loading.module.css"
import scrollStyle from "../layout/scroll.module.css"
import ClearIcon from '@mui/icons-material/Clear';
import { color } from '../layout/color'
import { Helmet } from "react-helmet-async";
import MetaTag from "../SEOMetaTag";
import * as Sentry from '@sentry/react';
import { getCookie } from "../cookie";


export const PaperStorage = () => {
    useAuthenticated();
    //UserProfileCheck();

    var api = '';
    if (process.env.NODE_ENV === 'development'){
      api = `${import.meta.env.VITE_REACT_APP_LOCAL_SERVER}`
    }
    else if (process.env.NODE_ENV === 'production'){
      api = `${process.env.VITE_REACT_APP_AWS_SERVER}`
    }

    const [open, setOpen] = useState<boolean>(false)
    const [papersInStorage, setPapersInStorage] = useState<any>("");
    const [loading, setLoading] = useState<boolean>(false)
    const workspaceId = sessionStorage.getItem("workspaceId");
    const [paperIdArray, setPaperIdArray] = useState<string[]>([])

    const [curPaperId, setCurPaperId] = useState<any>('')
    const [curPaperTitle, setCurPaperTitle] = useState<any>('')

    const handleHeartClick = (paperId: any, paperTitle:any) => {
        setOpen(true)
        setCurPaperId(paperId)
        setCurPaperTitle(paperTitle)
        // const isConfirmed = window.confirm(`정말 "${paperTitle}"을 관심 논문에서 삭제하시겠습니까?`)
        // if (!isConfirmed){
        //     return
        // }
        // else {
        //     if (process.env.NODE_ENV === 'production') {
            
        //         amplitude.track("관심 논문 페이지에서 삭제",{paperId: paperId})
        //     }
        //     setPaperIdArray(prevArray => [...prevArray, paperId])
        // }
        
        // var payload = {
        //     username: sessionStorage.getItem('username'),
        //     paperId: paperId,
        //     on: false
        // }

        // fetch(`${api}/api/paperlikeonoff`, {
        //     method:'POST',
        //     headers: { 'Content-Type' : 'application/json' },
        //     body: JSON.stringify(payload)
        // })
        // .then(response => {
        //     return response;
        // })
        // .catch(error => {
        //     console.log("관심 논문 삭제에 실패하였습니다", error)
        // })
        
    }
    const handleCancel = (paperId: any) => {
        if (process.env.NODE_ENV === 'production') {
            
            amplitude.track("관심 논문 페이지에서 삭제",{paperId: paperId})
        }
        setPaperIdArray(prevArray => [...prevArray, paperId])

        var payload = {
            workspaceId: sessionStorage.getItem('workspaceId'),
            paperId: paperId,
            on: false
        }

        fetch(`${api}/api/paperlikeonoff`, {
            method:'POST',
            headers: { 'Content-Type' : 'application/json',
        'X_AUTH_TOKEN': getCookie('jwt') },
            body: JSON.stringify(payload)
        })
        .then(response => {
            return response;
        })
        .catch(error => {
            console.log("관심 논문 삭제에 실패하였습니다", error)
            Sentry.captureException(error)
        })
        setOpen(false)
    }

    const callGetApi = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${api}/api/container?workspaceId=${workspaceId}`, {
                headers: {
                    "X_AUTH_TOKEN": getCookie('jwt')
                }
            })
            const data = await response.json()
            setPapersInStorage(data)
            setLoading(false)
        } catch (error) {
            console.error('관심 논문 정보를 불러오는데 실패하였습니다: ', error)
            Sentry.captureException(error)
            setLoading(false)
        }
    }

    useEffect(() => {
        if (process.env.NODE_ENV === 'production') {
            
            amplitude.track("관심 논문 Page Viewed");
        }
        callGetApi()
    }, []);
    
    return (
    <div>
        <MetaTag title="관심 논문" description="사용자가 선택한 관심 논문 리스트를 볼 수 있습니다." keywords="히스토리, 논문, AI, 관심 논문, 찜"/>
        <Title title="관심 논문" />
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
                 <Dialog
                    open={open}
                    onClose={()=>setOpen(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">
                            {"연두"}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                            정말 "{curPaperTitle}"을 관심 논문에서 삭제하시겠습니까?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={()=>setOpen(false)}>아니오</Button>
                            <Button onClick={()=>handleCancel(curPaperId)} autoFocus>
                            예
                            </Button>
                        </DialogActions>
                    </Dialog> 
                {(papersInStorage && papersInStorage.length>0) ? papersInStorage.map((paper:any) => (
                    !paperIdArray.includes(paper.paperId) && (
                            <Card key={paper.paperId} sx={{padding: '15px 10px 18px 25px', borderRadius: '15px', margin: '15px'}}>
                                <Box sx={{display: 'flex', justifyContent:'space-between'}}>
                                    <Box>
                                        <Typography variant="h6">
                                            {paper.title}
                                        </Typography>
                                        <Typography variant="body1">
                                            {paper.authors?.length >1 ?paper.authors.join(', '):paper.authors} / {paper.year}
                                        </Typography>
                                        {/* <Typography variant="body1">
                                            cites: {paper.cites}
                                        </Typography> */}
                                    </Box>
                                    <Box sx={{ margin:'0px 10px', display: 'flex', flexDirection:'column', justifyContent: 'space-between', alignItems: 'flex-end'}}> 
                                        {/* <HeartClick currentItem={paper} home={false} callGetApi={callGetApi}/> */}
                                        <IconButton onClick={()=> handleHeartClick(paper.paperId, paper.title)} >
                                            <ClearIcon />
                                        </IconButton>
                                    </Box> 
                                </Box>
                                <Box sx={{display: 'flex', mt: 1}}>
                                    <GoToArxiv url={paper.url} paperId={paper.paperId}/>
                                        <Box sx={{width:'15px'}}></Box>
                                    <GoToViewMore paperid={paper.paperId} />
                                </Box>
                            </Card>
                        
                    )
                )):<Typography sx={{m:3}}>관심 논문이 없습니다.</Typography>}
            </Box>
          )}

    </div>
)};
