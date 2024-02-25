import React from 'react';
import './Home.css';

export const Home = ({isUser }) => {

    return (
      <div className="home-div">
            <h1>Questions and Answers App</h1>
            <h4>My name is Karīna Elizabete Valtere</h4>
            <p>This is my technical task for position "SharePoint developer" in Atea :)</p>
            <p>I have created a simple Questions and Answers web page uing ASP.NET Core and ReactJS</p>
            {!isUser && (
                <p>To get access questions please go Sign up, then Sign in and enjoy the app :)</p>
            ) }
      </div>
    );
}
