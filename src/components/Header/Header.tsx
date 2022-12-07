import Container from 'react-bootstrap/Container';
import { Link } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import React from 'react';

import './Header.scss';

class Header extends React.Component{
    
    constructor(props: any){
        super(props);
    }

    render() {
        return (
            <Navbar expand="md">
                <Container>
                    <Link className="navbar-brand" to="/">Home</Link>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Link className="nav-link" to="/tenants">Tenants</Link>
                            <Link className="nav-link" to="/rooms">Rooms</Link>
                            <Link className="nav-link" to="/transactions">Transactions</Link>
                        </Nav>
                        <Nav>
                            <Navbar.Text>
                                Logged in as <span className="username">Admin</span>.
                            </Navbar.Text>
                            <Link className="nav-link" to="/account">Logout</Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        );
    }
}

export default Header;