
import {
    API_LOGIN_CARDS, API_SIGNUP_CARDS, API_CARDS_SEND_OTP, API_CARDS_USERDETAIL, API_CARDS_DETAIL,
    API_CARDS_SAVETX, API_CARDS_SENDOTP, API_GET_CARDLIST, API_APPLY_ANOTHER_CARD, API_CREATE_WALLET_SAITACARD, API_COINLIST_SAITACARD,
    API_FETCH_BANK_DETAILS, API_CARD_HISTORY, API_USERCARD_LIST, API_FORGETCARDPASSWORD, API_FORGETCARD_VERIFY, API_NEWPASSWORDCARD,
    API_CHANGE_PASSWORDCARD,
    API_APPLY_VIRTUAL_ADDRESS,
    API_CARDS_SENDOTP_MOBILE,
    SIGN_UP,
    RESEND_OTP,
    CONFIRM_PHONE,
    EMAIL_ADD,
    SET_USER_DETAIL,
    USER_LOGOUT,
    USER_LOGIN,
    GET_USER_PROFILE,
    GET_KYC_ID,
    REQUEST_VAULT_CARD,
    FORGET_OTP_SEND,
    FORGET_OTP_CONFIRM,
    FORGET_PASSWORD_CONFIRM,
    LOG_OUT,
    CHANGE_PASSWORD,
    GET_CUSTOMER_PROFILE,
    KYC_DATA,
    ADDITIONAL_INFO,
    cardRequestAddress,
    FINISH_KYC,
    requestCard,
    CREATE_WALLETS,
    BlockCard,
    unblockCard,
    otpForCardUnblock,
    otpForCardBlock,
    getValutWalletList,
    GET_WALLET_LIST,
    otpForCardDetails,
    otpForCardDetailsCode,
    CARD_TRANSACTION_HISTORY,
    USER_CARD_LIST,
    VAULT_DETAILS,
    KYC_START,
    CONFIRM_PHONE_OTP,
    GET_SIGNUP_CODE,
    GET_COUNTRY_CODES,
    GET_VAULT_SETTINGS,
    cardLimits,
    confirmRecharge,
    rechargeConversion,
    confirmCardFee,
    payCardFee,
    cardPrice,
    CARD_WALLETS,
    CARD_PRICES
} from '../../Endpoints';
import { APIClient } from "../../Api";
import * as Constants from '../../Constant'
import Singleton from '../../Singleton';
import { CARD_USER_DETAIL } from './types';
import { Alert } from 'react-native';
import NodeRSA from 'node-rsa';


// ********************************* loginCards   API********************************************* //

export const loginCards = ({ data }) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            //console.warn('MM','loginCards::::', data)
            APIClient.getInstance().postCards(API_LOGIN_CARDS, data,).then((response) => {
                let result = response;
                resolve(result);
            })
                .catch((error) => {
                    //console.warn('MM',"error loginCards-- ", error)
                    reject(error);
                });
        });
    };
};

// ********************************* signupCards   API********************************************* //

export const signupCards = ({ data }) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            //console.warn('MM','signupCards token::::', data)
            APIClient.getInstance().postCards(API_SIGNUP_CARDS, data,).then((response) => {
                let result = response;
                resolve(result);
            })
                .catch((error) => {
                    //console.warn('MM',"error signupCards -- ", error)
                    reject(error);
                });
        });
    };
};
// ********************************* signupCards Virtual   API********************************************* //

export const VirtualForm = ({ data , access_token }) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            //console.warn('MM','signupCards token::::', data)
            APIClient.getInstance().postTokenCards(API_APPLY_VIRTUAL_ADDRESS, data, access_token).then((response) => {
                let result = response;
                resolve(result);
            })
                .catch((error) => {
                    //console.warn('MM',"error signupCards -- ", error)
                    reject(error);
                });
        });
    };
};


// ********************************* sendotp   API********************************************* //

// export const sendOtpCards = ({ data }) => {
//     return (dispatch) => {
//         return new Promise((resolve, reject) => {
//             //console.warn('MM','sendotp token::::', data)
//             APIClient.getInstance().postCards(API_CARDS_SEND_OTP, data,).then((response) => {
//                 let result = response;
//                 resolve(result);
//             })
//                 .catch((error) => {
//                     //console.warn('MM',"error sendotp token-- ", error)
//                     reject(error); 
//                 });
//         });
//     };
// };


// ********************************* verify otp   API********************************************* //

// export const verifyOtpCards = ({ data }) => {
//     return (dispatch) => {
//         return new Promise((resolve, reject) => {
//             //console.warn('MM','verifyOtpCards token::::', data)
//             APIClient.getInstance().postCards(API_CARDS_VERIFY_OTP, data,).then((response) => {
//                 let result = response;
//                 resolve(result);
//             })
//                 .catch((error) => {
//                     //console.warn('MM',"error verifyOtpCards token-- ", error)
//                     reject(error);
//                 });
//         });
//     };
// };


// ********************************* verify otp   API********************************************* //

export const sendOtpCard = ({ data }) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            //console.warn('MM','sendOtpCard token::::', data)
            APIClient.getInstance().postCards(API_CARDS_SENDOTP, data,).then((response) => {
                let result = response;
                resolve(result);
            })
                .catch((error) => {
                    //console.warn('MM',"error sendOtpCard token-- ", error)
                    reject(error);
                });
        });
    };
};
// ********************************* verify otp mobile   API********************************************* //

