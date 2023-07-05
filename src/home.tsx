import * as React from "react";
import { Card, CardContent } from '@mui/material';
import { Container, InputAdornment, TextField, IconButton } from "@mui/material";
import { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { Title } from 'react-admin';
import * as amplitude from '@amplitude/analytics-browser';

export const Home = () => {
    useEffect(() => {
        amplitude.track("Home Page Viewed");
    }, []);
    
    const [searchTerm, setSearchTerm] = useState("");

    const handleChange = (event: any) => {
        setSearchTerm(event.target.value)
    };

    return (
    <div>
        <Title title="Home" />
        <CardContent sx={{ margin: '30px auto' }}>
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <TextField
                id="search"
                type="search"
                placeholder="CNN과 관련된 논문을 찾아줘"
                label="Search"
                value={searchTerm}
                onChange={handleChange}
                sx={{ width: '80%' }}
                InputProps={{
                    endAdornment: (
                    <InputAdornment position="end">
                        <IconButton>
                        <SearchIcon />
                        </IconButton>
                    </InputAdornment>
                    ),
                }}
                />
            </Container>
            {/* <div>
                    <input
                        type="text"
                        id="search"
                        placeholder="CNN과 관련된 논문을 찾아줘"
                        value={searchTerm}
                        onChange={handleChange}
                        style={{
                        height: '40px',
                        width: '600px',
                        padding: 'auto',
                        backgroundColor: '#F3F3F3',
                        border: 'none',
                        borderBottom: '1px solid black',
                        borderColor: '#999999'
                        }}
                    />
                    <IconButton>
                        <SearchIcon />
                    </IconButton>
                    </div> */}
        </CardContent>
    </div>
    )
};

