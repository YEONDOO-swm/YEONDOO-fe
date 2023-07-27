import { Button } from "@mui/material";
import * as amplitude from '@amplitude/analytics-browser';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import * as React from "react";

export const GoToArxiv = (url: any) => {
    const handleViewPaper = (url: any) => {
        amplitude.track("논문 보기 Clicked");
        window.open(url, "home")
    }
    return (
        <>
            <Button variant="outlined" onClick={() => handleViewPaper(url.url)}>
                <OpenInNewIcon sx={{ fontSize: '16px', mr: 0.5}}/> Arxiv
            </Button>
        </>
    )
}