import * as React from "react";
import { Card, CardContent, FormControl, InputLabel, MenuItem, Select, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Grid, Box, Container, InputAdornment, TextField, IconButton, Typography, Button } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useState, useEffect, useRef, KeyboardEvent, MouseEvent } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { Title, useAuthenticated, useNotify } from 'react-admin';
import { useNavigate } from 'react-router-dom';
import * as amplitude from '@amplitude/analytics-browser';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { SearchTap } from "../component/searchTap";
import { GoToArxiv } from "../component/goToArxiv";
import { GoToViewMore } from "../component/goToViewMore";
import { UserProfileCheck } from "../component/userProfileCheck";
import { HeartClick } from "../component/heartClick";
import loadingStyle from "../layout/loading.module.css";
import scrollStyle from "../layout/scroll.module.css";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { color } from "../layout/color";
import CopyClick from "../component/copyClick";
import MetaTag from "../SEOMetaTag";
import ScoreSlider from "../component/scoreSlider";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

export const Home = () => {
    useAuthenticated();
    const navigate = useNavigate();
    const notify = useNotify();
    UserProfileCheck();

    var api = '';
    if (process.env.NODE_ENV === 'development'){
      api = `${import.meta.env.VITE_REACT_APP_LOCAL_SERVER}`
    }
    else if (process.env.NODE_ENV === 'production'){
      api = `${process.env.VITE_REACT_APP_AWS_SERVER}`
    }
    
    const [searchTerm, setSearchTerm] = useState("");
    const [searchType, setSearchType] = useState("1");
    const [searchResults, setSearchResults] = useState<any>("");
    //const [enteredSearch, setEnteredSearch] = useState(""); 
    //const [isFavorite, setIsFavorite] = useState(false);
    //const [paperIdArray, setPaperIdArray] = useState<string[]>([]); 
    const [loading, setLoading] = useState<boolean>(false);
    const [expandedPaperArray, setExpandedPaperArray] = useState<any>([])
    //const [sliderText, setSliderText] = useState<any>();

    const searchInputRef = useRef<HTMLInputElement | null>(null);

    const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      if (!loading && event.key === 'Enter' && event.nativeEvent.isComposing === false){
        //console.log("in!") 
        event.preventDefault();
          if (!searchTerm) {
            notify("검색어를 입력해주세요", {type: 'error'})
            return
          }
          if (!searchType) {
            notify("검색 유형을 선택해주세요", {type: 'error'})
            return
          }
          //setEnteredSearch(searchResults);
          if (process.env.NODE_ENV === 'production') {
            
            amplitude.track("Home에서 검색")
          }
          //console.log(searchType)
          
          navigate(`/home?query=${searchTerm}&type=${searchType}`)
          performSearch()
          //window.location.href = `/home?query=${searchTerm}&type=${searchType}`
      }
  }
  
  const handleButtonClick = (event: any) => {
      if (loading) {
        return
      }
      event.preventDefault();
      if (!searchTerm) {
        notify("검색어를 입력해주세요", {type: 'error'})
        return
      }
      if (!searchType) {
        notify("검색 유형을 선택해주세요", {type: 'error'})
        return
      }
      //setEnteredSearch(searchResults);
      if (process.env.NODE_ENV === 'production') {
            
        amplitude.track("Home에서 검색")
      }
      // if (process.env.NODE_ENV === 'development'){
      //   window.location.href = `http://localhost:5173/home?query=${searchTerm}&type=${searchType}`
      // }
      // else if (process.env.NODE_ENV === 'production'){
      //   window.location.href = `https://yeondoo.net/home?query=${searchTerm}&type=${searchType}`
      // }
      navigate(`/home?query=${searchTerm}&type=${searchType}`)
      performSearch()
      //window.location.href = `/home?query=${searchTerm}&type=${searchType}`
  }

  const username = sessionStorage.getItem("username");

  const performSearch = async () => {
      try {
          setLoading(true)
          const query= new URLSearchParams(window.location.search); 
          const performSearchTerm = query.get('query') || '';
          const performSearchType = query.get('type') || '';
          const response = await fetch(`${api}/api/homesearch?query=${performSearchTerm}&username=${username}&searchType=${performSearchType}`);
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


  const handleChangeSearchType = (event: React.MouseEvent<HTMLElement>,
    newType: string) => {
    //setSearchType(event.target.value)
    setSearchType(newType)
    setSearchTerm('')
    setSearchResults('')
  }

  const handleViewMoreAbstract = (paperId: any) => {
    setExpandedPaperArray((prevPaper: any)=> [...prevPaper, paperId])
  }

  const handleViewLessAbstract = (paperId: any) => {
    setExpandedPaperArray(expandedPaperArray.filter((paper: any) => paper !== paperId))
  }

  useEffect(() => {
    //console.log(location)
    if (process.env.NODE_ENV === 'production') {
            
      amplitude.track("Home Page Viewed");
    }
    searchInputRef.current?.focus();
    // console.log(window.location.search)
    const query = new URLSearchParams(window.location.search);
    const searchTermParam = query.get('query') || '';
    const searchTypeParam = query.get('type') || '';
    //const appBarParam = query.get('appbar') || '';
    if (searchTermParam && searchTypeParam) {
      setSearchTerm(searchTermParam);
      setSearchType(searchTypeParam);
      performSearch();
    }
  }, [location]);

    return (
    <div style={{height: '50vh'}}>
        <MetaTag title="연두 홈" description="궁금한 개념 질문 또는 논문 제목 검색을 하면 답변과 관련 논문을 제공합니다." keywords="논문, 검색, 질문, 개념, gpt"/>
        <Title title="Home" />
        <Box sx={{display: 'flex', margin: '30px auto', justifyContent: 'center', alignItems: 'center'}}>
          {/* <FormControl sx={{mr: 2, width: '150px'}}>
            <InputLabel>검색 유형</InputLabel>
            <Select
              value={searchType}
              label="검색 유형"
              onChange={handleChangeSearchType}
            >

              <MenuItem value={1}>논문 제목 검색</MenuItem>
              <MenuItem value={2}>개념 설명</MenuItem>

            </Select>
          </FormControl> */}
          <ToggleButtonGroup
            color="primary"
            value={searchType}
            exclusive
            onChange={handleChangeSearchType}
            aria-label="Platform"
            sx={{mr: 2}}>
              <ToggleButton value="1">논문 제목 검색</ToggleButton>
              <ToggleButton value="2">개념 질문</ToggleButton>
            </ToggleButtonGroup>
            <SearchTap
              searchTerm={searchTerm}
              onChange={setSearchTerm}
              onSearch={handleButtonClick}
              onSearchKeyDown={handleSearchKeyDown}
              placeholder={searchType=='1'?"Attention is all you need":"Transformer가 뭐야?"}
              firstBoxSx={{ width: '70%'  }}
              middleBoxSx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              sx={{width: "100%"}} />
        </Box>
          
          {loading ? (
            (searchType ==='1'?(
              <Box className={loadingStyle.loading} sx={{margin: '0 30px 0 10px'}}>
              <Card sx={{ display: 'flex', justifyContent: 'center', marginBottom: '15px', border: `1px solid ${color.loadingColor}`, height: '20vh', borderRadius: '15px', backgroundColor: color.loadingColor, opacity: '0.2'}} >
              </Card>
              <Card sx={{ display: 'flex', justifyContent: 'center', marginBottom: '15px', border: `1px solid ${color.mainGrey}`, height: '20vh', borderRadius: '15px', backgroundColor: color.loadingColor, opacity: '0.2'}} >
              </Card>
              </Box>
            ):(
              <div >
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Card sx={{ display: 'flex', alignItems: 'flex-start', border: `1px solid ${color.mainGreen}`, margin: '10px', padding: '20px', height: '70vh', borderRadius: '15px', backgroundColor: color.mainGreen, opacity: '0.7'}}>
                    <Typography sx={{fontSize: "20px"}}>🍀</Typography>
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
            ))
          ) :
        (searchResults && (searchType==='1'?(
          <Box sx={{height: '75vh', margin: '0 30px 0 10px', overflowY: 'scroll'}} className={scrollStyle.scrollBar}>
            {searchResults.papers.map((paper: any) => (
          <Card key={paper.paperId} sx={{ marginBottom: '15px', border: `1px solid ${color.mainGrey}`, padding: '15px 25px', pb: '18px', borderRadius: '15px', backgroundColor: color.mainGrey}}>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignContent: 'center' }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6">{paper.title}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
                <HeartClick currentItem={paper} onUpdateLikes={handleUpdateLikes} paperlike={paper.isLike}/>
                <Typography variant="body2" sx={{ margin: '10px 0' }}>
                  {paper.likes}
                </Typography>
              </Box>
            </Box>
              <Typography variant="body2"> {paper.authors.slice(0,3).join(", ")} / Arxiv 제출: {paper.year} / 컨퍼런스 제출: {paper.conference} / cites: {paper.cites} </Typography>
              <Typography variant="body2" sx={{fontWeight: 'bold', display: 'inline'}}>Abstract: </Typography>
              {paper.summary && paper.summary.length > 400 ? (
                !expandedPaperArray.includes(paper.paperId) ? (
                  <Typography variant="body2" sx={{ display: 'inline' }}>
                    {paper.summary.slice(0, 400)}... <span onClick={() => handleViewMoreAbstract(paper.paperId)} style={{color: color.appbarGreen, borderBottom: `1px solid ${color.appbarGreen}`, cursor: 'pointer'}}>▼ More</span>
                    {/* <IconButton onClick={()=>handleViewMoreAbstract(paper.paperId)} sx={{  }}>
                      <ExpandMoreIcon />
                    </IconButton> */}
                  </Typography>
                ) : (
                      <Typography variant="body2" sx={{display: 'inline'}}>{paper.summary}<span onClick={() => handleViewLessAbstract(paper.paperId)} style={{color: color.appbarGreen, borderBottom: `1px solid ${color.appbarGreen}`, cursor: 'pointer' }}>▲ Less</span>
                      {/* <IconButton onClick={() => handleViewLessAbstract(paper.paperId)}>
                        <ExpandLessIcon />
                    </IconButton> */}
                    </Typography>
                )
              ): (
                <Box>
                  <Typography variant="body2">{paper.summary}</Typography>
                </Box>  
              )}
              <Box sx = {{margin: "15px 0 0 0" , display: 'flex'}}>
                {/* <Button variant="contained" onClick={() => handleViewPaper(paper.url) }>논문 보기</Button> */}
                <GoToArxiv url={paper.url} paperId={paper.paperId}/>

                <Box sx={{width: '15px'}}></Box>
                {/* <Button variant ="contained" onClick={() => handleViewMore(paper.paperId)}>자세히 보기</Button> */}
                <GoToViewMore paperid={paper.paperId} />
              </Box>
              {/* Add other details for the paper */}
            
          </Card>))}
          </Box>
        ):(<div>
  <Grid container spacing={2}>
    <Grid item xs={6}>
      <Card sx={{ justifyContent: 'space-between', border: `1px solid ${color.mainGreen}`, margin: '10px', padding: '20px', height: '70vh', borderRadius: '15px', backgroundColor: color.mainGreen, 
      overflowY: 'scroll'
      }} className={scrollStyle.scrollBar}>
        <Box sx={{display: 'flex', alignItems: 'flex-start'}}>

          <Typography sx={{fontSize: "20px", mr: 1}}>🍀</Typography>
          <Box sx={{display: 'flex', flexDirection:'column'}}>
            {searchResults.answer} 
            <Box sx={{display: 'flex', flexDirection: 'row-reverse', mt: 1}}>
              <Box sx={{ml: 1}}>
                <CopyClick contents={searchResults.answer}/>
              </Box>
              <ScoreSlider id={searchResults.id}/>
            </Box>
          </Box>
        </Box>
      </Card>
    </Grid>
    <Grid item xs={6}>
      <Box sx={{ height: '75vh', margin: '0 30px 0 10px', padding: '10px', overflowY: 'scroll'}} className={scrollStyle.scrollBar}>
        {searchResults.papers.map((paper: any) => (
          <Card key={paper.paperId} sx={{ display: 'flex', justifyContent: 'center', marginBottom: '15px', border: `1px solid ${color.mainGrey}`, padding: '15px 0', borderRadius: '15px', backgroundColor: color.mainGrey}}>
            <Container>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignContent: 'center' }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6">{paper.title}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
                <HeartClick currentItem={paper} onUpdateLikes={handleUpdateLikes} paperlike={paper.isLike}/>
                <Typography variant="body2" sx={{ margin: '10px 0' }}>
                  {paper.likes}
                </Typography>
              </Box>
            </Box>
              <Typography variant="body2"> {paper.authors.slice(0,3).join(", ")} / Arxiv 제출: {paper.year} / 컨퍼런스 제출: {paper.conference} / cites: {paper.cites} </Typography>
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
      </Box>
    </Grid>
  </Grid>
</div>)))}
    </div>
    )
};

