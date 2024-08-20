import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Colors, Fonts, Images} from '../../theme';
import {useDispatch, useSelector} from 'react-redux';
import {
  getBnbGasEstimate,
  getBnbNonce,
  getEthGasPrice,
  getMaticGasEstimate,
  getSTCGasPrice,
  sendETH,
} from '../../Redux/Actions';
import Web3 from 'web3';
import * as Constants from '../../Constant';
import {SimpleHeader, BasicButton, BorderLine} from '.';
import {Loader} from '../Screens';
import {
  exponentialToDecimalWithoutComma,
  getStcNonce,
  sendTokenBNB,
  sendTokenSTC,
  signWalletConnectTxn,
  signWalletConnectTxnMatic,
} from '../../utils';
import Singleton from '../../Singleton';
import {IS_PRODUCTION} from '../../Endpoints';
import {ThemeManager} from '../../../ThemeManager';
import {SimpleHeaderNew} from '.';
import {
  transactionConfirm,
  wallectConnectParamsUpdate,
} from '../../Redux/Actions/WallectConnectActions';
import {SafeAreaView} from 'react-native-safe-area-context';
import {areaDimen, heightDimen, widthDimen} from '../../Utils/themeUtils';
import DeviceInfo from 'react-native-device-info';
import WalletConnect from '../../Utils/WalletConnect';
const gasFeeMultiplier = 0.000000000000000001;
const web3BNB = new Web3(
  IS_PRODUCTION == 0
    ? 'https://data-seed-prebsc-1-s1.binance.org:8545/'
    : Singleton.getInstance().bnbLink,
);
const web3 = new Web3(
  IS_PRODUCTION == 0 ? Constants.testnetEth : Singleton.getInstance().ethLink,
);
const web3Matic = new Web3(
  IS_PRODUCTION == 0
    ? Constants.testnetMatic
    : Singleton.getInstance().maticLink,
);
const web3Stc = new Web3(Singleton.getInstance().stcLink);
var weiDivider = 1000000000000000000;
let hasNotch = DeviceInfo.hasNotch();
let hasDynamicIsland = DeviceInfo.hasDynamicIsland();
console.log('deviceModel:::::::', hasDynamicIsland);
const TransactionModal = ({store}) => {
  const dispatch = useDispatch();
  const [advanceSettingModal, setadvanceSettingModal] = useState(false);
  const [slow, setslow] = useState(false);
  const [fast, setfast] = useState(false);
  const [average, setaverage] = useState(false);
  const [loading, setloading] = useState(false);
  const [showLoader, setshowLoader] = useState(false);
  const walletConnectReducer = useSelector(
    state => state?.walletConnectReducer,
  );
  const [selectedDapp, setSelectedDapp] = useState({});

  const coinList = useSelector(state => state.walletReducer.myWallets);
  const coinSymbol =
    walletConnectReducer?.wcCoinFamily === 4
      ? Constants.COIN_SYMBOL.STC
      : walletConnectReducer?.wcCoinFamily === 1
      ? Constants.COIN_SYMBOL.ETH
      : walletConnectReducer?.wcCoinFamily === 6
      ? Constants.COIN_SYMBOL.BNB
      : Constants.COIN_SYMBOL.MATIC;

  useEffect(() => {
    getSelectedDapp();
    setadvanceSettingModal(false);
    setshowLoader(true);
    let timer = setTimeout(() => {
      let trxPayload = walletConnectReducer.wcTransactionInfo;
      console.log('__________amt', trxPayload?.params?.request.params);
      if (trxPayload?.hasOwnProperty('params')) {
        let chainId = trxPayload?.params?.chainId?.substring(
          7,
          trxPayload?.params?.chainId?.length,
        );
        let coin_family = walletConnectReducer?.wcCoinFamily;
        console.warn(
          'MM',
          'chainId:::::',
          chainId,
          'coin_family:::::',
          coin_family,
        );
        Singleton.getInstance()
          .newGetData(Constants.access_token)
          .then(token => {
            console.warn('MM', 'access_token>>>>', token);
            if (coin_family == 6) {
              dispatch(
                getBnbGasEstimate({
                  blockChain: Constants.NETWORK.BINANCE_SMART_CHAIN,
                  data: {
                    from: Singleton.getInstance().defaultEthAddress,
                    to: Singleton.getInstance().defaultEthAddress,
                    amount: '',
                  },
                  contractAddress: Constants.COIN_SYMBOL.BNB,
                  access_token: token,
                }),
              )
                .then(async gasPrice_res => {
                  console.log('gasPrice_res::::', gasPrice_res);
                  let gasPrice = {
                    SafeGasPrice: gasPrice_res.resultList[0]?.safe_gas_price,
                    ProposeGasPrice:
                      gasPrice_res.resultList[0]?.propose_gas_price,
                    FastGasPrice: gasPrice_res.resultList[0]?.fast_gas_price,
                  };
                  let requestParam = trxPayload?.params?.request.params[0];
                  console.warn('MM', 'gasPrice BNB ::::::', gasPrice);
                  let limit = trxPayload?.params?.request.params?.[0]?.gas
                    ? parseInt(trxPayload?.params?.request.params?.[0]?.gas, 16)
                    : 0;
                  if (limit == 0) {
                    limit = await web3BNB.eth.estimateGas(requestParam);
                    console.log('limit......', limit);
                    limit = limit + 30000;
                  }
                  let slow =
                    IS_PRODUCTION == 0
                      ? 10 * 10 ** 9
                      : gasPrice.SafeGasPrice * 1000000000;
                  let initialValueSlow = slow * limit;
                  let slowFee = (initialValueSlow * gasFeeMultiplier).toFixed(
                    5,
                  );
                  let average =
                    IS_PRODUCTION == 0
                      ? 10 * 10 ** 9
                      : gasPrice.ProposeGasPrice * 1000000000;
                  let initialValueAverage = average * limit;
                  let averageFee = (
                    initialValueAverage * gasFeeMultiplier
                  ).toFixed(5);
                  let fast =
                    IS_PRODUCTION == 0
                      ? 10 * 10 ** 9
                      : gasPrice.FastGasPrice * 1000000000;
                  let initialValueFast = fast * limit;
                  let fastFee = (initialValueFast * gasFeeMultiplier).toFixed(
                    5,
                  );
                  if (
                    trxPayload?.params?.request.params?.[0]?.length > 0 &&
                    trxPayload?.params?.request.params?.[0]?.gasPrice
                  ) {
                    trxPayload.params.request.params[0].gasPrice =
                      web3.utils.toHex(average);
                  }
                  let NetworkFee = averageFee;
                  let amount = exponentialToDecimalWithoutComma(
                    parseInt(
                      trxPayload != null &&
                        trxPayload?.params?.request.params?.[0]?.value,
                      16,
                    ) / weiDivider,
                  );
                  let totalAmount =
                    parseFloat(averageFee) +
                    (trxPayload?.params?.request.params?.[0]?.value
                      ? parseFloat(amount)
                      : 0);
                  setaverage(true);
                  dispatch(
                    wallectConnectParamsUpdate({
                      prop: 'NetworkFee',
                      value: NetworkFee,
                    }),
                  );
                  dispatch(
                    wallectConnectParamsUpdate({
                      prop: 'TotalAmount',
                      value: totalAmount,
                    }),
                  );
                  dispatch(
                    wallectConnectParamsUpdate({
                      prop: 'slowFee',
                      value: slowFee,
                    }),
                  );
                  dispatch(
                    wallectConnectParamsUpdate({
                      prop: 'averageFee',
                      value: averageFee,
                    }),
                  );
                  dispatch(
                    wallectConnectParamsUpdate({
                      prop: 'fastFee',
                      value: fastFee,
                    }),
                  );
                  dispatch(
                    wallectConnectParamsUpdate({
                      prop: 'selectedFee',
                      value: 'average',
                    }),
                  );
                  dispatch(
                    wallectConnectParamsUpdate({
                      prop: 'bnbEstimateRes',
                      value: gasPrice,
                    }),
                  );
                  dispatch(
                    wallectConnectParamsUpdate({
                      prop: 'SelectedGasprice',
                      value: average,
                    }),
                  );
                  dispatch(
                    wallectConnectParamsUpdate({
                      prop: 'gaslimitForTxn',
                      value: limit,
                    }),
                  );
                  dispatch(
                    wallectConnectParamsUpdate({
                      prop: 'payload',
                      value: trxPayload,
                    }),
                  );
                  dispatch(
                    wallectConnectParamsUpdate({
                      prop: 'slowGwei',
                      value: web3BNB.utils.toHex(slow),
                    }),
                  );
                  dispatch(
                    wallectConnectParamsUpdate({
                      prop: 'isWcPopUp',
                      value: true,
                    }),
                  );
                  setshowLoader(false);
                })
                .catch(err => {
                  setshowLoader(false);
                  console.warn('MM', 'gasPrice:::::: err', err);
                  onRejectTransaction(walletConnectReducer);
                  global.callRequest = false;
                  global.requestFromDeepLink = false;
                });
            } else if (coin_family == 1) {
              dispatch(getEthGasPrice({access_token: token}))
                .then(async gasPrice => {
                  console.warn('MM', 'gasPrice::::::', gasPrice);
                  let limit = trxPayload?.params?.request.params?.[0]?.gas
                    ? parseInt(trxPayload?.params?.request.params?.[0]?.gas, 16)
                    : 0;
                  let requestParam = trxPayload?.params?.request.params?.[0];
                  if (limit == 0) {
                    limit = await web3.eth.estimateGas(requestParam);
                    console.log('limit......', limit);
                    limit = limit + 30000;
                  }
                  console.log('--', limit);
                  let slow = gasPrice.SafeGasPrice * 1000000000;
                  let initialValueSlow = slow * limit;
                  let slowFee = (initialValueSlow * gasFeeMultiplier).toFixed(
                    5,
                  );

                  let average = gasPrice.ProposeGasPrice * 1000000000;
                  let initialValueAverage = average * limit;
                  let averageFee = (
                    initialValueAverage * gasFeeMultiplier
                  ).toFixed(5);

                  let fast = gasPrice.FastGasPrice * 1000000000;
                  let initialValueFast = fast * limit;
                  let fastFee = (initialValueFast * gasFeeMultiplier).toFixed(
                    5,
                  );
                  console.warn('MM', 'wcr', trxPayload?.params);
                  if (
                    trxPayload?.params?.request.params?.[0]?.length > 0 &&
                    trxPayload?.params?.request.params?.[0]?.gasPrice
                  ) {
                    trxPayload.params.request.params[0].gasPrice =
                      web3.utils.toHex(average);
                  }
                  let NetworkFee = averageFee;
                  console.warn('MM', '1111', trxPayload);
                  let amount = exponentialToDecimalWithoutComma(
                    parseInt(
                      trxPayload != null &&
                        trxPayload?.params?.request.params?.[0]?.value,
                      16,
                    ) / weiDivider,
                  );
                  let totalAmount =
                    parseFloat(averageFee) +
                    (trxPayload?.params?.request.params?.[0]?.value
                      ? parseFloat(amount)
                      : 0);
                  setaverage(true);
                  dispatch(
                    wallectConnectParamsUpdate({
                      prop: 'NetworkFee',
                      value: NetworkFee,
                    }),
                  );
                  dispatch(
                    wallectConnectParamsUpdate({
                      prop: 'TotalAmount',
                      value: totalAmount,
                    }),
                  );
                  dispatch(
                    wallectConnectParamsUpdate({
                      prop: 'slowFee',
                      value: slowFee,
                    }),
                  );
                  dispatch(
                    wallectConnectParamsUpdate({
                      prop: 'averageFee',
                      value: averageFee,
                    }),
                  );
                  dispatch(
                    wallectConnectParamsUpdate({
                      prop: 'fastFee',
                      value: fastFee,
                    }),
                  );
                  dispatch(
                    wallectConnectParamsUpdate({
                      prop: 'selectedFee',
                      value: 'average',
                    }),
                  );
                  dispatch(
                    wallectConnectParamsUpdate({
                      prop: 'bnbEstimateRes',
                      value: gasPrice,
                    }),
                  );
                  dispatch(
                    wallectConnectParamsUpdate({
                      prop: 'SelectedGasprice',
                      value: average,
                    }),
                  );
                  dispatch(
                    wallectConnectParamsUpdate({
                      prop: 'gaslimitForTxn',
                      value: limit,
                    }),
                  );
                  dispatch(
                    wallectConnectParamsUpdate({
                      prop: 'payload',
                      value: trxPayload,
                    }),
                  );
                  dispatch(
                    wallectConnectParamsUpdate({
                      prop: 'slowGwei',
                      value: web3BNB.utils.toHex(slow),
                    }),
                  );
                  dispatch(
                    wallectConnectParamsUpdate({
                      prop: 'isWcPopUp',
                      value: true,
                    }),
                  );
                  console.warn('MM', '11122221');
                  setTimeout(() => {
                    setshowLoader(false);
                  }, 300);
                })
                .catch(err => {
                  console.warn('MM', 'gasPrice:::::: err', err);
                  onRejectTransaction(walletConnectReducer);
                  global.callRequest = false;
                  global.requestFromDeepLink = false;
                });
            } else if (coin_family == 4) {
              dispatch(getSTCGasPrice())
                .then(async gasPrices => {
                  console.log('gasPrices:::::', gasPrices);
                  let gasPrice = {
                    SafeGasPrice: gasPrices?.data?.safeGasPrice,
                    ProposeGasPrice: gasPrices?.data?.proposeGasPrice,
                    FastGasPrice: gasPrices?.data?.fastGasPrice,
                  };
                  let requestParam = trxPayload?.params?.request.params[0];
                  console.warn('MM', 'gasPrice STC ::::::', gasPrice);
                  let limit = trxPayload?.params?.request.params?.[0]?.gas
                    ? parseInt(trxPayload?.params?.request.params?.[0]?.gas, 16)
                    : 0;
                  if (limit == 0) {
                    limit = await web3Stc.eth.estimateGas(requestParam);
                    console.log('limit......', limit);
                  }
                  console.log('limit......', limit);
                  let slow =
                    IS_PRODUCTION == 0
                      ? 10 * 10 ** 9
                      : gasPrice.SafeGasPrice * 1000000000;
                  let initialValueSlow = slow * limit;
                  let slowFee = (initialValueSlow * gasFeeMultiplier).toFixed(
                    5,
                  );
                  let average =
                    IS_PRODUCTION == 0
                      ? 10 * 10 ** 9
                      : gasPrice.ProposeGasPrice * 1000000000;
                  let initialValueAverage = average * limit;
                  let averageFee = (
                    initialValueAverage * gasFeeMultiplier
                  ).toFixed(5);
                  let fast =
                    IS_PRODUCTION == 0
                      ? 10 * 10 ** 9
                      : gasPrice.FastGasPrice * 1000000000;
                  let initialValueFast = fast * limit;
                  let fastFee = (initialValueFast * gasFeeMultiplier).toFixed(
                    5,
                  );
                  if (
                    trxPayload?.params?.request.params?.[0]?.length > 0 &&
                    trxPayload?.params?.request.params?.[0]?.gasPrice
                  ) {
                    trxPayload.params.request.params[0].gasPrice =
                      web3.utils.toHex(average);
                  }
                  let NetworkFee = averageFee;
                  let amount = exponentialToDecimalWithoutComma(
                    parseInt(
                      trxPayload != null &&
                        trxPayload?.params?.request.params?.[0]?.value,
                      16,
                    ) / weiDivider,
                  );
                  let totalAmount =
                    parseFloat(averageFee) +
                    (trxPayload?.params?.request.params?.[0]?.value
                      ? parseFloat(amount)
                      : 0);
                  setaverage(true);
                  dispatch(
                    wallectConnectParamsUpdate({
                      prop: 'NetworkFee',
                      value: NetworkFee,
                    }),
                  );
                  dispatch(
                    wallectConnectParamsUpdate({
                      prop: 'TotalAmount',
                      value: totalAmount,
                    }),
                  );
                  dispatch(
                    wallectConnectParamsUpdate({
                      prop: 'slowFee',
                      value: slowFee,
                    }),
                  );
                  dispatch(
                    wallectConnectParamsUpdate({
                      prop: 'averageFee',
                      value: averageFee,
                    }),
                  );
                  dispatch(
                    wallectConnectParamsUpdate({
                      prop: 'fastFee',
                      value: fastFee,
                    }),
                  );
                  dispatch(
                    wallectConnectParamsUpdate({
                      prop: 'selectedFee',
                      value: 'average',
                    }),
                  );
                  dispatch(
                    wallectConnectParamsUpdate({
                      prop: 'bnbEstimateRes',
                      value: gasPrice,
                    }),
                  );
                  dispatch(
                    wallectConnectParamsUpdate({
                      prop: 'SelectedGasprice',
                      value: average,
                    }),
                  );
                  dispatch(
                    wallectConnectParamsUpdate({
                      prop: 'gaslimitForTxn',
                      value: limit,
                    }),
                  );
                  dispatch(
                    wallectConnectParamsUpdate({
                      prop: 'payload',
                      value: trxPayload,
                    }),
                  );
                  dispatch(
                    wallectConnectParamsUpdate({
                      prop: 'slowGwei',
                      value: web3BNB.utils.toHex(slow),
                    }),
                  );
                  dispatch(
                    wallectConnectParamsUpdate({
                      prop: 'isWcPopUp',
                      value: true,
                    }),
                  );
                  setshowLoader(false);
                })
                .catch(err => {
                  setshowLoader(false);
                  console.warn('MM', 'gasPrice:::::: err', err);
                  onRejectTransaction(walletConnectReducer);
                  global.callRequest = false;
                  global.requestFromDeepLink = false;
                });
            } else {
              dispatch(
                getMaticGasEstimate({
                  data: {
                    from: Singleton.getInstance().defaultEthAddress,
                    to: Singleton.getInstance().defaultEthAddress,
                    amount: '',
                  },
                  contractAddress: Constants.COIN_SYMBOL.MATIC,
                  access_token: token,
                }),
              )
                .then(async gasPrice_res => {
                  console.log('reeeesss', gasPrice_res);
                  let gasPrice = {
                    SafeGasPrice: gasPrice_res.resultList[0]?.safe_gas_price,
                    ProposeGasPrice:
                      gasPrice_res.resultList[0]?.propose_gas_price,
                    FastGasPrice: gasPrice_res.resultList[0]?.fast_gas_price,
                  };
                  console.warn('MM', 'gasPrice BNB ::::::', gasPrice);
                  let limit = trxPayload?.params?.request.params?.[0]?.gas
                    ? parseInt(trxPayload?.params?.request.params?.[0]?.gas, 16)
                    : 0;
                  let requestParam = trxPayload?.params?.request.params?.[0];
                  if (limit == 0) {
                    limit = await web3Matic.eth.estimateGas(requestParam);
                    console.log('limit......', limit);
                    limit = limit + 30000;
                  }

                  let slow =
                    IS_PRODUCTION == 0
                      ? 10 * 10 ** 9
                      : gasPrice.SafeGasPrice * 1000000000;
                  let initialValueSlow = slow * limit;
                  let slowFee = (initialValueSlow * gasFeeMultiplier).toFixed(
                    5,
                  );

                  let average =
                    IS_PRODUCTION == 0
                      ? 10 * 10 ** 9
                      : gasPrice.ProposeGasPrice * 1000000000;
                  let initialValueAverage = average * limit;
                  let averageFee = (
                    initialValueAverage * gasFeeMultiplier
                  ).toFixed(5);

                  let fast =
                    IS_PRODUCTION == 0
                      ? 10 * 10 ** 9
                      : gasPrice.FastGasPrice * 1000000000;
                  let initialValueFast = fast * limit;
                  let fastFee = (initialValueFast * gasFeeMultiplier).toFixed(
                    5,
                  );
                  if (
                    trxPayload?.params?.request.params?.[0]?.length > 0 &&
                    trxPayload?.params?.request.params?.[0]?.gasPrice
                  ) {
                    trxPayload.params.request.params[0].gasPrice =
                      web3.utils.toHex(average);
                  }
                  let NetworkFee = averageFee;
                  let amount = exponentialToDecimalWithoutComma(
                    parseInt(
                      trxPayload != null &&
                        trxPayload?.params?.request.params?.[0]?.value,
                      16,
                    ) / weiDivider,
                  );
                  let totalAmount =
                    parseFloat(averageFee) +
                    (trxPayload?.params?.request.params?.[0]?.value
                      ? parseFloat(amount)
                      : 0);
                  setaverage(true);
                  dispatch(
                    wallectConnectParamsUpdate({
                      prop: 'NetworkFee',
                      value: NetworkFee,
                    }),
                  );
                  dispatch(
                    wallectConnectParamsUpdate({
                      prop: 'TotalAmount',
                      value: totalAmount,
                    }),
                  );
                  dispatch(
                    wallectConnectParamsUpdate({
                      prop: 'slowFee',
                      value: slowFee,
                    }),
                  );
                  dispatch(
                    wallectConnectParamsUpdate({
                      prop: 'averageFee',
                      value: averageFee,
                    }),
                  );
                  dispatch(
                    wallectConnectParamsUpdate({
                      prop: 'fastFee',
                      value: fastFee,
                    }),
                  );
                  dispatch(
                    wallectConnectParamsUpdate({
                      prop: 'selectedFee',
                      value: 'average',
                    }),
                  );
                  dispatch(
                    wallectConnectParamsUpdate({
                      prop: 'bnbEstimateRes',
                      value: gasPrice,
                    }),
                  );
                  dispatch(
                    wallectConnectParamsUpdate({
                      prop: 'SelectedGasprice',
                      value: average,
                    }),
                  );
                  dispatch(
                    wallectConnectParamsUpdate({
                      prop: 'gaslimitForTxn',
                      value: limit,
                    }),
                  );
                  dispatch(
                    wallectConnectParamsUpdate({
                      prop: 'payload',
                      value: trxPayload,
                    }),
                  );
                  dispatch(
                    wallectConnectParamsUpdate({
                      prop: 'slowGwei',
                      value: web3BNB.utils.toHex(slow),
                    }),
                  );
                  dispatch(
                    wallectConnectParamsUpdate({
                      prop: 'isWcPopUp',
                      value: true,
                    }),
                  );
                  setTimeout(() => {
                    setshowLoader(false);
                  }, 300);
                })
                .catch(err => {
                  setshowLoader(false);
                  console.warn('MM', 'gasPrice:::::: err', err);
                  onRejectTransaction(walletConnectReducer);
                  global.callRequest = false;
                  global.requestFromDeepLink = false;
                });
            }
          })
          .catch(err => {
            console.log('erererrr', err);
            onRejectTransaction(walletConnectReducer);
            global.callRequest = false;
            global.requestFromDeepLink = false;
          });
      }
    }, 100);

    return () => {
      if (timer) {
        console.log('######## CLEAR TIMER  #######');
        clearTimeout(timer);
      }
    };
  }, []);

  const getSelectedDapp = async () => {
    let sessions =
      await WalletConnect.getInstance()?.web3Wallet?.getActiveSessions();
    if (sessions) {
      let keys = Object.keys(sessions);
      let connectionList = [];
      keys?.map(el => {
        connectionList.push(sessions[el]);
      });
      console.log('tempDapp:::', connectionList);
      let tempDapp = connectionList?.find(
        item => item?.topic == walletConnectReducer?.wcTransactionInfo?.topic,
      );
      console.log('tempDapp:::', tempDapp);
      setSelectedDapp(tempDapp);
    }
  };
  const getCurrencyFromChainId = coin_family => {
    let currency = {
      coin_icon: '',
      coin_chain: '',
      coin_address: '',
      chainId: '',
    };
    global.alreadyCalled = false;
    if (coin_family == 1) {
      currency = {
        coin_icon: require('../../../assets/images/ETH.png'),
        coin_chain: 'Ethereum',
        coin_address: Singleton.getInstance().defaultEthAddress,
        chainId: IS_PRODUCTION == 0 ? 5 : 1,
      };
    } else if (coin_family == 6) {
      currency = {
        coin_icon: ThemeManager.ImageIcons.bnb,
        coin_chain: 'Binance Smart Chain(BNB)',
        coin_address: Singleton.getInstance().defaultEthAddress,
        chainId: IS_PRODUCTION == 0 ? 97 : 56,
      };
    } else if (coin_family == 4) {
      currency = {
        coin_icon: {
          uri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/20513.png',
        },
        coin_chain: 'Saita Blockchain(SBC)',
        coin_address: Singleton.getInstance().defaultStcAddress,
        chainId: 1209,
      };
    } else {
      currency = {
        coin_icon: Images.polygon,
        coin_chain: 'Polygon',
        coin_address: Singleton.getInstance().defaultEthAddress,
        chainId: 137,
      };
    }

    return currency;
  };
  const slowAction = walletConnectReducer => {
    const payloadData = walletConnectReducer?.payload;
    console.log('payloaddddd', payloadData);
    let slow =
      walletConnectReducer?.bnbEstimateRes != '' &&
      walletConnectReducer?.bnbEstimateRes?.SafeGasPrice * 1000000000;
    console.log('slowwwww', slow);
    dispatch(
      wallectConnectParamsUpdate({prop: 'SelectedGasprice', value: slow}),
    );
    payloadData.params.request.params[0].gasPrice = Web3.utils.toHex(slow);
    let NetworkFee = walletConnectReducer?.slowFee;
    let amount = exponentialToDecimalWithoutComma(
      parseInt(
        payloadData != null && payloadData?.params?.request.params[0]?.value,
        16,
      ) / weiDivider,
    );
    let totalAmount =
      parseFloat(walletConnectReducer?.slowFee) +
      (payloadData?.params?.request.params[0]?.value ? parseFloat(amount) : 0);
    dispatch(
      wallectConnectParamsUpdate({prop: 'NetworkFee', value: NetworkFee}),
    );
    dispatch(
      wallectConnectParamsUpdate({prop: 'TotalAmount', value: totalAmount}),
    );
    dispatch(wallectConnectParamsUpdate({prop: 'selectedFee', value: 'slow'}));
    dispatch(wallectConnectParamsUpdate({prop: 'payload', value: payloadData}));
    setslow(true);
    setfast(false);
    setaverage(false);
  };
  const mediumAction = walletConnectReducer => {
    const payloadData = walletConnectReducer?.payload;
    let average =
      walletConnectReducer?.bnbEstimateRes?.ProposeGasPrice * 1000000000;
    dispatch(
      wallectConnectParamsUpdate({prop: 'SelectedGasprice', value: average}),
    );
    payloadData.params.request.params[0].gasPrice = Web3.utils.toHex(average);
    let NetworkFee = walletConnectReducer?.averageFee;
    let amount = exponentialToDecimalWithoutComma(
      parseInt(
        payloadData != null && payloadData?.params?.request.params[0]?.value,
        16,
      ) / weiDivider,
    );
    let totalAmount =
      parseFloat(walletConnectReducer?.averageFee) +
      (payloadData?.params?.request.params[0]?.value ? parseFloat(amount) : 0);
    dispatch(
      wallectConnectParamsUpdate({prop: 'NetworkFee', value: NetworkFee}),
    );
    dispatch(
      wallectConnectParamsUpdate({prop: 'TotalAmount', value: totalAmount}),
    );
    dispatch(
      wallectConnectParamsUpdate({prop: 'selectedFee', value: 'average'}),
    );
    dispatch(wallectConnectParamsUpdate({prop: 'payload', value: payloadData}));
    setslow(false);
    setfast(false);
    setaverage(true);
  };
  const highAction = walletConnectReducer => {
    const payloadData = walletConnectReducer?.payload;
    let fast = walletConnectReducer?.bnbEstimateRes?.FastGasPrice * 1000000000;
    dispatch(
      wallectConnectParamsUpdate({prop: 'SelectedGasprice', value: fast}),
    );
    payloadData.params.request.params[0].gasPrice = Web3.utils.toHex(fast);
    let NetworkFee = walletConnectReducer?.fastFee;
    let amount = exponentialToDecimalWithoutComma(
      parseInt(
        payloadData != null && payloadData?.params?.request.params[0]?.value,
        16,
      ) / weiDivider,
    );
    let totalAmount =
      parseFloat(walletConnectReducer?.fastFee) +
      (payloadData?.params?.request.params[0]?.value ? parseFloat(amount) : 0);
    dispatch(
      wallectConnectParamsUpdate({prop: 'NetworkFee', value: NetworkFee}),
    );
    dispatch(
      wallectConnectParamsUpdate({prop: 'TotalAmount', value: totalAmount}),
    );
    dispatch(wallectConnectParamsUpdate({prop: 'selectedFee', value: 'fast'}));
    dispatch(wallectConnectParamsUpdate({prop: 'payload', value: payloadData}));
    setslow(false);
    setfast(true);
    setaverage(false);
  };
  const getMarketPrice = () => {
    let chain___ =
      walletConnectReducer?.wcTransactionInfo?.params.chainId?.substring(
        7,
        walletConnectReducer?.wcTransactionInfo?.params.chainId?.length,
      );
    let coin_symbol =
      chain___ === 56 || chain___ === 97
        ? Constants.COIN_SYMBOL.BNB
        : chain___ === 137
        ? Constants.COIN_SYMBOL.MATIC
        : chain___ === 1209
        ? Constants.COIN_SYMBOL.STC
        : Constants.COIN_SYMBOL.ETH;
    let selectedCoin = coinList?.find(item => {
      return item.coin_symbol === coin_symbol && item?.is_token === 0;
    });
    let selectedPrice = selectedCoin?.coin_fiat_price?.find(item => {
      return (
        item.fiat_type ===
        Singleton.getInstance().CurrencySelected.toLowerCase()
      );
    });
    return selectedPrice?.value;
  };
  const sendSerializedTxn = (
    tx_raw,
    myAddress,
    toAddress,
    amountt,
    gasEstimate,
    gas_gwei_price,
    coin_symbol,
    nonce,
  ) => {
    setloading(true);
    let data = {
      from: myAddress,
      to: toAddress,
      amount: web3.utils.fromWei(amountt.toString(), 'ether'),
      gas_price: gas_gwei_price,
      gas_estimate: gasEstimate,
      tx_raw: tx_raw,
      tx_type: 'WITHDRAW',
      nonce: nonce,
      is_smart: 1,
    };
    console.log('Raw Data::::::', data);
    let access_token = Singleton.getInstance().access_token;
    let blockChain =
      coin_symbol === Constants.COIN_SYMBOL.ETH
        ? Constants.NETWORK.ETHEREUM
        : coin_symbol === Constants.COIN_SYMBOL.MATIC
        ? Constants.NETWORK.POLYGON
        : coin_symbol === Constants.COIN_SYMBOL.STC
        ? Constants.NETWORK.SAITACHAIN
        : Constants.NETWORK.BINANCE_SMART_CHAIN;
    if (
      coin_symbol === Constants.COIN_SYMBOL.ETH ||
      coin_symbol === Constants.COIN_SYMBOL.MATIC ||
      coin_symbol === Constants.COIN_SYMBOL.BNB ||
      coin_symbol === Constants.COIN_SYMBOL.STC
    ) {
      dispatch(sendETH({data, access_token, blockChain, coin_symbol}))
        .then(async res => {
          console.log(
            '-----------------------sendCoinResponse------------',
            res.tx_hash,
            walletConnectReducer?.payload != null &&
              walletConnectReducer?.payload?.id,
          );
          // const responseVal = ({ id: parseInt(walletConnectReducer?.wcTransactionInfo?.id), result: res.tx_hash, jsonrpc: '2.0' })
          const responseVal = {
            id: parseInt(walletConnectReducer?.wcTransactionInfo?.id),
            result: res?.tx_hash,
            jsonrpc: '2.0',
          };
          console.log('response:::::', responseVal);
          try {
            await WalletConnect.getInstance().web3Wallet?.respondSessionRequest(
              {
                topic:
                  walletConnectReducer?.wcTransactionInfo?.topic?.toString(),
                response: responseVal,
              },
            );
          } catch (error) {
            console.log('.respones errror ', error);
          }
          dispatch(transactionConfirm());
          setloading(false);
          Singleton.showAlert(res?.message || 'Swap Successful');
          global.wcTxnPopup = false;
          Singleton.getInstance().walletConnectRef?.showWalletData(false);
          console.warn('MM', 'Resss>>>', res);
        })
        .catch(err => {
          console.log('ERR SEND', err);
          setTimeout(() => {
            setloading(false);
          }, 1000);
          onRejectTransaction(err);
          Singleton.showAlert(err?.message || Constants.SOMETHING_WRONG);
          global.wcTxnPopup = false;
          Singleton.getInstance().walletConnectRef?.showWalletData(false);
        });
    }
  };
  const onRejectTransaction = async msg => {
    let requests =
      WalletConnect.getInstance().web3Wallet.getPendingSessionRequests();
    console.log('--------------------------pending WC requests', requests);
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
        await WalletConnect.getInstance().web3Wallet?.respondSessionRequest({
          topic: el?.topic,
          response: response,
        });
      } catch (e) {
        console.log('----------dapp request reject----error', e);
      }
    });
    global.wcTxnPopup = false;
    Singleton.getInstance().walletConnectRef?.showWalletData(false);
    dispatch(transactionConfirm());
  };

  const onConfirmTransaction = () => {
    let chain___ =
      walletConnectReducer?.wcTransactionInfo?.params.chainId?.substring(
        7,
        walletConnectReducer?.wcTransactionInfo?.params.chainId?.length,
      );
    let coin_symbol =
      chain___ === 56 || chain___ === 97
        ? Constants.COIN_SYMBOL.BNB
        : chain___ === 137
        ? Constants.COIN_SYMBOL.MATIC
        : chain___ === 1209
        ? Constants.COIN_SYMBOL.STC
        : Constants.COIN_SYMBOL.ETH;
    if (!global.disconnected) {
      setloading(true);
      let payload = walletConnectReducer?.payload;
      let from =
        walletConnectReducer?.requestedSession?.walletAddress ||
        Singleton.getInstance().defaultEthAddress;
      let to = payload?.params?.request.params?.[0]?.to;
      let value = payload?.params?.request.params?.[0]?.value;
      let gas = walletConnectReducer?.gaslimitForTxn;
      let data = payload?.params?.request.params?.[0]?.data;
      console.log(
        '_________from_______',
        from,
        '--------to------',
        to,
        '___________value________',
        value,
        '________gas______',
        gas,
        '_________data__________',
      );
      if (!global.disconnected) {
        if (coin_symbol === Constants.COIN_SYMBOL.ETH) {
          Singleton.getInstance()
            .newGetData(`${Singleton.getInstance().defaultEthAddress}_pk`)
            .then(privateKey => {
              signWalletConnectTxn(
                privateKey,
                from,
                to,
                walletConnectReducer?.SelectedGasprice,
                gas,
                value ? value : 0,
                data,
                0,
                coin_symbol,
                walletConnectReducer?.gaslimitForTxn,
              )
                .then(res => {
                  sendSerializedTxn(
                    res.signedRaw,
                    from,
                    to,
                    exponentialToDecimalWithoutComma(
                      parseInt(value ? value : 0, 16),
                    ),
                    gas,
                    walletConnectReducer?.SelectedGasprice,
                    Constants.COIN_SYMBOL.ETH,
                    res.nonce,
                  );
                })
                .catch(err => {
                  console.log('Called signWalletConnectTxn err', err);
                  setloading(false);
                  if (!global.disconnected) {
                    Singleton.getInstance().walletConnectRef?.state
                      ?.showAlertDialog3 &&
                      Singleton.showAlert(Constants.SOMETHING_WRONG);
                  } else {
                    Singleton.getInstance().walletConnectRef?.state
                      ?.showAlertDialog3 &&
                      Singleton.showAlert(Constants.NO_NETWORK);
                  }
                  global.wcTxnPopup = false;
                  Singleton.getInstance().walletConnectRef?.showWalletData(
                    false,
                  );
                  onRejectTransaction();
                });
            })
            .catch(err => {
              setloading(false);
              if (!global.disconnected) {
                Singleton.getInstance().walletConnectRef?.state
                  ?.showAlertDialog3 &&
                  Singleton.showAlert(Constants.SOMETHING_WRONG);
              } else {
                Singleton.getInstance().walletConnectRef?.state
                  ?.showAlertDialog3 &&
                  Singleton.showAlert(Constants.NO_NETWORK);
              }
              global.wcTxnPopup = false;
              Singleton.getInstance().walletConnectRef?.showWalletData(false);
              onRejectTransaction();
            });
        } else if (coin_symbol === Constants.COIN_SYMBOL.BNB) {
          console.warn('MM', 'Binance>>>>');
          let access_token = Singleton.getInstance().access_token;
          let blockChain = Constants.NETWORK.BINANCE_SMART_CHAIN;
          dispatch(
            getBnbNonce({
              wallet_address: from,
              access_token: access_token,
              blockChain: blockChain,
              coin_symbol: coin_symbol,
            }),
          )
            .then(nonce => {
              console.warn('MM', 'nonce', nonce);
              Singleton.getInstance()
                .newGetData(`${Singleton.getInstance().defaultEthAddress}_pk`)
                .then(privateKey => {
                  console.warn('MM', 'privateKey:::::', privateKey);
                  sendTokenBNB(
                    to,
                    data,
                    nonce,
                    walletConnectReducer?.SelectedGasprice,
                    gas,
                    walletConnectReducer?.wcTransactionInfo?.params.chainId?.substring(
                      7,
                      walletConnectReducer?.wcTransactionInfo?.params.chainId
                        ?.length,
                    ),
                    privateKey,
                    value ? value : 0,
                  )
                    .then(res => {
                      console.warn(
                        'MM',
                        'Ress createSignedNewEthTokenTransaction>>>>>> ',
                        res,
                      );
                      sendSerializedTxn(
                        res,
                        from,
                        to,
                        value ? value : 0,
                        gas,
                        walletConnectReducer?.SelectedGasprice,
                        coin_symbol,
                        nonce,
                      );
                    })
                    .catch(err => {
                      console.warn(
                        'MM',
                        'Called signWalletConnectTxn err',
                        err,
                      );
                      setloading(false);
                      if (!global.disconnected) {
                        Singleton.getInstance().walletConnectRef?.state
                          ?.showAlertDialog3 &&
                          Singleton.showAlert(Constants.SOMETHING_WRONG);
                      } else {
                        Singleton.getInstance().walletConnectRef?.state
                          ?.showAlertDialog3 &&
                          Singleton.showAlert(Constants.NO_NETWORK);
                      }
                      clearTimeout(timeout);
                      global.wcTxnPopup = false;
                      Singleton.getInstance().walletConnectRef?.showWalletData(
                        false,
                      );
                      onRejectTransaction();
                    });
                })
                .catch(err => {
                  console.log('Called signWalletConnectTxn err', err);
                  setloading(false);
                  if (!global.disconnected) {
                    Singleton.getInstance().walletConnectRef?.state
                      ?.showAlertDialog3 &&
                      Singleton.showAlert(Constants.SOMETHING_WRONG);
                  } else {
                    Singleton.getInstance().walletConnectRef?.state
                      ?.showAlertDialog3 &&
                      Singleton.showAlert(Constants.NO_NETWORK);
                  }
                  clearTimeout(timeout);
                  global.wcTxnPopup = false;
                  Singleton.getInstance().walletConnectRef?.showWalletData(
                    false,
                  );
                  onRejectTransaction();
                });
            })
            .catch(err => {
              console.warn('MM', 'Called getBnbNonce err', err);
              setloading(false);
              if (!global.disconnected) {
                Singleton.getInstance().walletConnectRef?.state
                  ?.showAlertDialog3 &&
                  Singleton.showAlert(Constants.SOMETHING_WRONG);
              } else {
                Singleton.getInstance().walletConnectRef?.state
                  ?.showAlertDialog3 &&
                  Singleton.showAlert(Constants.NO_NETWORK);
              }
              clearTimeout(timeout);
              global.wcTxnPopup = false;
              Singleton.getInstance().walletConnectRef?.showWalletData(false);
              onRejectTransaction();
            });
        } else if (coin_symbol === Constants.COIN_SYMBOL.STC) {
          console.warn('MM', 'Saitachain>>>>');
          let access_token = Singleton.getInstance().access_token;
          let blockChain = 'saitachain';
          getStcNonce(Singleton.getInstance().defaultStcAddress)
            .then(nonce => {
              console.warn('MM', 'nonce', nonce);
              Singleton.getInstance()
                .newGetData(`${Singleton.getInstance().defaultStcAddress}_pk`)
                .then(privateKey => {
                  console.warn('MM', 'privateKey:::::', privateKey);
                  sendTokenSTC(
                    to,
                    data,
                    nonce,
                    walletConnectReducer?.SelectedGasprice,
                    gas,
                    walletConnectReducer?.wcTransactionInfo?.params.chainId?.substring(
                      7,
                      walletConnectReducer?.wcTransactionInfo?.params.chainId
                        ?.length,
                    ),
                    privateKey,
                    value ? value : 0,
                  )
                    .then(res => {
                      console.warn(
                        'MM',
                        'Ress createSignedNewEthTokenTransaction>>>>>> ',
                        res,
                      );
                      sendSerializedTxn(
                        res,
                        from,
                        to,
                        value ? value : 0,
                        gas,
                        walletConnectReducer?.SelectedGasprice,
                        coin_symbol,
                        nonce,
                      );
                    })
                    .catch(err => {
                      console.warn(
                        'MM',
                        'Called signWalletConnectTxn err',
                        err,
                      );
                      setloading(false);
                      if (!global.disconnected) {
                        Singleton.getInstance().walletConnectRef?.state
                          ?.showAlertDialog3 &&
                          Singleton.showAlert(Constants.SOMETHING_WRONG);
                      } else {
                        Singleton.getInstance().walletConnectRef?.state
                          ?.showAlertDialog3 &&
                          Singleton.showAlert(Constants.NO_NETWORK);
                      }
                      clearTimeout(timeout);
                      global.wcTxnPopup = false;
                      Singleton.getInstance().walletConnectRef?.showWalletData(
                        false,
                      );
                      onRejectTransaction();
                    });
                })
                .catch(err => {
                  console.log('Called signWalletConnectTxn err', err);
                  setloading(false);
                  if (!global.disconnected) {
                    Singleton.getInstance().walletConnectRef?.state
                      ?.showAlertDialog3 &&
                      Singleton.showAlert(Constants.SOMETHING_WRONG);
                  } else {
                    Singleton.getInstance().walletConnectRef?.state
                      ?.showAlertDialog3 &&
                      Singleton.showAlert(Constants.NO_NETWORK);
                  }
                  clearTimeout(timeout);
                  global.wcTxnPopup = false;
                  Singleton.getInstance().walletConnectRef?.showWalletData(
                    false,
                  );
                  onRejectTransaction();
                });
            })
            .catch(err => {
              console.warn('MM', 'Called getBnbNonce err', err);
              setloading(false);
              if (!global.disconnected) {
                Singleton.getInstance().walletConnectRef?.state
                  ?.showAlertDialog3 &&
                  Singleton.showAlert(Constants.SOMETHING_WRONG);
              } else {
                Singleton.getInstance().walletConnectRef?.state
                  ?.showAlertDialog3 &&
                  Singleton.showAlert(Constants.NO_NETWORK);
              }
              clearTimeout(timeout);
              global.wcTxnPopup = false;
              Singleton.getInstance().walletConnectRef?.showWalletData(false);
              onRejectTransaction();
            });
        } else {
          Singleton.getInstance()
            .newGetData(`${Singleton.getInstance().defaultEthAddress}_pk`)
            .then(privateKey => {
              console.log('privateKey:::::', privateKey);
              signWalletConnectTxnMatic(
                privateKey,
                from,
                to,
                walletConnectReducer?.SelectedGasprice,
                gas,
                value ? value : 0,
                data,
                0,
                coin_symbol,
                walletConnectReducer?.gaslimitForTxn,
              )
                .then(res => {
                  console.log(
                    'Ress createSignedNewMaticTokenTransaction>>>>>> ',
                    res,
                  );
                  sendSerializedTxn(
                    res.signedRaw,
                    from,
                    to,
                    exponentialToDecimalWithoutComma(
                      parseInt(value ? value : 0, 16),
                    ),
                    gas,
                    walletConnectReducer?.SelectedGasprice,
                    Constants.COIN_SYMBOL.MATIC,
                    res.nonce,
                  );
                })
                .catch(err => {
                  console.log('Called signWalletConnectTxn err', err);
                  setloading(false);
                  if (!global.disconnected) {
                    Singleton.getInstance().walletConnectRef?.state
                      ?.showAlertDialog3 &&
                      Singleton.showAlert(Constants.SOMETHING_WRONG);
                  } else {
                    Singleton.getInstance().walletConnectRef?.state
                      ?.showAlertDialog3 &&
                      Singleton.showAlert(Constants.NO_NETWORK);
                  }
                  clearTimeout(timeout);
                  global.wcTxnPopup = false;
                  Singleton.getInstance().walletConnectRef?.showWalletData(
                    false,
                  );
                  onRejectTransaction();
                });
            })
            .catch(err => {
              console.log('Called signWalletConnectTxn err', err);
              setloading(false);
              if (!global.disconnected) {
                Singleton.getInstance().walletConnectRef?.state
                  ?.showAlertDialog3 &&
                  Singleton.showAlert(Constants.SOMETHING_WRONG);
              } else {
                Singleton.getInstance().walletConnectRef?.state
                  ?.showAlertDialog3 &&
                  Singleton.showAlert(Constants.NO_NETWORK);
              }
              clearTimeout(timeout);
              global.wcTxnPopup = false;
              Singleton.getInstance().walletConnectRef?.showWalletData(false);
              onRejectTransaction();
            });
        }
      } else {
        clearTimeout(timeout);
        setloading(false);
        Singleton.getInstance().walletConnectRef?.state?.showAlertDialog3 &&
          Singleton.showAlert(Constants.NO_NETWORK);
        global.wcTxnPopup = false;
        Singleton.getInstance().walletConnectRef?.showWalletData(false);
        onRejectTransaction();
      }
    } else {
      Singleton.getInstance().walletConnectRef?.state?.showAlertDialog3 &&
        Singleton.showAlert(Constants.NO_NETWORK);
    }
  };

  const AdvanceSettingsModal = ({}) => {
    const [modalSlow, setModalSlow] = useState(slow);
    const [modalfast, setmodalfast] = useState(fast);
    const [modalaverage, setmodalaverage] = useState(average);
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={advanceSettingModal}
        onRequestClose={() => setadvanceSettingModal(false)}>
        <SafeAreaView
          style={{flex: 1, backgroundColor: ThemeManager.colors.bg}}>
          <View style={{flex: 1, backgroundColor: ThemeManager.colors.bg}}>
            <SimpleHeader
              title={'Advance Settings'}
              backImage={ThemeManager.ImageIcons.iconBack}
              titleStyle
              imageShow
              back={false}
              backPressed={() => {
                setadvanceSettingModal(false);
              }}
              containerStyle={styles.headerBtn}
            />
            <BorderLine
              borderColor={{
                backgroundColor: ThemeManager.colors.viewBorderColor,
              }}
            />
            <View style={{flex: 1}}>
              <View style={{flex: 1, padding: 20}}>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: 16,
                    fontFamily: Fonts.semibold,
                    color: ThemeManager.colors.textColor,
                  }}>
                  Transaction Fees
                </Text>
                {/* -------------------------slow-------------------- */}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    marginTop: heightDimen(16),
                    backgroundColor: ThemeManager.colors.wcbackground,
                    paddingVertical: 10,
                    borderRadius: 10,
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      setModalSlow(true);
                      setmodalfast(false);
                      setmodalaverage(false);
                    }}
                    style={{flex: 1}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        paddingVertical: heightDimen(14),
                        paddingHorizontal: widthDimen(16),
                      }}>
                      <View style={{}}>
                        <Image
                          source={
                            modalSlow
                              ? ThemeManager.ImageIcons.radioOn
                              : ThemeManager.ImageIcons.radioOff
                          }
                          style={
                            modalSlow
                              ? {tintColor: ThemeManager.colors.primary}
                              : {}
                          }
                        />
                      </View>
                      <View
                        style={{
                          marginLeft: widthDimen(9),
                          top: heightDimen(-3),
                        }}>
                        <Text
                          allowFontScaling={false}
                          style={[
                            styles.slowText1,
                            {color: ThemeManager.colors.textColor},
                          ]}>
                          Slow
                        </Text>
                        <Text
                          allowFontScaling={false}
                          style={[
                            styles.slowText2,
                            {color: ThemeManager.colors.inActiveColor},
                          ]}>
                          ({(walletConnectReducer?.slowFee).substring(0, 6)}{' '}
                          {coinSymbol.toUpperCase()})
                        </Text>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'flex-end',
                          paddingRight: widthDimen(12),
                        }}>
                        <Text
                          allowFontScaling={false}
                          style={[
                            styles.slowText1,
                            {color: ThemeManager.colors.textColor},
                          ]}>
                          {Singleton.getInstance().CurrencySymbol}{' '}
                          {getMarketPrice()
                            ? (
                                parseFloat(walletConnectReducer?.slowFee) *
                                getMarketPrice()
                              )
                                .toString()
                                .substring(0, 6)
                            : '0.00'}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
                {/* -------------------------average-------------------- */}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    marginTop: heightDimen(10),
                    backgroundColor: ThemeManager.colors.wcbackground,
                    paddingVertical: 10,
                    borderRadius: 10,
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      setModalSlow(false);
                      setmodalfast(false);
                      setmodalaverage(true);
                    }}
                    style={{flex: 1}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        paddingVertical: heightDimen(14),
                        paddingHorizontal: widthDimen(16),
                      }}>
                      <View style={{}}>
                        <Image
                          source={
                            modalaverage
                              ? ThemeManager.ImageIcons.radioOn
                              : ThemeManager.ImageIcons.radioOff
                          }
                          style={
                            modalaverage
                              ? {tintColor: ThemeManager.colors.primary}
                              : {}
                          }
                        />
                      </View>
                      <View
                        style={{
                          marginLeft: widthDimen(9),
                          top: heightDimen(-3),
                        }}>
                        <Text
                          allowFontScaling={false}
                          style={[
                            styles.slowText1,
                            {color: ThemeManager.colors.textColor},
                          ]}>
                          Average
                        </Text>
                        <Text
                          allowFontScaling={false}
                          style={[
                            styles.slowText2,
                            {color: ThemeManager.colors.inActiveColor},
                          ]}>
                          ({(walletConnectReducer?.averageFee).substring(0, 6)}{' '}
                          {coinSymbol.toUpperCase()})
                        </Text>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'flex-end',
                          paddingRight: widthDimen(12),
                        }}>
                        <Text
                          allowFontScaling={false}
                          style={[
                            styles.slowText1,
                            {color: ThemeManager.colors.textColor},
                          ]}>
                          {Singleton.getInstance().CurrencySymbol}{' '}
                          {getMarketPrice()
                            ? (
                                parseFloat(walletConnectReducer?.averageFee) *
                                getMarketPrice()
                              )
                                .toString()
                                .substring(0, 6)
                            : '0.00'}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
                {/* -------------------------fast-------------------- */}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    marginTop: heightDimen(10),
                    backgroundColor: ThemeManager.colors.wcbackground,
                    paddingVertical: 10,
                    borderRadius: 10,
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      setModalSlow(false);
                      setmodalfast(true);
                      setmodalaverage(false);
                    }}
                    style={{flex: 1}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        paddingVertical: heightDimen(14),
                        paddingHorizontal: widthDimen(16),
                      }}>
                      <View style={{}}>
                        <Image
                          source={
                            modalfast
                              ? ThemeManager.ImageIcons.radioOn
                              : ThemeManager.ImageIcons.radioOff
                          }
                          style={
                            modalfast
                              ? {tintColor: ThemeManager.colors.primary}
                              : {}
                          }
                        />
                      </View>
                      <View
                        style={{
                          marginLeft: widthDimen(9),
                          top: heightDimen(-3),
                        }}>
                        <Text
                          allowFontScaling={false}
                          style={[
                            styles.slowText1,
                            {color: ThemeManager.colors.textColor},
                          ]}>
                          Fast
                        </Text>
                        <Text
                          allowFontScaling={false}
                          style={[
                            styles.slowText2,
                            {color: ThemeManager.colors.inActiveColor},
                          ]}>
                          ({(walletConnectReducer?.fastFee).substring(0, 6)}{' '}
                          {coinSymbol.toUpperCase()})
                        </Text>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'flex-end',
                          paddingRight: widthDimen(12),
                        }}>
                        <Text
                          allowFontScaling={false}
                          style={[
                            styles.slowText1,
                            {color: ThemeManager.colors.textColor},
                          ]}>
                          {Singleton.getInstance().CurrencySymbol}{' '}
                          {getMarketPrice()
                            ? (
                                parseFloat(walletConnectReducer?.fastFee) *
                                getMarketPrice()
                              )
                                .toString()
                                .substring(0, 6)
                            : '0.00'}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingBottom: heightDimen(20),
                }}>
                <BasicButton
                  text={'Save'}
                  textStyle={{
                    fontSize: 16,
                    fontFamily: Fonts.medium,
                    paddingVertical: 5,
                  }}
                  customGradient={{
                    alignSelf: 'center',
                    width: widthDimen(370),
                    marginBottom: heightDimen(30),
                  }}
                  onPress={() => {
                    if (modalSlow) {
                      slowAction(walletConnectReducer);
                    } else if (modalaverage) {
                      mediumAction(walletConnectReducer);
                    } else {
                      highAction(walletConnectReducer);
                    }
                    setadvanceSettingModal(false);
                  }}
                />
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    );
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: ThemeManager.colors.backgroundColor,
      }}>
      <AdvanceSettingsModal
        advanceSettingModal={advanceSettingModal}
        setadvanceSettingModal={setadvanceSettingModal}
        walletConnectReducer={walletConnectReducer}
        coinSymbol={coinSymbol}
      />

      <View style={{flex: 1, backgroundColor: ThemeManager.colors.bg}}>
        <SimpleHeaderNew
          title={'Send'}
          backImage={ThemeManager.ImageIcons.iconBack}
          titleStyle
          imageShow
          back={false}
          backPressed={() => {
            onRejectTransaction();
          }}
          img2={ThemeManager.ImageIcons.setting}
          onPress2={() => {
            setadvanceSettingModal(true);
          }}
        />
        <>
          <BorderLine
            borderColor={{backgroundColor: ThemeManager.colors.viewBorderColor}}
          />
          <View>
            <View style={styles.trxAmountContainer}>
              <Text
                allowFontScaling={false}
                style={[
                  styles.amountStyle,
                  {color: ThemeManager.colors.headingText},
                ]}>
                {walletConnectReducer?.wcTransactionInfo?.params?.request
                  ?.params?.[0]?.value == undefined
                  ? '0.00'
                  : Singleton.getInstance().toFixednew(
                      exponentialToDecimalWithoutComma(
                        parseInt(
                          walletConnectReducer?.wcTransactionInfo?.params
                            ?.request?.params?.[0]?.value,
                          16,
                        ) / weiDivider,
                      ),
                      8,
                    )}{' '}
                {coinSymbol.toUpperCase()}
              </Text>

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{marginTop: heightDimen(2)}}>
                  <Text
                    allowFontScaling={false}
                    style={[
                      styles.amountStyleInUSD,
                      {color: ThemeManager.colors.inActiveColor},
                    ]}>
                    ~
                  </Text>
                  <Text
                    allowFontScaling={false}
                    style={[
                      styles.amountStyleInUSD,
                      {
                        marginTop: heightDimen(-15),
                        color: ThemeManager.colors.inActiveColor,
                      },
                    ]}>
                    ~
                  </Text>
                </View>
                <View>
                  {!showLoader ? (
                    <Text
                      allowFontScaling={false}
                      style={[
                        styles.amountStyleInUSD,
                        {
                          fontSize: areaDimen(16),
                          color: ThemeManager.colors.inActiveColor,
                        },
                      ]}>
                      {' '}
                      {Singleton.getInstance().CurrencySymbol}
                      {walletConnectReducer?.wcTransactionInfo?.params?.request
                        ?.params?.[0]?.value
                        ? getMarketPrice()
                          ? (
                              (getMarketPrice() *
                                exponentialToDecimalWithoutComma(
                                  parseInt(
                                    walletConnectReducer?.wcTransactionInfo
                                      ?.params?.request?.params?.[0]?.value,
                                    16,
                                  ),
                                )) /
                              weiDivider
                            ).toFixed(2)
                          : '0.00'
                        : '0.00'}
                    </Text>
                  ) : (
                    <Text
                      allowFontScaling={false}
                      style={[
                        styles.amountStyleInUSD,
                        {
                          fontSize: areaDimen(16),
                          color: ThemeManager.colors.inActiveColor,
                        },
                      ]}>
                      {' '}
                      {Singleton.getInstance().CurrencySymbol}
                      {walletConnectReducer?.wcTransactionInfo?.params?.request
                        ?.params?.[0]?.value
                        ? getMarketPrice()
                          ? (
                              (getMarketPrice() *
                                exponentialToDecimalWithoutComma(
                                  parseInt(
                                    walletConnectReducer?.wcTransactionInfo
                                      ?.params?.request?.params?.[0]?.value,
                                    16,
                                  ),
                                )) /
                              weiDivider
                            ).toFixed(2)
                          : '0.00'
                        : '0.00'}
                    </Text>
                  )}
                </View>
              </View>
            </View>
            <View
              style={{
                borderRadius: areaDimen(12),
                flexDirection: 'row',
                justifyContent: 'center',
                marginHorizontal: widthDimen(20),
                paddingVertical: 20,
                backgroundColor: ThemeManager.colors.wcbackground,
                paddingHorizontal: widthDimen(16),
                marginTop: heightDimen(22),
                paddingVertical: heightDimen(26),
                shadowColor: ThemeManager.colors.shadowColor,
                shadowOffset: {
                  width: 0,
                  height: 3,
                },
                shadowOpacity: 0.1,
                shadowRadius: 3.05,
                elevation: 4,
              }}>
              <View style={{flex: 1}}>
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.assetStyle,
                    {color: ThemeManager.colors.textColor},
                  ]}>
                  Asset
                </Text>
              </View>
              <View style={{flex: 3}}>
                <Text allowFontScaling={false} style={styles.assetDesStyle}>
                  {
                    getCurrencyFromChainId(walletConnectReducer?.wcCoinFamily)
                      ?.coin_chain
                  }
                </Text>
              </View>
            </View>

            <View
              style={{
                borderRadius: 10,
                justifyContent: 'center',
                marginVertical: 20,
              }}>
              <View style={styles.innerItem}>
                <View style={{flex: 1.5}}>
                  <Text
                    allowFontScaling={false}
                    style={[
                      styles.assetStyle,
                      {color: ThemeManager.colors.inActiveColor},
                    ]}>
                    From:
                  </Text>
                </View>
                <View style={{flex: 2.5}}>
                  <Text
                    allowFontScaling={false}
                    style={[
                      styles.rightDesStyle,
                      {color: ThemeManager.colors.textColor},
                    ]}>
                    {
                      walletConnectReducer?.wcTransactionInfo?.params?.request
                        ?.params?.[0]?.from
                    }
                  </Text>
                </View>
              </View>
              <View style={{marginHorizontal: widthDimen(22)}}>
                <BorderLine />
              </View>
              <View style={styles.innerItem}>
                <View style={{flex: 1.5}}>
                  <Text
                    allowFontScaling={false}
                    style={[
                      styles.assetStyle,
                      {color: ThemeManager.colors.inActiveColor},
                    ]}>
                    Dapp:
                  </Text>
                </View>
                <View style={{flex: 2.5}}>
                  <Text
                    allowFontScaling={false}
                    style={[
                      styles.rightDesStyle,
                      {color: ThemeManager.colors.textColor},
                    ]}>
                    {selectedDapp?.peer?.metadata?.url?.replace('https://', '')}
                  </Text>
                </View>
              </View>
              <View style={{marginHorizontal: widthDimen(22)}}>
                <BorderLine />
              </View>
              {walletConnectReducer?.NetworkFee !== '' && (
                <>
                  <View style={styles.innerItem}>
                    <View style={{flex: 1.5}}>
                      <Text
                        allowFontScaling={false}
                        style={[
                          styles.assetStyle,
                          {color: ThemeManager.colors.inActiveColor},
                        ]}>
                        Network Fee:
                      </Text>
                    </View>
                    <View style={{flex: 2.5}}>
                      <Text
                        allowFontScaling={false}
                        style={[
                          styles.rightDesStyle,
                          {color: ThemeManager.colors.textColor},
                        ]}>
                        {walletConnectReducer?.NetworkFee
                          ? Singleton.getInstance().toFixednew(
                              walletConnectReducer?.NetworkFee,
                              5,
                            )
                          : 0}{' '}
                        {coinSymbol.toUpperCase()} (
                        {Singleton.getInstance().CurrencySymbol}
                        {walletConnectReducer?.NetworkFee != ''
                          ? getMarketPrice()
                            ? (
                                getMarketPrice() *
                                Singleton.getInstance().toFixednew(
                                  walletConnectReducer?.NetworkFee != ''
                                    ? parseFloat(
                                        walletConnectReducer?.NetworkFee,
                                      )
                                    : 0,
                                  5,
                                )
                              ).toFixed(2)
                            : '0.00'
                          : '0.00'}
                        )
                      </Text>
                    </View>
                  </View>
                  <View style={{marginHorizontal: widthDimen(22)}}>
                    <BorderLine />
                  </View>
                </>
              )}

              {walletConnectReducer?.TotalAmount !== '' && (
                <>
                  <View style={styles.innerItem}>
                    <View style={{flex: 1.5}}>
                      <Text
                        allowFontScaling={false}
                        style={[
                          styles.assetStyle,
                          {color: ThemeManager.colors.inActiveColor},
                        ]}>
                        Total Amount:
                      </Text>
                    </View>
                    <View style={{flex: 2.5}}>
                      <Text
                        allowFontScaling={false}
                        style={[
                          styles.rightDesStyle,
                          {color: ThemeManager.colors.textColor},
                        ]}>
                        {walletConnectReducer?.NetworkFee
                          ? Singleton.getInstance().toFixednew(
                              walletConnectReducer?.TotalAmount,
                              5,
                            )
                          : 0}{' '}
                        {coinSymbol.toUpperCase()} (
                        {Singleton.getInstance().CurrencySymbol}
                        {walletConnectReducer?.TotalAmount != ''
                          ? getMarketPrice()
                            ? (
                                getMarketPrice() *
                                Singleton.getInstance().toFixednew(
                                  walletConnectReducer?.TotalAmount != ''
                                    ? parseFloat(
                                        walletConnectReducer?.TotalAmount,
                                      )
                                    : 0,
                                  5,
                                )
                              ).toFixed(2)
                            : '0.00'
                          : '0.00'}
                        )
                      </Text>
                    </View>
                  </View>
                </>
              )}
            </View>
          </View>
          <View
            style={{flex: 1, justifyContent: 'flex-end', paddingBottom: 20}}>
            <BasicButton
              btnstyle={styles.connect}
              customGradient={{
                alignSelf: 'center',
                width: widthDimen(370),
              }}
              onPress={() => {
                onConfirmTransaction();
              }}
              textStyle={{
                fontSize: 16,
                fontFamily: Fonts.medium,
                paddingVertical: 5,
              }}
              text={'Send'}
            />
          </View>
        </>
      </View>
      {(loading || showLoader) && <Loader />}
    </SafeAreaView>
  );
};
export default TransactionModal;
const styles = StyleSheet.create({
  trxAmountContainer: {
    alignItems: 'center',
    paddingVertical: heightDimen(22),
  },
  amountStyle: {
    textAlign: 'center',
    fontSize: 28,
    fontFamily: Fonts.bold,
  },
  amountStyleInUSD: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: Fonts.semibold,
    color: Colors.grayTextColor,
  },
  assetStyle: {
    textAlign: 'center',
    fontSize: areaDimen(14),
    fontFamily: Fonts.medium,
    lineHeight: heightDimen(19),
    textAlign: 'left',
  },
  leftStyle: {
    textAlign: 'center',
    fontSize: areaDimen(14),
    fontFamily: Fonts.medium,
    lineHeight: heightDimen(18),
    textAlign: 'left',
  },
  assetDesStyle: {
    textAlign: 'center',
    fontSize: areaDimen(14),
    fontFamily: Fonts.medium,
    color: Colors.grayTextColor,
    lineHeight: heightDimen(18),
    textAlign: 'right',
  },
  rightDesStyle: {
    textAlign: 'center',
    fontSize: areaDimen(14),
    fontFamily: Fonts.medium,
    color: Colors.grayTextColor,
    lineHeight: heightDimen(18),
    textAlign: 'right',
  },
  innerItem: {
    paddingTop: areaDimen(20),
    paddingBottom: heightDimen(10),
    flexDirection: 'row',
    paddingHorizontal: widthDimen(22),
  },
  connect: {width: '100%', alignSelf: 'center', marginTop: 15},
  slowText1: {
    fontSize: areaDimen(14),
    lineHeight: heightDimen(19),
    fontFamily: Fonts.medium,
    color: Colors.grayTextColor,
  },
  slowText2: {
    fontSize: areaDimen(14),
    lineHeight: heightDimen(17),
    fontFamily: Fonts.medium,
    color: ThemeManager.colors.textColor,
  },

  headerBtn: {
    marginTop: hasDynamicIsland
      ? heightDimen(60)
      : hasNotch
      ? heightDimen(60)
      : heightDimen(20),
  },
});
