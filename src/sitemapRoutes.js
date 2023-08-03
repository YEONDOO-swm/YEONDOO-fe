
import React from 'react';
import { Switch, Route } from 'react-router';
 
export default (
    <Switch>
        <Route path='/' />
        <Route path='/home' />
        <Route path='/userprofile' />
        <Route path='/paperstorage' />
        <Route path='/history' />
        <Route path='/history/paper' />
        <Route path='/history/trash' />
        <Route path='/paperview' />
        <Route /> 
    </Switch>
);