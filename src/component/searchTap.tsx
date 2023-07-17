import * as React from "react";
import { TextField, IconButton, InputAdornment, CardContent, Container } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

type SearchTapProps = {
  searchTerm: string;
  onChange: (value: string) => void;
  onSearch: (value: any) => void;
  onSearchKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
};

export const SearchTap: React.FC<SearchTapProps> = ({
  searchTerm,
  onChange,
  onSearch,
  onSearchKeyDown,
}) => {
  const searchInputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  return (
    <CardContent sx={{ margin: '30px auto' }}>
          <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <TextField
                id="search"
                type="search"
                inputRef={searchInputRef}
                placeholder="CNN과 관련된 논문을 찾아줘"
                label="Search"
                value={searchTerm}
                onChange={(event) => onChange(event.target.value)}
                onKeyDown={onSearchKeyDown}
                sx={{ width: "80%" }}
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
        </Container>
    </CardContent>     
  );
};