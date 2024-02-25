import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './SignInUp.css';

export const SignIn = ({ setIsUser }) => {

    const [nickname, setNickname] = useState('');
    const [passwordHash, setPasswordHash] = useState('');

    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:5000/api/sign-in", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
                body: JSON.stringify({
                    nickname,
                    passwordHash
                }),
            });

            if (response.ok) {
                setIsUser(true);
                history.push('/');
            } else {
                const errorData = await response.json();
                alert(errorData.message);
                console.log("Sign In error: ", errorData);
            }
        } catch (error) {
            console.error("Sign In error1: ", error.message);
        }
    };

    return (
        <div className="sign-div">
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <div className="form-group">
                        <label htmlFor="nickname">Nickname: </label>
                        <input
                            type="text"
                            className="form-control"
                            id="nickname"
                            name="nickname"
                            onChange={e => setNickname(e.target.value)}
                            placeholder="JohnDoe123"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password: </label>
                        <input
                            type="password"
                            className="form-control"
                            id="passwordHash"
                            name="passwordHash"
                            onChange={e => setPasswordHash(e.target.value)}
                            placeholder="*******"
                            required
                        />
                    </div>
                    <div>
                        <button type="submit" className="btn btn-primary">Sign In</button>
                    </div>
                </div>
            </form>
        </div>
    );
}
