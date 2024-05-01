import { ETH_FORM_UPDATE, ETH_FAIL } from './types';
import {
  API_ETH_GAS_PRICE,
  API_NONCE,
  API_SEND_TXN,
  API_ETH_GAS_ESTIMATE,
  API_ETH_TOKEN_RAW,
} from '../../Endpoints';
import { APIClient } from '../../Api';

/**************************************Update prop values ****************************************************/
export const etheruemFormUpdate = ({ prop, value }) => {
  return {
    type: ETH_FORM_UPDATE,
    payload: { prop, value },
  };
};
/**************************************Ethereum Nonce ****************************************************/
export const getEthNonce = ({
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
          //console.warn('MM','response API_NONCE -- ', response.data);
          let result = response;
          resolve(result);
        })
        .catch(error => {
          //console.warn('MM','error API_NONCE -- ', error);
          reject(error);
          ethereumFail(dispatch, error);
        });
    });
  };
};

/**************************************Ethereum Gas Price ****************************************************/
export const getEthGasPrice = ({ access_token }) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      APIClient.getInstance()
        .get(API_ETH_GAS_PRICE, access_token)
        .then(response => {
          //console.warn('MM','response API_ETH_GAS_PRICE -- ', response.data);
          let result = response;
          resolve(result.data);
        })
        .catch(error => {
          //console.warn('MM','error API_ETH_GAS_PRICE -- ', error);
          reject(error);
          ethereumFail(dispatch, error);
        });
    });
  };
};

/**************************************Ethereum Gas Estimate ****************************************************/
export const getEthGasEstimate = ({
  blockChain,
  data,
  contractAddress,
  access_token,
}) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      APIClient.getInstance()
        .post(
          blockChain + '/' + contractAddress + API_ETH_GAS_ESTIMATE,
          data,
          access_token,
        )
        .then(response => {
          //console.warn('MM','response API_ETH_GAS_ESTIMATE -- ', response);
          let result = response;
          resolve(result);
        })
        .catch(error => {
          //console.warn('MM','error API_ETH_GAS_ESTIMATE -- ', error);
          reject(error);
          ethereumFail(dispatch, error);
        });
    });
  };
};

/**************************************ERC-20 SIGNED RAW ****************************************************/
export const getEthTokenRaw = ({
  blockChain,
  data,
  contractAddress,
  access_token,
}) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      APIClient.getInstance()
        .post(
          blockChain + '/' + contractAddress + API_ETH_TOKEN_RAW,
          data,
          access_token,
        )
        .then(response => {
          //console.warn('MM','response API_ETH_TOKEN_RAW -- ', response);
          let result = response;
          resolve(result);
        })
        .catch(error => {
          //console.warn('MM','error API_ETH_TOKEN_RAW -- ', error);
          reject(error);
          ethereumFail(dispatch, error);
        });
    });
  };
};

/**************************************Ethereum send Api ****************************************************/
export const sendETH = ({ data, access_token, blockChain, coin_symbol }) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      console.warn('MM','eth data::::', data);
      console.warn('MM','blockChain data::::', blockChain);
      console.warn('MM','coin_symbol data::::', coin_symbol);
      APIClient.getInstance()
        .post(blockChain + '/' + coin_symbol + API_SEND_TXN, data, access_token)
        .then(response => {
          //console.warn('MM','response sendEth -- ', response);
          let result = response;
          resolve(result);
        })
        .catch(error => {
          console.warn('MM','error sendEth -- ', error);
          reject(error);
          ethereumFail(dispatch, error);
        });
    });
  };
};

export const ethereumFail = (dispatch, result) => {
  dispatch({
    type: ETH_FAIL,
    payload: result,
  });
};
