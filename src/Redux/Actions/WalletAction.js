import {
  WALLET_FORM_UPDATE,
  COIN_LIST,
  WALLET_FAIL,
  MYWALLET_LIST,
  ACTIVE_INACTIVE_COIN,
  WALLET_REFRESH,
  COIN_LIST_EMPTY,
  MYWALLET_TOTAL_BALANCE,
  DASHBOARD_WALLET_LIST,
  LAST_DEPOSIT_DATA,
  SAVE_DEX_URLS,
  CLEAR_REDUCER,
} from './types';
import {
  WALLET_GET_COIN_LIST_ORDER,
  API_MYWALLETS,
  API_ACTIVE_INACTIVE_COIN,
  API_TRANSACTION,
  API_TRANSACTION_DETAIL,
  API_LOGOUT,
  API_NOTIFICATION,
  API_ENABLE_DISABLE_NOTI_STATUS,
  API_CURRENCY_PREFERENCE,
  API_NEWS,
  API_GRAPH_DATA,
  API_ENABLE_DISABLE_NOTI,
  API_INVITE,
  API_COIN_LIST,
  BANNER_IMG,
  DAPP_LIST,
  COLOR_LIST,
  SOCIAL_LINK,
  FINANCE_LIST,
  BASE_URL,
  API_EPAY_ORDER,
  API_CRYPTO_PRICE,
  API_SWAP_COIN_LIST_NEW,
  API_SWAP_COIN_LIST_BNB,
  API_INFURA_LINK,
  API_BUYLIST,
  API_EpayRate,
  API_INFURA_LINKBNB,
  API_Contract_Info,
  API_CRYPTO_PRICE_NEW,
  API_SWAP_LIST_ALL_V2,
  API_DASHBOARD_WALLETS,
  CHECK_FOR_SWAP_TOKEN,
  API_DEX_URLS,
  CHECK_MAINTENANCE,
  API_EPAY_ORDER_V2,
  API_GET_PRICE_EPAY,
  STC_GAS_LIMIT,
  API_SWAP_NEW,
  CHECK_EXIST_CONTACT,
  UPDATE_WALLET_BALANCES,
} from '../../Endpoints';

import {APIClient} from '../../Api/APIClient';
import Singleton from '../../Singleton';
import * as Constants from '../../Constant';
import moment from 'moment';
import {exponentialToDecimalWithoutComma} from '../../utils';
/**************************************Update prop values ****************************************************/
export const walletDataUpdate = ({prop, value}) => {
  return {
    type: WALLET_FORM_UPDATE,
    payload: {prop, value},
  };
};
export const refreshWallet = () => {
  return {
    type: WALLET_REFRESH,
  };
};
/**************************************get coin list ****************************************************/
export const getCoinList = ({
  page,
  limit,
  search,
  addrsListKeys,
  coinFamilyKeys,
  access_token,
}) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      let data = {
        page: page,
        limit: limit,
        search: search,
        addrsListKeys: addrsListKeys,
        coinFamilyKeys: coinFamilyKeys,
      };
      APIClient.getInstance()
        .post(API_COIN_LIST, data, access_token)
        .then(response => {
          // console.warn('MM', 'COINlIST--- ', response);
          let result = response;
          resolve(result);
          coinListSuccess(dispatch, result);
        })
        .catch(error => {
          // console.warn('MM', 'error coin list-- ', error);
          reject(error);
          walletFail(dispatch, error);
        });
    });
  };
};

/**************************************get notification list ****************************************************/
export const getNotificationList = ({
  page,
  limit,
  addrsListKeys,
  coinFamilyKeys,
  access_token,
}) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      let data = {
        page: page,
        limit: limit,
        addrsListKeys: addrsListKeys,
        coinFamilyKeys: coinFamilyKeys,
      };
      //console.warn('MM',data);
      APIClient.getInstance()
        .post(API_NOTIFICATION, data, access_token)
        .then(response => {
          // //console.warn('MM','Notification List--- ', response);
          let result = response;
          resolve(result);
          coinListSuccess(dispatch, result);
        })
        .catch(error => {
          //console.warn('MM','error notification list-- ', error);
          reject(error);
          walletFail(dispatch, error);
        });
    });
  };
};

