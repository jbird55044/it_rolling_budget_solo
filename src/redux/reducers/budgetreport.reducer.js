import { combineReducers } from 'redux';

// Used to store specific budget returned from the server
const reportBudgetReport = (state = [], action) => {
  switch (action.type) {
      case 'SET_BUDGETREPORT':
          return action.payload;
      default:
          return state;
  }
}

const reportRecordExpenseFill = (state = [], action) => {
  switch (action.type) {
      case 'SET_RECORD_EXPENSEFILL':
          return action.payload;
      default:
          return state;
  }
}


// make one object that has keys loginMessage, registrationMessage
// these will be on the redux state at:
// state.errors.loginMessage and state.errors.registrationMessage
export default combineReducers({
  reportBudgetReport,
  reportRecordExpenseFill,
});
