import {Menu} from 'react-admin';
import LabelIcon from '@mui/icons-material/Label';
import HomeIcon from '@mui/icons-material/Home';
import StorageIcon from '@mui/icons-material/Storage';
import HistoryIcon from '@mui/icons-material/History';

export const Mymenu = () => (
    <Menu>
        < Menu.Item to="/home" primaryText="Home" leftIcon = {<HomeIcon />} />
        < Menu.Item to="/paperStorage" primaryText="관심 논문" leftIcon = {<StorageIcon />} />
        < Menu.Item to="/history" primaryText="히스토리" leftIcon = {<HistoryIcon />} />
        {/* < Menu.ResourceItem name="users" /> */}
    </Menu>
)