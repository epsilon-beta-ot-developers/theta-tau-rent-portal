import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import React from 'react';
import './Header.sass';

class Header extends React.Component{
    
    constructor(props: any){
        super(props);
    }

    render() {
        return (
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Brand href="/">React-Bootstrap</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link href="/tenants">Tenants</Nav.Link>
                        <Nav.Link href="/rooms">Rooms</Nav.Link>
                        <Nav.Link href="/invoices">Manage Invoices</Nav.Link>
                    </Nav>
                    <Nav>
                        <Navbar.Text>
                            Logged in as X.
                        </Navbar.Text>
                        <Nav.Link href="/logout">Logout</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        );
    }
}

export default Header;