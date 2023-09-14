import * as React from "react";
import { Card, CardContent, Typography, Box, Checkbox, Button, getPaperUtilityClass } from '@mui/material';
import { Title, useAuthenticated, useNotify } from 'react-admin';
import { useEffect, useState, FormEvent } from "react";
import * as amplitude from '@amplitude/analytics-browser';
import { UserProfileCheck } from "../component/userProfileCheck";
import { SearchTap } from "../component/searchTap";
import { Link, useNavigate } from 'react-router-dom';
import styles from '../layout/hoverButton.module.css'
import { HistoryNav } from "../component/historyNav";
import loadingStyle from "../layout/loading.module.css"
import scrollStyle from "../layout/scroll.module.css"
import { color } from "../layout/color";
import MetaTag from "../SEOMetaTag";
import * as Sentry from '@sentry/react';
import { getCookie } from "../cookie";
import { useSelector } from "react-redux";
import { CounterState } from "../reducer";
import { useMutation, useQuery } from "react-query";

type papersInTrashType = {
    paperId: string;
    title: string;
}

export const Trash = () => {
    useAuthenticated();

    const api: string = useSelector((state: CounterState) => state.api)

    const workspaceId: number = Number(sessionStorage.getItem('workspaceId'))

    const notify = useNotify()
    
    const [checkedItems, setCheckedItems] = useState<string[]>([])
    const [submittedItems, setSubmittedItems] = useState<string[]>([])

    const { data: papersInTrash, isLoading } = useQuery(["trash", workspaceId], 
        ()=>fetch(`${api}/api/history/trash?workspaceId=${workspaceId}`, {
            headers: {
                "X_AUTH_TOKEN": getCookie('jwt')
            }
        }).then(response => response.json()).then(data => data.trashContainers),
        {
            onError: (error) => {
                console.log("관심 해제된 논문 정보를 가져오는데 실패하였습니다: ", error)
                Sentry.captureException(error)
            }
        })

    useEffect(()=>{
        if (process.env.NODE_ENV === 'production') {     
            amplitude.track('관심 해제된 논문 Page Viewed')
        }
       },[])


    const { mutate } = useMutation(
        (value: string[]) => fetch(`${api}/api/history/trash?workspaceId=${workspaceId}`, {
            method: 'POST',
            headers: { 'Content-Type' : 'application/json' ,
        'X_AUTH_TOKEN' : getCookie('jwt')},
            body: JSON.stringify(value)
        }),
        {
            onError: (error) => {
                console.log("복구하는데 오류가 발생하였습니다: ", error)
                Sentry.captureException(error)
            }
        }
    )

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // console.log(checkedItems)
        if (checkedItems.length === 0){
            notify("복구할 논문을 선택해주세요", {type: 'error'})
        }
        else {
            mutate(checkedItems)
            setSubmittedItems((prevSubmittedItems: string[]) => [...prevSubmittedItems, ...checkedItems])
            setCheckedItems([])
            //setIsSubmitted(!isSubmitted)

            if (process.env.NODE_ENV === 'production') {
                amplitude.track('복구 Button Clicked')
            }
        }
    }

    const handleCheckBoxChange = (paperId: string) => {
        if (checkedItems.includes(paperId)){
            setCheckedItems(checkedItems.filter((paper: string) => paper !== paperId))
            
        } else {
            setCheckedItems((prevCheckedItems: string[]) => [...prevCheckedItems, paperId])
        }
    }

    const handleCheckAllItems = () => { 
        var allItemList: string[] = []
        var isCheckedAll: boolean = true
        for (var i=0; i<papersInTrash.length; i++){
            allItemList.push(papersInTrash[i].paperId)        
            if (!checkedItems.includes(papersInTrash[i].paperId)){
                isCheckedAll = false
            }
        }
        if (isCheckedAll) {
            setCheckedItems([])
        } else{
            setCheckedItems(allItemList)
        }
    }

    return (
        <div>
            <MetaTag title="관심 해제된 논문" description="사용자가 관심 해제한 논문의 리스트를 볼 수 있고, 복구할 수 있습니다." keywords="히스토리, 관심 해제, 복구, 논문"/>
            <Title title="히스토리"/>
            <Box sx={{height: 50}}></Box>
            {isLoading ? (
                <Box sx={{ height: '80vh'}} className={loadingStyle.loading}>
                    <Box sx={{}}>
                        <HistoryNav page="trash" />
                    </Box>
                    <Box sx={{ m: 2}}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1}}>
                            <Button variant="outlined" sx={{mr: 1}} onClick={handleCheckAllItems} disabled> 전체선택 </Button>
                            <Button type="submit" variant="contained" disabled> 복구 </Button>
                        </Box>
                    
                        <Card sx={{ mb: '10px', height: '5vh', backgroundColor: color.loadingColor, opacity: '0.2', marginBottom: '10px'}}>

                        </Card>
                        <Card sx={{ mb: '10px', height: '5vh', backgroundColor: color.loadingColor, opacity: '0.2'}}>

                        </Card>
                    </Box>
                    
                </Box>
            ) : (
                (papersInTrash && papersInTrash.length>0) ? (
                <Box sx={{  height: '80vh'}}>
                    <Box sx={{}}>
                        <HistoryNav page="trash" />
                    </Box>
                    <Box sx={{ m: 2}}>
                        <form onSubmit={handleSubmit} >
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1}}>
                                <Button variant="outlined" sx={{mr: 1}} onClick={handleCheckAllItems}> 전체선택 </Button>
                                <Button type="submit" variant="contained"> 복구 </Button>
                            </Box>
                            <Box sx={{height: '70vh', overflowY: 'scroll'}} className={scrollStyle.scrollBar}>
                                {papersInTrash && ( papersInTrash.map((paper: papersInTrashType)=>(
                                    !submittedItems.includes(paper.paperId) &&
                                    <Card key={paper.paperId} sx={{ mb: '10px', display: 'flex', alignItems: 'center', width: '100%'}}>
                                        <Checkbox color="success"
                                        checked={checkedItems.includes(paper.paperId)}
                                        sx={{ '& .MuiSvgIcon-root': { fontSize: 25 } }} 
                                        onChange={()=>{handleCheckBoxChange(paper.paperId)}}/> 
                                        <Box sx={{ p:1 }}>
                                            {paper.title}
                                        </Box>
                                    </Card>
                                ))
                    
                                )}
                            </Box>
                        </form>
                    </Box>
                    
                </Box>)
                : ( 
                <Box sx={{  height: '80vh'}}>
                    <Box sx={{}}>
                        <HistoryNav page="trash" />
                    </Box>
                    <Typography sx={{m:3}}>
                    관심 해제한 논문이 없습니다.
                    </Typography>
                </Box>
                )
            )}
        
        </div>
    )
}