import React, { useState, ChangeEvent, FormEvent, useEffect, KeyboardEvent} from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Title, useAuthenticated, useNotify } from 'react-admin';
import { Box, Button, FormControl, InputLabel, Select, SelectChangeEvent, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import * as amplitude from '@amplitude/analytics-browser';
import styles from '../layout/input.module.css'


export const UserProfile = () => {
    useAuthenticated();

    const [researchField, setResearchField] = useState('NO');
    const [keywords, setKeywords] = useState('');
    const [enteredKeywords, setEnteredKeywords] = useState<string[]>([]);
    const [fields, setFields] = useState<string[]>([]);
    const [customeField, setCustomeField] = useState('');
    const [userName, setUserName] = useState('');

    const notify = useNotify();
    const navigate = useNavigate();

    const username = sessionStorage.getItem('username');

    useEffect(() => {
        amplitude.track("UserProfile Page Viewed");
        // fetch fields from API
        fetch(`/api/userprofile/${username}`)
            .then(response => response.json())
            .then(data => {
                // console.log(data.username)
                setFields(data.fields.fields);
                setUserName(data.username)
            })
            .catch(error => {
                console.error('fields를 불러오는 데 실패하였습니다.');
            })
    }, []);

    const handleResearchFieldChange = (event: SelectChangeEvent<string>) => {
        setResearchField(event.target.value);
    };

    const handleKeywordsChange = (event: ChangeEvent<HTMLInputElement>) => {
        setKeywords(event.target.value);
    };

    const handleKeywordsKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if(event.key === 'Enter') {
            event.preventDefault();
            if (enteredKeywords.length >=3 ){   
                notify("키워드는 3개까지 입력할 수 있습니다.", {type: 'error'});
                setKeywords("");
            } else if (keywords === ''){
                notify("키워드를 입력해주세요", {type: 'info'})
            } else if (keywords.length > 50) {
                notify("키워드는 50글자 이하로 입력해주세요.")
                setKeywords("");
            }
            else {
                setEnteredKeywords(prevKeywords => [...prevKeywords, keywords]);
                setKeywords("");
            }
        }
    }

    const handleRemoveKeyword = (index: number) => {
        setEnteredKeywords(prevKeywords => {
            const updatedKeywords = [...prevKeywords];
            updatedKeywords.splice(index, 1);
            return updatedKeywords;
        })
    }

    const handleCustomFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (customeField.length > 50){
            notify("연구분야는 50글자 이하로 입력해주세요.")
        }
        setCustomeField(event.target.value);
    }


    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // console.log("submit!!!");

        const payload = {
            username: userName,
            studyfield: customeField === '' ? researchField : customeField,
            keywords: enteredKeywords
        }
        console.log(payload);
        fetch('/api/userprofile', {
            method: 'POST',
            headers: { 'Content-Type' : 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(response => {
            if (response.ok) {
                console.log('ok!!!!')
                return response.json;
            } else {
                throw new Error('유저 프로필 등록에 실패했습니다.');
            }
        })
        .then(() => {
            navigate('/home');
        })
        .catch(error => {
            console.error('유저 프로필 에러:', error)
        })
        // console.log('연구분야: ', researchField);
        // console.log('키워드: ', keywords);
    };
    
    const margin_value = '30px'

    // console.log(fields)

    return (
        <Box sx={{ maxWidth: 450, margin: '30px auto', padding: '3rem', backgroundColor: '#ffffff', borderRadius: '20px' }}>
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
                {/* <option value="CV">Computer vision</option>
                <option value="NLP">Natural Language Processing</option>
                <option value="Robotics">Robotics</option> */}
                {Array.isArray(fields) &&
                fields.map((field:string, index:number) => (
                    <option key={index} value={field}>
                        {field}
                    </option>
                ))}
                <option value="직접 입력">직접 입력</option>
            </Select>
            {researchField === '직접 입력' && (
                <input 
                    id="customeField"
                    placeholder="연구 분야를 입력해 주세요."
                    value={customeField} 
                    onChange={handleCustomFieldChange}
                    className={styles.input_box}/>
            )}
            </FormControl>
            <Typography variant="body1" sx={{ marginBottom: '0.5rem' }}>
            2. 관심있는 키워드는 무엇인가요? (최대 3개)
            </Typography>
            <input
            type="text"
            value={keywords}
            placeholder='입력 후 엔터'
            onChange={handleKeywordsChange}
            onKeyDown={handleKeywordsKeyDown}
            className={styles.input_box}
            />
            {enteredKeywords.length > 0 && (
                <div>
                    {enteredKeywords.map((keyword, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center'}}>
                            <Typography>
                                {keyword}
                            </Typography>
                            <IconButton onClick={() => handleRemoveKeyword(index)}>
                                <CloseIcon />
                            </IconButton>
                        </div>
                    ))}
                </div>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="submit" variant="outlined">
                Submit
                </Button>
            </Box>
        </form>
        </Box>
    );
};
