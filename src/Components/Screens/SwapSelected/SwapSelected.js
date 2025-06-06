/* eslint-disable no-lone-blocks */
/* eslint-disable react-native/no-inline-styles */
import {BigNumber} from 'bignumber.js';
import debounce from 'lodash.debounce';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Alert,
  Dimensions,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {EventRegister} from 'react-native-event-listeners';
import FastImage from 'react-native-fast-image';
import SelectDropdown from 'react-native-select-dropdown';
import {useDispatch, useSelector} from 'react-redux';
import ROUTER_ABI from '../../../../ABI/router.ABI.json';
import {LanguageManager, ThemeManager} from '../../../../ThemeManager';
import * as constants from '../../../Constant';
import {NavigationStrings} from '../../../Navigation/NavigationStrings';
import {
  checkMaintenance,
  getSwapListAll,
  saveSwapItem,
} from '../../../Redux/Actions';
import Singleton from '../../../Singleton';
import {areaDimen, heightDimen, widthDimen} from '../../../Utils/themeUtils';
import {getCurrentRouteName, navigate} from '../../../navigationsService';
import {Colors, Fonts, Images} from '../../../theme';
import images from '../../../theme/Images';
import {
  CommaSeprator3,
  bigNumberSafeMath,
  convertToInternationalCurrencySystem,
  exponentialToDecimalWithoutComma,
} from '../../../utils';
import {BasicButton, Wrap} from '../../common';
import {ModalSwap} from '../../common/ModalSwap';
import Loader from '../Loader/Loader';
import ListModal from './ListModal';
import {styles} from './SwapSelectedStyle';
import {
  getWeb3Object,
  getSwapData,
  getCoinFamilyForActiveWallet,
  getContractObject,
  getUserBal,
  getUserBalSecond,
  getGasPrice,
  makeTransaction,
  calculatePercentage,
  checkforPair,
  sanitizeErrorMessage
} from './SwapSelectedHelper';
const GAS_FEE_MULTIPLIER = 0.000000000000000001;
const GAS_PRICE_EXTRA_BUFFER = 2000000000;
const SELECTED_INPUT = {firstInput: 'firstInput', secondInput: 'secondInput'};
const GAS_BUFFER = 25000;
let fromSetting = false;
let typeGlobal = SELECTED_INPUT.firstInput;
let tokenOneValue = 0;
let tokenTwoValue = 0;
let tokenOne = {};
const SwapSelected = props => {
  const swapItem = useSelector(state => state?.swapReducer?.swapItem);
  let timer = useRef();
  const [shouldUpdateCalculation, setShouldUpdateCalculation] = useState(false);
  let userAddress = Singleton.getInstance().defaultEthAddress;
  const [isLoading, setLoading] = useState(false);
  const [swapModal, setSwapModal] = useState(false);
  const [showTokenOneList, setShowTokenOneList] = useState(false);
  const [showTokenTwoList, setShowTokenTwoList] = useState(false);
  const [isInsufficientOutputAmount, setIsInsufficientOutputAmount] =
    useState(false);
  const limit = 20;
  const [page, setPage] = useState(0);
  const [totalRecordsAll, settotalRecordsAll] = useState(0);
  const [totalRecordsSelected, settotalRecordsSelected] = useState(0);
  const [tokenOneAmount, setTokenOneAmount] = useState();
  const [tokenTwoAmount, setTokenTwoAmount] = useState();
  const [userBal, setUserBal] = useState(0);
  const [rawTxnObj, setRawTxnObj] = useState({});
  const [selectedInput, setSelectedInput] = useState(SELECTED_INPUT.firstInput);
  const [isInsufficientBalance, setInsufficientBalance] = useState(false);
  const [isApproved, setUserApproval] = useState(true);
  const [gasEstimate, setGasEstimate] = useState(0);
  const [gasPrice, setGasPrice] = useState(0);
  const [isPairsupported, setIsPairSupported] = useState(true);
  const [allownceTxnObj, setAllowancetxnObj] = useState({});
  const [isOverFlow, setIsOverFlow] = useState(false);
  const [coinList, setCoinList] = useState();
  const [coinBalance, setCoinBalance] = useState({});
  const [coinBalanceSecond, setCoinBalanceSecond] = useState({});
  const [tokenFirst, setTokenFirst] = useState();
  const [tokenSecond, setTokenSecond] = useState();
  const [fullList, setFullList] = useState([]);
  const [activeButton, setActiveButton] = useState(0);
  const [transferFailed, setTransferFailed] = useState(false);
  const [usedFiatType, setUsedFiatType] = useState();
  const [isOnMaintainance, setIsOnMaintainance] = useState(false);
  const [isOnMaintainanceMsg, setIsOnMaintainanceMsg] = useState('');
  const [isInSufficientLiquidity, setIsInSufficientLiquidity] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [loadList, setloadList] = useState(false);
  const dropDownRefFrom = useRef();
  const dropDownRefTo = useRef();
  let SLIPPERAGE_PERCENTAGE = Singleton.getInstance().slipageTolerance; //in percent
  let TXN_COMPLETE_MAX_TIME = Singleton.getInstance().slipageTimeout; //in minutes
  const dispatch = useDispatch();
  useEffect(() => {
    if (tokenFirst) {
      tokenFirst &&
        getUserBal(
          tokenFirst,
          userAddress,
          setUserBal,
          setCoinBalance,
          setLoading,
          coinBalance,
        );
    }
  }, [tokenFirst]);
  useEffect(() => {
    if (tokenSecond) {
      tokenSecond &&
        getUserBalSecond(
          tokenSecond,
          tokenFirst,
          userAddress,
          setUserBal,
          setCoinBalanceSecond,
          coinBalanceSecond,
          setLoading,
        );
    }
  }, [tokenSecond]);

  useEffect(() => {
    if (!fromSetting) {
      setTimeout(() => {
        getSwapListAllNew();
      }, 500);
    }
  }, [props]);

  useEffect(() => {
    setIsOnMaintainanceMsg('');
    dispatch(checkMaintenance())
      .then(res => {
        console.log('res::::checkMaintenance', res);
        let swapCheck = res?.data?.find(
          item => item.type == 'IS_ON_CHAIN_SWAP_MAINTENANCE',
        );
        if (swapCheck?.value == 1) {
          setIsOnMaintainanceMsg(swapCheck?.msg);
          setIsOnMaintainance(true);
          Singleton.showAlert(sanitizeErrorMessage(swapCheck?.msg));
        } else {
          setIsOnMaintainance(false);
        }
      })
      .catch(err => {
        console.log('err::::checkMaintenance', err);
      });
    let eventListner = EventRegister.addEventListener('swapData', data => {
      updateFromSetting();
      console.warn('MM==+++++=====', data);
      if (data != '') {
        SLIPPERAGE_PERCENTAGE =
          data?.tolerance || Singleton.getInstance().slipageTolerance;
        TXN_COMPLETE_MAX_TIME =
          data?.timeout || Singleton.getInstance().slipageTimeout;
      }
    });
    let focus = props.navigation.addListener('focus', () => {
      setIsOnMaintainanceMsg('');
      dispatch(checkMaintenance())
        .then(res => {
          console.log('res::::checkMaintenance', res);
          let swapCheck = res?.data?.find(
            item => item.type == 'IS_ON_CHAIN_SWAP_MAINTENANCE',
          );
          if (swapCheck?.value == 1) {
            setIsOnMaintainanceMsg(swapCheck?.msg);
            setIsOnMaintainance(true);
            Singleton.showAlert(sanitizeErrorMessage(swapCheck?.msg));
          } else {
            setIsOnMaintainance(false);
          }
        })
        .catch(err => {
          console.log('err::::checkMaintenance', err);
        });
      setSwapModal(false);
      console.log('fromSetting', fromSetting, !fromSetting);
      if (!fromSetting) {
        if (
          usedFiatType !=
          Singleton.getInstance().CurrencySelected?.toLowerCase()
        ) {
          console.log('fromSetting --INSIDE');
        }
        dropDownRefFrom?.current?.reset();
        setTokenOneAmount(0);
        setTokenTwoAmount(0);
        setInsufficientBalance(false);
        setIsInsufficientOutputAmount(false);
        setIsInSufficientLiquidity(false);
        setIsOverFlow(false);
        setIsPairSupported(true);
        setUserApproval(true);
        setTransferFailed(false);
        setActiveButton(0);
      }
    });
    let blur = props.navigation.addListener('blur', () => {
      fromSetting = false;
      setSwapModal(false);
      if (dropDownRefFrom?.current) {
        console.log('called.....from.. ');
        dropDownRefFrom?.current?.closeDropdown();
      }
      if (dropDownRefTo?.current) {
        console.log('called....to... ');
        dropDownRefTo?.current?.closeDropdown();
      }
    });
    return () => {
      blur();
      focus();
      EventRegister.removeEventListener(eventListner);
    };
  }, [props]);
  const updateFromSetting = () => {
    fromSetting = true;
    setShouldUpdateCalculation(true);
  };
  useEffect(() => {
    let amount;
    if (shouldUpdateCalculation) {
      if (selectedInput == SELECTED_INPUT.firstInput) {
        amount = tokenOneAmount;
      } else {
        amount = tokenTwoAmount;
      }
      typeGlobal = selectedInput;
      onChangeText({
        tokenFirst: tokenFirst,
        tokenSecond: tokenSecond,
        type: selectedInput,
        value: amount,
        isError: false,
      });
      setShouldUpdateCalculation(false);
    }
  }, [shouldUpdateCalculation]);

  const updateSwap = async selectedItem => {
    console.log('selectedItem::::', selectedItem);
    setLoading(true);
    try {
      setLoading(true);
      let responseSelected = await getSwapData(
        selectedItem?.coin_family,
        selectedItem?.id,
        null,
        null,
        setUsedFiatType,
        setPage,
        setLoading,
        dispatch,
      );
      console.log('responseSelected::::', responseSelected);
      setTokenFirst(selectedItem);
      if (responseSelected?.data?.length > 0) {
        setCoinList(responseSelected.data);
        setTokenSecond(responseSelected.data[0]);
        settotalRecordsSelected(responseSelected.meta?.total);
        checkforPair(
          selectedItem,
          responseSelected.data[0],
          setIsPairSupported,
        );
      }
    } catch (err) {
      Singleton.showAlert(
        sanitizeErrorMessage(err?.message) || constants.SOMETHING_WRONG,
      );
    } finally {
      getGasPrice(selectedItem, setGasPrice);
      setLoading(false);
      dispatch(saveSwapItem({}));
    }
    fromSetting = false;
    setTokenOneAmount(0);
    setTokenTwoAmount(0);
    setInsufficientBalance(false);
    setIsInsufficientOutputAmount(false);
    setIsInSufficientLiquidity(false);
    setIsOverFlow(false);
    setIsPairSupported(true);
    setTransferFailed(false);
    setUserApproval(true);
    setActiveButton(0);
  };

  const getSwapListAllNew = () => {
    Singleton.getInstance()
      .newGetData(constants.IS_PRIVATE_WALLET)
      .then(async isPrivate => {
        console.log('iSprivate::::getSwapListAllNew', isPrivate);
        setLoading(true);
        let access_token = Singleton.getInstance().access_token;
        setUsedFiatType(
          Singleton.getInstance().CurrencySelected?.toLowerCase(),
        );
        let data = {
          fiatType: Singleton.getInstance().CurrencySelected?.toLowerCase(),
          coinFamily: getCoinFamilyForActiveWallet(isPrivate),
          page: 1,
          limit: limit,
        };
        console.log('swapItem::::::', swapItem);
        if (swapItem) {
          data = {...data, selectedCoinId: swapItem.w_coin_id};
        }
        try {
          let responseAll = await dispatch(
            getSwapListAll({access_token, data}),
          );
          console.log('responseAll:::::', responseAll);
          let tokenFirst = responseAll.data[0];
          tokenOne = responseAll.data[0];
          console.log('tokenFirst:::::', tokenFirst);
          let responseSelected = await getSwapData(
            tokenFirst?.coin_family,
            tokenFirst?.id,
            null,
            null,
            setUsedFiatType,
            setPage,
            setLoading,
            dispatch,
          );
          console.log('responseSelected:::::', responseSelected);
          setFullList(responseAll.data);
          setTokenFirst(tokenFirst);
          settotalRecordsAll(responseAll?.meta?.total);
          if (responseSelected?.data?.length > 0) {
            setCoinList(responseSelected.data);
            setTokenSecond(responseSelected.data[0]);
            settotalRecordsSelected(responseSelected.meta?.total);
          }
        } catch (err) {
          Singleton.showAlertsanitizeErrorMessage((err?.message) || constants.SOMETHING_WRONG);
        } finally {
          setLoading(false);
          dispatch(saveSwapItem({}));
        }
      });
  };

  const getApproval = () => {
    let routerAddress =
      tokenFirst?.coin_family == 1
        ? Singleton.getInstance().SwapRouterAddress
        : tokenFirst?.coin_family == 4
        ? Singleton.getInstance().SwapRouterStcAddress
        : Singleton.getInstance().SwapRouterBNBAddress;
    if (global.disconnected) {
      Singleton.showAlert(constants.NO_NETWORK);
      return;
    }
    tokenOneValue = tokenOneAmount;
    tokenTwoValue = tokenTwoAmount;
    console.log(
      'tokenOneAmount::::::',
      tokenOneAmount,
      'tokenTwoAmount::::::',
      tokenTwoAmount,
    );
    setLoading(true);
    approveTransaction(
      allownceTxnObj.tokenContractObject,
      routerAddress,
      userAddress,
      allownceTxnObj.path,
    )
      .then(resultApprove => {
        console.warn(
          'MM',
          'approve send transaction response ==>>',
          resultApprove,
        );
        Alert.alert(
          constants.APP_NAME,
          'Please wait for blockchain confirmation, Once Approved You can start Swapping.',
          [
            {
              text: 'OK',
              onPress: () => {
                console.log(
                  'tokenOneValue::::',
                  tokenOneValue,
                  'tokenTwoValue::::',
                  tokenTwoValue,
                );

                if (typeGlobal == SELECTED_INPUT.firstInput) {
                  onChangeText({
                    tokenFirst,
                    tokenSecond,
                    type: SELECTED_INPUT.firstInput,
                    value: tokenOneValue,
                    isError: false,
                  });
                  getUserBalSecond(
                    tokenSecond,
                    tokenFirst,
                    userAddress,
                    setUserBal,
                    setCoinBalanceSecond,
                    coinBalanceSecond,
                    setLoading,
                  );
                } else {
                  onChangeText({
                    tokenFirst,
                    tokenSecond,
                    type: SELECTED_INPUT.secondInput,
                    value: tokenTwoValue,
                    isError: false,
                  });
                  getUserBalSecond(
                    tokenSecond,
                    tokenFirst,
                    userAddress,
                    setUserBal,
                    setCoinBalanceSecond,
                    coinBalanceSecond,
                    setLoading,
                  );
                }
              },
            },
          ],
          {cancelable: false},
        );
        setUserApproval(true);
        setLoading(false);
      })
      .catch(err => {
        if (
          err?.toString()?.includes("Error: CONNECTION ERROR: Couldn't connect")
        ) {
          Singleton.showAlert('Approval Failed. ' + constants.NO_NETWORK);
          console.warn('MM', 'approve send transaction err ==>>', err);
        } else {
          Singleton.showAlert(sanitizeErrorMessage(err?.message) || 'Approval Failed');
          console.warn('MM', 'approve send transaction err ==>>', err);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const approveTransaction = async (
    tokenContractObject,
    spenderAddress,
    userAddress,
    tokenAddress,
  ) => {
    return new Promise(async (resolve, reject) => {
      try {
        console.warn(
          'MM',
          '\n\n\n **** APPROVED TRANSACTION ALERT ***** \n\n\n',
        );
        console.warn(
          'MM',
          '**** APPROVED TRANSACTION ALERT **',
          spenderAddress,
          userAddress,
          tokenAddress,
        );
        const web3Object = getWeb3Object(
          tokenFirst?.coin_family == 1
            ? constants.COIN_SYMBOL.ETH
            : tokenFirst?.coin_family == 4
            ? constants.COIN_SYMBOL.STC
            : constants.COIN_SYMBOL.BNB,
          tokenFirst,
        );
        if (global.disconnected) {
          reject({message: constants.NO_NETWORK});
          return;
        }
        const approveTrans = tokenContractObject.methods.approve(
          spenderAddress,
          BigNumber(10 ** 25).toFixed(0),
        );
        console.warn('MM', 'approveTrans ===>>>', approveTrans);
        if (global.disconnected) {
          reject({message: constants.NO_NETWORK});
          return;
        }
        const approveGasLimit = await approveTrans.estimateGas({
          from: userAddress,
        });
        if (global.disconnected) {
          reject({message: constants.NO_NETWORK});
          return;
        }
        console.warn('MM', 'approveGasLimit ===>>>', approveGasLimit);
        const nonce = await web3Object.eth.getTransactionCount(userAddress);
        if (global.disconnected) {
          reject({message: constants.NO_NETWORK});
          return;
        }
        let privateKey = await Singleton.getInstance().newGetData(
          `${Singleton.getInstance().defaultEthAddress}_pk`,
        );
        console.warn('MM', 'ethPvtKey--------', privateKey);
        const resultApprove = await makeTransaction(
          approveTrans.encodeABI(),
          gasPrice,
          approveGasLimit,
          nonce,
          '0x0',
          tokenAddress,
          privateKey,
          userAddress,
          true,
          tokenFirst,
          isApproved,
          tokenOneAmount,
          rawTxnObj,
        );
        return resolve(resultApprove);
      } catch (error) {
        console.log('errrrin apppp', error);
        return reject(error);
      }
    });
  };

  const checkContractApproval = async ({path, result}) => {
    return new Promise(async (resolve, reject) => {
      let routerAddress =
        tokenFirst?.coin_family == 1
          ? Singleton.getInstance().SwapRouterAddress
          : tokenFirst?.coin_family == 4
          ? Singleton.getInstance().SwapRouterStcAddress
          : Singleton.getInstance().SwapRouterBNBAddress;
      try {
        console.warn('MM', 'checkContractApproval****', path, result);
        let tokenContractObject = await getContractObject(path[0], tokenFirst);
        let userTokenBal = await tokenContractObject.methods
          .balanceOf(userAddress)
          .call();
        console.warn(
          'MM',
          'tokenContractObject ==>>>',
          userTokenBal,
          userAddress,
          routerAddress,
        );
        console.warn(
          'MM',
          'userTokenBal ==>>>',
          userTokenBal,
          userAddress,
          routerAddress,
        );
        let allowance = await tokenContractObject.methods
          .allowance(userAddress, routerAddress)
          .call();
        console.warn('MM', 'allowance ==>>>', allowance);
        if (+allowance <= +result[0]) {
          setUserApproval(false);
          return resolve(false);
        } else {
          setUserApproval(true);
          return resolve(true);
        }
      } catch (error) {
        console.log('errr approvvv', error);
        return reject(error || 'Unable to check approval');
      }
    });
  };
  const getAmountsInOut = async (
    tokenFirstDecimals,
    tokenSecondDecimals,
    amount,
    type,
    path,
  ) => {
    return new Promise(async (resolve, reject) => {
      try {
        setInsufficientBalance(false);
        let decimals =
          type == SELECTED_INPUT.firstInput
            ? tokenFirstDecimals
            : tokenSecondDecimals;
        // const addAmountIn = (amount * (1 * 10 ** decimals)).toFixed(0);
        const addAmountIn = bigNumberSafeMath(amount, '*', 10 ** decimals);
        console.warn(
          'MM',
          'amount ==>>>>> ',
          amount,
          '=addAmountIn===>>',
          addAmountIn,
        );
        let calAmount = BigNumber(addAmountIn).toFixed();
        let routerAddress =
          tokenFirst?.coin_family == 1
            ? Singleton.getInstance().SwapRouterAddress
            : tokenFirst?.coin_family == 4
            ? Singleton.getInstance().SwapRouterStcAddress
            : Singleton.getInstance().SwapRouterBNBAddress;

        console.log('routerAddress::::::', routerAddress);
        let routerContractObject = await getContractObject(
          routerAddress,
          tokenFirst,
          ROUTER_ABI,
        );
        let result;
        if (type == SELECTED_INPUT.firstInput) {
          console.warn(
            'MM',
            '=====TK1========= getAmountsOut',
            calAmount,
            path,
          );
          result = await routerContractObject.methods
            .getAmountsOut(calAmount, path)
            .call();
        } else {
          console.warn('MM', '=====TK2========= getAmountsIn', calAmount, path);
          result = await routerContractObject.methods
            .getAmountsIn(calAmount, path)
            .call();
        }
        console.warn('MM', '+++++++++++', result);
        return resolve({result});
      } catch (err) {
        console.warn('MM', 'eeeeeeee   ==== >>>> ' + err);
        setLoading(false);
        let message = constants.SOMETHING_WRONG;
        if (err.toString().includes('ds-math')) {
          setIsOverFlow(true);
          message =
            'Unable to swap with this amount, Attempt to exchange with a smaller amount. ';
          setTokenOneAmount(0);
          setTokenTwoAmount(0);
        } else if (err.toString().includes('execution reverted')) {
          setIsPairSupported(false);
          setTransferFailed(false);
          message = 'Pair not Supported at the moment.';
        } else if (err?.toString().includes('INSUFFICIENT_LIQUIDITY')) {
          console.log('::::::INSUFFICIENT_LIQUIDITY:::::');
          setIsInSufficientLiquidity(true);
        } else if (err?.toString().includes('IDENTICAL_ADDRESSES')) {
          message = 'Same coin Selected';
          setTokenOneAmount(0);
          setTokenTwoAmount(0);
        } else if (err?.toString().includes('overflow')) {
          Singleton.showAlert(constants.INSUFFICIENT_BALANCE);
        }
        return reject({message});
      }
    });
  };

  const onChangeText = async ({
    tokenFirst,
    tokenSecond,
    type,
    value,
    isError,
  }) => {
    setTransferFailed(false);
    let routerAddress =
      tokenFirst?.coin_family == 1
        ? Singleton.getInstance().SwapRouterAddress
        : tokenFirst?.coin_family == 4
        ? Singleton.getInstance().SwapRouterStcAddress
        : Singleton.getInstance().SwapRouterBNBAddress;
    console.log(
      'onChangeText::::',
      tokenFirst,
      tokenSecond,
      type,
      value,
      tokenFirst?.coin_family,
    );
    if (tokenFirst?.coin_family == 1) {
      if (
        tokenFirst.coin_symbol.toLowerCase() != constants.COIN_SYMBOL.ETH &&
        tokenSecond.coin_symbol.toLowerCase() != constants.COIN_SYMBOL.ETH
      ) {
        console.log('if12:::');
        Singleton.showAlert('Atleast one asset should be ETH');
        setTokenOneAmount(0);
        setTokenTwoAmount(0);
        setInsufficientBalance(false);
        return;
      }
    } else if (tokenFirst?.coin_family == 4) {
      if (
        tokenFirst.coin_symbol.toLowerCase() != constants.COIN_SYMBOL.STC &&
        tokenSecond.coin_symbol.toLowerCase() != constants.COIN_SYMBOL.STC
      ) {
        console.log('if12:::');
        Singleton.showAlert('Atleast one asset should be STC');
        setTokenOneAmount(0);
        setTokenTwoAmount(0);
        setInsufficientBalance(false);
        return;
      }
    } else {
      if (
        tokenFirst.coin_symbol.toLowerCase() != constants.COIN_SYMBOL.BNB &&
        tokenSecond.coin_symbol.toLowerCase() != constants.COIN_SYMBOL.BNB
      ) {
        console.log('if1::::');
        Singleton.showAlert('Atleast one asset should be BNB');
        setTokenOneAmount(0);
        setTokenTwoAmount(0);
        setInsufficientBalance(false);
        return;
      }
    }
    if (value.length == 0) {
      console.log('if13:::');
      setTokenOneAmount(0);
      setTokenTwoAmount(0);
      setInsufficientBalance(false);
      setIsOverFlow(false);
      return;
    }
    if (value == '.') {
      console.log('if13:::');
      setTokenOneAmount(0);
      setTokenTwoAmount(0);
      setInsufficientBalance(false);
      setIsOverFlow(false);
      return;
    }
    console.log('if::::::::::');
    setLoading(true);
    setInsufficientBalance(false);
    setIsOverFlow(false);
    setIsInsufficientOutputAmount(false);
    setIsInSufficientLiquidity(false);
    getWeb3Object(
      tokenFirst?.coin_family == 1
        ? constants.COIN_SYMBOL.ETH
        : tokenFirst?.coin_family == 4
        ? constants.COIN_SYMBOL.STC
        : constants.COIN_SYMBOL.BNB,
      tokenFirst,
    )
      .eth.getGasPrice()
      .then(async gas => {
        let gasPrice = gas;
        if (tokenFirst?.coin_family == 1) {
          gasPrice = (parseInt(gasPrice) + GAS_PRICE_EXTRA_BUFFER).toString();
        }
        setGasPrice(gasPrice);
        console.log(
          '????>>>>>>>>> onchange',
          value,
          tokenFirst,
          SELECTED_INPUT.firstInput,
          type,
        );
        const userBal = await getUserBal(
          tokenFirst,
          userAddress,
          setUserBal,
          setCoinBalance,
          setLoading,
          coinBalance,
        );
        console.warn(
          'MM',
          '?>>>>',
          value,
          userBal,
          userBal / 10 ** tokenFirst.decimals,
        );
        if (!value || parseFloat(value) <= 0) {
          type == SELECTED_INPUT.firstInput
            ? setTokenTwoAmount('')
            : setTokenOneAmount('');
          setLoading(false);
          return;
        }
        const firstAddress = tokenFirst.token_address;
        const secondAddress = tokenSecond.token_address;
        let path = [firstAddress, secondAddress];
        console.warn('MM', 'chk path::::::', path);
        console.warn('MM', 'chk path:::::: tokenFirst', tokenFirst);
        console.warn('MM', 'chk path:::::: tokenSecond', tokenSecond);
        const {result} = await getAmountsInOut(
          tokenFirst.decimals,
          tokenSecond.decimals,
          value,
          type,
          path,
        );
        console.warn('MM', 'result >>>', result);
        if (type == SELECTED_INPUT.firstInput) {
          console.warn('MM', 'result >> type', type, parseFloat(result[1]));
          let amount =
            parseFloat(result[1]) > 0
              ? Singleton.getInstance().exponentialToDecimal(
                  result[1] / 10 ** tokenSecond.decimals,
                )
              : 0;
          console.warn('MM', 'result >> amount', amount);
          setTokenTwoAmount(
            parseFloat(amount) > 0
              ? `${Singleton.getInstance().exponentialToDecimal(
                  Singleton.getInstance().toFixed(amount, tokenSecond.decimals),
                )}`
              : 0,
          );
        } else {
          console.warn('MM', 'result >> type', type);
          let amountTwo =
            parseFloat(result[1]) > 0
              ? Singleton.getInstance().exponentialToDecimal(
                  result[0] / 10 ** tokenFirst.decimals,
                )
              : 0;
          setTokenOneAmount(
            parseFloat(amountTwo) > 0
              ? `${Singleton.getInstance().exponentialToDecimal(
                  Singleton.getInstance().toFixed(
                    amountTwo,
                    tokenFirst.decimals,
                  ),
                )}`
              : 0,
          );
        }
        const routerContractObject = await getContractObject(
          routerAddress,
          tokenFirst,
          ROUTER_ABI,
        );
        const amountAMin = BigNumber(result[0]).toFixed(0);
        const amountBMin = BigNumber(
          result[1] - (result[1] * SLIPPERAGE_PERCENTAGE) / 100,
        ).toFixed(0);
        let deadline = Math.floor(new Date().getTime() / 1000);
        deadline = deadline + TXN_COMPLETE_MAX_TIME * 60;
        console.warn(
          'MM',
          'chk userBal:::::: userBal SLIPPERAGE_PERCENTAGE',
          userBal,
          amountBMin,
          SLIPPERAGE_PERCENTAGE,
          TXN_COMPLETE_MAX_TIME,
        );
        console.warn('MM', 'chk result:::::: result', result[0]);
        console.log(
          'insufficient balance ',
          userBal,
          typeof userBal,
          result[0],
          typeof result[0],
          userBal < result[0],
        );
        let user_balance = exponentialToDecimalWithoutComma(userBal);
        let required_input = result[0];

        console.log(
          '::::::::',
          user_balance,
          required_input,
          typeof user_balance,
          +user_balance < +required_input,
        );
        if (+user_balance < +required_input) {
          console.log('::::::if');
          setInsufficientBalance(true);
          setLoading(false);
          return;
        } else {
          console.log('::::::else');
          setInsufficientBalance(false);
        }
        if (
          tokenFirst.coin_symbol.toLowerCase() == constants.COIN_SYMBOL.ETH ||
          tokenFirst.coin_symbol.toLowerCase() == constants.COIN_SYMBOL.BNB ||
          (tokenFirst.coin_family == 4 &&
            tokenFirst.coin_symbol.toLowerCase() == constants.COIN_SYMBOL.STC)
        ) {
          setUserApproval(true);
          let swapTransaction;
          if (isError) {
            console.log('here:::::3');
            console.log(
              '-----swapExactETHForTokensSupportingFeeOnTransferTokens_tokenFirst -------',
            );
            swapTransaction =
              await routerContractObject.methods.swapExactETHForTokensSupportingFeeOnTransferTokens(
                amountBMin.toString(),
                path,
                userAddress,
                deadline,
              );
          } else {
            console.log('here:::::4');
            if (type == SELECTED_INPUT.firstInput) {
              console.warn('MM', '-----swapExactETHForTokens  00 -------');
              swapTransaction =
                await routerContractObject.methods.swapExactETHForTokens(
                  amountBMin.toString(),
                  path,
                  userAddress,
                  deadline,
                );
            } else {
              console.warn('MM', '-----swapETHForExactTokens  11 -------');
              swapTransaction =
                await routerContractObject.methods.swapETHForExactTokens(
                  amountBMin.toString(),
                  path,
                  userAddress,
                  deadline,
                );
            }
          }
          console.warn(
            'MM',
            '-----swapExactETHForTokens-------',
            amountAMin.toString(),
            path,
            userAddress,
            deadline,
            type,
          );
          console.log('amountAMin.toString()::::', amountAMin.toString());
          swapTransaction
            .estimateGas({from: userAddress, value: amountAMin.toString()})
            .then(gasEstimate => {
              console.warn(
                'MM',
                '-----estimateGas-------',
                gasEstimate,
                ' GAS PRICE',
                gasPrice,
              );
              setInsufficientBalance(false);
              setGasEstimate(gasEstimate + GAS_BUFFER);
              console.warn(
                'MM',
                'Singleton.getInstance().toFixed(((gasEstimate) * gasPrice * GAS_FEE_MULTIPLIER:::',
                gasEstimate * gasPrice * GAS_FEE_MULTIPLIER,
              );
              setRawTxnObj({
                type: tokenFirst.coin_symbol.toLowerCase(),
                data: swapTransaction.encodeABI(),
                value: amountAMin.toString(),
              });
              setLoading(false);
            })
            .catch(err => {
              if (!isError) {
                onChangeText({
                  tokenFirst,
                  tokenSecond,
                  type,
                  value,
                  isError: true,
                });
              }
              console.warn('MM', 'hdhshs shsh hshs' + err?.message);
              setLoading(false);
              if (isError) {
                if (err?.message?.toLowerCase().includes('failed')) {
                  setTransferFailed(true);
                } else {
                  setInsufficientBalance(true);
                }
                if (err?.message?.includes('INSUFFICIENT_OUTPUT_AMOUNT')) {
                  setIsInsufficientOutputAmount(true);
                  Singleton.showAlert(
                    'Insufficient output amount. Try increasing your slippage.',
                  );
                }
              }
            });
        } else {
          let isApproved;
          try {
            isApproved = await checkContractApproval({path, result});
          } catch (error) {
            console.log('erererrrrr', error);
            setLoading(false);
            Singleton.showAlert('Unable to check allowance');
            return;
          }
          console.warn('MM', 'isApproved ======>>', isApproved);
          if (!isApproved) {
            console.warn('MM', 'isApproved ======>>  inside approved');
            let tokenContractObject = await getContractObject(
              path[0],
              selectedInput == SELECTED_INPUT.firstInput
                ? tokenFirst
                : tokenSecond,
            );
            setAllowancetxnObj({
              tokenContractObject: tokenContractObject,
              path: path[0],
            });
            tokenContractObject.methods
              .approve(routerAddress, BigNumber(10 ** 25).toFixed(0))
              .estimateGas({from: userAddress})
              .then(gasEstimate => {
                setInsufficientBalance(false);
                console.warn('MM', 'isApproved ======>>  inside ', gasEstimate);
                setGasEstimate(gasEstimate + GAS_BUFFER);
                setRawTxnObj({
                  tokenContractAddress: tokenFirst.token_address,
                });
                setLoading(false);
              })
              .catch(err => {
                console.warn('MM', 'xx transfer failed', err?.message);
                setLoading(false);
                if (err?.message?.toLowerCase()?.includes('failed')) {
                  setTransferFailed(true);
                } else {
                  setInsufficientBalance(true);
                }
                if (err?.message?.includes('INSUFFICIENT_OUTPUT_AMOUNT')) {
                  setIsInsufficientOutputAmount(true);
                  Singleton.showAlert(
                    'Insufficient output amount. Try increasing your slippage.',
                  );
                }
              });
            return;
          }
          console.warn('MM', 'isApproved ======>>  after approved');
          if (
            tokenSecond.coin_symbol.toLowerCase() == constants.COIN_SYMBOL.ETH ||
            tokenSecond.coin_symbol.toLowerCase() == constants.COIN_SYMBOL.BNB ||
            (tokenSecond.coin_family == 4 &&
              tokenSecond.coin_symbol.toLowerCase() == constants.COIN_SYMBOL.STC)
          ) {
            let swapTransaction;
            if (isError) {
              console.log('here:::::1');
              let amount = amountAMin.toString();
              console.warn(
                'MM',
                'Token to ETH ======>>swapExactTokensForETH',
                ' amountAMin.toString()',
                amount,
                'amountBMin.toString()',
                amountBMin.toString(),
                'path',
                path,
                'userAddress',
                userAddress,
                'deadline',
                deadline,
              );
              swapTransaction =
                await routerContractObject.methods.swapExactTokensForETHSupportingFeeOnTransferTokens(
                  amount,
                  amountBMin.toString(),
                  path,
                  userAddress,
                  deadline,
                );
            } else {
              console.log('here:::::2');
              if (type == SELECTED_INPUT.firstInput) {
                console.warn(
                  'MM',
                  'Token to ETH ======>>swapExactTokensForETH',
                  ' amountAMin.toString()',
                  amountAMin.toString(),
                  'amountBMin.toString()',
                  amountBMin.toString(),
                  'path',
                  path,
                  'userAddress',
                  userAddress,
                  'deadline',
                  deadline,
                );
                swapTransaction =
                  await routerContractObject.methods.swapTokensForExactETH(
                    amountBMin.toString(),
                    amountAMin.toString(),
                    path,
                    userAddress,
                    deadline,
                  );
              } else {
                console.warn(
                  'MM',
                  'Token to ETH ======>>swapExactTokensForETH',
                  ' amountAMin.toString()',
                  amountAMin.toString(),
                  'amountBMin.toString()',
                  amountBMin.toString(),
                  'path',
                  path,
                  'userAddress',
                  userAddress,
                  'deadline',
                  deadline,
                );
                swapTransaction =
                  await routerContractObject.methods.swapExactTokensForETH(
                    amountAMin.toString(),
                    amountBMin.toString(),
                    path,
                    userAddress,
                    deadline,
                  );
              }
            }
            console.warn('MM', 'swapTransaction>', swapTransaction);
            swapTransaction
              .estimateGas({from: userAddress})
              .then(gasEstimate => {
                setInsufficientBalance(false);
                console.log('gas estimary    ', gasEstimate);
                setGasEstimate(gasEstimate + GAS_BUFFER);
                setRawTxnObj({
                  type: 'token',
                  data: swapTransaction.encodeABI(),
                  tokenContractAddress: tokenFirst.token_address,
                });
                setLoading(false);
              })
              .catch(err => {
                if (!isError) {
                  onChangeText({
                    tokenFirst,
                    tokenSecond,
                    type,
                    value,
                    isError: true,
                  });
                }
                console.warn(
                  'MM',
                  'wwwfsfdfsdf transfer failed',
                  err,
                  err?.message,
                );
                if (isError) {
                  setLoading(false);
                  if (err?.message?.toLowerCase()?.includes('failed')) {
                    setTransferFailed(true);
                  } else {
                    setInsufficientBalance(true);
                  }
                  if (err?.message?.includes('INSUFFICIENT_OUTPUT_AMOUNT')) {
                    setIsInsufficientOutputAmount(true);
                    Singleton.showAlert(
                      'Insufficient output amount. Try increasing your slippage.',
                    );
                  }
                }
              });
          } else {
            let swapTransaction;
            if (type == SELECTED_INPUT.firstInput) {
              swapTransaction =
                await routerContractObject.methods.swapExactTokensForTokens(
                  amountAMin.toString(),
                  amountBMin.toString(),
                  path,
                  userAddress,
                  deadline,
                );
            } else if (type == SELECTED_INPUT.secondInput) {
              swapTransaction =
                await routerContractObject.methods.swapTokensForExactTokens(
                  amountAMin.toString(),
                  amountBMin.toString(),
                  path,
                  userAddress,
                  deadline,
                );
            }
            swapTransaction
              .estimateGas({from: userAddress})
              .then(gasEstimate => {
                setInsufficientBalance(false);
                setGasEstimate(gasEstimate + GAS_BUFFER);
                setRawTxnObj({
                  type: 'token',
                  data: swapTransaction.encodeABI(),
                  tokenContractAddress: tokenFirst.token_address,
                });
                setLoading(false);
              })
              .catch(err => {
                console.warn('MM', ':::::transfer failed::', err?.message);
                setLoading(false);
                if (err?.message?.toLowerCase()?.includes('failed')) {
                  setTransferFailed(true);
                } else {
                  setInsufficientBalance(true);
                }
                if (err?.message?.includes('INSUFFICIENT_OUTPUT_AMOUNT')) {
                  setIsInsufficientOutputAmount(true);
                  Singleton.showAlert(
                    'Insufficient output amount. Try increasing your slippage.',
                  );
                }
              });
          }
        }
      })
      .catch(err => {
        console.log('err gas ', err);
        setLoading(false);
        if (
          err?.message
            ?.toString()
            ?.toLowerCase()
            ?.includes('invalid json rpc response')
        ) {
          Singleton.showAlert(constants.SOMETHING_WRONG);
        } else if (err?.message != constants.SOMETHING_WRONG) {
          Singleton.showAlert(
            sanitizeErrorMessage(err?.message) || 'Unable to fetch gas price',
          );
        } else if (err?.message?.includes('execution reverted')) {
          Singleton.showAlert('Pair not Supported at the moment.');
        }
      });
  };
  const swap = async () => {
    try {
      let routerAddress =
        tokenFirst?.coin_family == 1
          ? Singleton.getInstance().SwapRouterAddress
          : tokenFirst?.coin_family == 4
          ? Singleton.getInstance().SwapRouterStcAddress
          : Singleton.getInstance().SwapRouterBNBAddress;
      const web3Object = getWeb3Object(
        tokenFirst?.coin_family == 1
          ? constants.COIN_SYMBOL.ETH
          : tokenFirst?.coin_family == 4
          ? constants.COIN_SYMBOL.STC
          : constants.COIN_SYMBOL.BNB,
        tokenFirst,
      );
      let nonce = await web3Object.eth.getTransactionCount(userAddress);
      console.log('makeTransaction:::::::', rawTxnObj);
      let privateKey = await Singleton.getInstance().newGetData(
        `${Singleton.getInstance().defaultEthAddress}_pk`,
      );
      console.warn('MM', 'ethPvtKey--------', privateKey);
      const result = await makeTransaction(
        rawTxnObj.data,
        gasPrice,
        gasEstimate,
        nonce,
        rawTxnObj.type == constants.COIN_SYMBOL.ETH ||
          rawTxnObj.type == constants.COIN_SYMBOL.STC ||
          rawTxnObj.type == constants.COIN_SYMBOL.BNB
          ? rawTxnObj.value
          : '0x0',
        routerAddress,
        privateKey,
        userAddress,
        false,
        tokenFirst,
        isApproved,
        tokenOneAmount,
        rawTxnObj,
      );
      console.warn('MM', '--------------result---------------', result);
      setRawTxnObj({});
      setTimeout(() => {
        getUserBal(
          tokenFirst,
          userAddress,
          setUserBal,
          setCoinBalance,
          setLoading,
          coinBalance,
        );
        getUserBalSecond(
          tokenSecond,
          tokenFirst,
          userAddress,
          setUserBal,
          setCoinBalanceSecond,
          coinBalanceSecond,
          setLoading,
        );
      }, 800);
      setLoading(false);
      Alert.alert(
        'Success',
        'Transaction is broadcasted successfully. Waiting for blockchain confirmation ',
        [
          {
            text: 'Ok',
            onPress: () => {
              setTokenOneAmount('');
              setTokenTwoAmount('');
              setSelectedInput(SELECTED_INPUT.firstInput);
            },
          },
        ],
        {cancelable: false},
      );
      return result;
    } catch (error) {
      console.log('errrr swap', error);
      setLoading(false);
      if (
        error?.toString()?.includes("Error: CONNECTION ERROR: Couldn't connect")
      ) {
        Singleton.showAlert(constants.NO_NETWORK);
        console.warn('MM', ' send transaction err ==>>', err);
      } else {
        Singleton.showAlert(sanitizeErrorMessage(error?.message) || constants.SOMETHING_WRONG);
      }
    }
  };

  const checkForSwapTokenCall = isSecond => {
    console.log(tokenFirst, '::::isSecond::', isSecond);
    try {
      onProceed();
    } catch (err) {
      setLoading(false);
      Singleton.showAlert(constants.SOMETHING_WRONG);
    }
  };
  const onProceed = async () => {
    console.log('called:::::', transferFailed);
    if (global.disconnected) {
      Singleton.showAlert(constants.NO_NETWORK);
      return;
    }
    if (tokenFirst?.coin_family == 1) {
      if (
        tokenFirst.coin_symbol.toLowerCase() != constants.COIN_SYMBOL.ETH &&
        tokenSecond.coin_symbol.toLowerCase() != constants.COIN_SYMBOL.ETH
      ) {
        Singleton.showAlert('Atleast one asset should be ETH');
        return;
      }
    } else if (tokenFirst?.coin_family == 4) {
      if (
        tokenFirst.coin_family == 4 &&
        tokenFirst.coin_symbol.toLowerCase() != constants.COIN_SYMBOL.STC &&
        tokenSecond.coin_family == 4 &&
        tokenSecond.coin_symbol.toLowerCase() != constants.COIN_SYMBOL.STC
      ) {
        Singleton.showAlert('Atleast one asset should be STC');
        return;
      }
    } else {
      if (
        tokenFirst.coin_symbol.toLowerCase() != constants.COIN_SYMBOL.BNB &&
        tokenSecond.coin_symbol.toLowerCase() != constants.COIN_SYMBOL.BNB
      ) {
        Singleton.showAlert('Atleast one asset should be BNB');
        return;
      }
    }
    console.log('isPairsupported', isPairsupported);
    let isValidAmount = tokenOneAmount > 0;
    if (tokenOneAmount == undefined || !isValidAmount) {
      Singleton.showAlert('Please enter amount to swap');
    } else if (!isApproved) {
      let totalFee = (gasPrice * gasEstimate).toFixed(0);
      const web3Object = getWeb3Object(
        tokenFirst?.coin_family == 1
          ? constants.COIN_SYMBOL.ETH
          : tokenFirst?.coin_family == 4
          ? constants.COIN_SYMBOL.STC
          : constants.COIN_SYMBOL.BNB,
        tokenFirst,
      );
      let ethBal = await web3Object.eth.getBalance(userAddress);
      if (ethBal - Singleton.getInstance().exponentialToDecimal(totalFee) < 0) {
        console.log('ethBal', ethBal, 'totalFee', totalFee);
        let type_s =
          tokenFirst?.coin_family == 1
            ? ' ETH '
            : tokenFirst?.coin_family == 4
            ? ' STC '
            : ' BNB ';
        Singleton.showAlert(
          "You don't have enough" + type_s + 'to perform transaction',
        );
        setLoading(false);
        return;
      }
      let type =
        tokenFirst?.coin_family == 1
          ? 'ETH'
          : tokenFirst?.coin_family == 4
          ? 'STC'
          : 'BNB';
      console.log(gasPrice, gasEstimate, GAS_FEE_MULTIPLIER);
      Alert.alert(
        'Approval',
        `Pay ${(gasPrice * gasEstimate * GAS_FEE_MULTIPLIER).toFixed(
          6,
        )} ${type} transaction fee for token approval`,
        [
          {
            text: 'Approve',
            onPress: () => {
              getApproval();
            },
          },
          {
            text: 'Cancel',
            onPress: () => {},
          },
        ],
        {cancelable: false},
      );
    } else if (isOverFlow) {
      Singleton.showAlert(
        'Unable to swap with this amount, Attempt to exchange with a smaller amount. ',
      );
    } else if (!isPairsupported) {
      Singleton.showAlert('Pair not Supported at the moment.');
    } else if (transferFailed) {
      Singleton.showAlert('Unable to swap at the moment.');
    } else if (tokenTwoAmount == undefined || tokenTwoAmount == 0) {
      Singleton.showAlert(
        `${tokenFirst.coin_name}'s equivalent amount to ${tokenSecond.coin_name} is not received.`,
      );
    } else if (parseFloat(userBal) >= parseFloat(tokenOneAmount)) {
      console.warn('MM', '>>>>>>>>>> isApproved', isApproved);
      if (isApproved) {
        let totalFee = bigNumberSafeMath(gasPrice, '*', gasEstimate);
        console.warn(
          'MM',
          '>>>>>>>>>> totalFee',
          gasPrice,
          gasEstimate,
          totalFee,
        );
        const web3Object = getWeb3Object(
          tokenFirst?.coin_family == 1
            ? constants.COIN_SYMBOL.ETH
            : tokenFirst?.coin_family == 4
            ? constants.COIN_SYMBOL.STC
            : constants.COIN_SYMBOL.BNB,
          tokenFirst,
        );
        let ethBal = await web3Object.eth.getBalance(userAddress);
        console.warn('MM', '>>>>>>>>>> ethBal', ethBal);
        if (
          rawTxnObj?.type == constants.COIN_SYMBOL.ETH ||
          rawTxnObj?.type == constants.COIN_SYMBOL.STC ||
          rawTxnObj?.type == constants.COIN_SYMBOL.BNB
        ) {
          totalFee = await bigNumberSafeMath(
            exponentialToDecimalWithoutComma(totalFee),
            '+',
            rawTxnObj?.value,
          );
          console.warn('MM', '>>>>>>>>>> totalFee', totalFee, rawTxnObj?.value);
        }
        if (
          ethBal - Singleton.getInstance().exponentialToDecimal(totalFee) <
          0
        ) {
          console.log('totalFee:::', totalFee);
          let required = parseFloat(totalFee * GAS_FEE_MULTIPLIER);
          let type_s =
            tokenFirst?.coin_family == 1
              ? 'ETH'
              : tokenFirst?.coin_family == 4
              ? 'STC'
              : ' BNB';
          Singleton.showAlert(
            "You don't have enough " +
              type_s +
              ' to perform transaction! Required amount is ' +
              Singleton.getInstance().toFixed(required, 6) +
              ' ' +
              type_s,
          );
          return;
        }
        console.log('::::::>>>>:::::');
        setLoading(false);
        setSwapModal(true);
      } else {
        let gasEstim = gasEstimate;
        let totalFee = (gasPrice * gasEstim).toFixed(0);
        const web3Object = getWeb3Object(
          tokenFirst?.coin_family == 1
            ? constants.COIN_SYMBOL.ETH
            : tokenFirst?.coin_family == 4
            ? constants.COIN_SYMBOL.STC
            : constants.COIN_SYMBOL.BNB,
          tokenFirst,
        );
        let ethBal = await web3Object.eth.getBalance(userAddress);
        if (
          ethBal - Singleton.getInstance().exponentialToDecimal(totalFee) <
          0
        ) {
          let type_s =
            tokenFirst?.coin_family == 1
              ? ' ETH '
              : tokenFirst?.coin_family == 4
              ? ' STC '
              : ' BNB ';
          Singleton.showAlert(
            "You don't have enough" + type_s + 'to perform transaction',
          );
          return;
        }
        let type =
          tokenFirst?.coin_family == 1
            ? 'ETH'
            : tokenFirst?.coin_family == 4
            ? 'STC'
            : 'BNB';
        console.log(gasPrice, gasEstim, GAS_FEE_MULTIPLIER);
        Alert.alert(
          'Approval',
          `Pay ${(gasPrice * gasEstim * GAS_FEE_MULTIPLIER).toFixed(
            6,
          )} ${type} transaction fee for token approval`,
          [
            {
              text: 'Approve',
              onPress: () => {
                getApproval();
              },
            },
            {
              text: 'Cancel',
              onPress: () => {},
            },
          ],
          {cancelable: false},
        );
      }
    } else if (parseFloat(userBal) < parseFloat(tokenOneAmount)) {
      console.log('userBal ETH=====', userBal);
      console.log('userBal ETH tokenOneAmount=====', tokenOneAmount);

      Singleton.showAlert("You don't have enough balance");
    } else {
      Singleton.showAlert('Unable to swap at the moment.');
    }
  };

  const onPressPercentageButton = (item, balance, notTab) => {
    setTokenTwoAmount(0);
    console.log(
      'item::::::',
      item,
      'balance:::::::',
      balance,
      'coinBalance[tokenFirst?.id]?.balance:::::::',
      coinBalance[tokenFirst?.id]?.balance,
    );
    if (activeButton != item) {
      if (coinBalance[tokenFirst?.id]?.balance) {
        setActiveButton(notTab ? 0 : item);
        let coinSymbol = tokenFirst?.coin_symbol?.toLowerCase();
        let percentage =
          coinSymbol == constants.COIN_SYMBOL.ETH ||
          coinSymbol == constants.COIN_SYMBOL.BNB ||
          (tokenFirst.coin_family == 4 &&
            tokenFirst.coin_symbol.toLowerCase() == constants.COIN_SYMBOL.STC)
            ? item == 100
              ? 90
              : item
            : item;
        console.log('percentage>>>>>>>>', percentage, coinSymbol);
        let amount = calculatePercentage(percentage, balance);
        console.log('amount:::::::', amount);
        setTokenOneAmount(exponentialToDecimalWithoutComma(amount));
        typeGlobal = SELECTED_INPUT.firstInput;
        onChangeText({
          tokenFirst,
          tokenSecond,
          type: SELECTED_INPUT.firstInput,
          value: amount,
          isError: false,
        });
      }
    }
  };
  const onPressItem1 = async selectedItem => {
    console.log('selectedItem::::', selectedItem);
    let userBal = await getUserBal(
      selectedItem,
      userAddress,
      setUserBal,
      setCoinBalance,
      setLoading,
      coinBalance,
    );
    console.log('userBal::::', userBal);
    setTimeout(() => {
      setActiveButton(0);
      updateSwap(selectedItem, 'first');
      setIsOverFlow(false);
      setIsPairSupported(true);
      setTransferFailed(false);
      console.warn('MM', 'checkDropDwonSelect', selectedItem);
      setTokenOneAmount(0);
      setTokenTwoAmount(0);
      setUserApproval(true);
      setInsufficientBalance(false);
      setIsInsufficientOutputAmount(false);
      setIsInSufficientLiquidity(false);
      dispatch(saveSwapItem({}));
      setTokenFirst(selectedItem);
      setTimeout(() => {
        getUserBal(
          selectedItem,
          userAddress,
          setUserBal,
          setCoinBalance,
          setLoading,
          coinBalance,
        );
      }, 800);
    }, 500);
  };
  const onPressItem2 = async selectedItem => {
    if (
      tokenFirst?.coin_family == 1 &&
      tokenFirst.coin_symbol?.toLowerCase() != constants.COIN_SYMBOL.ETH &&
      selectedItem.coin_symbol?.toLowerCase() != constants.COIN_SYMBOL.ETH
    ) {
      Singleton.showAlert('Atleast one asset should be ETH');
    } else if (
      tokenFirst?.coin_family == 6 &&
      tokenFirst.coin_symbol?.toLowerCase() != constants.COIN_SYMBOL.BNB &&
      selectedItem.coin_symbol?.toLowerCase() != constants.COIN_SYMBOL.BNB
    ) {
      Singleton.showAlert('Atleast one asset should be BNB');
    } else if (
      tokenFirst?.coin_family == 4 &&
      tokenFirst.coin_symbol?.toLowerCase() != constants.COIN_SYMBOL.STC &&
      selectedItem.coin_symbol?.toLowerCase() != constants.COIN_SYMBOL.STC
    ) {
      Singleton.showAlert('Atleast one asset should be STC');
    } else {
      console.log('::::::::else::::::::');
      setActiveButton(0);
      setIsOverFlow(false);
      setIsPairSupported(true);
      setTransferFailed(false);
      console.warn('MM', 'checkDropDwonSelect', selectedItem);
      setTokenOneAmount(0);
      setTokenTwoAmount(0);
      setTokenSecond(selectedItem);
      checkforPair(selectedItem, tokenFirst, setIsPairSupported);
      if (
        selectedItem?.coin_symbol?.toUpperCase() == 'STC' &&
        selectedItem?.coin_family != 4
      ) {
        Singleton.getInstance().slipageTolerance = 2;
      } else if (
        selectedItem?.coin_symbol?.toUpperCase() == 'SRLTY' &&
        selectedItem?.coin_family != 4
      ) {
        Singleton.getInstance().slipageTolerance = 3;
      } else {
        Singleton.getInstance().slipageTolerance = 1;
      }
      setUserApproval(true);
      setInsufficientBalance(false);
      setIsInsufficientOutputAmount(false);
      setIsInSufficientLiquidity(false);
    }
  };
  const onChangeTextTop = text => {
    setSearchText(text);
    debounceLoadData(text);
  };
  const debounceLoadData = useCallback(
    debounce((text, isSelectedList) => {
      if (isSelectedList) {
        searchList2(text);
      } else {
        searchList1(text);
      }
    }, 1000),
    [],
  );
  const searchList1 = async text => {
    Singleton.getInstance()
      .newGetData(constants.IS_PRIVATE_WALLET)
      .then(async isPrivate => {
        setLoading(true);
        try {
          let response = await getSwapData(
            getCoinFamilyForActiveWallet(isPrivate),
            null,
            text,
            0,
            setUsedFiatType,
            setPage,
            setLoading,
            dispatch,
          );
          console.log('searchList1::::::', response);
          setFullList(response.data);
          settotalRecordsAll(response?.meta?.total);
        } catch (err) {
          setLoading(false);
        } finally {
          setLoading(false);
        }
      });
  };
  const searchList2 = async text => {
    let tokenF = tokenFirst || tokenOne;
    console.log('tokenF:::::::', tokenFirst, tokenOne);
    setLoading(true);
    try {
      let response = await getSwapData(
        tokenF?.coin_family,
        tokenF?.id,
        text,
        0,
        setUsedFiatType,
        setPage,
        setLoading,
        dispatch,
      );
      console.log('searchList2::::::', response);
      setCoinList(response.data);
      settotalRecordsSelected(response?.meta?.total);
    } catch (err) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  const onChangeTextBottom = text => {
    console.log(':::::onChangeTextBottom::::');
    setSearchText(text);
    debounceLoadData(text, true);
  };
  const onPressAddCustomToken1 = () => {
    onCloseAllList();
    getCurrentRouteName() != 'AddToken' &&
      navigate(NavigationStrings.AddToken, {from: 'swap'});
  };
  const onPressAddCustomToken2 = () => {
    onCloseSelectedList();
    getCurrentRouteName() != 'AddToken' &&
      navigate(NavigationStrings.AddToken, {
        from: 'swap',
        coin_family: tokenFirst?.coin_family,
      });
  };
  const onCloseAllList = async () => {
    console.log('onCloseAllList:::::::::');
    setShowTokenOneList(false);
    setSearchText('');
    console.log('onCloseAllList:::::::::');
    Singleton.getInstance()
      .newGetData(constants.IS_PRIVATE_WALLET)
      .then(async isPrivate => {
        try {
          let responseAll = await getSwapData(
            getCoinFamilyForActiveWallet(isPrivate),
            null,
            '',
            0,
            setUsedFiatType,
            setPage,
            setLoading,
            dispatch,
          );
          setFullList(responseAll?.data);
          settotalRecordsAll(responseAll?.meta?.total);
        } catch (err) {
          console.log('err:::::', err);
        } finally {
          setloadList(false);
          setLoading(false);
        }
      });
  };
  const isCloseToBottomAllList = async ({nativeEvent}) => {
    console.log('called:::::');
    let {layoutMeasurement, contentOffset, contentSize} = nativeEvent;
    const paddingToBottom = 60;
    let bottomReached =
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
    console.log('called:::::', bottomReached, loadList);
    if (bottomReached && !loadList && fullList?.length < totalRecordsAll) {
      setloadList(true);
      Singleton.getInstance()
        .newGetData(constants.IS_PRIVATE_WALLET)
        .then(async isPrivate => {
          try {
            let responseAll = await getSwapData(
              getCoinFamilyForActiveWallet(isPrivate),
              null,
              searchText,
              page,
              setUsedFiatType,
              setPage,
              setLoading,
              dispatch,
            );
            console.log('responseAll:::::', responseAll);
            let newList = [...fullList, ...responseAll.data];
            setFullList(newList);
            settotalRecordsAll(responseAll?.meta?.total);
          } catch (err) {
            console.log('err:::::', err);
          } finally {
            setloadList(false);
            setLoading(false);
          }
        });
    }
  };
  const onCloseSelectedList = async () => {
    console.log('onCloseAllList:::::::::');
    setShowTokenTwoList(false);
    setSearchText('');
    console.log('onCloseAllList:::::::::');
    try {
      let responseSelected = await getSwapData(
        tokenFirst?.coin_family,
        tokenFirst?.id,
        '',
        0,
        setUsedFiatType,
        setPage,
        setLoading,
        dispatch,
      );
      setCoinList(responseSelected?.data);
      settotalRecordsSelected(responseSelected.meta?.total);
    } catch (err) {
      console.log('err:::::', err);
    } finally {
      setloadList(false);
      setLoading(false);
    }
  };
  const isCloseToBottomSelectedList = async ({nativeEvent}) => {
    console.log('called:::::');
    let {layoutMeasurement, contentOffset, contentSize} = nativeEvent;
    const paddingToBottom = 60;
    let bottomReached =
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
    console.log('called:::::', bottomReached, loadList);
    if (bottomReached && !loadList && coinList?.length < totalRecordsSelected) {
      setloadList(true);
      try {
        let responseSelected = await getSwapData(
          tokenFirst?.coin_family,
          tokenFirst?.id,
          searchText,
          page,
          setUsedFiatType,
          setPage,
          setLoading,
          dispatch,
        );
        console.log('responseAll:::::', responseSelected);
        let newList = [...coinList, ...responseSelected.data];
        setCoinList(newList);
        settotalRecordsSelected(responseSelected?.meta?.total);
      } catch (err) {
        console.log('err:::::', err);
      } finally {
        setloadList(false);
        setLoading(false);
      }
    }
  };

  return (
    <Wrap
      style={{
        backgroundColor: ThemeManager.colors.dashboardBg,
        position: 'relative',
      }}>
      {isOnMaintainance ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: widthDimen(22),
          }}>
          <Text
            style={{
              fontFamily: Fonts.medium,
              textAlign: 'center',
              fontSize: areaDimen(18),
              color: ThemeManager.colors.textColor,
            }}>
            {isOnMaintainanceMsg}
          </Text>
        </View>
      ) : (
        <>
          <ScrollView>
            <Text
              style={[styles.txtTo, {color: ThemeManager.colors.textColor}]}>
              {LanguageManager.swap}
            </Text>
            <View
              style={{
                borderRadius: areaDimen(25),
                height: heightDimen(180), //157
                marginTop: heightDimen(11),
                marginHorizontal: widthDimen(23),
                flexDirection: 'column',

                backgroundColor: ThemeManager.colors.swapBg,
              }}>
              <View
                style={{
                  height: heightDimen(50),
                  marginTop: heightDimen(14),
                  marginHorizontal: widthDimen(16),
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}>
                <SelectDropdown
                  data={fullList}
                  ref={dropDownRefFrom}
                  disabled={true}
                  buttonStyle={{
                    backgroundColor: 'transparent',
                    width: '100%',
                    paddingHorizontal: 0,
                  }}
                  buttonTextStyle={{
                    fontFamily: Fonts.regular,
                    fontSize: areaDimen(16),
                    color: ThemeManager.colors.textColor,
                    textAlign: 'left',
                  }}
                  dropdownStyle={{
                    ...styles.dropDownStyle,
                    backgroundColor: ThemeManager.colors.mnemonicsView,
                  }}
                  rowTextStyle={{
                    fontFamily: Fonts.regular,
                    fontSize: areaDimen(14),
                    color: ThemeManager.colors.textColor,
                    textAlign: 'left',
                    lineHeight: areaDimen(18),
                  }}
                  rowStyle={{
                    borderBottomWidth: 1,
                    borderBottomColor: ThemeManager.colors.viewBorderColor,
                    paddingLeft: widthDimen(20), //List
                    backgroundColor: ThemeManager.colors.mnemonicsView,
                  }}
                  defaultButtonText={tokenFirst?.coin_symbol}
                  disableAutoScroll
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem.coin_symbol;
                  }}
                  rowTextForSelection={(item, index) => {
                    return item.coin_symbol;
                  }}
                  renderCustomizedButtonChild={(item, index) => {
                    return (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          overflow: 'hidden',
                        }}>
                        {tokenFirst?.coin_image != '' ? (
                          <FastImage
                            source={{uri: tokenFirst?.coin_image}}
                            style={{
                              width: areaDimen(34),
                              height: areaDimen(34),
                              borderRadius: areaDimen(40),
                              resizeMode: 'contain',
                            }}
                          />
                        ) : (
                          <View style={styles.coinSymbol}>
                            <Text style={styles.coinSymbolText}>
                              {tokenFirst?.coin_symbol.toUpperCase()?.charAt(0)}
                            </Text>
                          </View>
                        )}
                        <View
                          style={{
                            height: heightDimen(50),
                            width: '100%',
                            flexDirection: 'column',
                          }}>
                          <View
                            style={{
                              width: '100%',
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <TouchableOpacity
                              style={{
                                width: '60%',
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}
                              onPress={() => setShowTokenOneList(true)}>
                              <Text
                                style={{
                                  fontFamily: Fonts.semibold,
                                  fontSize: areaDimen(16),
                                  color: ThemeManager.colors.textColor,
                                  paddingStart: widthDimen(12),
                                  maxWidth: '80%',
                                  lineHeight: areaDimen(22),
                                }}
                                numberOfLines={1}
                                ellipsizeMode="tail">
                                {tokenFirst?.coin_symbol.toUpperCase()}
                              </Text>
                              <FastImage
                                source={images.arrow_filled}
                                style={{
                                  width: widthDimen(12),
                                  height: heightDimen(6),
                                  marginLeft: widthDimen(10),
                                }}
                                resizeMode="contain"
                                tintColor={ThemeManager.colors.textColor}
                              />
                            </TouchableOpacity>
                          </View>
                          <Text
                            style={{
                              fontFamily: Fonts.medium,
                              fontSize: areaDimen(14),
                              color: ThemeManager.colors.lightTextColor,
                              paddingStart: widthDimen(12),
                              marginTop: 2,
                              maxWidth: '80%',
                              lineHeight: areaDimen(20),
                            }}
                            numberOfLines={1}
                            ellipsizeMode="tail">
                            {`1 ${
                              tokenFirst?.coin_symbol.toUpperCase()
                                ? tokenFirst?.coin_symbol.toUpperCase()
                                : ''
                            } = ${Singleton.getInstance().CurrencySymbol}${
                              tokenFirst?.fiat_price == null
                                ? 0.0
                                : CommaSeprator3(
                                    exponentialToDecimalWithoutComma(
                                      isNaN(tokenFirst?.fiat_price)
                                        ? 0.0
                                        : tokenFirst?.fiat_price,
                                    ),
                                    tokenFirst?.fiat_price_decimal || 2,
                                    true,
                                  )
                            }`}
                            {console.log(
                              'tokenFirst?.fiat_price::::::::',
                              tokenFirst?.fiat_price,
                            )}
                          </Text>
                        </View>
                      </View>
                    );
                  }}
                  renderCustomizedRowChild={(item, index) => {
                    return (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        {item ? (
                          <FastImage
                            source={{uri: item?.coin_image}}
                            style={{
                              borderRadius: 14,
                              width: areaDimen(25),
                              height: areaDimen(25),
                              resizeMode: 'contain',
                            }}
                          />
                        ) : (
                          <FastImage
                            source={{
                              uri: coinList[0]?.coin_image,
                            }}
                            style={{
                              borderRadius: 14,
                              width: areaDimen(25),
                              height: areaDimen(25),
                              resizeMode: 'contain',
                            }}
                          />
                        )}
                        <Text
                          style={{
                            fontFamily: Fonts.regular,
                            fontSize: areaDimen(15),
                            color: ThemeManager.colors.textColor,
                            paddingStart: widthDimen(15),
                          }}>
                          {item?.coin_symbol?.toUpperCase()}
                        </Text>
                        <Text
                          style={{
                            fontFamily: Fonts.medium,
                            fontSize: areaDimen(11),
                            color: Colors.grayTextColor,
                            paddingStart: widthDimen(12),
                            marginTop: 2,
                            maxWidth: '80%',
                            lineHeight: areaDimen(18),
                          }}
                          numberOfLines={1}
                          ellipsizeMode="tail">
                          {item?.coin_family == '6' ? 'BNB' : 'ETH'}
                        </Text>
                      </View>
                    );
                  }}
                />
                <Text
                  style={[
                    styles.txtSending,
                    {color: ThemeManager.colors.textColor},
                  ]}>
                  {'Sending'}
                </Text>
              </View>
              <View
                style={{height: heightDimen(52), marginTop: heightDimen(10)}}>
                <TextInput
                  editable={fullList?.length == 0 ? false : true}
                  value={
                    tokenOneAmount
                      ? exponentialToDecimalWithoutComma(tokenOneAmount)
                      : ''
                  }
                  maxLength={20}
                  style={{
                    width: '92%',
                    alignSelf: 'center',
                    justifyContent: 'center',
                    color: ThemeManager.colors.textColor,
                    fontFamily: Fonts.semibold,
                    fontSize: areaDimen(25),
                    lineHeight:
                      Platform.OS == 'ios' ? areaDimen(30) : areaDimen(25),
                  }}
                  placeholder={'0.0'}
                  placeholderTextColor={ThemeManager.colors.lightTextColor}
                  keyboardType={'numeric'}
                  onChangeText={value => {
                    setActiveButton(0);
                    console.log('value::::::', tokenFirst.decimals, value);
                    var expression = new RegExp(
                      '^\\d*\\.?\\d{0,' + tokenFirst.decimals + '}$',
                    );
                    console.log(
                      'expression.test(value)::::::::11111',
                      expression.test(value),
                    );
                    if (expression.test(value)) {
                      console.log(
                        'expression.test(value)::inside::::::',
                        expression.test(value),
                      );
                      setSelectedInput(SELECTED_INPUT.firstInput);
                      setTokenOneAmount(value);
                      if (timer.current) {
                        clearTimeout(timer.current);
                      }
                      timer.current = setTimeout(() => {
                        if (coinBalance[tokenFirst?.id]?.balance > 0) {
                        } else {
                          console.log('::::::::insuff', tokenFirst);
                          setInsufficientBalance(true);
                        }
                        typeGlobal = SELECTED_INPUT.firstInput;
                        onChangeText({
                          tokenFirst,
                          tokenSecond,
                          type: SELECTED_INPUT.firstInput,
                          value,
                          isError: false,
                        });
                      }, 1000);
                    }
                  }}
                />
              </View>
              <Text
                style={[
                  styles.convertedBalanceLabelStyle,
                  {
                    color: ThemeManager.colors.lightTextColor,
                    textAlign: 'right',
                  },
                ]}
                numberOfLines={1}>
                {Singleton.getInstance().CurrencySymbol +
                  convertToInternationalCurrencySystem(
                    exponentialToDecimalWithoutComma(
                      isNaN(tokenOneAmount * tokenFirst?.fiat_price)
                        ? 0
                        : tokenOneAmount * tokenFirst?.fiat_price,
                    ),
                  )}
              </Text>

              <View style={styles.amountView}>
                <Text
                  style={[
                    styles.balanceLabelStyle,
                    {color: ThemeManager.colors.lightTextColor},
                  ]}>
                  {'Balance' + ': '}
                </Text>
                <Text
                  style={[
                    styles.balanceValueStyle,
                    {color: ThemeManager.colors.lightTextColor},
                  ]}>
                  {console.log(
                    'Start First Balance-----------4==',
                    coinBalance,
                    tokenFirst,
                  )}
                  {`${
                    (exponentialToDecimalWithoutComma(
                      coinBalance[tokenFirst?.id || 0]
                        ? coinBalance[tokenFirst?.id]?.balance
                        : '0',
                    )
                      ?.toString()
                      ?.toLowerCase()
                      ?.includes('nan')
                      ? 0
                      : exponentialToDecimalWithoutComma(
                          coinBalance[tokenFirst?.id || 0]
                            ? coinBalance[tokenFirst?.id]?.balance
                            : '0',
                        ) || '0') + ' '
                  }`}
                </Text>

                <TouchableOpacity
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: heightDimen(30),
                    marginLeft: '1%',
                  }}
                  onPress={() => {
                    if (coinBalance[tokenFirst?.id]?.balance) {
                      let splitArray = coinBalance[tokenFirst?.id]?.balance
                        ?.toString()
                        ?.split('.');
                      console.log(
                        'coinBalance[tokenFirst?.id]?.balance',
                        coinBalance[tokenFirst?.id]?.balance,
                        splitArray,
                      );
                      if (splitArray?.[1]?.length > 15) {
                        console.log(
                          coinBalance[tokenFirst?.id]?.balance?.toString()
                            ?.length,
                          '::::',
                          splitArray[0]?.length,
                        );
                        let num =
                          coinBalance[tokenFirst?.id]?.balance?.toString()
                            ?.length -
                          (splitArray[0]?.length + 1);
                        let coinBalanceToken = coinBalance[
                          tokenFirst?.id
                        ]?.balance?.slice(0, num);
                        console.log(
                          'coinBalance',
                          coinBalanceToken,
                          'splitArray',
                          splitArray[0],
                          'num',
                          num,
                        );
                        onPressPercentageButton(100, coinBalanceToken, true);
                      } else {
                        onPressPercentageButton(
                          100,
                          coinBalance[tokenFirst?.id]?.balance,
                          true,
                        );
                      }
                    }
                  }}>
                  <Text
                    style={[
                      styles.maxTextStyle,
                      {color: ThemeManager.colors.headingText},
                    ]}>
                    {LanguageManager.max}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => {
                if (timer.current) {
                  clearTimeout(timer.current);
                }
                if (global.disconnected) {
                  Singleton.showAlert(constants.NO_NETWORK);
                  return;
                }
                setActiveButton(0);
                let temp = tokenFirst;
                dispatch(saveSwapItem({}));
                setTokenFirst(tokenSecond);
                setTokenSecond(temp);
                getUserBal(
                  tokenSecond,
                  userAddress,
                  setUserBal,
                  setCoinBalance,
                  setLoading,
                  coinBalance,
                );
                setTokenOneAmount('');
                setTokenTwoAmount('');
                setInsufficientBalance(false);
                setIsPairSupported(true);
                setTransferFailed(false);
                setIsOverFlow(false);
                setUserApproval(true);
                setIsInsufficientOutputAmount(false);
                setIsInSufficientLiquidity(false);
              }}
              style={[styles.swapStyle, {borderColor: ThemeManager.colors.bg}]}>
              <FastImage
                style={{
                  alignSelf: 'center',
                  height: areaDimen(20),
                  width: areaDimen(20),
                }}
                source={Images.iconColoredRefresh}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <View
              style={{
                borderRadius: areaDimen(25),
                height: heightDimen(180),
                marginTop: heightDimen(-19),
                marginHorizontal: widthDimen(23),
                flexDirection: 'column',
                backgroundColor: ThemeManager.colors.swapBg,
              }}>
              <View
                style={{
                  height: heightDimen(50),
                  marginTop: heightDimen(14),
                  marginHorizontal: widthDimen(16),
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}>
                <SelectDropdown
                  data={coinList?.filter(coin => coin?.id != tokenFirst?.id)}
                  ref={dropDownRefTo}
                  disabled={true}
                  buttonStyle={{
                    backgroundColor: 'transparent',
                    width: '100%',
                    paddingHorizontal: 0,
                  }}
                  buttonTextStyle={{
                    fontFamily: Fonts.regular,
                    fontSize: areaDimen(16),
                    color: ThemeManager.colors.textColor,
                    textAlign: 'left',
                  }}
                  dropdownStyle={{
                    ...styles.dropDownStyle,
                    backgroundColor: ThemeManager.colors.mnemonicsView,
                  }}
                  rowTextStyle={{
                    fontFamily: Fonts.regular,
                    fontSize: areaDimen(14),
                    color: ThemeManager.colors.textColor,
                    textAlign: 'left',
                    lineHeight: areaDimen(18),
                  }}
                  rowStyle={{
                    borderBottomWidth: 1,
                    borderBottomColor: ThemeManager.colors.viewBorderColor,
                    paddingLeft: widthDimen(20),
                    backgroundColor: ThemeManager.colors.mnemonicsView,
                  }}
                  defaultButtonText={tokenSecond?.coin_symbol}
                  disableAutoScroll
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem.coin_symbol;
                  }}
                  rowTextForSelection={(item, index) => {
                    return item.coin_symbol;
                  }}
                  renderCustomizedButtonChild={(item, index) => {
                    return (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          overflow: 'hidden',
                        }}>
                        {tokenSecond?.coin_image != '' ? (
                          <FastImage
                            source={{uri: tokenSecond?.coin_image}}
                            style={{
                              width: areaDimen(34),
                              height: areaDimen(34),
                              borderRadius: areaDimen(40),
                              resizeMode: 'contain',
                            }}
                          />
                        ) : (
                          <View style={styles.coinSymbol}>
                            <Text style={styles.coinSymbolText}>
                              {tokenSecond?.coin_symbol
                                .toUpperCase()
                                ?.charAt(0)}
                            </Text>
                          </View>
                        )}
                        <View
                          style={{
                            height: heightDimen(50),
                            width: '100%',
                            flexDirection: 'column',
                          }}>
                          <TouchableOpacity
                            style={{
                              width: '70%',
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}
                            onPress={() => {
                              setShowTokenTwoList(true);
                            }}>
                            <Text
                              style={{
                                fontFamily: Fonts.semibold,
                                fontSize: areaDimen(16),
                                color: ThemeManager.colors.textColor,
                                paddingStart: widthDimen(12),
                                maxWidth: '80%',
                                lineHeight: areaDimen(22),
                              }}
                              numberOfLines={1}
                              ellipsizeMode="tail">
                              {tokenSecond?.coin_symbol.toUpperCase()}
                            </Text>
                            <FastImage
                              source={images.arrow_filled}
                              style={{
                                width: widthDimen(12),
                                height: heightDimen(6),
                                marginLeft: widthDimen(10),
                              }}
                              resizeMode="contain"
                              tintColor={ThemeManager.colors.textColor}
                            />
                          </TouchableOpacity>
                          <Text
                            style={{
                              fontFamily: Fonts.medium,
                              fontSize: areaDimen(14),
                              color: ThemeManager.colors.lightTextColor,
                              paddingStart: widthDimen(12),
                              marginTop: 2,
                              maxWidth: '80%',
                              lineHeight: areaDimen(20),
                            }}
                            numberOfLines={1}
                            ellipsizeMode="tail">
                            {`1 ${
                              tokenSecond?.coin_symbol.toUpperCase()
                                ? tokenSecond?.coin_symbol.toUpperCase()
                                : ''
                            } = ${Singleton.getInstance().CurrencySymbol}${
                              tokenSecond?.fiat_price == null
                                ? 0.0
                                : CommaSeprator3(
                                    exponentialToDecimalWithoutComma(
                                      isNaN(tokenSecond?.fiat_price)
                                        ? 0
                                        : tokenSecond?.fiat_price,
                                    ),
                                    tokenSecond?.fiat_price_decimal || 2,
                                  )
                            }`}
                            {console.log(
                              'tokenSecond?.fiat_price_decimal:::::::',
                              tokenSecond?.fiat_price_decimal,
                              'tokenSecond?.fiat_price:::::',
                              tokenSecond,
                            )}
                          </Text>
                        </View>
                      </View>
                    );
                  }}
                  renderCustomizedRowChild={(item, index) => {
                    return (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        {item ? (
                          <FastImage
                            source={{uri: item?.coin_image}}
                            style={{
                              borderRadius: 14,
                              width: areaDimen(25),
                              height: areaDimen(25),
                              resizeMode: 'contain',
                            }}
                          />
                        ) : (
                          <FastImage
                            source={{
                              uri: coinList[0].coin_image,
                            }}
                            style={{
                              borderRadius: 14,
                              width: areaDimen(25),
                              height: areaDimen(25),
                              resizeMode: 'contain',
                            }}
                          />
                        )}

                        <Text
                          style={{
                            fontFamily: Fonts.regular,
                            fontSize: areaDimen(15),
                            color: ThemeManager.colors.textColor,
                            paddingStart: widthDimen(15),
                          }}>
                          {item?.coin_symbol?.toUpperCase()}
                        </Text>
                        <Text
                          style={{
                            fontFamily: Fonts.medium,
                            fontSize: areaDimen(11),
                            color: Colors.grayTextColor,
                            paddingStart: widthDimen(12),
                            marginTop: 2,
                            maxWidth: '80%',
                            lineHeight: areaDimen(18),
                          }}
                          numberOfLines={1}
                          ellipsizeMode="tail">
                          {item?.coin_family == '6' ? 'BNB' : 'ETH'}
                        </Text>
                      </View>
                    );
                  }}
                />
                <Text
                  style={[
                    styles.txtSending,
                    {color: ThemeManager.colors.textColor},
                  ]}>
                  {'To'}
                </Text>
              </View>
              <View
                style={{height: heightDimen(52), marginTop: heightDimen(10)}}>
                <TextInput
                  editable={fullList?.length == 0 ? false : true}
                  value={
                    tokenTwoAmount
                      ? exponentialToDecimalWithoutComma(tokenTwoAmount)
                      : ''
                  }
                  maxLength={20}
                  keyboardType={'numeric'}
                  placeholder={'0.0'}
                  placeholderTextColor={ThemeManager.colors.lightTextColor}
                  style={{
                    width: '92%',
                    alignSelf: 'center',
                    justifyContent: 'center',
                    color: ThemeManager.colors.textColor,
                    fontFamily: Fonts.semibold,
                    fontSize: areaDimen(25),
                    lineHeight:
                      Platform.OS == 'ios' ? areaDimen(30) : areaDimen(25),
                  }}
                  onChangeText={value => {
                    setActiveButton(0);
                    var expression = new RegExp('^\\d*\\.?\\d{0,' + '}$');
                    if (expression.test(value)) {
                      if (
                        value?.includes('.') &&
                        value?.split('.')[1]?.length > tokenSecond.decimals
                      ) {
                        return;
                      }
                      setSelectedInput(SELECTED_INPUT.secondInput);
                      setTokenTwoAmount(value);
                      if (timer.current) {
                        clearTimeout(timer.current);
                      }
                      timer.current = setTimeout(() => {
                        if (coinBalance[tokenFirst?.id]?.balance > 0) {
                        } else {
                          setInsufficientBalance(true);
                        }
                        typeGlobal = SELECTED_INPUT.secondInput;
                        onChangeText({
                          tokenFirst,
                          tokenSecond,
                          type: SELECTED_INPUT.secondInput,
                          value,
                          isError: false,
                        });
                      }, 1000);
                    }
                  }}
                />
              </View>

              <Text
                numberOfLines={1}
                style={[
                  styles.convertedBalanceLabelStyle,
                  {
                    color: ThemeManager.colors.lightTextColor,
                    textAlign: 'right',
                  },
                ]}>
                {Singleton.getInstance().CurrencySymbol +
                  convertToInternationalCurrencySystem(
                    exponentialToDecimalWithoutComma(
                      isNaN(tokenTwoAmount * tokenSecond?.fiat_price)
                        ? 0
                        : tokenTwoAmount * tokenSecond?.fiat_price,
                    ),
                  )}
              </Text>

              <View style={styles.amountView}>
                <Text
                  style={[
                    styles.balanceLabelStyle,
                    {color: ThemeManager.colors.lightTextColor},
                  ]}>
                  {'Balance' + ': '}
                </Text>
                <Text
                  style={[
                    styles.balanceValueStyle,
                    {color: ThemeManager.colors.lightTextColor},
                  ]}>
                  {console.log(
                    'Start Second Balance-----------4==',
                    coinBalanceSecond,
                  )}
                  {`${
                    exponentialToDecimalWithoutComma(
                      coinBalanceSecond[tokenSecond?.id || 0]
                        ? coinBalanceSecond[tokenSecond?.id]?.balance
                        : '0',
                    )
                      ?.toString()
                      ?.toLowerCase()
                      ?.includes('nan')
                      ? 0
                      : exponentialToDecimalWithoutComma(
                          coinBalanceSecond[tokenSecond?.id || 0]
                            ? coinBalanceSecond[tokenSecond?.id]?.balance
                            : '0',
                        ) || '0'
                  }`}
                </Text>
              </View>
            </View>
          </ScrollView>
          <BasicButton
            onPress={() => {
              if (!isPairsupported) {
                setLoading(false);
                Singleton.showAlert('Pair not supported at the moment.');
              } else if (isInSufficientLiquidity) {
                setLoading(false);
                Singleton.showAlert('INSUFFICIENT_LIQUIDITY');
              } else if (isInsufficientOutputAmount) {
                setLoading(false);
                Singleton.showAlert(
                  'Insufficient output amount. Try increasing your slippage.',
                );
              } else if (!isInsufficientBalance) {
                setLoading(false);
                checkForSwapTokenCall();
              }
            }}
            btnStyle={styles.btnStyle}
            customGradient={styles.customGrad}
            text={
              isInSufficientLiquidity
                ? 'INSUFFICIENT_LIQUIDITY'
                : isInsufficientBalance
                ? isInsufficientOutputAmount
                  ? 'INSUFFICIENT OUTPUT AMOUNT'
                  : 'Insufficient Balance'
                : !isPairsupported
                ? 'PAIR NOT SUPPORTED'
                : isApproved
                ? 'Swap'
                : 'Approval'
            }
          />
        </>
      )}
      {swapModal && (
        <ModalSwap
          toCoinName={tokenSecond.coin_name}
          toCoinSymbol={tokenSecond.coin_symbol}
          fromCoinName={tokenFirst.coin_name}
          fromCoinSymbol={tokenFirst.coin_symbol}
          toValue={tokenTwoAmount}
          fromValue={tokenOneAmount}
          address={Singleton.getInstance().defaultEthAddress}
          symbol={
            tokenFirst?.coin_family == 1
              ? 'ETH'
              : tokenFirst?.coin_family == 4
              ? 'STC'
              : 'BNB'
          }
          txnFee={(gasPrice * gasEstimate * GAS_FEE_MULTIPLIER).toFixed(6)}
          onPress={() => {
            setSwapModal(false);
            if (global.disconnected) {
              Singleton.showAlert(constants.NO_NETWORK);
              return;
            } else {
              setLoading(true);
              swap();
            }
          }}
          toCoin={tokenSecond}
          fromCoin={tokenFirst}
          onCancel={() => {
            setSwapModal(false);
          }}
        />
      )}
      <Modal
        visible={showTokenOneList}
        animationType="slide"
        transparent={true}
        statusBarTranslucent
        style={{flex: 1, justifyContent: 'flex-end'}}
        onRequestClose={onCloseAllList}>
        <ListModal
          isAddCustom
          isSearch
          list={fullList}
          onClose={onCloseAllList}
          onPressItem={onPressItem1}
          changeText={onChangeTextTop}
          searchText={searchText}
          onScroll={isCloseToBottomAllList}
          onPressAddCustomToken={onPressAddCustomToken1}
        />
      </Modal>
      <Modal
        visible={showTokenTwoList}
        animationType="slide"
        transparent={true}
        statusBarTranslucent
        style={{flex: 1, justifyContent: 'flex-end'}}
        onRequestClose={onCloseSelectedList}>
        <ListModal
          isAddCustom
          isSearch
          list={coinList}
          onClose={onCloseSelectedList}
          onPressItem={onPressItem2}
          changeText={onChangeTextBottom}
          searchText={searchText}
          onScroll={isCloseToBottomSelectedList}
          onPressAddCustomToken={onPressAddCustomToken2}
        />
      </Modal>
      {isLoading && (
        <Loader
          smallLoader={false}
          customheight={{height: Dimensions.get('window').height - 160}}
        />
      )}
    </Wrap>
  );
};

export default SwapSelected;
