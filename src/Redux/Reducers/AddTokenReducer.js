import {ADD_TOKEN_FAIL} from '../Actions/types';
const INITIAL_STATE = {
  searchError: '',
};
/************************************** BTC reducer ****************************************************/
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD_TOKEN_FAIL:
      return {...state, searchError: action.payload};
    default:
      return state;
  }
};
