import React, { MouseEventHandler, useState } from 'react'
import { Box, SxProps, TextField, IconButton, InputAdornment, CardContent, Container, Button, Modal, Typography, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNotify } from "react-admin";
import { MouseEvent } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { CounterState, SET_CHAT_SELECTED, SET_IS_OPEN_SELECT_REF, SET_PAPERS_IN_STORAGE, SET_REF_PAPER, SET_SECOND_PAPER } from '../reducer';
import { useQuery } from 'react-query';
import { getApi, refreshApi } from '../utils/apiUtils';
import { useNavigate } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import { color } from '../layout/color';
import send from '../asset/send.png'
import SendIcon from '@mui/icons-material/Send';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import { paperType } from '../page/home';
import scrollStyle from "../layout/scroll.module.css"
import deleteIcon from "../asset/deleteIcon.svg"
import spinner from '../asset/spinner.gif'
import CustomButton from './customButton';
import * as amplitude from '@amplitude/analytics-browser';

type SearchTapProps = {
    searchTerm: string;
    onChange: (value: string) => void;
    onSearch: any;
    onSearchKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    placeholder?: string;
    firstBoxSx?: SxProps;
    middleBoxSx?: SxProps;
    sx?: SxProps;
    heightSx ?: SxProps;
    selectedText?: string;
    paperInfo: any;
    setOpenedPaperNumber?:any
    setCurTab: any;
  };

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #eee',
  borderRadius: '50px 0px 0px 0px',
  boxShadow: 24,
  p: 4,
};

const PaperBox = ({handleClickPaper, paper}: {handleClickPaper: any, paper: paperType}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false)
  return (
      <Box onClick={() => handleClickPaper(paper.paperId)} 
      onMouseEnter={()=>{setIsHovered(true)}}
      onMouseLeave={()=>{setIsHovered(false)}}
      sx={{py: 1, borderBottom: '1px solid #eee', cursor: 'pointer', bgcolor: isHovered?"#f5f5f5":color.white}}>
          <Typography sx={{color: isHovered?color.mainGreen:'#666', fontSize: '15px', fontWeight: '400',
                          }}>
              {paper.title}
          </Typography>
      </Box>
  )
}

