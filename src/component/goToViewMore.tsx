import { Box, Button, Typography } from "@mui/material";
import * as amplitude from '@amplitude/analytics-browser';
import { useNavigate } from 'react-router-dom';
import * as React from "react";
import { color } from "../layout/color";
import study from "../asset/study.svg"
import studyHover from "../asset/studyHover.svg"
import { useState } from "react";



export const GoToViewMore = ({paperid, workspaceId}: {paperid:string, workspaceId: number}) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const handleViewMore = (paperId: string) => {
        window.open(`/paper?workspaceId=${workspaceId}&paperid=${paperId}`)
      }

    return (
      <Box onClick={() => handleViewMore(paperid)} sx={{display: 'inline-flex', padding: '8px 40px', height: '40px',
                                                            justifyContent: 'center', alignItems: 'center', gap: '10px',
                                                            borderRadius: '8px', border: `2px solid ${color.mainGreen}`,
                                                            bgcolor: color.mainGreen,
                                                            '&:hover': {
                                                                bgcolor: color.hoverGreen,
                                                                cursor: 'pointer'
                                                            }}}
                                                            onMouseEnter={handleMouseEnter}
                                                            onMouseLeave={handleMouseLeave}>
                <img src={study}/>
                <Typography sx={{color: isHovered?color.white:color.white, fontSize: '15px', fontWeight: 700}}>
                    Study with AI
                </Typography>
            </Box>
    )
}