/**************************************get my wallet list ****************************************************/
export const getMyWallets = ({
  page,
  limit,
  addrsListKeys,
  coinFamilyKeys,
  access_token,
  search = '',
}) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      let data = {
        page: page,
        limit: limit,
        addrsListKeys: addrsListKeys,
        coinFamilyKeys: coinFamilyKeys,
        search: search,
      };
      console.warn('MM', data);
      APIClient.getInstance()
        .post(API_MYWALLETS, data, access_token)
        .then(response => {
          var newArray = [];
          let price = 0;
          let totalBalance = 0;
          if (response.data.length > 0) {
            for (let i = 0; i < response.data.length; i++) {
              var element = response.data[i];
              element.graphData =
                element.coin_fiat_price_graph?.length > 0
                  ? element.coin_fiat_price_graph.map(ele => ele.value)
                  : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
              element.totalRecords = response.meta.total;
              element.no_of_decimals = element.decimals
                ? element.decimals?.toString().length - 1
                : 8;
              const selectedData = element.coin_fiat_price.find(
                el =>
                  el.fiat_type.toLowerCase() ==
                  Singleton.getInstance().CurrencySelected.toLowerCase(),
              );
              if (selectedData != undefined) {
                // //console.warn('MM','>>>>>', selectedData);
                price =
                  parseFloat(element.balance) * parseFloat(selectedData.value);
                element.current_pricing = price;
                element.price_change_percentage =
                  selectedData.price_change_percentage_24h
                    ? selectedData.price_change_percentage_24h
                    : 0;
                element.perPrice_in_fiat = selectedData.value;
                element.high = selectedData.high ? selectedData.high : 0;
                element.low = selectedData.low ? selectedData.low : 0;
                element.average = selectedData.average
                  ? selectedData.average
                  : 0;
                element.change = selectedData.change_price
                  ? selectedData.change_price
                  : 0;
                element.marketCap = selectedData.market_cap
                  ? selectedData.market_cap
                  : 0;
                element.volume_24h = selectedData.volume_24h
                  ? selectedData.volume_24h
                  : 0;
                element.circulating = selectedData.circulating
                  ? selectedData.circulating
                  : 0;
                element.max_supply = selectedData.max_supply
                  ? selectedData.max_supply
                  : 0;
                element.total_supply = selectedData.total_supply
                  ? selectedData.total_supply
                  : 0;
                element.roi = selectedData.roi ? selectedData.roi : 0;
                element.rank = selectedData.rank ? selectedData.rank : 0;
                element.currency_symbol =
                  Singleton.getInstance().CurrencySymbol;
                newArray.push(element);
              } else {
                element.current_pricing = 0;
                element.price_change_percentage = 0;
                element.perPrice_in_fiat = 0;
                element.high = 0;
                element.low = 0;
                element.average = 0;
                element.change = 0;
                element.marketCap = 0;
                element.volume_24h = 0;
                element.circulating = 0;
                element.max_supply = 0;
                element.total_supply = 0;
                element.roi = 0;
                element.rank = 0;
                element.currency_symbol =
                  Singleton.getInstance().CurrencySymbol;
                newArray.push(element);
              }
              totalBalance = totalBalance + element.current_pricing;
            }
            let stcCoin =
              newArray?.find(
                item => item?.coin_family == 4 && item?.is_token == 0,
              ) || {};
            let filteredArray = (
              stcCoin
                ? newArray?.filter(item => item?.coin_id != stcCoin?.coin_id)
                : newArray
            )?.sort(function (a, b) {
              return (
                Singleton.getInstance().toFixed(
                  exponentialToDecimalWithoutComma(
                    b.perPrice_in_fiat * b.balance,
                  ),
                  2,
                ) -
                Singleton.getInstance().toFixed(
                  exponentialToDecimalWithoutComma(
                    a.perPrice_in_fiat * a.balance,
                  ),
                  2,
                )
              );
            });
            let finalArray = stcCoin?.coin_id
              ? [stcCoin, ...filteredArray]
              : [...filteredArray];
            finalArray.sort((a, b) => b.balance - a.balance);
            resolve(finalArray);
            Singleton.getInstance().newSaveData(
              Constants.WALLET_LIST,
              JSON.stringify(finalArray),
            );
            dispatch({
              type: MYWALLET_TOTAL_BALANCE,
              payload: totalBalance,
            });
            myWalletListSuccess(dispatch, finalArray);
          } else {
            resolve([]);
            Singleton.getInstance().newSaveData(
              Constants.WALLET_LIST,
              JSON.stringify([]),
            );
            dispatch({
              type: MYWALLET_TOTAL_BALANCE,
              payload: 0.0,
            });
            myWalletListSuccess(dispatch, []);
          }
          //here
          {
            response?.lastDepositData &&
              dispatch({
                type: LAST_DEPOSIT_DATA,
                payload: response?.lastDepositData,
              });
          }
        })
        .catch(error => {
          //  console.warn('MM','error mywallets list-- ', error);
          reject(error);
          walletFail(dispatch, error);
        });
    });
  };
};
/**************************************get my dashboard wallet list ****************************************************/
export const getDashboardWallets = ({
  page,
  limit,
  addrsListKeys,
  coinFamilyKeys,
  access_token,
  search = '',
}) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      let data = {
        page: page,
        limit: limit,
        addrsListKeys: addrsListKeys,
        coinFamilyKeys: coinFamilyKeys,
        search: search,
      };
      APIClient.getInstance()
        .post(API_DASHBOARD_WALLETS, data, access_token)
        .then(response => {
          var newArray = [];
          let price = 0;
          let totalBalance = 0;
          for (let i = 0; i < response.data.length; i++) {
            var element = response.data[i];
            element.graphData =
              element.coin_fiat_price_graph?.length > 0
                ? element.coin_fiat_price_graph.map(ele => ele.value)
                : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            element.totalRecords = response.meta.total;
            element.no_of_decimals = element.decimals
              ? element.decimals?.toString().length - 1
              : 8;
            const selectedData = element.coin_fiat_price.find(
              el =>
                el.fiat_type.toLowerCase() ==
                Singleton.getInstance().CurrencySelected.toLowerCase(),
            );
            if (selectedData != undefined) {
              // //console.warn('MM','>>>>>', selectedData);
              price =
                parseFloat(element.balance) * parseFloat(selectedData.value);
              element.current_pricing = price;
              element.price_change_percentage =
                selectedData.price_change_percentage_24h
                  ? selectedData.price_change_percentage_24h
                  : 0;
              element.perPrice_in_fiat = selectedData.value;
              element.high = selectedData.high ? selectedData.high : 0;
              element.low = selectedData.low ? selectedData.low : 0;
              element.average = selectedData.average ? selectedData.average : 0;
              element.change = selectedData.change_price
                ? selectedData.change_price
                : 0;
              element.marketCap = selectedData.market_cap
                ? selectedData.market_cap
                : 0;
              element.volume_24h = selectedData.volume_24h
                ? selectedData.volume_24h
                : 0;
              element.circulating = selectedData.circulating
                ? selectedData.circulating
                : 0;
              element.max_supply = selectedData.max_supply
                ? selectedData.max_supply
                : 0;
              element.total_supply = selectedData.total_supply
                ? selectedData.total_supply
                : 0;
              element.roi = selectedData.roi ? selectedData.roi : 0;
              element.rank = selectedData.rank ? selectedData.rank : 0;
              element.currency_symbol = Singleton.getInstance().CurrencySymbol;
              newArray.push(element);
            } else {
              element.current_pricing = 0;
              element.price_change_percentage = 0;
              element.perPrice_in_fiat = 0;
              element.high = 0;
              element.low = 0;
              element.average = 0;
              element.change = 0;
              element.marketCap = 0;
              element.volume_24h = 0;
              element.circulating = 0;
              element.max_supply = 0;
              element.total_supply = 0;
              element.roi = 0;
              element.rank = 0;
              element.currency_symbol = Singleton.getInstance().CurrencySymbol;
              newArray.push(element);
            }
            totalBalance = totalBalance + element.current_pricing;
          }
          resolve(newArray);
          Singleton.getInstance().newSaveData(
            Constants.DASHBOARD_WALLET_LIST,
            JSON.stringify(newArray),
          );
          dashboardWalletListSuccess(dispatch, newArray);
        })
        .catch(error => {
          reject(error);
        });
    });
  };
};

