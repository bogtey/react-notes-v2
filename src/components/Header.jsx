import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthContext } from '../contexts/AuthContext'; 

const Header = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
      <Container>
        <Navbar.Brand href="/">Notes</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/students">Список студентов</Nav.Link>
            <Nav.Link as={Link} to="/poll">Добавить студента</Nav.Link>
            <Nav.Link as={Link} to="/polls">Изменить список студентов</Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            {user ? (
              <>
                <Navbar.Text className="me-2">
                  Привет, {user.name ?? 'Пользователь'}!
                </Navbar.Text>
                <Button variant="outline-light" onClick={logout}>
                  Выйти
                </Button>
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
