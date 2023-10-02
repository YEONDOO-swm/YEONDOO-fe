import * as React from "react";
import { Card } from '@mui/material';
import { Box, Typography} from "@mui/material";
import { useState, useEffect, useRef, KeyboardEvent, MouseEvent } from "react";
import { Title, UserMenu, useAuthenticated, useNotify } from 'react-admin';
import { useNavigate, useParams } from 'react-router-dom';
import * as amplitude from '@amplitude/analytics-browser';
import { SearchTap } from "../component/searchTap";
import { GoToArxiv } from "../component/goToArxiv";
import { GoToViewMore } from "../component/goToViewMore";
import { HeartClick } from "../component/heartClick";
import loadingStyle from "../layout/loading.module.css";
import scrollStyle from "../layout/scroll.module.css";
import { color } from "../layout/color";
import MetaTag from "../SEOMetaTag";
import * as Sentry from '@sentry/react';
import { useSelector } from "react-redux";
import { CounterState } from "../reducer";
import { useQuery } from "react-query";
import PageLayout from "../layout/pageLayout";
import arrow from "../asset/rightarrow.svg"
import CustomButton from "../component/customButton";
import styles from "../layout/home.module.css"
import { getApi, refreshApi } from "../utils/apiUtils";

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

    const [currentIndex, setCurrentIndex] = useState(0);

    const { workspaceId } = useParams()
    sessionStorage.setItem('workspaceId', workspaceId!)
    const workspaceTitle = sessionStorage.getItem('workspaceTitle')
    
    const [searchTerm, setSearchTerm] = useState<string>(""); // 사용자가 치고있는 질문
    //const [searchType, setSearchType] = useState<string>("1"); // 논문 검색인지 or 개념 질문인지
    const [searchResults, setSearchResults] = useState<searchResultType | null>(null); // 챗봇 답변

    const [loading, setLoading] = useState<boolean>(false);
    const [expandedPaperArray, setExpandedPaperArray] = useState<string[]>([]) // abstract 열려있는 논문 모음
    const [isSearched, setIsSearched] = useState<boolean>(false)
    const [recommendedPapers, setRecommendedPapers] = useState<any>([])
    
    const searchInputRef: React.MutableRefObject<HTMLInputElement | null> = useRef<HTMLInputElement | null>(null); // 채팅 입력창에 포거스 주기 위해

    const {data: recentData, isLoading} = useQuery(["home", workspaceId], ()=> 
      getApi(api, `/api/workspace/workspaceEnter?workspaceId=${workspaceId}`)  
      .then(response => {
        if (response.status === 200) {
          return response.json()
        } else if (response.status === 401) {
            refreshApi(api, notify, navigate)
        }
        throw new Error("워크스페이스 홈 정보를 가져오는데 실패하였습니다")
      })
      .then(data => {
        setRecommendedPapers(data.recommendedPapers)
        return data
      })
    )

    useEffect(()=> {
      if (recentData) {
        const timer = setInterval(()=> {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % recentData.recommendedPapers.length)
        }, 5000)

        return () => clearInterval(timer)
      }
    }, [recentData])
    
    const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => { // 검색어 입력 후 엔터
      if (!loading && event.key === 'Enter' && event.nativeEvent.isComposing === false){ 
        event.preventDefault();
          if (!searchTerm) {
            notify("Please enter your search term", {type: 'error'})
            return
          }
          // if (!searchType) {
          //   notify("Please select a search type", {type: 'error'})
          //   return
          // }
          if (process.env.NODE_ENV === 'production') { 
            amplitude.track("Home에서 검색")
          }
          
          navigate(`/home/${workspaceId}?query=${searchTerm}`)
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
        notify("Please enter your search term", {type: 'error'})
        return
      }
      if (process.env.NODE_ENV === 'production') {
            
        amplitude.track("Home에서 검색")
      }
      
      navigate(`/home/${workspaceId}?query=${searchTerm}`)
      performSearch()

  }

  //const workspaceId = Number(sessionStorage.getItem("workspaceId"));

  

  const performSearch = async () => { // 검색 과정
      try {
          setLoading(true)
          setIsSearched(true)
          const query: URLSearchParams = new URLSearchParams(window.location.search); 
          const performSearchTerm: string = query.get('query') || '';
          /*useQuery는 get일 때 쓸 수 있다. 하지만 최상단에 훅이 위치해 있어야 한다. 이경우 performSearchTerm이 이 함수안에서만
          접근할 수 있다. 그리고 어차피 searchResults가 다른 곳에서도 업데이트가 되어야 해서 react query를 쓰는 이유가 없다.
          더하여 다른 컴포넌트에서 사용되는 값도 아니다. (다른 컴포넌트에서 사용하려면 staleTime 사용)*/

          const response: Response = await getApi(api, `/api/homesearch?query=${performSearchTerm}&workspaceId=${workspaceId}`)
          if (response.status === 401) {
            refreshApi(api, notify, navigate)
          }
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

  const handleUpdateRecommendLikes = (paperId: string, newLikes: number) => {
    const updatedPapers: paperType[] = recommendedPapers.map((paper: paperType) =>
      paper.paperId === paperId ? { ...paper, likes: newLikes } : paper
    );

    // Update the searchResults state with the new array of papers
    setRecommendedPapers(updatedPapers);
  }



  const handleViewMoreAbstract = (paperId: string) => {
    setExpandedPaperArray((prevPaper: string[])=> [...prevPaper, paperId])
  }

  const handleViewLessAbstract = (paperId: string) => {
    setExpandedPaperArray(expandedPaperArray.filter((paper: string) => paper !== paperId))
  }

  const makePapersCard = (paper: any) => {
    return (
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
            <GoToViewMore paperid={paper.paperId} />
          </Box>
                {/* Add other details for the paper */}
              
      </Card>
    )
  }

  const recentPaper = (recentlyPapers: any) => (
    <Box sx={{height: '55px', width: '82%', borderRadius: '10px', border: '1px solid #ddd', boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.05)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, mb: 1}}>
          <Typography sx={{fontWeight: 500}}>
            {recentlyPapers.title}
          </Typography>
          <Box sx={{display: 'flex'}} onClick={()=>{navigate(`/paper?paperid=${recentlyPapers.paperId}`)}}>
            <Typography sx={{fontWeight: 500, color: '#617F5B', cursor: 'pointer', '&:hover':{
              color: '#445142'
            }}}>More</Typography>
            <img src={arrow}/>
          </Box>
        </Box>
  )

  const loadingRecentPaper = () => (
    <Box sx={{height: '55px', width: '82%', borderRadius: '10px', border: '1px solid #ddd', boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.05)',
      mb: 1, bgcolor: '#f9f9f9'}} className={loadingStyle.loading}></Box>
  )

  const subTitle = (title: string) => (
    <Typography sx={{fontSize: '18px', fontWeight: '600', mb: 2}}>{title}</Typography>
  )

  const tag = (tag: string) => (
    <Box sx={{padding: '2px 10px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '14px',
    display: 'inline-block', mr: 0.6}}>
      #{tag}
    </Box>
  )

  const trend = (title: string, date: string, url: string) => (
    <Box>
      <Box sx={{display: 'flex', justifyContent: 'space-between', py: 1}}>
        <Box>
          <Typography sx={{mb: 1, color: '#333', fontWeight: '600', fontSize: '18px'
        , display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
            {title}
          </Typography>
          <Typography sx={{color: '#666', fontSize: '15px'}}>
            {date}
          </Typography>
        </Box>
        <Box sx={{display: 'flex', alignItems: 'center', cursor: 'pointer'}} onClick={()=>{window.open(url)}}>
          <Typography sx={{fontWeight: 500, color: '#617F5B','&:hover':{
              color: '#445142'
            }}}>More</Typography>
          <img src={arrow}/>
        </Box>
      </Box>
      
    </Box>
  )

  const getWrapperTransformValue = () => {
    const slideWidth = '27.5vw'; // 슬라이드 한 개의 너비
    return `translateX(calc(-${currentIndex} * ${slideWidth}))`;
  };
  
  const wrapperTransform = getWrapperTransformValue();

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
            
      amplitude.track("Home Page Viewed");
    }
    searchInputRef.current?.focus();

    const query: URLSearchParams = new URLSearchParams(window.location.search);
    const searchTermParam: string = query.get('query') || '';
    // const searchTypeParam: string = query.get('type') || '';

    if (searchTermParam) {
      setSearchTerm(searchTermParam);
      // setSearchType(searchTypeParam);
      performSearch();
    }
  }, [location]);

    return (
      <PageLayout workspace={true} number={0}>
    <div>
        <MetaTag title="연두 홈" description="궁금한 개념 질문 또는 논문 제목 검색을 하면 답변과 관련 논문을 제공합니다." keywords="논문, 검색, 질문, 개념, gpt"/>
        <Title title="Home" />
        <Box sx={{display: 'flex', justifyContent: 'flex-end', p:2, color: 'grey.700'}}>
          <UserMenu/>
        </Box>
        <Typography sx={{ml: '12.5vw', fontSize: '25px', fontWeight: '600'}}>
          {/* {workspaceTitle} */}
          Home
        </Typography>
        <Box sx={{display: 'flex', margin: '30px auto', justifyContent: 'center', alignItems: 'center'}}>
            <SearchTap
              searchTerm={searchTerm}
              onChange={setSearchTerm}
              onSearch={handleButtonClick}
              onSearchKeyDown={handleSearchKeyDown}
              placeholder="Attention is all you need"
              firstBoxSx={{ width: '70%' }}
              middleBoxSx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              sx={{width: "100%"}}
              heightSx={{height: '55px'}} />
        </Box>
          
          {loading ? (
            
              <Box className={loadingStyle.loading} sx={{margin: '0 30px 0 10px'}}>
              <Card sx={{ display: 'flex', justifyContent: 'center', marginBottom: '15px', border: `1px solid ${color.loadingColor}`, height: '20vh', borderRadius: '15px', backgroundColor: color.loadingColor, opacity: '0.2'}} >
              </Card>
              <Card sx={{ display: 'flex', justifyContent: 'center', marginBottom: '15px', border: `1px solid ${color.mainGrey}`, height: '20vh', borderRadius: '15px', backgroundColor: color.loadingColor, opacity: '0.2'}} >
              </Card>
              </Box>
            
          ) :
        (searchResults ? ((isSearched) ? (
          <Box sx={{height: '75vh', margin: '0 30px 0 10px', overflowY: 'scroll'}} className={scrollStyle.scrollBar}>
            {searchResults.papers.map((paper: any) => (
              makePapersCard(paper)
            ))}
          </Box>
        )
      : (
      <Box sx={{m:3}}>
        <Typography> 검색 결과가 없습니다.</Typography>
      </Box>
    )):(
      <Box sx={{ml: '12.5vw', mt: 5}}>
        {subTitle('Recently papers')}
        {isLoading ? <>
          {loadingRecentPaper()}
          {loadingRecentPaper()}
        </>
      :<>
      {recentData.recentlyPapers && recentData.recentlyPapers.length > 0 && recentPaper(recentData.recentlyPapers[0])}
      {recentData.recentlyPapers && recentData.recentlyPapers.length > 1 && recentPaper(recentData.recentlyPapers[1])}
      </>
        }
        <Box sx={{display: 'flex', mt: 5}}>
          <Box sx={{width: '30.5vw'}}>
            {subTitle('Recommended papers')}
            <Box sx={{width: '27.5vw', height: '32vh', borderRadius: '20px', border: '1px solid #ddd', boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.05)',
            }} className={styles.transitionContainer}>
              <Box className={styles.transitionWrapper} style={{ transform: wrapperTransform }}>
                {recommendedPapers && recommendedPapers.map((paper: any, idx: number) => (
                  <Box key={idx} className={`${styles.transitionItem} ${
                    idx === currentIndex ? styles.active : ''
                  }`}
                  sx={{
                  p:3}}>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 1.5}}>
                      <Box sx={{fontWeight: '600', fontSize: '18px'
                    , display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
                        {paper.title}
                      </Box>
                      <Box sx={{ marginTop: '-5px', display: 'flex', alignItems: 'center'}}>
                        <HeartClick currentItem={paper} onUpdateLikes={handleUpdateRecommendLikes} paperlike={paper.isLike}/>
                        <Typography sx={{color: '#617F5B', fontWeight: '600'}}>{paper.likes}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{width: '23vw', display: 'flex', flexWrap:'', mb: 1.5, overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none',
                  '&::-webkit-scrollbar': {
                    display: 'none', /* Chrome 브라우저의 스크롤바 숨김 */
                  }}}>
                      {paper.subject.map((sub: string, idx: number) => (
                        <Box key={idx} sx={{whiteSpace: 'nowrap'}}>
                          {tag(sub)}
                        </Box>
                      ))}
                    </Box>
                    <Box sx={{display: 'flex', mb: 1.5}}>
                      <Typography sx={{fontWeight: '500', mr: 1
                    , display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}> 
                        {(paper.authors.length > 3 
                        ? paper.authors.slice(3).join(', ')
                        : paper.authors.join(', '))} 
                      </Typography>
                      <Typography sx={{color: '#666'}}> 
                        {paper.year}
                      </Typography>
                    </Box>
                    <Box sx={{color: '#666', mb: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
                      {paper.summary}
                    </Box>
                    <CustomButton title="Chat with AI" width="100%" click={()=>navigate(`/paper?paperid=${paper.paperId}`)}/>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
          <Box sx={{width: '30vw'}}>
            {subTitle('Recent trends')}
            <Box sx={{width: '27.5vw', height: '32vh', borderRadius: '20px', border: '1px solid #ddd', boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.05)',
            px:3, py: 1}}>
              {recentData && recentData.recentlyTrends.map((item: any, idx: number) => (
                <Box key={idx}>
                  {trend(item.title, item.date, item.url)}
                  {idx!==recentData.recentlyTrends.length-1 && <hr style={{backgroundColor: '#ddd', height: '1px', border: 0}}/>}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

      </Box>
    ))}
    </div>
    </PageLayout>
    )
};

