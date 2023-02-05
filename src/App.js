import './App.css';

import React, { useContext } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

import { Votes } from './Votes';
import SigninScreen from './screens/SigninScreen';
import HomeScreen from './screens/HomeScreen.js';
import VotesScreen from './screens/VotesScreen';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Votes);
  const { userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    window.location.href = '/signin';
  };

  return (
    <BrowserRouter>
      <div className="site-container d-flex flex-column">
        <header>
          <Navbar expand="lg" className="primary-bar">
            <Container>
              <LinkContainer to="/">
                <Navbar.Brand>
                  <img
                    style={{ height: '40px' }}
                    src="/images/artes/logo.png"
                    alt="logo"
                  />
                </Navbar.Brand>
              </LinkContainer>

              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav" className="w-50">
                <Nav className="me-auto w-100 justify-content-end">
                  {userInfo ? (
                    <NavDropdown
                      title={
                        <i
                          class="fa fa-user"
                          style={{ 'font-size': '25px' }}
                        ></i>
                      }
                      id="basic-nav-dropdown"
                    >
                      <NavDropdown.Divider />
                      <Link
                        className="dropdown-item"
                        to="#signout"
                        onClick={signoutHandler}
                      >
                        Cerrar sesi&oacute;n
                      </Link>
                    </NavDropdown>
                  ) : (
                    <Link className="nav-link" to="/signin">
                      <a style={{ color: 'white' }}>Iniciar sesi&oacute;n</a>
                    </Link>
                  )}

                  {userInfo && userInfo.isAdmin && (
                    <NavDropdown title="Admin" id="admin-nav-dropdown">
                      <LinkContainer to="/admin/dashboard">
                        <NavDropdown.Item>Dashboard</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/products">
                        <NavDropdown.Item>Productos</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/orders">
                        <NavDropdown.Item>&Oacute;rdenes</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/users">
                        <NavDropdown.Item>Usuarios</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>

        <main>
          <div className="mt-3">
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <HomeScreen />
                  </ProtectedRoute>
                }
              />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/votes/:id" element={<VotesScreen />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
