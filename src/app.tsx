import { Admin, Resource, ListGuesser, EditGuesser, ShowGuesser, CustomRoutes, useAuthenticated, useAuthState } from 'react-admin';
import { dataProvider } from './dataProvider';
import { authProvider } from './authProvider';
import React, { useEffect } from 'react';
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { Home } from './page/home';
import { PaperStorage } from './page/paperStorage';
import { History } from './page/history';
import { MyLayout } from './layout/myLayout';
import { UserProfile } from './page/userProfile';
import { useNavigate } from 'react-router-dom';
import * as amplitude from '@amplitude/analytics-browser';
import { PaperView } from './page/paperView';
import { DarkTheme, MyTheme } from './layout/myTheme';
import { Trash } from './page/trash';
import { HistoryPaper } from './page/historyPaper';
import RouteChangeTracker from './routeChangeTracker';
import { Helmet } from 'react-helmet-async';
import MetaTag from './SEOMetaTag'
import { Landing } from './page/landing'
import { Login } from './page/login';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { CookiesProvider } from 'react-cookie'
import { PersonalInfo } from './page/personalInfo';
import {
    QueryClient,
    QueryClientProvider,
  } from 'react-query'
import { useDispatch } from "react-redux";
import { SET_API } from './reducer';
import PdfViewer from './component/pdfViewer/pdfViewer';
import Workspaces from './page/workspaces';
import Reader from './page/reader';
import StudyWithAI from './page/studyWithAI';
import Export from './page/export';
import Library from './page/library';

// react-query client 설정
const queryClient = new QueryClient()

// import 시 파일 대소문자확인
// 파일 이름 컨벤션 정의
export const App = () => {
    if (process.env.NODE_ENV === 'production'){
        RouteChangeTracker()
    }

    let api = ''; //var은 웬만해선x
    let amplitudeID = ''
    let clientId = '';
    if (process.env.NODE_ENV === 'development'){
      api = `${import.meta.env.VITE_REACT_APP_LOCAL_SERVER}`
      amplitudeID = `${import.meta.env.VITE_AMPLITUDE_ID}`
      clientId = `${import.meta.env.VITE_GOOGLE_CLIENT_ID}`
    }
    else if (process.env.NODE_ENV === 'production'){
      api = `${process.env.VITE_REACT_APP_AWS_SERVER}`
      amplitudeID = `${process.env.VITE_AMPLITUDE_ID}`
      clientId = `${process.env.VITE_GOOGLE_CLIENT_ID}`
    }

    amplitude.init(amplitudeID, {
        defaultTracking: {
            pageViews: false,
            formInteractions: false,
        }
    });

    const dispatch = useDispatch()

    useEffect(()=>{
        dispatch({
            type: SET_API,
            data: api
        })
    }, [])
    
    return (
        <QueryClientProvider client={queryClient}>
            <GoogleOAuthProvider clientId={clientId}>
                {/* <Helmet>
                    <title>연두</title>
                </Helmet> */}
                <CookiesProvider>
                    <MetaTag title="Yeondoo" description="연두는 논문을 작성하는 데 어려움을 느끼는 사람들을 위해 대화형 검색, 질의 서비스를 제공합니다." keywords="논문, AI, 인공지능, 머신러닝, 검색, 질의, gpt, 논문 내 질의"/>
                    
                    <Admin
                        authProvider={authProvider} layout={MyLayout} theme={MyTheme} loginPage={Login}
                    >
                        
                        {/* <Resource name="users" list={ListGuesser}></Resource> */}
                        {/* <Route path="/home" element={< Home />}/> */}
                        <CustomRoutes noLayout>
                            <Route path="/" element={< Landing />} />
                            <Route path='/personalinfo' element={< PersonalInfo />} />
                        </CustomRoutes>
                        <CustomRoutes>
                            {/* <Route path="/" element={<Navigate to="/home" replace />} /> */}
                            
                            <Route path="/dashboard" element={< Home />}/>
                            <Route path="/paperstorage" element={< PaperStorage/>}/>
                            <Route path="/history" element={< HistoryPaper />}/>
                            {/* <Route path="/userprofile" element={< UserProfile />}/> */}
                            {/* <Route path="/paper" element={< PaperView />}/> */}
                            <Route path="/trash" element={< Trash />} />
                            {/* <Route path="/pdfviewer" element={< PdfViewer />} /> */}
                            <Route path='/home' element={<Workspaces/>} />
                            <Route path="/selectpaper" element={<StudyWithAI/>} />
                            <Route path="/paper" element={<Reader/>} />

                            {/* <Route path="/export" element={<Export/>} /> */}
                            <Route path="/library" element={<Library/>} />

                        </CustomRoutes>
                    </Admin>
                </CookiesProvider>
            </GoogleOAuthProvider>
        </QueryClientProvider>
        
)};
    