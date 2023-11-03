import React, { useState } from 'react'
import PageLayout from '../layout/pageLayout'
import { Box, Button, Typography, useMediaQuery } from '@mui/material'
import { useNotify } from 'react-admin'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { CounterState } from '../reducer'
import { useQuery } from 'react-query'
import { getApi, refreshApi } from '../utils/apiUtils'
import * as Sentry from '@sentry/react';
import { color } from '../layout/color'
import scrollStyle from "../layout/scroll.module.css"
import { paperType } from './home'
import study from '../asset/studyGreen.svg'
// var Mermaid = require('react-mermaid');

const PaperBox = ({handleClickPaper, paper}: {handleClickPaper: any, paper: any}) => {
    const [isHovered, setIsHovered] = useState<boolean>(false)
    return (
        <Box onClick={() => handleClickPaper(paper.paperId, paper.userPdf)} 
        onMouseEnter={()=>{setIsHovered(true)}}
        onMouseLeave={()=>{setIsHovered(false)}}
        sx={{py: 1, px: 1, borderBottom: '1px solid #eee', cursor: 'pointer', bgcolor: isHovered?"#f5f5f5":color.white}}>
            <Typography sx={{color: isHovered?color.mainGreen:'#666', fontSize: '18px', fontWeight: '400',
                             display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
                {paper.title}
            </Typography>
        </Box>
    )
}

const StudyWithAI = () => {
    const notify = useNotify()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const api: string = useSelector((state: CounterState) => state.api)
    const workspaceId: number | null = Number(sessionStorage.getItem("workspaceId"));

    const {data: papersInStorage, isLoading} = useQuery(['homesearch', api, workspaceId],()=> 
      getApi(api, `/api/container?workspaceId=${workspaceId}`)
      .then(async response => {
        if (response.status === 200) {
            return response.json()
        } else if (response.status === 401) {
            await refreshApi(api, notify, navigate)
        } else {
            throw new Error("논문 내 질의 히스토리 정보를 가져오는데 실패하였습니다")
        }
      }),
      {
          onError: (error) => {
              console.error('관심 논문 정보를 불러오는데 실패하였습니다: ', error)
              Sentry.captureException(error)
          }
    })

    const handleClickPaper = (paperId: string, userPdf: boolean) => {
        window.open(`/paper?workspaceId=${workspaceId}&paperid=${paperId}&userPdf=${userPdf}`)
    }
    
    const isTablet = useMediaQuery("(max-width: 767px)")
  return (
    <PageLayout workspace={true} number={2}>
        <Box sx={{height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center',}}>
            <Box sx={{width: isTablet?"100%":'50vw', height: '70%', p: 4,  borderRadius: '50px 0px 0px 0px'
            , border: `1px solid #ddd`, boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.05)'}}>
                <Box sx={{height: '16%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <Box sx={{display: 'flex'}}>
                        <img src={study} style={{width: '25px'}}/>
                        <Typography sx={{fontSize: '25px', fontWeight: '600', ml: 1, color: '#333'}}>
                            {isTablet?"Study!":"Start Study!"}
                        </Typography>
                    </Box>
                    <Box sx={{width: '100%', height: '2px', bgcolor: color.secondaryGreen, mt: 3}}></Box>
                </Box>
                <Box sx={{height: '84%', overflowY: 'scroll'}} className={scrollStyle.scrollBar}>
                    {!isLoading && (papersInStorage && papersInStorage.length === 0
                    ?<Box sx={{height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                        <Typography sx={{fontSize: '18px', fontWeight: 500}}>
                            Save papers you want to study!
                        </Typography>
                        <Typography sx={{fontSize: '13px', textAlign: 'center'}}>
                            You can save papers to My Works by pressing ♡ button
                        </Typography>
                    </Box>
                    :papersInStorage.map((paper: any, idx: number) => (
                        <Box key={idx}>
                            <PaperBox paper={paper} handleClickPaper={handleClickPaper} />
                        </Box>
                    )))}
                </Box>
            </Box>
        </Box>
    </PageLayout>
  )
}

export default StudyWithAI