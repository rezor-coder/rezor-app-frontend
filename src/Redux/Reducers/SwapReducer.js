import { SAVE_SWAP_ITEM, IS_FROM_DAPP, CLEAR_REDUCER } from "../Actions/types";

const INITIAL_STATE = {
    swapItem:{},
    isFromDapp:false
}
export default (state = INITIAL_STATE, action) => {
    // console.log("action::::",action);
    switch (action.type) {
        case SAVE_SWAP_ITEM :{
            return {...state,swapItem:action.payload}
        }
        case IS_FROM_DAPP :{
            console.log("action::::::",action);
            return {...state,isFromDapp:action.payload}
        }
        case CLEAR_REDUCER:{
            console.log("swapReducer");
            return INITIAL_STATE
        }
      default:
        return state;
    }
  };