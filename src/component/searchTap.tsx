import * as React from "react";
import { Box, SxProps, TextField, IconButton, InputAdornment, CardContent, Container } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNotify } from "react-admin";

type SearchTapProps = {
  searchTerm: string;
  onChange: (value: string) => void;
  onSearch: (value: any) => void;
  onSearchKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  firstBoxSx?: SxProps;
  middleBoxSx?: SxProps;
  sx?: SxProps;
  heightSx ?: SxProps;
};

export const SearchTap: React.FC<SearchTapProps> = ({
  searchTerm,
  onChange,
  onSearch,
  onSearchKeyDown,
  placeholder,
  firstBoxSx,
  middleBoxSx,
  sx,
  heightSx
}) => {
  const maxLengthLimit = 300
  const searchInputRef = React.useRef<HTMLInputElement | null>(null);
  const notify = useNotify()

  const handleChange = (event: any) => {
    const inputText = event.target.value;

    if (inputText.length > maxLengthLimit) {
      notify('최대 300글자까지만 입력할 수 있습니다.')
      return;
    }
    onChange(inputText);
  };

  React.useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  return (
    <Box sx={firstBoxSx}>
          <Box sx={middleBoxSx}>
                <TextField
                id="search"
                type="search"
                inputProps={{
                  maxLength: maxLengthLimit,
                }}
                inputRef={searchInputRef}
                placeholder={placeholder}
                label="Search"
                value={searchTerm}
                onChange={handleChange}
                onKeyDown={onSearchKeyDown}
                sx={{ ...sx }}
                InputProps={{
                    endAdornment: (
                    <InputAdornment position="end">
                        <IconButton onClick={onSearch}>
                        <SearchIcon />
                        </IconButton>
                    </InputAdornment>
                    ),
                    sx: {...heightSx}
                }}
                />
        </Box>
    </Box>     
  );
};