import {
  CREATE_WALLET_FORM_UPDATE,
  CREATE_WALLET_FORM_RESET,
} from '../Actions/types';
const INITIAL_STATE = {
  walletName: '',
  walletData: '',
  importMnemonics: '',
  selectedAddress: '',
};

/************************************** create wallet reducer ****************************************************/
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CREATE_WALLET_FORM_UPDATE:
      return {...state, [action.payload.prop]: action.payload.value};
    case CREATE_WALLET_FORM_RESET:
      return {...state, ...INITIAL_STATE};

    default:
      return state;
  }
};
