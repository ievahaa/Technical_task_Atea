import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { Home } from './components/Home';
import { NavMenu } from './components/NavMenu';
//import { FetchData } from './components/FetchData';
//import { Counter } from './components/Counter';

import './custom.css'

export const App = () => {

    return (
        <BrowserRouter>
            <NavMenu />
            <Route exact path='/' component={Home} />
            {/*<Route path='/counter' component={Counter} />*/}
            {/*<Route path='/fetch-data' component={FetchData} />*/}
        </BrowserRouter>
    );
}
