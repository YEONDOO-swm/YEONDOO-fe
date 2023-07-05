import React, { useState, ChangeEvent, FormEvent, useEffect} from 'react';
import { TextField, Title } from 'react-admin';
import { Box, Button, FormControl, InputLabel, Select, SelectChangeEvent, Typography } from '@mui/material';
import * as amplitude from '@amplitude/analytics-browser';


export const UserProfile = () => {
    useEffect(() => {
        amplitude.track("UserProfile Page Viewed");
    }, []);
    
    const [researchField, setResearchField] = useState('NO');
    const [keywords, setKeywords] = useState('');

    const handleResearchFieldChange = (event: SelectChangeEvent<string>) => {
        setResearchField(event.target.value);
    };

    const handleKeywordsChange = (event: ChangeEvent<HTMLInputElement>) => {
        setKeywords(event.target.value);
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log('연구분야: ', researchField);
        console.log('키워드: ', keywords);
    };
    
    const margin_value = '30px'

    return (
        <Box sx={{ maxWidth: 400, margin: '30px auto', padding: '3rem', backgroundColor: '#ffffff', borderRadius: '20px' }}>
            <Title title="Profile"/>
        {/* <Typography variant="h4" sx={{ marginBottom: '1rem' }}>Profile</Typography> */}
        <form onSubmit={handleSubmit}>
            <Typography variant="body1" sx={{ marginBottom: '0.5rem' }}>
            1. 현재 하고 있는 연구분야는 무엇인가요?
            </Typography>
            <FormControl fullWidth sx={{ marginBottom: '1rem' }}>
            <InputLabel htmlFor="researchField">연구분야</InputLabel>
            <Select
                native
                value={researchField}
                onChange={handleResearchFieldChange}
                inputProps={{ id: 'researchField' }}
            >
                <option value="NO">없음</option>
                <option value="CV">Computer vision</option>
                <option value="NLP">Natural Language Processing</option>
                <option value="Robotics">Robotics</option>
            </Select>
            </FormControl>
            <Typography variant="body1" sx={{ marginBottom: '0.5rem' }}>
            2. 관심있는 키워드는 무엇인가요?
            </Typography>
            <input
            type="text"
            value={keywords}
            onChange={handleKeywordsChange}
            style={{ width: '100%', padding: '0.5rem', 
                marginBottom: '1rem', 
                backgroundColor: '#F3F3F3', 
                height: '45px',
                border: 'none',
                borderBottom: '1px solid black',
                borderColor: '#999999'}}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="submit" variant="outlined">
                Submit
                </Button>
            </Box>
        </form>
        </Box>
    );
};
