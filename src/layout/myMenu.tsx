import {Menu} from 'react-admin';
import LabelIcon from '@mui/icons-material/Label';
import HomeIcon from '@mui/icons-material/Home';
import StorageIcon from '@mui/icons-material/Storage';
import HistoryIcon from '@mui/icons-material/History';
import { Box } from '@mui/material';

export const Mymenu = () => (
    // <Menu>
    //     < Menu.Item to="/home" primaryText="Home" leftIcon = {<HomeIcon />} />
    //     < Menu.Item to="/paperStorage" primaryText="Working Papers" leftIcon = {<StorageIcon />} />
    //     < Menu.Item to="/history" primaryText="History" leftIcon = {<HistoryIcon />} />
    //     {/* < Menu.ResourceItem name="users" /> */}
    //     <Box onClick={()=>{window.location.href='/home'}} sx={{ width: '100px', bgcolor: 'grey'}}>Home</Box>
    // </Menu>
    <Box sx={{width: '10vh', bgcolor: 'grey'}}>
        <Box onClick={()=>{window.location.href='/home'}} sx={{ width: '100px', fontSize: '10vh'}}>Home</Box>
    </Box>
)