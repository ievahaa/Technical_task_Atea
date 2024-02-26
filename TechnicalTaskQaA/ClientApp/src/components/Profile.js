import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import './Profile.css';

export const Profile = ({ isUser}) => {

    const [name, setName] = useState('');
    const [nickname, setNickname] = useState('');
    const [existingName, setExistingName] = useState('');
    const [existingNickname, setExistingNickname] = useState('');
    const [passwordHash, setPasswordHash] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const history = useHistory();

    const [show1, setShow1] = useState(false);
    const [show2, setShow2] = useState(false);

    const handleClose1 = () => setShow1(false);
    const handleShow1 = () => setShow1(true);

    const handleClose2 = () => {
        setShow2(false);
        setConfirmPassword('');
        setPasswordHash('');
    }
    const handleShow2 = () => setShow2(true);

    const handleCancelEdit = () => {
        setName(existingName);
        setNickname(existingNickname);
        handleClose1();
    }

    const fetchUser = async () => {
        const response = await fetch("http://localhost:5000/api/profile", {
            headers: { "Content-Type": "application/json" },
            credentials: 'include',
        })

        if (response.ok) {
            const content = await response.json();
            setName(content.name);
            setNickname(content.nickname);
            setExistingName(content.name);
            setExistingNickname(content.nickname);
        }
    }

    useEffect(() => {
        fetchUser();
    }, []);

    const handleUpdateProfile = async () => {
        if (nickname !== existingNickname) {
            const response = await fetch("http://localhost:5000/api/get-user-list");
            if (!response.ok) {
                console.log("error");
            }

            const content = await response.json();
            for (let i = 0; i < content.length; i++) {
                if (nickname === content[i].nickname) {
                    alert("Nickname already in use, please use another nickname");
                    return;
                }
            }
        }

        try {
            const response = await fetch("http://localhost:5000/api/update-profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
                body: JSON.stringify({
                    name,
                    nickname,
                    oldNickname: existingNickname
                }),
            });

            if (response.ok) {
                setExistingName(name);
                setExistingNickname(nickname);
                handleClose1();
            } else {
                const errorData = await response.json();
                console.log("Error: ", errorData);
            }
        } catch (error) {
            console.error("Error: ", error);
        }
    }

    const handleUpdatePassword = async() => {
        if (passwordHash === confirmPassword) {
            try {
                const response = await fetch("http://localhost:5000/api/update-password", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    credentials: 'include',
                    body: JSON.stringify({
                        nickname,
                        passwordHash
                    }),
                });

                if (response.ok) {
                    handleClose2();
                    setConfirmPassword('');
                    setPasswordHash('');
                } else {
                    const errorData = await response.json();
                    console.log("Error: ", errorData);
                }
            } catch (error) {
                console.error("Error: ", error);
            }

        } else {
            alert("Passwords doesn't match");
        }
    }

    const handleDelete = async () => {
        if (window.confirm("Do you really want to delete your profile?") === true) {
            try {
                const response = await fetch("http://localhost:5000/api/delete-profile", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    credentials: 'include',
                    body: JSON.stringify({
                        nickname
                    }),
                });

                if (response.ok) {
                    window.location.href = "/sign-in"
                } else {
                    const errorData = await response.json();
                    console.log("Error: ", errorData);
                }
            } catch (error) {
                console.error("Error: ", error);
            }
        }
    }

    if (!isUser) {
        history.push('/');
    }

    return (
        <div className="profile-div">
            <h1>Profile</h1>

            <div className="form-group">
                <label htmlFor="name">Name: </label>
                <input
                    type="name"
                    className="form-control"
                    id="name"
                    name="name"
                    value={existingName}
                    disabled
                />
            </div>
            <div className="form-group">
                <label htmlFor="nickname">Nickname: </label>
                <input
                    type="text"
                    className="form-control"
                    id="nickname"
                    name="nickname"
                    value={existingNickname}
                    disabled
                />
            </div>
            <div>
                <button className="btn btn-primary" onClick={handleShow1}>Edit Profile</button> &nbsp;
                <button className="btn btn-danger" onClick={handleDelete}>Delete Profile</button>
            </div>
            <br />
            <div>
                <button className="btn btn-primary" onClick={handleShow2}>Change Password</button>
            </div>

            <Modal show={show1} onHide={handleClose1}>
                <Modal.Header>
                    <Modal.Title>Edit Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <label htmlFor="name">Name: </label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            value={name}
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
                            value={nickname}
                            onChange={e => setNickname(e.target.value)}
                            placeholder="JohnDoe123"
                            required
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-secondary" onClick={handleCancelEdit}>
                        Close
                    </button>
                    <button className="btn btn-primary" onClick={handleUpdateProfile}>
                        Save Changes
                    </button>
                </Modal.Footer>
            </Modal>

            <Modal show={show2} onHide={handleClose2}>
                <Modal.Header>
                    <Modal.Title>Change password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group">
                        <label htmlFor="password">New Password: </label>
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
                        <label htmlFor="confirmPassword">Confirm new password: </label>
                        <input
                            type="password"
                            className="form-control"
                            id="confirmPassword"
                            name="confirmPassword"
                            onChange={e => setConfirmPassword(e.target.value)}
                            placeholder="*******"
                            required
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-secondary" onClick={handleClose2}>
                        Close
                    </button>
                    <button className="btn btn-primary" onClick={handleUpdatePassword}>
                        Save Changes
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
