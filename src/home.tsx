import * as React from "react";
import { Card, CardContent } from '@mui/material';
import { Grid, Box, Container, InputAdornment, TextField, IconButton, Typography, Button } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useState, useEffect, useRef, KeyboardEvent, MouseEvent } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { Title, useAuthenticated } from 'react-admin';
import { useNavigate } from 'react-router-dom';
import * as amplitude from '@amplitude/analytics-browser';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { SearchTap } from "./component/searchTap";
import { GoToArxiv } from "./component/goToArxiv";
import { GoToViewMore } from "./component/goToViewMore";
import { UserProfileCheck } from "./component/userProfileCheck";
import { HeartClick } from "./component/heartClick";

export const Home = () => {
    useAuthenticated();
    const navigate = useNavigate();
    UserProfileCheck();

    var api = '';
    if (process.env.NODE_ENV === 'development'){
      api = `${import.meta.env.VITE_REACT_APP_LOCAL_SERVER}`
    }
    else if (process.env.NODE_ENV === 'production'){
      api = `${process.env.VITE_REACT_APP_AWS_SERVER}`
    }
    
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<any>("");
    const [enteredSearch, setEnteredSearch] = useState(""); 
    const [isFavorite, setIsFavorite] = useState(false);
    const [paperIdArray, setPaperIdArray] = useState<string[]>([]); 

    const searchInputRef = useRef<HTMLInputElement | null>(null);

    const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter'){
          event.preventDefault();
          setEnteredSearch(searchResults);
          window.location.href = `/home?query=${searchTerm}`
          //const query = new URLSearchParams();
          //query.set('query', searchTerm);
          //window.history.pushState(null, '', `?query=${searchTerm}`);
          //performSearch();
      }
  }

  const handleButtonClick = (event: any) => {
      event.preventDefault();
      setEnteredSearch(searchResults);
      window.location.href = `/home?query=${searchTerm}`
      //performSearch();
  }

  const username = sessionStorage.getItem("username");

  const performSearch = async () => {
      try {
          
          const query= new URLSearchParams(window.location.search); 
          const performSearchTerm = query.get('query') || '';
          // console.log("performsearch", performSearchTerm)
          // setSearchTerm(performSearchTerm)
          // console.log("searchTerm: ", performSearchTerm)
          // const response = await fetch(`http://be.yeondoo.net:8080/homesearch?query=${searchTerm}&&username=${username}`);
          const response = await fetch(`${api}/api/homesearch?query=${performSearchTerm}&&username=${username}`);
          const data = await response.json();

          setSearchResults(data);
      } catch (error) {
          console.error('검색 결과에서 오류가 발생했습니다.')
      }
  };


  const handleHeartClick = (paperId:any) => {
    var payload
    if (paperIdArray.includes(paperId)) {
      for (var i = 0; i<paperIdArray.length; i++){
        if (paperIdArray[i] === paperId) {
          paperIdArray.splice(i, 1);
          break;
        }
      }
      setPaperIdArray(paperIdArray)
      payload = {
        username: sessionStorage.getItem('username'),
        paperId: paperId,
        onoff: false
      }
    }
    else {
      setPaperIdArray(prevArray => [...prevArray, paperId]);
      payload = {
        username: sessionStorage.getItem('username'),
        paperId: paperId,
        onoff: true
      }
    }
    setIsFavorite(!isFavorite);

    fetch(`${api}/api/paperlikeonoff`, {
      method: 'POST',
      headers: { 'Content-Type' : 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('찜 버튼 에러')
      }
    })

  }

  const handleUpdateLikes = (paperId:any, newLikes:any) => {
    // Create a new array of papers with updated likes count
    const updatedPapers = searchResults.papers.map((paper:any) =>
      paper.paperId === paperId ? { ...paper, likes: newLikes } : paper
    );

    // Update the searchResults state with the new array of papers
    setSearchResults((prevSearchResults: any) => ({
      ...prevSearchResults,
      papers: updatedPapers,
    }));
  };

  useEffect(() => {
    amplitude.track("Home Page Viewed");
    searchInputRef.current?.focus();
    // console.log(window.location.search)
    const query = new URLSearchParams(window.location.search);
    const searchTermParam = query.get('query') || '';
    if (searchTermParam) {
      setSearchTerm(searchTermParam);
      performSearch();
    }
  }, [location, paperIdArray]);

    return (
    <div style={{height: '50vh'}}>
        <Title title="Home" />
          <SearchTap
            searchTerm={searchTerm}
            onChange={setSearchTerm}
            onSearch={handleButtonClick}
            onSearchKeyDown={handleSearchKeyDown}
            placeholder="CNN과 관련된 논문을 찾아줘"
            firstBoxSx={{ margin: '30px auto' }}
            middleBoxSx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            sx={{width: "80%"}}
          />
        {searchResults && (<div>
  <Grid container spacing={2}>
    <Grid item xs={6}>
      <Box sx={{ display:'flex', border: '1px solid #E6E6FA', margin: '10px', padding: '20px', height: '95%', borderRadius: '15px', backgroundColor: '#E6E6FA', 
      overflowY: 'scroll',
      scrollbarWidth: 'thin',
      }}>
        <Box sx={{height: '60vh', marginRight: '5px'}}>
          <QuestionAnswerIcon />
        </Box>
        {searchResults.answer}
      </Box>
    </Grid>
    <Grid item xs={6}>
      <CardContent sx={{ height: '75vh', margin: '0 30px 0 10px', padding: '10px', overflowY: 'scroll'}}>
        {searchResults.papers.map((paper: any) => (
          <Box key={paper.paperId} sx={{ display: 'flex', justifyContent: 'center', marginBottom: '15px'}}>
            <Container sx={{ border: '1px solid #DCDCDC', padding: '15px', borderRadius: '15px', backgroundColor: '#DCDCDC'}}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignContent: 'center' }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6">{paper.title}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
                <HeartClick currentItem={paper} home={true} onUpdateLikes={handleUpdateLikes}/>
                <Typography variant="body2" sx={{ margin: '10px 0' }}>
                  {paper.likes}
                </Typography>
              </Box>
            </Box>
              <Typography variant="body2"> {paper.authors.slice(0,3).join(", ")} / {paper.year} / {paper.conference} / {paper.cites} </Typography>
              <Box sx = {{margin: "15px 0 0 0" , display: 'flex'}}>
                {/* <Button variant="contained" onClick={() => handleViewPaper(paper.url) }>논문 보기</Button> */}
                <GoToArxiv url={paper.url} />

                <Box sx={{width: '15px'}}></Box>
                {/* <Button variant ="contained" onClick={() => handleViewMore(paper.paperId)}>자세히 보기</Button> */}
                <GoToViewMore paperid={paper.paperId} />
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

