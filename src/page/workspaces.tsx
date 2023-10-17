import React, { ChangeEvent, useEffect, useState } from 'react'
import WorkspacePageLayout from '../layout/workspacePageLayout'
import MetaTag from '../SEOMetaTag'
import { Title, UserMenu, useNotify } from 'react-admin'
import { Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, MenuItem, Modal, Select, SelectChangeEvent, TextField, Typography } from '@mui/material'
import plus from '../asset/plus.svg'
import edit from '../asset/edit.svg'
import plusHover from '../asset/plusHover.svg'
import deleteIcon from '../asset/delete.svg'
import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { CounterState } from '../reducer'
import { getCookie, setCookie } from '../cookie'
import { useNavigate } from 'react-router-dom'
import * as Sentry from '@sentry/react';
import CustomButton from '../component/customButton'
import { studyFieldList } from '../sutdyFieldList'
import { type } from 'os'
import { error } from 'console'
import styles from '../layout/loading.module.css'
import pageStyles from '../layout/workspace.module.css'
import { deleteApi, getApi, postApi, putApi, refreshApi } from '../utils/apiUtils'
import { color } from '../layout/color'

type workspaceEdit = {
    title?: string;
    description?: string;
    studyField?: string;
    keywords?: string[];
    editDate?: string;
    workspaceId?: number;
}

const initWorkspaceEdit = {
    title: '',
    description: '',
    studyField: '',
    keywords: ['', '', ''],
    editDate: '',
    workspaceId: 0
}

