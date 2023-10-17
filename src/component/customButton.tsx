import { Box } from '@mui/material'
import React from 'react'
import { color } from '../layout/color'

const CustomButton = ({title, width, click, color}: {title: string, width: string, click: any, color: string}) => {
  return (
    <Box sx={{ width: width,
      borderRadius: '8px', bgcolor: color, display: 'flex', justifyContent: 'center', px: '8px',
      color: 'white', fontWeight: '700', cursor: 'pointer', '&:hover':{
        bgcolor: '#445142'
      }}}
      onClick={click}>
      {title}
    </Box>
  )
}

export default CustomButton