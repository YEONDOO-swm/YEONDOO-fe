import { Box } from '@mui/material'
import React from 'react'
import { color } from '../layout/color'

const CustomButton = ({title, width, click}: {title: string, width: string, click: any}) => {
  return (
    <Box sx={{ width: width,
      borderRadius: '8px', bgcolor: color.mainGreen, display: 'flex', justifyContent: 'center', py: '13px',
      color: 'white', fontWeight: '700', cursor: 'pointer', '&:hover':{
        bgcolor: '#445142'
      }}}
      onClick={click}>
      {title}
    </Box>
  )
}

export default CustomButton