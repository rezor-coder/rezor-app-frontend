import {ETH_FORM_UPDATE, ETH_FAIL} from '../Actions/types';
const INITIAL_STATE = {
  ethError: '',
};
/************************************** ETH reducer ****************************************************/
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ETH_FORM_UPDATE:
      return {...state, [action.payload.prop]: action.payload.value};

    case ETH_FAIL:
      return {...state, ethError: action.payload};
    default:
      return state;
  }
};
