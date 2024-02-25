import React from 'react';
import { useHistory } from 'react-router-dom';
import './Home.css';

export const Questions = ({isUser }) => {

    const history = useHistory();

    if (!isUser) {
        history.push('/');
    }

    return (
        <div className="home-div">
            <h1>Questions</h1>
        </div>
    );
}
