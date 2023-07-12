import * as React from "react";
import { Card, CardContent } from '@mui/material';
import { Grid, Box, Container, InputAdornment, TextField, IconButton, Typography, Button } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useState, useEffect, useRef, KeyboardEvent, MouseEvent } from "react";
import SearchIcon from "@mui/icons-material/Search";
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import { Title, useAuthenticated } from 'react-admin';
import { useNavigate } from 'react-router-dom';
import * as amplitude from '@amplitude/analytics-browser';


export const Home = () => {
    useAuthenticated();
    
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState("");
    const [enteredSearch, setEnteredSearch] = useState("");

    const searchInputRef = useRef<HTMLInputElement | null>(null);

    const handleChange = (event: any) => {
        setSearchTerm(event.target.value)
    };

    const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter'){
            console.log("enter!!!!")
            event.preventDefault();
            setEnteredSearch(searchResults);
            performSearch();
        }
    }

    const handleButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
            setEnteredSearch(searchResults);
            performSearch();
    }

    const username = sessionStorage.getItem("username");

    const performSearch = async () => {
        try {
            const response = await fetch(`/api/homesearch?query=${searchTerm}&&username=${username}`);
            const data = await response.json();
            console.log(data);
            console.log(data.searchResults);
            console.log(data.searchResults.papers);
            setSearchResults(data.searchResults);
        } catch (error) {
            console.error('검색 결과에서 오류가 발생했습니다.')
        }
    };

    const handleViewPaper = (url:string) => {
        window.location.href = url;
    }

    useEffect(() => {
      amplitude.track("Home Page Viewed");
      searchInputRef.current?.focus();
    }, []);


    return (
    <div>
        <Title title="Home" />
        <CardContent sx={{ margin: '30px auto' }}>
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <TextField
                id="search"
                type="search"
                inputRef={searchInputRef}
                placeholder="CNN과 관련된 논문을 찾아줘"
                label="Search"
                value={searchTerm}
                onChange={handleChange}
                onKeyDown={handleSearchKeyDown}
                sx={{ width: '80%' }}
                InputProps={{
                    endAdornment: (
                    <InputAdornment position="end">
                        <IconButton onClick={handleButtonClick}>
                        <SearchIcon />
                        </IconButton>
                    </InputAdornment>
                    ),
                }}
                />
            </Container>
        </CardContent>
        {searchResults && (<div>
  <Grid container spacing={2}>
    <Grid item xs={6}>
      <Box sx={{ display:'flex', border: '1px solid #E6E6FA', margin: '10px', padding: '20px', height: '75vh', borderRadius: '15px', backgroundColor: '#E6E6FA'}}>
        <Box sx={{height: '75vh', marginRight: '5px'}}>
          <QuestionAnswerIcon />
        </Box>
        {searchResults.answer}
      </Box>
    </Grid>
    <Grid item xs={6}>
      <CardContent sx={{ margin: '0 30px 0 10px', padding: '10px' }}>
        {searchResults.papers.map((paper) => (
          <Box key={paper.paperId} sx={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
            <Container sx={{ border: '1px solid #E6F8E0', padding: '15px', borderRadius: '15px', backgroundColor: '#DCDCDC'}}>
              <Box sx={{display: 'flex', justifyContent:'space-between', alignContent: 'center'}}>
                <Typography variant="h6">{paper.title}</Typography>
                <Box sx={{ display: 'flex', justifyContent:'center', alignContent:'center'}}>
                  <IconButton sx={{margin: '0'}} color="error">
                    <FavoriteIcon />
                  </IconButton>
                  <Typography variant="body2" sx={{margin: '10px 0'}}>{paper.likes}</Typography>
                </Box>
              </Box>
              <Typography variant="body2"> {paper.authors.slice(0,3).join(", ")} / {paper.year} / {paper.conference} / {paper.cites} </Typography>
              <Box sx = {{margin: "15px 0 0 0" , display: 'flex'}}>
                <Button variant="contained" onClick={() => handleViewPaper(paper.url) }>논문 보기</Button>
                <Box sx={{width: '15px'}}></Box>
                <Button variant ="contained">자세히 보기</Button>
              </Box>
              {/* Add other details for the paper */}
            </Container>
          </Box>
        ))}
      </CardContent>
    </Grid>
  </Grid>
</div>)}

    </div>
    )
};

