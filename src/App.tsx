
import { Admin, Resource, ListGuesser, EditGuesser, ShowGuesser, CustomRoutes } from 'react-admin';
import { dataProvider } from './dataProvider';
import { authProvider } from './authProvider';

import { Route } from "react-router-dom";
import { Home } from './home';
import { PaperStorage } from './paperStorage';
import { History } from './history';
import { MyLayout } from '../layout/MyLayout';

// import 시 파일 대소문자확인
// 파일 이름 컨벤션 정의
export const App = () => { 
    return (
    <Admin
        layout={MyLayout} dataProvider={dataProvider} authProvider={authProvider}
	>
        <Resource name="users" list={ListGuesser}></Resource>
        {/* <Route path="/home" element={< Home />}/> */}
        <CustomRoutes>
            <Route path="/home" element={< Home />}/>
            <Route path="/paperstorage" element={< PaperStorage/>}/>
            <Route path="/history" element={< History />}/>
        </CustomRoutes>
    </Admin>
)};

    