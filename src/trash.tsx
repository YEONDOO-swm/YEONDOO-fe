import * as React from "react";
import { Card, CardContent, Typography, Box, Checkbox, Button } from '@mui/material';
import { Title, useAuthenticated, useNotify } from 'react-admin';
import { useEffect, useState } from "react";
import * as amplitude from '@amplitude/analytics-browser';
import { UserProfileCheck } from "./component/userProfileCheck";
import { SearchTap } from "./component/searchTap";
import { Link, useNavigate } from 'react-router-dom';
import styles from '../layout/hoverButton.module.css'

export const Trash = () => {
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
    const [papersInNav, setPapersInNav] = useState<any>([])
    const username = sessionStorage.getItem('username')
    const navigate = useNavigate()
    const [papersInTrash, setPapersInTrash] = useState<any>([])
    const [checkedItems, setCheckedItems] = useState<any>([])

    useEffect(()=>{
        fetch(`${api}/api/history/trash?username=${username}`)
        .then(response => response.json())
        .then(data => {
            setPapersInNav(data.papers)
            setPapersInTrash(data.trashcontainers)
        })
       },[checkedItems])

    const handleSearchKeyDown = (event: any) => {
        if (event.key === 'Enter'){
            event.preventDefault();
            window.location.href = `/home?query=${searchTerm}`
        }
    }
    
    const handleButtonClick = (event: any) => {
        event.preventDefault();
        window.location.href = `/home?query=${searchTerm}`
    }

    const notify = useNotify()

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(checkedItems)
        if (checkedItems.length === 0){
            notify("복구할 논문을 선택해주세요", {type: 'error'})
        }
        else {
            fetch(`${api}/api/history/trash`, {
                method: 'POST',
                headers: { 'Content-Type' : 'application/json' },
                body: JSON.stringify(checkedItems)
            })
            .then(response => response)
            .catch(error => {
                console.log("복구하는데 오류가 발생하였습니다: ", error)
            })
            setCheckedItems([])
        }
    }

    const handleCheckBoxChange = (paperId: string) => {
        if (checkedItems.includes(paperId)){
            setCheckedItems(checkedItems.filter((paper: any) => paper !== paperId))
        } else {
            setCheckedItems([...checkedItems, paperId])
        }
    }

    const handleCheckAllItems = () => { 
        var allItemList: string[] = []
        for (var i=0; i<papersInTrash.length; i++){
            if (!checkedItems.includes(papersInTrash[i].paperId)){
                allItemList.push(papersInTrash[i].paperId)
            }
        }
        setCheckedItems(allItemList)
    }

    return (
        <div>
            <Title title="히스토리"/>
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
            <Typography variant="h5" sx={{ml: 1}}> 휴지통 </Typography>
            <Box sx={{ display: 'flex', height: '70vh'}}>
            <Box sx={{ width: '80%', m: 2}}>
                <form onSubmit={handleSubmit} >
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end'}}>
                        <Button variant="outlined" sx={{mr: 1}} onClick={handleCheckAllItems}> 전체선택 </Button>
                        <Button type="submit" variant="contained"> 복구 </Button>
                    </Box>
                    {papersInTrash && ( papersInTrash.map((paper:any)=>(
                        <Card key={paper.paperId} sx={{ mb: '10px'}}>
                            <Checkbox color="success"
                            checked={checkedItems.includes(paper.paperId)}
                            sx={{ '& .MuiSvgIcon-root': { fontSize: 25 } }} 
                            onChange={()=>{handleCheckBoxChange(paper.paperId)}}/> {paper.title}
                        </Card>
                    ))
        
                    )}
                </form>
            </Box>
            
            <Box sx={{ ml: 'auto', mr: '20px', p: '30px 40px', display: 'flex', flexDirection: 'column',borderRadius: '10px', backgroundColor: '#DCDCDC', height: '100%', justifyContent:'space-between'}}>
            <Box sx={{ height: '80vh'}}>
                {/* <Link to="/history" replace style={{ textDecoration: 'none', color: 'black', marginRight: '10px' }}> */}
                    <Typography variant="h6" onClick={()=> {navigate('/history')}} className={`${styles.customTypography}`} sx={{mb:2}}> 검색결과 </Typography>
                {/* </Link> */}
                <Box sx={{ borderRadius: '15px', backgroundColor: '#d8e6cd' , height: '80%'}}>
                    <Box>
                        <Typography variant="h6" sx={{textAlign: 'center'}}> 논문보관함 </Typography>
                    </Box>
                    <Box sx={{overflowY: 'scroll', height: '90%', padding: '10px'}}>                
                        {papersInNav && papersInNav.map((paper: any) => (
                            <Link to={`/paper?paperid=${paper.paperId}`} style={{ textDecoration: 'none', color: 'black' }}>
                                <Typography key={paper.paperId} sx={{textAlign: 'center'}} className={styles.customTypography}>
                                    {paper.title}
                                </Typography>
                            </Link>
                        ))}
                    </Box>
                </Box>
            </Box>
            <Link to="/history/trash" style={{ textDecoration: 'none', color: 'black' }}>
                <Typography variant="h6" sx={{textAlign: 'center'}} className={`${styles.customTypography} ${styles.currentPage}`}> 휴지통 </Typography>
            </Link>
        </Box>
        </Box>
        </div>
    )
}