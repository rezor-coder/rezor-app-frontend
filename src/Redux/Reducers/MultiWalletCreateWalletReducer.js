import {
    MULTI_WALLET_CREATE_WALLET_FORM_RESET,
    MULTI_WALLET_CREATE_WALLET_FORM_UPDATE,
} from '../Actions/types';
const INITIAL_STATE = {
    multiWalletName: '',
    multiWalletData: '',
    importMnemonics: '',
};

/************************************** create wallet reducer ****************************************************/
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case MULTI_WALLET_CREATE_WALLET_FORM_UPDATE:
            return { ...state, [action.payload.prop]: action.payload.value };
        case MULTI_WALLET_CREATE_WALLET_FORM_RESET:
            return { ...state, ...INITIAL_STATE };
        default:
            return state;
    }
};
