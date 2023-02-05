import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

import { Votes } from '../Votes';
import { getError } from '../utils';
import baseUrl from '../baseUrl';
import LoadingBox from '../components/LoadingBox';

const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };

    default:
      return state;
  }
};

const parishes = [
  { value: 'URCUQUI', label: 'Urcuquí' },
  { value: 'PABLO_ARENAS', label: 'Pablo Arenas' },
  { value: 'CAHUASQUI', label: 'Cahuasquí' },
  { value: 'LA_MERCED_DE_BUENOS_AIRES', label: 'Buenos Aires' },
  { value: 'SAN_BLAS', label: 'San Blas' },
  { value: 'TUMBABIRO', label: 'Tumbabiro' },
];

const precincts = [
  {
    value: 'UNIDAD_EDUCATIVA_BUENOS_AIRES',
    label: 'Unidad Educativa Buenos Aires',
  },
  {
    value: 'ESCUELA_FRANKLIN_ROOSEVELT',
    label: 'Escuela de Educación Basica Franklin Roosevelt',
  },
  {
    value: 'ESCUELA_PALMIRA_TOCTEMI',
    label: 'Escuela y Casa Comunal San Francisco Palmira de Toctemi - Awa',
  },
  { value: 'UNIDAD_EDUCATIVA_CAHUASQUI', label: 'Unidad Educativa Cahuasqui' },
  {
    value: 'UNIDAD_EDUCATIVA_YACHAY',
    label: 'Unidad Educativa del Milenio Yachay / Ex Escuela Abdon Calderon',
  },
  {
    value: 'UNIDAD_EDUCATIVA_ELOY_ALFARO',
    label: 'Unidad Educativa Eloy Alfaro',
  },
  {
    value: 'UNIDAD_EDUCATIVA_PABLO_ARENAS',
    label:
      'Unidad Edcucativa Cahuasqui Bloque Pablo Arenas / Escuela 5 de Junio',
  },
  {
    value: 'UNIDAD_EDUCATIVA_ROCAFUERTE',
    label: 'Unidad Educativa Vicente Rocafuerte',
  },
  { value: 'ESCUELA_HERNAN_CORTEZ', label: 'Antigua Escuela Hernán Cortez' },
  { value: 'UNIDAD_EDUCATIVA_URCUQUI', label: 'Unidad Educativa Urcuquí' },
];

const deskTypes = ['FEMENINO', 'MASCULINO'];

export default function AddVotes() {
  const { state, dispatch: ctxDispatch } = useContext(Votes);
  const { userInfo } = state;

  const [parish, setParish] = useState('');
  const [precinct, setPrecinct] = useState('');
  const [desk, setDesk] = useState();
  const [deskType, setDeskType] = useState('');
  const [votes, setVotes] = useState('');
  const [selectedPrecincts, setSelectedPrecincts] = useState([]);
  const [selectedDesks, setSelectedDesks] = useState([]);

  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });

  const candidate = JSON.parse(localStorage.getItem('candidate'));

  const submitHandler = async (e) => {
    e.preventDefault();

    if (
      parish === '' ||
      precinct === '' ||
      deskType === '' ||
      desk === '' ||
      votes === ''
    ) {
      alert('Rellene todos los campos');
    } else {
      try {
        const patchBody = {
          votesAmount: votes,
          parish: parish,
          precinct: precinct,
          desk: desk,
          deskType: deskType,
        };

        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.accessToken}`,
          },
        };

        await axios.patch(
          `${baseUrl}/counter_api/v1/candidate/${candidate.id}/votes/add`,
          patchBody,
          config
        );

        dispatch({
          type: 'UPDATE_SUCCESS',
        });

        alert('Datos actualizados!');
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
        });
        alert(getError(err));
      }
    }
  };

  return (
    <div className="container small-container">
      <Helmet>
        <title>Agregar votos</title>
      </Helmet>
      <h1 className="my-3">Agregar votos</h1>

      <h5>
        {candidate.name} {candidate.lastName}
      </h5>
      <h5>{candidate.position}</h5>
      <h5>Votos totales: {candidate.totalVotes}</h5>

      <form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Dropdown
            options={parishes}
            onChange={(e) => setParish(e.value)}
            value={parish}
            placeholder="Selecciona una parroquia"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="name">
          <Dropdown
            options={precincts}
            onChange={(e) => setPrecinct(e.value)}
            value={precinct}
            placeholder="Seleccione un recinto electoral"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="name">
          <Dropdown
            options={deskTypes}
            onChange={(e) => setDeskType(e.value)}
            value={deskType}
            placeholder="Seleccione el tipo de mesa"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="name">
          <Form.Control
            value={desk}
            onChange={(e) => setDesk(e.target.value)}
            placeholder="Número de mesa (junta receptora del voto)"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="name">
          <Form.Control
            value={votes}
            onChange={(e) => setVotes(e.target.value)}
            placeholder="Número de votos"
            required
          />
        </Form.Group>

        <div className="mb-3">
          <Button
            style={{ backgroundColor: '#1948BA' }}
            disabled={loadingUpdate}
            type="submit"
          >
            Enviar
          </Button>
          {loadingUpdate && <LoadingBox></LoadingBox>}
        </div>
      </form>
    </div>
  );
}
