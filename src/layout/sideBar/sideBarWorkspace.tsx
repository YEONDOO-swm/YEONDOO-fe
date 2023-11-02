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
import dashboard from '../../asset/Dashboard.svg'
import workspaceIcon from '../../asset/workspaceIcon.svg'

const SideBarWorkspace = ({number}:{number: number}) => {
    const navigate = useNavigate()
    const workspaceId = sessionStorage.getItem('workspaceId')
    const workspaceTitle = sessionStorage.getItem('workspaceTitle')
    return (
      <Box sx={{width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', cursor: 'pointer'}}>
          <Box onClick={()=>{window.location.replace("/dashboard?workspaceId="+workspaceId)}}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pt: 2,
              pb: 4,
              gap: 0.4,
            }}>

            <Typography sx={{
              fontSize: '12px',
              fontWeight: 700,
              color: color.mainGreen,
              bgcolor: color.white,
              borderRadius: '100%',
              px: 0.5,
              py: 0.1,
              }}>W</Typography>
            {/* <img src={workspaceIcon} width="10%"/> */}
            <Typography sx={{
                color: 'white',
                textAlign: 'center',
                fontSize: '22px',
                fontStyle: 'normal',
                fontWeight: '600',
                lineHeight: 'normal',
            }}
            >{workspaceTitle && (workspaceTitle.length > 15?workspaceTitle.slice(0,15)+"...":workspaceTitle)}</Typography>
          </Box>
        <SideBarMenu img={dashboard} title='Dashboard' number={number} idx={0} url={"/dashboard?workspaceId="+workspaceId}/>
        <SideBarMenu img={works} title='My Works' number={number} idx={1} url={"/paperstorage?workspaceId="+workspaceId}/>
        <SideBarMenu img={study} title='Study with AI' number={number} idx={2} url={"/selectpaper?workspaceId="+workspaceId}/>
        <SideBarMenu img={history} title='History' number={number} idx={3} url={"/history?workspaceId="+workspaceId}/>
        
        <Box sx={{position: 'absolute', bottom: '5vh', width: '17vw', ml: 4,
        }} onClick={()=>{navigate('/home')}}>
          <Box sx={{display: 'inline-flex', height: '60px', width: '85%', justifyContent: 'center', alignItems: 'center', gap: '10px',
                  borderRadius: '20px', border: '1px solid #fff',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }}}>
              <img src={rightarrowWhite} style={{ transform: 'rotate(180deg)' }}/>
              <Typography sx={{color: color.white, fontSize: '16px', fontWeight: 600}}>
                Home
              </Typography>
          </Box>
          {/* <SideBarMenu img={history} title='Workspaces' number={number} idx={4} url="/workspaces" /> */}
        </Box>
        
      </Box>
    )
}

export default SideBarWorkspace