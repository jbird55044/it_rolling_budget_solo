import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

// update the main budget form
function* updateBudgetForm( action ) {
  console.log('PUT update Budgetform', action.payload);
  try { 
      yield axios.put('/api/budget/formfill', action.payload)
      yield put({ type: 'FETCH_BUDGETFORM' }) 
  } catch (error) {
      console.log('error with PUTTING BudgetForm', error);
  }
}

// Grab data and populate the main budget form, to include the sub form (expenditures) data
function* fetchBudgetForm( payload ) {
  let currentRecordId = 1;  //default to department 1 to ,minimize init errors
  console.log (`fetchBudgetForm Payload:`, payload.recordFinder);
  // Move GET request from App.js
  // Go to server, update redux store with data from server
  try {
      // get data from db
      const response = yield axios.get('/api/budget/formfill', {
          params:{
              businessUnitId: payload.recordFinder.businessUnitId,
              recordId: payload.recordFinder.recordId,
          }
      })
      yield put({ type: 'SET_BUDGETFORMFILL', payload: response.data });
      yield console.log ('after yield', response.data[0].id);
      yield currentRecordId = response.data[0].id
      yield 
          try {
              // get data from db
              const response = yield axios.get('/api/budget/expensefill/', {
                  params:{
                      budgetId: currentRecordId
                  }
              })
              yield put({ type: 'SET_EXPENSEFILL', payload: response.data });
          } catch ( error ) {
              console.log('error with fetchBudgetForm2 get request', error);
          }
  } catch ( error ) {
      console.log('error with fetchBudgetForm1 get request', error);
  }
} 

function* budgetSaga() {
  yield takeLatest ('FETCH_BUDGETFORM', fetchBudgetForm);
  yield takeLatest('UPDATE_BUDGETFORM', updateBudgetForm);
}

export default budgetSaga;
