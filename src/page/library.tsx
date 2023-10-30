import React from 'react'
import PageLayout from '../layout/pageLayout'
import MetaTag from '../SEOMetaTag'
import { Title, useNotify } from 'react-admin'
import { Box, Typography } from '@mui/material'
import { GoToArxiv } from '../component/goToArxiv'
import { GoToViewMore } from '../component/goToViewMore'
import { paperType, tag } from './home'
import { useSelector } from 'react-redux'
import { CounterState } from '../reducer'
import { useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import { getApi, refreshApi } from '../utils/apiUtils'
import * as Sentry from '@sentry/react';
import PostAddIcon from '@mui/icons-material/PostAdd';
import loadingStyle from "../layout/loading.module.css"
import scrollStyle from "../layout/scroll.module.css"
import { color } from '../layout/color'
import arrow from '../asset/rightarrow.svg'

const Library = () => {
    const api: string = useSelector((state: CounterState) => state.api)

    const navigate = useNavigate()
    const notify = useNotify()

    const {data: papersInStorage, isLoading} = useQuery(['library', api],()=> 
        getApi(api, `/api/library`)
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

    const makePapersCard = (paper: paperType) => {
        return (
        <Box key={paper.paperId} sx={{ mb: '15px', pb: '30px',
        borderRadius: '20px', border: '1px solid #ddd', boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.05)'}}>
            <Box sx={{display: 'flex', justifyContent:'space-between', padding: '0px 10px 0px 40px'}}>
                <Box sx={{pt: '30px', width: '100%', pr: '20px'}}>
                    <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                        <Typography sx={{color: '#333', fontSize: '18px', fontWeight: 600}}>
                            {paper.title}
                        </Typography>
                        <Box sx={{display: 'flex', alignItems: 'center', transform: 'translate(2vh, -2vh)'}}>
                            <Typography sx={{fontWeight: 500, color: color.mainGreen,'&:hover':{
                                color: '#445142',
                                cursor: 'pointer',
                                }}}
                                onClick={()=> {
                                    navigate(`/home?workspaceId=${paper.workspaceId}`)
                                }}>{paper.workspaceTitle}</Typography>
                            <img src={arrow}/>
                        </Box>
                    </Box>
                    {paper.subject && <Box sx={{width: '100%', display: 'flex', flexWrap:'', mt: 1, mb: 0.5, overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none',
                    '&::-webkit-scrollbar': {
                        display: 'none', /* Chrome 브라우저의 스크롤바 숨김 */
                    }}}>
                        {paper.subject.map((sub: string, idx: number) => (
                        <Box key={idx} sx={{whiteSpace: 'nowrap'}}>
                            {tag(sub)}
                        </Box>
                        ))}
                    </Box>}
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
                    {/* <IconButton onClick={()=> handleCancelClick(paper.paperId, paper.title)} >
                        <ClearIcon />
                    </IconButton> */}
                </Box> 
                
            </Box>
            <Box sx={{display: 'flex', mt: '15px', padding: '0px 40px'}}>
                <GoToArxiv url={paper.url} paperId={paper.paperId}/>
                    <Box sx={{width:'15px'}}></Box>
                <GoToViewMore paperid={paper.paperId} workspaceId={paper.workspaceId} userPdf={paper.userPdf}/>
            </Box>
        </Box>
        )
      }

  return (
    <PageLayout workspace={false} number={1}>
        <MetaTag title="My Library - Yeondoo" description="사용자가 선택한 관심 논문 리스트를 볼 수 있습니다." keywords="히스토리, 논문, AI, 관심 논문, 찜"/>
        <Title title="My library" />
        <Box>
            <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                <Typography sx={{fontSize: '25px', fontWeight: '600'}}>
                    {/* {workspaceTitle} */}
                    My Library
                </Typography>  
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
                    {(papersInStorage && papersInStorage.length>0) ? papersInStorage.map((paper: paperType) => (
                            makePapersCard(paper)
                        )): <Box sx={{height: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 2}}>
                                <PostAddIcon sx={{fontSize: '180px'}}/>
                                <Typography sx={{ color: '#333', fontSize: '22px', fontWeight: 600}}>No Papers In My Works</Typography>
                            </Box>}
                </Box>
                )}
        </Box>
    </PageLayout>
  )
}

export default Library