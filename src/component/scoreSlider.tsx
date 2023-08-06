import { Box, Slider, Typography } from '@mui/material'
import React from 'react'
import { color } from "../layout/color";

function valuetext(value: number) {
    return `${value}점`;
  }


function ScoreSlider({id, score}: {id?: any, score?:any}) {

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
        fetch(`${api}/api/paper/result/score?username=${username}`, {
            method: 'POST',
            headers : { 'Content-Type' : 'application/json' },
            body: JSON.stringify(payload)
        })
        //.then(response => response)
    }
    return (
        <Box sx={{backgroundColor: color.secondaryGreen, pt:1, px:1, borderRadius: 2, mt: 1, width: 220}}>
            <Typography variant='body2'>
                답변의 퀄리티를 평가해주세요!
            </Typography>
            <Box>
            <Slider
                size='small'
                aria-label="Score"
                defaultValue={score?score:5}
                getAriaValueText={valuetext}
                valueLabelDisplay="auto"
                onChangeCommitted={handleSlider}
                step={1}
                marks
                min={0}
                max={10}
                />
            </Box>
        </Box>
    )
}

export default ScoreSlider