import {CARD_USER_DETAIL} from '../Actions/types';

const INITIAL_STATE = {
  cardUserDetail: {},
};
/************************************** BTC reducer ****************************************************/
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CARD_USER_DETAIL:
      return {...state, cardUserDetail: action.payload};
    default:
      return state;
  }
};
