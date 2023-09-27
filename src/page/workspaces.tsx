import React, { ChangeEvent, useEffect, useState } from 'react'
import PageLayout from '../layout/pageLayout'
import MetaTag from '../SEOMetaTag'
import { Title, UserMenu, useNotify } from 'react-admin'
import { Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, MenuItem, Modal, Select, SelectChangeEvent, TextField, Typography } from '@mui/material'
import plus from '../asset/plus.svg'
import edit from '../asset/edit.svg'
import deleteIcon from '../asset/delete.svg'
import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { CounterState } from '../reducer'
import { getCookie, setCookie } from '../cookie'
import { useNavigate } from 'react-router-dom'
import * as Sentry from '@sentry/react';
import CustomButton from '../component/customButton'

type workspaceEdit = {
    title?: string;
    description?: string;
    workspaceField?: string;
    workspaceKeyword?: string;
    editDate?: string;
    workspaceId?: number;
}

const initWorkspaceEdit = {
    title: '',
    description: '',
    workspaceField: '',
    workspaceKeyword: '',
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
    // const [workspaceField, setWorkspaceField] = useState<string>("")
    // const [workspaceKeyword, setWorkspaceKeyword] = useState<string>("")
    // const [addIds, setAddIds] = useState<number>()
    // const [addDate, setAddDate] = useState<string>('')
    const [workspace, setWorkspace] = useState<workspaceEdit>(initWorkspaceEdit)
    const [workspacesArr, setWorkspacesArr] = useState<workspaceEdit[]>([])
    const [curEditItem, setCurEditItem] = useState<workspaceEdit>(initWorkspaceEdit)

    const handleClose = () => setOpen(false);

    const {data: workspaces, isLoading} = useQuery(['workspace'],async ()=> await fetch(`${api}/api/workspace/workspaces`
    , {
        headers: {
            "Gauth": getCookie('access')
        }
    }).then(response => {
        if (response.status === 200) {
            return response.json()
        } else if (response.status === 401) {

            fetch(`${api}/api/update/token`, {
              headers: { 
                'Refresh' : getCookie('refresh') 
              }
            }).then(response => {
              if (response.status === 401) {
                navigate('/login')
                notify('Login time has expired')
                throw new Error('로그아웃')
              }
              else if (response.status === 200) {
                let jwtToken: string | null = response.headers.get('Gauth')
                let refreshToken: string | null = response.headers.get('RefreshToken')

                if (jwtToken) {
                    setCookie('access', jwtToken)
                }

                if (refreshToken) {
                    setCookie('refresh', refreshToken)
                }
              }
            })
            
          }
        throw new Error("워크스페이스 정보를 가져오는데 실패하였습니다")
    })
    .then(data => {
        setWorkspacesArr(data.workspaces)
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
        setOpen(false)
        const payload = {
            title: workspace && workspace.title,
            description: workspace && workspace.description,
            studyField: workspace && workspace.workspaceField,
            keywords: workspace && workspace.workspaceKeyword
        }
        fetch(`${api}/api/workspace/workspaceCRUD`, {
            method: 'POST',
                headers : { 'Content-Type' : 'application/json',
            'Gauth': getCookie('access') },
            body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.workspaceId)
            setWorkspace({...workspace, workspaceId: data.workspaceId, editDate: data.editDate})
            // setWorkspace({...workspace, editDate: data.editDate})
        
            // setWorkspacesArr((prevArr) => [ workspace!, ...prevArr])
            // setWorkspace(initWorkspaceEdit)
            
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
        console.log(workspacesArr, workspaceId)
        setWorkspacesArr((prevArr) => prevArr.filter((workspace) => workspace.workspaceId !== workspaceId));
        fetch(`${api}/api/workspace/workspaceCRUD?workspaceId=${workspaceId}`, {
            method: 'DELETE',
                headers : { 'Content-Type' : 'application/json',
            'Gauth': getCookie('access') }
        }).then((response) => response)
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
        setOpen(false)
        setWorkspacesArr((prevArr) => prevArr.map((workspace) => (workspace.workspaceId === workspaceId ? curEditItem : workspace)));

        fetch(`${api}/api/workspace/workspaceCRUD?workspaceId=${workspaceId}`, {
            method: 'PUT',
            headers : { 'Content-Type' : 'application/json',
            'Gauth': getCookie('access') },
            body: JSON.stringify(curEditItem)
        }).then((response) => response)
    }

    const goToWorkspace = (workspaceId: number, workspaceTitle: string) => {
        sessionStorage.setItem('workspaceTitle', workspaceTitle)
        navigate(`/home/${workspaceId}`)
    }

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 1000,
        bgcolor: 'white',
        // border: '2px solid #000',
        boxShadow: 24,
        borderRadius: '20px',
        py: 4,
        px: 8
      };

    const card = (title: string, desc: string, date: string, wId: number) => (
        <Box>
            <Box sx={{width: '320px', height: '210px', bgcolor: 'white', borderRadius: '20px', border: '1px solid #ddd',
            boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.05)'
            ,p: 3, mr: 3, mb: 3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                <Box onClick={()=>goToWorkspace(wId, title)}>
                    <Typography sx={{color: '#333', fontSize: '18px', fontWeight: '600', mb: 2}}>{title}</Typography>
                    <Typography sx={{color: '#666', fontSize: '15px', fontWeight: '400', mb: 2}}>{desc}</Typography>
                </Box>
                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
                    <Box sx={{display: 'flex'}}>
                        <Box sx={{display: 'flex', p: '2px 5px', justifyContent: 'center', alignItems: 'center', gap: '4px', borderRadius: '4px', border: '0.5px solid #999', mr: 1}}>
                            <img src={edit}/>
                            <Typography sx={{fontSize: '13px', fontWeight: 500, letterSpacing: '-0.13px', color: '#999'
                            ,cursor: 'pointer'}}
                                onClick={()=>{
                                    handleEdit(wId)
                                    }}>
                                Edit
                            </Typography>
                        </Box>
                        <Box sx={{display: 'flex', p: '2px 5px', justifyContent: 'center', alignItems: 'center', gap: '4px', borderRadius: '4px', border: '0.5px solid #999'}}>
                            <img src={deleteIcon}/>
                            <Typography sx={{fontSize: '13px', fontWeight: 500, letterSpacing: '-0.13px', color: '#999'
                            ,cursor: 'pointer'}}
                            onClick={()=>handleDeleteClick(wId, title)}>
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
  return (
    <PageLayout workspace={false} number={0}>
        <MetaTag title="연두 홈" description="궁금한 개념 질문 또는 논문 제목 검색을 하면 답변과 관련 논문을 제공합니다." keywords="논문, 검색, 질문, 개념, gpt"/>
        <Title title="Home" />
        <Box sx={{display: 'flex', justifyContent: 'flex-end', p:2, color: 'grey.700'}}>
          <UserMenu/>
        </Box>
        <Box sx={{}}>
            <Box sx={{mx: '7vw', my: '5vh', display: 'flex', flexWrap: 'wrap'}}>
                <Box sx={{width: '320px', height: '210px', bgcolor: '#F5F5F5', borderRadius: '20px'
                , display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                mr: 3, mb: 3}}>
                    <img src={plus} onClick={handleAddWorkspace} style={{cursor: 'pointer'}}/>
                    <Typography sx={{color: '#333', fontSize: '16px', fontWeight: '500'}}> Add a workspace</Typography>
                </Box>
                {/* {console.log(data)} */}
                {(workspacesArr) && workspacesArr.map((workspace)=>(
                    card(workspace.title!, workspace.description!, workspace.editDate!, workspace.workspaceId!)
                ))}
                {/* {workspaces && workspaces.map((workspace:any)=>(
                    card(workspace.title, workspace.description, workspace.editDate, workspace.workspaceId)
                ))} */}
            </Box>
        </Box>
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2" sx={{color: '#617F5B', fontWeight: 600, fontSize: '23px'}}>
                    {isEdit ? "Edit a workspace" :"Add a workspace"}
                </Typography>
                {!isEdit && workspaceTextField('Workspace Title', workspace!.title!, (event: ChangeEvent<HTMLInputElement>)=>{setWorkspace({...workspace, title: event?.target.value})})}
                {!isEdit && workspaceTextField('Workspace Description', workspace!.description!, (event: ChangeEvent<HTMLInputElement>)=>{setWorkspace({...workspace, description: event?.target.value})})}
                {isEdit && workspaceTextField('Workspace Title', curEditItem!.title!, (event: ChangeEvent<HTMLInputElement>)=>{setCurEditItem({...curEditItem, title: event?.target.value})})}
                {isEdit && workspaceTextField('Workspace Description', curEditItem!.description!, (event: ChangeEvent<HTMLInputElement>)=>{setCurEditItem({...curEditItem, description: event?.target.value})})}
                <Box sx={{mb: 2}}>
                    <Typography id="modal-modal-description" sx={{ mt: 2, color: '#666', mb: 1 }}>
                        Workspace Research Field
                    </Typography>
                    <Select
                        value={isEdit?curEditItem!.workspaceField :workspace!.workspaceField}
                        onChange={isEdit?(event: SelectChangeEvent<string>) => {setCurEditItem({...curEditItem, workspaceField: event.target.value})}
                            :(event: SelectChangeEvent<string>) => {setWorkspace({...workspace, workspaceField: event.target.value})}}
                        size='small'
                        sx={{
                            width: '100%'
                        }}
                    >
                        <MenuItem value="NO">없음</MenuItem>
                        <MenuItem value="직접 입력">직접 입력</MenuItem>
                    </Select>
                </Box>
                {!isEdit && workspaceTextField('Workspace Keywords or Interests', workspace!.workspaceKeyword!, (event: ChangeEvent<HTMLInputElement>)=>{setWorkspace({...workspace, workspaceKeyword: event.target.value})})}
                {isEdit && workspaceTextField('Workspace Keywords or Interests', curEditItem!.workspaceKeyword!, (event: ChangeEvent<HTMLInputElement>)=>{setCurEditItem({...curEditItem, workspaceKeyword: event.target.value})})}
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
    </PageLayout>
  )
}

export default Workspaces