import * as React from "react";
import { Card, CardContent, Typography, Box, Checkbox, Button, getPaperUtilityClass } from '@mui/material';
import { Title, useAuthenticated, useNotify } from 'react-admin';
import { useEffect, useState, MouseEvent } from "react";
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
import { getCookie, setCookie } from "../cookie";
import { useSelector } from "react-redux";
import { CounterState } from "../reducer";
import { useMutation, useQuery } from "react-query";
import PageLayout from "../layout/pageLayout";
import { getApi, postApi, refreshApi } from "../utils/apiUtils";
import restore from "../asset/restore.svg"
import restoreGrey from "../asset/restoreGrey.svg"
import works from "../asset/works.svg"
import worksGrey from "../asset/worksGrey.svg"
import { styled } from '@mui/material/styles';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';


type papersInTrashType = {
    paperId: string;
    title: string;
}

const restoreButton = (props:any) => {
    const [isHovered, setIsHovered] = useState<boolean>(false)
    return (
        <Box sx={{display: 'inline-flex', px: '20px', justifyContent: 'center', alignItems: 'center', gap: '10px',
        borderRadius: '8px', height: '35px', border: '2px solid #777',
        '&:hover': {
            bgcolor: '#777',
            cursor: 'pointer'
        }}}
        onMouseEnter={()=>{setIsHovered(true)}}
        onMouseLeave={()=>{setIsHovered(false)}}
        onClick={props.handleSubmit}>
            {isHovered?<img src={restore}/>:<img src={restoreGrey}/>}
            <Typography sx={{color: isHovered?color.white :'#777', fontSize: '15px', fontWeight: '700'}}>
                Restore
            </Typography>
        </Box>
    )
}

const backToMyWorksButton = () => {
    const [isHovered, setIsHovered] = useState<boolean>(false)

    const workspaceId: number = Number(sessionStorage.getItem('workspaceId'))

    const navigate = useNavigate()
    return (
        <Box sx={{display: 'inline-flex', px: '20px', justifyContent: 'center', alignItems: 'center', gap: '10px',
        borderRadius: '8px', border: `2px solid ${color.hoverGreen}`, height: '35px',
        '&:hover': {
            bgcolor: color.hoverGreen,
            cursor: 'pointer'
        }}}
        onMouseEnter={()=>{setIsHovered(true)}}
        onMouseLeave={()=>{setIsHovered(false)}}
        onClick={()=>{navigate(`/paperstorage?workspaceId=${workspaceId}`)}}>
            {isHovered?<img src={works} width="22px"/>:<img src={worksGrey} width="22px"/>}
            <Typography sx={{color: isHovered?color.white:color.hoverGreen, fontSize: '15px', fontWeight: '700'}}>
                Back to My Works
            </Typography>
        </Box>
    )
}

