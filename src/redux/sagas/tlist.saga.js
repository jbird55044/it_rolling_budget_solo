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

function* fetchTlistCostCenter( payload ) {
  // Move GET request from App.js
  console.log('In fetchTlistCostCenter saga');
  
  // Go to server, update redux store with data from server
  try {
      // get data from db
      const response = yield axios.get('/api/tlist/costcenter', {
        params:{
            businessUnitId: payload.recordFinder.businessUnitId,
        }
    })
      // put data into store via Reducer
      yield put({ type: 'SET_TLIST_COSTCENTER', payload: response.data });
  } catch ( error ) {
      console.log('error with fetchTlistCostCenter get request', error);
  }
} 

function* fetchTlistPointPerson( payload ) {
  // Move GET request from App.js
  console.log('In fetchTlistPointPerson saga');
  
  // Go to server, update redux store with data from server
  try {
      // get data from db
      const response = yield axios.get('/api/tlist/pointperson', {
        params:{
            businessUnitId: payload.recordFinder.businessUnitId,
        }
    })
      // put data into store via Reducer
      yield put({ type: 'SET_TLIST_POINTPERSON', payload: response.data });
  } catch ( error ) {
      console.log('error with fetchTlistPointPerson get request', error);
  }
} 

function* fetchTlistCapitalizedLife() {
  // Move GET request from App.js
  console.log('In fetchTlistCapitalizedLife saga');
  // Go to server, update redux store with data from server
  try {
      // get data from db
      const response = yield axios.get('/api/tlist/capitalizedlife');
      // put data into store via Reducer
      yield put({ type: 'SET_TLIST_CAPITALIZEDLIFE', payload: response.data });
  } catch ( error ) {
      console.log('error with fetchTlistCapitalizedLife get request', error);
  }
} 

function* fetchTlistExpenditureType( payload ) {
  // Move GET request from App.js
  console.log('In fetchTlistExpenditureType saga');
  
  // Go to server, update redux store with data from server
  try {
      // get data from db
      const response = yield axios.get('/api/tlist/expendituretype', {
        params:{
            businessUnitId: payload.recordFinder.businessUnitId,
        }
    })
      // put data into store via Reducer
      yield put({ type: 'SET_TLIST_EXPENDITURETYPE', payload: response.data });
  } catch ( error ) {
      console.log('error with fetchTlistExpenditureType get request', error);
  }
} 


function* fetchTlistYear() {
  // Move GET request from App.js
  console.log('In fetchTlistYear saga');
  // Go to server, update redux store with data from server
  try {
      // get data from db
      const response = yield axios.get('/api/tlist/year');
      // put data into store via Reducer
      yield put({ type: 'SET_TLIST_YEAR', payload: response.data });
  } catch ( error ) {
      console.log('error with fetchTlistYear get request', error);
  }
} 


function* loginSaga() {
  yield takeLatest('FETCH_TLIST_SELECTORS', fetchTlistSelectors);
  yield takeLatest('FETCH_TLIST_BUSINESSUNIT', fetchTlistBusinessUnit);
  yield takeLatest('FETCH_TLIST_GLCODE', fetchTlistGlcode);
  yield takeLatest('FETCH_TLIST_FREQUENCY', fetchTlistFrequency);
  yield takeLatest('FETCH_TLIST_COSTCENTER', fetchTlistCostCenter);
  yield takeLatest('FETCH_TLIST_POINTPERSON', fetchTlistPointPerson);
  yield takeLatest('FETCH_TLIST_CAPITALIZEDLIFE', fetchTlistCapitalizedLife);
  yield takeLatest('FETCH_TLIST_EXPENDITURETYPE', fetchTlistExpenditureType);
  yield takeLatest('FETCH_TLIST_YEAR', fetchTlistYear);
}

export default loginSaga;
