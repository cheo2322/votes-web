import React, { useEffect, useReducer } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
      return {
        ...state,
        byParishes: action.payload,
        byPrecincts: action.payload2,
        detailedVotes: action.payload3,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function VotesScreen() {
  const [
    { loading, error, byParishes, byPrecincts, detailedVotes },
    dispatch,
  ] = useReducer(reducer, {
    byParishes: [],
    byPrecincts: [],
    detailedVotes: [],
    loading: true,
    error: '',
  });

  const navigate = useNavigate();

  const params = useParams();
  const { id } = params;

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });

      try {
        const result = await axios.get(
          `${baseUrl}/counter_api/v1/candidate/${id}/votes/parish`
        );
        const result2 = await axios.get(
          `${baseUrl}/counter_api/v1/candidate/${id}/votes/precinct`
        );
        const result3 = await axios.get(
          `${baseUrl}/counter_api/v1/candidate/${id}/votes/desk`
        );

        dispatch({
          type: 'FETCH_SUCCESS',
          payload: result.data,
          payload2: result2.data,
          payload3: result3.data,
        });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    fetchData().catch(console.error);
  }, [id]);

  return (
    <div>
      <Helmet>
        <title>Detalles</title>
      </Helmet>

      <h3>Votos por provincia</h3>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div>
          {byParishes.map((item) => (
            <p>
              {item.name}: {item.value} votos
            </p>
          ))}
        </div>
      )}

      <br></br>

      <h3>Votos por recinto electoral</h3>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div>
          {byPrecincts.map((item) => (
            <p>
              {item.name}: {item.value} votos
            </p>
          ))}
        </div>
      )}

      <br></br>

      <h3>Votos por recinto electoral</h3>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div>
          {detailedVotes.map((item) => (
            <div>
              <b>Parroquia:</b> {item.parish}
              {item.votesByPrecinct.map((item2) => (
                <div>
                  <b>Recinto electoral:</b> {item2.precinct}
                  {item2.votesByDesk.map((item3) => (
                    <p>
                      {item3.deskType} {item3.desk}: {item3.amount}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default VotesScreen;
