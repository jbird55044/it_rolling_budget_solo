import { combineReducers } from 'redux';

// Used to store specific budget returned from the server
const budgetFormFillList = (state = [], action) => {
  switch (action.type) {
      case 'SET_BUDGETFORMFILL':
          return action.payload;
      default:
          return state;
  }
}


// Used to store a specific budget's expense detail 
const expenseFillList = (state = [], action) => {
  switch (action.type) { 
      case 'SET_EXPENSEFILL':
          return action.payload;
      default:
          return state;
  }
}

// Used to store a specific sum of selected expenses from one budgetID
const expenseSum = (state = 0, action) => {
  switch (action.type) { 
      case 'SET_EXPENSESUM':
          return action.payload;
      default:
          return state;
  }
}

// Used to determine number of records for maximum scroll on form
const budgetFormCount = (state = 0, action) => {
  switch (action.type) {
      case 'SET_BUDGETFORMCOUNT':
          return action.payload;
      default:
          return state;
  }
}

// Used to pass specific record ID between forms to auto open on next form 
const passedRecordId = (state = 0, action) => {
  switch (action.type) {
      case 'SET_PASSEDRECORDID':
          return action.payload;
      default:
          return state;
  }
}

// correlates specific record id to relitive row number for one form
const recordCorrelationRow = (state = 0, action) => {
  switch (action.type) {
      case 'SET_RECORDCORRELATIONROW':
          return action.payload;
      default:
          return state;
  }
}

// make one object that has keys loginMessage, registrationMessage
// these will be on the redux state at:
// state.errors.loginMessage and state.errors.registrationMessage
export default combineReducers({
  budgetFormFillList,
  expenseFillList,
  expenseSum,
  budgetFormCount,
  passedRecordId,
  recordCorrelationRow,
});
