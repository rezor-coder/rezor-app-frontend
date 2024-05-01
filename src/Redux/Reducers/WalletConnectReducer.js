import * as Constants from "../../Constant";
import Singleton from "../../Singleton";
import { WALLET_CONNECT_PARAMS, SAVE_SESSION, DELETE_SESSION, SAVE_CALL_REQUEST_ID, GET_REQUESTED_SESSION, INITIALISE_LIST, TRANSACTION_CONFIRM, SWAP_FIAT_PRICE, WALLET_SWITCH, CLEAR_REDUCER } from "../Actions/types";

const initialState = {
    selectedCoin: '',
    slowFee: '',
    averageFee: '',
    fastFee: '',
    selectedFee: 'average',
    bnbEstimateRes: '',
    gaslimitForTxn: 21000,
    gasFeeMultiplier: 0.000000000000000001,
    isWcPopUp: false,
    sessionRequestPayload: {},
    NetworkFee: '',
    TotalAmount: '',
    payload: {},
    slowGwei: '',
    activeSessions: [{
        connector: null,
        session: {},
        coinChain: '',
        connectionTime: '',
        walletAddress: ''
    }],
    callRequestPeerid: '',
    requestedSession: {},
    selectedCurrency: 'USD',
    selectedCurrencySymbol: '$',
    appActiveSessions: [],
    callRequestPayload: {
        id: '',
        jsonrpc: "2.0",
        method: "",
        params: [],
    },
    swapFiatPrice: []
}
export default (state = initialState, action) => {
// console.log("action:::::::",action);
    switch (action.type) {
        case WALLET_CONNECT_PARAMS:
            return { ...state, [action.payload.prop]: action.payload.value };
        // case SAVE_SESSION + 'old': {
        //     if (state.activeSessions.filter(
        //         (wallet) =>
        //             (wallet?.session?.peerMeta?.url == action.payload.value.session.peerMeta.url)
        //     )?.length == 2) {
        //         state.activeSessions.filter(
        //             (wallet) =>
        //                 (wallet?.session?.peerMeta?.url == action.payload.value.session.peerMeta.url)
        //         )?.[0]?.connector?.killSession()
        //     }

        //     let filteredList = state.activeSessions.filter(
        //         (wallet) => {
        //             return (wallet?.session?.peerMeta?.url != action?.payload?.value?.connector?.peerMeta?.url && wallet?.session?.peerId != action.payload.value.session.peerId)
        //         }
        //     )
        //     let finalList = action?.payload?.isFromStorage ? [action.payload.value, ...state.activeSessions] : [action.payload.value, ...filteredList, {
        //         connector: null,
        //         session: {},
        //         coinChain: '',
        //         connectionTime: '',
        //         walletAddress: ''
        //     }]
        //     let storageList = finalList?.map((item)=>{
        //         return {...item,connector:null}
        //     })
        //     Singleton.getInstance().newSaveData(Constants.SESSION_LIST, JSON.stringify(storageList))
        //     global.count = global.count + 1
        //     global.isDeepLink = false
        //     global.alreadyCalled = false
        //     global.deepLinkUrl = ''
        //     global.requestFromDeepLink = false

        //     return {
        //         ...state,
        //         activeSessions: finalList, appActiveSessions: action?.payload?.isFromStorage ? [] : [...filteredList, action?.payload?.value],

        //     };
        // }
        case SAVE_SESSION: {
            let filteredList = null
            let finalList = null
            if (action.payload?.value?.connType == 'wcv2' && state.activeSessions.filter(wallet => wallet?.sessionData?.params?.proposer?.metadata?.url == action.payload.value?.sessionData?.params?.proposer?.metadata?.url)?.length == 2) {
              console.log("inside______V2");
              global.count = global.count + 1;
              let deletedData = state.activeSessions?.find(wallet => wallet?.sessionData?.params?.proposer?.metadata?.url == action.payload.value?.sessionData?.params?.proposer?.metadata?.url)
              console.log("deletedData:::", deletedData);
              try {
                deletedData.connector.disconnect({
                  topic: deletedData?.session?.topic,
                  reason: { code: 1, message: "USER_DISCONNECTED" },
                });
                deletedData.connector.disconnect({
                  topic: deletedData?.sessionData?.params?.pairingTopic,
                  reason: { code: 1, message: "USER_DISCONNECTED" },
                });
              } catch (err) {
                console.log("delete_reducer_call_err:::", err);
              }
      
            }
            filteredList = state.activeSessions.filter(wallet => {
              return ((wallet?.sessionData?.params?.proposer?.metadata?.url != action.payload.value?.sessionData?.params?.proposer?.metadata?.url && wallet?.sessionData?.params?.pairingTopic != action.payload.sessionData?.params?.pairingTopic) || (wallet?.session?.peerMeta?.url != action?.payload?.value?.session?.peerMeta?.url && wallet?.session?.peerId != action.payload.value.session.peerId));
            });
            finalList = action?.payload?.isFromStorage ? [action.payload.value, ...filteredList] : action.payload.value.connType == 'wcv2' ? [
              action.payload.value, ...filteredList,
              {
                connector: null,
                session: {},
                coinChain: '',
                connectionTime: '',
                walletAddress: '',
                sessionData: {},
                connType: ''
              },
            ] : [
              action.payload.value, ...filteredList,
              {
                connector: null,
                session: {},
                coinChain: '',
                connectionTime: '',
                walletAddress: '',
                connType: ''
              },
            ]
            // console.log(
            //   'finalList:::::',
            //   action?.payload?.isFromStorage,
            //   action?.payload?.value,
            // );
            global.count = global.count + 1;
            global.isDeepLink = false;
            global.alreadyCalled = false;
            global.deepLinkUrl = '';
            console.log('requestFromDeepLink 22', global.requestFromDeepLink);
            console.log('finalList:::::::: 22', finalList);
      
            global.requestFromDeepLink = false;
            return {
              ...state,
              activeSessions: finalList,
              appActiveSessions: action?.payload?.isFromStorage
                ? []
                : [...filteredList, action?.payload?.value],
            };
          }
        case DELETE_SESSION: {
            let finalList = null
            let filteredList = null
            let finalAppActiveSessions = null
            console.log("action.payload::::::", action.payload);
            console.log("state.appActiveSessions::::::", state.appActiveSessions);
            if (action.payload.connType == 'wcv2') {
              filteredList = state.activeSessions.filter(wallet => {
                return wallet?.sessionData?.params?.pairingTopic != action.payload?.item;
              });
              finalAppActiveSessions = state.appActiveSessions.filter(wallet => {
                return wallet?.sessionData?.params?.pairingTopic != action.payload?.item;
              });
              finalList = filteredList?.length == 0
                ? [
                  {
                    connector: null,
                    session: {},
                    coinChain: '',
                    connectionTime: '',
                    walletAddress: '',
                    sessionData: {},
                    connType: ''
                  },
                ]
                : filteredList;
            }
            console.log("finalList::::", finalList);
            console.log("finalAppActiveSessions::::", finalAppActiveSessions);
            return {
              ...state,
              activeSessions: finalList,
              appActiveSessions: finalAppActiveSessions,
            };
          }
        // case DELETE_SESSION + 'old': {
        //     let filteredList = state.activeSessions.filter(
        //         (wallet) => {
        //             return (wallet?.session?.peerId != action.payload)
        //         }
        //     )
        //     let finalAppActiveSessions = state.appActiveSessions.filter(
        //         (wallet) => {
        //             return (wallet?.session?.peerId != action.payload)
        //         }
        //     )
        //     let finalList = filteredList?.length == 0 ? [{
        //         connector: null,
        //         session: {},
        //         coinChain: '',
        //         connectionTime: '',
        //         walletAddress: ''
        //     }] : filteredList
        //     let storageList = finalList?.map((item)=>{
        //         return {...item,connector:null}
        //     })
        //     Singleton.getInstance().newSaveData(Constants.SESSION_LIST, storageList)
        //     return {
        //         ...state,
        //         activeSessions: finalList,
        //         appActiveSessions: finalAppActiveSessions
        //     }
        // }
        case SAVE_CALL_REQUEST_ID: {
            return {
                ...state,
                callRequestPeerid: action?.payload
            }
        }
        // case GET_REQUESTED_SESSION + 'old': {
        //     let requestedSession = state.activeSessions?.find(session => session?.session?.peerId == action.payload)
        //     return {
        //         ...state, requestedSession: requestedSession
        //     }
        // }
        case GET_REQUESTED_SESSION: {
            let requestedSession = state.activeSessions?.find(
              session => session?.session?.topic == action.payload,
            );
            return {
              ...state,
              requestedSession: requestedSession,
            };
          }
        case INITIALISE_LIST: return {
            ...state, activeSessions: [action.payload, ...state.activeSessions]
        }
        case WALLET_SWITCH: {


          console.log('WALLET_SWITCH called !!!!! ' );
            state.activeSessions?.map(session=>{
              // return  session?.connector?.killSession()
              try {
                session.connector.disconnect({
                  topic: session?.session?.topic,
                  reason: { code: 1, message: "USER_DISCONNECTED" },
                });
              } catch (err) {
                console.log("delete_reducer_call_err:::", err);
              }

            try {
              session.connector.disconnect({
                topic: session?.sessionData?.params?.pairingTopic,
                reason: { code: 1, message: "USER_DISCONNECTED" },
              });
            } catch (err) {
              console.log(" diconenct ... pairingTopic:::", err);
            }
              return session
            })
            console.log('chech check');
            Singleton.getInstance().newSaveData(Constants.SESSION_LIST, JSON.stringify([]))
            .then(res=>{
              console.log('save res' , res);

            }).catch(err=>{
              console.log('save err' , err);
            })


            try {
              Singleton.getInstance().walletConnectRef?.showWalletData(false)
              setTimeout(() => {
                
                Singleton.getInstance().walletConnectRef?.showWalletData(false)
              }, 3000);
            } catch (error) {
              console.log('errrororororrrrrrrrrr' , error);
            }

            return {
                selectedCoin: '',
                slowFee: '',
                averageFee: '',
                fastFee: '',
                selectedFee: 'average',
                bnbEstimateRes: '',
                gaslimitForTxn: 21000,
                gasFeeMultiplier: 0.000000000000000001,
                isWcPopUp: false,
                sessionRequestPayload: {},
                NetworkFee: '',
                TotalAmount: '',
                payload: {},
                slowGwei: '',
                activeSessions: [{
                    connector: null,
                    session: {},
                    coinChain: '',
                    connectionTime: '',
                    walletAddress: ''
                }],
                callRequestPeerid: '',
                requestedSession: {},
                selectedCurrency: 'USD',
                selectedCurrencySymbol: '$',
                appActiveSessions: [],
                callRequestPayload: {
                    id: '',
                    jsonrpc: "2.0",
                    method: "",
                    params: [],
                },
                swapFiatPrice: []
            }
        }
        case TRANSACTION_CONFIRM: {
            return {
                ...state,
                selectedCoin: '',
                slowFee: '',
                averageFee: '',
                fastFee: '',
                selectedFee: 'slow',
                bnbEstimateRes: '',
                gaslimitForTxn: 21000,
                gasFeeMultiplier: 0.000000000000000001,
                isWcPopUp: false,
                NetworkFee: '',
                TotalAmount: '',
                payload: {},
                slowGwei: '',
                callRequestPeerid: '',
                requestedSession: {},
                selectedCurrency: 'USD',
                selectedCurrencySymbol: '$',
                callRequestPayload: {
                    id: '',
                    jsonrpc: "2.0",
                    method: "",
                    params: [],
                }
            }
        }
        case SWAP_FIAT_PRICE: {
            return { ...state, swapFiatPrice: action.payload }
        }
        case CLEAR_REDUCER:{
          console.log("walletConnectReducer");
          return initialState
      }
        default:
            return state;
    }
}