export const sendOtpCardMobile = ({ data }) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            //console.warn('MM','sendOtpCard token::::', data)
            APIClient.getInstance().postCards(API_CARDS_SENDOTP_MOBILE, data,).then((response) => {
                let result = response;
                resolve(result);
            })
                .catch((error) => {
                    //console.warn('MM',"error sendOtpCard token-- ", error)
                    reject(error);
                });
        });
    };
};

// ********************************* cardsDetail   API********************************************* //

export const getCardsDetailApi = ({ data, access_token }) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            APIClient.getInstance().postTokenCards(API_CARDS_DETAIL, data, access_token).then((response) => {
                let result = response;
                resolve(result);
            })
                .catch((error) => {
                    //console.warn('MM',"error cardsDetail token-- ", error)
                    reject(error);
                });
        });
    };
};


// ********************************* cardsDetail   API********************************************* //

export const sendCardPaymentrx = ({ data, access_token }) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            //console.warn('MM','sendCardPaymentrx ::::', data, access_token)
            APIClient.getInstance().postTokenCards(API_CARDS_SAVETX, data, access_token).then((response) => {
                //console.warn('MM','sendCardPaymentrx response::::', response)
                resolve(response);
            })
                .catch((error) => {
                    //console.warn('MM',"error sendCardPaymentrx token-- ", error)
                    reject(error);
                });
        });
    };
};

// ********************************* get user data and kyc status********************************************* //

export const getUserCardDetail = ({ access_token }) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            console.warn('MM','getUserCardDetail token::::', access_token)
            APIClient.getInstance().getCards(API_CARDS_USERDETAIL, access_token,).then((response) => {
                let result = response.data;
                resolve(result);
            })
                .catch((error) => {
                    //console.warn('MM',"error getUserCardDetail token-- ", error)
                    reject(error);
                });
        });
    };
};
// ********************************* get card List ********************************************* //
export const getCardList = ({ }) => {
    return (dispatch) => {
        const data = { 'page': 1 }
        return new Promise(async (resolve, reject) => {
            let access_token = await  Singleton.getInstance().newGetData(Constants.access_token_cards)
            APIClient.getInstance().getCards(API_GET_CARDLIST,access_token ).then((response) => {
                let result = response.data;
                //console.warn('MM',"result getCardList-- ", result)
                resolve(result);
            })
                .catch((error) => {
                    //console.warn('MM',"error getCardList-- ", error)
                    reject(error);
                });
        });
    };
};



// ********************************* get usercard List ********************************************* //
export const getUserCardList = ({ access_token }) => {

    return (dispatch) => {
        return new Promise((resolve, reject) => {
            //console.warn('MM','getUserCardList token::::', access_token)
            APIClient.getInstance().getCards(API_USERCARD_LIST, access_token,).then((response) => {
                //console.warn('MM','getUserCardList response :::', response)
                let result = response.data;
                resolve(result);
            })
                .catch((error) => {
                    //console.warn('MM',"error getUserCardList token-- ", error)
                    reject(error);
                });
        });
    };


};


// ********************************* apply another card ********************************************* //
export const applyAnotherCard = ({ data, access_token }) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            APIClient.getInstance().postTokenCards(API_APPLY_ANOTHER_CARD, data, access_token).then((response) => {
                let result = response;
                //console.warn('MM',"result applyAnotherCard-- ", result)
                resolve(result);
            })
                .catch((error) => {
                    //console.warn('MM',"error applyAnotherCard-- ", error)
                    reject(error);
                });
        });
    };
};

// ********************************* get wallet Address card ********************************************* //
export const getUserCardAddress = ({ data }) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            APIClient.getInstance().centralisedApi(API_CREATE_WALLET_SAITACARD, data, '').then((response) => {
                let result = response.data;
         //  console.warn('MM',"result getUserCardAddress-- ", result);
                resolve(result);
            })
                .catch((error) => {
             //  console.warn('MM',"error getUserCardAddress-- ", error)
                    reject(error);
                });
        });
    };
};
// ********************************* getCardTokenList ********************************************* //
export const getCardTokenList = ({ access_token }) => {
    return (dispatch) => {

        return new Promise((resolve, reject) => {
            // console.log('IN getCardTokenList');
            APIClient.getInstance().centralisedApiget(API_COINLIST_SAITACARD, null, access_token).then((response) => {
                let result = response.data;
         //  console.warn('MM',"result getCardTokenList-- ", response);
                resolve(result);
            })
                .catch((error) => {
                    //console.warn('MM',"error getCardTokenList-- ", error)
                    reject(error);
                });
        });
    };
};
// ********************************* get card List ********************************************* //
export const fetchBankDetails = ({ data, access_token }) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            APIClient.getInstance().postHyperCards(API_FETCH_BANK_DETAILS, data, access_token).then((response) => {
                let result = response.data;
                //APIClient.decryption(result) 
                //console.warn('MM',"result fetchBankDetails-- ", result, APIClient.getInstance().decryption(result))
                resolve(APIClient.getInstance().decryption(result));
            })
                .catch((error) => {
                    //console.warn('MM',"error fetchBankDetails-- ", error)
                    reject(error);
                });
        });
    };
};
// ********************************* get card history ********************************************* //
export const fetchCardHistory = ({ data, access_token }) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            //console.warn('MM',"data fetchCardHistory-- ", data)
            APIClient.getInstance().postTokenCards(API_CARD_HISTORY, data, access_token).then((response) => {
                let result = response.data;
                //console.warn('MM',"result fetchCardHistory-- ", result)
                resolve(result);
            })
                .catch((error) => {
                    //console.warn('MM',"error fetchCardHistory-- ", error)
                    reject(error);
                });
        });
    };
};