/**************************************get graph data ****************************************************/
export const getGraphData = ({
  coinType,
  fiatType,
  timePeriod,
  access_token,
}) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      APIClient.getInstance()
        .get(
          API_GRAPH_DATA +
            'coinType=' +
            coinType +
            '&fiatType=' +
            fiatType +
            '&timePeriod=' +
            timePeriod,
          access_token,
        )
        .then(response => {
          // //console.warn('MM','getGraphData--- ', response);
          const res = response.data;
          var newArray = [];
          for (let i = 0; i < res.length; i++) {
            const element = res[i];
            newArray.push({
              y: element.value,
              marker: moment(element.updated_at).format(
                'DD MMM, YYYY | hh:mm a',
              ),
              price_percentage: element.price_change_24h,
              name: element.coin_type,
            });
          }
          // //console.warn('MM','chk new Arr::::', newArray);
          resolve(newArray);
          coinListSuccess(dispatch, newArray);
        })
        .catch(error => {
          //console.warn('MM','error getGraphData list-- ', error);
          reject(error);
          walletFail(dispatch, error);
        });
    });
  };
};

/**************************************coin Active Inactive****************************************************/
export const coinActiveInactive = ({
  coinId,
  walletAddress,
  isActive,
  access_token,
}) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      let data = {
        coinId: coinId,
        walletAddress: walletAddress,
        isActive: isActive,
      };
      //console.warn('MM','==>>', data);
      APIClient.getInstance()
        .post(API_ACTIVE_INACTIVE_COIN, data, access_token)
        .then(response => {
          //console.warn('MM','respone API_ACTIVE_INACTIVE_COIN--- ', response);
          let result = response;
          resolve(result);
          //activeInactiveSuccess(dispatch, response.token);
        })
        .catch(error => {
          //console.warn('MM','error API_ACTIVE_INACTIVE_COIN-- ', error);
          reject(error);
          walletFail(dispatch, error);
        });
    });
  };
};

