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



function* expenseformSaga() {
  yield takeLatest('REPLACE_EXPENSEGRID', replaceExpenseGrid);
}

export default expenseformSaga;
