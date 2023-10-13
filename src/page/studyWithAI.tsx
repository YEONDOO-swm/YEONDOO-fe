import React from 'react'
import PageLayout from '../layout/pageLayout'
import { Box, Button, Typography } from '@mui/material'
import { useNotify } from 'react-admin'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { CounterState } from '../reducer'
import { useQuery } from 'react-query'
import { getApi, refreshApi } from '../utils/apiUtils'
import * as Sentry from '@sentry/react';

const StudyWithAI = () => {
    const notify = useNotify()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const api: string = useSelector((state: CounterState) => state.api)
    const workspaceId: number | null = Number(sessionStorage.getItem("workspaceId"));

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

    const handleClickPaper = (paperId: string) => {
        window.open(`/paper?paperid=${paperId}`)
    }
  return (
    <PageLayout workspace={true} number={2}>
        <Box sx={{height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Box sx={{width: '70%', height: '60%', bgcolor: '#ddd', p: 4, display: 'flex', alignItems: 'center'
        , flexDirection: 'column'}}>
                <Typography sx={{fontSize: '30px', fontWeight: '600'}}>Select a paper you want to study</Typography>
                {!isLoading && papersInStorage.map((paper: any) => (
                    <>
                        <Button onClick={() => handleClickPaper(paper.paperId)}>
                            {paper.title}
                        </Button>
                    </>
                ))}
            </Box>
        </Box>
    </PageLayout>
  )
}

export default StudyWithAI