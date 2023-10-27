import { Box, Button, FormControl, FormControlLabel, FormLabel, InputLabel, MenuItem, Modal, Radio, RadioGroup, Select, SelectChangeEvent, Typography } from '@mui/material'
import React, { useCallback, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CounterState, SET_SUMMARY_ANSWER } from '../reducer'
import { postApi, refreshApi } from '../utils/apiUtils'
import { useNotify } from 'react-admin'
import { useNavigate } from 'react-router-dom'
import CopyClick from '../component/copyClick'
import exportChat from '../asset/exportIcon.png'
import { color } from '../layout/color'
import scrollStyle from "../layout/scroll.module.css"
import chat from "../asset/chatProfile.png"
import Mermaid from '../component/mermaid'
import downloadjs from "downloadjs"
import { toPng } from "html-to-image"
import DownloadButton from '../component/downloadButton'
import spinner from '../asset/spinner.gif'

const Export = () => {
    const [colorSum, setColorSum] = useState<string>('All')
    const [fileFormat, setFileFormat] = useState<string>('Markdown')
    const [purpose, setPurpose] = useState<string>('Not selected')
    const [open, setOpen] = React.useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const handleClose = () => setOpen(false);

    const api: string = useSelector((state: CounterState) => state.api)
    const workspaceId = Number(sessionStorage.getItem("workspaceId"));

    const annotations = useSelector((state: CounterState) => state.annotations)
    const summaryAnswer = useSelector((state: CounterState) => state.summaryAnswer)
    const notify = useNotify()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const ref = useRef<HTMLDivElement>(null)

    const handleColorChange = (event: SelectChangeEvent) => {
        setColorSum(event.target.value);
      };
    const handleFileFormatChange = (event: SelectChangeEvent) => {
        setFileFormat(event.target.value)
    }
    const handlePurposeChange = (event: SelectChangeEvent) => {
        setPurpose(event.target.value)
    }

    const handleGenerate = () => {
        setIsLoading(true)
        const updatedAnnotations = annotations.map((annotation:any) => {
            const changeItem = {
                ...annotation,
                itemId: annotation.id,
                itemType: annotation.type
            }
            delete changeItem.id
            delete changeItem.type
            return changeItem
        })
        const payload = {
            annotations: colorSum==='All'?updatedAnnotations:updatedAnnotations?.filter((obj: any) => obj.color === color),
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
                    data: {
                        mermaid: data.mermaid,
                        answer: data.exportResult,
                    }
                  })
                })
              } else if (response.status === 401) {
                refreshApi(api, notify, navigate)
              }
            })
        .finally(() => {
            setIsLoading(false)
            setOpen(true)
        })
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

    const chatProfile = () => {
        return (
            <Box sx={{width: '35px', height: '35px', borderRadius: '100%', bgcolor: color.mainGreen,
                display: 'flex', justifyContent: 'center', alignItems: 'center', mr: 1}}>
                <img src={chat} alt="chat profile" style={{width: '18px', height: '18px'}}/>
            </Box>
        )
    }

    const handleDownloadImg = useCallback(async() => {
        if (ref.current) {
            downloadjs(await toPng(ref.current), "test.png")
        }
    }, [])

  return (
    <Box sx={{display: 'flex', flexDirection: 'column', mt: 4}}>
        {isLoading ?
        <Box sx={{width: '100%', height: '50vh', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center'}}>
            <img src={spinner} width="20%"/>
            <Typography sx={{fontSize: '15px', fontWeight: 500}}>
                Generate...
            </Typography>
        </Box>: (open?
        <Box sx={{px: 4, pt: 1, pb: 4}}>
            {summaryAnswer.mermaid ? (
                <Box>
                    <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                        <DownloadButton clickEvent={handleDownloadImg} />
                    </Box>
                    <Box ref={ref} sx={{bgcolor: color.white, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <Mermaid chart={summaryAnswer.answer} />
                    </Box>
                </Box>
            ) : (
                <Box>
                    <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                        <CopyClick contents={summaryAnswer.answer} />
                    </Box>
                    <Box sx={{overflowY: 'scroll'}} className={scrollStyle.scrollBar}>
                        <Typography sx={{fontSize: '16px', color: '#666'}}>
                            {summaryAnswer.answer}
                        </Typography>
                    </Box>
                </Box>
            )}
        </Box>
        :<>
        <Box sx={{px: 4, overflowY: 'scroll'}} className={scrollStyle.scrollBar}>
        <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
            {chatProfile()}
            <Typography sx={{fontSize: '20px', fontWeight: 500, color: '#333', width: '90%'}}>
                Select a color for the content you wish to summarize
            </Typography>
        </Box>
        <FormControl sx={{width: '30%', ml: 5.5, mt: 2}}>
            <InputLabel id="demo-simple-select-label">Color</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={colorSum}
                onChange={handleColorChange}
                sx={{bgcolor: '#fff', border: '1px solid #ddd'}}
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
        <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mt: 3}}>
            {chatProfile()}
            <Typography sx={{fontSize: '20px', fontWeight: 500, color: '#333'}}>
                Select a file format
            </Typography>
        </Box>
        <FormControl sx={{ ml: 5.5}}>
            {/* <FormLabel id="demo-radio-buttons-group-label">File Format</FormLabel> */}
            <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                name="radio-buttons-group"
                value={fileFormat}
                onChange={handleFileFormatChange}
                sx={{stroke: '#ddd'}}
            >
                <FormControlLabel value="Markdown" control={<Radio />} label="Markdown" sx={{color: "#444"}}/>
                <FormControlLabel value="Text" control={<Radio />} label="Text" sx={{color: "#444"}}/>
                <FormControlLabel value="Image" control={<Radio />} label="Image" sx={{color: "#444"}}/>
            </RadioGroup>
        </FormControl>
        <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mt: 2}}>
            {chatProfile()}
            <Typography sx={{fontSize: '20px', fontWeight: 500, color: '#333'}}>
                Select a export purpose
            </Typography>
        </Box>
        <FormControl sx={{ ml: 5.5}}>
            {/* <FormLabel id="demo-radio-buttons-group-label">Purpose</FormLabel> */}
            <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                name="radio-buttons-group"
                value={purpose}
                onChange={handlePurposeChange}
                sx={{stroke: '#ddd'}}
            >
                <FormControlLabel value="Not selected" control={<Radio />} label="Not selected" sx={{color: "#444"}}/>
                <FormControlLabel value="Seminar" control={<Radio />} label="Seminar" sx={{color: "#444"}}/>
                <FormControlLabel value="Research Log" control={<Radio />} label="Research Log" sx={{color: "#444"}}/>
            </RadioGroup>
        </FormControl>
        </Box>
        <Box onClick={handleGenerate} sx={{bottom: 0, width: '100%', position: 'fixed',
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    bgcolor: color.mainGreen, height: '50px', cursor: 'pointer'}}>
            <Typography sx={{fontSize: 20, fontWeight: 500, color: color.white}}>
                Generate
            </Typography>
        </Box>
        </>)}
        {/* <Modal
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
      </Modal> */}
    </Box>
  )
}

export default Export