export const Trash = () => {
    useAuthenticated();

    const api: string = useSelector((state: CounterState) => state.api)

    const workspaceId: number = Number(sessionStorage.getItem('workspaceId'))

    const notify = useNotify()
    
    const [checkedItems, setCheckedItems] = useState<string[]>([])
    const [submittedItems, setSubmittedItems] = useState<string[]>([])
    const [isSelectedAll, setIsSelectedAll] = useState<boolean>(false)

    const navigate = useNavigate()

    const { data: papersInTrash, isLoading } = useQuery(["trash", workspaceId], 
        ()=> getApi(api, `/api/history/trash?workspaceId=${workspaceId}`)
        .then(async response => {
            if (response.status === 200) {
                return response.json()
            } else if (response.status === 401) {
                await refreshApi(api, notify, navigate)
            } else {
                throw new Error("관심 해제된 논문 정보를 가져오는데 실패하였습니다")
            }
        }).then(data => data.trashContainers),
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
        (value: string[]) => postApi(api, `/api/history/trash?workspaceId=${workspaceId}`, value)
        .then(async response => {
            if (response.status === 401) {
                await refreshApi(api, notify, navigate)
              }
        }),
        {
            onError: (error) => {
                console.log("복구하는데 오류가 발생하였습니다: ", error)
                Sentry.captureException(error)
            }
        }
    )

    const handleSubmit = (event: any) => {
        event.preventDefault();
        
        setIsSelectedAll(false)
        if (checkedItems.length === 0){
            notify("Please select the paper you want to restore", {type: 'error'})
        }
        else {
            try {
                mutate(checkedItems)
            } catch (error) {
                console.log(error)
            } finally {
                setSubmittedItems((prevSubmittedItems: string[]) => [...prevSubmittedItems, ...checkedItems])
                setCheckedItems([])
            }
            //setIsSubmitted(!isSubmitted)

            if (process.env.NODE_ENV === 'production') {
                amplitude.track('복구 Button Clicked')
            }
        }
    }

    const handleCheckBoxChange = (paperId: string) => {
        setIsSelectedAll(false)
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
            setIsSelectedAll(false)
        } else{
            setCheckedItems(allItemList)
            setIsSelectedAll(true)
        }
    }

    
    const BpIcon = styled('span')(({ theme }) => ({
        borderRadius: 3,
        width: '20px',
        height: '20px',
        boxShadow:
          theme.palette.mode === 'dark'
            ? '0 0 0 1px rgb(16 22 26 / 40%)'
            : 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
        backgroundColor: theme.palette.mode === 'dark' ? '#394b59' : '#f5f8fa',
        backgroundImage:
          theme.palette.mode === 'dark'
            ? 'linear-gradient(180deg,hsla(0,0%,100%,.05),hsla(0,0%,100%,0))'
            : 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
        '.Mui-focusVisible &': {
          outline: '2px solid #d9d9d9',
          outlineOffset: 2,
        },
        'input:hover ~ &': {
          backgroundColor: theme.palette.mode === 'dark' ? '#30404d' : '#ebf1f5',
        },
        'input:disabled ~ &': {
          boxShadow: 'none',
          background:
            theme.palette.mode === 'dark' ? 'rgba(57,75,89,.5)' : 'rgba(206,217,224,.5)',
        },
      }));

      const BpCheckedIcon = styled(BpIcon)({
        backgroundColor: color.mainGreen,
        backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
        '&:before': {
          display: 'block',
          width: '20px',
          height: '20px',
          backgroundImage:
            "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
            " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
            "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
          content: '""',
        },
        'input:hover ~ &': {
          backgroundColor: color.mainGreen,
        },
      });

    return (
        <PageLayout workspace={true} number={1}>
            <MetaTag title="Papers in Trash - Yeondoo" description="사용자가 관심 해제한 논문의 리스트를 볼 수 있고, 복구할 수 있습니다." keywords="히스토리, 관심 해제, 복구, 논문"/>
            <Title title="History"/>
            <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                <Typography sx={{fontSize: '25px', fontWeight: '600'}}>
                    Trash
                </Typography>
                <Box sx={{display: 'flex', gap: 1}}>
                    {restoreButton({handleSubmit})}
                    {backToMyWorksButton()}
                </Box>
            </Box>
            {isLoading ? (
                <Box sx={{mt: 3}}>
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5, px: '10px', mb:1}}>
                        <Checkbox color="success" 
                        checked={isSelectedAll} 
                        checkedIcon={<BpCheckedIcon/>}
                        icon={<BpIcon/>}
                        disabled />
                        <Typography sx={{color: color.loadingColor, fontSize: '18px', fontWeight: 500}}>
                            Select All
                        </Typography>
                    </Box>
                    <Box className={loadingStyle.loading}>
                        <Box>
                            
                            <Box sx={{ mb: '15px', height: '5vh', backgroundColor: color.loadingColor, opacity: '0.2', borderRadius: '10px'}}>

                            </Box>
                            <Box sx={{ mb: '15px', height: '5vh', backgroundColor: color.loadingColor, opacity: '0.2', borderRadius: '10px'}}>

                            </Box>
                        </Box>
                    </Box>
                </Box>
            ) : (
                (papersInTrash && papersInTrash.length>0) ? (
                <Box >
                
                    <Box sx={{mt: 3}}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, px: '10px'}}>
                            <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
                                <Checkbox color="success" 
                                checked={isSelectedAll} 
                                checkedIcon={<BpCheckedIcon/>}
                                icon={<BpIcon/>}
                                onChange={handleCheckAllItems} />
                                <Typography sx={{color: '#333', fontSize: '18px', fontWeight: 500}}>
                                    Select All
                                </Typography>
                            </Box>
                            {/* {restoreButton()}                         */}
                        </Box>
                        <Box sx={{height: '70vh', overflowY: 'scroll'}} className={scrollStyle.scrollBar}>
                            {papersInTrash && ( papersInTrash.map((paper: papersInTrashType)=>(
                                !submittedItems.includes(paper.paperId) &&
                                <Box key={paper.paperId} sx={{ mb: '15px', display: 'flex', alignItems: 'center', width: '100%',
                                borderRadius: '10px', border: '1px solid #ddd', boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.05)',
                                padding: '10px', gap: 0.5}}>
                                    <Checkbox color="success"
                                    checked={checkedItems.includes(paper.paperId)}
                                    checkedIcon={<BpCheckedIcon/>}
                                    icon={<BpIcon/>}
                                    onChange={()=>{handleCheckBoxChange(paper.paperId)}}/> 
                                    <Box sx={{color: '#333', fontSize: '16px', fontWeight: 500 }}>
                                        {paper.title}
                                    </Box>
                                </Box>
                            ))
                
                            )}
                        </Box>
                        {/* </form> */}
                    </Box>
                    
                </Box>)
                : ( 
                    <Box sx={{height: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 2}}>
                        <DeleteForeverIcon sx={{fontSize: '180px'}} />
                        <Typography sx={{color: '#333', fontSize: '22px', fontWeight: 600}}>No Papers In Trash</Typography>
                    </Box>
                )
            )}
        
        </PageLayout>
    )
}