import { Box, Slider, Typography } from '@mui/material'
import React from 'react'
import { color } from "../layout/color";
import CampaignIcon from '@mui/icons-material/Campaign';
import * as Sentry from '@Sentry/react';


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


function ScoreSlider({id, score, paper}: {id: any, score?:any, paper?:boolean}) {

    var api = '';
    if (process.env.NODE_ENV === 'development'){
      api = `${import.meta.env.VITE_REACT_APP_LOCAL_SERVER}`
    }
    else if (process.env.NODE_ENV === 'production'){
      api = `${process.env.VITE_REACT_APP_AWS_SERVER}`
    }

    const username = sessionStorage.getItem('username')

    const handleSlider = (event: any, newValue:any) => {
        const payload = {
            id: id,
            score: newValue
        }
        //console.log(payload)
        if (paper){
          fetch(`${api}/api/paper/result/score?username=${username}`, {
              method: 'POST',
              headers : { 'Content-Type' : 'application/json' },
              body: JSON.stringify(payload)
          })
          .catch(error => {
            Sentry.captureException(error)
          })
        } else {
          fetch(`${api}/api/home/result/score?username=${username}`, {
            method: 'POST',
            headers : { 'Content-Type' : 'application/json' },
            body: JSON.stringify(payload)
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
                답변의 퀄리티를 평가해주세요!
            </Typography>
            <Box>
            <Slider
                size='small'
                aria-label="Score"
                defaultValue={score?score:5}
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