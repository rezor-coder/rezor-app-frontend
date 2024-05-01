/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  BackHandler,
  Image,
  Linking,
  ImageBackground,
  Dimensions,
  StyleSheet,
  FlatList,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { ThemeManager, LanguageManager } from '../../../../ThemeManager';
import {
  SimpleHeader,
  Wrap,
  MainHeader,
  SimpleHeaderNew,
  BasicButton,
} from '../../common';
import { Fonts, Images, Colors } from '../../../theme';
import LinearGradient from 'react-native-linear-gradient';
import Singleton from '../../../Singleton';
import SelectDropdown from 'react-native-select-dropdown';
import { getSwapList, getSwapBnbList } from '../../../Redux/Actions';
import { EventRegister } from 'react-native-event-listeners';
import { connect, useDispatch, useSelector } from 'react-redux';
import Loader from '../Loader/Loader';

import Web3 from 'web3';
import { BigNumber } from 'bignumber.js';
// let routerAddress = '0x0c17e776CD218252ADFca8D4e761D3fe757e9778'; // mainnet saitaswap router address
// let factoryAddress = '0x35113a300ca0D7621374890ABFEAC30E88f214b1';
// let WETH = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'; // Using Wrapped Ether (WETH) contract address to get ETH equivalent balance



import TOKEN_ABI from '../../../../ABI/tokenContract.ABI.json';
import ROUTER_ABI from '../../../../ABI/router.ABI.json';
import SAITAROUTER_ABI from '../../../../ABI/saitaFactory.ABI.json';
import PAIR_ABI from '../../../../ABI/Pair.ABI.json';
import { ModalSwap } from '../../common/ModalSwap';
import * as constants from '../../../Constant';
import { BASE_URL } from '../../../Endpoints';
import { APIClient } from '../../../Api';
import { bigNumberSafeMath } from '../../../utils';

const GAS_FEE_MULTIPLIER = 0.000000000000000001;

var debounce = require('lodash.debounce');

const SELECTED_INPUT = { firstInput: 'firstInput', secondInput: 'secondInput' };
const GAS_BUFFER = 10000;

var slippage1 = 0;
var slippage2 = 0;
var amountOne = 0
var amountTwo = 0
var fetchedTokenOneValue = 0;
var fetchedTokenTwoValue = 0;

var fetchedTokenOneValueNew = 0;
var fetchedTokenTwoValueNew = 0;

var tokenOnevalue = 0;
var tokenTwovalue = 0;

// let routerAddress = constants.SwapRouterAddress; // mainnet saitaswap router address
// let factoryAddress = constants.SwapFactoryAddress;
// let WETH = constants.SwapWethAddress; // Using Wrapped Ether (WETH) contract address to get ETH equivalent balance
// const SLIPPERAGE_PERCENTAGE = 20; //in percent
// const TXN_COMPLETE_MAX_TIME = 20; //in minutes




