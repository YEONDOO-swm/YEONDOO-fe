import { Box } from '@mui/material'
import React from 'react'
import { color } from '../layout/color'

const CustomButton = ({title, width, click, disabled}: {title: string, width: string, click: any, disabled?:boolean}) => {
  return (
    <Box sx={{ width: width,
      borderRadius: '8px', bgcolor: color.mainGreen, display: 'flex', justifyContent: 'center', px: '8px', py: 1,
      color: color.white, fontWeight: '700', cursor: 'pointer', '&:hover':{
        bgcolor: disabled?color.loadingColor:'#445142'
      }}}
      onClick={disabled?null:click}>
      {title}
    </Box>
  )
}

export default CustomButton