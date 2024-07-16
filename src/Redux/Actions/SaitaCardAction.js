
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
    FORGET_PASSWORD_CONFIRM
} from '../../Endpoints';
import { APIClient } from "../../Api";
import * as Constants from '../../Constant'
import Singleton from '../../Singleton';
import { CARD_USER_DETAIL } from './types';


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

export const sendPhoneOtp = ({data}) => {
  return new Promise((resolve, reject) => {
    APIClient.getInstance()
      .postCards(SIGN_UP, data)
      .then(response => {
        let result = response;
        resolve(result);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const resendPhoneOtp = ({data}) => {
  return new Promise((resolve, reject) => {
    APIClient.getInstance()
      .postCards(RESEND_OTP, data)
      .then(response => {
        let result = response;
        resolve(result);
      })
      .catch(error => {
        reject(error);
      });
  });
};
export const confirmPhoneOtp = ({data}) => {
  return new Promise((resolve, reject) => {
    APIClient.getInstance()
      .postCards(CONFIRM_PHONE, data)
      .then(response => {
        let result = response;
        resolve(result);
      })
      .catch(error => {
        reject(error);
      });
  });
};
export const registerEmailAdded = ({data, token}) => {
  return new Promise((resolve, reject) => {
    APIClient.getInstance()
      .postCards(EMAIL_ADD, data, `Bearer ${token}`)
      .then(response => {
        let result = response;
        resolve(result);
      })
      .catch(error => {
        reject(error);
      });
  });
};
export const setUserProfile = ({data, token}) => {
    return new Promise((resolve, reject) => {
      APIClient.getInstance()
        .postCards(SET_USER_DETAIL, data, `Bearer ${token}`)
        .then(response => {
          let result = response;
          resolve(result);
        })
        .catch(error => {
          reject(error);
        });
    });
  };
  export const cardUserdata = (dispatch, data) => {
    dispatch({
      type: CARD_USER_DETAIL,
      payload: data,
    });
  };
  export const userLogOut = ({data, token}) => {
    return new Promise((resolve, reject) => {
      APIClient.getInstance()
        .postCards(USER_LOGOUT, data, `Bearer ${token}`)
        .then(response => {
          let result = response;
          resolve(result);
        })
        .catch(error => {
          reject(error);
        });
    });
  };
  export const userLogIn = ({data}) => {
    return new Promise((resolve, reject) => {
      APIClient.getInstance()
        .postCards(USER_LOGIN, data)
        .then(response => {
          let result = response;
          resolve(result);
        })
        .catch(error => {
          reject(error);
        });
    });
  };
  export const getUserProfile = ({token}) => {
    return new Promise((resolve, reject) => {
      APIClient.getInstance()
        .getCards(GET_USER_PROFILE, `Bearer ${token}`)
        .then(response => {
          let result = response;
          resolve(result);
        })
        .catch(error => {
          reject(error);
        });
    });
  };
  export const getKycId = ({data, token}) => {
    return new Promise((resolve, reject) => {
      APIClient.getInstance()
        .postCards(GET_KYC_ID, data, `Bearer ${token}`)
        .then(response => {
          let result = response;
          resolve(result);
        })
        .catch(error => {
          reject(error);
        });
    });
  };
  export const requestVaultCard = ({data, token}) => {
    return new Promise((resolve, reject) => {
      APIClient.getInstance()
        .postCards(REQUEST_VAULT_CARD, data, `Bearer ${token}`)
        .then(response => {
          let result = response;
          resolve(result);
        })
        .catch(error => {
          reject(error);
        });
    });
  };


  export const forgetOtpSend = ({data}) => {
    return new Promise((resolve, reject) => {
      APIClient.getInstance()
        .postCards(FORGET_OTP_SEND, data)
        .then(response => {
          let result = response;
          resolve(result);
        })
        .catch(error => {
          reject(error);
        });
    });
  };

  export const forgetOtpConfirm = ({data}) => {
    console.log('data:::',data);
    return new Promise((resolve, reject) => {
      APIClient.getInstance()
        .postCards(FORGET_OTP_CONFIRM, data)
        .then(response => {
          let result = response;
          resolve(result);
        })
        .catch(error => {
          reject(error);
        });
    });
  };

  export const forgetPasswordConfirm = ({data}) => {
    return new Promise((resolve, reject) => {
      APIClient.getInstance()
        .postCards(FORGET_PASSWORD_CONFIRM, data)
        .then(response => {
          let result = response;
          resolve(result);
        })
        .catch(error => {
          reject(error);
        });
    });
  };