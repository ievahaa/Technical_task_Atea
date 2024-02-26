import React from 'react';
import { Container, Navbar, NavbarBrand, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';

export const NavMenu = ({ isUser, setIsUser }) => {

    const SingOut = async () => {
        await fetch("http://localhost:5000/api/sign-out", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: 'include',
        });
        setIsUser(false);
    }

    return (
        <header>
            <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" light>
                <Container>
                    <NavbarBrand tag={Link} to="/">Q&A</NavbarBrand>
                    {!isUser && (
                        <ul className="navbar-nav flex-grow">
                            <NavItem>
                                <NavLink tag={Link} className="text-dark" to="/sign-in">Sign In</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={Link} className="text-dark" to="/sign-up">Sign Up</NavLink>
                            </NavItem>
                        </ul>
                    )}
                    {isUser && (
                        <ul className="navbar-nav flex-grow">
                            <NavItem>
                                <NavLink tag={Link} className="text-dark" to="/questions">Questions</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={Link} className="text-dark" to="/profile">Profile</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={Link} className="text-dark" to="/" onClick={SingOut}>Log Out</NavLink>
                            </NavItem>
                        </ul>
                    )}
                </Container>
            </Navbar>
        </header>
    );
}
