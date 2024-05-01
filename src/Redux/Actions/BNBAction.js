import { BNB_FAIL } from './types';
import {
  API_NONCE,
  API_SEND_TXN,
  API_BNB_GAS_ESTIMATE,
  API_BNB_GAS_PRICE,
  API_SAVE_TXN,
  STC_GAS_PRICE,
} from '../../Endpoints';
import { APIClient } from '../../Api';

/************************************** Bnb Nonce ****************************************************/
export const getBnbNonce = ({
  wallet_address,
  access_token,
  blockChain,
  coin_symbol,
}) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      let data = {
        wallet_address: wallet_address,
      };
      //console.warn('MM',data);
      APIClient.getInstance()
        .post(blockChain + '/' + coin_symbol + API_NONCE, data, access_token)
        .then(response => {
          console.warn('MM','response API_NONCE -- ', response.data);
          let result = response.data.nonce;
          resolve(result);
        })
        .catch(error => {
          //console.warn('MM','error API_NONCE -- ', error);
          reject(error);
          bnbFail(dispatch, error);
        });
    });
  };
};

/************************************** BNB Gas Price ****************************************************/
export const getBnbGasPrice = ({ access_token }) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      APIClient.getInstance()
        .get(API_BNB_GAS_PRICE, access_token)
        .then(response => {
          //console.warn('MM','response API_BNB_GAS_PRICE -- ', response.data);
          let result = response;
          resolve(result.data);
        })
        .catch(error => {
          //console.warn('MM','error API_BNB_GAS_PRICE -- ', error);
          reject(error);
        });
    });
  };
};

/************************************** Bnb Gas Estimate ****************************************************/
export const getBnbGasEstimate = ({
  blockChain,
  data,
  contractAddress,
  access_token,
}) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      APIClient.getInstance()
        .post(
          blockChain + '/' + contractAddress + API_BNB_GAS_ESTIMATE,
          data,
          access_token,
        )
        .then(response => {
          //console.warn('MM','response API_BNB_GAS_ESTIMATE -- ', response);
          let result = response;
          resolve(result);
        })
        .catch(error => {
          //console.warn('MM','error API_BNB_GAS_ESTIMATE -- ', error);
          reject(error);
          bnbFail(dispatch, error);
        });
    });
  };
};

/************************************** STC Gas Price ****************************************************/
export const getSTCGasPrice = () => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      APIClient.getInstance()
        .get(
          STC_GAS_PRICE,
        )
        .then(response => {
          console.warn('MM','response getSTCGasPrice -- ', response);
          let result = response;
          resolve(result);
        })
        .catch(error => {
          console.warn('MM','error getSTCGasPrice -- ', error);
          reject(error);
        });
    });
  };
};
/************************************** Matic Gas Estimate ****************************************************/
export const getMaticGasEstimate = ({
  data,
  contractAddress,
  access_token,
}) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      APIClient.getInstance()
        .post(
            'polygon/' + contractAddress + API_BNB_GAS_ESTIMATE,
          data,
          access_token,
        )
        .then(response => {
          //console.warn('MM','response API_BNB_GAS_ESTIMATE -- ', response);
          let result = response;
          resolve(result);
        })
        .catch(error => {
          //console.warn('MM','error API_BNB_GAS_ESTIMATE -- ', error);
          reject(error);
          bnbFail(dispatch, error);
        });
    });
  };
};

/************************************** Bnb send Api ****************************************************/
export const sendBNB = ({ data, access_token, blockChain, coin_symbol }) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      //console.warn('MM','eth data::::', data);
      APIClient.getInstance()
        .post(blockChain + '/' + coin_symbol + API_SEND_TXN, data, access_token)
        .then(response => {
          //console.warn('MM','response sendBnb -- ', response);
          let result = response;
          resolve(result);
        })
        .catch(error => {
          //console.warn('MM','error sendBnb -- ', error);
          reject(error);
           bnbFail(dispatch, error);
        });
    });
   };
};
/************************************** save bnbApi ****************************************************/
export const saveTxn = ({ data, access_token, blockChain, coin_symbol }) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      //console.warn('MM','txn data::::', data);
      APIClient.getInstance()
        .post(blockChain + '/' + coin_symbol + API_SAVE_TXN, data, access_token)
        .then(response => {
          //console.warn('MM','response saveTxn -- ', response);
          let result = response;
          resolve(result);
        })
        .catch(error => {
          //console.warn('MM','error saveTxn -- ', error);
          reject(error);
          bnbFail(dispatch, error);
        });
    });
  };
};

export const bnbFail = (dispatch, result) => {
  dispatch({
    type: BNB_FAIL,
    payload: result,
  });
};
