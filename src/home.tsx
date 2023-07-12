import * as React from "react";
import { Card, CardContent } from '@mui/material';
import { Grid, Box, Container, InputAdornment, TextField, IconButton, Typography, Button } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useState, useEffect, useRef, KeyboardEvent, MouseEvent } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { Title, useAuthenticated } from 'react-admin';
import { useNavigate } from 'react-router-dom';
import * as amplitude from '@amplitude/analytics-browser';


export const Home = () => {
    useAuthenticated();
    
    const [searchTerm, setSearchTerm] = useState("");

    const handleChange = (event: any) => {
        setSearchTerm(event.target.value)
    };

    return (
    <div style={{height: '50vh'}}>
        <Title title="Home" />
        <CardContent sx={{ margin: '30px auto' }}>
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <TextField
                id="search"
                type="search"
                //inputRef={searchInputRef}
                placeholder="CNN과 관련된 논문을 찾아줘"
                label="Search"
                value={searchTerm}
                onChange={handleChange}
                //onKeyDown={handleSearchKeyDown}
                sx={{ width: '80%' }}
                InputProps={{
                    endAdornment: (
                    <InputAdornment position="end">
                        {/* <IconButton onClick={handleButtonClick}> */}
                        <SearchIcon />
                        {/* </IconButton> */}
                    </InputAdornment>
                    ),
                }}
                />
            </Container>
        </CardContent>
    </div>
    )
};

