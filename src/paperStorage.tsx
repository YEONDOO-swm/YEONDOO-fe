import * as React from "react";
import { Card, CardContent } from '@mui/material';
import { Title } from 'react-admin';
import * as amplitude from '@amplitude/analytics-browser';
import { useEffect } from "react";


export const PaperStorage = () => {
    useEffect(() => {
        amplitude.track("PaperStorage Page Viewed");
    }, []);
    
    return (
    <Card>
        <Title title="논문보관함" />
        <CardContent>
            paperStorage!
        </CardContent>
    </Card>
)};