/************************************** WALLET_GET_COIN_LIST_ORDER DASHBOARD API ****************************************************/
export const getWalletCoinListOrder = ({data, access_token}) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      //console.warn('MM',data);
      APIClient.getInstance()
        .post(WALLET_GET_COIN_LIST_ORDER, data, access_token)
        .then(response => {
          // //console.warn('MM','respone WALLET_GET_COIN_LIST_ORDER--- ', response);
          let result = response;
          resolve(result);
          Singleton.getInstance()
            .newSaveData(Constants.HOT_LIST, JSON.stringify(response))
            .then(res => {
              // //console.warn('MM','cointlistsingleton======res======:::::', res);
            });
        })
        .catch(error => {
          //console.warn('MM','error WALLET_GET_COIN_LIST_ORDER-- ', error);
          reject(error);
          walletFail(dispatch, error);
        });
    });
  };
};

/************************************** Transaction Api****************************************************/
export const getTransactionList = ({data, access_token}) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      //console.warn('MM',data);
      APIClient.getInstance()
        .post(API_TRANSACTION, data, access_token)
        .then(response => {
          // //console.warn('MM','respone API_TRANSACTION--- ', response);
          let result = response;
          resolve(result);
        })
        .catch(error => {
          //console.warn('MM','error API_TRANSACTION-- ', error);
          reject(error);
          walletFail(dispatch, error);
        });
    });
  };
};

/************************************** Buy Transaction Api****************************************************/
export const getBuyTransactionList = ({data, access_token}) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      //console.warn('MM',data);
      APIClient.getInstance()
        .post(API_BUYLIST, data, access_token)
        .then(response => {
          // //console.warn('MM','Buy Transaction API_TRANSACTION--- ', response);
          let result = response;
          resolve(result);
        })
        .catch(error => {
          //console.warn('MM','Buy Transaction API_TRANSACTION-- ', error);
          reject(error);
          walletFail(dispatch, error);
        });
    });
  };
};

/************************************** Buy rate Transaction Api****************************************************/
export const getBuyRAte = ({data, access_token}) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      //console.warn('MM','>>>>in', data);
      APIClient.getInstance()
        .post(API_GET_PRICE_EPAY, data, access_token)
        .then(response => {
          // //console.warn('MM','API_EpayRate Transaction API_TRANSACTION--- ', response);
          let result = response;
          resolve(result);
        })
        .catch(error => {
          //console.warn('MM','API_EpayRate Transaction API_TRANSACTION-- ', error);
          reject(error);
          walletFail(dispatch, error);
        });
    });
  };
};

