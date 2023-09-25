import * as React from "react";
import { Card, CardContent, Box, Typography, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { Title, useAuthenticated, useNotify } from 'react-admin';
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
import { getCookie, setCookie } from "../cookie";
import { useSelector } from "react-redux";
import { CounterState } from "../reducer";
import { useMutation, useQuery } from "react-query";
import { paperType } from "./home";
import { useNavigate } from "react-router-dom";
import PageLayout from "../layout/pageLayout";

type paperLikePayload = {
    workspaceId: number | null;
    paperId: string;
    on: boolean;
}


export const PaperStorage = () => {
    useAuthenticated();

    const api: string = useSelector((state: CounterState) => state.api)

    const [open, setOpen] = useState<boolean>(false)
    // const [papersInStorage, setPapersInStorage] = useState<any>("");
    // const [loading, setLoading] = useState<boolean>(false)

    const workspaceId: number | null = Number(sessionStorage.getItem("workspaceId"));

    const [paperIdArray, setPaperIdArray] = useState<string[]>([])

    const [curPaperId, setCurPaperId] = useState<string | null>(null)
    const [curPaperTitle, setCurPaperTitle] = useState<string>('')

    const navigate = useNavigate()
    const notify = useNotify()

    const handleCancelClick = (paperId: string, paperTitle: string) => { // x버튼 클릭시
        setOpen(true)
        setCurPaperId(paperId)
        setCurPaperTitle(paperTitle)
    }

    const { mutate } = useMutation(
        (value: paperLikePayload)=> fetch(`${api}/api/paperlikeonoff`, {
            method:'POST',
            headers: { 'Content-Type' : 'application/json',
        'Gauth': getCookie('access') },
            body: JSON.stringify(value)
        }).then(response => {
            if (response.status === 401) {

                fetch(`${api}/api/update/token`, {
                  headers: { 
                    'Refresh' : getCookie('refresh') 
                  }
                }).then(response => {
                  if (response.status === 401) {
                    navigate('/login')
                    notify('Login time has expired')
                    throw new Error('로그아웃')
                  }
                  else if (response.status === 200) {
                    let jwtToken: string | null = response.headers.get('Gauth')
                    let refreshToken: string | null = response.headers.get('RefreshToken')
    
                    if (jwtToken) {
                        setCookie('access', jwtToken)
                    }
    
                    if (refreshToken) {
                        setCookie('refresh', refreshToken)
                    }
                  }
                })
                
              }
        }), {
            onError: (error) => {
                console.log("관심 논문 삭제에 실패하였습니다", error)
                Sentry.captureException(error)
            }
        }
    )
    const handleCancel = (paperId: string) => { // 예를 누르면 실제 삭제
        if (process.env.NODE_ENV === 'production') {
            
            amplitude.track("관심 논문 페이지에서 삭제",{paperId: paperId})
        }
        setPaperIdArray(prevArray => [...prevArray, paperId])

        var payload = {
            workspaceId: Number(sessionStorage.getItem('workspaceId')),
            paperId: paperId,
            on: false
        }
        mutate(payload)

        // fetch(`${api}/api/paperlikeonoff`, {
        //     method:'POST',
        //     headers: { 'Content-Type' : 'application/json',
        // 'Gauth': getCookie('access') },
        //     body: JSON.stringify(payload)
        // })
        // .then(response => {
        //     return response;
        // })
        // .catch(error => {
        //     console.log("관심 논문 삭제에 실패하였습니다", error)
        //     Sentry.captureException(error)
        // })
        setOpen(false)
    }

    const {data: papersInStorage, isLoading} = useQuery(['homesearch', api, workspaceId],()=> fetch(`${api}/api/container?workspaceId=${workspaceId}`
    , {
        headers: {
            "Gauth": getCookie('access')
        }
    }).then(response => {
        if (response.status === 200) {
            return response.json()
        } else if (response.status === 401) {

            fetch(`${api}/api/update/token`, {
              headers: { 
                'Refresh' : getCookie('refresh') 
              }
            }).then(response => {
              if (response.status === 401) {
                navigate('/login')
                notify('Login time has expired')
                throw new Error('로그아웃')
              }
              else if (response.status === 200) {
                let jwtToken: string | null = response.headers.get('Gauth')
                let refreshToken: string | null = response.headers.get('RefreshToken')

                if (jwtToken) {
                    setCookie('access', jwtToken)
                }

                if (refreshToken) {
                    setCookie('refresh', refreshToken)
                }
              }
            })
            
          }
        throw new Error("논문 내 질의 히스토리 정보를 가져오는데 실패하였습니다")
    }),
    {
        onError: (error) => {
            console.error('관심 논문 정보를 불러오는데 실패하였습니다: ', error)
            Sentry.captureException(error)
        }
    })

    // console.log(papersInStorage)

    // const callGetApi = async () => {
    //     setLoading(true)
    //     try {
    //         const response = await fetch(`${api}/api/container?workspaceId=${workspaceId}`, {
    //             headers: {
    //                 "Gauth": getCookie('access')
    //             }
    //         })
    //         const data = await response.json()
    //         setPapersInStorage(data)
    //         setLoading(false)
    //     } catch (error) {
    //         console.error('관심 논문 정보를 불러오는데 실패하였습니다: ', error)
    //         Sentry.captureException(error)
    //         setLoading(false)
    //     }
    // }

    useEffect(() => {
        if (process.env.NODE_ENV === 'production') {
            amplitude.track("관심 논문 Page Viewed");
        }
    }, []);
    
    return (
    <PageLayout workspace={true} number={1}>
        <MetaTag title="Working Papers - Yeondoo" description="사용자가 선택한 관심 논문 리스트를 볼 수 있습니다." keywords="히스토리, 논문, AI, 관심 논문, 찜"/>
        <Title title="Working Papers" />
        <Box sx={{height: 50}}></Box>
          {isLoading?(
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
                            {"Yeondoo"}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                            Are you sure you want to delete "{curPaperTitle}" from Working Papers?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={()=>setOpen(false)}>No</Button>
                            <Button onClick={()=>curPaperId!==null && handleCancel(curPaperId)} autoFocus>
                            Yes
                            </Button>
                        </DialogActions>
                    </Dialog> 
                {(papersInStorage && papersInStorage.length>0) ? papersInStorage.map((paper: paperType) => (
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
                                        <IconButton onClick={()=> handleCancelClick(paper.paperId, paper.title)} >
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
                )):<Typography sx={{m:3}}>No Working Papers</Typography>}
            </Box>
          )}

    </PageLayout>
)};
