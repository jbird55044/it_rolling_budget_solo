import { combineReducers } from 'redux';

// loads redux with tlists select table
const tlistBusinessUnit = (state = [], action) => {
  switch (action.type) {
      case 'SET_TLIST_BUSINESSUNIT':
          return action.payload;
      default:
          return state;
  }
}

const tlistCostCenter = (state = [], action) => {
  switch (action.type) {
      case 'SET_TLIST_COSTCENTER':
          return action.payload;
      default:
          return state;
  }
}

const tlistPointPerson = (state = [], action) => {
  switch (action.type) {
      case 'SET_TLIST_POINTPERSON':
          return action.payload;
      default:
          return state;
  }
}

const tlistGlcode = (state = [], action) => {
  switch (action.type) {
      case 'SET_TLIST_GLCODE':
          return action.payload;
      default:
          return state;
  }
}

const tlistFrequency = (state = [], action) => {
  switch (action.type) {
      case 'SET_TLIST_FREQUENCY':
          return action.payload;
      default:
          return state;
  }
}

const tlistCapitalizedLife = (state = [], action) => {
  switch (action.type) {
      case 'SET_TLIST_CAPITALIZEDLIFE':
          return action.payload;
      default:
          return state;
  }
}

const tlistExpenditureType = (state = [], action) => {
  switch (action.type) {
      case 'SET_TLIST_EXPENDITURETYPE':
          return action.payload;
      default:
          return state;
  }
}

const tlistYear = (state = [], action) => {
  switch (action.type) {
      case 'SET_TLIST_YEAR':
          return action.payload;
      default:
          return state;
  }
}

// these will be on the redux state at:
// state.tlist.tlistBusinessUnit and state.tlist.tlistGlcode
export default combineReducers({
  tlistBusinessUnit,
  tlistCostCenter,
  tlistPointPerson,
  tlistGlcode,
  tlistFrequency,
  tlistCapitalizedLife,
  tlistExpenditureType,
  tlistYear,
});
