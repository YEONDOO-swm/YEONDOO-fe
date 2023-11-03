import { Box, Typography, useMediaQuery } from '@mui/material'
import Dashboard from '../../asset/Dashboard.svg'
import Profile from '../../asset/Profile.svg'
import React from 'react'
import SideBarMenu from './sideBarMenu'
import { useNavigate } from 'react-router-dom'
import logoWhite from '../../asset/logoWhite.png'
import logoIcon from '../../asset/logoIconWhite.svg'
import Home from '../../asset/home.svg'

const SideBar = ({number}:{number: number}) => {
  const isMobile = useMediaQuery("(max-width: 480px)")
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
              onClick={()=>{window.location.replace('/home')}}>

          <img src={logoIcon} style={{ transform: 'scaleX(-1)' }} />
          {!isMobile && <img src={logoWhite}
                style={{
                  width: '150px',
                }}/>}
        </Box>
        

        <SideBarMenu img={Home} title='Home' number={number} idx={0} url="/home"/>
        <SideBarMenu img={Profile} title='My Library' number={number} idx={1} url="/library"/>

        
    </Box>
  )
}

export default SideBar