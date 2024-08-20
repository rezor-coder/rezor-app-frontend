//***********FOR_WALLET_CONNECT_V2_NEW***************/
import '@walletconnect/react-native-compat'
import { Core } from '@walletconnect/core'
import { Web3Wallet } from '@walletconnect/web3wallet';
import { EventRegister } from 'react-native-event-listeners';
import Singleton from '../Singleton';
import { getSdkError } from '@walletconnect/utils';
import { signPersonalMessage } from '../utils';
import * as Constants from '../Constant'
export default class WalletConnect {
  static myInstance = null;
  web3Wallet = null;
  invalidQR = null;
  smartContractCallInterval = null;

  static getInstance() {
    if (WalletConnect.myInstance == null) {
      WalletConnect.myInstance = new WalletConnect();
      WalletConnect.myInstance.initialiseWalletConnect();
    }
    return this.myInstance;
  }

  initialiseWalletConnect = async () => {
    const core = new Core({
      projectId: '160e9f6ba80c6225462a13c2640ffd83',
    });
    this.web3Wallet = await Web3Wallet.init({
      core, // <- pass the shared `core` instance
      metadata: {
        name: 'SaitaPro',
        description:
          'SaitaPro is here to make crypto and decentralized finance simple and safe for you. Buying crypto, trading assets, staking .',
        url: 'https://www.saitamatoken.com/saitapro/',
        icons: ['https://walletconnect.org/walletconnect-logo.png'],
      },
    });

    // Approval: Using this listener for sessionProposal, you can accept the session
    this.web3Wallet.on('session_proposal', async proposal => {
      console.log("proposal:::::::", proposal);
      EventRegister.emitEvent('sessionProposal', proposal);
      clearTimeout(this.invalidQR);
    });

    this.web3Wallet.on('session_delete', async proposal => {
      console.log('----------------deleted', proposal)
      EventRegister.emitEvent('sessionDeleted', proposal);
      // let requests = this.web3Wallet.getPendingSessionRequests();

      // requests.map(async el => {
      //   //Delete all pending requests for particular session before disconnecting the session
      //   if (el?.topic == topic) {
      //     const response = {
      //       id: el?.id,
      //       jsonrpc: '2.0',
      //       error: {
      //         code: 5000,
      //         message: 'User rejected.',
      //       },
      //     };
      //     try {
      //       await this.web3Wallet?.respondSessionRequest({
      //         topic: el?.topic,
      //         response: response,
      //       });
      //     } catch (e) {
      //       console.log('--------------error', e)
      //     }
      //   }
      // });
    });

    this.web3Wallet.on('session_request', async event => {
      console.log("session_request>>>>>>>>>>>", JSON.stringify(event));
      this.sessionRequest(event);
    });
  };

  connect = async walletUri => {
    return new Promise(async (resolve, reject) => {
      try {
        await this.web3Wallet.core.pairing.pair({ uri: walletUri });
        this.invalidQR = setTimeout(() => {
          try {
            if (this.web3Wallet) {
              if (!this.web3Wallet?.connected) {
                console.log("rejected::::");
                reject("Invalid QR Code.");
              }
            }
          } catch (e) {
            console.log('exception--------', e);
          }
        }, 15000);
        resolve();
      } catch (error) {
        resolve(error);
        console.log('exception--------', error);
      }
    });
  };

