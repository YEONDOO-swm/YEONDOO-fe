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
import { SearchTap } from "../component/searchTap";
import { GoToArxiv } from "../component/goToArxiv";
import { GoToViewMore } from "../component/goToViewMore";
import { UserProfileCheck } from "../component/userProfileCheck";
import { HeartClick } from "../component/heartClick";
import loadingStyle from "../layout/loading.module.css";
import scrollStyle from "../layout/scroll.module.css";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { color } from "../layout/color";

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
    const [loading, setLoading] = useState<boolean>(false);

    const searchInputRef = useRef<HTMLInputElement | null>(null);

    const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter' && event.nativeEvent.isComposing === false){
          event.preventDefault();
          setEnteredSearch(searchResults);
          amplitude.track("Home에서 검색")
          window.location.href = `/home?query=${searchTerm}`
      }
  }
  
  const handleButtonClick = (event: any) => {
      event.preventDefault();
      setEnteredSearch(searchResults);
      amplitude.track("Home에서 검색")
      window.location.href = `/home?query=${searchTerm}`
  }

  const username = sessionStorage.getItem("username");

  const performSearch = async () => {
      try {
          setLoading(true)
          const query= new URLSearchParams(window.location.search); 
          const performSearchTerm = query.get('query') || '';
          const response = await fetch(`${api}/api/homesearch?query=${performSearchTerm}&&username=${username}`);
          const data = await response.json();

          setSearchResults(data);
      } catch (error) {
          console.error('검색 결과에서 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
  };


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
          {loading ? (
            <div >
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Card sx={{ display: 'flex', border: `1px solid ${color.mainGreen}`, margin: '10px', padding: '20px', height: '70vh', borderRadius: '15px', backgroundColor: color.mainGreen, opacity: '0.7'}}>
                    <Box sx={{marginRight: '5px'}}>
                      <QuestionAnswerIcon />
                    </Box>
                    <MoreHorizIcon className={loadingStyle.loading}/>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <CardContent sx={{ height: '75vh', margin: '0 30px 0 10px', padding: '10px'}} className={loadingStyle.loading}>
                    <Card sx={{ height: '20vh', backgroundColor: color.loadingColor, opacity: '0.2', borderRadius: '15px', marginBottom: '15px'}}>

                    </Card>
                    <Card sx={{ height: '20vh', backgroundColor: color.loadingColor, opacity: '0.2', borderRadius: '15px',}}>

                    </Card>
                  </CardContent>
                </Grid>
              </Grid>
            </div>
          ) :
        (searchResults && (<div>
  <Grid container spacing={2}>
    <Grid item xs={6}>
      <Card sx={{ display:'flex', border: `1px solid ${color.mainGreen}`, margin: '10px', padding: '20px', height: '70vh', borderRadius: '15px', backgroundColor: color.mainGreen, 
      overflowY: 'scroll'
      }} className={scrollStyle.scrollBar}>
        <Box sx={{marginRight: '5px'}}>
          <QuestionAnswerIcon />
        </Box>
        {searchResults.answer}
      </Card>
    </Grid>
    <Grid item xs={6}>
      <CardContent sx={{ height: '75vh', margin: '0 30px 0 10px', padding: '10px', overflowY: 'scroll'}} className={scrollStyle.scrollBar}>
        {searchResults.papers.map((paper: any) => (
          <Card key={paper.paperId} sx={{ display: 'flex', justifyContent: 'center', marginBottom: '15px', border: `1px solid ${color.mainGrey}`, padding: '15px 5px', borderRadius: '15px', backgroundColor: color.mainGrey}}>
            <Container>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignContent: 'center' }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6">{paper.title}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
                <HeartClick currentItem={paper} onUpdateLikes={handleUpdateLikes} paperlike={paper.islike}/>
                <Typography variant="body2" sx={{ margin: '10px 0' }}>
                  {paper.likes}
                </Typography>
              </Box>
            </Box>
              <Typography variant="body2"> {paper.authors.slice(0,3).join(", ")} / {paper.year} / {paper.conference} / cites: {paper.cites} </Typography>
              <Box sx = {{margin: "15px 0 0 0" , display: 'flex'}}>
                {/* <Button variant="contained" onClick={() => handleViewPaper(paper.url) }>논문 보기</Button> */}
                <GoToArxiv url={paper.url} paperId={paper.paperId}/>

                <Box sx={{width: '15px'}}></Box>
                {/* <Button variant ="contained" onClick={() => handleViewMore(paper.paperId)}>자세히 보기</Button> */}
                <GoToViewMore paperid={paper.paperId} />
              </Box>
              {/* Add other details for the paper */}
            </Container>
          </Card>
        ))}
      </CardContent>
    </Grid>
  </Grid>
</div>))}
    </div>
    )
};

