import * as React from "react";
import { Card, CardContent, Box, Typography } from '@mui/material';
import { Title, useAuthenticated } from 'react-admin';
import * as amplitude from '@amplitude/analytics-browser';
import { useEffect, useState } from "react";
import { SearchTap } from "./component/searchTap";
import { GoToArxiv } from "./component/goToArxiv";
import { GoToViewMore } from "./component/goToViewMore";
import { UserProfileCheck } from "./component/userProfileCheck";
import { HeartClick } from "./component/heartClick";

export const PaperStorage = () => {
    useAuthenticated();
    UserProfileCheck();

    var api = '';
    if (process.env.NODE_ENV === 'development'){
      api = `${import.meta.env.VITE_REACT_APP_LOCAL_SERVER}`
    }
    else if (process.env.NODE_ENV === 'production'){
      api = `${process.env.VITE_REACT_APP_AWS_SERVER}`
    }

    const [searchTerm, setSearchTerm] = useState("");
    const [papersInStorage, setPapersInStorage] = useState<any>("");

    useEffect(() => {
        amplitude.track("PaperStorage Page Viewed");
        fetch(`${api}/api/paper/container`)
            .then(response => response.json())
            .then(data => {  
                console.log(data[0]) 
                setPapersInStorage(data)
            })
            .catch(error => {
                console.error('논문 보관함 정보를 불러오는데 실패하였습니다: ', error)
            })
    }, []);

    const handleSearchKeyDown = (event: any) => {
        if (event.key === 'Enter'){
            event.preventDefault();
            //setEnteredSearch(searchResults);
            window.location.href = `/home?query=${searchTerm}`
        }
    }
    
    const handleButtonClick = (event: any) => {
        event.preventDefault();
        //setEnteredSearch(searchResults);
        window.location.href = `/home?query=${searchTerm}`
        //performSearch();
    }
    
    return (
    <div>
        <Title title="논문보관함" />
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
          <Box sx={{height: '75vh', margin: '0 30px 0 10px', padding: '10px', overflowY: 'scroll'}}>
            {papersInStorage && papersInStorage.map((paper:any) => (
                <Card sx={{padding: '15px', borderRadius: '15px', margin: '15px', display: 'flex'}}>
                    <Box>
                        <Typography variant="h6">
                            {paper.title}
                        </Typography>
                        <Typography variant="body1">
                            {paper.authors?.length >1 ?paper.authors.join(', '):paper.authors} / {paper.year} / {paper.conference}
                        </Typography>
                        <Typography variant="body1">
                            {paper.cites}
                        </Typography>
                    </Box>
                    <Box sx={{ margin:'0px 10px', width: '20vh' ,display: 'flex', flexDirection:'column', justifyContent: 'space-between', alignItems: 'flex-end'}}>
                        <HeartClick currentItem={paper.paperId} home={false} />
                        <GoToArxiv url={paper.url}/>
                        <Box sx={{height:'5px'}}></Box>
                        <GoToViewMore paperid={paper.paperId} />
                    </Box>
                </Card>
            ))}
          </Box>

    </div>
)};
