import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

// update the main budget form
function* updateBudgetForm( action ) {
  console.log('PUT update Budgetform', action.payload);
  try { 
      yield axios.put('/api/budget/formfill', action.payload)
      yield put({ type: 'FETCH_BUDGETFORM', recordFinder: {
          businessUnitId: action.payload.businessUnitId,
          relitiveRecordId: action.payload.relitiveRecordId
          }
       }) 
  } catch (error) {
      console.log('error with PUTTING BudgetForm', error);
  }
}

// Grab data and populate the main budget form, to include the sub form (expenditures) data
function* fetchBudgetForm( payload ) {
  let currentRecordId = 1;  //default to department 1 to ,minimize init errors
  let countNumber = 1;  //for total number of records
  let sumNumber = 0;  // sum of expenses for specific budgetID
  console.log (`fetchBudgetForm Payload:`, payload);
  console.log (`fetchBudgetForm Payload RecordFinder:`, payload.recordFinder);
  // Move GET request from App.js
  // Go to server, update redux store with data from server
  try {
    // get data from db
    const response = yield axios.get('/api/budget/formfill', {
        params:{
            businessUnitId: payload.recordFinder.businessUnitId,
            relitiveRecordId: payload.recordFinder.relitiveRecordId,
        }
    })
    yield put({ type: 'SET_BUDGETFORMFILL', payload: response.data });
    yield console.log ('After yield responsedata:', response.data);
    yield currentRecordId = response.data[0].id
    yield
        try {
            // get data from db
            const response = yield axios.get('/api/budget/formcount', {
                params:{
                    businessUnitId: payload.recordFinder.businessUnitId,
                }
            })
            yield countNumber = response.data[0].count
            yield console.log (`count =`, countNumber);
            
            yield put({ type: 'SET_BUDGETFORMCOUNT', payload: countNumber });
        } catch ( error ) {
            console.log('error with fetchBudgetRecordCount get request', error);
        }
    yield 
        try {
            // get data from db
            const response = yield axios.get('/api/budget/expensesum', {
                params:{
                    budgetId: currentRecordId,
                }
            })
            yield sumNumber = response.data[0].sum || 0
            yield console.log (`expense sum =`, sumNumber);
            
            yield put({ type: 'SET_EXPENSESUM', payload: sumNumber });
        } catch ( error ) {
            console.log('error with expensesum get request', error);
        }
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
      console.log('error with fetchBudgetForm1 GET', error, 'payload:', payload.recordFinder);
  }
} 

// Grab SUM of expenses for BudgetId on form
function* fetchExpeenseSum ( payload ) {
    let countNumber = 1;
    let currentRecordId = 1;  //default to department 1 to ,minimize init errors
    console.log (`fetchBudgetRecordCount Payload:`, payload);
    // Go to server, update redux store with data from server
    try {
        // get data from db
        const response = yield axios.get('/api/budget/expensesum', {
            params:{
                businessUnitId: payload.recordFinder.businessUnitId,
            }
        })
        yield countNumber = response.data[0].count
        yield console.log (`expense sum =`, countNumber);
        
        yield put({ type: 'SET_EXPENSESUM', payload: countNumber });
    } catch ( error ) {
        console.log('error with expensesum get request', error);
    }
  } 


// Grab number of records in current form grab for business unit - used to set max navigation
function* fetchBudgetRecordCount( payload ) {
  let countNumber = 1;
  let currentRecordId = 1;  //default to department 1 to ,minimize init errors
  console.log (`fetchBudgetRecordCount GET Payload:`, payload);
  // Go to server, update redux store with data from server
  try {
      // get data from db
      const response = yield axios.get('/api/budget/formcount', {
          params:{
              businessUnitId: payload.recordFinder.businessUnitId,
          }
      })
      yield countNumber = response.data[0].count
      yield console.log (`count =`, countNumber);
      
      yield put({ type: 'SET_BUDGETFORMCOUNT', payload: countNumber });
  } catch ( error ) {
      console.log('error with fetchBudgetRecordCount get request', error);
  }
} 

function* deleteBudgetForm ( action ) {
  console.log('Delete via PUT Budgetform', action.payload);
  try { 
      yield axios.put('/api/budget/deleteform', action.payload)
      yield put({ type: 'FETCH_BUDGETFORM', recordFinder: {
          businessUnitId: action.payload.businessUnitId,
          relitiveRecordId: parseInt(action.payload.relitiveRecordId) - 1
          }
       }) 
  } catch (error) {
      console.log('error with Deleting via PUT BudgetForm', error);
  }
}

function* addNewBudgetForm ( action ) {
  console.log('POST update Budgetform', action.payload);
  try { 
      console.log ('Add POST Payload:', action.payload)
      yield axios.post('/api/budget/addform', action.payload)

      yield put({ type: 'FETCH_BUDGETFORM', recordFinder: {
          businessUnitId: action.payload.businessUnitId,
          relitiveRecordId: action.payload.relitiveRecordId
          }
       }) 
  } catch (error) {
      console.log('error with PUTTING BudgetForm', error);
  }
}



function* budgetformSaga() {
  yield takeLatest ('FETCH_BUDGETFORM', fetchBudgetForm);
  yield takeLatest('UPDATE_BUDGETFORM', updateBudgetForm);
  yield takeLatest('DELETE_BUDGETFORM', deleteBudgetForm);
  yield takeLatest('ADD_NEW_BUDGETFORM', addNewBudgetForm);
  yield takeLatest('FETCH_BUDGET_RECORD_COUNT', fetchBudgetRecordCount);
}

export default budgetformSaga;