const LiquiditySelected = props => {


 let routerAddress = Singleton.getInstance().SwapRouterAddress; // mainnet saitaswap router address
let factoryAddress = Singleton.getInstance().SwapFactoryAddress;
let WETH = Singleton.getInstance().SwapWethAddress; // Using Wrapped Ether (WETH) contract address to get ETH equivalent balance


  let SLIPPERAGE_PERCENTAGE = Singleton.getInstance().slipageTolerance; //in percent
  let TXN_COMPLETE_MAX_TIME = Singleton.getInstance().slipageTimeout; //in minutes

  const [percent, setPercent] = useState(0);
  const [percentSelected, setPercentSelected] = useState('25%');
  const [percentSelectedIndex, setPercentSelectedIndex] = useState(0);
  const [amount, setAmount] = useState('');

  const [fromCoin, setFromCoin] = useState(null);
  const [toCoin, setToCoin] = useState(null);
  const [privateKey, setPrivateKey] = useState('');
  const [coinList, setCoinList] = useState();
  const [tokenFirst, setTokenFirst] = useState();
  const [tokenSecond, setTokenSecond] = useState();
  let userAddress = Singleton.getInstance().defaultEthAddress;
  const [isLoading, setLoading] = useState(false);
  const [userBal, setUserBal] = useState(0);
  const [userBalTo, setUserBalTo] = useState(0);
  const [gasPrice, setGasPrice] = useState(0);

  const [tokenOneAmount, setTokenOneAmount] = useState();
  const [tokenTwoAmount, setTokenTwoAmount] = useState();
  const [ratiofetched, setRatio] = useState(0);
  const [ratiofetchedTwo, setRatioTwo] = useState(0);
  const [selectedInput, setSelectedInput] = useState(SELECTED_INPUT.firstInput);
  const [isInsufficientBalance, setInsufficientBalance] = useState(false);
  const [isApproved, setUserApproval] = useState(true);
  const [gasEstimate, setGasEstimate] = useState(0);
  const [transactionFee, setTransactionFee] = useState('0.00');
  const [rawTxnObj, setRawTxnObj] = useState({});
  const [swapModal, setSwapModal] = useState(false);
  const [allownceTxnObj, setAllowancetxnObj] = useState({});


  const [pairPool, setPairPool] = useState(0);
  const [pairPoolOne, setPairPoolOne] = useState(0);
  const [pairPoolTwo, setPairPoolTwo] = useState(0);
  const [indexPosition, setindexPosition] = useState(0);



  // const [isFirstTimeSupply, setIsFirstTimeSupply] = useState(false);


  const [isClickable, setisClickable] = useState(true);
  const [isPairVaild, setPairVaild] = useState(false);

  // var isFirstTimeSupply = "yes"

  var coinListFilter = [];

  const dispatch = useDispatch();
  // const cryptList = [
  //   { item: 'ETH' },
  //   { item: 'BTC' },
  //   { item: 'USDT' },
  //   { item: 'BNB' },
  // ];

  const percentSelection = [
    { days: '25%', id: 0, selected: true },
    { days: '50%', id: 1, selected: false },
    { days: '75%', id: 2, selected: false },
    { days: '100%', id: 3, selected: false },
  ];

  const countries = ['Egypt', 'Canada', 'Australia', 'Ireland'];

  const handler = useCallback(
    debounce(
      (tokenFirst, tokenSecond, type, value) =>
        onChangeText(tokenFirst, tokenSecond, type, value),
      1000,
    ),
    [],
  );

  useEffect(() => {
    let eventListner = EventRegister.addEventListener('swapData', data => {
      //console.warn('MM','======= SLIPPERAGE_PERCENTAGE', data);
      if (data != "") {
      SLIPPERAGE_PERCENTAGE = data?.tolerance || Singleton.getInstance().slipageTolerance;
      TXN_COMPLETE_MAX_TIME = data?.timeout || Singleton.getInstance().slipageTimeout;
      }
      setindexPosition(3445);
    });


    routerAddress = Singleton.getInstance().SwapRouterAddress; // mainnet saitaswap router address
    factoryAddress = Singleton.getInstance().SwapFactoryAddress;
    WETH = Singleton.getInstance().SwapWethAddress;

    //console.warn('MM',">>>>>> router data", routerAddress, factoryAddress, WETH);
    //console.warn('MM',">>>>>> router data 11", constants.SwapRouterAddress, constants.SwapFactoryAddress, constants.SwapWethAddress);

    // setFromCoin(cryptList[0]);
    // setToCoin(cryptList[1]);
    // userAddress = Singleton.getInstance().defaultEthAddress;
    // routerAddress = '0x0c17e776CD218252ADFca8D4e761D3fe757e9778';

    Singleton.getInstance()
      .newGetData(`${Singleton.getInstance().defaultEthAddress}_pk`)
      .then(ethPvtKey => {
        //console.warn('MM','ethPvtKey--------', ethPvtKey);
        setPrivateKey(ethPvtKey);
      });
    getGasPrice();
    getSwapListApi();

    return () => {
      EventRegister.removeEventListener(eventListner);
    };
  }, []);

  const getSwapListApi = () => {
    setLoading(true);
    let access_token = Singleton.getInstance().access_token;
    dispatch(getSwapList({ access_token }))
      .then(res => {
        //console.warn('MM','-------------res----ethh lqdty', res.data);
        if (res.status) {
          setCoinList(res.data);
          setTokenFirst(res.data[0]);
          setTokenSecond(res.data[1]);
          coinListFilter = res.data;
          getUserBal(res.data[0]);
          getUserBalTo(res.data[1]);

        } else {
          Singleton.showAlert(res.message)
        }
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        //console.warn('MM','err price:::::::::', err);
      });
  };
  const getGasPrice = () => {
    getWeb3Object()
      .eth.getGasPrice()
      .then(gas => {
        //console.warn('MM','-----------------gasPrice-----------', gas, 'ethPvtKey::::', privateKey,);
        setGasPrice(gas);
      });
  };
  const getWeb3Object = () => {
    //let network = new Web3( 'https://mainnet.infura.io/v3/39f09bbfb5754cd480eee6c763227883',);
    let network = new Web3(Singleton.getInstance().ethLink);
    //constants.mainnetInfuraLink
    return network;
  };
  const getUserBal = async tokenFirst => {
    try {
      //console.warn('MM','-------------tokenFirst-------------', tokenFirst);
      //console.warn('MM','===>>', tokenFirst);
      const web3Object = getWeb3Object();
      if (tokenFirst?.is_token == 0) {
        //console.warn('MM','===>>0000');
        let ethBal = await web3Object.eth.getBalance(userAddress);
        //console.warn('MM','user ethBal ===>>', ethBal / 10 ** tokenFirst.decimals, 'in wei ', ethBal,);
        const value = ethBal / 10 ** tokenFirst.decimals;
        setUserBal(Singleton.getInstance().toFixed(value, 8));
        setLoading(false);
        return ethBal;
      }
      //console.warn('MM','===>>1111');
      let userBal = await getTokenBalance(tokenFirst.token_address, userAddress,);
      //console.warn('MM','***********************', Singleton.getInstance().exponentialToDecimal(userBal),);
      //console.warn('MM','***********************', userBal);
      let ethBal = await web3Object.eth.getBalance(userAddress);
      setUserBal(+Singleton.getInstance().toFixed(userBal / 10 ** tokenFirst.decimals, 8,),);
      setLoading(false);
      //console.warn('MM','user ethBal ===>>tok', userBal / 10 ** tokenFirst.decimals, 'in wei ', userBal,);

      return +userBal;
    } catch (error) {
      setLoading(false);
    }
  };

  const getUserBalTo = async tokenSecond => {
    try {
      //console.warn('MM','-------------tokenSecond-------------', tokenSecond);
      //console.warn('MM','===>>', tokenSecond);
      const web3Object = getWeb3Object();
      if (tokenSecond?.is_token == 0) {
        //console.warn('MM','===>>0000');
        let ethBal = await web3Object.eth.getBalance(userAddress);
        ////console.log(
        // 'user ethBal ===>>',
        //   ethBal / 10 ** tokenSecond.decimals,
        //   'in wei ',
        //   ethBal,
        // );
        const value = ethBal / 10 ** tokenSecond.decimals;
        setUserBalTo(Singleton.getInstance().toFixed(value, 8));

        setLoading(false);
        return ethBal;
      }
      //console.warn('MM','===>>1111');
      let userBal = await getTokenBalance(
        tokenSecond.token_address,
        userAddress,
      );
      //console.warn('MM','***********************', Singleton.getInstance().exponentialToDecimal(userBal),);
      //console.warn('MM','***********************', userBal);
      let ethBal = await web3Object.eth.getBalance(userAddress);
      setUserBalTo(
        +Singleton.getInstance().toFixed(
          userBal / 10 ** tokenSecond.decimals,
          8,
        ),
      );
      ;
      ////console.log(
      // 'user ethBal ===>>tok',
      //   userBal / 10 ** tokenSecond.decimals,
      //   'in wei ',
      //   userBal,
      //       );
      setLoading(false);
      return +userBal;
    } catch (error) {
      setLoading(false);
    }
  };

  const getTokenBalance = async (tokenAddress, address) => {
    //console.warn('MM','chk tokenAddresss::::::', tokenAddress, address);
    try {
      const contract = await getContractObject(tokenAddress);
      // //console.warn('MM','chk contract::::::', contract);
      let result = await contract.methods.balanceOf(address).call();
      //console.warn('MM','chk result::::::', result);
      return BigNumber(result);
    } catch (error) {
      //console.warn('MM','Error ==>> :', error);
      return error;
    }
  };

  const getContractObject = async (tokenAddress, abi = TOKEN_ABI) => {
    setLoading(true);

    //console.warn('MM','tokenAddress:::getContractObject', tokenAddress);
    try {
      const web3Object = getWeb3Object();
      let tokenContractObject = await new web3Object.eth.Contract(abi, tokenAddress,);

      return tokenContractObject;
    } catch (e) {
      console.error('error ===>>', e);
    }
  };

  const checkCoinPair = async (tokenFirst, tokenSecond) => {
    //console.warn('MM',">>>>> result getPair checkCoinPair 22>> ", tokenFirst.token_address, tokenSecond.token_address, factoryAddress);
    if (tokenFirst.token_address == tokenSecond.token_address) {
      return
    }
    let routerContractObject = await getContractObject(factoryAddress, SAITAROUTER_ABI,);
    let result = await routerContractObject.methods
      .getPair(tokenFirst.token_address, tokenSecond.token_address)
      .call();
    if (result == "0x0000000000000000000000000000000000000000") {
      setLoading(false);
      Singleton.showAlert("You are the first liquidity provider.The ratio of tokens you add will set the price of this pool.Once you are happy with the rate click supply to review.")

    } else {
      setLoading(false);
    }
  }

  const getCoinPair = async (tokenFirst, tokenSecond, value, type, path,) => {

    if (tokenFirst.token_address == tokenSecond.token_address) {
      Singleton.showAlert("Same Tokens not allowed. ")
      setisClickable(false)
      return
    }
    setisClickable(true)
    //console.warn('MM',">>>>>factoryAddress ", factoryAddress);
    let routerContractObject = await getContractObject(factoryAddress, SAITAROUTER_ABI,);
    let result = await routerContractObject.methods
      .getPair(tokenFirst.token_address, tokenSecond.token_address)
      .call();
    //console.warn('MM',">>>>> result getPair >> afetrr ");
    if (result == "0x0000000000000000000000000000000000000000") {
      setPairPool(0)
      setPairPoolOne(0)
      setPairPoolTwo(0)
      setRatio(0)
      return undefined
    }
    const contract = await getContractObject(result);
    let pairBalance = await contract.methods.balanceOf(userAddress).call();
    let totalSupply = await contract.methods.totalSupply().call();

    let valuePair = Singleton.getInstance().toFixed((pairBalance / 10 ** 18), 8)
    setPairPool(valuePair)
    //console.warn('MM','pairBalance ===>>', pairBalance, totalSupply, valuePair);

    let PairrouterContractObject = await getContractObject(result, PAIR_ABI,);
    let reserve = await PairrouterContractObject.methods
      .getReserves()
      .call();
    let reserve0 = reserve._reserve0;
    let reserve1 = reserve._reserve1;
    //console.warn('MM',">>>>> result getReserves >> ", reserve, reserve._reserve0, reserve._reserve1);
    let Token0 = await PairrouterContractObject.methods
      .token0()
      .call();
    let Token1 = await PairrouterContractObject.methods
      .token1()
      .call();
    //console.warn('MM',">>>>> result Token0 >> ", Token0, Token1);
    //console.warn('MM',">>>>> token0 token1 Reserves >> ", reserve._reserve0, reserve._reserve1, Token0, Token1);
    //console.warn('MM',">>>>> result coinList >> ", coinListFilter);
    const Token0AddressObject = coinListFilter.find(o => o.token_address.toLowerCase() == Token0.toLowerCase())
    //console.warn('MM',">>>>> result Token0AddressObject >> ", Token0AddressObject);
    let decimal0 = Token0AddressObject.decimals;
    //console.warn('MM',">>>>> token0 token1 Reserves >>1111 ")
    const Token1AddressObject = coinListFilter.find(o => o.token_address.toLowerCase() == Token1.toLowerCase())
    let decimal1 = Token1AddressObject.decimals;
    let value0 = reserve0 / (10 ** decimal0);
    let value1 = reserve1 / (10 ** decimal1);

    let firstTokenSupply = (value0 / totalSupply) * pairBalance
    let secondTokenSupply = (value1 / totalSupply) * pairBalance
    setPairPoolOne(Singleton.getInstance().toFixed(firstTokenSupply, 8))
    setPairPoolTwo(Singleton.getInstance().toFixed(secondTokenSupply, 8))

    //console.warn('MM',">>>>> value0 >> ", value0, value1);
    //console.warn('MM',">>>>> token0 token1 Reserves >>2222 ")
    if (tokenFirst.coin_symbol.toLowerCase() == "eth" || tokenSecond.coin_symbol.toLowerCase() == "eth") {
      try {
        let ratio;
        //console.warn('MM',">>>>> result00 >> value0 ", value0, value1, selectedInput, type);
        if (type == SELECTED_INPUT.firstInput) {
          //console.warn('MM',">>>>> selectedInput >> 11 ", selectedInput);
          if (tokenFirst.token_address.toLowerCase() == Token0.toLowerCase()) {
            ratio = value1 / value0;
          } else {
            ratio = value0 / value1;
          }
        }
        else {
          //console.warn('MM',">>>>> selectedInput >> 22 ", selectedInput);
          if (tokenSecond.token_address.toLowerCase() == Token0.toLowerCase()) {
            ratio = value1 / value0;
          } else {
            ratio = value0 / value1;
          }
        }
        setLoading(false);
        if (type == SELECTED_INPUT.firstInput) {
          slippage1 = value * (10 ** tokenFirst.decimals)
          slippage2 = (ratio * value) * (10 ** tokenSecond.decimals)
        } else {
          slippage1 = ratio * value * (10 ** tokenFirst.decimals)
          slippage2 = value * (10 ** tokenSecond.decimals)
        }
        //console.warn('MM',"eeeeeeee   ==== ratio ", ratio);
        return ratio
      } catch (err) {
        //console.warn('MM',"eeeeeeee   ==== >>>> " + err.message);
        setLoading(false);
      }
    } else {
      //console.warn('MM',">>>>> result getPair inside token>> ");
      setLoading(true);
      try {
        //console.warn('MM',">>>>> result getPair >>11 ", result);
        let ratio;
        if (selectedInput == SELECTED_INPUT.firstInput) {
          if (tokenFirst.token_address.toLowerCase() == Token0.toLowerCase()) {
            ratio = value1 / value0;
          } else {
            ratio = value0 / value1;
          }
        }
        else {
          if (tokenSecond.token_address.toLowerCase() == Token0.toLowerCase()) {
            ratio = value1 / value0;
          } else {
            ratio = value0 / value1;
          }
        }
        if (type == SELECTED_INPUT.firstInput) {
          slippage1 = value * (10 ** tokenFirst.decimals)
          slippage2 = (ratio * value) * (10 ** tokenSecond.decimals)
        } else {
          slippage1 = ratio * value * (10 ** tokenFirst.decimals)
          slippage2 = value * (10 ** tokenSecond.decimals)
        }
        setLoading(false);
        return ratio
      } catch (err) {
        //console.warn('MM',"eeeeeeee   ==== >>>> " + err.message);
        setLoading(false);
      }
    }



  }
  const checkContractApproval = async (path, result) => {
    //console.warn('MM','checkContractApproval****', path, result);
    let tokenContractObject = await getContractObject(path);
    let userTokenBal = await tokenContractObject.methods
      .balanceOf(userAddress)
      .call();
    //console.warn('MM','userTokenBal ==>>>', userTokenBal);
    let allowance = await tokenContractObject.methods
      .allowance(userAddress, routerAddress)
      .call();
    //console.warn('MM','allowance ==>>>', allowance);
    if (BigNumber(allowance).toFixed(0) <= parseInt(result[0])) {
      //console.warn('MM','allowance false==>>>');
      setUserApproval(false);
      return false;
    } else {
      //console.warn('MM','allowance treu==>>>');
      setUserApproval(true);
      return true;
    }
  };

  const newPairAddress = (value, tokenFirst, tokenSecond, type, gasPrice) => {
    setLoading(false)

    return new Promise(async (resolve, reject) => {
      let liquidityTransactionNew;
      let ethValue = 0
      let resultnew = 0
      //console.warn('MM','-----params------- resultnew vv', tokenFirst, tokenSecond, tokenOnevalue, tokenTwovalue)
      let value0 = tokenOnevalue / (10 ** tokenFirst.decimals);
      let value1 = tokenTwovalue / (10 ** tokenSecond.decimals);
      //console.warn('MM','-----params------- resultnew11', value0, tokenFirst.decimals)
      //console.warn('MM','-----params------- resultnew22', value1, tokenSecond.decimals)

      resultnew = value0 / value1

      //console.warn('MM','-----params------- resultnew', resultnew)
      let deadline = Math.floor(new Date().getTime() / 1000);
      deadline = deadline + TXN_COMPLETE_MAX_TIME * 60;
      const amountAMin = 0;
      const amountBMin = 0;
      //console.warn('MM','-----params------- SLIPPERAGE_PERCENTAGE', SLIPPERAGE_PERCENTAGE, TXN_COMPLETE_MAX_TIME, tokenFirst.coin_symbol, SELECTED_INPUT.firstInput, type)
      if (tokenFirst.coin_symbol.toLowerCase() == "eth") {
        ethValue = type == SELECTED_INPUT.firstInput ? value * (10 ** 18) : (resultnew * value) * (10 ** 18)
        //console.warn('MM','-----params------- eth11', ethValue)
      } else if (tokenSecond.coin_symbol.toLowerCase() == "eth") {
        ethValue = type == SELECTED_INPUT.firstInput ? (resultnew * value) * (10 ** 18) : value * (10 ** 18)
        //console.warn('MM','-----params------- eth22', ethValue)
      } else {
        //console.warn('MM','-----params------- eth33333')
        ethValue = "0x0"
      }
      //console.warn('MM','-----params------- after')
      let tokenvalueDesired;
      let TokenAddress
      let TokenDecimal
      if (tokenFirst.coin_symbol.toLowerCase() == 'eth') {
        TokenAddress = tokenSecond.token_address
        TokenDecimal = tokenSecond.decimals

        tokenvalueDesired = (tokenTwovalue * (10 ** TokenDecimal)).toFixed(0)

        //console.warn('MM','tokenvalueDesired111', tokenvalueDesired, tokenFirst, tokenSecond)
      }
      else {
        TokenAddress = tokenFirst.token_address
        TokenDecimal = tokenFirst.decimals

        tokenvalueDesired = (tokenOnevalue * (10 ** TokenDecimal)).toFixed(0)
        //console.warn('MM','tokenvalueDesired22', tokenvalueDesired)
      }

      const routerContractObject = await getContractObject(routerAddress, ROUTER_ABI,);
      if (tokenFirst.coin_symbol.toLowerCase() == 'eth' || tokenSecond.coin_symbol.toLowerCase() == "eth") {
        //console.warn('MM','-----params------- eth new', TokenAddress, tokenvalueDesired,
        // amountBMin.toString(), amountAMin.toString(),
        //   userAddress, deadline, "ethValue " + ethValue, tokenFirst.coin_symbol, tokenSecond.coin_symbol);

        liquidityTransactionNew = await routerContractObject.methods.addLiquidityETH
          (TokenAddress, tokenvalueDesired, amountBMin.toString(), amountAMin.toString(),
            userAddress, deadline);
        //console.warn('MM','-----userAddress-------', userAddress, ethValue);
        liquidityTransactionNew
          .estimateGas({ from: userAddress, value: ethValue.toFixed(0) })
          .then(gasEstimate => {
            //console.warn('MM','-----estimateGas-------', gasEstimate, gasPrice, GAS_FEE_MULTIPLIER);
            setInsufficientBalance(false);
            setGasEstimate(gasEstimate + GAS_BUFFER);
            setLoading(false);
            setTransactionFee(Singleton.getInstance().toFixed(gasEstimate * gasPrice * GAS_FEE_MULTIPLIER, 6,),);
            //console.warn('MM','Singleton.getInstance().toFixed(((gasEstimate) * gasPrice * GAS_FEE_MULTIPLIER:::11', gasEstimate * gasPrice * GAS_FEE_MULTIPLIER,);
            setRawTxnObj({ type: tokenFirst.coin_symbol.toLowerCase(), data: liquidityTransactionNew.encodeABI(), value: ethValue.toString(), });

            return resolve(gasEstimate);
          })
          .catch(err => {
            //console.warn('MM','>>>>>>111' + err.message);
            setLoading(false);
            if (err.message.includes('insufficient funds')) {
              setInsufficientBalance(true);
            }
          });
      } else {
        setLoading(false);



        liquidityTransactionNew = await routerContractObject.methods.addLiquidity(tokenFirst.token_address,
          tokenSecond.token_address,
          BigNumber(tokenOnevalue * (10 ** tokenFirst.decimals)).toFixed(0), BigNumber(tokenTwovalue * (10 ** tokenSecond.decimals)).toFixed(0), amountAMin, amountBMin,
          userAddress, deadline);


        //console.warn('MM','-----routerContractObject------- after neww', userAddress, ethValue.toString(),);
        //console.warn('MM','-----params------- token nn',
        // tokenFirst.token_address, tokenSecond.token_address, BigNumber(tokenOnevalue * (10 ** tokenFirst.decimals))
        //   , BigNumber(tokenTwovalue * (10 ** tokenSecond.decimals)), amountAMin, amountBMin,
        //   userAddress, deadline, ethValue.toString());



        liquidityTransactionNew.estimateGas({ from: userAddress, value: "0" })
          .then(gasEstimate => {
            //console.warn('MM','-----estimateGas-------', gasEstimate);
            setInsufficientBalance(false);
            setGasEstimate(gasEstimate + GAS_BUFFER);
            setLoading(false);
            setTransactionFee(Singleton.getInstance().toFixed(gasEstimate * gasPrice * GAS_FEE_MULTIPLIER, 6,),);
            //console.warn('MM','Singleton.getInstance().toFixed(((gasEstimate) * gasPrice * GAS_FEE_MULTIPLIER:::22', gasEstimate * gasPrice * GAS_FEE_MULTIPLIER,);
            setRawTxnObj({
              type: "token", data: liquidityTransactionNew.encodeABI(), value: ethValue.toString(),
              tokenContractAddress: tokenFirst.token_address,
            });

            //console.warn('MM','-----routerContractObject------- after111',);
            return resolve(gasEstimate);
          })
          .catch(err => {
            //console.warn('MM','ll???? err' + err.message);
            setLoading(false);
            if (err.message.includes('insufficient funds')) {
              setInsufficientBalance(true);
            }
          });
      }
    }).catch(err => {
      //console.warn('MM','ll???dddd? err' + err.message);
      setLoading(false);

    });;

  }
  const onChangeText = async (tokenFirst, tokenSecond, type, value) => {
    //console.warn('MM',">>>>111 fff", tokenFirst.coin_symbol.toLowerCase(), tokenSecond.coin_symbol.toLowerCase());

    // if ((tokenFirst.coin_symbol.toLowerCase() == "eth" || tokenFirst.coin_symbol.toLowerCase() == "saitama") ||
    //   (tokenSecond.coin_symbol.toLowerCase() == "eth" || tokenSecond.coin_symbol.toLowerCase() == "saitama")) {
    setLoading(true)
    setPairVaild(true)
    return new Promise((resolve, reject) => {
      setInsufficientBalance(false);
      getWeb3Object()
        .eth.getGasPrice()
        .then(async gasPrice => {
          const userBal = await getUserBal(tokenFirst);
          if (!value || parseFloat(value) <= 0) {
            //empty value
            //console.warn('MM',"-----params-------a in",);
            type == SELECTED_INPUT.firstInput
              ? setTokenTwoAmount('')
              : setTokenOneAmount('');
            setLoading(false);
            return;
          }
          const firstAddress =
            tokenFirst.coin_symbol.toLowerCase() == 'eth'
              ? WETH
              : tokenFirst.token_address;
          const secondAddress =
            tokenSecond.coin_symbol.toLowerCase() == 'eth'
              ? WETH
              : tokenSecond.token_address;
          let path = [firstAddress, secondAddress];
          //console.warn('MM','chk path::::::', path, gasPrice);
          //console.warn('MM','chk path:::::: tokenFirst', tokenFirst);
          //console.warn('MM','chk path:::::: tokenSecond', tokenSecond);

          const result = await getCoinPair(tokenFirst, tokenSecond, value, type, path);

          if (result == undefined) {
            let TokenAddressFirstSupply;
            let TokenAddressSecond;
            let TokenDecimalFirstSupply;

            setLoading(false);

            if (tokenFirst.coin_symbol.toLowerCase() == 'eth') {
              TokenAddressFirstSupply = tokenSecond.token_address
              TokenAddressSecond = tokenFirst
              TokenDecimalFirstSupply = tokenSecond.decimals
            } else {
              TokenAddressFirstSupply = tokenFirst.token_address
              TokenDecimalFirstSupply = tokenFirst.decimals
              TokenAddressSecond = tokenSecond

            }

            if (tokenOnevalue == undefined || tokenOnevalue == 0 || tokenTwovalue == undefined || tokenTwovalue == 0) {
              //console.warn('MM','isApproved ======>> noooooooo ', tokenOnevalue, tokenTwovalue);
              return
            }

            const isApproved = await checkContractApproval(TokenAddressFirstSupply, value,);
            //console.warn('MM','isApproved ======>> un ', isApproved, TokenAddressFirstSupply, value, path[0]);

            if (isApproved) {
              if (TokenAddressSecond.is_token == 1) {
                const isApproved_two = await checkContractApproval(TokenAddressSecond.token_address, value,);
                //console.warn('MM','isApprovedTwo ======>> ', isApproved_two, TokenAddressSecond.token_address, value,);
                if (!isApproved_two) {
                  //console.warn('MM','isApproved two ======>>  inside approved');
                  let tokenContractObject = await getContractObject(TokenAddressSecond.token_address);
                  setAllowancetxnObj({ tokenContractObject: tokenContractObject, path: TokenAddressSecond.token_address, });
                  tokenContractObject.methods
                    .approve(routerAddress, BigNumber(10 ** 25).toFixed(0))
                    .estimateGas({ from: userAddress })
                    .then(gasEstimate => {
                      setGasEstimate(gasEstimate + GAS_BUFFER);
                      setRawTxnObj({
                        tokenContractAddress: TokenAddressSecond.token_address,
                      });
                      setLoading(false);
                      setTransactionFee(Singleton.getInstance().toFixed(gasEstimate * gasPrice * GAS_FEE_MULTIPLIER, 6,),);
                      //console.warn('MM','Singleton.getInstance().toFixed(((gasEstimate) * gasPrice * GAS_FEE_MULTIPLIER::: unnn 33',
                      // gasEstimate * gasPrice * GAS_FEE_MULTIPLIER,
                      //     );
                      return resolve(gasEstimate);
                    })
                    .catch(err => {
                      //console.warn('MM','xx', err.message);
                      setLoading(false);
                      if (err.message.includes('insufficient funds')) {
                        setInsufficientBalance(true);
                      }
                    });
                  return;
                } else {
                  newPairAddress(value, tokenFirst, tokenSecond, type, gasPrice)
                }
              }
              else {
                newPairAddress(value, tokenFirst, tokenSecond, type, gasPrice)
              }

            }
            else {
              //console.warn('MM','isApproved ======>>  twoo', isApproved);
              if (!isApproved) {
                //console.warn('MM','isApproved ======>>  inside approved neww');
                let tokenContractObject = await getContractObject(path[0]);
                setAllowancetxnObj({ tokenContractObject: tokenContractObject, path: path[0], });
                tokenContractObject.methods
                  .approve(routerAddress, BigNumber(10 ** 25).toFixed(0))
                  .estimateGas({ from: userAddress })
                  .then(gasEstimate => {
                    setGasEstimate(gasEstimate + GAS_BUFFER);
                    setRawTxnObj({
                      tokenContractAddress: tokenFirst.token_address,
                    });
                    setLoading(false);
                    setTransactionFee(Singleton.getInstance().toFixed(gasEstimate * gasPrice * GAS_FEE_MULTIPLIER, 6,),);
                    ////console.log(
                    // 'Singleton.getInstance().toFixed(((gasEstimate) * gasPrice * GAS_FEE_MULTIPLIER::: 44',
                    //   gasEstimate * gasPrice * GAS_FEE_MULTIPLIER,
                    //               );
                    return resolve(gasEstimate);
                  })
                  .catch(err => {
                    //console.warn('MM','xx', err.message);
                    setLoading(false);
                    if (err.message.includes('insufficient funds')) {
                      setInsufficientBalance(true);
                    }
                  });
                return;
              } else {

                newPairAddress(value, tokenFirst, tokenSecond, type, gasPrice)

              }
            }
            return;
          }

          setRatio(result)
          setRatioTwo(Singleton.getInstance().exponentialToDecimal(1 / result))
          //console.warn('MM','-----params------- result >> result >>', result, Singleton.getInstance().exponentialToDecimal(1 / result));
          if (type == SELECTED_INPUT.firstInput) {
            //console.warn('MM','result >> type', type, value);
            setTokenTwoAmount(`${Singleton.getInstance().toFixed(result * value, 6)}`,);
            fetchedTokenTwoValue = Singleton.getInstance().toFixed(result * value, 6,);
            fetchedTokenOneValue = value;
            //console.warn('MM','result >> fetchedTokenTwoValue', fetchedTokenTwoValue, fetchedTokenOneValue, tokenTwoAmount,);
          } else {
            //console.warn('MM',"-----params-------a in11",);
            setTokenOneAmount(`${Singleton.getInstance().toFixed(result * value, 6,)}`,);
            fetchedTokenOneValue = Singleton.getInstance().toFixed(result * value, 6,)
            fetchedTokenTwoValue = value
            //console.warn('MM','result >> fetchedTokenOneValue', fetchedTokenOneValue, fetchedTokenTwoValue, tokenOneAmount);
          }
          const routerContractObject = await getContractObject(routerAddress, ROUTER_ABI,);

          const amountAMin = BigNumber(slippage1 - (slippage1 * SLIPPERAGE_PERCENTAGE) / 100,).toFixed(0);
          const amountBMin = BigNumber(slippage2 - (slippage2 * SLIPPERAGE_PERCENTAGE) / 100,).toFixed(0);
          //console.warn('MM','-----params------- SLIPPERAGE_PERCENTAGE ', SLIPPERAGE_PERCENTAGE, TXN_COMPLETE_MAX_TIME)

          //console.warn('MM','result >> amountAMin', amountAMin, amountBMin);
          //console.warn('MM','result >> amountAMin222', slippage1, slippage2);
          let deadline = Math.floor(new Date().getTime() / 1000);
          //console.warn('MM','chk deadline11', deadline);
          deadline = deadline + TXN_COMPLETE_MAX_TIME * 60;

          if (userBal < result[0]) {
            setInsufficientBalance(true);
          } else {
            setInsufficientBalance(false);
          }
          let valueget = result * value;
          //console.warn('MM','-----params------- valueget', valueget, value);
          let TokenAddress;
          let TokenDecimal;
          //  let tokenvalueDesired = (valueget * (10 ** TokenDecimal)).toFixed(0)
          let tokenvalueDesired;
          if (tokenFirst.coin_symbol.toLowerCase() == 'eth') {
            TokenAddress = tokenSecond.token_address
            TokenDecimal = tokenSecond.decimals
            if (type == SELECTED_INPUT.firstInput) {
              tokenvalueDesired = (valueget * (10 ** tokenSecond.decimals)).toFixed(0)
            } else {
              tokenvalueDesired = (valueget * (10 ** tokenFirst.decimals)).toFixed(0)
            }

          }
          else {
            TokenAddress = tokenFirst.token_address
            TokenDecimal = tokenFirst.decimals
            if (type == SELECTED_INPUT.firstInput) {
              tokenvalueDesired = (value * (10 ** tokenFirst.decimals)).toFixed(0)
            } else {
              tokenvalueDesired = (valueget * (10 ** tokenFirst.decimals)).toFixed(0)
            }
          }

          const isApproved = await checkContractApproval(TokenAddress, valueget,);
          //console.warn('MM','isApproved ======>> gg ', isApproved, TokenAddress);
          if (!isApproved) {
            //console.warn('MM','isApproved ======>>  inside approved');
            let tokenContractObject = await getContractObject(path[0]);
            setAllowancetxnObj({ tokenContractObject: tokenContractObject, path: path[0], });
            tokenContractObject.methods
              .approve(routerAddress, BigNumber(10 ** 25).toFixed(0))
              .estimateGas({ from: userAddress })
              .then(gasEstimate => {
                setGasEstimate(gasEstimate + GAS_BUFFER);
                setRawTxnObj({
                  tokenContractAddress: tokenFirst.token_address,
                });
                setLoading(false);
                setTransactionFee(
                  Singleton.getInstance().toFixed(
                    gasEstimate * gasPrice * GAS_FEE_MULTIPLIER,
                    6,
                  ),
                );
                return resolve(gasEstimate);
              })
              .catch(err => {
                //console.warn('MM','xx', err.message);
                setLoading(false);
                if (err.message.includes('insufficient funds')) {
                  setInsufficientBalance(true);
                }
              });
            return;
          } else {
            // value eth , token addres, ratiogot,
            let liquidityTransaction;
            let ethValue = 0
            if (tokenFirst.coin_symbol.toLowerCase() == "eth") {
              ethValue = type == SELECTED_INPUT.firstInput ? value * (10 ** 18) : (result * value) * (10 ** 18)
              //console.warn('MM','-----params------- eth1111', ethValue, result, value, type)
            } else if (tokenSecond.coin_symbol.toLowerCase() == "eth") {
              ethValue = type == SELECTED_INPUT.firstInput ? (result * value) * (10 ** 18) : value * (10 ** 18)
              //console.warn('MM','-----params------- eth22222', ethValue, result, value, type)
            } else {
              //console.warn('MM','-----params------- eth33333')
              ethValue = "0x0"
            }




            if (tokenFirst.coin_symbol.toLowerCase() == 'eth' || tokenSecond.coin_symbol.toLowerCase() == "eth") {
              //console.warn('MM','-----params------- eth old', tokenSecond.token_address, tokenvalueDesired,
              // amountBMin.toString(), amountAMin.toString(),
              //   userAddress, deadline, "ethValue " + ethValue, tokenFirst.coin_symbol, tokenSecond.coin_symbol);
              liquidityTransaction = await routerContractObject.methods.addLiquidityETH
                (TokenAddress, BigNumber(tokenvalueDesired).toFixed(0), BigNumber(amountBMin).toFixed(0), BigNumber(amountAMin).toFixed(0),
                  userAddress, deadline);
              //console.warn('MM','-----userAddress-------', userAddress, ethValue);



              liquidityTransaction
                .estimateGas({ from: userAddress, value: BigNumber(ethValue).toFixed(0) })
                .then(gasEstimate => {
                  //console.warn('MM','-----estimateGas-------', gasEstimate);
                  setInsufficientBalance(false);
                  setGasEstimate(gasEstimate + GAS_BUFFER);
                  setLoading(false);
                  setTransactionFee(Singleton.getInstance().toFixed(gasEstimate * gasPrice * GAS_FEE_MULTIPLIER, 6,),);
                  //console.warn('MM','Singleton.getInstance().toFixed(((gasEstimate) * gasPrice * GAS_FEE_MULTIPLIER::: 55', gasEstimate * gasPrice * GAS_FEE_MULTIPLIER,);
                  setRawTxnObj({ type: tokenFirst.coin_symbol.toLowerCase(), data: liquidityTransaction.encodeABI(), value: ethValue.toString(), });

                  return resolve(gasEstimate);
                })
                .catch(err => {
                  //console.warn('MM','>>>>>>111' + err.message);
                  setLoading(false);
                  if (err.message.includes('insufficient funds')) {
                    setInsufficientBalance(true);
                  }
                });
            } else {
              //console.warn('MM',">>>>>>tokenOneAmount ", fetchedTokenOneValue, fetchedTokenTwoValue)
              liquidityTransaction = await routerContractObject.methods.addLiquidity
                (tokenFirst.token_address, tokenSecond.token_address, BigNumber(fetchedTokenOneValue * (10 ** tokenFirst.decimals)).toFixed(0)
                  , BigNumber(fetchedTokenTwoValue * (10 ** tokenSecond.decimals)).toFixed(0), amountAMin.toString(), amountBMin.toString(),
                  userAddress, deadline);

              //console.warn('MM','-----params------- token', tokenFirst.token_address, tokenSecond.token_address, fetchedTokenOneValue * (10 ** tokenFirst.decimals)
              //             , fetchedTokenTwoValue * (10 ** tokenSecond.decimals), amountAMin.toString(), amountBMin.toString(),
              // userAddress, deadline, ethValue);

              try {
                //console.warn('MM','-----gs-------',);
                let gs = await liquidityTransaction.estimateGas({ from: userAddress, value: BigNumber(ethValue).toFixed(0) })
                //console.warn('MM','-----gs-------', gs);
              } catch (error) {
                //console.warn('MM','-----error-------', error);
              }

              liquidityTransaction
                .estimateGas({ from: userAddress, value: BigNumber(ethValue).toFixed(0) })
                .then(gasEstimate => {
                  //console.warn('MM','-----estimateGas-------', gasEstimate);
                  setInsufficientBalance(false);
                  setGasEstimate(gasEstimate + GAS_BUFFER);
                  setLoading(false);
                  setTransactionFee(Singleton.getInstance().toFixed(gasEstimate * gasPrice * GAS_FEE_MULTIPLIER, 6,),);
                  //console.warn('MM','Singleton.getInstance().toFixed(((gasEstimate) * gasPrice * GAS_FEE_MULTIPLIER::: 66' , gasEstimate * gasPrice * GAS_FEE_MULTIPLIER,);
                  setRawTxnObj({
                    type: "token", data: liquidityTransaction.encodeABI(), value: ethValue.toString(),
                    tokenContractAddress: tokenFirst.token_address,
                  });

                  return resolve(gasEstimate);
                })
                .catch(err => {
                  //console.warn('MM','ll????' + err.message);
                  setLoading(false);
                  if (err.message.includes('insufficient funds')) {
                    setInsufficientBalance(true);
                  }
                });
            }
            // //console.warn('MM','-----liquidityTransaction-------', liquidityTransaction);
          }
        });
    });
    // } else {
    //   setPairVaild(false)
    //   Singleton.showAlert("One Token Should be either ETH or SAITAMA")
    //   return
    // }


  };

  const onProceed = async () => {
    //console.warn('MM','>>>>>>>>>> tokenOne22Amount', tokenTwoAmount, userBalTo);
    if (tokenOneAmount == undefined || tokenOneAmount == 0) {
      Singleton.showAlert('Please enter amount to swap');
    } else if (tokenTwoAmount == undefined || tokenTwoAmount == 0) {
      Singleton.showAlert(`${tokenFirst.coin_name}'s equivalent amount to ${tokenSecond.coin_name} is not received.`,);
    } else if (tokenOneAmount > userBal) {
      //console.warn('MM','>>>>>>>>>> tokenOneAmount', tokenOneAmount, userBal);
      Singleton.showAlert(`Insufficient ${tokenFirst.coin_name} Balance.`,);
    }
    else if (!isPairVaild) {
      Singleton.showAlert("One Token Should be either ETH or SAITAMA")
    }
    else if (tokenTwoAmount > userBalTo) {
      //console.warn('MM','>>>>>>>>>> tokenOne2Amount', tokenTwoAmount, userBalTo);
      Singleton.showAlert(`Insufficient ${tokenSecond.coin_name} Balance.`,);
    }
    else if (parseFloat(userBal) > parseFloat(tokenOneAmount)) {
      //console.warn('MM','>>>>>>>>>> isApproved', isApproved);
      if (isApproved) {
        let totalFee = (gasPrice * gasEstimate).toFixed(0);
        ////console.log(
        // '>>>>>>>>>> totalFee11',
        //   totalFee,
        //   totalFee * GAS_FEE_MULTIPLIER,
        //   rawTxnObj?.value,
        //   );
        const web3Object = getWeb3Object();
        let ethBal = await web3Object.eth.getBalance(userAddress);
        //console.warn('MM','>>>>>>>>>> ethBal', ethBal);
        if (rawTxnObj?.type == 'eth') {
          totalFee = await bigNumberSafeMath(
            totalFee,
            '+',
            rawTxnObj?.value,
          );
          //console.warn('MM','>>>>>>>>>> totalFee', totalFee);
        }
        if (
          ethBal - Singleton.getInstance().exponentialToDecimal(totalFee) <
          0
        ) {
          let required = totalFee * GAS_FEE_MULTIPLIER;
          //console.warn('MM',">>>>>>>>>> ethBal", ethBal, Singleton.getInstance().exponentialToDecimal(totalFee));
          Singleton.showAlert("You don't have enough Eth to perform transaction! Required Fee is " +
            Singleton.getInstance().toFixed(required, 6) + " Eth");
          return;
        }
        setSwapModal(true);
      } else {
        let totalFee = (gasPrice * gasEstimate).toFixed(0);
        const web3Object = getWeb3Object();
        let ethBal = await web3Object.eth.getBalance(userAddress);
        if (ethBal - Singleton.getInstance().exponentialToDecimal(totalFee) < 0) {
          Singleton.showAlert("You don't have enough eth to perform transaction",);
          return;
        }
        Alert.alert(
          'Approval',
          `Pay ${(
            gasPrice *
            gasEstimate *
            GAS_FEE_MULTIPLIER
          ).toFixed(
            6,
          )} ETH transaction fee for token approval.`,
          [
            {
              text: 'Approve',
              onPress: () => {
                getApproval();
              },
            },
            {
              text: 'Cancel',
              onPress: () => { },
            },
          ],
          { cancelable: false },
        );
      }
    } else {
      Singleton.showAlert("You don't have enough balance");
    }
  };

  const getApproval = () => {
    setLoading(true);
    approveTransaction(allownceTxnObj.tokenContractObject, routerAddress, userAddress, allownceTxnObj.path,
    ).then(resultApprove => {
      //console.warn('MM','approve send transaction response ==>>', resultApprove);
      Alert.alert(constants.APP_NAME, "Please wait for blockchain confirmation, Once Approved You can start Adding Liquidity.",
        [{ text: 'OK', onPress: () => { Actions.pop() } }],
        { cancelable: false },
      );
      setUserApproval(true);
      setLoading(false);
    });

  };

  const approveTransaction = async (tokenContractObject, spenderAddress, userAddress, tokenAddress,) => {

    //console.warn('MM','**** APPROVED TRANSACTION ALERT **', spenderAddress, userAddress, tokenAddress);
    const web3Object = getWeb3Object();
    const approveTrans = tokenContractObject.methods.approve(spenderAddress, BigNumber(10 ** 25).toFixed(0));
    const approveGasLimit = await approveTrans.estimateGas({ from: userAddress });
    //console.warn('MM','approveGasLimit ===>>>', approveGasLimit);
    const nonce = await web3Object.eth.getTransactionCount(userAddress);
    const resultApprove = await makeTransaction(
      approveTrans.encodeABI(),
      gasPrice,
      approveGasLimit + 10000,
      nonce,
      '0x0',
      tokenAddress,
      privateKey,
      userAddress,
    );
    return resultApprove;
  };

  const supply = async () => {
    //console.warn('MM','\n\n\n **** Supply TRANSACTION ALERT ***** \n\n\n', privateKey);
    const web3Object = getWeb3Object();
    let nonce = await web3Object.eth.getTransactionCount(userAddress);
    const result = await makeTransaction(
      rawTxnObj.data,
      gasPrice,
      gasEstimate,
      nonce,
      rawTxnObj.type != 'token' ? rawTxnObj.value : '0x0',
      routerAddress,
      privateKey,
      userAddress,
    );
    //console.warn('MM','--------------result---------------', result);
    setRawTxnObj({});
    getUserBal(tokenFirst);
    getUserBalTo(tokenSecond);
    setLoading(false);
    Alert.alert(
      'Success',
      `Transaction is broadcasted successfully. Waiting for blockchain confirmation `,
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
      { cancelable: false },
    );
    return result;
  };
  const makeTransaction = async (
    transactionData,
    gasPrice,
    gasLimit,
    nonce,
    value,
    to,
    pvtKey,
    from,
  ) => {
    const web3Object = getWeb3Object();

    let rawTransaction = {

      gasPrice: gasPrice,
      gasLimit: gasLimit,
      to: to,
      value: value,
      data: transactionData,
      nonce: nonce,
      from: from.toLowerCase(),
      chainId: constants.network == 'testnet' ? parseInt(constants.CHAIN_ID_ETH) : 1,
    };

    //console.warn('MM','rawTransaction =>', rawTransaction);

    let txn = await web3Object.eth.accounts.signTransaction(
      rawTransaction,
      pvtKey,
    );
    let access_token = Singleton.getInstance().access_token;
    let blockChain = blockChain;
    let coin_symbol = tokenFirst.coin_symbol.toLowerCase();
    //console.warn('MM','rawTransaction 111=>');

    let data = {
      from: from.toLowerCase(),
      to: to,
      amount: isApproved ? tokenOneAmount : 0,
      gas_price: gasPrice,
      gas_estimate: gasLimit,
      tx_raw: txn.rawTransaction.slice(2),
      tx_type: 'WITHDRAW',
      nonce: nonce,
      chat: 0,
      is_smart: 1,
    };

    let serializedTran = txn.rawTransaction.toString('hex');

    //console.warn('MM','serializedTran =>', serializedTran);

    let result = await getWeb3Object().eth.sendSignedTransaction(serializedTran,);
    //console.warn('MM','serializedTran => result', result);
    data.tx_hash = result.transactionHash;
    await sendTransactionToBackend(data, 'ethereum', value == '0x0' ? rawTxnObj?.tokenContractAddress : 'eth',);
    return result;
  };

  const sendTransactionToBackend = (
    data,
    blockChain = 'ethereum',
    coin_symbol,
  ) => {
    return new Promise((resolve, reject) => {
      coin_symbol = tokenFirst.coin_symbol.toLowerCase() == 'eth' ? "eth" : rawTxnObj?.tokenContractAddress
      let access_token = Singleton.getInstance().access_token;
      //console.warn('MM','eth data::::', data);
      //console.warn('MM','eth data::::', `https://api.saita.pro/prod/api/v1/${blockChain}/${coin_symbol}/savetrnx`, access_token,);
     
      APIClient.getInstance().post(`${blockChain}/${coin_symbol}/savetrnx` , data , access_token) 
      .then(res=>{
 //  console.warn('MM','sendTransactionToBackend', res);
        resolve(res)
      }).catch(err=>{
 //  console.warn('MM','err sendTransactionToBackend' , err);
        reject(err)
      })

      // fetch(
      //   `${BASE_URL}${blockChain}/${coin_symbol}/savetrnx`,
      //   {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //       Authorization: access_token,
      //     },
      //     body: data != null ? JSON.stringify(data) : null,
      //   },
      // )
      //   .then(async res => {
      //     try {
      //       //console.warn('MM','sendTransactionToBackend 1= ', res);

      //       let jsonVal = await res.json();
      //       //console.warn('MM','sendTransactionToBackend = ', jsonVal);
      //       if (!res.ok) {
      //         if (jsonVal.message == undefined) {
      //           return resolve({ message: constants.SOMETHING_WRONG });
      //         }
      //         return resolve(jsonVal);
      //       }
      //       return resolve(jsonVal);
      //     } catch (e) {
      //       //console.warn('MM','sendTransactionToBackend err==> ', e);
      //       return resolve({ message: constants.SOMETHING_WRONG });
      //     }
      //   })
      //   .catch(err => {
      //     //console.warn('MM','sendTransactionToBackend err==>', err);
      //   });
    });
  };


  return (
    <Wrap style={{ backgroundColor: ThemeManager.colors.backgroundColor }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>

        <View
          style={{
            borderColor: ThemeManager.colors.inputBorderColor,
            borderRadius: 12,
            borderWidth: 1,
            height: 50,
            width: '86%',
            marginTop: 14,
            flexDirection: 'row',
            marginHorizontal: 30,
          }}>
          <SelectDropdown
          disabled={coinList?.length > 0 ? false : true}
          
            data={coinList}
            buttonStyle={{
              // fontFamily: Fonts.regular,
              backgroundColor: ThemeManager.colors.backgroundColor,
              // backgroundColor: "green",
              width: '30%',
              height: 45,
              borderRadius: 12,
            }}
            buttonTextStyle={{
              fontFamily: Fonts.regular,
              fontSize: 16,
              color: ThemeManager.colors.textColor,
              textAlign: 'left',
            }}
            dropdownStyle={styles.dropDownStyle}
            rowTextStyle={{
              fontFamily: Fonts.regular,
              fontSize: 14,
              color: ThemeManager.colors.textColor,
              textAlign: 'left',
            }}
            rowStyle={styles.rowStyle}
            defaultButtonText={tokenFirst?.coin_symbol}
            renderDropdownIcon={() => (
              <Image
                source={ThemeManager.ImageIcons.dropIconDown}
                style={{ width: 10, height: 10 }}
              />
            )}
            onSelect={(selectedItem, index) => {
              setTokenOneAmount(0);
              setTokenTwoAmount(0);
              setTokenFirst(selectedItem);
              setTimeout(() => {
                getUserBal(selectedItem);
                checkCoinPair(selectedItem, tokenSecond)
              }, 1500);
              //console.warn('MM','checkDropDwonSelect', selectedItem, index);
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              // text represented after item is selected
              // if data array is an array of objects then return selectedItem.property to render after item is selected
              return selectedItem.coin_symbol;
            }}
            rowTextForSelection={(item, index) => {
              // text represented for each item in dropdown
              // if data array is an array of objects then return item.property to represent item in dropdown
              return item.coin_symbol;
            }}
            renderCustomizedButtonChild={(item, index) => {
              let a =
                coinList != undefined && index >= 0 ? coinList[index] : {};
              // let a = coinList;

              return (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={{ uri: tokenFirst?.coin_image }}
                    style={{
                      borderRadius: 8,
                      width: 16,
                      height: 16,
                      resizeMode: 'contain',
                    }}
                  />

                  <Text
                    style={{
                      fontFamily: Fonts.semibold,
                      fontSize: 12,
                      color: ThemeManager.colors.textColor,
                      paddingStart: 2,
                      marginTop: 2,
                    }}>
                    {tokenFirst?.coin_symbol.toUpperCase()}
                  </Text>
                </View>
              );
            }}
            renderCustomizedRowChild={(item, index) => {
              let a =
                coinList != undefined && index >= 0 ? coinList[index] : {};
              // let a = coinList;

              return (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  {item ? (
                    <Image
                      source={{ uri: a.coin_image }}
                      style={{
                        borderRadius: 14,
                        width: 25,
                        height: 25,
                        resizeMode: 'contain',
                      }}
                    />
                  ) : (
                    <Image
                      source={{
                        uri: coinList[0].coin_image,
                      }}
                      style={{
                        borderRadius: 14,
                        width: 25,
                        height: 25,
                        resizeMode: 'contain',
                      }}
                    />
                  )}

                  <Text
                    style={{
                      fontFamily: Fonts.semibold,
                      fontSize: 15,
                      color: ThemeManager.colors.textColor,
                      paddingStart: 15,
                    }}>
                    {a?.coin_symbol.toUpperCase() ||
                      coinList[0].coin_symbol.toUpperCase()}
                  </Text>
                </View>
              );
            }}
          />

          <View
            style={{
              height: 20,
              width: 1,
              backgroundColor: ThemeManager.colors.inputBorderColor,
              marginHorizontal: 5,
              alignSelf: 'center',
            }}></View>

          <TextInput
            value={tokenOneAmount}
            style={{
              width: '50%',
              alignSelf: 'center',
              justifyContent: 'center',
              color: ThemeManager.colors.textColor,
            }}
            placeholder={'0.0'}
            keyboardType={'numeric'}
            maxLength={8}
            onChangeText={value => {
              // setFromValue(value)
              var expression = new RegExp('^\\d*\\.?\\d{0,' + '}$');
              if (expression.test(value)) {
                setSelectedInput(SELECTED_INPUT.firstInput);
                setTokenOneAmount(value);

                tokenOnevalue = value
                //console.warn('MM',"-----params-------amount tokenOnevalue", tokenOnevalue);
                handler(
                  tokenFirst,
                  tokenSecond,
                  SELECTED_INPUT.firstInput,
                  value,

                );
                // onChangeText({
                //   tokenFirst,
                //   tokenSecond,
                //   type: SELECTED_INPUT.firstInput,
                //   value,
                // });
              }
            }}
          />

          {/* <TouchableOpacity
            style={{
              justifyContent: 'center',
              textColor: ThemeManager.colors.textColor,
              marginStart: 14,
              alignItems: 'center',
            }}>
            <Text style={styles.maxTextStyle}>{LanguageManager.max}</Text>
          </TouchableOpacity> */}
        </View>

        <View style={styles.amountView}>
          <Text
            style={[
              styles.balanceLabelStyle,
              { color: ThemeManager.colors.textColor },
            ]}>
            {LanguageManager.available + ' : '}
          </Text>

          <Text style={[styles.balanceValueStyle, { color: ThemeManager.colors.textColor }]}>
            {' '}
            {`${userBal + ' ' + tokenFirst?.coin_symbol}`}
          </Text>
        </View>

        {/* <ScrollView
          bounces={false}
          contentContainerStyle={{flex: 1, marginTop: 15, marginHorizontal: 20}}
          alwaysBounceHorizontal={false}
          showsHorizontalScrollIndicator={false}
          horizontal={true}>
          {percentSelection.map((item, index) => {
            return (
              <>
                {percentSelectedIndex == index ? (
                  <BasicButton
                    // onPress={() => {
                    //   setStakeSelected(true);
                    // }}
                    btnStyle={{
                      flex: 1,
                      marginHorizontal: 10,
                      height: 40,
                      justifyContent: 'center',
                      borderRadius: 10,
                    }}
                    customGradient={{borderRadius: 10, height: 40}}
                    // colors={Singleton.getInstance().dynamicColor}
                    text={item.days}
                    textStyle={{fontSize: 14, fontFamily: Fonts.regular}}
                  />
                ) : (
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      backgroundColor: ThemeManager.colors.inactiveBtn,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginHorizontal: 10,
                      borderRadius: 10,
                      height: 40,
                    }}
                    onPress={() => {
                      setPercentSelectedIndex(index);
                      setPercentSelected(item.days);
                    }}>
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: Fonts.regular,
                        color:
                          percentSelectedIndex === index
                            ? Colors.white
                            : ThemeManager.colors.inactiveBtnText,
                      }}>
                      {item.days}
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            );
          })}
        </ScrollView> */}


        <Image
          style={{ alignSelf: 'center', marginTop: 30 }}
          source={Images.addImage}
        />



        <View
          style={{
            borderColor: ThemeManager.colors.inputBorderColor,
            borderRadius: 12,
            borderWidth: 1,
            height: 50,
            width: '86%',
            marginTop: 13,
            flexDirection: 'row',
            marginHorizontal: 30,
          }}>
          <SelectDropdown
          disabled={coinList?.length > 0 ? false : true}
            data={coinList}
            buttonStyle={{
              // fontFamily: Fonts.regular,
              backgroundColor: ThemeManager.colors.backgroundColor,
              // backgroundColor: "green",
              width: '30%',
              height: 45,
              borderRadius: 12,
            }}
            buttonTextStyle={{
              fontFamily: Fonts.regular,
              fontSize: 16,
              color: ThemeManager.colors.textColor,
              textAlign: 'left',
            }}
            dropdownStyle={styles.dropDownStyle}
            rowTextStyle={{
              fontFamily: Fonts.regular,
              fontSize: 14,
              color: ThemeManager.colors.textColor,
              textAlign: 'left',
            }}
            rowStyle={styles.rowStyle}
            defaultButtonText={tokenSecond?.coin_symbol}
            renderDropdownIcon={() => (
              <Image
                source={ThemeManager.ImageIcons.dropIconDown}
                style={{ width: 10, height: 10 }}
              />
            )}
            onSelect={(selectedItem, index) => {
              setTokenOneAmount(0);
              setTokenTwoAmount(0);
              setTokenSecond(selectedItem);
              getUserBalTo(selectedItem);
              //console.warn('MM','checkDropDwonSelect', selectedItem, index);
              setTimeout(() => {
                checkCoinPair(tokenFirst, selectedItem)
              }, 1200);
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              // text represented after item is selected
              // if data array is an array of objects then return selectedItem.property to render after item is selected
              return selectedItem.coin_symbol;
            }}
            rowTextForSelection={(item, index) => {
              // text represented for each item in dropdown
              // if data array is an array of objects then return item.property to represent item in dropdown
              return item.coin_symbol;
            }}
            renderCustomizedButtonChild={(item, index) => {
              let a =
                coinList != undefined && index >= 0 ? coinList[index] : {};
              // let a = coinList;

              return (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={{ uri: tokenSecond?.coin_image }}
                    style={{
                      borderRadius: 8,
                      width: 16,
                      height: 16,
                      resizeMode: 'contain',
                    }}
                  />

                  <Text
                    style={{
                      fontFamily: Fonts.semibold,
                      fontSize: 12,
                      color: ThemeManager.colors.textColor,
                      paddingStart: 2,
                      marginTop: 2,
                    }}>
                    {tokenSecond?.coin_symbol.toUpperCase()}
                  </Text>
                </View>
              );
            }}
            renderCustomizedRowChild={(item, index) => {
              let a =
                coinList != undefined && index >= 0 ? coinList[index] : {};
              // let a = coinList;

              return (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  {item ? (
                    <Image
                      source={{ uri: a.coin_image }}
                      style={{
                        borderRadius: 14,
                        width: 25,
                        height: 25,
                        resizeMode: 'contain',
                      }}
                    />
                  ) : (
                    <Image
                      source={{
                        uri: coinList[0].coin_image,
                      }}
                      style={{
                        borderRadius: 14,
                        width: 25,
                        height: 25,
                        resizeMode: 'contain',
                      }}
                    />
                  )}

                  <Text
                    style={{
                      fontFamily: Fonts.semibold,
                      fontSize: 15,
                      color: ThemeManager.colors.textColor,
                      paddingStart: 15,
                    }}>
                    {a?.coin_symbol.toUpperCase() ||
                      coinList[0].coin_symbol.toUpperCase()}
                  </Text>
                </View>
              );
            }}
          />

          <View
            style={{
              height: 20,
              width: 1,
              backgroundColor: ThemeManager.colors.inputBorderColor,
              marginHorizontal: 5,
              alignSelf: 'center',
            }}></View>

          <TextInput
            value={tokenTwoAmount}
            keyboardType={'numeric'}
            maxLength={8}
            placeholder={'0.0'}
            style={{
              width: '70%',
              alignSelf: 'center',
              justifyContent: 'center',
              color: ThemeManager.colors.textColor,
            }}
            onChangeText={value => {
              // setFromValue(value)
              var expression = new RegExp('^\\d*\\.?\\d{0,' + '}$');
              if (expression.test(value)) {
                setSelectedInput(SELECTED_INPUT.secondInput);
                tokenTwovalue = value
                setTokenTwoAmount(value);
                //console.warn('MM',"-----params-------amount tokenTwovalue", tokenTwovalue);
                handler(
                  tokenFirst,
                  tokenSecond,
                  SELECTED_INPUT.secondInput,
                  value,

                );
                // onChangeText({
                //   tokenFirst,
                //   tokenSecond,
                //   type: SELECTED_INPUT.secondInput,
                //   value,
                // });
              }
            }}
          />
        </View>

        <View style={styles.amountView}>
          <Text
            style={[
              styles.balanceLabelStyle,
              { color: ThemeManager.colors.textColor },
            ]}>
            {LanguageManager.available + ' : '}
          </Text>

          <Text style={[styles.balanceValueStyle, { color: ThemeManager.colors.textColor }]}>
            {`${userBalTo + ' ' + tokenSecond?.coin_symbol}`}
          </Text>
        </View>
        <View style={styles.removeView}>
          <Text
            style={{
              fontFamily: Fonts.semibold,
              fontSize: 14,
              color: ThemeManager.colors.textColor,
            }}>
            {LanguageManager.pricesAndPool}
          </Text>
          <TouchableOpacity
            onPress={() => {
              Actions.currentScene != 'LiquiditySelectToken' &&
                Actions.LiquiditySelectToken({ coinList });
            }}
            style={styles.removeView1}>
            <Image
              style={{ width: 12, height: 17, tintColor: Colors.red }}
              source={Images.delete}
            />
            <Text
              style={{
                fontFamily: Fonts.regular,
                fontSize: 12,
                color: Colors.red,
                marginLeft: 5,
              }}>
              Remove
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            marginTop: 13,
            flexDirection: 'row',
            borderColor: Colors.buttonColor5,
            height: 67,
            borderRadius: 12,
            borderWidth: 1,
            marginHorizontal: 30,
          }}>
          <View
            style={{

              width: '90%',
              marginHorizontal: 17,
              justifyContent: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: ThemeManager.colors.textColor,
                  fontFamily: Fonts.regular,
                  fontSize: 12,
                }}>
                {ratiofetched?.toFixed(4)}
              </Text>

              <Text
                style={{
                  color: ThemeManager.colors.textColor,
                  fontFamily: Fonts.regular,
                  fontSize: 12,
                }}>
                {ratiofetched == 0 ? 0 : parseFloat(ratiofetchedTwo)?.toFixed(8)}
              </Text>
              {/* <Text
                style={{
                  color: ThemeManager.colors.textColor,
                  fontFamily: Fonts.regular,
                  fontSize: 11,
                }}>
                %
              </Text> */}
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: ThemeManager.colors.textColor,
                  fontFamily: Fonts.light,
                  fontSize: 11,
                }}>
                {tokenSecond?.coin_symbol} per  {tokenFirst?.coin_symbol}
              </Text>

              <Text
                style={{
                  color: ThemeManager.colors.textColor,
                  fontFamily: Fonts.light,
                  fontSize: 11,
                }}>
                {tokenFirst?.coin_symbol} per  {tokenSecond?.coin_symbol}
              </Text>
              {/* <Text
                style={{
                  color: ThemeManager.colors.lightGrey2,
                  fontFamily: Fonts.light,
                  fontSize: 10,
                }}>
                {' '}
                Share of Pool{' '}
              </Text> */}
            </View>
          </View>
        </View>



        <View
          style={{
            marginTop: 13,
            borderColor: Colors.buttonColor5,
            height: 133,
            borderRadius: 12,
            borderWidth: 1,
            marginHorizontal: 30,
            justifyContent: 'center',
            padding: 15,
          }}>
          <Text style={{ color: ThemeManager.colors.textColor, marginBottom: 5, fontSize: 16, fontFamily: Fonts.semibold }}>
            LP Tokens In Your Wallet
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 3,
              justifyContent: 'space-between',
            }}>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={{ uri: tokenFirst?.coin_image }}
                style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: Colors.lightGrey }}
              />
              <Image
                source={{ uri: tokenSecond?.coin_image }}
                style={{ width: 24, height: 25, borderRadius: 12, marginLeft: -5, backgroundColor: Colors.lightGrey }}
              />
              <Text
                style={{
                  color: ThemeManager.colors.textColor,
                  paddingHorizontal: 8,
                }}>
                {tokenFirst?.coin_symbol}/{tokenSecond?.coin_symbol}
              </Text>
            </View>

            <Text style={{ color: ThemeManager.colors.textColor }}>{pairPool}</Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 3,
            }}>
            <Text style={{ color: ThemeManager.colors.textColor }}>{tokenFirst?.coin_symbol}</Text>

            <Text style={{ color: ThemeManager.colors.textColor }}>
              {pairPoolOne}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 3,
            }}>
            <Text style={{ color: ThemeManager.colors.textColor }}>{tokenSecond?.coin_symbol}</Text>

            <Text style={{ color: ThemeManager.colors.textColor }}>{pairPoolTwo}</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <BasicButton
            onPress={() => {
              isClickable ? onProceed() : '';
            }}
            btnStyle={styles.btnStyle}
            customGradient={styles.customGrad}
            text={
              isInsufficientBalance
                ? 'Insufficient Balance'
                : isApproved
                  ? 'Supply'
                  : 'Approval'
            }></BasicButton>

          {/* <TouchableOpacity
            style={{
              width: '40%',
              height: 50,
              marginTop: 40,
              backgroundColor: ThemeManager.colors.supplyBtnBg,
              borderRadius: 12,
              marginStart: 10,
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontFamily: Fonts.semibold,
                fontSize: 16,
                alignSelf: 'center',
              }}>
              Supply
            </Text>
          </TouchableOpacity> */}
        </View>
      </ScrollView>
      {isLoading && (
        <Loader
          smallLoader={false}
          customheight={{ height: Dimensions.get('window').height - 160 }}
        />
      )}
      {swapModal && (
        <ModalSwap
          toCoinName={tokenFirst.coin_name}
          toCoinSymbol={tokenFirst.coin_symbol}
          fromCoinName={tokenSecond.coin_name}
          fromCoinSymbol={tokenSecond.coin_symbol}
          toValue={tokenOneAmount}
          fromValue={tokenTwoAmount}
          symbol={'ETH'}
          txnFee={(gasPrice * gasEstimate * GAS_FEE_MULTIPLIER).toFixed(6)}
          onPress={() => {
            setSwapModal(false);
            setLoading(true);
            supply();
          }}
          onCancel={() => {
            setSwapModal(false);
          }}
        />
      )}
    </Wrap>
  );
};

