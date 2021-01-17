import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';


// Grab data and populate the main budget form, to include the sub form (expenditures) data
function* fetchBudgetReport( payload ) {
  let currentRecordId = 1;  //default to department 1 to ,minimize init errors
  console.log (`fetchBudgetReport Payload:`, payload);
  // Go to server, update redux store with data from server
  try {
      // get data from db
      const response = yield axios.get('/api/report/fulllist', {
          params:{
              businessUnitId: payload.recordFinder.businessUnitId,
          }
      })
      yield put({ type: 'SET_BUDGETREPORT', payload: response.data });
      yield console.log ('after yield', response.data[0].id);
      yield currentRecordId = response.data[0].id
    //   yield 
    //       try {
    //           // get data from db
    //           const response = yield axios.get('/api/budget/expensefill/', {
    //               params:{
    //                   budgetId: currentRecordId
    //               }
    //           })
    //           yield put({ type: 'SET_EXPENSEFILL', payload: response.data });
    //       } catch ( error ) {
    //           console.log('error with fetchBudgetCollection2 get request', error);
    //       }
  } catch ( error ) {
      console.log('error with fetchBudgetReport3 get request', error);
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


function* budgetcollectionSaga() {
  yield takeLatest ('FETCH_BUDGETREPORT', fetchBudgetReport);
  yield takeLatest ('FETCH_EXPENSEFILL', fetchExpenseFill);
}

export default budgetcollectionSaga;
