import * as React from 'react';
import { AppBar, TitlePortal } from 'react-admin';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';


export const MyAppBar = () => (
    <AppBar>
        <TitlePortal />
        <Box flex={0.6} /> 
        <Link to="/home" style={{ textDecoration: 'none', color: 'white' }}>
            <Typography variant='h6'> 🍀 Yeondoo </Typography>
        </Link>
        <Box flex={1} /> 
    </AppBar>
);