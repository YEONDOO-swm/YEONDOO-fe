import { Button } from "@mui/material";
import * as amplitude from '@amplitude/analytics-browser';
import { useNavigate } from 'react-router-dom';
import * as React from "react";



export const GoToViewMore = ({paperid}: {paperid:string}) => {
    const navigate = useNavigate()

    const handleViewMore = (paperId: string) => {
        navigate(`/paper?paperid=${paperId}`)
      }

    return (<Button variant ="contained" onClick={() => handleViewMore(paperid)}>
      Chat with AI
    </Button>)
}