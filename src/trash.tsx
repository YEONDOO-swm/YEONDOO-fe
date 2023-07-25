import * as React from "react";
import { Card, CardContent, Typography, Box, Checkbox, Button } from '@mui/material';
import { Title, useAuthenticated, useNotify } from 'react-admin';
import { useEffect, useState } from "react";
import * as amplitude from '@amplitude/analytics-browser';
import { UserProfileCheck } from "./component/userProfileCheck";
import { SearchTap } from "./component/searchTap";
import { Link, useNavigate } from 'react-router-dom';
import styles from '../layout/hoverButton.module.css'
import { HistoryNav } from "./component/historyNav";
import loadingStyle from "../layout/loading.module.css"

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
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(()=>{
        setLoading(true)
        fetch(`${api}/api/history/trash?username=${username}`)
        .then(response => response.json())
        .then(data => {
            setPapersInNav(data.papers)
            setPapersInTrash(data.trashcontainers)
            setLoading(false)
        })
        .catch(error => {
            console.log("휴지통 정보를 가져오는데 실패하였습니다: ", error)
            setLoading(false)
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
            {loading ? (
                <Box sx={{ display: 'flex', height: '70vh'}} className={loadingStyle.loading}>
                    <Box sx={{ width: '80%', m: 2}}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1}}>
                            <Button variant="outlined" sx={{mr: 1}} onClick={handleCheckAllItems}> 전체선택 </Button>
                            <Button type="submit" variant="contained"> 복구 </Button>
                        </Box>
                    
                        <Card sx={{ mb: '10px', height: '5vh', backgroundColor: '#999999', opacity: '0.2'}}>

                        </Card>
                    </Box>
                    <Card sx={{ ml: 'auto', mr: '20px', p: '30px 40px', display: 'flex', flexDirection: 'column',borderRadius: '10px', backgroundColor: '#999999', opacity: '0.2', height: '100%', width: '35vh', justifyContent:'space-between'}}>

                    </Card>
                </Box>
            ) : (
                <Box sx={{ display: 'flex', height: '70vh'}}>
                    <Box sx={{ width: '80%', m: 2}}>
                        <form onSubmit={handleSubmit} >
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1}}>
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
                
                    <HistoryNav goToHistory={()=>navigate('/history')} papersInNav={papersInNav} trash={true} />
                </Box>
            )}
        
        </div>
    )
}