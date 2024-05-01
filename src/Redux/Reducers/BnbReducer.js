import { BNB_FAIL } from '../Actions/types'
const INITIAL_STATE = {
    bnbError: '',
};
/************************************** ETH reducer ****************************************************/
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {

        case BNB_FAIL:
         //console.log("BNB FAIL::::,",action.payload);
            return { ...state, bnbError: action.payload };
        default:
            return state;
    }
};