// ********************************* forget card API********************************************* //

export const forgetCardOtp = ({ data }) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            APIClient.getInstance().postCards(API_FORGETCARDPASSWORD, data,).then((response) => {
                let result = response;
                resolve(result);
            })
                .catch((error) => {
                    //console.warn('MM',"error forgetCardOtp token-- ", error)
                    reject(error);
                });
        });
    };
};

// ********************************* verify forget card API********************************************* //

export const verifyForgotOtpCard = ({ data }) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            APIClient.getInstance().postCards(API_FORGETCARD_VERIFY, data,).then((response) => {
                let result = response;
                resolve(result);
            })
                .catch((error) => {
                    //console.warn('MM',"error verifyForgotOtpCard token-- ", error)
                    reject(error);
                });
        });
    };
};

// ********************************* setnew password card API********************************************* //

export const setNewPasswordCard = ({ data }) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            APIClient.getInstance().postCards(API_NEWPASSWORDCARD, data).then((response) => {
                let result = response;
                resolve(result);
            })
                .catch((error) => {
                    //console.warn('MM',"error setNewPasswordCard token-- ", error)
                    reject(error);
                });
        });
    };
};

// ********************************* change password card API********************************************* //

export const changePasswordCard = ({ data, access_token }) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            APIClient.getInstance().postTokenCards(API_CHANGE_PASSWORDCARD, data, access_token).then((response) => {
                let result = response;
                resolve(result);
            })
                .catch((error) => {
                    //console.warn('MM',"error changePasswordCard token-- ", error)
                    reject(error);
                });
        });
    };
};
// ********************************* vault card API********************************************* //

export const getSignUPPhoneCode = ({ data }) => dispatch => {
    return new Promise((resolve, reject) => {
        let headers = {
            "X-Version": Singleton.getInstance().xVErsion,
            "X-Merchant-ID": Singleton.getInstance().xMerchantId,
        }
        console.log("headers:::::::", headers);
        APIClient.getInstance().postCardVault(GET_SIGNUP_CODE, JSON.stringify(data), "", headers).then(response => {
            let result = response.data;
            console.log('getSignUPPhoneCode success **** ' + JSON.stringify(result));
            resolve(result);
        }).catch(error => {
            console.log("error:::::::", typeof error);
            let errorMessage = error.message;
            if (!errorMessage)
                errorMessage = 'Something Went Wrong '
            console.log('getSignUPPhoneCode Error ****', JSON.stringify(error), error.message);
            reject(errorMessage);
        });
    });
}

/******************************************************************************************/
export const confirmPhoneOtp = ({ data }) => dispatch => {
    console.log(data,'datadatadatadatadata');
    let newData = {
        ...data,
        fingerPrint: Singleton.getInstance().fingerPrintSeed
    }
    return new Promise((resolve, reject) => {
        APIClient.getInstance().postCards(CONFIRM_PHONE_OTP, newData).then(response => {
            let result = response;
            console.log('confirmPhoneOtp success **** ' + JSON.stringify(result));
            resolve(result);
        }).catch(error => {
            let errorMessage = error.message;
            if (!errorMessage)
                errorMessage = 'Something Went Wrong '
            console.log('getSignUPPhoneCode Error ****', JSON.stringify(error));
            reject(errorMessage);
        });
    });
}

/******************************************************************************************/
export const addEmail = ({ data }) => dispatch => {
    return new Promise((resolve, reject) => {
        Singleton.getInstance()
        .newGetData(Constants.CARD_TOKEN).then(token => {
            if (token) {
                APIClient.getInstance().postCards(EMAIL_ADD, data, token).then(response => {
                    let result = response;
                    console.log('confirmPhoneOtp success **** ' + JSON.stringify(result));
                    resolve(result);
                }).catch(error => {
                    let errorMessage = error.message;
                    if (!errorMessage)
                        errorMessage = 'Something Went Wrong '
                    console.log('getSignUPPhoneCode Error ****', JSON.stringify(error));
                    reject(errorMessage);
                });
            }
        })
    });
}
/******************************************************************************************/
export const userLogIn = ({ data }) => dispatch => {
    return new Promise((resolve, reject) => {
        let headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            "X-Merchant-ID": Singleton.getInstance().xMerchantId,
        }
        APIClient.getInstance().postCardVault(USER_LOGIN, data, '', headers).then(response => {
            let result = response;
            console.log('userLogIn success **** ' + JSON.stringify(result));
            resolve(result);
        }).catch(error => {
            let errorMessage = error.message;
            if (!errorMessage)
                errorMessage = 'Something Went Wrong '
            console.log('userLogIn Error ****', JSON.stringify(error));
            reject(errorMessage);
        });
    });
}

