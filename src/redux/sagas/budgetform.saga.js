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
            recordId: payload.recordFinder.recordId,
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
function* fetchExpenseSum ( payload ) {
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

// Grab Relitive row number for specific record ID (good for one form)
function* fetchRecordCorrelation ( payload ) {
    let rowNumber = 1;
    let returnedRecordID = 0;
    console.log (`fetchRecordCorrelation GET Payload:`, payload);
    // Go to server, update redux store with data from server
    try {
        // get data from db
        const response = yield axios.get('/api/budget/recordcorrelation', {
            params:{
                recordId: payload.recordFinder.recordId,
            }
        })
        yield rowNumber = response.data[0].row_number
        yield returnedRecordID = response.data[0].id
        yield console.log (`rowNumber =`, rowNumber, 'returned Record ID', returnedRecordID);
        
        yield put({ type: 'SET_RECORDCORRELATIONROW', payload: rowNumber });
    } catch ( error ) {
        console.log('error with fetchRecordCorrelation get request', error);
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
  yield takeLatest('FETCH_RECORD_CORRELATION_ROW', fetchRecordCorrelation);
}

export default budgetformSaga;
