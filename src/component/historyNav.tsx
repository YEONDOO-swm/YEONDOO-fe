import { Typography, Box, Card } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../layout/hoverButton.module.css'
import { useState } from 'react';
import scroll from '../layout/scroll.module.css'
import { color } from '../layout/color';

export const HistoryNav = ({page} : {page: any}) => {
    const navigate = useNavigate()

    const handleNavigateToHistory = () => {
        const path = location.pathname
        navigate('/history')
        if (path === '/history'){
            window.location.reload()
        }
    }

    const handleNavigateToSearchInPaper = () => {
        const path = location.pathname
        navigate('/history/paper')
        if (path === '/history/paper'){
            window.location.reload()
        }
    }

    const handleNavigateToTrash = () => {
        const path = location.pathname
        navigate('/history/trash')
        if (path === '/history/trash'){
            window.location.reload()
        }
    }
    
    
    return (
        <Box sx={{ display: 'flex', mx: 2}}>
            <Typography variant="h6" 
            sx={{mr: 2}} 
            onClick={handleNavigateToHistory} 
            className={`${styles.customTypography} ${page==="totalSearch"&& styles.currentPage}`}> 전체 검색 </Typography>
            <Typography variant="h6" 
            sx={{mr: 2}} 
            onClick={handleNavigateToSearchInPaper}
            className={`${styles.customTypography} ${page==="historyInPaper"&& styles.currentPage}`}> 논문 내 질의 </Typography>
            <Typography variant="h6" 
            onClick={handleNavigateToTrash}
            className={`${styles.customTypography} ${page==="trash" && styles.currentPage}`}> 관심 해제된 논문 </Typography>
            
        </Box>
    )
}