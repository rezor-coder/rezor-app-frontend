// import { API_GET_SWAP_FIAT } from "../../../Endpoints";
// import { APIClient } from "../../components/Api";
import { WALLET_CONNECT_PARAMS, DELETE_SESSION, SAVE_SESSION, SAVE_CALL_REQUEST_ID, GET_REQUESTED_SESSION, INITIALISE_LIST, TRANSACTION_CONFIRM, SWAP_FIAT_PRICE, WALLET_SWITCH } from "./types";

export const wallectConnectParamsUpdate = ({ prop, value }) => {

  return {
    type: WALLET_CONNECT_PARAMS,
    payload: { prop, value },
  };
};
export const deleteSession = (id) => {

  return {
    type: DELETE_SESSION,
    payload: id,
  };
}

export const saveCallRequestId = (id) => {

  return {
    type: SAVE_CALL_REQUEST_ID,
    payload: id,
  };
}
export const getRequestedSession = (id) => {

  return {
    type: GET_REQUESTED_SESSION,
    payload: id,
  };
}
export const initialiseSessionList = (list) => {

  return {
    type: INITIALISE_LIST,
    payload: id,
  };
}
export const transactionConfirm = () => {

  return {
    type: TRANSACTION_CONFIRM,
    payload: '------',
  };
}
export const onWalletSwitch = () =>{
  return{
    type: WALLET_SWITCH,
    payload:'==='
  }
}