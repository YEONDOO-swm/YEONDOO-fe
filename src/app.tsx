import { Admin, Resource, ListGuesser, EditGuesser, ShowGuesser, CustomRoutes, useAuthenticated, useAuthState } from 'react-admin';
import { dataProvider } from './dataProvider';
import { authProvider } from './authProvider';
import React from 'react';
import { Route, Navigate, BrowserRouter } from "react-router-dom";
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
import ChannelService from './channelTalk/channelService';
import ReactGA from "react-ga4"
import RouteChangeTracker from './routeChangeTracker';
import { Helmet } from 'react-helmet-async';
import MetaTag from './SEOMetaTag'

amplitude.init('fa2f5340585a6728ae2103fb05e56bec', {
    defaultTracking: {
        pageViews: false,
        formInteractions: false,
    }
});

// import 시 파일 대소문자확인
// 파일 이름 컨벤션 정의
export const App = () => {
    if (process.env.NODE_ENV === 'production'){
        RouteChangeTracker()
    }
    return (
        <>
            {/* <Helmet>
                <title>연두</title>
            </Helmet> */}
            <MetaTag title="연두" description="연두는 논문을 작성하는 데 어려움을 느끼는 사람들을 위해 대화형 검색, 질의 서비스를 제공합니다." keywords="논문, AI, 인공지능, 머신러닝, 검색, 질의, gpt, 논문 내 질의"/>
            <Admin
                authProvider={authProvider} layout={MyLayout} theme={MyTheme}
            >
                
                {/* <Resource name="users" list={ListGuesser}></Resource> */}
                {/* <Route path="/home" element={< Home />}/> */}
                <CustomRoutes>
                    {/* <Route path="/" element={<Navigate to="/home" replace />} /> */}
                    <Route path="/" element={< Home />} />
                    <Route path="/home" element={< Home />}/>
                    <Route path="/paperstorage" element={< PaperStorage/>}/>
                    <Route path="/history" element={< History />}/>
                    <Route path="/userprofile" element={< UserProfile />}/>
                    <Route path="/paper" element={< PaperView />}/>
                    <Route path="/historypaper" element={< HistoryPaper />} />
                    <Route path="/historytrash" element={< Trash />} />
                </CustomRoutes>
            </Admin>
        </>
        
)};
    