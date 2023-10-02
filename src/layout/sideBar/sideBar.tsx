import { Box, Typography } from '@mui/material'
import Dashboard from '../../asset/Dashboard.svg'
import Profile from '../../asset/Profile.svg'
import React from 'react'
import SideBarMenu from './sideBarMenu'
import { useNavigate } from 'react-router-dom'

const SideBar = ({number}:{number: number}) => {
    const navigate = useNavigate()
  return (
    <Box sx={{width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <Typography sx={{
            color: 'white',
            textAlign: 'center',
            fontSize: '26px',
            fontStyle: 'normal',
            fontWeight: '600',
            lineHeight: 'normal',
            pt: 2,
            pb: 4,
            cursor: 'pointer'
        }}
        onClick={()=>{window.location.replace('/workspaces')}}
        >Yeondoo</Typography>

        <SideBarMenu img={Dashboard} title='Dashboard' number={number} idx={0} url="/workspace"/>
        <SideBarMenu img={Profile} title='My Library' number={number} idx={1} url="/mylibrary"/>

        
    </Box>
  )
}

export default SideBar