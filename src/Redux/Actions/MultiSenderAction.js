import { UPLOAD_CSV_URL, API_BTC_COMMISSION } from '../../Endpoints';
import { MULTISENDER_FAIL } from './types';
import { APIClient } from '../../Api';
import { Platform } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';

/************************************** UPLOAD IMAGE API ****************************************************/

export const uploadCsvFile = (image, access_token) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      const data = {
        name: 'file',
        data:
          Platform.OS == 'android'
            ? RNFetchBlob.wrap(image)
            : RNFetchBlob.wrap(
              decodeURIComponent(image.replace('file://', '')),
            ),
        filename: 'csv1.csv',
        type: 'text/comma-separated-values',
      };
      APIClient.getInstance()
        .postFile(UPLOAD_CSV_URL, data, access_token)
        .then(response => {
          let result = response;
   //  console.warn('MM', 'response uploadCsvFile --**** ' + JSON.stringify(result.data) );
          resolve(result.data);
        })
        .catch(error => {
          //console.warn('MM','error uploadCsvFile -- ****', error);
          reject(error);
          multiSenderFail(dispatch, error);
        });
    });
  };
};

/************************************** BTC COMMISSION API ****************************************************/

export const getBtcCommission = access_token => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      APIClient.getInstance()
        .get(API_BTC_COMMISSION, access_token)
        .then(response => {
          let result = response;
          ////console.log(
          // 'response getBtcCommission --**** ' + JSON.stringify(result.data),
          // );
          resolve(result.data);
        })
        .catch(error => {
          //console.warn('MM','error getBtcCommission -- ****', error);
          reject(error);
          multiSenderFail(dispatch, error);
        });
    });
  };
};

export const multiSenderFail = (dispatch, result) => {
  dispatch({
    type: MULTISENDER_FAIL,
    payload: result,
  });
};
