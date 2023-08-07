import { defaultTheme } from 'react-admin';
import indigo from '@mui/material/colors/indigo';
import pink from '@mui/material/colors/pink';
import red from '@mui/material/colors/red';
import { green, lightGreen, lime, teal } from '@mui/material/colors';

export const MyTheme = {
    ...defaultTheme,
    palette: {
        primary: {
            main: '#17594A'
        },
        secondary: {
            main: '#588157'
        },
        error: red,
        contrastThreshold: 3,
        tonalOffset: 0.2,
    },
    typography: {
        // Use the system font instead of the default Roboto font.
        fontFamily: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Arial', 'sans-serif'].join(','),
    },
};

export const DarkTheme = {
    ...defaultTheme,
    palette: { mode: 'dark' }
}