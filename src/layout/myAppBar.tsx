import * as React from 'react';
import { AppBar, TitlePortal, useNotify } from 'react-admin';
import Box from '@mui/material/Box';
import { Typography, styled, alpha,  ToggleButtonGroup } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { SearchTap } from '../component/searchTap';
import { useState } from 'react';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import * as amplitude from '@amplitude/analytics-browser';
import MuiToggleButton from "@mui/material/ToggleButton";



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

const ToggleButton = styled(MuiToggleButton)({
  "&.Mui-selected, &.Mui-selected:hover": {
    color: "white",
    // backgroundColor: '#00ff00'
  }
});


export const MyAppBar = () => {

    const [searchTerm, setSearchTerm] = useState("");
    const [searchType, setSearchType] = useState("1");
    const notify = useNotify()
    const navigate = useNavigate()
    const maxLengthLimit = 300

    const handleSearchKeyDown = (event: any) => {
      if (event.key === 'Enter' && event.nativeEvent.isComposing === false){
          event.preventDefault();
          if (!searchTerm) {
            notify("검색어를 입력해주세요", {type: 'error'})
            return
          }
          if (!searchType) {
            notify("검색 유형을 선택해주세요", {type: 'error'})
            return
          }
          if (process.env.NODE_ENV === 'production') {
            amplitude.track("app bar 내 검색 이용")
          }
          navigate(`/home?query=${searchTerm}&type=${searchType}`)
          setSearchTerm('')
          //window.location.href = `/home?query=${searchTerm}&type=${searchType}&appbar=${1}`
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

    const handleChangeSearchType = (event: React.MouseEvent<HTMLElement>,
      newType: string) => {
      setSearchType(newType)
    }

    return (<AppBar >
      <TitlePortal />
      {location.pathname !== '/home' && (
        <>
          <ToggleButtonGroup
          size="small"
          sx={{backgroundColor: alpha('#FFFFFF', 0.25),
          }}
          value={searchType}
          exclusive
          onChange={handleChangeSearchType}
          
          >  
            <ToggleButton value="1" >논문 제목 검색</ToggleButton>
            <ToggleButton value="2" sx={{}}>개념 질문</ToggleButton>
          </ToggleButtonGroup>
          <Typography variant='h6' sx={{mx: 2}}>
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
        </>
      )}
    </AppBar> )
};
  
