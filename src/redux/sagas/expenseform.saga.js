import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';




function* replaceExpenseGrid ( action ) {
    console.log (`in REPLACE_EXPENSEGRID`);
  try { 
      console.log ('Add replaceExpenseGrid Payload:', action.payload)
      yield axios.post('/api/expense/replacegrid', action.payload)

      yield
        try {
            // get data from db
            const response = yield axios.get('/api/budget/expensefill/', {
                params:{
                    budgetId: action.payload.budgetId 
                }
            })
            yield put({ type: 'SET_EXPENSEFILL', payload: response.data });
        } catch ( error ) {
            console.log('error with expensefill3 get request', error);
        }

  } catch (error) {
      console.log('error with PUTTING BudgetForm', error);
  }
}

function* addRowExpenseGrid ( action ) {
    console.log('addRowExpenseGrid via PUT expenseForm', action.payload);
    try { 
        yield axios.post('/api/expense/addrow', action.payload)
        yield put({ type: 'FETCH_BUDGETFORM', recordFinder: {
            businessUnitId: action.payload.businessUnitId,
            relitiveRecordId: action.payload.relitiveRecordId
            }
         }) 
    } catch (error) {
        console.log('error with Deleting via PUT BudgetForm', error);
    }
  }

  function* deleteAllRows ( action ) {
    console.log('deleteAllRows via PUT expenseForm', action.payload);
    try { 
        yield axios.put('/api/expense/deleterows', action.payload)
        yield put({ type: 'FETCH_BUDGETFORM', recordFinder: {
            businessUnitId: action.payload.businessUnitId,
            relitiveRecordId: action.payload.relitiveRecordId
            }
         }) 
    } catch (error) {
        console.log('error with Deleting via PUT BudgetForm', error);
    }
  }
  
  
function* expenseformSaga() {
  yield takeLatest('REPLACE_EXPENSEGRID', replaceExpenseGrid);
  yield takeLatest('ADD_ROW_EXPENSEGRID', addRowExpenseGrid);
  yield takeLatest('DELETE_ALL_ROWS', deleteAllRows);
  
}

export default expenseformSaga;
