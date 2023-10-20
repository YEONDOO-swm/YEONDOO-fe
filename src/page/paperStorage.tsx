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
import { getApi, postApi, refreshApi } from "../utils/apiUtils";
import trash from "../asset/trash.svg"
import PostAddIcon from '@mui/icons-material/PostAdd';

export type paperLikePayload = {
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
        (value: paperLikePayload)=> postApi(api, `/api/paperlikeonoff`, value)
        .then(response => {
            if (response.status === 401) {
                refreshApi(api, notify, navigate)
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
        setOpen(false)
    }

    const {data: papersInStorage, isLoading} = useQuery(['homesearch', api, workspaceId],()=> 
    getApi(api, `/api/container?workspaceId=${workspaceId}`)
    .then(response => {
        if (response.status === 200) {
            return response.json()
        } else if (response.status === 401) {
            refreshApi(api, notify, navigate)
          }
        throw new Error("논문 내 질의 히스토리 정보를 가져오는데 실패하였습니다")
    }),
    {
        onError: (error) => {
            console.error('관심 논문 정보를 불러오는데 실패하였습니다: ', error)
            Sentry.captureException(error)
        }
    })

    useEffect(() => {
        if (process.env.NODE_ENV === 'production') {
            amplitude.track("관심 논문 Page Viewed");
        }
    }, []);

    const makePapersCard = (paper: paperType) => {
        return (
        <Box key={paper.paperId} sx={{ mb: '15px', pb: '30px',
        borderRadius: '20px', border: '1px solid #ddd', boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.05)'}}>
            <Box sx={{display: 'flex', justifyContent:'space-between', padding: '0px 10px 0px 40px'}}>
                <Box sx={{pt: '30px'}}>
                    <Typography sx={{color: '#333', fontSize: '18px', fontWeight: 600}}>
                        {paper.title}
                    </Typography>
                    <Box sx={{display: 'flex', gap: 2}}>
                        <Typography sx={{color: '#111', fontSize: '15px', fontWeight: 500}}>
                            {(paper.authors.length > 3 
                            ? paper.authors.slice(3).join(', ') +"..."
                            : paper.authors.join(', '))}
                        </Typography>
                        <Typography sx={{color: '#666', fontSize: '15px', fontWeight: 400}}>
                            {paper.year}
                        </Typography>
                    </Box>
                    {/* <Typography variant="body1">
                        cites: {paper.cites}
                    </Typography> */}
                </Box>
                <Box sx={{pt: '5px', display: 'flex', flexDirection:'column', justifyContent: 'space-between', alignItems: 'flex-end'}}> 
                    {/* <HeartClick currentItem={paper} home={false} callGetApi={callGetApi}/> */}
                    <IconButton onClick={()=> handleCancelClick(paper.paperId, paper.title)} >
                        <ClearIcon />
                    </IconButton>
                </Box> 
                
            </Box>
            <Box sx={{display: 'flex', mt: '15px', padding: '0px 40px'}}>
                <GoToArxiv url={paper.url} paperId={paper.paperId}/>
                    <Box sx={{width:'15px'}}></Box>
                <GoToViewMore paperid={paper.paperId} workspaceId={workspaceId}/>
            </Box>
        </Box>
        )
      }
      
      const trashButton = () => {
        return (
            <Box sx={{display: 'inline-flex', px: '20px', justifyContent: 'center', alignItems: 'center', gap: '10px',
            borderRadius: '8px', bgcolor: '#777', height: '35px',
            '&:hover': {
                bgcolor: '#555',
                cursor: 'pointer'
            }}}
            onClick={()=>{navigate('/trash')}}>
                <img src={trash}/>
                <Typography sx={{color: color.white, fontSize: '15px', fontWeight: '700'}}>
                    Trash
                </Typography>
            </Box>
        )
      }

      const addMyPdfButton = () => {
        return (
            <Box sx={{display: 'inline-flex', px: '20px', justifyContent: 'center', alignItems: 'center', gap: '10px',
            borderRadius: '8px', bgcolor: color.hoverGreen, height: '35px',
            '&:hover': {
                bgcolor: color.appbarGreen,
                cursor: 'pointer'
            }}}
            onClick={()=>{}}>
                <img src={trash}/>
                <Typography sx={{color: color.white, fontSize: '15px', fontWeight: '700'}}>
                    Add My PDF
                </Typography>
            </Box>
        )
      }
    
    return (
    <PageLayout workspace={true} number={1}>
        <MetaTag title="Working Papers - Yeondoo" description="사용자가 선택한 관심 논문 리스트를 볼 수 있습니다." keywords="히스토리, 논문, AI, 관심 논문, 찜"/>
        <Title title="Working Papers" />
        <Box>
            <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                <Typography sx={{fontSize: '25px', fontWeight: '600'}}>
                    {/* {workspaceTitle} */}
                    My Works
                </Typography>
                <Box sx={{display: 'flex', gap: 1}}>
                    {trashButton()}
                    {addMyPdfButton()}
                </Box>
            </Box>
            <Box sx={{height: 40}}></Box>
            {isLoading?(
                <Box className={loadingStyle.loading}>
                    <Box sx={{height: '18vh', borderRadius: '15px', display: 'flex', justifyContent:'space-between', backgroundColor: color.loadingColor, opacity: '0.2', mb: '15px'}}>
                    </Box>
                    <Box sx={{height: '15vh',borderRadius: '15px', display: 'flex', justifyContent:'space-between', backgroundColor: color.loadingColor, opacity: '0.2'}}>
                    </Box>
                </Box>
            ):(
                <Box sx={{height: '75vh', overflowY: 'scroll'}} className={scrollStyle.scrollBar}>
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
                                makePapersCard(paper)
                            
                        )
                    )):<Box sx={{height: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 2}}>
                            <PostAddIcon sx={{fontSize: '180px'}}/>
                            <Typography sx={{ color: '#333', fontSize: '22px', fontWeight: 600}}>No Papers In My Works</Typography>
                        </Box>}
                </Box>
            )}
        </Box>

    </PageLayout>
)};
