import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { getError } from '../utils.js';

import { Votes } from '../Votes';
import baseUrl from '../baseUrl.js';
import LoadingBox from '../components/LoadingBox';

export default function SigninScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);

  const { state, dispatch: ctxDispatch } = useContext(Votes);
  const { userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { data } = await axios.post(
        `${baseUrl}/counter_api/v1/auth/signIn`,
        {
          username: username,
          password,
        }
      );

      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate(redirect || '/');

      setLoading(false);
    } catch (err) {
      setLoading(false);

      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <Container className="small-container">
      <Helmet>
        <title>Iniciar sesi&oacute;n</title>
      </Helmet>
      <h1 className="my-3">Iniciar sesi&oacute;n</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Usuario</Form.Label>
          <Form.Control
            required
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Contrase&ntilde;a</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <div className="mb-3">
          <Button type="submit" style={{ backgroundColor: '#1948BA' }}>
            Iniciar sesi&oacute;n
          </Button>
          {loading && <LoadingBox></LoadingBox>}
        </div>
      </Form>
    </Container>
  );
}