/******************************************************************************************/
export const kycData = () => dispatch => {
    return new Promise((resolve, reject) => {
        Singleton.getInstance()
      .newGetData(Constants.CARD_TOKEN).then(token => {
            if (token) {
                APIClient.getInstance().getCards(KYC_DATA, token).then(response => {
                    let result = response;
                    console.log('kycData success **** ' + JSON.stringify(result));
                    resolve(result);
                }).catch(error => {
                    let errorMessage = error.message;
                    if (!errorMessage)
                        errorMessage = 'Something Went Wrong '
                    console.log('kycData Error ****', JSON.stringify(error));
                    reject(errorMessage);
                });
            } else {
                reject(Constants.ACCESS_TOKEN_EXPIRED);
            }
        });
    });
}

/******************************************************************************************/
export const customerProfile = () => dispatch => {
    return new Promise((resolve, reject) => {
        Singleton.getInstance()
      .newGetData(Constants.CARD_TOKEN).then(token => {
        console.log(token,'tokentokentokentoken');
            if (token) {
                APIClient.getInstance().getCards(GET_CUSTOMER_PROFILE, token).then(response => {
                    let result = response;
                    console.log('customerProfile success **** ' + JSON.stringify(result));
                    resolve(result);
                }).catch(error => {
                    let errorMessage = error.message;
                    if (!errorMessage)
                        errorMessage = 'Something Went Wrong '
                    console.log('customerProfile Error ****', JSON.stringify(error));
                    reject(errorMessage);
                });
            } else {
                reject(Constants.ACCESS_TOKEN_EXPIRED);
            }
        });
    });
}

/******************************************************************************************/
export const resendPhoneOtp = ({ data }) => dispatch => {
    return new Promise((resolve, reject) => {
        APIClient.getInstance().postCards(RESEND_OTP, data).then(response => {
            let result = response.data;
            console.log('resendPhoneOtp success **** ' + JSON.stringify(result));
            resolve(result);
        }).catch(error => {
            console.log("error:::::::", typeof error);
            let errorMessage = error.message;
            if (!errorMessage)
                errorMessage = 'Something Went Wrong '
            console.log('resendPhoneOtp Error ****', JSON.stringify(error), error.message);
            reject(errorMessage);
        });
    });
}

/******************************************************************************************/
export const startKYC = () => dispatch => {
    let data = {
        "platform": "COMMON"
    }
    return new Promise((resolve, reject) => {
        Singleton.getInstance()
      .newGetData(Constants.CARD_TOKEN).then(token => {
            if (token) {
                APIClient.getInstance().postCards(KYC_START, data, token).then(response => {
                    let result = response;
                    console.log('startKYC success **** ' + JSON.stringify(result));
                    resolve(result);
                }).catch(error => {
                    let errorMessage = error.message;
                    if (!errorMessage)
                        errorMessage = 'Something Went Wrong '
                    console.log('startKYC Error ****', JSON.stringify(error));
                    reject(errorMessage);
                });
            } else {
                reject(Constants.ACCESS_TOKEN_EXPIRED);
            }
        });
    });
}
/******************************************************************************************/
export const updateCustomerProfile = ({ data }) => dispatch => {
    console.log("data:::::", data);
    return new Promise((resolve, reject) => {
        Singleton.getInstance()
      .newGetData(Constants.CARD_TOKEN).then(token => {
            if (token) {
                APIClient.getInstance().postCards(GET_CUSTOMER_PROFILE, data, token).then(response => {
                    let result = response;
                    console.log('customerProfile success **** ' + JSON.stringify(result));
                    resolve(result);
                }).catch(error => {
                    let errorMessage = error.message;
                    if (!errorMessage)
                        errorMessage = 'Something Went Wrong '
                    console.log('customerProfile Error ****', JSON.stringify(error));
                    reject(errorMessage);
                });
            } else {
                reject(Constants.ACCESS_TOKEN_EXPIRED);
            }
        });
    });
}
export const getVaultDetails = () => dispatch => {
    return new Promise((resolve, reject) => {
            APIClient.getInstance()
              .getCard2(VAULT_DETAILS)
              .then(res => {
                console.log('res::::::!1111', res);
                const key = new NodeRSA(Constants.BANK_DETAIL_PRIVATEKEY);
                key.setOptions({ encryptionScheme: "pkcs1" });
                const decrypted =  key.decrypt(res?.data,'utf8');
                let originalText =  JSON.parse(decrypted);
                console.log('res::::::!1111222', originalText);
                Singleton.getInstance().xMerchantId = originalText.X_MERCHANT_ID;
                Singleton.getInstance().xVErsion = originalText.X_VERSION;
                Singleton.getInstance().fingerPrintSeed = originalText.FINGERPRINT_SEED;
              })
              .catch(error => {
                console.log('res::::::!11112', error);
                reject(error)
              });
    });
}

/******************************************************************************************/
export const userCardList = () => dispatch => {
    return new Promise((resolve, reject) => {
        Singleton.getInstance()
      .newGetData(Constants.CARD_TOKEN).then(token => {
            if (token) {
                APIClient.getInstance().getCards(USER_CARD_LIST, token).then(response => {
                    let result = response;
                    console.log('userCardList success **** ' + JSON.stringify(result));
                    resolve(result);
                }).catch(error => {
                    let errorMessage = error.message;
                    if (!errorMessage)
                        errorMessage = 'Something Went Wrong '
                    console.log('userCardList Error ****', JSON.stringify(error));
                    reject(errorMessage);
                });
            } else {
                reject(Constants.ACCESS_TOKEN_EXPIRED);
            }
        });
    });
}

