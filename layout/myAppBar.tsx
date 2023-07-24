import * as React from 'react';
import { AppBar, TitlePortal } from 'react-admin';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';


export const MyAppBar = () => (
    <AppBar>
      <TitlePortal />
      <Typography variant='h6' >
        <Link to="/home" style={{ textDecoration: 'none', color: 'white' }}>
          <Box sx={{ margin: '0px 550px'}}>🍀 Yeondoo</Box>
        </Link>
      </Typography>
    </AppBar>
  );
  
