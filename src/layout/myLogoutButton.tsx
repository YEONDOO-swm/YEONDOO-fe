import * as React from 'react';
import { forwardRef } from 'react';
import { MenuItemLink, UserMenu, useLogout } from 'react-admin';
import MenuItem from '@mui/material/MenuItem';
import ExitIcon from '@mui/icons-material/PowerSettingsNew';
import { Box } from '@mui/material';

// It's important to pass the ref to allow Material UI to manage the keyboard navigation
const MyLogoutButton = (props: any) => {
    const logout = useLogout();
    const handleClick = () => logout();
    return (
      <UserMenu {...props} >
        <MenuItemLink
        to={"/login"}
        primaryText="Profile"
        leftIcon={<ExitIcon />}
        />
        <Box>
          hoho
        </Box>
      </UserMenu>
    );
};

export default MyLogoutButton;