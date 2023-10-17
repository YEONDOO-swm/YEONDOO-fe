import { Box, Button, Typography } from "@mui/material";
import * as amplitude from '@amplitude/analytics-browser';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import * as React from "react";
import { color } from "../layout/color";
import arxiv from "../asset/arxiv.svg"
import arxivHover from "../asset/arxivHover.svg"
import { useState } from "react";


export const GoToArxiv = ({url, paperId}: {url: string, paperId: string}) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const handleViewPaper = (url: string) => {
        if (process.env.NODE_ENV === 'production'){
            amplitude.track("Arxiv Clicked", {paperId: paperId});
        }
        window.open(url, "home")
    }
    return (
        <>
            <Box onClick={() => handleViewPaper(url)} sx={{display: 'inline-flex', padding: '0px 40px', height: '40px',
                                                            justifyContent: 'center', alignItems: 'center', gap: '10px',
                                                            borderRadius: '8px', border: `2px solid ${color.arxiv}`,
                                                            bgcolor: color.arxiv,
                                                            '&:hover': {
                                                                bgcolor: color.hoverArxiv,
                                                                cursor: 'pointer'
                                                            }}}
                                                            onMouseEnter={handleMouseEnter}
                                                            onMouseLeave={handleMouseLeave}>
                <img src={arxivHover}/>
                <Typography sx={{color: color.white, fontSize: '15px', fontWeight: 700}}>
                    Arxiv
                </Typography>
            </Box>
        </>
    )
}