/******************************************************************************************/
export const cardTransactions = (data) => dispatch => {
    return new Promise((resolve, reject) => {
        Singleton.getInstance()
      .newGetData(Constants.CARD_TOKEN).then(token => {
            if (token) {
                APIClient.getInstance().getCards(CARD_TRANSACTION_HISTORY + `${data.cardId}?cp=${data.cardProgram}&offset=${data.offset}&size=${data.limit}`, token).then(response => {
                    let result = response;
                    console.log('cardTransactions success **** ' + JSON.stringify(result));
                    resolve(result);
                }).catch(error => {
                    let errorMessage = error.message;
                    if (!errorMessage)
                        errorMessage = 'Something Went Wrong '
                    console.log('cardTransactions Error ****', JSON.stringify(error));
                    reject(errorMessage);
                });
            } else {
                reject(Constants.ACCESS_TOKEN_EXPIRED);
            }
        });
    });
}

/******************************************************************************************/
export const cardDetailsCode = (data) => dispatch => {
    return new Promise((resolve, reject) => {
        Singleton.getInstance()
      .newGetData(Constants.CARD_TOKEN).then(token => {
            if (token) {
                APIClient.getInstance().getCards(otpForCardDetailsCode(data.cardId, data.cardProgram), token).then(response => {
                    let result = response;
                    console.log('cardDetailsCode success **** ' + JSON.stringify(result));
                    resolve(result);
                }).catch(error => {
                    let errorMessage = error.message;
                    if (!errorMessage)
                        errorMessage = 'Something Went Wrong '
                    console.log('cardDetailsCode Error ****', JSON.stringify(error));
                    reject(errorMessage);
                });
            } else {
                reject(Constants.ACCESS_TOKEN_EXPIRED);
            }
        });
    });
}

/******************************************************************************************/
export const getCardDetails = ({ data }) => dispatch => {
    return new Promise((resolve, reject) => {

        Singleton.getInstance()
      .newGetData(Constants.CARD_TOKEN).then(token => {
            let newData = {
                "code": data.code,
                "publicKey": data.publicKey,

            }
            let headers = {
                "Authorization": `Bearer ${token}`
            }
            if (token) {
                APIClient.getInstance().postCardVault(otpForCardDetails(data.cardId, data.cardProgram), JSON.stringify(newData), token, headers).then(response => {
                    let result = response;
                    console.log('cardDetails success **** ' + JSON.stringify(result));
                    resolve(result);
                }).catch(error => {
                    let errorMessage = error.message;
                    if (!errorMessage)
                        errorMessage = 'Something Went Wrong '
                    console.log('cardDetails Error ****', JSON.stringify(error));
                    reject(errorMessage);
                });
            } else {
                reject(Constants.ACCESS_TOKEN_EXPIRED);
            }
        });
    });
}
/******************************************************************************************/
export const logOut = req => {
    return new Promise((resolve, reject) => {
        Singleton.getInstance()
      .newGetData(Constants.CARD_TOKEN).then(token => {
            APIClient.getInstance()
                .postCardVault(LOG_OUT, req, token)
                .then(response => {
                    let result = response.data;
                    console.log('user logout success **** ' + JSON.stringify(result));
                    resolve(result);
                })
                .catch(error => {
                    let errorMessage = error.message;
                    if (!errorMessage) errorMessage = 'Something Went Wrong ';
                    console.log('user logout  Error ****', JSON.stringify(error));
                    reject(errorMessage);
                });
        });
    });
};

/******************************************************************************************/
export const changePassword = ({ data }) => {
    return new Promise((resolve, reject) => {
        Singleton.getInstance()
      .newGetData(Constants.CARD_TOKEN).then(token => {
            APIClient.getInstance().putCardVault(CHANGE_PASSWORD, JSON.stringify(data), token).then(response => {
                let result = response.data;
                console.log('change password success **** ' + JSON.stringify(result));
                resolve(result);
            }).catch(error => {
                console.log("error:::::::", typeof error);
                let errorMessage = error.message;
                if (!errorMessage)
                    errorMessage = 'Something Went Wrong '
                console.log('change password  Error ****', JSON.stringify(error), error.message);
                reject(errorMessage);
            });
        });
    })
}

