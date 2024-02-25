import Container from "react-bootstrap/Container";
import { FC, MouseEvent } from "react";
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

  const handleLogout = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    dispatch(logout());
  };

  const renderAdminNavLinks = () =>
    user?.role === "admin" ? (
      <>
        <Link className="nav-link" to="/tenants">
          Tenants
        </Link>
        <Link className="nav-link" to="/rooms">
          Rooms
        </Link>
        <Link className="nav-link" to="/transactions">
          Transactions
        </Link>
      </>
    ) : null;

  const renderLogoutNav = () =>
    user && (
      <>
        <Navbar.Text>
          Logged in as <span className="username">{user.email}</span>
        </Navbar.Text>
        <a className="nav-link" onClick={handleLogout}>
          Sign Out
        </a>
      </>
    );

  return (
    <Navbar expand="md">
      <Container>
        <Link className="navbar-brand" to="/">
          Rent Portal
        </Link>
        {renderAdminNavLinks()}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav>{renderLogoutNav()}</Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
