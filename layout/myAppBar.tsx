import * as React from 'react';
import { AppBar, TitlePortal } from 'react-admin';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';


export const MyAppBar = () => (
    <AppBar>
        <TitlePortal />
        <Typography variant='h6' sx={{ width: '80%', display: 'flex', justifyContent: 'center' }}>
            <Link to="/home" style={{ textDecoration: 'none', color: 'white' }}>
                🍀 Yeondoo
            </Link>
        </Typography>
    </AppBar>
);