export const forgetOtpSend = ({ data })  => {
    let headers = {
        "X-Version": Singleton.getInstance().xVErsion,
        "X-Merchant-ID": Singleton.getInstance().xMerchantId,

    }
      return new Promise((resolve, reject) => {
          APIClient.getInstance().postCardVault(FORGET_OTP_SEND, JSON.stringify(data),"",headers).then(response => {
              let result = response.data;
              console.log('forget otp send    success **** ' + JSON.stringify(result));
              resolve(result);
          }).catch(error => {
              console.log("error:::::::", typeof error);
              let errorMessage = error.message;
              if (!errorMessage)
                  errorMessage = 'Something Went Wrong '
              console.log('forget otp send Error ****', JSON.stringify(error), error.message);
              reject(errorMessage);
          });
      });
  }
  /******************************************************************************************/
  export const verifyVaultForgotOtpCard = ({ data })  => {
    let headers = {
        "X-Version": Singleton.getInstance().xVErsion,
        "X-Merchant-ID": Singleton.getInstance().xMerchantId,

    }
      return new Promise((resolve, reject) => {
          APIClient.getInstance().postCardVault(FORGET_OTP_CONFIRM, JSON.stringify(data),"",headers).then(response => {
              let result = response.data;
              console.log('forget otp confirm success **** ' + JSON.stringify(result));
              resolve(result);
          }).catch(error => {
              console.log("error:::::::", typeof error);
              let errorMessage = error.message;
              if (!errorMessage)
                  errorMessage = 'Something Went Wrong '
              console.log('forget otp confirm Error ****', JSON.stringify(error), error.message);
              reject(errorMessage);
          });
      });
  }
  /******************************************************************************************/
  export const forgetPasswordConfirm = ({ data })  => {
    let headers = {
        "X-Version": Singleton.getInstance().xVErsion,
        "X-Merchant-ID": Singleton.getInstance().xMerchantId,
    }
      return new Promise((resolve, reject) => {
          APIClient.getInstance().postCardVault(FORGET_PASSWORD_CONFIRM, JSON.stringify(data),"",headers).then(response => {
              let result = response.data;
              console.log('forget confirm success **** ' + JSON.stringify(result));
              resolve(result);
          }).catch(error => {
              console.log("error:::::::", typeof error);
              let errorMessage = error.message;
              if (!errorMessage)
                  errorMessage = 'Something Went Wrong '
              console.log('forget confirm Error ****', JSON.stringify(error), error.message);
              reject(errorMessage);
          });
      });
  }

  export const getCardWalletList = ({ })  => {
    return new Promise((resolve, reject) => {
        Singleton.getInstance()
      .newGetData(Constants.CARD_TOKEN).then(token => {
            APIClient.getInstance().getCards(GET_WALLET_LIST, token).then(response => {
                let result = response.data;
                resolve(result);
            }).catch(error => {
                let errorMessage = error.message;
                if (!errorMessage)
                    errorMessage = 'Something Went Wrong '
                console.log('get wallet list Error ****', error);
                reject(errorMessage);
            });
        });
    });
};
export const getVaultCardWalletList = ({data})  => {
    return new Promise((resolve, reject) => {
        Singleton.getInstance()
      .newGetData(Constants.CARD_TOKEN).then(token => {
            APIClient.getInstance().getCardVault(getValutWalletList(data), token).then(response => {
                let result = response.currencies;
                console.log('get vault  wallet list success **** ' + JSON.stringify(result));
                resolve(result);
            }).catch(error => {
                let errorMessage = error.message;
                if (!errorMessage)
                    errorMessage = 'Something Went Wrong '
                console.log('get vault wallet list Error ****', error);
                reject(errorMessage);
            });
        });
    });
};
/******************************************************************************************/
export const getCodeForCardBlock = ({ data }) => dispatch => {
    return new Promise((resolve, reject) => {
        console.log('1');
        Singleton.getInstance()
      .newGetData(Constants.CARD_TOKEN).then(token => {
            console.log('2', token);
            APIClient.getInstance().getCards(otpForCardBlock(data.cardId, data.cardProgram), token).then(response => {
                console.log('3',);
                let result = response.data;
                console.log('getCodeForCardBlock success **** ' + JSON.stringify(result));
                resolve(result);
            }).catch(error => {
                let errorMessage = error.message;
                if (!errorMessage)
                    errorMessage = 'Something Went Wrong '
                console.log('getCodeForCardBlock Error ****', error);
                reject(errorMessage);
            });
        });
    });
};

/******************************************************************************************/
export const getCodeForCardUnBlock = ({ data }) => dispatch => {
    return new Promise((resolve, reject) => {
        console.log('1');
        Singleton.getInstance()
      .newGetData(Constants.CARD_TOKEN).then(token => {
            console.log('2', token);
            APIClient.getInstance().getCards(otpForCardUnblock(data.cardId, data.cardProgram), token).then(response => {
                console.log('3',);
                let result = response.data;
                console.log('getCodeForCardUnBlock success **** ' + JSON.stringify(result));
                resolve(result);
            }).catch(error => {
                let errorMessage = error.message;
                if (!errorMessage)
                    errorMessage = 'Something Went Wrong '
                console.log('getCodeForCardUnBlock Error ****', error);
                reject(errorMessage);
            });
        });
    });
};

/******************************************************************************************/
export const unBlockCard = ({ data }) => dispatch => {
    return new Promise((resolve, reject) => {
        console.log('1');
        Singleton.getInstance()
      .newGetData(Constants.CARD_TOKEN).then(token => {
            console.log('2', token);
            let newData = {
                "code": data.code
            }
            APIClient.getInstance().postCardVault(unblockCard(data.cardId, data.cardProgram), JSON.stringify(newData), token).then(response => {
                console.log('3',);
                let result = response.data;
                console.log('unBlockCard success **** ' + JSON.stringify(result));
                resolve(result);
            }).catch(error => {
                let errorMessage = error.message;
                if (!errorMessage)
                    errorMessage = 'Something Went Wrong '
                console.log('unBlockCard Error ****', error);
                reject(errorMessage);
            });
        });
    });
};

