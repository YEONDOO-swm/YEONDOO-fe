import { Box, Button, FormControl, FormControlLabel, FormLabel, InputLabel, MenuItem, Modal, Radio, RadioGroup, Select, SelectChangeEvent, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CounterState, SET_SUMMARY_ANSWER } from '../reducer'
import { postApi, refreshApi } from '../utils/apiUtils'
import { useNotify } from 'react-admin'
import { useNavigate } from 'react-router-dom'
import CopyClick from '../component/copyClick'

const Export = () => {
    const [color, setColor] = useState<string>('All')
    const [fileFormat, setFileFormat] = useState<string>('Markdown')
    const [purpose, setPurpose] = useState<string>('Not selected')
    const [open, setOpen] = React.useState(false);
    const handleClose = () => setOpen(false);

    const api: string = useSelector((state: CounterState) => state.api)
    const workspaceId = Number(sessionStorage.getItem("workspaceId"));

    const annotations = useSelector((state: CounterState) => state.annotations)
    const summaryAnswer = useSelector((state: CounterState) => state.summaryAnswer)
    const notify = useNotify()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleColorChange = (event: SelectChangeEvent) => {
        setColor(event.target.value);
      };
    const handleFileFormatChange = (event: SelectChangeEvent) => {
        setFileFormat(event.target.value)
    }
    const handlePurposeChange = (event: SelectChangeEvent) => {
        setPurpose(event.target.value)
    }

    const handleGenerate = () => {
        const payload = {
            annotations: color==='All'?annotations:annotations?.filter((obj: any) => obj.color === color),
            fileFormat: fileFormat,
            purpose: purpose
        }
        postApi(api, `/api/paper/export?workspaceId=${workspaceId}`,payload)
        .then(response => 
            {
              if (response.status === 200) {
                return response.json().then(data => {
                  dispatch({
                    type: SET_SUMMARY_ANSWER,
                    data: data.exportResult
                  })
                })
              } else if (response.status === 401) {
                refreshApi(api, notify, navigate)
              }
            })
        .finally(() => setOpen(true))
        .catch(error => console.log(error))
    }
    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      };
  return (
    <Box sx={{p: 10, display: 'flex', flexDirection: 'column'}}>
        <Typography variant='h5'>
            Select a color for the content you wish to summarize
        </Typography>
        <FormControl sx={{width: '30%'}}>
            <InputLabel id="demo-simple-select-label">Color</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={color}
                onChange={handleColorChange}
            >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="#ffd400">Yellow</MenuItem>
                <MenuItem value="#ff6666">Red</MenuItem>
                <MenuItem value="#5fb236">Green</MenuItem>
                <MenuItem value="#2ea8e5">Blue</MenuItem>
                <MenuItem value="#a28ae5">Purple</MenuItem>
                <MenuItem value="#e56eee">Magenta</MenuItem>
                <MenuItem value="#f19837">Orange</MenuItem>
                <MenuItem value="#aaaaaa">Grey</MenuItem>
            </Select>
        </FormControl>
        <Typography variant='h5'>
            Select a file format
        </Typography>
        <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">File Format</FormLabel>
            <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                name="radio-buttons-group"
                value={fileFormat}
                onChange={handleFileFormatChange}
            >
                <FormControlLabel value="Markdown" control={<Radio />} label="Markdown" />
                <FormControlLabel value="Text" control={<Radio />} label="Text" />
                <FormControlLabel value="Image" control={<Radio />} label="Image" />
            </RadioGroup>
        </FormControl>
        <Typography variant='h5'>
            Select the export purpose.
        </Typography>
        <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">Purpose</FormLabel>
            <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                name="radio-buttons-group"
                value={purpose}
                onChange={handlePurposeChange}
            >
                <FormControlLabel value="Not selected" control={<Radio />} label="Not selected" />
                <FormControlLabel value="Seminar" control={<Radio />} label="Seminar" />
                <FormControlLabel value="Research Log" control={<Radio />} label="Research Log" />
            </RadioGroup>
        </FormControl>
        
        <Button variant='contained' sx={{width: '10%'}} onClick={handleGenerate}>
            Generate
        </Button>
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                Result
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                {summaryAnswer}
            </Typography>
            <CopyClick contents={summaryAnswer} />
            </Box>
      </Modal>
    </Box>
  )
}

export default Export