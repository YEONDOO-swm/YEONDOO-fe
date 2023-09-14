import * as React from "react";
import { Card, CardContent, FormControl, InputLabel, MenuItem, Select, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Grid, Box, Container, InputAdornment, TextField, IconButton, Typography, Button } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useState, useEffect, useRef, KeyboardEvent, MouseEvent } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { NumberFieldProps, Title, useAuthenticated, useNotify } from 'react-admin';
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
import * as Sentry from '@sentry/react';
import { getCookie } from "../cookie";
import { useSelector } from "react-redux";
import { CounterState } from "../reducer";
import { useQuery } from "react-query";

type searchResultType = {
  query?: string;
  papers: paperType[];
  id?: string;
  answer?: string;
}

export type paperType = {
  paperId: string;
  title: string;
  summary: string;
  likes: number;
  isLike: boolean;
  authors: string[];
  year: number;
  conference: string;
  cites: number;
  url: string;
}

export const Home = () => {
    // 유효성 검사
    useAuthenticated();

    // hook 설정
    const navigate = useNavigate();
    const notify = useNotify();

    // api 설정
    const api = useSelector((state: CounterState) => state.api)
    
    const [searchTerm, setSearchTerm] = useState<string>(""); // 사용자가 치고있는 질문
    const [searchType, setSearchType] = useState<string>("1"); // 논문 검색인지 or 개념 질문인지
    const [searchResults, setSearchResults] = useState<searchResultType | null>(null); // 챗봇 답변

    const [loading, setLoading] = useState<boolean>(false);
    const [expandedPaperArray, setExpandedPaperArray] = useState<string[]>([]) // abstract 열려있는 논문 모음

    const searchInputRef: React.MutableRefObject<HTMLInputElement | null> = useRef<HTMLInputElement | null>(null); // 채팅 입력창에 포거스 주기 위해

    const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => { // 검색어 입력 후 엔터
      if (!loading && event.key === 'Enter' && event.nativeEvent.isComposing === false){ 
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
            amplitude.track("Home에서 검색")
          }
          
          navigate(`/home?query=${searchTerm}&type=${searchType}`)
          performSearch()
          //window.location.href = `/home?query=${searchTerm}&type=${searchType}`
      }
  }
  
  const handleButtonClick = (event: MouseEvent<HTMLButtonElement>) => { // 검색어 입력 후 버튼 클릭
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
      if (process.env.NODE_ENV === 'production') {
            
        amplitude.track("Home에서 검색")
      }
      
      navigate(`/home?query=${searchTerm}&type=${searchType}`)
      performSearch()
      //window.location.href = `/home?query=${searchTerm}&type=${searchType}`
  }

  const workspaceId = Number(sessionStorage.getItem("workspaceId"));

  

  const performSearch = async () => { // 검색 과정
      try {
          setLoading(true)
          const query: URLSearchParams = new URLSearchParams(window.location.search); 
          const performSearchTerm: string = query.get('query') || '';
          const performSearchType: string = query.get('type') || '';
          // if (performSearchType === '2') {
          //   setSearchResults('type2')
          //   return
          // }

          /*useQuery는 get일 때 쓸 수 있다. 하지만 최상단에 훅이 위치해 있어야 한다. 이경우 performSearchTerm이 이 함수안에서만
          접근할 수 있다. 그리고 어차피 searchResults가 다른 곳에서도 업데이트가 되어야 해서 react query를 쓰는 이유가 없다.
          더하여 다른 컴포넌트에서 사용되는 값도 아니다. (다른 컴포넌트에서 사용하려면 staleTime 사용)*/
          // const { isLoading, error } = useQuery(['homesearch', performSearchTerm, workspaceId], () => 
          //   fetch(`${api}/api/homesearch?query=${performSearchTerm}&workspaceId=${workspaceId}&searchType=${performSearchType}`, {
          //     headers: {
          //       "X_AUTH_TOKEN": getCookie('jwt')
          //   }}
          //   )
          // ,{
          //   onSuccess: (data) => {
          //     const response = data
          //     response.json().then((data)=> {
          //       setSearchResults(data)
          //     })
          //   },
          //   onError: (error) => {
          //     console.log(error)
          //   }
          // })
          // if (status === 'success') {
          //   const response = data
          //   response.json().then((data)=> {
          //     setSearchResults(data)
          //   })
          // }
          
          const response: Response = await fetch(`${api}/api/homesearch?query=${performSearchTerm}&workspaceId=${workspaceId}&searchType=${performSearchType}`, {
            headers: {
              "X_AUTH_TOKEN": getCookie('jwt')
          }
          });
          const data = await response.json();

          setSearchResults(data);
      } catch (error) {
          console.error('검색 결과에서 오류가 발생했습니다.')
          console.error(error)
          Sentry.captureException(error)
      } finally {
        setLoading(false)
      }
  };


  const handleUpdateLikes = (paperId: string, newLikes: number) => { // 하트 클릭시
    // Create a new array of papers with updated likes count
    const updatedPapers: paperType[] = searchResults!.papers.map((paper: paperType) =>
      paper.paperId === paperId ? { ...paper, likes: newLikes } : paper
    );

    // Update the searchResults state with the new array of papers
    setSearchResults((prevSearchResults: searchResultType | null) => ({
      ...prevSearchResults,
      papers: updatedPapers,
    }));
  };


  const handleChangeSearchType = (event: React.MouseEvent<HTMLElement>,
    newType: string) => { // 검색 타입 버튼 클릭시
    //setSearchType(event.target.value)
    setSearchType(newType)
    setSearchTerm('')
    setSearchResults(null)
  }

  const handleViewMoreAbstract = (paperId: string) => {
    setExpandedPaperArray((prevPaper: string[])=> [...prevPaper, paperId])
  }

  const handleViewLessAbstract = (paperId: string) => {
    setExpandedPaperArray(expandedPaperArray.filter((paper: string) => paper !== paperId))
  }

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
            
      amplitude.track("Home Page Viewed");
    }
    searchInputRef.current?.focus();

    const query: URLSearchParams = new URLSearchParams(window.location.search);
    const searchTermParam: string = query.get('query') || '';
    const searchTypeParam: string = query.get('type') || '';

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
        (searchResults && ((searchResults.answer !== "아니아니아니") ? (searchType==='1'?(
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
              <Typography variant="body2"> {paper.authors.slice(0,3).join(", ")} / {paper.year} </Typography>
              <Typography variant="body2" sx={{fontWeight: 'bold', display: 'inline'}}>Abstract: </Typography>
              {paper.summary && paper.summary.length > 400 ? (
                !expandedPaperArray.includes(paper.paperId) ? (
                  <Typography variant="body2" sx={{ display: 'inline' }}>
                    {paper.summary.slice(0, 400)}... <span onClick={() => handleViewMoreAbstract(paper.paperId)} style={{color: color.appbarGreen, borderBottom: `1px solid ${color.appbarGreen}`, cursor: 'pointer'}}>▼ More</span>
                  </Typography>
                ) : (
                      <Typography variant="body2" sx={{display: 'inline'}}>{paper.summary}<span onClick={() => handleViewLessAbstract(paper.paperId)} style={{color: color.appbarGreen, borderBottom: `1px solid ${color.appbarGreen}`, cursor: 'pointer' }}>▲ Less</span>
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
          <Card sx={{ margin: 20, p:5, textAlign: 'center', backgroundColor: color.mainGreen}}>
            <Typography variant="h6" sx={{justifyContent: 'center' , mb: 2}}>
              🚧 기능 개발 중입니다...
            </Typography>
            논문 제목 검색을 사용해주세요.
          </Card>
  {/* <Grid container spacing={2}>
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
              <Typography variant="body2"> {paper.authors.slice(0,3).join(", ")} / {paper.year}  </Typography>
              <Box sx = {{margin: "15px 0 0 0" , display: 'flex'}}>
                
                <GoToArxiv url={paper.url} paperId={paper.paperId}/>

                <Box sx={{width: '15px'}}></Box>
                
                <GoToViewMore paperid={paper.paperId} />
              </Box>
              
            </Container>
          </Card>
        ))}
      </Box>
    </Grid>
  </Grid> */}
</div>))
: (
  <Box sx={{m:3}}>
    <Typography> 검색 결과가 없습니다.</Typography>
  </Box>
)))}
    </div>
    )
};

