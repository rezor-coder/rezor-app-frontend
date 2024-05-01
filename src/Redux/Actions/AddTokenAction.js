import { ADD_TOKEN_FAIL } from './types'
import { API_SEARCH_TOKEN, API_ADD_TOKEN, API_COIN_GECKO, API_NFT, API_NFT_LIST, API_NFT_GAS_ESTIMATE, API_NFT_BSC, API_ADD_TOKEN_V2 } from '../../Endpoints';
import { APIClient } from "../../Api";

// ********************************* SEARCH TOKEN API*********************************************

export const searchToken = ({ data, access_token }) => {
          return (dispatch) => {
                    return new Promise((resolve, reject) => {
                              //console.warn('MM','search token::::', data)
                              APIClient.getInstance().post(API_SEARCH_TOKEN, data, access_token).then((response) => {
                                        let result = response;
                                        resolve(result);
                              })
                                        .catch((error) => {
                                                  //console.warn('MM',"error search token-- ", error)
                                                  reject(error);
                                                  searchTokenFail(dispatch, error);
                                        });
                    });
          };
};

// ********************************* ADD TOKEN API*********************************************

export const addToken = ({ data, access_token }) => {
          return (dispatch) => {
                    return new Promise((resolve, reject) => {
                              //console.warn('MM','add token::::', data)
                              APIClient.getInstance().post(API_ADD_TOKEN_V2, data, access_token).then((response) => {
                                        let result = response;
                                        resolve(result);
                              })
                                        .catch((error) => {
                                                  //console.warn('MM',"error add token-- ", error)
                                                  reject(error);
                                                  searchTokenFail(dispatch, error);
                                        });
                    });
          };
};


// ********************************* COIN GECKO API*********************************************

export const getCoinGeckoSymbols = ({ coin_symbol, access_token }) => {
          return (dispatch) => {
                    return new Promise((resolve, reject) => {
                              APIClient.getInstance().get(API_COIN_GECKO + coin_symbol, access_token).then((response) => {
                                        let result = response;
                                        console.warn('MM',"res  getCoinGeckoSymbols-- ", result)
                                        resolve(result.data);
                              })
                                        .catch((error) => {
                                                  console.warn('MM',"error  getCoinGeckoSymbols-- ", error)
                                                  reject(error);
                                                  searchTokenFail(dispatch, error);
                                        });
                    });
          };
};


// ********************************* ADD NFT API*********************************************


export const addNft = ({ data, access_token }) => {
          return (dispatch) => {
                    return new Promise((resolve, reject) => {
                              APIClient.getInstance().post(API_NFT, data, access_token).then((response) => {
                                        let result = response;
                                        //console.warn('MM',"res  addNft-- ", result)
                                        resolve(result);
                              })
                                        .catch((error) => {
                                                  //console.warn('MM',"error  addNft-- ", error)
                                                  reject(error);
                                                  searchTokenFail(dispatch, error);
                                        });
                    });
          };
};

// ********************************* ADD BSC NFT API*********************************************


export const addBscNft = ({ data, access_token }) => {
          return (dispatch) => {
                    return new Promise((resolve, reject) => {
                              APIClient.getInstance().post(API_NFT_BSC, data, access_token).then((response) => {
                                        let result = response;
                                        //console.warn('MM',"res  addBscNft-- ", result)
                                        resolve(result);
                              })
                                        .catch((error) => {
                                                  //console.warn('MM',"error  addBscNft-- ", error)
                                                  reject(error);
                                                  searchTokenFail(dispatch, error);
                                        });
                    });
          };
};

// ********************************* GET NFT LIST API*********************************************
export const getNftList = ({ wallet_addres, access_token }) => {
          return (dispatch) => {
                    return new Promise((resolve, reject) => {
                              APIClient.getInstance().get(API_NFT_LIST + wallet_addres, access_token).then((response) => {
                                        let result = response;
                                        //console.warn('MM',"res  getNftList-- ", result)
                                        resolve(result);
                              })
                                        .catch((error) => {
                                                  //console.warn('MM',"error  getNftList-- ", error)
                                                  reject(error);
                                                  searchTokenFail(dispatch, error);
                                        });
                    });
          };
};


// ********************************* GET NFT LIST API*********************************************
export const getNftGasEstimate = ({ data, access_token }) => {
          return (dispatch) => {
                    return new Promise((resolve, reject) => {
                              APIClient.getInstance().post(API_NFT_GAS_ESTIMATE, data, access_token).then((response) => {
                                        let result = response;
                                        //console.warn('MM',"res  getNftGasEstimate-- ", result)
                                        resolve(result);
                              })
                                        .catch((error) => {
                                                  //console.warn('MM',"error  getNftGasEstimate-- ", error)
                                                  reject(error);
                                                  searchTokenFail(dispatch, error);
                                        });
                    });
          };
};





export const searchTokenFail = (dispatch, result) => {
          dispatch({
                    type: ADD_TOKEN_FAIL,
                    payload: result,
          });
};