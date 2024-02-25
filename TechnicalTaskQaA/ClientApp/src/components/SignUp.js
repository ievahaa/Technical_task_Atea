import React, { useState } from 'react';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './SignInUp.css';

export const SignUp = () => {

    const [name, setName] = useState('');
    const [nickname, setNickname] = useState('');
    const [passwordHash, setPasswordHash] = useState('');
    const [confirmPasswordHash, setConfirmPasswordHash] = useState('');

    const [users, setUsers] = useState([]);

    const history = useHistory();

    const fetchNicknames = async () => {
        const response = await fetch("http://localhost:5000/api/get-user-list");
        if (!response.ok) {
            console.log("error");
        }

        const content = await response.json();
        setUsers(content);
    }

    useEffect(() => {
        fetchNicknames();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (nickname.includes(' ')) {
            alert("Nickname cannot inclue spaces");
            return;
        }

        for (let i = 0; i < users.length; i++) {
            if (nickname === users[i].nickname) {
                alert("Nickname already in use, please use another nickname");
                return;
            }
        }

        if (passwordHash === confirmPasswordHash) {
            try {
                const response = await fetch("http://localhost:5000/api/sign-up", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name,
                        nickname,
                        passwordHash
                    }),
                });

                if (response.ok) {
                    alert("Registration successful");
                    history.push('/sign-in');
                } else {
                    const errorData = await response.json();
                    console.log("Registration error: ", errorData);
                }
            } catch (error) {
                console.error("Registration error: ", error);
            }
        }
        else {
            alert("Passwords doesn't match");
        }
    };

    return (
        <div className="sign-div">
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <div>
                        <label htmlFor="name">Name: </label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            onChange={e => setName(e.target.value)}
                            placeholder="John Doe"
                            required
                        />
                    </div>
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
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm password: </label>
                        <input
                            type="password"
                            className="form-control"
                            id="confirmPassword"
                            name="confirmPassword"
                            onChange={e => setConfirmPasswordHash(e.target.value)}
                            placeholder="*******"
                            required
                        />
                    </div>
                    <div>
                        <button type="submit" className="btn btn-primary">Sign Up</button>
                    </div>
                </div>
            </form>
        </div>
    );
}
