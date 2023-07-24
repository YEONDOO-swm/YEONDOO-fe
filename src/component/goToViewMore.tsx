import { Button } from "@mui/material";
import * as amplitude from '@amplitude/analytics-browser';
import { useNavigate } from 'react-router-dom';
import * as React from "react";

export const GoToViewMore = (paperid: any) => {
    const navigate = useNavigate()

    const handleViewMore = (paperId: any) => {
        amplitude.track("자세히 보기 Clicked")
        navigate(`/paper?paperid=${paperId}`)
      }

    return (<Button variant ="contained" onClick={() => handleViewMore(paperid.paperid)}>자세히 보기</Button>)
}