const Workspaces = () => {

    const api = useSelector((state: CounterState) => state.api)

    const navigate = useNavigate()
    const notify = useNotify()

    const [open, setOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteWId, setDeleteWId] = useState<number>(0)
    const [deleteWTitle, setDeleteWTitle] = useState<string>('')
    const [isEdit, setIsEdit] = useState<boolean>(false)
    // const [title, settitle] = useState<string>('')
    // const [description, setdescription] = useState<string>('')
    // const [studyField, setstudyField] = useState<string>("")
    // const [keywords, setkeywords] = useState<string>("")
    // const [addIds, setAddIds] = useState<number>()
    // const [addDate, setAddDate] = useState<string>('')
    const [workspace, setWorkspace] = useState<workspaceEdit>(initWorkspaceEdit)
    const [workspacesArr, setWorkspacesArr] = useState<workspaceEdit[]>([])
    const [curEditItem, setCurEditItem] = useState<workspaceEdit>(initWorkspaceEdit)

    const handleClose = () => {
        setOpen(false)
        setWorkspace(initWorkspaceEdit)
    };

    const {data: workspaces, isLoading} = useQuery(['workspace'],async ()=> await getApi(api, '/api/workspace/workspaces').then(response => {
        if (response.status === 200) {
            return response.json()
        } else if (response.status === 401) {
            refreshApi(api, notify, navigate)
        }
        throw new Error("워크스페이스 정보를 가져오는데 실패하였습니다")
    })
    .then(data => {
        const workspacesWithBigIntIds = data.workspaces.map((workspace: any) => ({
        ...workspace,
        workspaceId: workspace.workspaceId //BigInt로 하면 다시 백으로 전송할때 문제가 생김 (Do not know how to serialize a BigInt)
        }));
    
        setWorkspacesArr(workspacesWithBigIntIds);
        console.log(workspacesWithBigIntIds)
        return data.workspaces
    }),
    {
        onError: (error) => {
            console.error('워크스페이스 정보를 불러오는데 실패하였습니다: ', error)
            Sentry.captureException(error)
        }
    })

    const handleAddWorkspace = () => {
        setOpen(true)
        setIsEdit(false)
    }

    const handleSubmitWorkspace = () => {
        if (!workspace.title) {
            notify('Please enter workspace title', {type: 'error'})
            return
        }
        setOpen(false)
        const payload = {
            title: workspace && workspace.title,
            description: workspace && workspace.description,
            studyField: workspace && workspace.studyField,
            keywords: workspace && workspace.keywords
        }
        postApi(api, '/api/workspace/workspaceCRUD', payload)
        .then(response => {
            if (response.status === 200) {
                return response.json()
            } else if (response.status === 401) {
                refreshApi(api, notify, navigate)
            }
            throw new Error("워크스페이스를 생성하는 데 실패하였습니다")
        })
        .then(data => {
            setWorkspace({...workspace, workspaceId: data.workspaceId, editDate: data.editDate})  
        }).catch(error => {
            notify('Failed to create a workspace', {type: 'error'})
        })
    }

    useEffect(()=> {
        if (workspace.workspaceId && workspace.editDate) {
            setWorkspacesArr((prevArr) => [ workspace!, ...prevArr])
            setWorkspace(initWorkspaceEdit)
        }
    }, [workspace])

    const handleDeleteClick = (workspaceId: number, workspaceTitle: string) => {
        setDeleteOpen(true)
        setDeleteWId(workspaceId)
        setDeleteWTitle(workspaceTitle)
    }

    const handleDelete = (workspaceId: number) => {
        setDeleteOpen(false)
        
        deleteApi(api, `/api/workspace/workspaceCRUD?workspaceId=${workspaceId}`)
        .then((response) => {
            if (response.status === 200) {
                setWorkspacesArr((prevArr) => prevArr.filter((workspace) => workspace.workspaceId !== workspaceId));
            } else if (response.status === 401) {
                refreshApi(api, notify, navigate)
            } else {
                throw new Error("워크스페이스 삭제하는 데 실패하였습니다")
            }
        }).catch(error => {
            notify('Failed to delete a workspace', {type: 'error'})
        })
    }

    const handleEdit = (workspaceId: number) => {
        setOpen(true)
        setIsEdit(true)
        // 특정 workspaceId에 해당하는 아이템을 찾습니다.
        const editedWorkspace = workspacesArr.find((workspace) => workspace.workspaceId === workspaceId);

        // 만약 해당 아이템을 찾았다면 수정 로직을 수행합니다.
        if (editedWorkspace) {
            setCurEditItem(editedWorkspace)
        }
    }

    const handleEditWorkspace = (workspaceId: number) => {
        if (!curEditItem.title) {
            notify('Please enter workspace title', {type: 'error'})
            return
        }
        setOpen(false)

        putApi(api, `/api/workspace/workspaceCRUD?workspaceId=${workspaceId}`, curEditItem)
        .then((response) => {
            if (response.status === 200) {
                setWorkspacesArr((prevArr) => prevArr.map((workspace) => (workspace.workspaceId === workspaceId ? curEditItem : workspace)));
            } else if (response.status === 401) {
                refreshApi(api, notify, navigate)
            } else {
                throw new Error("워크스페이스 삭제하는 데 실패하였습니다")
            }
        }).catch(error => {
            notify('Failed to edit a workspace', {type: 'error'})
        })
    }

    const goToWorkspace = (workspaceId: number, workspaceTitle: string) => {
        sessionStorage.setItem('workspaceTitle', workspaceTitle)
        navigate(`/home?workspaceId=${workspaceId}`)
    }

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '70%',
        bgcolor: 'white',
        // border: '2px solid #000',
        boxShadow: 24,
        borderRadius: '20px',
        py: 4,
        px: 8
      };

    const card = (title: string, desc: string, date: string, wId: number, idx: number) => (
        <Box key={idx} sx={{cursor: 'pointer'}}>
            <Box sx={{width: '320px', height: '210px', bgcolor: 'white', borderRadius: '20px', border: '1px solid #ddd',
            boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.05)'
            ,position: 'relative'
            ,p: 3, mr: 3, mb: 3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            '&:hover': {
                bgcolor: '#f5f5f5',
                '& .editButton': {
                    bgcolor: '#fff', // Edit 버튼에 대한 호버 효과 설정
                  },
                  '& .deleteButton': {
                    bgcolor: '#fff', // Edit 버튼에 대한 호버 효과 설정
                  },
            }}}
            onClick={()=>goToWorkspace(wId, title)}>
                <Box >
                    <Typography sx={{color: '#333', fontSize: '18px', fontWeight: '600', mb: 2}}>{title}</Typography>
                    <Typography sx={{color: '#666', fontSize: '15px', fontWeight: '400', mb: 2}}>{desc}</Typography>
                </Box>
                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
                    <Box sx={{display: 'flex'}}>
                        <Box sx={{display: 'flex', p: '2px 5px', justifyContent: 'center', alignItems: 'center', gap: '4px', borderRadius: '4px', border: '0.5px solid #999', mr: 1,
                        '&:hover': {
                            bgcolor: '#f5f5f5',
                        }}}
                        onClick={(e)=>{
                            e.stopPropagation()
                            handleEdit(wId)
                            }}
                        className="editButton">
                            <img src={edit}/>
                            <Typography sx={{fontSize: '13px', fontWeight: 500, letterSpacing: '-0.13px', color: '#999'
                            ,cursor: 'pointer'}}
                                >
                                Edit
                            </Typography>
                        </Box>
                        <Box sx={{display: 'flex', p: '2px 5px', justifyContent: 'center', alignItems: 'center', gap: '4px', borderRadius: '4px', border: '0.5px solid #999',
                        '&:hover': {
                            bgcolor: '#f2f1ed',
                        }}}
                        onClick={(e)=>{
                            e.stopPropagation()
                            handleDeleteClick(wId, title)}}
                        className="deleteButton">
                            <img src={deleteIcon}/>
                            <Typography sx={{fontSize: '13px', fontWeight: 500, letterSpacing: '-0.13px', color: '#999'
                            ,cursor: 'pointer'}}
                            >
                                Delete
                            </Typography>
                        </Box>
                    </Box>
                    <Typography sx={{color: '#999', fontSize: '13px', fontWeight: 400}}>
                        {date}
                    </Typography>
                </Box>
            </Box>
        </Box>
    )

    const loadingCard = () => (
        <Box sx={{width: '320px', height: '210px', bgcolor: '#f9f9f9', borderRadius: '20px'
            ,p: 3, mr: 3, mb: 3}} className={styles.loading}>

        </Box>
    )

    const workspaceTextField = (title: string, value: string, change: any) => (
        <Box sx={{mb: 2}}>
            <Typography id="modal-modal-description" sx={{ mt: 2, color: '#666' }}>
                {title}
            </Typography>
            <TextField variant='outlined' 
                value={value}
                sx={{width: '100%'}}
                onChange={change}
                />
        </Box>
    )

    const workspaceKeywordsTextField = (title: string, value: any, isEdit: boolean) => {
        let newKeywords = isEdit ? [...curEditItem!.keywords!] : [...workspace!.keywords!]
        return <Box sx={{mb: 2}}>
            <Typography id="modal-modal-description" sx={{ mt: 2, color: '#666' }}>
                {title}
            </Typography>
            <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                <TextField variant='outlined' 
                    value={value[0]}
                    placeholder='keyword1'
                    sx={{width: '31%'}}
                    onChange={(event: ChangeEvent<HTMLInputElement>)=>{
                        newKeywords[0] = event.target.value
                        isEdit ? setCurEditItem({...curEditItem, keywords: newKeywords})
                        : setWorkspace({...workspace, keywords: newKeywords})}}
                    />
                <TextField variant='outlined' 
                    value={value[1]}
                    placeholder='keyword2'
                    sx={{width: '31%'}}
                    onChange={(event: ChangeEvent<HTMLInputElement>)=>{
                        newKeywords[1] = event.target.value
                        isEdit ? setCurEditItem({...curEditItem, keywords: newKeywords})
                        : setWorkspace({...workspace, keywords: newKeywords})}}
                    />
                <TextField variant='outlined' 
                    value={value[2]}
                    placeholder='keyword3'
                    sx={{width: '31%'}}
                    onChange={(event: ChangeEvent<HTMLInputElement>)=>{
                        newKeywords[2] = event.target.value
                        isEdit ? setCurEditItem({...curEditItem, keywords: newKeywords})
                        : setWorkspace({...workspace, keywords: newKeywords})}}
                    />
            </Box>
        </Box>
    }
  return (
    <WorkspacePageLayout workspace={false} number={0}>
        <MetaTag title="연두 홈" description="궁금한 개념 질문 또는 논문 제목 검색을 하면 답변과 관련 논문을 제공합니다." keywords="논문, 검색, 질문, 개념, gpt"/>
        <Title title="Home" />
        <Box sx={{display: 'flex', justifyContent: 'flex-end', p:2, color: 'grey.700'}}>
          <UserMenu/>
        </Box>
        <Box>
            <Box sx={{mx: '7vw', my: '5vh', display: 'flex', flexWrap: 'wrap'}}>
                <Box sx={{width: '320px', height: '210px', bgcolor: '#F5F5F5', borderRadius: '20px'
                , display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                mr: 3, mb: 3}}>
                    <Box className={pageStyles.imageContainer}>
                        <img src={plus} onClick={handleAddWorkspace} className={pageStyles.plusIcon}/>
                        <img src={plusHover} onClick={handleAddWorkspace} className={pageStyles.plusIconHover}/>
                    </Box>
                    <Typography sx={{color: '#333', fontSize: '16px', fontWeight: '500'}}> Add a workspace</Typography>
                </Box>
                {!isLoading && (workspacesArr) && workspacesArr.map((workspace, idx)=>(
                    card(workspace.title!, workspace.description!, workspace.editDate!, workspace.workspaceId!, idx)
                ))}
                {isLoading && Array.from({ length: 5 }).map((_, index) => loadingCard())}
            </Box>
        </Box>
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2" sx={{color: color.mainGreen, fontWeight: 600, fontSize: '23px'}}>
                    {isEdit ? "Edit a workspace" :"Add a workspace"}
                </Typography>
                {!isEdit && workspaceTextField('Workspace Title*', workspace!.title!, (event: ChangeEvent<HTMLInputElement>)=>{setWorkspace({...workspace, title: event?.target.value})})}
                {!isEdit && workspaceTextField('Workspace Description', workspace!.description!, (event: ChangeEvent<HTMLInputElement>)=>{setWorkspace({...workspace, description: event?.target.value})})}
                {isEdit && workspaceTextField('Workspace Title', curEditItem!.title!, (event: ChangeEvent<HTMLInputElement>)=>{setCurEditItem({...curEditItem, title: event?.target.value})})}
                {isEdit && workspaceTextField('Workspace Description', curEditItem!.description!, (event: ChangeEvent<HTMLInputElement>)=>{setCurEditItem({...curEditItem, description: event?.target.value})})}
                <Box sx={{mb: 2}}>
                    <Typography id="modal-modal-description" sx={{ mt: 2, color: '#666', mb: 1 }}>
                        Workspace Research Field
                    </Typography>
                    <Select
                        value={isEdit?curEditItem!.studyField :workspace!.studyField}
                        onChange={isEdit?(event: SelectChangeEvent<string>) => {setCurEditItem({...curEditItem, studyField: event.target.value})}
                            :(event: SelectChangeEvent<string>) => {setWorkspace({...workspace, studyField: event.target.value})}}
                        size='small'
                        sx={{
                            width: '100%'
                        }}
                    >
                        <MenuItem value="NO">없음</MenuItem>
                        {studyFieldList.map((studyField, idx) => (
                            <MenuItem key={idx} value={studyField}>{studyField}</MenuItem>

                        ))}
                        {/* <MenuItem value="직접 입력">직접 입력</MenuItem> */}
                    </Select>
                </Box>
                {!isEdit && workspaceKeywordsTextField('Workspace Keywords or Interests', workspace!.keywords, isEdit)}
                {isEdit && curEditItem && workspaceKeywordsTextField('Workspace Keywords or Interests', curEditItem!.keywords!, isEdit)}
                <Box sx={{display: 'flex', justifyContent: 'flex-end', mt: 5}}>
                    {!isEdit && <CustomButton title="Create new workspace" width= '200px' click={handleSubmitWorkspace} />}
                    {isEdit && <CustomButton title="Edit" width= '100px' click={()=>handleEditWorkspace(curEditItem!.workspaceId!)} />}
                </Box>

            </Box>
        </Modal>
        <Dialog
        open={deleteOpen}
        onClose={()=>setDeleteOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {"Yeondoo"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete this workspace?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={()=>setDeleteOpen(false)}>No</Button>
                <Button onClick={()=>deleteWId!==null && handleDelete(deleteWId)} autoFocus>
                Yes
                </Button>
            </DialogActions>
        </Dialog> 
    </WorkspacePageLayout>
  )
}

export default Workspaces