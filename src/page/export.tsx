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
import interfaceIcon from '../asset/interface.gif'

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
        .then(async response => 
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
                await refreshApi(api, notify, navigate)
              } else if (response.status === 400) {
                navigate(`/dashboard?workspaceId=${workspaceId}`)
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
        
        <Box sx={{width: '100%', height: '50vh', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center'}}>
            <img src={interfaceIcon} width="20%"/>
            <Typography sx={{fontSize: '15px', fontWeight: 500, mt: 3}}>
                Work in Progress
            </Typography>
        </Box>
    </Box>
  )
}

export default Export