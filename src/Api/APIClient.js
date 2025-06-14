import NodeRSA from 'node-rsa';
import {fetch as ssl_fetch} from 'react-native-ssl-pinning';
import axios from 'axios';
import RNFetchBlob from 'rn-fetch-blob';
import {
  BASE_URL,
  BASE_URL_CARDS_CENTRALISED,
  BASE_URL_HUOBI,
  BASE_URL_SAITACARDS,
  VAULT_CARD_URL,
} from '../Endpoints';
import {NavigationStrings} from '../Navigation/NavigationStrings';
import Singleton from '../Singleton';
import {getCurrentRouteName, navigate, reset} from '../navigationsService';
import * as Constants from './../Constant';

export const disableAllSecurity = true;
export const sslCertificateList = ['devCard', 'devCentralize'];
const APIClient = class APIClient {
  static myInstance = null;
  static getInstance() {
    if (APIClient.myInstance == null) {
      APIClient.myInstance = new APIClient();
    }
    return this.myInstance;
  }

  get(endpoint, UserToken) {
    if (global.disconnected) {
      // if (!this.alertPresent) {
      //   this.alertPresent = true;
      //   Alert.alert(
      //     Constants.APP_NAME,
      //     Constants.NO_NETWORK,
      //     [
      //       {
      //         text: 'OK',
      //         onPress: () => {
      //           this.alertPresent = false;
      //         },
      //       },
      //     ],
      //     {cancelable: false},
      //   );
      // }
      Singleton.showAlert(Constants.NO_NETWORK);
      return new Promise((resolve, reject) => {
        reject({message: Constants.NO_NETWORK});
      });
    } else {
      return new Promise((resolve, reject) => {
        console.warn('MM', 'UserToken', endpoint, UserToken);
        console.warn('MM', 'url11', `${BASE_URL}${endpoint}`);
        ssl_fetch(`${BASE_URL}${endpoint}`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: UserToken || undefined,
          },
          sslPinning: {
            certs: sslCertificateList,
          },
          disableAllSecurity: true,
        })
          .then(async res => {
            try {
              let jsonVal = await res.json();
              console.warn('MM', 'res get api:::::::', endpoint, jsonVal);
              if (res.status != 200) {
                if (jsonVal.message == undefined) {
                  return reject({message: Constants.SOMETHING_WRONG});
                }
                return reject(jsonVal);
              }
              return resolve(jsonVal);
            } catch (e) {
              // console.warn('MM', 'api error', e);
              return reject({message: Constants.SOMETHING_WRONG});
            }
          })
          .catch(error => {
            let msg = JSON.parse(error.bodyString);
            console.warn('MM', 'msg err::::::get----', msg);
            if (error?.status == 400) {
              if (msg?.invalid) {
                getCurrentRouteName() != 'ConfirmPin' &&
                  navigate(NavigationStrings.ConfirmPin, {refreshToken: true});
              }
            }
            return reject(msg);
          });
      });
    }
  }

  getGasPrice(endpoint, UserToken) {
    // //console.warn('MM','API Client Called');
    if (global.disconnected) {
      Singleton.showAlert(Constants.NO_NETWORK);
      // if (!this.alertPresent) {
      //   this.alertPresent = true;
      //   Alert.alert(
      //     Constants.APP_NAME,
      //     Constants.NO_NETWORK,
      //     [
      //       {
      //         text: 'OK',
      //         onPress: () => {
      //           this.alertPresent = false;
      //         },
      //       },
      //     ],
      //     {cancelable: false},
      //   );
      // }
      return new Promise((resolve, reject) => {
        reject({message: Constants.NO_NETWORK});
      });
    } else {
      return new Promise((resolve, reject) => {
        ssl_fetch(`${endpoint}`, {
          method: 'GET',
          disableAllSecurity: true,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'api-access-token': UserToken,
          },
          sslPinning: {
            certs: sslCertificateList,
          },
        })
          .then(async res => {
            console.warn('MM', 'res', res);
            try {
              let jsonVal = await res.json();
              console.warn('MM', 'Json Response:', jsonVal);
              if (res.status != 200) {
                if (jsonVal.message == undefined) {
                  return reject({message: Constants.SOMETHING_WRONG});
                }
                return reject(jsonVal);
              }
              return resolve(jsonVal);
            } catch (e) {
              return reject({message: Constants.SOMETHING_WRONG});
            }
          })
          .catch(reject);
      });
    }
    //}
  }

  post(endpoint, data, UserToken) {
    if (global.disconnected) {
      Singleton.showAlert(Constants.NO_NETWORK);
      // if (!this.alertPresent) {
      //   this.alertPresent = true;
      //   Alert.alert(
      //     Constants.APP_NAME,
      //     Constants.NO_NETWORK,
      //     [
      //       {
      //         text: 'OK',
      //         onPress: () => {
      //           this.alertPresent = false;
      //         },
      //       },
      //     ],
      //     {cancelable: false},
      //   );
      // }
      return new Promise((resolve, reject) => {
        reject({message: Constants.NO_NETWORK});
      });
    } else {
      return new Promise(async (resolve, reject) => {
        console.warn('MM', 'UserToken11', UserToken);
        console.warn('MM', 'url11', `${BASE_URL}${endpoint}`);
        console.warn('MM', 'params11', JSON.stringify(data));
        let encodedData = await this.encode_saitamask_data(data);
        console.warn('MM', 'await this.encodeData(data::::::', encodedData);
        //   const config = {
        //     method: 'post',
        //     url: `${BASE_URL}${endpoint}`,
        //     headers: {
        //       'Content-Type': 'application/json',
        //       Authorization: UserToken || undefined,
        //     },
        //     data: data != null ? JSON.stringify(data) : null,
        //     timeout: 1000000,
        //     sslPinning: {
        //       certs: sslCertificateList,
        //     },
        // };
        try {
          // await axios(config)
          ssl_fetch(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: UserToken || undefined,
            },
            sslPinning: {
              certs: sslCertificateList,
            },
            disableAllSecurity: true,
            body: data != null ? JSON.stringify(data) : null,
            timeout: 1000000,
            // body: data != null ? encodedData : null,
          })
            .then(async res => {
              console.log('res::::::', res);
              try {
                let jsonVal = await res.json();
                console.warn('MM', 'jsonVal::::::', jsonVal);
                if (res.status != 200) {
                  if (jsonVal.message == undefined) {
                    return reject({message: Constants.SOMETHING_WRONG});
                  }
                  return reject(jsonVal);
                }
                return resolve(jsonVal);
              } catch (e) {
                console.warn('MM', 'api error', e);
                return reject({message: Constants.SOMETHING_WRONG});
              }
            })
            .catch(error => {
              let msg = error?.bodyString
                ? JSON.parse(error.bodyString)
                : {message: Constants.SOMETHING_WRONG};
              if (error?.status == 400) {
                if (msg?.invalid) {
                  getCurrentRouteName() != 'ConfirmPin' &&
                    navigate(NavigationStrings.ConfirmPin, {
                      refreshToken: true,
                    });
                } else if (msg?.logout) {
                  getCurrentRouteName() != 'ConfirmPin' &&
                    navigate(NavigationStrings.ConfirmPin, {loginAgain: true});
                }
              }
              console.warn('MM', 'msg err::::::post77777', error);
              return reject(msg);
            });
        } catch (error) {
          console.log('-----123----', error);
          return reject({message: Constants.SOMETHING_WRONG});
        }
      });
    }
  }

  postFile(endpoint, data, UserToken) {
    if (global.disconnected) {
      Singleton.showAlert(Constants.NO_NETWORK);
      // if (!this.alertPresent) {
      //   this.alertPresent = true;
      //   Alert.alert(
      //     Constants.APP_NAME,
      //     Constants.NO_NETWORK,
      //     [
      //       {
      //         text: 'OK',
      //         onPress: () => {
      //           this.alertPresent = false;
      //         },
      //       },
      //     ],
      //     {cancelable: false},
      //   );
      // }
      return new Promise((resolve, reject) => {
        reject({message: Constants.NO_NETWORK});
      });
    } else {
      return new Promise((resolve, reject) => {
        console.warn('MM', 'url post file', endpoint);
        console.warn('MM', 'data', data);

        RNFetchBlob.fetch(
          'POST',
          `${BASE_URL}${endpoint}`,
          {
            Authorization: UserToken || undefined,
            'Content-Type': 'multipart/form-data',
          },
          [data],
        )
          .then(async res => {
            // console.warn('MM', 'res', res.json());
            try {
              let jsonVal = await res.json();
              return resolve(jsonVal);
            } catch (e) {
              return reject({message: Constants.SOMETHING_WRONG});
            }
          })
          .catch(reject);
      });
    }
  }
  postFileCards(endpoint, data, UserToken) {
    if (global.disconnected) {
      Singleton.showAlert(Constants.NO_NETWORK);
      // if (!this.alertPresent) {
      //   this.alertPresent = true;
      //   Alert.alert(
      //     Constants.APP_NAME,
      //     Constants.NO_NETWORK,
      //     [
      //       {
      //         text: 'OK',
      //         onPress: () => {
      //           this.alertPresent = false;
      //         },
      //       },
      //     ],
      //     {cancelable: false},
      //   );
      // }
      return new Promise((resolve, reject) => {
        reject({message: Constants.NO_NETWORK});
      });
    } else {
      return new Promise((resolve, reject) => {
        // console.warn('MM', 'url post file', endpoint);
        // console.warn('MM', 'data', data);

        RNFetchBlob.fetch(
          'POST',
          `${BASE_URL_SAITACARDS}${endpoint}`,
          {
            Authorization: UserToken || undefined,
            'Content-Type': 'multipart/form-data',
          },
          data,
        )
          .then(async res => {
            // console.warn('MM', 'res', res.json());
            try {
              let jsonVal = await res.json();
              return resolve(jsonVal);
            } catch (e) {
              return reject({message: Constants.SOMETHING_WRONG});
            }
          })
          .catch(reject);
      });
    }
  }
  //   }
  postCards(endpoint, data, UserToken, headers = {}) {
    if (global.disconnected) {
      Singleton.showAlert(Constants.NO_NETWORK);
      // if (!this.alertPresent) {
      //   this.alertPresent = true;
      //   Alert.alert(
      //     Constants.APP_NAME,
      //     Constants.NO_NETWORK,
      //     [
      //       {
      //         text: 'OK',
      //         onPress: () => {
      //           this.alertPresent = false;
      //         },
      //       },
      //     ],
      //     {cancelable: false},
      //   );
      // }
      return new Promise((resolve, reject) => {
        reject({message: Constants.NO_NETWORK});
      });
    } else {
      return new Promise(async (resolve, reject) => {
        console.warn('MM', 'url11crddd', `${BASE_URL_SAITACARDS}${endpoint}`);
        console.warn('MM', 'params11', UserToken);
        console.warn('MM', 'data1111', data);
        console.warn('MM', 'headers1111', headers);
        console.warn('MM', 'encodeData::::::', await this.encodeData(data));
        ssl_fetch(`${BASE_URL_SAITACARDS}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: UserToken ? 'Bearer ' + UserToken : '',
            ...headers,
          },
          sslPinning: {
            certs: sslCertificateList,
          },
          body: data != null ? await this.encodeData(data) : {},
          disableAllSecurity: true,
        })
          .then(async res => {
            console.warn('MM', 'res::::::', res);
            try {
              let jsonVal = await res.json();
              // console.warn('MM','jsonVal::::::', jsonVal);
              if (res.status != 200) {
                if (jsonVal.message == undefined) {
                  return reject({message: Constants.SOMETHING_WRONG});
                }
                return reject(jsonVal);
              }
              return resolve(jsonVal);
            } catch (e) {
              // console.warn('MM', 'api error', e);
              return reject({message: Constants.SOMETHING_WRONG});
            }
          })
          .catch(error => {
            let msg = JSON.parse(error.bodyString);
            // console.warn('MM', `msg err::::::postCards`, msg);
            if (error?.status == 400) {
              if (msg?.invalid) {
                this.onCardTokenExpired();
              }
            }
            return reject(msg);
          });
        // .then(async res => {
        //   try {
        //     let jsonVal = await res.json();
        //     if (!res.ok) {
        //       if (jsonVal.message == undefined) {
        //         return reject({ message: Constants.SOMETHING_WRONG });
        //       }
        //       return reject(jsonVal);
        //     }
        //     return resolve(jsonVal);
        //   } catch (e) {
        //     return reject({ message: Constants.SOMETHING_WRONG });
        //   }
        // })
        // .catch(reject);
      });
    }
  }
  postTokenCards(endpoint, data, UserToken) {
    if (global.disconnected) {
      Singleton.showAlert(Constants.NO_NETWORK);
      // if (!this.alertPresent) {
      //   this.alertPresent = true;
      //   Alert.alert(
      //     Constants.APP_NAME,
      //     Constants.NO_NETWORK,
      //     [
      //       {
      //         text: 'OK',
      //         onPress: () => {
      //           this.alertPresent = false;
      //         },
      //       },
      //     ],
      //     {cancelable: false},
      //   );
      // }
      return new Promise((resolve, reject) => {
        reject({message: Constants.NO_NETWORK});
      });
    } else {
      return new Promise(async (resolve, reject) => {
        // console.warn('MM', '\nUserToken11  postTokenCards', UserToken);
        // console.warn('MM', '\nurl11', `${BASE_URL_SAITACARDS}${endpoint}`);
        // console.warn('MM', '\nparams11 postTokenCards', this.encodeData(data) + '\n');
        ssl_fetch(`${BASE_URL_SAITACARDS}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: UserToken || undefined,
          },
          sslPinning: {
            certs: sslCertificateList,
          },
          body: data != null ? this.encodeData(data) : null,
          disableAllSecurity: true,
          // timeoutInterval:5000
        })
          .then(async res => {
            try {
              let jsonVal = await res.json();
              // console.warn('MM', 'res', endpoint, jsonVal);
              if (res.status != 200) {
                if (jsonVal.message == undefined) {
                  return reject({message: jsonVal.data.message});
                }
                return reject(jsonVal);
              }
              return resolve(jsonVal);
            } catch (e) {
              // console.warn('MM', 'api error', e);
              return reject({message: Constants.SOMETHING_WRONG});
            }
          })
          .catch(error => {
            let msg = JSON.parse(error.bodyString);
            console.warn('MM', 'msg err::::::', msg);
            if (error?.status == 400) {
              if (msg?.invalid) {
                this.onCardTokenExpired();
              }
            }
            return reject(msg);
          });
        // .then(async res => {
        //   try {
        //     let jsonVal = await res.json();
        //     if (!res.ok) {
        //       if (jsonVal.message == undefined) {
        //         return reject({ message: jsonVal.data.message });
        //       }
        //       return reject(jsonVal);
        //     }
        //     return resolve(jsonVal);
        //   } catch (e) {
        //     return reject({ message: Constants.SOMETHING_WRONG });
        //   }
        // })
        // .catch(reject);
      });
    }
  }
  postTokenCardsFormData(endpoint, data, UserToken) {
    if (global.disconnected) {
      Singleton.showAlert(Constants.NO_NETWORK);
      // if (!this.alertPresent) {
      //   this.alertPresent = true;
      //   Alert.alert(
      //     Constants.APP_NAME,
      //     Constants.NO_NETWORK,
      //     [
      //       {
      //         text: 'OK',
      //         onPress: () => {
      //           this.alertPresent = false;
      //         },
      //       },
      //     ],
      //     {cancelable: false},
      //   );
      // }
      return new Promise((resolve, reject) => {
        reject({message: Constants.NO_NETWORK});
      });
    } else {
      return new Promise(async (resolve, reject) => {
        // console.warn('MM', '\nUserToken11  postTokenCards', UserToken);
        // console.warn('MM', '\nurl11', `${BASE_URL_SAITACARDS}${endpoint}`);
        // console.warn('MM', '\nparams11 postTokenCardsFORMDATA', data, '\n');
        fetch(`${BASE_URL_SAITACARDS}${endpoint}`, {
          method: 'POST',
          headers: {
            // 'Content-Type': 'multipart/form-data',
            Authorization: UserToken || undefined,
          },
          body: data,
          // body: data != null ? this.encodeData(data) : null,
        })
          .then(async res => {
            try {
              let jsonVal = await res.json();
              // console.warn('MM', 'res', endpoint, jsonVal);
              if (res.status != 200) {
                if (jsonVal.message == undefined) {
                  return reject({message: jsonVal.data.message});
                }
                return reject(jsonVal);
              }
              return resolve(jsonVal);
            } catch (e) {
              // console.warn('MM', 'api error', e);
              return reject({message: Constants.SOMETHING_WRONG});
            }
          })
          .catch(error => {
            // let msg = JSON.parse(error.bodyString);
            let msg = error;
            console.warn('MM', 'msg err::::::', msg);
            if (error?.status == 400) {
              if (msg?.invalid) {
                this.onCardTokenExpired();
              }
            }
            return reject(msg);
          });
        // .then(async res => {
        //   try {
        //     let jsonVal = await res.json();
        //     if (!res.ok) {
        //       if (jsonVal.message == undefined) {
        //         return reject({ message: jsonVal.data.message });
        //       }
        //       return reject(jsonVal);
        //     }
        //     return resolve(jsonVal);
        //   } catch (e) {
        //     return reject({ message: Constants.SOMETHING_WRONG });
        //   }
        // })
        // .catch(reject);
      });
    }
  }
  getCards(endpoint, UserToken) {
    if (global.disconnected) {
      Singleton.showAlert(Constants.NO_NETWORK);
      // if (!this.alertPresent) {
      //   this.alertPresent = true;
      //   Alert.alert(
      //     Constants.APP_NAME,
      //     Constants.NO_NETWORK,
      //     [
      //       {
      //         text: 'OK',
      //         onPress: () => {
      //           this.alertPresent = false;
      //         },
      //       },
      //     ],
      //     {cancelable: false},
      //   );
      // }
      return new Promise((resolve, reject) => {
        reject({message: Constants.NO_NETWORK});
      });
    } else {
      console.warn('MM', 'UserToken', UserToken);
      console.warn('MM', 'endpoint', endpoint);
      return new Promise((resolve, reject) => {
        console.warn('MM', 'url', `${BASE_URL_SAITACARDS}${endpoint}`);
        ssl_fetch(`${BASE_URL_SAITACARDS}${endpoint}`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: UserToken ? 'Bearer ' + UserToken : '',
          },
          sslPinning: {
            certs: sslCertificateList,
          },
          disableAllSecurity: true,
        })
          .then(async res => {
            try {
              let jsonVal = await res.json();
              console.warn('MM', 'res111111', endpoint, jsonVal);
              if (res.status != 200) {
                if (jsonVal.message == undefined) {
                  return reject({message: Constants.SOMETHING_WRONG});
                }
                return reject(jsonVal);
              }
              return resolve(jsonVal);
            } catch (e) {
              console.warn('MM', 'api error', e);
              return reject({message: Constants.SOMETHING_WRONG});
            }
          })
          .catch(error => {
            let msg = JSON.parse(error.bodyString);
            console.warn('MM', 'msg err::::::getCards', msg);
            if (error?.status == 400) {
              if (msg?.invalid) {
                this.onCardTokenExpired();
              }
            }
            return reject(msg);
          });
        // .then(async res => {
        //   try {
        //     let jsonVal = await res.json();
        //     if (!res.ok) {
        //       if (jsonVal.message == undefined) {
        //         return reject({ message: Constants.SOMETHING_WRONG });
        //       }
        //       return reject(jsonVal);
        //     }
        //     return resolve(jsonVal);
        //   } catch (e) {
        //     return reject({ message: Constants.SOMETHING_WRONG });
        //   }
        // })
        // .catch(reject);
      });
    }
  }
  centralisedApi(endpoint, data, UserToken) {
    if (global.disconnected) {
      Singleton.showAlert(Constants.NO_NETWORK);
      // if (!this.alertPresent) {
      //   this.alertPresent = true;
      //   Alert.alert(
      //     Constants.APP_NAME,
      //     Constants.NO_NETWORK,
      //     [
      //       {
      //         text: 'OK',
      //         onPress: () => {
      //           this.alertPresent = false;
      //         },
      //       },
      //     ],
      //     {cancelable: false},
      //   );
      // }
      return new Promise((resolve, reject) => {
        reject({message: Constants.NO_NETWORK});
      });
    } else {
      return new Promise((resolve, reject) => {
        console.warn('MM', '\nUserToken11  centralisedApi', UserToken);
        console.warn(
          'MM',
          '\nurl11',
          `${BASE_URL_CARDS_CENTRALISED}${endpoint}`,
        );
        console.warn(
          'MM',
          '\nparams11 centralisedApi',
          JSON.stringify(data) + '\n',
        );
        console.warn(
          'MM',
          '\nparams11 centralisedApi',
          this.encodeCentralisedData(data) + '\n',
        );
        ssl_fetch(`${BASE_URL_CARDS_CENTRALISED}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: UserToken || undefined,
          },
          sslPinning: {
            certs: sslCertificateList,
          },
          disableAllSecurity: true,
          body: data != null ? this.encodeCentralisedData(data) : null,
        })
          .then(async res => {
            try {
              let jsonVal = await res.json();
              console.warn('MM', 'centralisedApi', endpoint, jsonVal);
              if (res.status != 200) {
                if (jsonVal.message == undefined) {
                  return reject({message: jsonVal.data.message});
                }
                return reject(jsonVal);
              }
              return resolve(jsonVal);
            } catch (e) {
              console.warn('MM', 'api error', e);
              return reject({message: Constants.SOMETHING_WRONG});
            }
          })
          .catch(error => {
            let msg = JSON.parse(error.bodyString);
            console.warn('MM', 'msg err::::::centralisedApi', msg);
            if (error?.status == 400) {
              if (msg?.invalid) {
                this.onCardTokenExpired();
              }
            }
            return reject(msg);
          });
        // .then(async res => {
        //   try {
        //     let jsonVal = await res.json();
        //     if (!res.ok) {
        //       if (jsonVal.message == undefined) {
        //         return reject({ message: jsonVal.data.message });
        //       }
        //       return reject(jsonVal);
        //     }
        //     return resolve(jsonVal);
        //   } catch (e) {
        //     return reject({ message: Constants.SOMETHING_WRONG });
        //   }
        // })
        // .catch(reject);
      });
    }
  }

  centralisedApiget(endpoint, data, UserToken) {
    if (global.disconnected) {
      Singleton.showAlert(Constants.NO_NETWORK);
      // if (!this.alertPresent) {
      //   this.alertPresent = true;
      //   Alert.alert(
      //     Constants.APP_NAME,
      //     Constants.NO_NETWORK,
      //     [
      //       {
      //         text: 'OK',
      //         onPress: () => {
      //           this.alertPresent = false;
      //         },
      //       },
      //     ],
      //     {cancelable: false},
      //   );
      // }
      return new Promise((resolve, reject) => {
        reject({message: Constants.NO_NETWORK});
      });
    } else {
      return new Promise((resolve, reject) => {
        console.warn('MM', '\nUserToken11  postTokenCards', UserToken);
        console.warn(
          'MM',
          '\nurl11',
          `${BASE_URL_CARDS_CENTRALISED}${endpoint}`,
        );
        console.warn(
          'MM',
          '\nparams11 postTokenCards',
          JSON.stringify(data) + '\n',
        );
        ssl_fetch(`${BASE_URL_CARDS_CENTRALISED}${endpoint}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: UserToken || undefined,
          },
          sslPinning: {
            certs: sslCertificateList,
          },
          // body: data != null ? this.encodeCentralisedData(data) : null,
          disableAllSecurity: true,
        })
          .then(async res => {
            try {
              // console.log('res' , res);
              let jsonVal = await res.json();
              if (res.status != 200) {
                if (jsonVal.message == undefined) {
                  return reject({message: jsonVal.data.message});
                }
                return reject(jsonVal);
              }
              return resolve(jsonVal);
            } catch (e) {
              console.warn('MM', 'api error', e);
              return reject({message: Constants.SOMETHING_WRONG});
            }
          })
          .catch(error => {
            let msg = JSON.parse(error.bodyString);
            console.warn('MM', 'msg err::::::centralisedApiget', msg);
            if (error?.status == 400) {
              if (msg?.invalid) {
                this.onCardTokenExpired();
              }
            }
            return reject(msg);
          });
        // .then(async res => {
        //   try {
        //     let jsonVal = await res.json();
        //     if (!res.ok) {
        //       if (jsonVal.message == undefined) {
        //         return reject({ message: jsonVal.data.message });
        //       }
        //       return reject(jsonVal);
        //     }
        //     return resolve(jsonVal);
        //   } catch (e) {
        //     return reject({ message: Constants.SOMETHING_WRONG });
        //   }
        // })
        // .catch(reject);
      });
    }
  }
  postHyperCards(endpoint, data, UserToken) {
    if (global.disconnected) {
      Singleton.showAlert(Constants.NO_NETWORK);
      // if (!this.alertPresent) {
      //   this.alertPresent = true;
      //   Alert.alert(
      //     Constants.APP_NAME,
      //     Constants.NO_NETWORK,
      //     [
      //       {
      //         text: 'OK',
      //         onPress: () => {
      //           this.alertPresent = false;
      //         },
      //       },
      //     ],
      //     {cancelable: false},
      //   );
      // }
      return new Promise((resolve, reject) => {
        reject({message: Constants.NO_NETWORK});
      });
    } else {
      return new Promise((resolve, reject) => {
        console.warn('MM', '\nUserToken11  postTokenCards', UserToken);
        console.warn('MM', '\nurl11', `${BASE_URL_SAITACARDS}${endpoint}`);
        console.warn(
          'MM',
          '\nparams11 postTokenCards',
          JSON.stringify(data) + '\n',
        );
        ssl_fetch(`${BASE_URL_SAITACARDS}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: UserToken || undefined,
          },
          sslPinning: {
            certs: sslCertificateList,
          },
          body: data != null ? this.encodeData(data) : null,
          disableAllSecurity: true,
        })
          .then(async res => {
            try {
              let jsonVal = await res.json();
              console.warn('MM', 'res', endpoint, jsonVal);
              if (res.status != 200) {
                if (jsonVal.message == undefined) {
                  return reject({message: jsonVal.data.message});
                }
                return reject(jsonVal);
              }
              return resolve(jsonVal);
            } catch (e) {
              console.warn('MM', 'api error', e);
              return reject({message: Constants.SOMETHING_WRONG});
            }
          })
          .catch(error => {
            let msg = JSON.parse(error.bodyString);
            console.warn('MM', 'msg err::::::', msg);
            if (error?.status == 400) {
              if (msg?.invalid) {
                this.onCardTokenExpired();
              }
            }
            return reject(msg);
          });
        // .then(async res => {
        //   try {
        //     let jsonVal = await res.json();
        //     if (!res.ok) {
        //       if (jsonVal.message == undefined) {
        //         return reject({ message: jsonVal.data.message });
        //       }
        //       return reject(jsonVal);
        //     }
        //     return resolve(jsonVal);
        //   } catch (e) {
        //     return reject({ message: Constants.SOMETHING_WRONG });
        //   }
        // })
        // .catch(reject);
      });
    }
  }

  postHuobi(endpoint, data, UserToken) {
    if (global.disconnected) {
      Singleton.showAlert(Constants.NO_NETWORK);
      // if (!this.alertPresent) {
      //   this.alertPresent = true;
      //   Alert.alert(
      //     Constants.APP_NAME,
      //     Constants.NO_NETWORK,
      //     [
      //       {
      //         text: 'OK',
      //         onPress: () => {
      //           this.alertPresent = false;
      //         },
      //       },
      //     ],
      //     {cancelable: false},
      //   );
      // }
      return new Promise((resolve, reject) => {
        reject({message: Constants.NO_NETWORK});
      });
    } else {
      return new Promise((resolve, reject) => {
        console.log('MM', 'url11 postHuobi', `${BASE_URL_HUOBI}${endpoint}`);
        console.log('MM', 'params11 postHuobi', JSON.stringify(data));
        ssl_fetch(`${BASE_URL_HUOBI}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: UserToken || undefined,
          },
          sslPinning: {
            certs: sslCertificateList,
          },
          body: data != null ? JSON.stringify(data) : null,
          disableAllSecurity: true,
        })
          .then(async res => {
            try {
              let jsonVal = await res.json();
              console.log('MM', 'res', endpoint, res.status);
              if (res.status != 200) {
                if (jsonVal.message == undefined) {
                  return reject({message: jsonVal.data.message});
                }
                return reject(jsonVal);
              }
              return resolve(jsonVal);
            } catch (e) {
              console.log('MM', 'api error', e);
              return reject({message: Constants.SOMETHING_WRONG});
            }
          })
          .catch(error => {
            let msg = JSON.parse(error.bodyString);
            console.log('MM', 'msg err::::::', msg);

            return reject(msg);
          });
        // .then(async res => {
        //   try {
        //     let jsonVal = await res.json();
        //     if (!res.ok) {
        //       if (jsonVal.message == undefined) {
        //         return reject({ message: jsonVal.data.message });
        //       }
        //       return reject(jsonVal);
        //     }
        //     return resolve(jsonVal);
        //   } catch (e) {
        //     return reject({ message: Constants.SOMETHING_WRONG });
        //   }
        // })
        // .catch(reject);
      });
    }
  }

  encode_saitamask_data = data => {
    try {
      return new Promise((resolve, reject) => {
        const second = new NodeRSA(Constants.SAITAMASK_WALLET_KEY);
        second.setOptions({encryptionScheme: 'pkcs1'});
        const enc = second.encrypt(data, 'base64');
        const dataa = {
          dataString: enc,
        };
        // console.warn('MM','enc::::', dataa);
        return resolve(JSON.stringify(dataa));
      });
    } catch (error) {
      console.log('--------ENCODE--', error);
    }
  };

  encodeData = data => {
    // return JSON.stringify(data)
    const second = new NodeRSA(Constants.CARD_KEY);
    second.setOptions({encryptionScheme: 'pkcs1'});
    const enc = second.encrypt(data, 'base64');
    const dataa = {
      dataString: enc,
    };
    // console.warn('MM','enc::::', dataa);
    return JSON.stringify(dataa);
  };
  encodeCentralisedData = data => {
    const second = new NodeRSA(Constants.CENTRALIZED_KEY);
    second.setOptions({encryptionScheme: 'pkcs1'});
    const enc = second.encrypt(data, 'base64');
    const dataa = {
      dataString: enc,
    };
    //console.warn('MM','enc::::', dataa);
    return JSON.stringify(dataa);
  };

  decryption = async data => {
    const key = new NodeRSA(Constants.BANK_DETAIL_PRIVATEKEY);
    key.setOptions({encryptionScheme: 'pkcs1'});
    const decrypted = await key.decrypt(data, 'utf8');
    let originalText = await JSON.parse(decrypted);
    return originalText;
  };

  onCardTokenExpired = async () => {
    try {
      getCurrentRouteName() != 'Dashboard' &&
        Singleton.showAlert(Constants.SESSION_OUT);
      await Singleton.getInstance().removeItemNew(Constants.access_token_cards);
      await Singleton.getInstance().removeItemNew(Constants.gold_access_token);
      await Singleton.getInstance().removeItemNew(
        Constants.diamond_access_token,
      );
      await Singleton.getInstance().removeItemNew(Constants.black_access_token);
      getCurrentRouteName() != 'Dashboard' && reset(NavigationStrings.Main);
    } catch (error) {
      console.warn('MM', '__onCardTokenExpired__>>', error);
      getCurrentRouteName() != 'Dashboard' && reset(NavigationStrings.Main);
    }
  };
  // ************************************************* Get Card **************************************************
  async getCardVault(endpoint, UserToken) {
    console.log('url11', `${VAULT_CARD_URL}${endpoint}`);
    console.log('UserToken', UserToken);
    if (!global.isConnected) {
      return new Promise((resolve, reject) => {
        reject({message: Constants.NO_NETWORK});
      });
    } else {
      return new Promise(async (resolve, reject) => {
        fetch(`${VAULT_CARD_URL}${endpoint}`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: UserToken ? 'Bearer ' + UserToken : '',
            X_MERCHANT_ID: Singleton.getInstance().xMerchantId,
          },
        })
          .then(async res => {
            try {
              let jsonVal = await res.json();
              if (jsonVal.code == 409) {
                this.refreshTheToken()
                  .then(async res => {
                    const UserToken = await Singleton.getInstance().newGetData(
                      Constants.access_token,
                    );
                    const response = await this.get(endpoint, UserToken);
                    return resolve(response);
                    // this.get(endpoint, UserToken)
                  })
                  .catch(err => {
                    console.log('chk refresh errrrrget', err);
                  });
              } else {
                if (!res.ok) {
                  if (jsonVal.message == undefined) {
                    return reject({message: Constants.SOMETHING_WRONG});
                  }
                  return reject(jsonVal);
                }
                return resolve(jsonVal);
              }
            } catch (e) {
              return reject({message: Constants.SOMETHING_WRONG});
            }
          })
          .catch(reject);
      });
    }
  }

  // ************************************************* Post **************************************************
  async postCardVault(endpoint, data, UserToken, headers = {}) {
    if (!global.isConnected) {
      return new Promise((resolve, reject) => {
        reject({message: Constants.NO_NETWORK});
      });
    } else {
      return new Promise(async (resolve, reject) => {
        console.log('UserToken11 post', UserToken);
        console.log('url11 post', `${VAULT_CARD_URL}${endpoint}`);
        console.log('params11 post', JSON.stringify(data));
        // console.log('SELECTED_LANGUAGE', await getData(Constants.SELECTED_LANGUAGE));
        console.log(
          'encodeData:::post',
          data != null ? this.encodeData(data) : null,
        );
        const config = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: UserToken ? 'Bearer ' + UserToken : '',
            ...headers,
          },
          body: data,
        };
        console.log('config::::::', config);
        try {
          fetch(`${VAULT_CARD_URL}${endpoint}`, config)
            .then(async res => {
              console.log('res::::', res);
              try {
                const jsonVal = await res.json();
                console.log('Json Response:endpoint', endpoint, jsonVal);

                if (jsonVal.error) {
                  if (jsonVal.message == undefined) {
                    return reject({message: Constants.SOMETHING_WRONG});
                  }
                  return reject({message: jsonVal?.message});
                } else {
                  return resolve(jsonVal);
                }
              } catch (e) {
                console.log('api error99', e);
                return reject({message: Constants.SOMETHING_WRONG});
              }
            })
            .catch(err => {
              console.log('chk post errr::::', err);
              reject(err);
            });
        } catch (e) {
          console.log('eroor:::::::::', e);
        }
      });
    }
  }
  // ************************************************* PUT **************************************************
  async putCard(endpoint, data, UserToken, headers) {
    if (!global.isConnected) {
      return new Promise((resolve, reject) => {
        reject({message: Constants.NO_NETWORK});
      });
    } else {
      return new Promise(async (resolve, reject) => {
        console.log('UserToken11 post', UserToken);
        console.log('url11 post', `${BASE_URL_SAITACARDS}${endpoint}`);
        console.log('params11 post', JSON.stringify(data));
        // console.log('SELECTED_LANGUAGE', await getData(Constants.SELECTED_LANGUAGE));
        console.log(
          'encodeData:::post',
          data != null ? this.encodeData(data) : null,
        );
        try {
          fetch(`${BASE_URL_SAITACARDS}${endpoint}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: UserToken ? 'Bearer ' + UserToken : '',
              ...headers,
            },

            body: data != null ? this.encodeData(data) : null,
          })
            .then(async res => {
              console.log('res::::', res);
              try {
                const jsonVal = await res.json();
                console.log('Json Response:endpoint', endpoint, jsonVal);
                if (jsonVal.code == 409) {
                  this.refreshTheToken()
                    .then(async res => {
                      console.log('refresh token resp:::::::');
                      const response = await this.postToken(endpoint, data);
                      return resolve(response);
                      //  this.postToken(endpoint, data)
                    })
                    .catch(err => {
                      console.log('chk refresh errrrr post', err);
                      return reject(err);
                    });
                } else {
                  if (
                    jsonVal.message?.toLowerCase()?.includes('access token')
                  ) {
                    navigationRef.navigate('CardSplash');
                    return reject({message: Constants.ACCESS_TOKEN_EXPIRED});
                  }
                  if (!jsonVal.status) {
                    if (jsonVal.message == undefined) {
                      return reject({message: Constants.SOMETHING_WRONG});
                    }
                    return reject(jsonVal);
                  } else {
                    return resolve(jsonVal);
                  }
                }
              } catch (e) {
                console.log('api error99', e);
                return reject({message: Constants.SOMETHING_WRONG});
              }
            })
            .catch(err => {
              console.log('chk post errr::::', err);
              reject(err);
            });
        } catch (e) {
          console.log('eroor:::::::::', e);
        }
      });
    }
  }

  async putCardVault(endpoint, data, UserToken, headers = {}) {
    if (!global.isConnected) {
      return new Promise((resolve, reject) => {
        reject({message: Constants.NO_NETWORK});
      });
    } else {
      return new Promise(async (resolve, reject) => {
        console.log('UserToken11 put', UserToken);
        console.log('url11 put', `${VAULT_CARD_URL}${endpoint}`);
        console.log('params11 put', JSON.stringify(data));
        // console.log('SELECTED_LANGUAGE', await getData(Constants.SELECTED_LANGUAGE));
        console.log(
          'encodeData:::put',
          data != null ? this.encodeData(data) : null,
        );
        const config = {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-Merchant-ID': Singleton.getInstance().xMerchantId,
            Authorization: UserToken ? 'Bearer ' + UserToken : '',
            ...headers,
          },
          body: data,
        };
        console.log('config::::::', config);
        try {
          fetch(`${VAULT_CARD_URL}${endpoint}`, config)
            .then(async res => {
              console.log('res::::', JSON.stringify(res));
              try {
                const jsonVal = await res.json();
                console.log('Json Response:endpoint', endpoint, jsonVal);

                if (jsonVal.error) {
                  if (jsonVal.message == undefined) {
                    return reject({message: Constants.SOMETHING_WRONG});
                  }
                  return reject({message: jsonVal?.message});
                } else {
                  return resolve(jsonVal);
                }
              } catch (e) {
                console.log('api error99', e);
                return reject({message: Constants.SOMETHING_WRONG});
              }
            })
            .catch(err => {
              console.log('chk put errr::::', err);
              reject(err);
            });
        } catch (e) {
          console.log('eroor:::::::::', e);
        }
      });
    }
  }
  async getCard2(endpoint, UserToken) {
    console.log('url11aqdq', `${BASE_URL_SAITACARDS}${endpoint}`);
    console.log('UserTokenadsfasd', UserToken);
    if (!global.isConnected) {
      return new Promise((resolve, reject) => {
        reject({message: Constants.NO_NETWORK});
      });
    } else {
      return new Promise(async (resolve, reject) => {
        fetch(`${BASE_URL_SAITACARDS}${endpoint}`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'content-language': 'en',
            Authorization: UserToken,
          },
        })
          .then(async res => {
            console.log('res:::::3234234', res);
            try {
              let jsonVal = await res.json();
              if (jsonVal.code == 409) {
                this.refreshTheToken()
                  .then(async res => {
                    const UserToken = await Singleton.getInstance().newGetData(
                      Constants.access_token,
                    );
                    const response = await this.get(endpoint, UserToken);
                    return resolve(response);
                    // this.get(endpoint, UserToken)
                  })
                  .catch(err => {
                    // console.log('chk refresh errrrrget', err);
                  });
              } else {
                if (!res.ok) {
                  if (jsonVal.message == undefined) {
                    return reject({message: Constants.SOMETHING_WRONG});
                  }
                  return reject(jsonVal);
                }
                return resolve(jsonVal);
              }
            } catch (e) {
              return reject({message: Constants.SOMETHING_WRONG});
            }
          })
          .catch(reject);
      });
    }
  }
};

export {APIClient};