/******************************************************************************************/
export const blockCard = ({ data }) => dispatch => {
    return new Promise((resolve, reject) => {
        console.log('1');
        Singleton.getInstance()
      .newGetData(Constants.CARD_TOKEN).then(token => {
            console.log('2', token);
            let newData = {
                "code": data.code
            }
            APIClient.getInstance().postCardVault(BlockCard(data.cardId, data.cardProgram), JSON.stringify(newData), token).then(response => {
                console.log('3',);
                let result = response.data;
                console.log('blockCard success **** ' + JSON.stringify(result));
                resolve(result);
            }).catch(error => {
                let errorMessage = error.message;
                if (!errorMessage)
                    errorMessage = 'Something Went Wrong '
                console.log('blockCard Error ****', error);
                reject(errorMessage);
            });
        });
    });
};
/******************************************************************************************/
export const createCardWallets = ({ data }) => dispatch => {
    return new Promise((resolve, reject) => {
        Singleton.getInstance()
      .newGetData(Constants.CARD_TOKEN).then(token => {
        console.log(token,'tokentokentoken');
            APIClient.getInstance().postCards(CREATE_WALLETS, data, token).then(response => {
                let result = response.data;
                console.log('createCardWallets success **** ' + JSON.stringify(result));
                resolve(result);
            }).catch(error => {
                console.log("error:::::::", typeof error);
                let errorMessage = error.message;
                if (!errorMessage)
                    errorMessage = 'Something Went Wrong '
                console.log('createCardWallets Error ****', JSON.stringify(error), error.message);
                reject(errorMessage);
            });
        });
    });
}

/******************************************************************************************/
export const requestNewCard = ({ data }) => dispatch => {
    let headers = {
        'User-Agent':'vault/4.0(508) dart/3.2 (dart:io) ios/17.3.1; iphone 9da12fa6-716c-4cdc-a24'
    }
    return new Promise((resolve, reject) => {
        Singleton.getInstance()
      .newGetData(Constants.CARD_TOKEN).then(token => {
            APIClient.getInstance().postCards(requestCard('CP_2'), data, token,headers).then(response => {
                let result = response.data;
                console.log('requestCard success **** ' + JSON.stringify(result));
                resolve(result);
            }).catch(error => {
                console.log("error:::::::", typeof error);
                let errorMessage = error.message;
                if (!errorMessage)
                    errorMessage = 'Something Went Wrong '
                console.log('requestCard Error ****', JSON.stringify(error), error.message);
                reject(errorMessage);
            });
        });
    });
}

/******************************************************************************************/
export const finishKYC = ({ data }) => dispatch => {
    return new Promise((resolve, reject) => {
        Singleton.getInstance()
      .newGetData(Constants.CARD_TOKEN).then(token => {
            APIClient.getInstance().postCards(FINISH_KYC, data, token).then(response => {
                let result = response.data;
                console.log('finishKYC success **** ' + JSON.stringify(result));
                resolve(result);
            }).catch(error => {
                console.log("error:::::::", typeof error);
                let errorMessage = error.message;
                if (!errorMessage)
                    errorMessage = 'Something Went Wrong '
                console.log('finishKYC Error ****', JSON.stringify(error), error.message);
                reject(errorMessage);
            });
        });
    });
}


/******************************************************************************************/
export const addAddressForCardReq = ({ data }) => dispatch => {
    let headers = {
        'User-Agent':'vault/4.0(508) dart/3.2 (dart:io) ios/17.3.1; iphone 9da12fa6-716c-4cdc-a24'
    }
    return new Promise((resolve, reject) => {
        Singleton.getInstance()
      .newGetData(Constants.CARD_TOKEN).then(token => {
            APIClient.getInstance().putCard(cardRequestAddress(data.id,data.cp), data, token,headers).then(response => {
                let result = response.data;
                console.log('addAddressForCardReq success **** ' + JSON.stringify(result));
                resolve(result);
            }).catch(error => {
                console.log("error:::::::", typeof error);
                let errorMessage = error.message;
                if (!errorMessage)
                    errorMessage = 'Something Went Wrong '
                console.log('addAddressForCardReq Error ****', JSON.stringify(error), error.message);
                reject(errorMessage);
            });
        });
    });
}

/******************************************************************************************/
export const addAdditionalInfo = ({ data },cp) => dispatch => {
    return new Promise((resolve, reject) => {
        Singleton.getInstance()
      .newGetData(Constants.CARD_TOKEN).then(token => {
            APIClient.getInstance().postCards(ADDITIONAL_INFO + `?cp=${cp}`, data, token).then(response => {
                let result = response.data;
                console.log('addAdditionalInfo success **** ' + JSON.stringify(result));
                resolve(result);
            }).catch(error => {
                console.log("error:::::::", typeof error);
                let errorMessage = error.message;
                if (!errorMessage)
                    errorMessage = 'Something Went Wrong '
                console.log('addAdditionalInfo Error ****', JSON.stringify(error), error.message);
                reject(errorMessage);
            });
        });
    });
}
/******************************************************************************************/
export const getCountryCodes = () => dispatch => {
    return new Promise((resolve, reject) => {
        Singleton.getInstance()
      .newGetData(Constants.access_token).then(token => {
            APIClient.getInstance().getCards(GET_COUNTRY_CODES, token).then(response => {
                let result = response;
                // console.log('getCountryCodes success **** ' + JSON.stringify(result));
                resolve(result);
            }).catch(error => {
                let errorMessage = error.message;
                if (!errorMessage)
                    errorMessage = 'Something Went Wrong '
                console.log('getCountryCodes Error ****', JSON.stringify(error));
                reject(errorMessage);
            });
        });
    });
};

