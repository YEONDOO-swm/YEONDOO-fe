import * as React from "react";
import { Card, CardContent } from '@mui/material';
import { Title } from 'react-admin';

export const PaperStorage = () => (
    <Card>
        <Title title="논문보관함" />
        <CardContent>
            paperStorage!
        </CardContent>
    </Card>
);