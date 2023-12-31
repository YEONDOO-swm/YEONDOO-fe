import React, { useState, ChangeEvent, FormEvent, useEffect, KeyboardEvent} from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Title, useAuthenticated, useNotify } from 'react-admin';
import { Box, Button, FormControl, InputLabel, Select, SelectChangeEvent, Typography, IconButton, Card } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import * as amplitude from '@amplitude/analytics-browser';
import styles from '../layout/input.module.css'
import { color } from '../layout/color';
import MetaTag from '../SEOMetaTag';
import * as Sentry from '@sentry/react';
import { getCookie } from '../cookie';


export const UserProfile = () => {
    useAuthenticated();

    var api = '';
    if (process.env.NODE_ENV === 'development'){
      api = `${import.meta.env.VITE_REACT_APP_LOCAL_SERVER}`
    }
    else if (process.env.NODE_ENV === 'production'){
      api = `${process.env.VITE_REACT_APP_AWS_SERVER}`
    }

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
        if (process.env.NODE_ENV === 'production') {

            amplitude.track("유저 프로필 Page Viewed");
        }
        const checkUserName = sessionStorage.getItem('username')
        if (checkUserName){
            setUserName(checkUserName)
        }   
        // fetch fields from API
        fetch(`${api}/api/userprofile/${username}`, {
            headers: {
                "Gauth": getCookie('access')
            }
        })
            .then(response => response.json())
            .then(data => {
                // console.log(data.username)
                // console.log(data.fields)
                setFields(data.fields);
            })
            .catch(error => {
                console.error('fields를 불러오는 데 실패하였습니다.');
                Sentry.captureException(error)
            })
    }, []);

    const handleResearchFieldChange = (event: SelectChangeEvent<string>) => {
        setResearchField(event.target.value);
    };

    const handleKeywordsChange = (event: ChangeEvent<HTMLInputElement>) => {
        
        
        if (keywords.length > 30){
            notify("키워드는 30글자 이하로 입력해주세요.")
            setKeywords(event.target.value);
        } else {
            setKeywords(event.target.value);
        }
    };

    const handleKeywordsKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if((event.key === 'Enter' ) && event.nativeEvent.isComposing === false) {
            event.preventDefault();
            const keywordRegex = /^[A-Za-z0-9가-힣 _&-]{1,30}$/
            if (!keywordRegex.test(keywords)){
                notify("키워드는 영어, 한글, 숫자만 가능합니다.")
                return
            }
            if (enteredKeywords.length >=3 ){   
                notify("키워드는 3개까지 입력할 수 있습니다.", {type: 'error'});
                setKeywords("");
            } else if (keywords === ''){
                notify("키워드를 입력해주세요", {type: 'info'})
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
        if (customeField.length > 100){
            notify("연구분야는 100글자 이하로 입력해주세요.")
        }
        // const fieldRegex = /^[A-Za-z0-9가-힣 ,]{1,100}/;
        // if (!fieldRegex.test(customeField)) {
        //     notify("연구분야는 영어, 한글만 가능합니다")
        // }
        setCustomeField(event.target.value);
    }


    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const payload = {
            username: sessionStorage.getItem('username'),
            studyField: customeField === '' ? researchField : customeField,
            keywords: enteredKeywords
        }
        const customeFieldRegexp = /^[A-Za-z0-9가-힣 ,_&-]{1,100}$/
        if (payload.studyField === customeField && !customeFieldRegexp.test(customeField)) {
            notify('연구 분야는 영어, 숫자, 한글만 입력할 수 있습니다.')
            return
        }
        
        fetch(`${api}/api/userprofile`, {
            method: 'POST',
            headers: { 'Content-Type' : 'application/json' ,
        'Gauth': getCookie('access')},
            body: JSON.stringify(payload)
        })
        .then(response => {
            if (!payload.keywords || payload.keywords.length === 0) {
                notify("키워드가 입력되지 않았습니다. 키워드 입력 후 엔터를 눌러 주세요.", {type: 'error'})
                throw new Error('유저 프로필 등록에 실패했습니다.');
            }
            if (response.ok) {
                if (!payload.keywords || payload.keywords.length === 0) {
                    notify("키워드가 입력되지 않았습니다. 키워드 입력 후 엔터를 눌러 주세요.", {type: 'error'})
                    throw new Error('유저 프로필 등록에 실패했습니다.');
                }
            } else {
                throw new Error('유저 프로필 등록에 실패했습니다.');
            }
        })
        .then(() => {
            localStorage.setItem('isFirst', 'false')
            navigate('/home');
        })
        .catch(error => {
            console.error('유저 프로필 에러:', error)
            Sentry.captureException(error)
        })
        // console.log('연구분야: ', researchField);
        // console.log('키워드: ', keywords);
        if (process.env.NODE_ENV === 'production') {
            
        }
        amplitude.track("유저 프로필 제출 Clicked");
        localStorage.setItem("userprofile", "exists");
    };
    
    const margin_value = '30px'

    // console.log(fields)

    return (
        <>
            <MetaTag title="유저 프로필" description="유저 프로필에서 연구분야와 키워드를 등록할 수 있습니다." keywords="프로필, 유저프로필, 연구분야, 키워드"/>
            <Card sx={{ height: '80vh', maxWidth: 500, margin: '30px auto', padding: '3rem', backgroundColor: color.mainGrey, borderRadius: '20px' , border: `1px solid ${color.mainGrey}`}}>
                <Title title="Register"/>
            {/* <Typography variant="h4" sx={{ marginBottom: '1rem' }}>Profile</Typography> */}
            <form onSubmit={handleSubmit} >
                <Box sx={{ height: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                    <Box>
                        <Typography variant='h4' sx={{marginBottom: '20px', textAlign:'center' }}>
                            Register
                        </Typography>
                        <Box sx={{ height: '20vh'}}>
                            <Typography variant="h6" sx={{ marginBottom: '0.5rem' }}>
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
                        </Box>
                        <Box>
                        <Typography variant="h6" sx={{ marginBottom: '0.5rem' }}>
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
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button type="submit" variant="outlined">
                        Submit
                        </Button>
                    </Box>
                </Box>
            </form>
            </Card>
        </>
    );
};
