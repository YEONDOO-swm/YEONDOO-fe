import { Box, Typography } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import SideBarMenu from './sideBarMenu'
import chat from '../../asset/chat.svg'
import home from '../../asset/home.svg'
import works from '../../asset/works.svg'
import history from '../../asset/history.svg'
import study from '../../asset/study.svg'

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
      </Box>
    )
}

export default SideBarWorkspace