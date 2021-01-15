import { combineReducers } from 'redux';

// Used to store specific budget returned from the server
const reportBudgetCollection = (state = [], action) => {
  switch (action.type) {
      case 'SET_BUDGETCOLLECTION':
          return action.payload;
      default:
          return state;
  }
}




// make one object that has keys loginMessage, registrationMessage
// these will be on the redux state at:
// state.errors.loginMessage and state.errors.registrationMessage
export default combineReducers({
  reportBudgetCollection,
});
