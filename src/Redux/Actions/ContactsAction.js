import { ADD_WALLET_CONTACT_FAIL } from './types'
import { API_ADD_WALLET_CONTACT, API_ADD_WALLET_CONTACT_LIST, API_ADD_WALLET_CONTACT_RECENT_LIST, API_DELETE_WALLET_CONTACT, API_EDIT_WALLET_CONTACT } from '../../Endpoints';
import { APIClient } from "../../Api";

// ********************************* ADD WALLET CONTACT API*********************************************

export const saveWalletContact = ({ data, access_token }) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            //console.warn('MM','saveWalletContact::::', data)
            APIClient.getInstance().post(API_ADD_WALLET_CONTACT, data, access_token).then((response) => {
                //console.warn('MM',"res saveWalletContact-- ", response)
                let result = response;
                resolve(result);
            })
                .catch((error) => {
                    //console.warn('MM',"error saveWalletContact-- ", error)
                    reject(error);
                    addWalletContactFail(dispatch, error);
                });
        });
    };
};

export const editWalletContact = ({ data, access_token }) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            //console.warn('MM','saveWalletContact::::', data)
            APIClient.getInstance().post(API_EDIT_WALLET_CONTACT, data, access_token).then((response) => {
                //console.warn('MM',"res editWalletContact-- ", response)
                let result = response;
                resolve(result);
            })
                .catch((error) => {
                    //console.warn('MM',"error editWalletContact-- ", error)
                    reject(error);
                    addWalletContactFail(dispatch, error);
                });
        });
    };
};

export const deleteWalletContact = ({ id, access_token }) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            //console.warn('MM','deleteWalletContact::::', id)
            APIClient.getInstance().post(API_DELETE_WALLET_CONTACT + '/' + id, {}, access_token).then((response) => {
                //console.warn('MM',"res deleteWalletContact-- ", response)
                let result = response;
                resolve(result);
            })
                .catch((error) => {
                    //console.warn('MM',"error deleteWalletContact-- ", error)
                    reject(error);
                    // addWalletContactFail(dispatch, error);
                });
        });
    };
};

// ********************************* GET WALLET CONTACT LIST API*********************************************

export const getWalletContactList = ({ network, access_token }) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            APIClient.getInstance().get(API_ADD_WALLET_CONTACT_LIST + network, access_token).then((response) => {
                //console.warn('MM',"res getWalletContactList-- ", response)
                let result = response;
                resolve(result);
            })
                .catch((error) => {
                    //console.warn('MM',"error getWalletContactList-- ", error)
                    reject(error);
                    addWalletContactFail(dispatch, error);
                });
        });
    };
};


// ********************************* GET WALLET CONTACT RECENT LIST API*********************************************

export const getWalletContactRecentList = ({ coin_family, access_token }) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            APIClient.getInstance().get(API_ADD_WALLET_CONTACT_RECENT_LIST + coin_family, access_token).then((response) => {
                //console.warn('MM',"res getWalletContactRecentList-- ", response)
                let result = response;
                resolve(result);
            })
                .catch((error) => {
                    //console.warn('MM',"error getWalletContactRecentList-- ", error)
                    reject(error);
                    addWalletContactFail(dispatch, error);
                });
        });
    };
};


export const addWalletContactFail = (dispatch, result) => {
    dispatch({
        type: ADD_WALLET_CONTACT_FAIL,
        payload: result,
    });
};