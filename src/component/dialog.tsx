import React from 'react'
import { DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Dialog } from '@mui/material'

function DialogCancel() {

  return (
    <Dialog
    open={open}
    onClose={()=>setOpen(false)}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title">
            {"연두"}
        </DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
            정말 "{paper.title}"을 관심 논문에서 삭제하시겠습니까?
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={()=>setOpen(false)}>아니오</Button>
            <Button onClick={()=>handleCancel(paper.paperId)} autoFocus>
            예
            </Button>
        </DialogActions>
    </Dialog> 
  )
}

export default DialogCancel