/************************************** Transaction Detail Api ****************************************************/
export const getTransactionDetail = ({data, access_token}) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      //console.warn('MM',data);
      APIClient.getInstance()
        .post(API_TRANSACTION_DETAIL, data, access_token)
        .then(response => {
          //console.warn('MM','respone API_TRANSACTION_DETAIL--- ', response);
          let result = response;
          resolve(result);
        })
        .catch(error => {
          //console.warn('MM','error API_TRANSACTION_DETAIL-- ', error);
          reject(error);
          walletFail(dispatch, error);
        });
    });
  };
};

/************************************** SOCIAL MEDIA LINK LIST ****************************************************/
export const getSocialList = () => {
  return dispatch => {
    return new Promise(async (resolve, reject) => {
      let access_token = await Singleton.getInstance().newGetData(
        Constants.access_token,
      );
      APIClient.getInstance()
        .get(SOCIAL_LINK, access_token)
        .then(response => {
          console.warn('MM', 'response APISOCIAL_LINK-- ', response.data);
          let result = response.data;
          resolve(result);
        })
        .catch(error => {
          //console.warn('MM','error API_SOCIAL_LINK-- ', error);
          reject(error);
          // ethereumFail(dispatch, error);
        });
    });
  };
};

/************************************** COLOR LIST ****************************************************/
export const getColorList = ({access_token}) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      APIClient.getInstance()
        .get(COLOR_LIST, access_token)
        .then(response => {
          // //console.warn('MM','response API_COLOR_LIST-- ', response.data);
          let result = response.data;
          resolve(result);
        })
        .catch(error => {
          //console.warn('MM','error API_COLOR_LIST-- ', error);
          reject(error);
          // ethereumFail(dispatch, error);
        });
    });
  };
};
/************************************** FIAT CURRENCY ****************************************************/
export const getCurrencyPreferenceList = ({access_token}) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      APIClient.getInstance()
        .get(API_CURRENCY_PREFERENCE, access_token)
        .then(response => {
          // //console.warn('MM','response API_CURRENCY_PREFERENCE -- ', response.data);
          let result = response.data;
          resolve(result);
        })
        .catch(error => {
          //console.warn('MM','error API_CURRENCY_PREFERENCE -- ', error);
          reject(error);
          // ethereumFail(dispatch, error);
        });
    });
  };
};
/************************************** DAPP LIST ****************************************************/
export const getDappList = ({access_token}) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      APIClient.getInstance()
        .get(DAPP_LIST, access_token)
        .then(response => {
          // //console.warn('MM','response ----Action-getDappList -- ', response);
          let result = response;
          resolve(result);
          Singleton.getInstance().newSaveData(
            Constants.DAPP_LIST,
            JSON.stringify(response),
          );
        })
        .catch(error => {
          //console.warn('MM','error Action getDappList-- ', error);
          reject(error);
          // ethereumFail(dispatch, error);
        });
    });
  };
};
/************************************** FINANCE LIST ****************************************************/
export const getFinanceList = ({access_token}) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      APIClient.getInstance()
        .get(FINANCE_LIST, access_token)
        .then(response => {
          // //console.warn('MM','response ----Action-getFinanceList -- ', response);
          let result = response;
          resolve(result);
          Singleton.getInstance().newSaveData(
            Constants.FINANCE_LIST,
            JSON.stringify(response.data),
          );
        })
        .catch(error => {
          //console.warn('MM','error Action getFinanceList-- ', error);
          reject(error);
          // ethereumFail(dispatch, error);
        });
    });
  };
};
/************************************** BANNER API ****************************************************/
export const getAdvertisementList = ({access_token}) => {
  //console.warn('MM','herreeeeee');
  return dispatch => {
    return new Promise((resolve, reject) => {
      APIClient.getInstance()
        .get(BANNER_IMG, access_token)
        .then(response => {
          // //console.warn('MM','response API_BANNER_IMG -- ', response.data);
          // //console.warn('MM','response API_BANNER_IMG -- ');
          let result = response.data;
          resolve(result);
        })
        .catch(error => {
          //console.warn('MM','error API_BANNER_IMG -- ', error, BASE_URL + BANNER_IMG);
          reject(error);
          // ethereumFail(dispatch, error);
        });
    });
  };
};

/************************************** INFURA API ****************************************************/
export const getInfuraLink = () => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      APIClient.getInstance()
        .get(API_INFURA_LINK)
        .then(response => {
          // //console.warn('MM','response API_infura -- ', response.data);
          let result = response.data;
          resolve(result);
        })
        .catch(error => {
          //console.warn('MM','error API_infura -- ', error);
          reject(error);
          // ethereumFail(dispatch, error);
        });
    });
  };
};

