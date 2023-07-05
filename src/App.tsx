import { Admin, Resource, ListGuesser, EditGuesser, ShowGuesser, CustomRoutes } from 'react-admin';
import { dataProvider } from './dataProvider';
import { authProvider } from './authProvider';

import { Route } from "react-router-dom";
import { Home } from './home';
import { PaperStorage } from './paperStorage';
import { History } from './history';
import { MyLayout } from '../layout/MyLayout';
import { UserProfile } from './userProfile';
import { useNavigate } from 'react-router-dom';

export const App = () => (
    <Admin
        authProvider={authProvider} layout={MyLayout} dataProvider={dataProvider}
	>
        {/* <Resource name="users" list={ListGuesser}></Resource> */}
        {/* <Route path="/home" element={< Home />}/> */}
        <CustomRoutes>
            <Route path="/home" element={< Home />}/>
            <Route path="/paperstorage" element={< PaperStorage/>}/>
            <Route path="/history" element={< History />}/>
            <Route path="/userprofile" element={< UserProfile />}/>
        </CustomRoutes>
    </Admin>
);

    