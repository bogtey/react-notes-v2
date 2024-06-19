// components/Header.js
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { AuthContext } from '../contexts/AuthContext';

const Header = () => {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(navigate);
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
      <Container>
        <Navbar.Brand as={Link} to="/">Notes</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {token && (
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/students">Мой список</Nav.Link>
              {/* <Nav.Link as={Link} to="/poll">Добавить студента</Nav.Link>
              <Nav.Link as={Link} to="/polls">Изменить список студентов</Nav.Link> */}
              <Nav.Link as={Link} to="/student-feed">Лента студентов</Nav.Link>
            </Nav>
          )}
          <Nav className="ms-auto">
            {token ? (
              <>
              <Link to="/login" className="me-2">
                <Button variant="outline-light" onClick={handleLogout}>
                  Выйти
                </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="me-2">
                  <Button variant="outline-light">Войти</Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline-light">Регистрация</Button>
                </Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
