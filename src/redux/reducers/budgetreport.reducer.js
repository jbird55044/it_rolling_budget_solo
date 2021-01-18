import { combineReducers } from 'redux';

// Used to store specific budget returned from the server
const reportBudgetReport1 = (state = [], action) => {
  switch (action.type) {
      case 'SET_BUDGETREPORT1':
          return action.payload;
      default:
          return state;
  }
}

// Used to store specific budget returned from the server
const reportBudgetReport2 = (state = [], action) => {
  switch (action.type) {
      case 'SET_BUDGETREPORT2':
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

const reportSelectedYear = (state = '', action) => {
  switch (action.type) {
      case 'SET_SELECTEDYEAR':
          return action.payload;
      default:
          return state;
  }
}

const reportSelectedYearSpelledOut = (state = '', action) => {
  switch (action.type) {
      case 'SET_SPELLEDOUT_YEAR':
          return action.payload[0].year;
      default:
          return state;
  }
}

// make one object that has keys loginMessage, registrationMessage
// these will be on the redux state at:
// state.errors.loginMessage and state.errors.registrationMessage
export default combineReducers({
  reportBudgetReport1,
  reportBudgetReport2,
  reportRecordExpenseFill,
  reportSelectedYear,
  reportSelectedYearSpelledOut,
});