export const ChatTextField: React.FC<SearchTapProps> = ({
    searchTerm,
    onChange,
    onSearch,
    onSearchKeyDown,
    placeholder,
    firstBoxSx,
    middleBoxSx,
    sx,
    heightSx,
    selectedText,
    paperInfo,
    setOpenedPaperNumber,
    setCurTab,
  }) => {
    const maxLengthLimit: number = 300
    const searchInputRef = React.useRef<HTMLInputElement | null>(null);
    const notify = useNotify()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const papersInStorage = useSelector((state:CounterState) => state.papersInStorage)
    const api = useSelector((state: CounterState) => state.api)
    const workspaceId = Number(sessionStorage.getItem('workspaceId'))

    const [isLoading, setIsLoading] = useState(false)

  
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const inputText = event.target.value;
  
      if (inputText.length > maxLengthLimit) {
        notify('You can only enter up to 300 characters.')
        return;
      }
      onChange(inputText);
    };
  
    React.useEffect(() => {
      searchInputRef.current?.focus();
    }, []);

    const handleOpenSelectModal = () => {
      setIsLoading(true)
      getApi(api, `/api/container?workspaceId=${workspaceId}`)
      .then(async response => 
        {
          if (response.status === 200) {
            return response.json().then(data => {
              dispatch({
                type: SET_PAPERS_IN_STORAGE,
                data: data
              })
            })
          } else if (response.status === 401) {
            await refreshApi(api, notify, navigate)
          } else if (response.status === 400) {
            navigate(`/home`)
          }
        })
      .catch(error => {
        console.error('관심 논문 정보를 불러오는데 실패하였습니다: ', error)
        Sentry.captureException(error)
      })
      .finally(() => {
        setIsLoading(false)
      })
      dispatch({
        type: SET_IS_OPEN_SELECT_REF,
        data: true
      })
    }

    const handleClose = () => {
      dispatch({
        type: SET_IS_OPEN_SELECT_REF,
        data: false
    })
    }
    const isOpenSelectRef = useSelector((state: CounterState) => state.isOpenSelectRef)

    const handleSetRef = (paperId: string, paperTitle: string) => {
      if (process.env.NODE_ENV === 'production') { 
        amplitude.track("다 논문 질의를 위한 논문 선택")
      }
      dispatch({
        type: SET_REF_PAPER,
        data: {
          paperId: paperId,
          paperTitle: paperTitle,
        }
      })
      dispatch({
        type: SET_SECOND_PAPER,
        data: {
          paperId: paperId,
          paperTitle: paperTitle,
        }
      })
      setOpenedPaperNumber(paperId)
      setCurTab(2)
      handleClose()
    }

    const handleDeleteRef = () => {
      dispatch({
        type: SET_REF_PAPER,
        data: {
          paperId: "",
          paperTitle: "",
        }
      })
    }
    const refPaper = useSelector((state: CounterState) => state.refPaper)

    const handleDeleteSelectedText = () => {
      dispatch({
        type: SET_CHAT_SELECTED,
        data: {
          selectedText: "",
          position: {
            pageIndex: 0,
            rects: []
          }
        }
      })
    }

    const [refPaperList, setRefPaperList] = useState<string>("My library")
    const handlerefPaperListChange = (event: SelectChangeEvent) => {
      setRefPaperList(event.target.value);
    };
  
    return (

        <Box sx={{bgcolor: 'white', p: '10px'}}>
            {refPaper.paperId
            ?<Box sx={{display: 'inline-flex', alignItems: 'center', gap: 1, pl: 2, pr: 1, py: 0.4, mb: 1,
            borderRadius: '100px', border: `1px solid ${color.mainGreen}`, cursor: 'pointer'}}>
              <Typography sx={{fontSize: '13px', color: color.mainGreen, fontWeight: 500}} onClick={handleOpenSelectModal}>
                {refPaper.paperTitle.length>30?refPaper.paperTitle.slice(0,30)+"...":refPaper.paperTitle}
              </Typography>
              <ClearIcon onClick={handleDeleteRef} sx={{cursor: 'pointer', color: color.mainGreen, fontSize: '15px', ml: 0.7,}}/>
            </Box>
            :<Box onClick={handleOpenSelectModal} sx={{display: 'inline-flex', alignItems: 'center', gap: 1, pl: 1, pr: 2, py: 0.4, mb: 1,
                borderRadius: '100px', border: `1px solid ${color.mainGreen}`, cursor: 'pointer'}}>
              <AddIcon sx={{fontSize: '15px', color: color.mainGreen}}/>
              <Typography sx={{fontSize: '13px', color: color.mainGreen, fontWeight: 500}}>Add study paper</Typography>
            </Box>}
            <Modal
              open={isOpenSelectRef}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <img src={deleteIcon} style={{width: '20px', position: 'absolute', left: '90%',
                                              transform: 'translate(100%, -100%)', cursor: 'pointer'}}
                      onClick={handleClose}/>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Add study paper
                </Typography>
                <Box sx={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between'}}>
                  <FormControl sx={{width: '50%', mt: 2}} size='small'>
                    <InputLabel id="demo-simple-select-label">Papers</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={refPaperList}
                        onChange={handlerefPaperListChange}
                        sx={{bgcolor: '#fff', border: '1px solid #ddd'}}
                    >
                        <MenuItem value="My library">My works</MenuItem>
                        <MenuItem value="Paper reference">Paper references</MenuItem>
                      </Select>
                  </FormControl>
                  {refPaperList === 'My library' && <Box>
                    <CustomButton title="Add works" width="100px" click={()=>{window.open(`/dashboard?workspaceId=${workspaceId}`)}} />
                  </Box>}
                </Box>
                <Box sx={{width: '100%', height: '2px', bgcolor: color.secondaryGreen, mt: 1}}></Box>
                <Box sx={{height: '30vh', overflowY: 'scroll'}} className={scrollStyle.scrollBar}>
                  {refPaperList === 'My library' 
                  // My works 일때
                  ? isLoading 
                    ? 
                    <Box sx={{height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                      <img src={spinner} width="20%"/>
                    </Box>
                    :
                    (papersInStorage.length > 0 
                      ? papersInStorage.map((paper: any, idx: number) => (
                      paperInfo.paperId !== paper.paperId && <Box key={idx}>
                        <PaperBox paper={paper} handleClickPaper={() => handleSetRef(paper.paperId, paper.title)} />
                      </Box>)        
                    )
                    :
                    <Box sx={{height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                      <Typography sx={{fontSize: '15px'}}>
                        No papers in My Works.
                      </Typography>
                      <Typography sx={{fontSize: '12px'}}>
                        Save papers to My Works by pressing ♡ button.
                      </Typography>
                    </Box>)
                  // References 일때
                  :
                  paperInfo && paperInfo.references && 
                  (paperInfo.references.length > 0?paperInfo.references.map((paper: any, idx: number) => (
                    <Box key={idx}>
                      <PaperBox paper={paper} handleClickPaper={()=>handleSetRef(paper.paperId, paper.title)} />
                    </Box>
                  ))
                  : <Box sx={{height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                    <Typography sx={{fontSize: '15px'}}>
                      No reference papers
                    </Typography>
                  </Box>)
                  }
                </Box>
              </Box>
            </Modal>
            {selectedText && (selectedText.length>12 ? 
            <Box sx={{display: 'flex', alignItems: 'center', bgcolor: color.mainGreen, borderRadius: '100px', mb: 1}}>
              <Box sx={{display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden', mx: 1, my: 0.5, px: 1,}}>
                <Typography sx={{color: color.white, fontSize: '13px', fontWeight: 500}}>
                  {selectedText} 
                </Typography>
              </Box>
              <ClearIcon onClick={handleDeleteSelectedText} sx={{cursor: 'pointer', color: color.white, fontSize: '15px', mr: 1}}/>
            </Box>:
            <Box sx={{display: 'flex', alignItems: 'center', mb: 1}}>
              <Box sx={{display: 'inline-flex', pl: 2, py: 0.5, alignItems: 'center',
                        bgcolor: color.mainGreen, borderRadius: '100px'}}>
                  <Typography sx={{color: color.white, fontSize: '13px', fontWeight: 500}}>
                    {selectedText} 
                  </Typography>
                <ClearIcon onClick={handleDeleteSelectedText} sx={{cursor: 'pointer', color: color.white, fontSize: '15px', ml: 0.7, mr: 1}}/>
              </Box>
            </Box>)}
            <Box sx={firstBoxSx}>
                    <Box sx={{height: '45px',display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    , color: '#333', backgroundColor: '#f5f5f5', borderRadius: '10px'}}>
                        <input
                        id="search"
                        type="search"
                        // variant="outlined"
                        // multiline
                        // inputProps={{
                        //     maxLength: maxLengthLimit,
                        // }}
                        ref={searchInputRef}
                        placeholder={placeholder}
                        value={searchTerm}
                        onChange={handleChange}
                        onKeyDown={onSearchKeyDown}
                        onClick={()=>{searchInputRef.current?.focus();}}
                        style={{ color: '#333', backgroundColor: '#f5f5f5', borderRadius: '10px', width: '100%', paddingLeft: '10px',
                        border: 'none', outline: 'none',
                        fontSize: '15px'}}
                        // InputProps={{
                        //     endAdornment: (
                        //     <InputAdornment position="end">
                                // <IconButton onClick={onSearch} sx={{bgcolor: color.mainGreen, my:1, height: '35px', width: '35px'}}>
                                // <SearchIcon sx={{color: color.mainGreen}}/>
                                // </IconButton>
                        //     </InputAdornment>
                        //     ),
                        //     sx: {...heightSx, border: '1px solid #fff', borderRadius: '10px', height: '50px'}
                        // }}
                        />
                        <div
                        onClick={(e)=>{
                          onSearch(e)
                          searchInputRef.current?.focus()
                        }} 
                        style={{display: 'flex', justifyContent: 'center', alignItems: 'center'
                        , backgroundColor: color.mainGreen, marginTop:1, marginBottom: 1, height: '35px', width: '38px',
                        borderRadius: '100%', marginRight: '5px', cursor: 'pointer'}}>
                          <SendIcon sx={{color: color.white, transform: 'rotate(-45deg)', ml: 0.5, mb: 0.5, fontSize: '18px'}}/>
                        </div>
                        
                </Box>
            </Box>     
        </Box>
    );
  };