import { CREATE_WALLET_FORM_UPDATE } from './types';
import {
  API_CREATE_WALLET,
  API_VERIFY_EMAIL,
  API_VERIFY_MOBILE,
  API_REGISTER,
  API_OTP_VERIFY,
  API_LOGIN,
  API_USER_DETAIL,
  API_REFERRER_CODE,
} from '../../Endpoints';

import { APIClient } from '../../Api';
import Singleton from '../../Singleton';
import * as Constants from './../../Constant';

/**************************************Update prop values ****************************************************/
export const walletFormUpdate = ({ prop, value }) => {
  return {
    type: CREATE_WALLET_FORM_UPDATE,
    payload: { prop, value },
  };
};

/**************************************create new wallet ****************************************************/
export const createWallet = ({
  address,
  wallet_addresses,
  wallet_name,
  device_token,
  referrer_code,
}) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      let data = {
        address: address,
        wallet_addresses: wallet_addresses,
        wallet_name: wallet_name,
        device_token: device_token,
        referrer_code: referrer_code,
      };
      //console.warn('MM','createWalletAction--DATA--', data);
      APIClient.getInstance()
        .post(API_CREATE_WALLET, data, '')
        .then(response => {
          let result = response;
          if ( Singleton.getInstance().CurrencySelected == undefined ||  Singleton.getInstance().CurrencySelected == null ||  Singleton.getInstance().CurrencySelected == "") {
            Singleton.getInstance().newSaveData(Constants.CURRENCY_SELECTED, 'USD');
          Singleton.getInstance().newSaveData(Constants.CURRENCY_SYMBOL, '$');
          Singleton.getInstance().CurrencySymbol = '$';
          Singleton.getInstance().CurrencySelected = 'USD';
          }
          
          resolve(result);
        })
        .catch(error => {
          //console.warn('MM','error create wallet-- ', error);
          reject(error);
        });
    });
  };
};

/************************************** email verify api ****************************************************/
export const verifyEmail = ({ data }) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      APIClient.getInstance()
        .post(API_VERIFY_EMAIL, data, '')
        .then(response => {
          let result = response;
          //console.warn('MM','error verifyEmail-- ', response);
          resolve(result);
        })
        .catch(error => {
          //console.warn('MM','error verifyEmail-- ', error);
          reject(error);
        });
    });
  };
};

/************************************** mobile verify api ****************************************************/
export const verifymobile = ({ data }) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      APIClient.getInstance()
        .post(API_VERIFY_MOBILE, data, '')
        .then(response => {
          let result = response;
          //console.warn('MM','error verifymobile-- ', response);
          resolve(result);
        })
        .catch(error => {
          //console.warn('MM','error verifymobile-- ', error);
          reject(error);
        });
    });
  };
};

/************************************** otp verify api ****************************************************/
export const verifyOtpEmailMob = ({ data }) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      APIClient.getInstance()
        .post(API_OTP_VERIFY, data, '')
        .then(response => {
          let result = response;
          //console.warn('MM','error verifyOtpEmailMob-- ', response);
          resolve(result);
        })
        .catch(error => {
          //console.warn('MM','error verifyOtpEmailMob-- ', error);
          reject(error);
        });
    });
  };
};

/************************************** register uset api ****************************************************/
export const registerUser = ({ data }) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      APIClient.getInstance()
        .post(API_REGISTER, data, '')
        .then(response => {
          let result = response;
          //console.warn('MM','res registerUser-- ', response);
          Singleton.getInstance().newSaveData(Constants.access_token, response.access_token);
          Singleton.getInstance().access_token = response.access_token;
          resolve(result?.data);
        })
        .catch(error => {
          //console.warn('MM','error registerUser-- ', error);
          reject(error);
        });
    });
  };
};

/************************************** login user api ****************************************************/
export const loginUser = ({ data }) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      APIClient.getInstance().post(API_LOGIN, data, '').then(response => {
        let result = response;
        //console.warn('MM','res loginUser-- ', result.access_token);
        Singleton.getInstance().newSaveData(Constants.access_token, response.access_token);
        Singleton.getInstance().access_token = result.access_token;
        ////console.log(
        // 'chk access token::;',
        //   Singleton.getInstance().access_token,
        // );
        resolve(result?.data);
      })
        .catch(error => {
          //console.warn('MM','error loginUser-- ', error);
          reject(error);
        });
    });
  };
};

/************************************** get user detail api ****************************************************/
export const getUserDetail = ({ access_token }) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      APIClient.getInstance()
        .get(API_USER_DETAIL, access_token)
        .then(response => {
          //console.warn('MM','response getUserDetail -- ', response.data);
          let result = response;
          resolve(result.data);
        })
        .catch(error => {
          //console.warn('MM','error getUserDetail -- ', error);
          reject(error);
        });
    });
  };
};

/************************************** validate referrer code api ****************************************************/
export const validateRefCode = ({ data }) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      APIClient.getInstance()
        .post(API_REFERRER_CODE, data, '')
        .then(response => {
          //console.warn('MM','response validateRefCode -- ', response);
          let result = response;
          resolve(result);
        })
        .catch(error => {
          //console.warn('MM','error validateRefCode -- ', error);
          reject(error);
        });
    });
  };
};
