import { Typography, Box, Card } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../layout/hoverButton.module.css'
import { useState } from 'react';
import scroll from '../layout/scroll.module.css'
import { color } from '../layout/color';

export const HistoryNav = ({page} : {page: string}) => {
    const navigate = useNavigate()

    const handleNavigateToHistory = () => {
        const path: string = location.pathname
        navigate('/history')
        if (path === '/history'){
            window.location.reload()
        }
    }

    const handleNavigateToSearchInPaper = () => {
        const path: string = location.pathname
        navigate('/historypaper')
        if (path === '/historypaper'){
            window.location.reload()
        }
    }

    const handleNavigateToTrash = () => {
        const path: string = location.pathname
        navigate('/historytrash')
        if (path === '/historytrash'){
            window.location.reload()
        }
    }
    
    
    return (
        <Box sx={{ display: 'flex', mx: 2}}>
            <Typography variant="h6" 
            sx={{mr: 2}} 
            onClick={handleNavigateToHistory} 
            className={`${styles.customTypography} ${page==="totalSearch"&& styles.currentPage}`}> Paper Search </Typography>
            <Typography variant="h6" 
            sx={{mr: 2}} 
            onClick={handleNavigateToSearchInPaper}
            className={`${styles.customTypography} ${page==="historyInPaper"&& styles.currentPage}`}> Queries </Typography>
            <Typography variant="h6" 
            onClick={handleNavigateToTrash}
            className={`${styles.customTypography} ${page==="trash" && styles.currentPage}`}> Papers in Trash </Typography>
            
        </Box>
    )
}