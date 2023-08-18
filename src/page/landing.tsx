import { Box, Button, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import React from 'react'
import MetaTag from '../SEOMetaTag'


export const Landing = () => {
    const navigate = useNavigate()
    const goToLogin = () => {
        navigate(`/login`)
    }
  return (
    <Box sx={{width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <MetaTag title="연두" description="연두를 통해 특별한 연구 경험을 느껴보세요." keywords="연두, yeondoo, 논문, 논문 내 질의, 질의, gpt, 논문 gpt" />
        <Box>
            <Typography variant='h2'>
                연두를 통해
            </Typography>
            <Typography variant= 'h3'>
                색다른 연구를 경험해보세요.
            </Typography>
            <Box sx={{width: '100%', display: 'flex', justifyContent: 'flex-end', mt: 2}}>
                <Button variant='outlined' onClick={goToLogin}>
                    Login
                </Button>
            </Box>
        </Box>
        
    </Box>
  )
  }