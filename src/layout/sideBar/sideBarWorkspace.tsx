import { Box, Typography } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import SideBarMenu from './sideBarMenu'
import chat from '../../asset/chat.svg'
import home from '../../asset/home.svg'
import works from '../../asset/works.svg'
import history from '../../asset/history.svg'
import study from '../../asset/study.svg'
import rightarrowWhite from '../../asset/rightarrowWhite.svg'
import { color } from '../color'

const SideBarWorkspace = ({number}:{number: number}) => {
    const navigate = useNavigate()
    const workspaceId = sessionStorage.getItem('workspaceId')
    const workspaceTitle = sessionStorage.getItem('workspaceTitle')
    return (
      <Box sx={{width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', cursor: 'pointer'}}>
          <Typography sx={{
              color: 'white',
              textAlign: 'center',
              fontSize: '26px',
              fontStyle: 'normal',
              fontWeight: '600',
              lineHeight: 'normal',
              pt: 2,
              pb: 4
          }}
          onClick={()=>{window.location.replace("/home?workspaceId="+workspaceId)}}
          >{workspaceTitle}</Typography>
        <SideBarMenu img={home} title='Home' number={number} idx={0} url={"/home?workspaceId="+workspaceId}/>
        <SideBarMenu img={works} title='My works' number={number} idx={1} url="/paperstorage"/>
        <SideBarMenu img={study} title='Study with AI' number={number} idx={2} url="/selectpaper"/>
        <SideBarMenu img={history} title='History' number={number} idx={3} url="/history"/>
        
        <Box sx={{position: 'absolute', bottom: '5vh', width: '17vw', ml: 4,
        }} onClick={()=>{navigate('/workspaces')}}>
          <Box sx={{display: 'inline-flex', height: '60px', width: '85%', justifyContent: 'center', alignItems: 'center', gap: '10px',
                  borderRadius: '20px', border: '1px solid #fff',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }}}>
              <img src={rightarrowWhite} style={{ transform: 'rotate(180deg)' }}/>
              <Typography sx={{color: color.white, fontSize: '16px', fontWeight: 600}}>
                Workspaces
              </Typography>
          </Box>
          {/* <SideBarMenu img={history} title='Workspaces' number={number} idx={4} url="/workspaces" /> */}
        </Box>
        
      </Box>
    )
}

export default SideBarWorkspace