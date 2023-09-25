import { defaultTheme } from 'react-admin';
import indigo from '@mui/material/colors/indigo';
import pink from '@mui/material/colors/pink';
import red from '@mui/material/colors/red';
import { green, lightGreen, lime, teal } from '@mui/material/colors';

export const MyTheme = {
    ...defaultTheme,
    MuiAppBar: { colorSecondary: { backgroundColor: '#EF476F' } },
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
        fontFamily: [ 'Poppins', 'Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Arial', 'sans-serif'].join(','),
    },
    components: {
        ...defaultTheme.components,
        RaLayout: {
            styleOverrides: {
              root: {
                
                "& .RaLayout-appFrame": {
                    // backgroundColor: "red",
                    // height: 0,
                    // lineHeight: 0,
                    // top: '5%'
                  //   width: '100px'
                  marginTop:  0
                },
                "& .RaLayout-content": {
                    padding: 0
                } 
                  
              }
           }
        },
        RaAppBar: {
            styleOverrides: {
              root: {
                  backgroundColor: "Lavender",
                  height: 0,
                  width: 0,

                  //height: '50px',
                //   lineHeight: '50px',
                //   width: 0,
                //   display: 'none',
                //   top: '5%',
                  
                  
                  "& .MuiPaper-root": {
                      backgroundColor: "red",
                      height: 0,
                      lineHeight: 0
                    //   width: '100px'
                  },
              }
           }
        },
        RaSidebar: {
            styleOverrides: {
              root: {
                  width: 0,
                  
                  
              }
           }
        }
        
    }
};

export const DarkTheme = {
    ...defaultTheme,
    palette: { mode: 'dark' }
}