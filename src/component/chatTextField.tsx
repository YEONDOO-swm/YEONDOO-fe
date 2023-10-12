import React from 'react'
import { Box, SxProps, TextField, IconButton, InputAdornment, CardContent, Container } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNotify } from "react-admin";
import { MouseEvent } from "react";

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
    tags?: string[]
    selectedText?: string
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
    tags,
    selectedText
  }) => {
    const maxLengthLimit: number = 300
    const searchInputRef = React.useRef<HTMLInputElement | null>(null);
    const notify = useNotify()
  
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
  
    return (

        <Box sx={{bgcolor: 'white'}}>
            {selectedText && (selectedText.length>30 ? <Box sx={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', bgcolor: '#ddd', borderRadius: '20px', m: 1, px: 1,}}>
                    {selectedText}
            </Box>:<Box sx={{display: 'inline-block', bgcolor: '#ddd', borderRadius: '20px', m: 1, px: 1}}>
                {selectedText}
            </Box>)}
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
                                <SearchIcon sx={{color: '#617F5B'}}/>
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