/************************************** INFURA API ****************************************************/
export const getDexUrls = access_token => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      APIClient.getInstance()
        .get(API_DEX_URLS, access_token)
        .then(response => {
          console.warn('MM', 'response API_infura -- ', response.data);
          let result = response.data;
          let data = {
            epayUrl: '',
            liquidityUrl: '',
            stakeUrl: '',
            publicBscUrl: '',
            publicEthUrl: '',
          };
          response.data?.map(item => {
            if (item.name.toUpperCase() == 'LIQUIDITY_DEX') {
              data.liquidityUrl = item.url;
            } else if (item.name.toUpperCase() == 'EPAY') {
              data.epayUrl = item.url;
            } else if (item.name.toUpperCase() == 'NEW_STAKE') {
              data.stakeUrl = item.url;
            } else if (item.name.toUpperCase() == 'BSC_PUBLIC_URL') {
              data.publicBscUrl = item.url;
            } else if (item.name.toUpperCase() == 'ETH_PUBLIC_URL') {
              data.publicEthUrl = item.url;
            } else if (item?.name?.toUpperCase() == 'MATIC_INSTA_NODE') {
              Constants.mainnetInfuraLinkMatic = item.url;
              Singleton.getInstance().maticLink = item.url;
            } else if (item?.name?.toUpperCase() == 'SAITACHAIN_NODE') {
              Constants.mainnetInfuraLinkSTC = item.url;
              Singleton.getInstance().stcLink = item.url;
              data.publicStcUrl = item.url;
            } else if (item?.name?.toUpperCase() == 'SAITACHAIN_EXPLORER') {
              if (item.url) {
                console.log('item.url:::::', item.url);
                Singleton.getInstance().stcExplorerLink = item.url;
              }
            }
          });
          saveDexUrls(dispatch, data);
          resolve(result);
        })
        .catch(error => {
          //console.warn('MM','error API_infura -- ', error);
          reject(error);
          // ethereumFail(dispatch, error);
        });
    });
  };
};
/************************************** INFURA API ****************************************************/
export const getInfuraBNBLink = () => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      APIClient.getInstance()
        .get(API_INFURA_LINKBNB)
        .then(response => {
          // //console.warn('MM','response API_infura -- ', response.data);
          let result = response.data;
          resolve(result);
        })
        .catch(error => {
          //console.warn('MM','error API_infura -- ', error);
          reject(error);
          // ethereumFail(dispatch, error);
        });
    });
  };
};
/************************************** get crypto price ****************************************************/
export const getCryptoPrice = data => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      APIClient.getInstance()
        .post(API_CRYPTO_PRICE_NEW, data)
        .then(response => {
          let result = response;
          resolve(result);
        })
        .catch(error => {
          reject(error);
          walletFail(dispatch, error);
        });
    });
  };
};
/************************************** get swap coinlist price ****************************************************/
export const getSwapListAll = ({access_token, data}) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      APIClient.getInstance()
        .post(API_SWAP_NEW, data, access_token)
        .then(response => {
          let result = response;
          resolve(result);
        })
        .catch(error => {
          reject(error);
          walletFail(dispatch, error);
        });
    });
  };
};

/************************************** get swap coinlist price ****************************************************/
export const getStcGasEstimate = ({access_token}) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      APIClient.getInstance()
        .get(STC_GAS_LIMIT, access_token)
        .then(response => {
          let result = response;
          resolve(result);
        })
        .catch(error => {
          reject(error);
          //
        });
    });
  };
};
/************************************** get swap coinlist price ****************************************************/
export const getSwapList = ({access_token}) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      APIClient.getInstance()
        .get(API_SWAP_COIN_LIST_NEW, access_token)
        .then(response => {
          let result = response;
          resolve(result);
        })
        .catch(error => {
          reject(error);
          walletFail(dispatch, error);
        });
    });
  };
};

/************************************** get swap bnb coinlist price ****************************************************/
export const getSwapBnbList = ({access_token}) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      APIClient.getInstance()
        .get(API_SWAP_COIN_LIST_BNB, access_token)
        .then(response => {
          let result = response;
          resolve(result);
        })
        .catch(error => {
          reject(error);
          walletFail(dispatch, error);
        });
    });
  };
};

