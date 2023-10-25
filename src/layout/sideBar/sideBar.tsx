import { Box, Typography } from '@mui/material'
import Dashboard from '../../asset/Dashboard.svg'
import Profile from '../../asset/Profile.svg'
import React from 'react'
import SideBarMenu from './sideBarMenu'
import { useNavigate } from 'react-router-dom'
import logoWhite from '../../asset/logoWhite.png'
import logoIcon from '../../asset/logoIconWhite.svg'

const SideBar = ({number}:{number: number}) => {
    const navigate = useNavigate()
  return (
    <Box sx={{width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        {/* <Typography sx={{
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
        >Yeondoo</Typography> */}
        <Box sx={{display: 'flex', alignItems: 'center', mt: 2, mb: 3, cursor: 'pointer'}}
              onClick={()=>{window.location.replace('/workspaces')}}>

          <img src={logoIcon} style={{ transform: 'scaleX(-1)' }} />
          <img src={logoWhite}
                style={{
                  width: '150px',
                }}/>
        </Box>
        

        <SideBarMenu img={Dashboard} title='Dashboard' number={number} idx={0} url="/workspaces"/>
        <SideBarMenu img={Profile} title='My Library' number={number} idx={1} url="/library"/>

        
    </Box>
  )
}

export default SideBar