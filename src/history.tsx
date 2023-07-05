import * as React from "react";
import { Card, CardContent } from '@mui/material';
import { Title } from 'react-admin';
import { useEffect } from "react";
import * as amplitude from '@amplitude/analytics-browser';

export const History = () => {
    useEffect(() => {
        amplitude.track("History Page Viewed");
    }, []);
    
    return (
    <Card>
        <Title title="히스토리" />
        <CardContent>
            History!
        </CardContent>
    </Card>
)};