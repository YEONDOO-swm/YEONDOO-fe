import React from 'react'
import { Box, SxProps, TextField, IconButton, InputAdornment, CardContent, Container, Button, Modal, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNotify } from "react-admin";
import { MouseEvent } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { CounterState, SET_CHAT_SELECTED_TEXT, SET_IS_OPEN_SELECT_REF, SET_REF_PAPER, SET_SECOND_PAPER } from '../reducer';
import { useQuery } from 'react-query';
import { getApi, refreshApi } from '../utils/apiUtils';
import { useNavigate } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import { color } from '../layout/color';

type SearchTapProps = {
    searchTerm: string;
    onChange: (value: string) => void;
    onSearch: (value: MouseEvent<HTMLButtonElement>) => void;
    onSearchKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    placeholder?: string;
    firstBoxSx?: SxProps;
    middleBoxSx?: SxProps;
    sx?: SxProps;
    heightSx ?: SxProps;
    selectedText?: string,
  };

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

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
  }) => {
    const maxLengthLimit: number = 300
    const searchInputRef = React.useRef<HTMLInputElement | null>(null);
    const notify = useNotify()
    const dispatch = useDispatch()

    const papersInStorage = useSelector((state:CounterState) => state.papersInStorage)
  
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
        type: SET_CHAT_SELECTED_TEXT,
        data: ""
      })
    }
  
    return (

        <Box sx={{bgcolor: 'white'}}>
            {refPaper.paperId
            ?<Box sx={{display: 'flex', alignItems: 'center'}}>
              <Button onClick={handleOpenSelectModal}>{refPaper.paperTitle}</Button>
              <Button onClick={handleDeleteRef}>x</Button>
            </Box>
            :<Box>
              <Button onClick={handleOpenSelectModal}>레퍼런스 논문 선택</Button>
            </Box>}
            <Modal
              open={isOpenSelectRef}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Select Reference Paper
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  {papersInStorage && papersInStorage.map((paper: any) => (
                    <>
                    <Button onClick={() => handleSetRef(paper.paperId, paper.title)}>{paper.title}</Button><br/>
                    </>
                      
                  ))}
                </Typography>
              </Box>
            </Modal>
            {selectedText && (selectedText.length>30 ? 
            <Box sx={{display: 'flex'}}>
              <Box sx={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', bgcolor: '#ddd', borderRadius: '20px', m: 1, px: 1,}}>
                    {selectedText} 
              </Box>
              <Button onClick={handleDeleteSelectedText}>x</Button>
            </Box>:<Box sx={{display: 'flex'}}><Box sx={{display: 'inline-block', bgcolor: '#ddd', borderRadius: '20px', m: 1, px: 1}}>
                {selectedText}
            </Box>
            <Button onClick={handleDeleteSelectedText}>x</Button></Box>)}
            <Box sx={firstBoxSx}>
                    <Box sx={middleBoxSx}>
                        <TextField
                        id="search"
                        type="search"
                        variant="outlined"
                        multiline
                        inputProps={{
                            maxLength: maxLengthLimit,
                        }}
                        inputRef={searchInputRef}
                        placeholder={placeholder}
                        value={searchTerm}
                        onChange={handleChange}
                        onKeyDown={onSearchKeyDown}
                        sx={{ ...sx, color: '#fff'}}
                        InputProps={{
                            endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={onSearch}>
                                <SearchIcon sx={{color: color.mainGreen}}/>
                                </IconButton>
                            </InputAdornment>
                            ),
                            sx: {...heightSx, border: '1px solid #fff', borderRadius: '10px'}
                        }}
                        />
                </Box>
            </Box>     
        </Box>
    );
  };