import {
  CREATEMNEMONIC_FORM_UPDATE,
  REGISTER_USER_FAIL,
  REGISTER_USER_SUCCESS,
  REGISTER_USER,
  REGISTER_FORM_RESET,
  BACKUPMNEMONIC_FORM_UPDATE,
} from './types';
// import { APIClient } from '../../Api';
// import { REGISTER_URL } from '../../Endpoints';
// import * as Constants from '../../Constant';
import Singleton from '../../Singleton';
import { Actions, ActionConst } from 'react-native-router-flux';

/**************************************Update prop values ****************************************************/
export const createMnemonicsFormUpdate = ({ prop, value }) => {
  return {
    type: CREATEMNEMONIC_FORM_UPDATE,
    payload: { prop, value },
  };
};

/**************************************Update prop values ****************************************************/
export const bacupMnemonicsFormUpdate = ({ prop, value }) => {
  return {
    type: BACKUPMNEMONIC_FORM_UPDATE,
    payload: { prop, value },
  };
};
/**************************************Update changeThemeAction ****************************************************/
export const changeThemeAction = value => {
  return {
    type: 'CHANGE_THEME',
    payload: value,
  };
};

/**************************************Update changeLanguageAction ****************************************************/
export const changeLanguageAction = value => {
  return {
    type: 'CHANGE_LANGUAGE',
    payload: value,
  };
};


/**************************************Reset all prop values ****************************************************/

export const resetRegisterForm = () => {
  return {
    type: REGISTER_FORM_RESET,
  };
};

/************************************** Register Wallet Api request ****************************************************/

export const requesRegisterUser =
  ({
    address,
    wallet_address,
    btc_address,
    eth_address,
    solana_address,
    coin_symbol_bnb,
    coin_symbol_busd,
    coin_symbol_usdt,
    coin_symbol_btc,
    coin_symbol_sol,
    coin_symbol_eth,
    // coin_symbol_samo,
    wallet_name,
    device_token,
    device_type,
  }) =>
    dispatch => {
      // //console.warn('MM',"=================================res=====",address,wallet_address,btc_address,solana_address,coin_symbol_bnb,coin_symbol_busd,coin_symbol_usdt,coin_symbol_btc,coin_symbol_sol,wallet_name,device_token,device_type);
      return new Promise((resolve, reject) => {
        dispatch({ type: REGISTER_USER });
        let data = {
          address: wallet_address,
          wallet_addresses: [
            {
              wallet_address: wallet_address,
              coin_symbol: coin_symbol_bnb,
              coin_family: 1,
            },
            {
              wallet_address: wallet_address,
              coin_symbol: coin_symbol_busd,
              coin_family: 1,
            },
            {
              wallet_address: wallet_address,
              coin_symbol: coin_symbol_usdt,
              coin_family: 1,
            },
            {
              wallet_address: btc_address,
              coin_symbol: coin_symbol_btc,
              coin_family: 2,
            },
            {
              wallet_address: solana_address,
              coin_symbol: coin_symbol_sol,
              coin_family: 3,
            },
            {
              wallet_address: wallet_address,
              coin_symbol: coin_symbol_eth,
              coin_family: 4,
            },
            // { wallet_address: solana_address, coin_symbol: coin_symbol_samo,coin_family :3},
          ],
          wallet_name: wallet_name,
          device_token: device_token,
          device_type: device_type,
        };
        APIClient.getInstance()
          .post(REGISTER_URL, data)
          .then(response => {
            let result = response;
            registerUserSuccess(dispatch, result);
            resolve(result);
          })
          .catch(error => {
            let errorMessage = error.message;
            //console.warn('MM','Get Send Request Access Error ****', error);
            registerUserFail(dispatch, errorMessage);
            reject(errorMessage);
          });
      });
    };

/************************************* Success/Fail Dispatches ***************************************************/
const registerUserFail = (dispatch, errorMessage) => {
  dispatch({
    type: REGISTER_USER_FAIL,
    payload: errorMessage,
  });
  if (
    errorMessage != Constants.SESSION_OUT &&
    errorMessage != Constants.NO_NETWORK
  ) {
    Singleton.showAlert(errorMessage);
  }
};

const registerUserSuccess = (dispatch, user) => {
  dispatch({
    type: REGISTER_USER_SUCCESS,
    payload: user,
  });
  // Actions.currentScene != 'Main' && Actions.Main()
};
