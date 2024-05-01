import {
  BASE_URL,
  BASE_URL_CARDS_CENTRALISED,
  BASE_URL_HUOBI,
  BASE_URL_SAITACARDS,
} from '../Endpoints';
import RNFetchBlob from 'rn-fetch-blob';
import * as Constants from './../Constant';
import NodeRSA from 'node-rsa';
import { fetch as ssl_fetch } from 'react-native-ssl-pinning';
import { ActionConst, Actions } from 'react-native-router-flux';
import Singleton from '../Singleton';

export const disableAllSecurity = true;
export const sslCertificateList = [
  'saitaCardStage',
  'saitaCardLive',
  'saitaProStage',
  'saitaProLive',
  'saitaDevServer',
  'saitaCardCentralizedStage',
  'saitaCardCentralizedLive',
  'devCard',
  'devCentralize',
];
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
      Singleton.showAlert(Constants.NO_NETWORK)
      return new Promise((resolve, reject) => {
        reject({ message: Constants.NO_NETWORK });
      });
    } else {
      return new Promise((resolve, reject) => {
        console.warn('MM', 'UserToken',endpoint, UserToken);
        console.warn('MM', 'url', `${BASE_URL}${endpoint}`);
        ssl_fetch(`${BASE_URL}${endpoint}`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'x-card-module': "d7be2982f87cwyv2db2908hew9u2b3fuyv877gcw2fb39297gf2b",
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
                  return reject({ message: Constants.SOMETHING_WRONG });
                }
                return reject(jsonVal);
              }
              return resolve(jsonVal);
            } catch (e) {
              // console.warn('MM', 'api error', e);
              return reject({ message: Constants.SOMETHING_WRONG });
            }
          })
          .catch(error => {
            let msg = JSON.parse(error.bodyString);
            console.warn('MM', 'msg err::::::get----', msg);
            if (error?.status == 400) {
              if (msg?.invalid) {
                Actions.currentScene != 'ConfirmPin' &&
                  Actions.ConfirmPin({ refreshToken: true });
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
      Singleton.showAlert(Constants.NO_NETWORK)
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
        reject({ message: Constants.NO_NETWORK });
      });
    } else {
      return new Promise((resolve, reject) => {
        ssl_fetch(`${endpoint}`, {
          method: 'GET',
          disableAllSecurity: true,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'x-card-module': "d7be2982f87cwyv2db2908hew9u2b3fuyv877gcw2fb39297gf2b",
            'api-access-token': UserToken,
          },
          sslPinning: {
            certs: sslCertificateList,
          },
        })
          .then(async res => {
             console.warn('MM','res', res);
            try {
              let jsonVal = await res.json();
              console.warn('MM','Json Response:', jsonVal);
              if (res.status != 200) {
                if (jsonVal.message == undefined) {
                  return reject({ message: Constants.SOMETHING_WRONG });
                }
                return reject(jsonVal);
              }
              return resolve(jsonVal);
            } catch (e) {
              return reject({ message: Constants.SOMETHING_WRONG });
            }
          })
          .catch(reject);
      });
    }
    //}
  }

  post(endpoint, data, UserToken) {
    if (global.disconnected) {
      Singleton.showAlert(Constants.NO_NETWORK)
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
        reject({ message: Constants.NO_NETWORK });
      });
    } else {
      return new Promise(async (resolve, reject) => {
        console.warn('MM', 'UserToken11', UserToken);
        console.warn('MM', 'url11', `${BASE_URL}${endpoint}`);
        console.warn('MM', 'params11', JSON.stringify(data));
        let encodedData = await this.encode_saitamask_data(data)
        console.warn('MM', 'await this.encodeData(data::::::', encodedData);
        ssl_fetch(`${BASE_URL}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-card-module': "d7be2982f87cwyv2db2908hew9u2b3fuyv877gcw2fb39297gf2b",
            Authorization: UserToken || undefined,
          },
          sslPinning: {
            certs: sslCertificateList,
          },
          disableAllSecurity: true,
          // body: data != null ? JSON.stringify(data) : null,
          body: data != null ? encodedData : null,
        })
          .then(async res => {
            // console.log("res::::::", res);
            try {
              let jsonVal = await res.json();
              // console.warn('MM', 'jsonVal::::::', jsonVal,endpoint);
              if (res.status != 200) {
                if (jsonVal.message == undefined) {
                  return reject({ message: Constants.SOMETHING_WRONG });
                }
                return reject(jsonVal);
              }
              return resolve(jsonVal);
            } catch (e) {
              // console.warn('MM', 'api error', e);
              return reject({ message: Constants.SOMETHING_WRONG });
            }
          })
          .catch(error => {
            let msg = JSON.parse(error?.bodyString);
            if (error?.status == 400) {
              if (msg?.invalid) {
                Actions.currentScene != 'ConfirmPin' &&
                  Actions.ConfirmPin({ refreshToken: true });
              } else if (msg?.logout) {
                Actions.currentScene != 'ConfirmPin' &&
                  Actions.ConfirmPin({ loginAgain: true });
              }
            }
            // console.warn('MM', `msg err::::::post`, msg);
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
        //     //console.warn('MM','error', e);
        //     return reject({ message: Constants.SOMETHING_WRONG });
        //   }
        // })
        // .catch(reject);
      });
    }
  }

  postFile(endpoint, data, UserToken) {
    if (global.disconnected) {
      Singleton.showAlert(Constants.NO_NETWORK)
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
        reject({ message: Constants.NO_NETWORK });
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
            'x-card-module': "d7be2982f87cwyv2db2908hew9u2b3fuyv877gcw2fb39297gf2b",
            'Content-Type': 'multipart/form-data',
          },
          [data]


        )
          .then(async res => {
            // console.warn('MM', 'res', res.json());
            try {
              let jsonVal = await res.json();
              return resolve(jsonVal);
            } catch (e) {
              return reject({ message: Constants.SOMETHING_WRONG });
            }
          })
          .catch(reject);
      });
    }
  }
  postFileCards(endpoint, data, UserToken) {
    if (global.disconnected) {
      Singleton.showAlert(Constants.NO_NETWORK)
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
        reject({ message: Constants.NO_NETWORK });
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
            'x-card-module': "d7be2982f87cwyv2db2908hew9u2b3fuyv877gcw2fb39297gf2b",
            'Content-Type': 'multipart/form-data',
          },
          data


        )
          .then(async res => {
            // console.warn('MM', 'res', res.json());
            try {
              let jsonVal = await res.json();
              return resolve(jsonVal);
            } catch (e) {
              return reject({ message: Constants.SOMETHING_WRONG });
            }
          })
          .catch(reject);
      });
    }
  }
  //   }
  postCards(endpoint, data) {
    if (global.disconnected) {
      Singleton.showAlert(Constants.NO_NETWORK)
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
        reject({ message: Constants.NO_NETWORK });
      });
    } else {
      return new Promise(async (resolve, reject) => {
        // console.warn('MM', 'url11crddd', `${BASE_URL_SAITACARDS}${endpoint}`);
        // console.warn('MM', 'params11', JSON.stringify(data));
        // console.warn('MM', 'encodeData::::::', await this.encodeData(data));
        ssl_fetch(`${BASE_URL_SAITACARDS}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-card-module': "d7be2982f87cwyv2db2908hew9u2b3fuyv877gcw2fb39297gf2b",
          },
          sslPinning: {
            certs: sslCertificateList,
          },
          body: data != null ? await this.encodeData(data) : {},
          disableAllSecurity: true,
        })
          .then(async res => {
            // console.warn('MM','res::::::', res);
            try {
              let jsonVal = await res.json();
              // console.warn('MM','jsonVal::::::', jsonVal);
              if (res.status != 200) {
                if (jsonVal.message == undefined) {
                  return reject({ message: Constants.SOMETHING_WRONG });
                }
                return reject(jsonVal);
              }
              return resolve(jsonVal);
            } catch (e) {
              // console.warn('MM', 'api error', e);
              return reject({ message: Constants.SOMETHING_WRONG });
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
      Singleton.showAlert(Constants.NO_NETWORK)
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
        reject({ message: Constants.NO_NETWORK });
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
            'x-card-module': "d7be2982f87cwyv2db2908hew9u2b3fuyv877gcw2fb39297gf2b",
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
                  return reject({ message: jsonVal.data.message });
                }
                return reject(jsonVal);
              }
              return resolve(jsonVal);
            } catch (e) {
              // console.warn('MM', 'api error', e);
              return reject({ message: Constants.SOMETHING_WRONG });
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
      Singleton.showAlert(Constants.NO_NETWORK)
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
        reject({ message: Constants.NO_NETWORK });
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
          body: data
          // body: data != null ? this.encodeData(data) : null,

        })
          .then(async res => {
            try {
              let jsonVal = await res.json();
              // console.warn('MM', 'res', endpoint, jsonVal);
              if (res.status != 200) {
                if (jsonVal.message == undefined) {
                  return reject({ message: jsonVal.data.message });
                }
                return reject(jsonVal);
              }
              return resolve(jsonVal);
            } catch (e) {
              // console.warn('MM', 'api error', e);
              return reject({ message: Constants.SOMETHING_WRONG });
            }
          })
          .catch(error => {
            // let msg = JSON.parse(error.bodyString);
            let msg = error
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
      Singleton.showAlert(Constants.NO_NETWORK)
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
        reject({ message: Constants.NO_NETWORK });
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
            'x-card-module': "d7be2982f87cwyv2db2908hew9u2b3fuyv877gcw2fb39297gf2b",
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
              console.warn('MM', 'res', endpoint, jsonVal);
              if (res.status != 200) {
                if (jsonVal.message == undefined) {
                  return reject({ message: Constants.SOMETHING_WRONG });
                }
                return reject(jsonVal);
              }
              return resolve(jsonVal);
            } catch (e) {
              console.warn('MM', 'api error', e);
              return reject({ message: Constants.SOMETHING_WRONG });
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
      Singleton.showAlert(Constants.NO_NETWORK)
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
        reject({ message: Constants.NO_NETWORK });
      });
    } else {
      return new Promise((resolve, reject) => {
        console.warn('MM', '\nUserToken11  centralisedApi', UserToken);
        console.warn('MM', '\nurl11', `${BASE_URL_CARDS_CENTRALISED}${endpoint}`);
        console.warn('MM', '\nparams11 centralisedApi', JSON.stringify(data) + '\n');
        console.warn('MM', '\nparams11 centralisedApi', this.encodeCentralisedData(data) + '\n');
        ssl_fetch(`${BASE_URL_CARDS_CENTRALISED}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-card-module': "d7be2982f87cwyv2db2908hew9u2b3fuyv877gcw2fb39297gf2b",
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
                  return reject({ message: jsonVal.data.message });
                }
                return reject(jsonVal);
              }
              return resolve(jsonVal);
            } catch (e) {
              console.warn('MM', 'api error', e);
              return reject({ message: Constants.SOMETHING_WRONG });
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
      Singleton.showAlert(Constants.NO_NETWORK)
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
        reject({ message: Constants.NO_NETWORK });
      });
    } else {
      return new Promise((resolve, reject) => {
        console.warn('MM', '\nUserToken11  postTokenCards', UserToken);
        console.warn('MM', '\nurl11', `${BASE_URL_CARDS_CENTRALISED}${endpoint}`);
        console.warn('MM', '\nparams11 postTokenCards', JSON.stringify(data) + '\n');
        ssl_fetch(`${BASE_URL_CARDS_CENTRALISED}${endpoint}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-card-module': "d7be2982f87cwyv2db2908hew9u2b3fuyv877gcw2fb39297gf2b",
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
                  return reject({ message: jsonVal.data.message });
                }
                return reject(jsonVal);
              }
              return resolve(jsonVal);
            } catch (e) {
              console.warn('MM', 'api error', e);
              return reject({ message: Constants.SOMETHING_WRONG });
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
      Singleton.showAlert(Constants.NO_NETWORK)
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
        reject({ message: Constants.NO_NETWORK });
      });
    } else {
      return new Promise((resolve, reject) => {
        console.warn('MM', '\nUserToken11  postTokenCards', UserToken);
        console.warn('MM', '\nurl11', `${BASE_URL_SAITACARDS}${endpoint}`);
        console.warn('MM', '\nparams11 postTokenCards', JSON.stringify(data) + '\n');
        ssl_fetch(`${BASE_URL_SAITACARDS}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-card-module': "d7be2982f87cwyv2db2908hew9u2b3fuyv877gcw2fb39297gf2b",
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
                  return reject({ message: jsonVal.data.message });
                }
                return reject(jsonVal);
              }
              return resolve(jsonVal);
            } catch (e) {
              console.warn('MM', 'api error', e);
              return reject({ message: Constants.SOMETHING_WRONG });
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
      Singleton.showAlert(Constants.NO_NETWORK)
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
        reject({ message: Constants.NO_NETWORK });
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
                  return reject({ message: jsonVal.data.message });
                }
                return reject(jsonVal);
              }
              return resolve(jsonVal);
            } catch (e) {
              console.log('MM', 'api error', e);
              return reject({ message: Constants.SOMETHING_WRONG });
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
    return new Promise((resolve, reject) => {
      const second = new NodeRSA(Constants.SAITAMASK_WALLET_KEY);
      second.setOptions({ encryptionScheme: 'pkcs1' });
      const enc = second.encrypt(data, 'base64');
      const dataa = {
        dataString: enc,
      };
      // console.warn('MM','enc::::', dataa);
      return resolve(JSON.stringify(dataa));
    })
  };

  encodeData = data => {
    // return JSON.stringify(data)
    const second = new NodeRSA(Constants.CARD_KEY);
    second.setOptions({ encryptionScheme: 'pkcs1' });
    const enc = second.encrypt(data, 'base64');
    const dataa = {
      dataString: enc,
    };
    // console.warn('MM','enc::::', dataa);
    return JSON.stringify(dataa);
  };
  encodeCentralisedData = data => {
    const second = new NodeRSA(Constants.CENTRALIZED_KEY);
    second.setOptions({ encryptionScheme: 'pkcs1' });
    const enc = second.encrypt(data, 'base64');
    const dataa = {
      dataString: enc,
    };
    //console.warn('MM','enc::::', dataa);
    return JSON.stringify(dataa);
  };

  decryption = async data => {
    const key = new NodeRSA(Constants.BANK_DETAIL_PRIVATEKEY);
    key.setOptions({ encryptionScheme: 'pkcs1' });
    const decrypted = await key.decrypt(data, 'utf8');
    let originalText = await JSON.parse(decrypted);
    return originalText;
  };

  onCardTokenExpired = async () => {
    try {
      Actions.currentScene != 'Dashboard' &&
        Singleton.showAlert(Constants.SESSION_OUT);
      await Singleton.getInstance().removeItemNew(Constants.access_token_cards);
      await Singleton.getInstance().removeItemNew(Constants.gold_access_token);
      await Singleton.getInstance().removeItemNew(
        Constants.diamond_access_token,
      );
      await Singleton.getInstance().removeItemNew(Constants.black_access_token);
      Actions.currentScene != 'Dashboard' &&
        Actions.Main({ type: ActionConst.RESET });
    } catch (error) {
      console.warn('MM', '__onCardTokenExpired__>>', error);
      Actions.currentScene != 'Dashboard' &&
        Actions.Main({ type: ActionConst.RESET });
    }
  };
};

export { APIClient };
