import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { Home } from './components/Home';
import { NavMenu } from './components/NavMenu';
import { SignIn } from './components/SignIn';
import { SignUp } from './components/SignUp';
import { Profile } from './components/Profile';
import { Questions } from './components/Questions';

import './custom.css'

export const App = () => {

    const [isUser, setIsUser] = useState(false);
    const [userId, setUserId] = useState();

    const fetchUser = async () => {
        const response = await fetch("http://localhost:5000/api/profile", {
            headers: { "Content-Type": "application/json" },
            credentials: 'include',
        })

        const content = await response.json();
        if (parseInt(content.id) > 0) {
            setIsUser(true);
            setUserId(content.id);
        }
    }

    useEffect(async() => {
        await fetchUser();
        //(
        //    async () => {
        //        const response = await fetch("http://localhost:5000/api/profile", {
        //            headers: { "Content-Type": "application/json" },
        //            credentials: 'include',
        //        })

        //        const content = await response.json();
        //        if (parseInt(content.id) > 0) {
        //            setIsUser(true);
        //        }
        //    }
        //)();
    }, []);

    return (
        <BrowserRouter>
            <NavMenu isUser={isUser} setIsUser={setIsUser} setUserId={setUserId} />
            <Route exact path='/' component={() => <Home isUser={isUser} />} />
            <Route path='/sign-in' component={() => <SignIn isUser={isUser} setIsUser={setIsUser} />} />
            <Route path='/sign-up' component={() => <SignUp isUser={isUser} />} />
            <Route path='/questions' component={() => <Questions isUser={isUser} userId={userId} />} />
            <Route path='/profile' component={() => <Profile isUser={isUser} />} />
        </BrowserRouter>
    );
}
