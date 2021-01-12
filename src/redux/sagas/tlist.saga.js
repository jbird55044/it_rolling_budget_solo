import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* fetchTlistSelectors() {
  console.log (`in fetchTlistSelectors`);
} 


function* fetchTlistBusinessUnit() {
  // Move GET request from App.js
  console.log('In fetchTlistBusinessUnit saga');
  // Go to server, update redux store with data from server
  try {
      // get data from db
      const response = yield axios.get('/api/tlist/businessunit');
      // put data into store via Reducer
      yield put({ type: 'SET_TLIST_BUSINESSUNIT', payload: response.data });
  } catch ( error ) {
      console.log('error with fetchTlistBusinessUnit get request', error);
  }
} 

function* fetchTlistGlcode() {
  // Move GET request from App.js
  console.log('In fetchTlistGlcode saga');
  // Go to server, update redux store with data from server
  try {
      // get data from db
      const response = yield axios.get('/api/tlist/glcode');
      // put data into store via Reducer
      yield put({ type: 'SET_TLIST_GLCODE', payload: response.data });
  } catch ( error ) {
      console.log('error with fetchTlistGlcode get request', error);
  }
} 

function* fetchTlistFrequency() {
  // Move GET request from App.js
  console.log('In fetchTlistFrequency saga');
  // Go to server, update redux store with data from server
  try {
      // get data from db
      const response = yield axios.get('/api/tlist/frequency');
      // put data into store via Reducer
      yield put({ type: 'SET_TLIST_FREQUENCY', payload: response.data });
  } catch ( error ) {
      console.log('error with fetchTlistFrequency get request', error);
  }
} 

function* loginSaga() {
  yield takeLatest('FETCH_TLIST_SELECTORS', fetchTlistSelectors);
  yield takeLatest('FETCH_TLIST_BUSINESSUNIT', fetchTlistBusinessUnit);
  yield takeLatest('FETCH_TLIST_GLCODE', fetchTlistGlcode);
  yield takeLatest('FETCH_TLIST_FREQUENCY', fetchTlistFrequency);
}

export default loginSaga;
