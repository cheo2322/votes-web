import React, { useEffect, useReducer, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';

import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox.js';
import baseUrl from '../baseUrl';
import { getError } from '../utils';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, candidates: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function HomeScreen() {
  const [{ loading, error, candidates }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(`${baseUrl}/counter_api/v1/candidate`);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(error),
        });
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Helmet>
        <title>Avanza Urcuquí 2023</title>
      </Helmet>

      <h1>Candidatos</h1>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>NOMBRE</th>
              <th>APELLIDO</th>
              <th>DIGNIDAD</th>
              <th>VOTOS TOTALES</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate) => (
              <tr key={candidate.id}>
                <td>{candidate.name}</td>
                <td>{candidate.lastName}</td>
                <td>{candidate.position}</td>
                <td>{candidate.totalVotes}</td>
                <td>
                  <Button
                    type="button"
                    variant="light"
                    onClick={() => {
                      navigate(`/order/${candidate._id}`);
                    }}
                  >
                    Detalles
                  </Button>
                  <Button
                    style={{ backgroundColor: '#1948BA', color: 'white' }}
                    type="button"
                    variant="light"
                    onClick={() => {
                      navigate(`/order/${candidate._id}`);
                    }}
                  >
                    Sumar votos
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default HomeScreen;
