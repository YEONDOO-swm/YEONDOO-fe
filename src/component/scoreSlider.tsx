import { Box, Slider, Typography } from '@mui/material'
import React, { ChangeEvent, SyntheticEvent } from 'react'
import { color } from "../layout/color";
import CampaignIcon from '@mui/icons-material/Campaign';
import * as Sentry from '@sentry/react';
import { getCookie, setCookie } from '../cookie';
import { useSelector } from 'react-redux';
import { CounterState } from '../reducer';
import { useNavigate } from 'react-router-dom';
import { useNotify } from 'react-admin';
import { postApi, refreshApi } from '../utils/apiUtils';


function valuetext(value: number) {
    return `${value}점`;
  }

  const marks = [
    {
      value: 0,
      label: '0',
    },
    {
      value: 1,
      label: '1',
    },
    {
      value: 2,
      label: '2',
    },
    {
      value: 3,
      label: '3',
    },
    {
        value: 4,
        label: '4',
      },
      {
        value: 5,
        label: '5',
      },
      {
        value: 6,
        label: '6',
      },
      {
        value: 7,
        label: '7',
      },
      {
        value: 8,
        label: '8',
      },
      {
        value: 9,
        label: '9',
      },
      {
        value: 10,
        label: '10',
      },
      
  ];


function ScoreSlider({id, score, paper}: {id: number, score?:number | null, paper?:boolean}) {

    const api = useSelector((state: CounterState) => state.api)

    const workspaceId = Number(sessionStorage.getItem('workspaceId'))

    const navigate = useNavigate()
    const notify = useNotify()

    const handleSlider = (event: Event | SyntheticEvent<Element, Event>, newValue: number | number[]) => {
        const payload = {
            id: id,
            score: newValue
        }
        if (paper){
          postApi(api, `/api/paper/result/score?workspaceId=${workspaceId}`, JSON.stringify(payload))
          .then(async response =>{
            if (response.status === 401) {
              await refreshApi(api, notify, navigate)
            }
            return response
          })
          .catch(error => {
            Sentry.captureException(error)
          })
        } else {
          postApi(api, `/api/home/result/score?workspaceId=${workspaceId}`, JSON.stringify(payload))
          .then(async response =>{
          if (response.status === 401) {
            await refreshApi(api, notify, navigate)
          }
          return response
        })
        .catch(error => {
          Sentry.captureException(error)
        })
        }
        //.then(response => response)
    }
    return (
        <Box sx={{display:'flex', flexDirection: 'column', justifyContent:'center', backgroundColor: paper?color.mainGreen:color.white, pt:1, px:3, borderRadius: 2, width: '100%'}}>
            <Typography variant='body2' sx={{display: 'flex',justifyContent: 'center', alignItems:'center'}}>
                <CampaignIcon sx={{marginRight: '3px'}}/>  
                  Please rate the quality of the answer!
            </Typography>
            <Box>
            <Slider
                size='small'
                aria-label="Score"
                defaultValue={score===null||score===undefined?5:score}
                marks={marks}
                getAriaValueText={valuetext}
                valueLabelDisplay="auto"
                onChangeCommitted={handleSlider}
                step={1}
                
                min={0}
                max={10}
                sx={{justifyContent:'center'}}
                />
            </Box>
        </Box>
    )
}

export default ScoreSlider