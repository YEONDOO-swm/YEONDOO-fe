import { Button } from "@mui/material";
import * as amplitude from '@amplitude/analytics-browser';
import * as React from "react";

export const GoToArxiv = (url: any) => {
    const handleViewPaper = (url: any) => {
        amplitude.track("논문 보기 Clicked");
        window.open(url, "home")
    }
    return (
        <>
            <Button variant="contained" onClick={() => handleViewPaper(url.url)}>논문 보기</Button>
        </>
    )
}