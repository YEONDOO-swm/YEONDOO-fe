import { Box, Typography } from '@mui/material'
import React from 'react'
import SideBar from './sideBar/sideBar'
import SideBarWorkspace from './sideBar/sideBarWorkspace'
import { color } from './color'
import { UserMenu } from 'react-admin'

const PageLayout = (props: any) => {
  return (
    <Box sx={{display: 'flex', width: '100%'}}>
        <Box sx={{width: '17vw', bgcolor: color.mainGreen}}>
            {props.workspace === true ? (
                <SideBarWorkspace number={props.number}/>
            ):(
                <SideBar number={props.number}/>
            )}
            
        </Box>
        <Box sx={{width: '83vw', bgcolor: color.mainGreen}}>
        
            <Box sx={{width: '100%', height: '100vh', borderTopLeftRadius: '5vh', borderBottomLeftRadius: '5vh',
            bgcolor: 'white'}}>
                <Box sx={{display: 'flex', justifyContent: 'flex-end', p:2, color: 'grey.700'}}>
                    <UserMenu/>
                </Box>
                <Box sx={{px: '12.5vw'}}>
                    {props.children}
                </Box>
            </Box>
        </Box>
    </Box>
  )
}

export default PageLayout