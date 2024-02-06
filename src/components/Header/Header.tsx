import Container from "react-bootstrap/Container";
import { FC } from "react";
import { Link } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useDispatch, useSelector } from "react-redux";

import "./Header.scss";
import { logout, type AuthUser, type RootState } from "@/store";

const Header: FC = () => {
  const user: AuthUser | undefined = useSelector(
    (state: RootState) => state.auth.user
  );
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Navbar expand="md">
      <Container>
        <Link className="navbar-brand" to="/">
          Home
        </Link>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link className="nav-link" to="/tenants">
              Tenants
            </Link>
            <Link className="nav-link" to="/rooms">
              Rooms
            </Link>
            <Link className="nav-link" to="/transactions">
              Transactions
            </Link>
          </Nav>
          <Nav>
            {user ? (
              <>
                <Navbar.Text>
                  Logged in as <span className="username">{user.name}</span>
                </Navbar.Text>
                <Link className="nav-link" to="/account" onClick={handleLogout}>
                  Sign Out
                </Link>
              </>
            ) : (
              <Link className="nav-link" to="/account">
                Sign In
              </Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
