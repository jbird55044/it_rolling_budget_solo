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

const budgetFormCount = (state = 0, action) => {
  switch (action.type) {
      case 'SET_BUDGETFORMCOUNT':
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
  budgetFormCount,
});
