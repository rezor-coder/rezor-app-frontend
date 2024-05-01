import { API_SUPPORT_REQUEST, API_UPLOAD_SUPPORT_IMAGE } from '../../Endpoints';
import { APIClient } from '../../Api';

export const saveSupportRequest = ({ data, access_token }) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      APIClient.getInstance()
        .post(API_SUPPORT_REQUEST, data, access_token)
        .then(response => {
          //console.warn('MM','res sendSupportRequest-- ', response);
          let result = response;
          resolve(result);
        })
        .catch(error => {
          //console.warn('MM','error sendSupportRequest-- ', error);
          reject(error);
        });
    });
  };
};

export const uploadImage = ({ data, access_token }) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      APIClient.getInstance()
        .postFile(API_UPLOAD_SUPPORT_IMAGE, data, access_token)
        .then(response => {
          //console.warn('MM','res uploadImage-- ', response);
          let result = response;
          resolve(result);
        })
        .catch(error => {
          //console.warn('MM','error uploadImage-- ', error);
          reject(error);
        });
    });
  };
};