/************************************** get router details ****************************************************/
export const getRouterDetails = () => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      APIClient.getInstance()
        .get(API_Contract_Info)
        .then(response => {
          let result = response;
          resolve(result);
        })
        .catch(error => {
          reject(error);
          walletFail(dispatch, error);
        });
    });
  };
};

/************************************** get router details ****************************************************/
export const CheckForSwapToken = ({data, access_token}) => {
  return dispatch => {
    console.log('data:::::', data);
    return new Promise((resolve, reject) => {
      APIClient.getInstance()
        .post(CHECK_FOR_SWAP_TOKEN, data, access_token)
        .then(response => {
          let result = response;
          resolve(result);
        })
        .catch(error => {
          reject(error);
        });
    });
  };
};
/************************************** check is contact exist ****************************************************/
export const CheckIsContactExist = ({data, access_token}) => {
  return dispatch => {
    console.log('data:::::', data);
    return new Promise((resolve, reject) => {
      APIClient.getInstance()
        .post(CHECK_EXIST_CONTACT, data, access_token)
        .then(response => {
          let result = response;
          resolve(result);
        })
        .catch(error => {
          reject(error);
        });
    });
  };
};
/************************************** Logout Api ****************************************************/
export const logoutUser = ({data, access_token}) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      APIClient.getInstance()
        .post(API_LOGOUT, data, access_token)
        .then(response => {
          // //console.warn('MM','respone logoutUser--- ', response);
          let result = response;
          resolve(result);
        })
        .catch(error => {
          //console.warn('MM','error logoutUser-- ', error);
          reject(error);
          walletFail(dispatch, error);
        });
    });
  };
};

/************************************** get epay merchant ****************************************************/
export const epayMerchant = ({data, access_token}) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      //console.warn('MM',data);
      APIClient.getInstance()
        .post(API_EPAY_ORDER_V2, data, access_token)
        .then(response => {
          // //console.warn('MM','respone epayorder--- ', response);
          let result = response;
          resolve(result);
        })
        .catch(error => {
          //console.warn('MM','error epayorder+-- ', error);
          reject(error);
          walletFail(dispatch, error);
        });
    });
  };
};

/************************************** on meaintenance ****************************************************/
export const checkMaintenance = () => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      console.warn('MM checkMaintenance');
      APIClient.getInstance()
        .get(CHECK_MAINTENANCE)
        .then(response => {
          // //console.warn('MM','respone epayorder--- ', response);
          let result = response;
          resolve(result);
        })
        .catch(error => {
          //console.warn('MM','error epayorder+-- ', error);
          reject(error);
          walletFail(dispatch, error);
        });
    });
  };
};

export const updateListBalances = () => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      console.warn('MM updateListBalances');
      let access_token = Singleton.getInstance().access_token;
      APIClient.getInstance()
        .get(UPDATE_WALLET_BALANCES, access_token)
        .then(response => {
          console.warn('MM', 'respone updateListBalances--- ', response);
          let result = response;
          resolve(result);
        })
        .catch(error => {
          console.warn('MM', 'error updateListBalances+-- ', error);
          reject(error);
        });
    });
  };
};
export const coinListSuccess = (dispatch, result) => {
  dispatch({
    type: COIN_LIST,
    payload: result,
  });
};
export const coinListEmpty = () => dispatch => {
  Singleton.getInstance().newSaveData(
    Constants.WALLET_LIST,
    JSON.stringify([]),
  );

  console.log('coinListEmpty');
  dispatch({
    type: COIN_LIST_EMPTY,
    payload: [],
  });
};
export const myWalletListSuccess = (dispatch, result) => {
  dispatch({
    type: MYWALLET_LIST,
    payload: result,
  });
};
export const dashboardWalletListSuccess = (dispatch, result) => {
  dispatch({
    type: DASHBOARD_WALLET_LIST,
    payload: result,
  });
};
export const activeInactiveSuccess = (dispatch, result) => {
  dispatch({
    type: ACTIVE_INACTIVE_COIN,
    payload: result,
  });
};
export const walletFail = (dispatch, result) => {
  dispatch({
    type: WALLET_FAIL,
    payload: result,
  });
};
export const saveDexUrls = (dispatch, result) => {
  dispatch({
    type: SAVE_DEX_URLS,
    payload: result,
  });
};

export const clearReducer = dispatch => {
  dispatch({
    type: CLEAR_REDUCER,
    payload: null,
  });
};
