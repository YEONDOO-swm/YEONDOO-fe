import { Box } from '@mui/material'
import React from 'react'

const CustomButton = ({title, width, click}: {title: string, width: string, click: any}) => {
  return (
    <Box sx={{ width: width,
      borderRadius: '8px', bgcolor: '#617F5B', display: 'flex', justifyContent: 'center', py: '13px',
      color: 'white', fontWeight: '700', cursor: 'pointer', '&:hover':{
        bgcolor: '#445142'
      }}}
      onClick={click}>
      {title}
    </Box>
  )
}

export default CustomButton