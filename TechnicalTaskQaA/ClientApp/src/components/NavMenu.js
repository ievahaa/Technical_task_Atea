import React, { Component } from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';

export const NavMenu = () => {

    return (
      <header>
        <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" light>
          <Container>
            <NavbarBrand tag={Link} to="/">Q&A</NavbarBrand>
              <ul className="navbar-nav flex-grow">
                <NavItem>
                  <NavLink tag={Link} className="text-dark" to="/">Home</NavLink>
                </NavItem>
                {/*<NavItem>*/}
                {/*  <NavLink tag={Link} className="text-dark" to="/counter">Counter</NavLink>*/}
                {/*</NavItem>*/}
                {/*<NavItem>*/}
                {/*  <NavLink tag={Link} className="text-dark" to="/fetch-data">Fetch data</NavLink>*/}
                {/*</NavItem>*/}
              </ul>
          </Container>
        </Navbar>
      </header>
    );
}