  rejectSession = id => {
    this.web3Wallet.rejectSession({
      id: id,
      reason: getSdkError('USER_REJECTED_METHODS'),
    });
  };
 onRejectTransaction = async (msg) => {
    let requests = WalletConnect.getInstance().web3Wallet.getPendingSessionRequests()
    console.log("--------------------------pending WC requests", requests);
    requests.map(async el => {
        const response = {
            id: el?.id,
            jsonrpc: '2.0',
            error: {
                code: 5000,
                message: 'User rejected.'
            }
        }
        try {
            await WalletConnect.getInstance().web3Wallet?.respondSessionRequest({
                topic: el?.topic,
                response: response,
            });
        } catch (e) {
            console.log('----------dapp request reject----error', e)
        }        
    })
    global.wcTxnPopup = false
    Singleton.getInstance().walletConnectRef?.showWalletData(false)
}
  sessionRequest = payload => {
    console.log("payload::::",payload);
    let coinFamily = null
    if (payload?.params?.chainId?.toString()=='eip155:56') {

      coinFamily = 6  // for BNB
    } else if (payload?.params?.chainId?.toString()=='eip155:137') {

      coinFamily = 11  // for POLYGON
    } else if (payload?.params?.chainId?.toString()=='eip155:1209') {

      coinFamily = 4 // for STC
    }else if (payload?.params?.chainId?.toString()=='eip155:1') {

      coinFamily = 1 // for ETH
    }
    else {
      coinFamily = 8
    }
    console.log("coinFamily::::",coinFamily,payload?.params?.chainId);

    if (coinFamily == 8) {
      Singleton.showAlert("Unsupported chain");
      this.onRejectTransaction()
      return
    } else if (payload?.params?.request?.method.includes('personal_sign')) {
      Singleton.getInstance().newGetData(`${Singleton.getInstance().defaultEthAddress}_pk`).then(async (ethPvtKey) => {
        let signedMessage = await signPersonalMessage(payload?.params?.request?.params[0], ethPvtKey, coinFamily);
        console.log("signedMessage::::", signedMessage);
        let jsonRpcData = { id: payload?.id, result: signedMessage, jsonrpc: '2.0' }
        try {
          await this.web3Wallet?.respondSessionRequest({
            topic: payload?.topic,
            response: jsonRpcData,
          });

        } catch (e) {
          console.log('-------approval-------error', e)
        }
      }).catch(err => {
        console.log("err_pvtKey::>>>", err);
      })
    } else {
      if (payload?.params?.request?.method.includes("eth_signTypedData")) {
        let approvalParam = JSON.parse(payload?.params?.request?.params[1]);
        console.log("approvalParam:::::", approvalParam);
        let typeArr = Object.keys(approvalParam.types)
        let newTypes = {}
        typeArr.map(el => {
            if (el != "EIP712Domain") {
                newTypes[el] = approvalParam.types[el]

            }
        })
          console.log("newTypes ", newTypes)
          let newParams = {
            domain: approvalParam.domain,
            types: newTypes,
            message: approvalParam.message,
        };
        console.log("newParams:::::", newParams,Singleton.getInstance().defaultEthAddress);
        Singleton.getInstance().newGetData(`${Singleton.getInstance().defaultEthAddress}_pk`).then((ethPvtKey) => {
          console.log('-------ethPvtKey-------ethPvtKey', ethPvtKey)
          Singleton.getInstance().dappApprovalHash(ethPvtKey, newParams).then(async (res) => {
            console.log('-------approval-------dappApprovalHash', res)
            let jsonRpcData = { id: payload?.id, result: res, jsonrpc: '2.0' }
            try {
              await this.web3Wallet?.respondSessionRequest({
                topic: payload?.topic,
                response: jsonRpcData,
              });

            } catch (e) {
              console.log('-------approval-------error', e)
            }

          }).catch((err) => {
            console.log("err::::::::", err);
          });
        }).catch(err => {
          console.log("error_pvtkey:::", err);
        })

      } else  {
        if(payload?.params?.request?.method.includes("eth_sendTransaction")){
          global.callRequest = true;
        clearInterval(this.smartContractCallInterval)
        this.smartContractCallInterval = setInterval(() => {
          let data = {
            payload: payload,
            coinFamily: coinFamily
          }
          Singleton.getInstance()
            .newGetData(Constants.IS_PRIVATE_WALLET)
            .then(isPrivateWallet => {
              console.log("isPrivateWallet", isPrivateWallet);
              if (isPrivateWallet == Constants.COIN_SYMBOL.ETH && coinFamily == 1) {
                EventRegister.emitEvent("requestFromDapp", data)
              } else if (isPrivateWallet == Constants.COIN_SYMBOL.BNB && coinFamily == 6) {
                EventRegister.emitEvent("requestFromDapp", data)
              } else if (isPrivateWallet == Constants.COIN_SYMBOL.MATIC && coinFamily == 11) {
                EventRegister.emitEvent("requestFromDapp", data)
              } else if (isPrivateWallet == Constants.COIN_SYMBOL.STC && coinFamily == 4) {
                EventRegister.emitEvent("requestFromDapp", data)
              }else {
                console.log("fgegeg1");
                if (!isPrivateWallet || isPrivateWallet == 0) {
                  console.log("fgegeg2 on request");
                  EventRegister.emitEvent("requestFromDapp", data)
                } else {
                  Singleton.showAlert('Unsupported Chains')
                  this.onRejectTransaction()
                }
              }
            });

          clearInterval(this.smartContractCallInterval)
        }, 2000);
        }else{
          return
        }
      }
    }
  };

  deleteSession = async event => {
    return new Promise(async (resolve, reject) => {
      // this.deleteAllSessions()
      const { topic } = event;
      try {
        await this.web3Wallet.disconnectSession({
          topic,
          reason: getSdkError('USER_DISCONNECTED'),
        });
        console.log("disconnectSession::::::");
        setTimeout(() => {
          resolve();
        }, 100);
      } catch (error) { }
      setTimeout(() => {
        resolve();
      }, 100);
    });
  };
  onRejectTransaction = async (msg) => {
    let requests = WalletConnect.getInstance().web3Wallet.getPendingSessionRequests()
    console.log("--------------------------pending WC requests", requests);
    requests.map(async el => {
      const response = {
        id: el?.id,
        jsonrpc: '2.0',
        error: {
          code: 5000,
          message: 'User rejected.'
        }
      }
      try {
        await WalletConnect.getInstance().web3Wallet?.respondSessionRequest({
          topic: el?.topic,
          response: response,
        });
      } catch (e) {
        console.log('----------dapp request reject----error', e)
      }
    })
  }
  deleteAllSessions = () => {
    return new Promise((resolve, reject) => {
      if (!this.web3Wallet) {
        reject();
        return;
      }
      let requests = this.web3Wallet.getPendingSessionRequests();
      requests.map(async el => {
        const response = {
          id: el?.id,
          jsonrpc: '2.0',
          error: {
            code: 5000,
            message: 'User rejected.',
          },
        };
        try {
          await this.web3Wallet?.respondSessionRequest({
            topic: el?.topic,
            response: response,
          });
        } catch (e) {
        }
      });

      let sessions = this.web3Wallet.getActiveSessions();
      let keys = Object.keys(sessions);
      let connectionList = [];
      keys.map(el => {
        connectionList.push(sessions[el]);
      });
      connectionList.map(async el => {
        try {
          await this.web3Wallet.disconnectSession({
            topic: el.topic,
            reason: getSdkError('USER_DISCONNECTED'),
          });
        } catch (error) { }
      });

      setTimeout(() => {
        resolve();
      }, 1000);
    });
  };
}
