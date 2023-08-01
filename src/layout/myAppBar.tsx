import * as React from 'react';
import { AppBar, TitlePortal, useNotify } from 'react-admin';
import Box from '@mui/material/Box';
import { Typography, styled, alpha } from '@mui/material';
import { Link } from 'react-router-dom';
import { SearchTap } from '../component/searchTap';
import { useState } from 'react';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import * as amplitude from '@amplitude/analytics-browser';



const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));


export const MyAppBar = () => {

    const [searchTerm, setSearchTerm] = useState("");
    const notify = useNotify()
    const maxLengthLimit = 300

    const handleSearchKeyDown = (event: any) => {
      if (event.key === 'Enter' && event.nativeEvent.isComposing === false){
          event.preventDefault();
          if (process.env.NODE_ENV === 'production') {
            amplitude.track("app bar 내 검색 이용")
          }
          window.location.href = `/home?query=${searchTerm}`
        }
    }

    const handleChange = (event: any) => {
      const inputText = event.target.value;
  
      if (inputText.length > maxLengthLimit) {
        notify('최대 300글자까지만 입력할 수 있습니다.')
        return;
      }
      setSearchTerm(inputText);
    };

    return (<AppBar sx={{ height: 'fit-content'}}>
      <TitlePortal />
      {location.pathname !== '/home' && (
        <Typography variant='h6' >
          <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="전체 검색"
                value={searchTerm}
                onChange={handleChange}
                onKeyDown={handleSearchKeyDown}
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>
        </Typography>
      )}
    </AppBar> )
};
  