/******************************************************************************************/

export const getVaultSettings = () => {
        return new Promise((resolve, reject) => {
            APIClient.getInstance().getCards(GET_VAULT_SETTINGS).then((response) => {
                let result = response.data;
                resolve(result);
            })
                .catch((error) => {
                    reject(error);
                });
        });
};
/******************************************************************************************/

export const getCardPrice = (id, currency, cp) => {
    return new Promise((resolve, reject) => {
        Singleton.getInstance()
      .newGetData(Constants.CARD_TOKEN).then(token => {
            APIClient.getInstance().getCards(cardPrice(id, currency, cp), token).then(response => {
                let result = response.data;
                console.log('getCardPrice success **** ' + JSON.stringify(result));
                resolve(result);
            }).catch(error => {
                let errorMessage = error.message;
                if (!errorMessage)
                    errorMessage = 'Something Went Wrong '
                console.log('getCardPrice Error ****', error);
                reject(errorMessage);
            });
        });
    });
}
/******************************************************************************************/

export const PayCardFee = (id, currency, cp) => {
    return new Promise((resolve, reject) => {
        Singleton.getInstance()
      .newGetData(Constants.CARD_TOKEN).then(token => {
            APIClient.getInstance().postCards(payCardFee(id, currency, cp), {}, token).then(response => {
                let result = response.data;
                console.log('PayCardFee success **** ' + JSON.stringify(result));
                resolve(result);
            }).catch(error => {
                let errorMessage = error.message;
                if (!errorMessage)
                    errorMessage = 'Something Went Wrong '
                console.log('PayCardFee Error ****', error);
                reject(errorMessage);
            });
        });
    });
}
/******************************************************************************************/

export const ConfirmCardFee = (id, cp) => {
    return new Promise((resolve, reject) => {
        Singleton.getInstance()
      .newGetData(Constants.CARD_TOKEN).then(token => {
            APIClient.getInstance().postCards(confirmCardFee(id, cp), {}, token).then(response => {
                let result = response.data;
                console.log('PayCardFee success **** ' + JSON.stringify(result));
                resolve(result);
            }).catch(error => {
                let errorMessage = error.message;
                if (!errorMessage)
                    errorMessage = 'Something Went Wrong '
                console.log('PayCardFee Error ****', error);
                reject(errorMessage);
            });
        });
    });
}
/******************************************************************************************/

export const RechargeConversion = (data, id, cp) => {
    return new Promise((resolve, reject) => {
        Singleton.getInstance()
      .newGetData(Constants.CARD_TOKEN).then(token => {
            APIClient.getInstance().postCards(rechargeConversion(id, cp), data, token).then(response => {
                let result = response.data;
                console.log('RechargeConversion success **** ' + JSON.stringify(result));
                resolve(result);
            }).catch(error => {
                let errorMessage = error.message;
                if (!errorMessage)
                    errorMessage = 'Something Went Wrong '
                console.log('RechargeConversion Error ****', error);
                reject(errorMessage);
            });
        });
    });
}
/******************************************************************************************/

export const ConfirmRecharge = (id, cp, offerId) => {
    return new Promise((resolve, reject) => {
        Singleton.getInstance()
      .newGetData(Constants.CARD_TOKEN).then(token => {
            APIClient.getInstance().postCards(confirmRecharge(id, cp, offerId),{}, token).then(response => {
                let result = response.data;
                console.log('ConfirmRecharge success **** ' + JSON.stringify(result));
                resolve(result);
            }).catch(error => {
                let errorMessage = error.message;
                if (!errorMessage)
                    errorMessage = 'Something Went Wrong '
                console.log('ConfirmRecharge Error ****', error);
                reject(errorMessage);
            });
        });
    });
}
/******************************************************************************************/

export const getCardLimits = (id, cp) => {
    return new Promise((resolve, reject) => {
        Singleton.getInstance()
      .newGetData(Constants.CARD_TOKEN).then(token => {
            APIClient.getInstance().getCards(cardLimits(id, cp), token).then(response => {
                let result = response.data;
                console.log('GetCardLimits success **** ' + JSON.stringify(result));
                resolve(result);
            }).catch(error => {
                let errorMessage = error.message;
                if (!errorMessage)
                    errorMessage = 'Something Went Wrong '
                console.log('GetCardLimits Error ****', error);
                reject(errorMessage);
            });
        });
    });
}

export const getCardPrices=()=>{
    return new Promise((resolve, reject) => {
        Singleton.getInstance()
        .newGetData(Constants.CARD_TOKEN).then(token => {
            APIClient.getInstance().getCards(CARD_PRICES, token).then(response => {
                let result = response.data;
                console.log('getCardPrices success **** ' + JSON.stringify(result));
                resolve(result);
            }).catch(error => {
                let errorMessage = error.message;
                if (!errorMessage)
                    errorMessage = 'Something Went Wrong '
                console.log('getCardPrices Error ****', error);
                reject(errorMessage);
            });
        });
    });
}