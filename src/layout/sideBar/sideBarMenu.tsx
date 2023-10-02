import React from 'react'
import { Box, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const SideBarMenu = ({img, title, number, idx, url}: {img: any, title: string, number: number, idx: number, url: string}) => {
  const navigate = useNavigate()
  return (
    <Box sx={{
      width: '87%',
      height: '60px',
      bgcolor: number===idx?'rgba(255, 255, 255, 0.1)':null,
      borderRadius: '10px',
      '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        },
      mb: 0.5,
      cursor: 'pointer'
    }} onClick={()=>window.location.href =url}>
      <Box sx={{height: '100%',display: 'flex', alignItems: 'center', p: 2}}>
          <img src={img} style={{opacity: number===idx?1:0.5}}/>
          <Typography sx={{color: number===idx?'white':'rgba(255, 255, 255, 0.5)', ml: 2}}>
              {title}
          </Typography>
      </Box>
    </Box>
  )
}

export default SideBarMenu