const styles = StyleSheet.create({
  viewPercentOuter: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 5,
    backgroundColor: 'green',
  },
  amountView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 10,
    marginEnd: 30,
  },

  balanceLabelStyle: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: ThemeManager.colors.textColor,
    marginBottom: 4,
  },
  balanceValueStyle: {
    fontFamily: Fonts.semibold,
    fontSize: 12,
    color: ThemeManager.colors.searchTextColor,
  },

  txtTo: {
    fontSize: 14,
    fontFamily: Fonts.semibold,
    marginTop: 16,
    marginStart: 30,
  },

  btnStyle: {

    height: 50,
    marginTop: 40,
    marginEnd: 10,
  },

  customGrad: {
    borderRadius: 12,
  },

  maxTextStyle: {
    color: Colors.buttonColor5,
    fontFamily: Fonts.regular,
    fontSize: 13,
  },

  btnStylen: {
    fontFamily: Fonts.regular,
    justifyContent: 'flex-end',
    backgroundColor: 'Transparent',
    borderWidth: 0,
    alignSelf: 'stretch',
    width: '100%',
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  btnTextStyle: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    color: Colors.White,
    textAlign: 'left',
  },
  dropDownStyle: {
    backgroundColor: '#E5E5E5',
    borderRadius: 10,
    shadowColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '88%',
  },
  rowStyle: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)',
    paddingLeft: 20,
  },
  rowTextStyle: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.White,
    textAlign: 'left',
  },
  removeView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    marginHorizontal: 30,
  },
  removeView1: {
    flexDirection: 'row',
  },

  btnApply: {},
});

export default LiquiditySelected;

