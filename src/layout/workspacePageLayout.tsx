import { Box, Typography } from '@mui/material'
import React from 'react'
import SideBar from './sideBar/sideBar'
import SideBarWorkspace from './sideBar/sideBarWorkspace'
import { color } from './color'

const WorkspacePageLayout = (props: any) => {
  return (
    <Box sx={{display: 'flex', width: '100%'}}>
        <Box sx={{width: '17vw', bgcolor: color.homeGreen}}>
            {props.workspace === true ? (
                <SideBarWorkspace number={props.number}/>
            ):(
                <SideBar number={props.number}/>
            )}
            
        </Box>
        <Box sx={{width: '83vw', bgcolor: color.homeGreen}}>
            <Box sx={{width: '100%', height: '100vh', borderTopLeftRadius: '5vh', borderBottomLeftRadius: '5vh',
            bgcolor: 'white'}}>
                {props.children}
            </Box>
        </Box>
    </Box>
  )
}

export default WorkspacePageLayout