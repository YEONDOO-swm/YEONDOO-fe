import { Box, Button } from '@mui/material'
import React from 'react'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useNotify } from 'react-admin';
import { color } from "../layout/color";

const CopyClick = ({contents}:{contents: string}) => {
    const notify = useNotify();
    const handleCopy = (copyContents: string) => {
        navigator.clipboard.writeText(copyContents)
        notify('Copied', {type:'success'})
    };
  return (
    <Box sx={{width: '30px', height: '30px', borderRadius: '100%', border: '1px solid #ddd',
    display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer'}} onClick={()=>handleCopy(contents)}>
        <ContentCopyIcon sx={{ fontSize: "18px", color: '#333' }}/>
    </Box>
    // <Button variant="outlined" onClick={()=>handleCopy(contents)} sx={{mr:1, p:0, minWidth: 'fit-content', border: 'none', '&:hover':{border: 'none', color: color.secondaryGreen}}}>
    //     <ContentCopyIcon sx={{ fontSize: "20px" }}/>
    // </Button>
  )
}

export default CopyClick