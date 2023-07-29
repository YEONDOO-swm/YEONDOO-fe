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

amplitude.init('fa2f5340585a6728ae2103fb05e56bec', {
    defaultTracking: {
        pageViews: false
    }
});

// import 시 파일 대소문자확인
// 파일 이름 컨벤션 정의
export const App = () => { 
    return (
        <BrowserRouter>
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
                    <Route path="/history/paper" element={< HistoryPaper />} />
                    <Route path="/history/trash" element={< Trash />} />
                </CustomRoutes>
            </Admin>
        </BrowserRouter>
)};
    