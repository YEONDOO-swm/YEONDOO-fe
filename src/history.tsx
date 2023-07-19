import * as React from "react";
import { Card, CardContent } from '@mui/material';
import { Title, useAuthenticated } from 'react-admin';
import { useEffect } from "react";
import * as amplitude from '@amplitude/analytics-browser';
import { UserProfileCheck } from "./component/userProfileCheck";

export const History = () => {
    useAuthenticated();
    UserProfileCheck();
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
