import { MULTI_WALLET_CREATE_WALLET_FORM_UPDATE } from './types'
import { API_CREATE_WALLET } from '../../Endpoints';
import { APIClient } from "../../Api";
import Singleton from '../../Singleton';
import * as Constants from '../../Constant'

/**************************************Update prop values ****************************************************/
export const multiWalletFormUpdate = ({ prop, value }) => {
  return {
    type: MULTI_WALLET_CREATE_WALLET_FORM_UPDATE,
    payload: { prop, value },
  };
};

/**************************************create new wallet ****************************************************/
export const MultiWallet_create = ({ data }) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      // let data = {
      //   address: address,
      //   wallet_addresses: wallet_addresses,
      //   wallet_name: wallet_name,
      //   device_token: device_token
      // }
      //console.warn('MM',data)
      APIClient.getInstance().post(API_CREATE_WALLET, data, '').then((response) => {
        let result = response;
        if ( Singleton.getInstance().CurrencySelected == undefined ||  Singleton.getInstance().CurrencySelected == null ||  Singleton.getInstance().CurrencySelected == "") {

        Singleton.getInstance().newSaveData(Constants.CURRENCY_SELECTED, 'USD')
        Singleton.getInstance().newSaveData(Constants.CURRENCY_SYMBOL, '$')
        Singleton.getInstance().CurrencySymbol = '$'
        Singleton.getInstance().CurrencySelected = 'USD'
        }
        resolve(result);
      })
        .catch((error) => {
          //console.warn('MM',"error create wallet-- ", error)
          reject(error);
        });
    });
  };
};