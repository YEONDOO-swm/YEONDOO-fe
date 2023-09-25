import React, { useEffect } from 'react'
import PageLayout from '../layout/pageLayout'
import MetaTag from '../SEOMetaTag'
import { Title, UserMenu } from 'react-admin'
import { Box, Typography } from '@mui/material'
import plus from '../asset/plus.svg'
import edit from '../asset/edit.svg'
import deleteIcon from '../asset/delete.svg'

const Workspaces = () => {
    const card = (title: string, desc: string, date: string) => (
        <Box>
            <Box sx={{width: '320px', height: '210px', bgcolor: '#F5F5F5', borderRadius: '20px'
            ,p: 3, mr: 3, mb: 3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                <Box>
                    <Typography sx={{color: '#333', fontSize: '18px', fontWeight: '600', mb: 2}}>{title}</Typography>
                    <Typography sx={{color: '#666', fontSize: '15px', fontWeight: '400', mb: 2}}>{desc}</Typography>
                </Box>
                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
                    <Box sx={{display: 'flex'}}>
                        <Box sx={{display: 'flex', p: '2px 5px', justifyContent: 'center', alignItems: 'center', gap: '4px', borderRadius: '4px', border: '0.5px solid #999', mr: 1}}>
                            <img src={edit}/>
                            <Typography sx={{fontSize: '13px', fontWeight: 500, letterSpacing: '-0.13px', color: '#999'}}>
                                Edit
                            </Typography>
                        </Box>
                        <Box sx={{display: 'flex', p: '2px 5px', justifyContent: 'center', alignItems: 'center', gap: '4px', borderRadius: '4px', border: '0.5px solid #999'}}>
                            <img src={deleteIcon}/>
                            <Typography sx={{fontSize: '13px', fontWeight: 500, letterSpacing: '-0.13px', color: '#999'}}>
                                Delete
                            </Typography>
                        </Box>
                    </Box>
                    <Typography sx={{color: '#999', fontSize: '13px', fontWeight: 400}}>
                        {date}
                    </Typography>
                </Box>
            </Box>
        </Box>
    )
  return (
    <PageLayout workspace={false} number={0}>
        <MetaTag title="연두 홈" description="궁금한 개념 질문 또는 논문 제목 검색을 하면 답변과 관련 논문을 제공합니다." keywords="논문, 검색, 질문, 개념, gpt"/>
        <Title title="Home" />
        <Box sx={{display: 'flex', justifyContent: 'flex-end', p:2, color: 'grey.700'}}>
          <UserMenu/>
        </Box>
        <Box sx={{}}>
            <Box sx={{mx: '7vw', my: '5vh', display: 'flex', flexWrap: 'wrap'}}>
                <Box sx={{width: '320px', height: '210px', bgcolor: '#F5F5F5', borderRadius: '20px'
                , display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                mr: 3, mb: 3}}>
                    <img src={plus} />
                    <Typography sx={{color: '#333', fontSize: '16px', fontWeight: '500'}}> Add a workspace</Typography>
                </Box>
                {card("title", "description desc1 desc2 desc3 desc 4 description desc1 desc2 desc3", "2021.12.5")}
                {card("title", "description desc1 desc2 desc3 desc 4 description desc1 desc2 desc3", "2021.12.5")}
                {card("title", "description desc1 desc2 desc3 desc 4 description desc1 desc2 desc3", "2021.12.5")}
            </Box>
        </Box>
    </PageLayout>
  )
}

export default Workspaces