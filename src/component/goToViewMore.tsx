import { Button } from "@mui/material";
import * as amplitude from '@amplitude/analytics-browser';
import { useNavigate } from 'react-router-dom';
import * as React from "react";

export const GoToViewMore = (paperid: any) => {
    const navigate = useNavigate()

    const handleViewMore = (paperId: any) => {
        navigate(`/paper?paperid=${paperId}`)
      }

    return (<Button variant ="contained" onClick={() => handleViewMore(paperid.paperid)}>
      AI와 논문읽기
    </Button>)
}