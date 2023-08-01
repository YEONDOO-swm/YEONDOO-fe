import { Button } from "@mui/material";
import * as amplitude from '@amplitude/analytics-browser';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import * as React from "react";

export const GoToArxiv = ({url, paperId}: {url: any, paperId: any}) => {
    const handleViewPaper = (url: any) => {
        if (process.env.NODE_ENV === 'production'){
            amplitude.track("Arxiv Clicked", {paperId: paperId});
        }
        console.log(url)
        window.open(url, "home")
    }
    return (
        <>
            <Button variant="outlined" onClick={() => handleViewPaper(url)}>
                <OpenInNewIcon sx={{ fontSize: '16px', mr: 0.5}}/> Arxiv
            </Button>
        </>
    )
}