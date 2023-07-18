import * as React from "react";
import { Box, SxProps, TextField, IconButton, InputAdornment, CardContent, Container } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

type SearchTapProps = {
  searchTerm: string;
  onChange: (value: string) => void;
  onSearch: (value: any) => void;
  onSearchKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  firstBoxSx?: SxProps;
  middleBoxSx?: SxProps;
  sx?: SxProps;
};

export const SearchTap: React.FC<SearchTapProps> = ({
  searchTerm,
  onChange,
  onSearch,
  onSearchKeyDown,
  placeholder,
  firstBoxSx,
  middleBoxSx,
  sx
}) => {
  const searchInputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  return (
    <Box sx={firstBoxSx}>
          <Box sx={middleBoxSx}>
                <TextField
                id="search"
                type="search"
                inputRef={searchInputRef}
                placeholder={placeholder}
                label="Search"
                value={searchTerm}
                onChange={(event) => onChange(event.target.value)}
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
                }}
                />
        </Box>
    </Box>     
  );
};