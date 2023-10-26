import { Box, Button } from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download';
import { useNotify } from 'react-admin';

const DownloadButton = ({clickEvent}:{clickEvent:any}) => {
    const notify = useNotify();
    const handleCopy = (copyContents: string) => {
        navigator.clipboard.writeText(copyContents)
        notify('Copied', {type:'success'})
    };
  return (
    <Box sx={{width: '30px', height: '30px', borderRadius: '100%', border: '1px solid #ddd',
    display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer'}} onClick={clickEvent}>
        <DownloadIcon sx={{ fontSize: "18px", color: '#333' }}/>
    </Box>
  )
}

export default DownloadButton