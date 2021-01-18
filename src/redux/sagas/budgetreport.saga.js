import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';


// Grab data and populate table for report (includes JOIN to expenditures) 
function* fetchBudgetReport1( payload ) {
  let currentRecordId = 1;  //default to department 1 to ,minimize init errors
  console.log (`fetchBudgetReport1 Payload:`, payload);
  // Go to server, update redux store with data from server
  try {
      // get data from db
      const response = yield axios.get('/api/report/report1', {
          params:{
              businessUnitId: payload.recordFinder.businessUnitId,
              selectedYear: payload.recordFinder.selectedYear
          }
      })
      yield put({ type: 'SET_BUDGETREPORT1', payload: response.data });
      yield console.log ('after yield', response.data[0].id);
      yield currentRecordId = response.data[0].id
  } catch ( error ) {
      console.log('error with fetchBudgetReport1 get request', error);
  }
} 

// Grab data and populate table for report (includes JOIN to expenditures) 
function* fetchBudgetReport2( payload ) {
  let currentRecordId = 1;  //default to department 1 to ,minimize init errors
  console.log (`fetchBudgetReport2 Payload:`, payload);
  // Go to server, update redux store with data from server
  try {
      // get data from db
      const response = yield axios.get('/api/report/report2', {
          params:{
              businessUnitId: payload.recordFinder.businessUnitId,
              selectedYear: payload.recordFinder.selectedYear
          }
      })
      yield put({ type: 'SET_BUDGETREPORT2', payload: response.data });
      yield console.log ('after yield', response.data[0].id);
      yield currentRecordId = response.data[0].id
  } catch ( error ) {
      console.log('error with fetchBudgetReport2 get request', error);
  }
} 

function* fetchExpenseFill ( payload ) {
    let currentRecordId = 1;  //default to department 1 to ,minimize init errors
    console.log (`fetchExpenseFill Payload:`, payload);
    // Go to server, update redux store with data from server
    try {
        // get data from db
        const response = yield axios.get('/api/report/expensefill', {
            params:{
                recordId: payload.recordFinder.recordId,
            }
        })
        yield put({ type: 'SET_RECORD_EXPENSEFILL', payload: response.data });
        yield console.log ('after yield', response.data[0].id);
        yield currentRecordId = response.data[0].id
    } catch ( error ) {
        console.log('error with fetchBudgetCollection3 get request', error);
    }
  } 

  function* fetchSpelledOutYear ( payload ) {
    let currentRecordId = 1;  //default to department 1 to ,minimize init errors
    console.log (`fetchSpelledOutYear Payload:`, payload);
    // Go to server, update redux store with data from server
    try {
        // get data from db
        const response = yield axios.get('/api/report/spelledoutyear', {
            params:{
              selectedYear: payload.recordFinder.selectedYear,
            }
        })
        yield put({ type: 'SET_SPELLEDOUT_YEAR', payload: response.data });
    } catch ( error ) {
        console.log('error with fetchSpelledOutYear get request', error);
    }
  } 


function* budgetcollectionSaga() {
  yield takeLatest ('FETCH_BUDGETREPORT1', fetchBudgetReport1);
  yield takeLatest ('FETCH_BUDGETREPORT2', fetchBudgetReport2);
  yield takeLatest ('FETCH_EXPENSEFILL', fetchExpenseFill);
  yield takeLatest ('FETCH_SPELLEDOUT_YEAR', fetchSpelledOutYear);
}

export default budgetcollectionSaga;
