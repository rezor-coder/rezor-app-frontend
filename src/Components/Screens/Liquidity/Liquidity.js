import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Keyboard,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import images from '../../../theme/Images';
import { Inputtext, InputtextSearch, MainHeader } from '../../common';
import { styles } from './LiquidityStyle';
// import { TouchableOpacity } from 'react-native-gesture-handler';
import { BasicButton, Wrap } from '../../common/index';

import PAIR_ABI from '../../../../ABI/Pair.ABI.json';
import ROUTER_ABI from '../../../../ABI/router.ABI.json';
import SAITAROUTER_ABI from '../../../../ABI/saitaFactory.ABI.json';
import TOKEN_ABI from '../../../../ABI/tokenContract.ABI.json';
// import Token_List from '../../../../ABI/tokensList';

import { BigNumber } from 'bignumber.js';
import FastImage from 'react-native-fast-image';
import { useDispatch } from 'react-redux';
import Web3 from 'web3';
import { APIClient } from '../../../Api';
import * as constants from '../../../Constant';
import { getSwapList } from '../../../Redux/Actions';
import Singleton from '../../../Singleton';
import { Colors, Images } from '../../../theme';
import { bigNumberSafeMath } from '../../../utils';
import { ButtonPercentage } from '../../common/ButtonPercentage';
import { ModalSwap } from '../../common/ModalSwap';
import Loader from '../Loader/Loader';

// let routerAddress = '0x0c17e776CD218252ADFca8D4e761D3fe757e9778'; // mainnet saitaswap router address 
// let factoryAddress = '0x35113a300ca0D7621374890ABFEAC30E88f214b1'
// let WETH = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'  // Using Wrapped Ether (WETH) contract address to get ETH equivalent balance



const GAS_FEE_MULTIPLIER = 0.000000000000000001;
const SLIPPERAGE_PERCENTAGE = 20; //in percent
const TXN_COMPLETE_MAX_TIME = 20; //in minutes
const SELECTED_INPUT = { firstInput: 'firstInput', secondInput: 'secondInput', };
const GAS_BUFFER = 15000;
const BUTTONPERCENTAGELIST = ['25%', '50%', '75%', '100%'];
let timer = undefined;

const SwapScreen = ({ slippage, timeout }) => {
  let Token_List = [
    {
      name: 'Eth',
      chainId: 1,
      coin_symbol: 'Eth',
      decimals: 18,
      token_address: Singleton.getInstance().SwapWethAddress,
      logoURI: 'https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/1024/Ethereum-ETH-icon.png',
      type: 'coin',
      is_token: 0,
      isExist: true,
    },
  
    {
      name: 'SAITAMA',
      chainId: 1,
      coin_symbol: 'SAITAMA',
      decimals: 9,
      token_address: Singleton.getInstance().StakeSaitamaAddress,
      logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/20513.png',
      is_token: 1,
      isExist: true,
    },
  
    {
      name: 'SaitaRealty',
      chainId: 1,
      coin_symbol: 'SRLTY',
      decimals: 9,
      token_address: '0x142a774E8b52550E88E196CedD7A5835acB646D0',
      logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/21809.png',
      is_token: 1,
      isExist: true,
    },
  
    {
      name: 'Kodachi',
      chainId: 1,
      coin_symbol: 'KODACHI',
      decimals: 18,
      token_address: '0x57c411e9a358e2d2d0a6b058cEDb709175e8fd16',
      logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/21464.png',
      is_token: 1,
      isExist: true,
    },
  
  
    {
      name: 'Mandox',
      chainId: 1,
      coin_symbol: 'MANDOX',
      decimals: 9,
      token_address: '0x33d203fa03bb30b133de0fe2d6533c268ba286b6',
      logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/15444.png',
      is_token: 1,
      isExist: true,
    },
    {
  
  
      name: 'Bone',
      chainId: 1,
      coin_symbol: 'BONE',
      decimals: 18,
      token_address: '0x9813037ee2218799597d83D4a5B6F3b6778218d9',
      logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/11865.png',
      is_token: 1,
      isExist: true,
  
  
    },
    {
  
  
      name: "LUNA Classic",
      chainId: 1,
      coin_symbol: 'LUNC',
      decimals: 18,
      token_address: '0xd2877702675e6ceb975b4a1dff9fb7baf4c91ea9',
      logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/4172.png',
      is_token: 1,
      isExist: true,
  
       
     
    },
  
    {
  
  
      "chain_id":1,
      "coin_family":1,
      "coin_image":"https://s2.coinmarketcap.com/static/img/coins/64x64/20686.png",
      "coin_name":"JasmyCoin",
      "coin_symbol":"JASMY",
      "created_at":"2021-11-03T04:55:58.000Z",
      "decimals":18,
      "id":17,
      "is_active":1,
      "is_fee":1,
      "is_token":1,
      "token_address":"0x7420B4b9a0110cdC71fB720908340C03F9Bc03EC",
      "updated_at":"2022-10-04T05:46:03.000Z"
  
       
     
    },
    {
  
  
      "chain_id":1,
      "coin_family":1,
      "coin_image":"https://s2.coinmarketcap.com/static/img/coins/64x64/8425.png",
      "coin_name":"BlueSparrow Token",
      "coin_symbol":"BlueSparrow",
      "created_at":"2021-11-03T04:55:58.000Z",
      "decimals":9,
      "id":17,
      "is_active":1,
      "is_fee":1,
      "is_token":1,
      "token_address":"0x24ccedebf841544c9e6a62af4e8c2fa6e5a46fde",
      "updated_at":"2022-10-04T05:46:03.000Z"
  
       
     
    },
  
  
  
  ];
  let routerAddress = Singleton.getInstance().SwapRouterAddress; // mainnet saitaswap router address 
  let factoryAddress = Singleton.getInstance().SwapFactoryAddress
  let WETH = Singleton.getInstance().SwapWethAddress  // Using Wrapped Ether (WETH) contract address to get ETH equivalent balance
  let userAddress = Singleton.getInstance().defaultEthAddress;
  let slippage1 = 0
  let slippage2 = 0
  let fetchedTokenOneValue = 0
  let fetchedTokenTwoValue = 0
  const [tabstatus, setTabSatus] = useState('Rezor Swap');
  const [sliderValue, setSliderValue] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [swapModal, setSwapModal] = useState(false);
  const [privateKey, setPrivateKey] = useState('');

  const [tokenOneAmount, setTokenOneAmount] = useState();
  const [tokenTwoAmount, setTokenTwoAmount] = useState();
  const [userBal, setUserBal] = useState(0);
  const [userEthBal, setUserEthBal] = useState(0);
  const [activeIndex, setActiveIndex] = useState();
  const [rawTxnObj, setRawTxnObj] = useState({});
  const [toggleSwap, setToggleSwap] = useState(false);

  const [selectedInput, setSelectedInput] = useState(SELECTED_INPUT.firstInput);
  const [isInsufficientBalance, setInsufficientBalance] = useState(false);
  const [isApproved, setUserApproval] = useState(true);

  const [gasEstimate, setGasEstimate] = useState(0);
  const [indexPosition, setindexPosition] = useState(0);
  const [gasPrice, setGasPrice] = useState(0);
  const [ratiofetched, setRatio] = useState(0);
  const [allownceTxnObj, setAllowancetxnObj] = useState({});
  const [transactionFee, setTransactionFee] = useState('0.00');

  const [coinList, setCoinList] = useState(Token_List);
  // const [tokenFirst, setTokenFirst] = useState(Token_List[0]);
  // const [tokenSecond, setTokenSecond] = useState(Token_List[1]);
  const [tokenFirst, setTokenFirst] = useState(coinList[0]);
  const [tokenSecond, setTokenSecond] = useState(coinList[1]);

  const [ExistingCoinModal, setExistingCoinModal] = useState(false);
  const [NonExistingCoinModal, setNonExistingCoinModal] = useState(false);
  const [ExistingCoinList, setExistingCoinList] = useState([]);
  const [NonExistingCoinList, setNonExistingCoinList] = useState([]);
  const [search, setSearch] = useState('');
  // const SLIPPERAGE_PERCENTAGE = slippage; //in percent
  // const TXN_COMPLETE_MAX_TIME = timeout; //in minutes





  const dispatch = useDispatch();

  useEffect(() => {

    // Singleton.getInstance().access_token
    userAddress = Singleton.getInstance().defaultEthAddress;
    Singleton.getInstance()
      .newGetData(`${Singleton.getInstance().defaultEthAddress}_pk`)
      .then(ethPvtKey => {
        //console.warn('MM','ethPvtKey--------', ethPvtKey);
        setPrivateKey(ethPvtKey);
      });
    getUserBal({ tokenFirst });
    getGasPrice();
    //  getSwapListApi();
  }, []);

  const getGasPrice = () => {
    getWeb3Object()
      .eth.getGasPrice()
      .then(gas => {
        //console.warn('MM','-----------------gasPrice-----------', gas, 'ethPvtKey::::', privateKey,);
        setGasPrice(gas);
      });
  };

  const getSwapListApi = () => {
    let access_token = Singleton.getInstance().access_token;
    dispatch(getSwapList({ access_token }))
      .then(res => {
        setCoinList(res.data)
        //console.warn('MM','res :::::::::', res);
      })
      .catch(err => {

        //console.warn('MM','err price:::::::::', err);
      });
  }
  const getWeb3Object = () => {
    return constants.network == 'mainnet'
      ? new Web3(
        'https://mainnet.infura.io/v3/39f09bbfb5754cd480eee6c763227883',
      )
      : new Web3(
        constants.testnetEth,
      ); // 'https://data-seed-prebsc-1-s1.binance.org:8545/',)
    // https://rinkeby.infura.io/v3/ef700abe941041fe8556c43d40f131ab https://ropsten.infura.io/v3/39f09bbfb5754cd480eee6c763227883
  };

  const getContractObject = async (tokenAddress, abi = TOKEN_ABI) => {
    //console.warn('MM','tokenAddress:::getContractObject', tokenAddress);
    try {
      const web3Object = getWeb3Object();
      let tokenContractObject = await new web3Object.eth.Contract(abi, tokenAddress,);
      return tokenContractObject;
    } catch (e) {
      console.error('error ===>>', e);
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

  const getUserBal = async ({ tokenFirst }) => {
    try {
      //console.warn('MM','-------------userAddress-------------', userAddress);
      //console.warn('MM','===>>', tokenFirst);
      const web3Object = getWeb3Object();
      if (tokenFirst?.is_token == 0) {
        let ethBal = await web3Object.eth.getBalance(userAddress);
        //console.warn('MM','user ethBal ===>>', ethBal / 10 ** tokenFirst.decimals, 'in wei ', ethBal,);
        const value = ethBal / 10 ** tokenFirst.decimals;
        setUserBal(Singleton.getInstance().toFixed(value, 8));
        setUserEthBal(Singleton.getInstance().toFixed(value, 8));
        setLoading(false);
        return ethBal;
      }
      let userBal = await getTokenBalance(tokenFirst.token_address, userAddress,);
      //console.warn('MM','***********************', Singleton.getInstance().exponentialToDecimal(userBal),);
      //console.warn('MM','***********************', userBal);
      let ethBal = await web3Object.eth.getBalance(userAddress);
      setUserBal(+Singleton.getInstance().toFixed(userBal / 10 ** tokenFirst.decimals, 8,));
      setUserEthBal(+Singleton.getInstance().toFixed(ethBal / 10 ** tokenFirst.decimals, 8),);
      //console.warn('MM','user ethBal ===>>tok', userBal / 10 ** tokenFirst.decimals, 'in wei ', userBal,);
      setLoading(false);
      return +userBal;
    } catch (error) {
      setLoading(false);
    }
  };
  const approveTransaction = async (tokenContractObject, spenderAddress, userAddress, tokenAddress,) => {
    //console.warn('MM','\n\n\n **** APPROVED TRANSACTION ALERT ***** \n\n\n');
    //console.warn('MM','**** APPROVED TRANSACTION ALERT **', spenderAddress, userAddress, tokenAddress);
    const web3Object = getWeb3Object();
    const approveTrans = tokenContractObject.methods.approve(spenderAddress, BigNumber(10 ** 25).toFixed(0));
    //console.warn('MM','approveTrans ===>>>', approveTrans);
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

  const checkContractApprovalMultiple = async (path, result) => {
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

  const getAmountsInOut = async (
    tokenFirstDecimals,
    tokenSecondDecimals,
    amount,
    type,
    path,
  ) => {
    //console.warn('MM','amount ==>> ', tokenFirstDecimals, tokenSecondDecimals, amount, type, path);
    try {
      setInsufficientBalance(false);
      let decimals = type == SELECTED_INPUT.firstInput ? tokenFirstDecimals : tokenSecondDecimals;
      const addAmountIn = (amount * (1 * 10 ** decimals)).toFixed(0);
      //console.warn('MM','amount ==>> ', amount, '===>>', addAmountIn);
      let calAmount = BigNumber(addAmountIn).toFixed();
      let routerContractObject = await getContractObject(routerAddress, ROUTER_ABI,);
      //console.warn('MM','=====TK1= SELECTED_INPUT', type, SELECTED_INPUT, SELECTED_INPUT.firstInput,);

      let result;
      if (type == SELECTED_INPUT.firstInput) {
        //console.warn('MM','=====TK1========= getAmountsOut', calAmount, path);
        result = await routerContractObject.methods
          .getAmountsOut(calAmount, path)
          .call();
      } else {
        //console.warn('MM','=====TK2========= getAmountsIn');
        result = await routerContractObject.methods
          .getAmountsIn(calAmount, path)
          .call();
      }
      //console.warn('MM','+++++++++++', result);
      return { result };
    } catch (err) {

      //console.warn('MM',"eeeeeeee   ==== >>>> " + err.message);
      setLoading(false);
      if (err.message.includes('INSUFFICIENT_LIQUIDITY')) {
        setInsufficientBalance(true);
      }
    }
  };


  const getCoinPair = async (tokenFirst, tokenSecond, value, type, path,) => {
    // factory address = 0x35113a300ca0D7621374890ABFEAC30E88f214b1
    if (tokenFirst.coin_symbol.toLowerCase() == "eth" || tokenSecond.coin_symbol.toLowerCase() == "eth") {
      try {
        setLoading(true);
        let routerContractObject = await getContractObject(factoryAddress, SAITAROUTER_ABI,);
        let result = await routerContractObject.methods
          .getPair(tokenFirst.token_address, tokenSecond.token_address)
          .call();
        //console.warn('MM',">>>>> result getPair >> ", result);
        let PairrouterContractObject = await getContractObject(result, PAIR_ABI,);
        let reserve = await PairrouterContractObject.methods
          .getReserves()
          .call();
        //console.warn('MM',">>>>> result getReserves >> ", reserve, reserve._reserve0, reserve._reserve1);
        let Token0 = await PairrouterContractObject.methods
          .token0()
          .call();
        const Token0AddressObject = coinList.find(o => o.token_address.toLowerCase() == Token0.toLowerCase())
        let decimal0 = Token0AddressObject.decimals;
        let Token1 = await PairrouterContractObject.methods
          .token1()
          .call();
        let reserve0 = reserve._reserve0;
        let reserve1 = reserve._reserve1;
        const Token1AddressObject = coinList.find(o => o.token_address.toLowerCase() == Token1.toLowerCase())
        let decimal1 = Token1AddressObject.decimals;
        let value0 = reserve0 / (10 ** decimal0);
        let value1 = reserve1 / (10 ** decimal1);
        //console.warn('MM',">>>>> value0 >> ", value0, value1);
        let ratio;
        if (selectedInput == SELECTED_INPUT.firstInput) {
          //console.warn('MM',">>>>> selectedInput >> 11 ",selectedInput);
          if (tokenFirst.token_address.toLowerCase() == Token0.toLowerCase()) {
            ratio = value1 / value0;
          } else {
            ratio = value0 / value1;
          }
        }
        else {
          //console.warn('MM',">>>>> selectedInput >> 11 ",selectedInput);
          if (tokenSecond.token_address.toLowerCase() == Token0.toLowerCase()) {
            ratio = value1 / value0;
          } else {
            ratio = value0 / value1;
          }
        }
        setLoading(false);
        if (type == SELECTED_INPUT.firstInput) {
          //  getSlippage(value * (10 ** tokenFirst.decimals), ratio * value * (10 ** tokenSecond.decimals))
          slippage1 = value * (10 ** tokenFirst.decimals)
          slippage2 = (ratio * value) * (10 ** tokenSecond.decimals)
        } else {
          //getSlippage(ratio * value * (10 ** tokenFirst.decimals), value * (10 ** tokenSecond.decimals))
          slippage1 = ratio * value * (10 ** tokenFirst.decimals)
          slippage2 = value * (10 ** tokenSecond.decimals)
        }
        //console.warn('MM',"eeeeeeee   ==== ratio ", ratio);
        // setRatio(ratio)
        return ratio
      } catch (err) {
        //console.warn('MM',"eeeeeeee   ==== >>>> " + err.message);
        setLoading(false);
      }
    } else {
      //console.warn('MM',">>>>> result getPair inside token>> ");
      setLoading(true);
      let routerContractObject = await getContractObject(factoryAddress, SAITAROUTER_ABI,);
      try {
        let result = await routerContractObject.methods
          .getPair(tokenFirst.token_address, tokenSecond.token_address)
          .call();
        //console.warn('MM',">>>>> result getPair >> ", result);
        if (result == "0x0000000000000000000000000000000000000000") {
          setLoading(false);
          Singleton.showAlert("You are the first liquidity provider.The ratio of tokens you add will set the price of this pool.Once you are happy with the rate click supply to review.")
          return
        }
        let PairrouterContractObject = await getContractObject(result, PAIR_ABI,);
        let reserve = await PairrouterContractObject.methods
          .getReserves()
          .call();

        let Token0 = await PairrouterContractObject.methods
          .token0()
          .call();
        let Token1 = await PairrouterContractObject.methods
          .token1()
          .call();

        //console.warn('MM',">>>>> token0 token1 Reserves >> ", reserve._reserve0, reserve._reserve1, Token0, Token1);
        const Token0AddressObject = coinList.find(o => o.token_address.toLowerCase() == Token0.toLowerCase())
        let decimal0 = Token0AddressObject.decimals;
        let reserve0 = reserve._reserve0;
        let reserve1 = reserve._reserve1;
        //console.warn('MM',">>>>> token0 token1 Reserves >>1111 ")
        const Token1AddressObject = coinList.find(o => o.token_address.toLowerCase() == Token1.toLowerCase())
        let decimal1 = Token1AddressObject.decimals;
        let value0 = reserve0 / (10 ** decimal0);
        let value1 = reserve1 / (10 ** decimal1);
        //console.warn('MM',">>>>> token0 token1 Reserves >>2222 ")
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
          //  getSlippage(value * (10 ** tokenFirst.decimals), ratio * value * (10 ** tokenSecond.decimals))
          slippage1 = value * (10 ** tokenFirst.decimals)
          slippage2 = (ratio * value) * (10 ** tokenSecond.decimals)
        } else {
          //getSlippage(ratio * value * (10 ** tokenFirst.decimals), value * (10 ** tokenSecond.decimals))
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

  const onChangeText = async ({ tokenFirst, tokenSecond, type, value }) => {
    let prvtKey = privateKey;
    setPrivateKey(prvtKey);

    return new Promise((resolve, reject) => {
      setInsufficientBalance(false);
      getWeb3Object()
        .eth.getGasPrice()
        .then(async gasPrice => {
          const userBal = await getUserBal({ tokenFirst, tokenSecond });
          if (!value || parseFloat(value) <= 0) {
            //empty value
            type == SELECTED_INPUT.firstInput
              ? setTokenTwoAmount('')
              : setTokenOneAmount('');
            setLoading(false);
            return;
          }

          const firstAddress = tokenFirst.coin_symbol.toLowerCase() == constants.COIN_SYMBOL.ETH ? WETH : tokenFirst.token_address;
          const secondAddress = tokenSecond.coin_symbol.toLowerCase() == constants.COIN_SYMBOL.ETH ? WETH : tokenSecond.token_address;
          let path = [firstAddress, secondAddress];
          //console.warn('MM','chk path::::::', path);
          //console.warn('MM','chk path:::::: tokenFirst', tokenFirst);
          //console.warn('MM','chk path:::::: tokenSecond', tokenSecond);
          //  const { result } = await getAmountsInOut(tokenFirst.decimals, tokenSecond.decimals, value, type, path,);

          const result = await getCoinPair(tokenFirst, tokenSecond, value, type, path,);
          setRatio(result)
          // setTimeout(() => {
          //   alert(ratiofetched.toString())
          // }, 2000);
          //console.warn('MM','result >> result >>', result, value);
          if (type == SELECTED_INPUT.firstInput) {
            //console.warn('MM','result >> type', type, value);
            setTokenTwoAmount(`${Singleton.getInstance().toFixed(result * value, 6,)}`);
            fetchedTokenTwoValue = Singleton.getInstance().toFixed(result * value, 6,)
            fetchedTokenOneValue = value
            //console.warn('MM','result >> fetchedTokenTwoValue', fetchedTokenTwoValue, fetchedTokenOneValue);
          } else {
            //console.warn('MM','result >> type', type, value);
            setTokenOneAmount(`${Singleton.getInstance().toFixed(result * value, 6,)}`,);
            fetchedTokenOneValue = Singleton.getInstance().toFixed(result * value, 6,)
            fetchedTokenTwoValue = value
            //console.warn('MM','result >> fetchedTokenOneValue', fetchedTokenOneValue, fetchedTokenTwoValue);
          }
          const routerContractObject = await getContractObject(routerAddress, ROUTER_ABI,);


          const amountAMin = BigNumber(slippage1 - (slippage1 * SLIPPERAGE_PERCENTAGE) / 100,).toFixed(0);
          const amountBMin = BigNumber(slippage2 - (slippage2 * SLIPPERAGE_PERCENTAGE) / 100,).toFixed(0);
          let deadline = Math.floor(new Date().getTime() / 1000);
          //console.warn('MM','chk deadline11', deadline);
          deadline = deadline + TXN_COMPLETE_MAX_TIME * 60;

          if (userBal < result[0]) {
            setInsufficientBalance(true);
          } else {
            setInsufficientBalance(false);
          }
          let valueget = result * value;
          let TokenAddress;
          let TokenDecimal;
          if (tokenFirst.coin_symbol.toLowerCase() == constants.COIN_SYMBOL.ETH) {
            TokenAddress = tokenSecond.token_address
            TokenDecimal = tokenSecond.decimals
          }
          else {
            TokenAddress = tokenFirst.token_address
            TokenDecimal = tokenFirst.decimals
          }

          const isApproved = await checkContractApproval(TokenAddress, valueget);
          //console.warn('MM','isApproved ======>> ', isApproved, TokenAddress);
          if (!isApproved) {
            //console.warn('MM','isApproved ======>>  inside approved');
            let tokenContractObject = await getContractObject(path[0]);
            setAllowancetxnObj({ tokenContractObject: tokenContractObject, path: path[0], });
            tokenContractObject.methods
              .approve(routerAddress, BigNumber(10 ** 25).toFixed(0))
              .estimateGas({ from: userAddress })
              .then(gasEstimate => {
                setGasEstimate(gasEstimate + GAS_BUFFER);
                setLoading(false);
                setTransactionFee(Singleton.getInstance().toFixed(gasEstimate * gasPrice * GAS_FEE_MULTIPLIER, 6,),);
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
            let tokenvalueDesired = (valueget * (10 ** TokenDecimal)).toFixed(0)

            // //console.warn('MM','-----paramsvalueget-------', value, tokenOneAmount, tokenTwoAmount)
            // // always eth the value in estimate gas ,also in sendtransaction
            let ethValue = 0

            if (tokenFirst.coin_symbol.toLowerCase() == "eth") {
              ethValue = type == SELECTED_INPUT.firstInput ? value * (10 ** 18) : (ratiofetched * value) * (10 ** 18)
            } else if (tokenSecond.coin_symbol.toLowerCase() == "eth") {
              ethValue = type == SELECTED_INPUT.firstInput ? (ratiofetched * value) * (10 ** 18) : value * (10 ** 18)
            } else {
              ethValue = "0x0"
            }

            if (tokenFirst.coin_symbol.toLowerCase() == constants.COIN_SYMBOL.ETH || tokenSecond.coin_symbol.toLowerCase() == "eth") {
              //console.warn('MM','-----params------- eth', tokenSecond.token_address, tokenvalueDesired,
              // amountBMin.toString(), amountAMin.toString(),
              //   userAddress, deadline, "ethValue " + ethValue);
              liquidityTransaction = await routerContractObject.methods.addLiquidityETH
                (TokenAddress, tokenvalueDesired, amountBMin.toString(), amountAMin.toString(),
                  userAddress, deadline);

              liquidityTransaction
                .estimateGas({ from: userAddress, value: (ethValue.toFixed(0)) })
                .then(gasEstimate => {
                  //console.warn('MM','-----estimateGas-------', gasEstimate);
                  setInsufficientBalance(false);
                  setGasEstimate(gasEstimate + GAS_BUFFER);
                  setTransactionFee(Singleton.getInstance().toFixed(gasEstimate * gasPrice * GAS_FEE_MULTIPLIER, 6,),);
                  //console.warn('MM','Singleton.getInstance().toFixed(((gasEstimate) * gasPrice * GAS_FEE_MULTIPLIER:::', gasEstimate * gasPrice * GAS_FEE_MULTIPLIER,);
                  setRawTxnObj({ type: tokenFirst.coin_symbol.toLowerCase(), data: liquidityTransaction.encodeABI(), value: amountAMin.toString(), });
                  setLoading(false);
                  return resolve(gasEstimate);
                })
                .catch(err => {
                  //console.warn('MM',err.message);
                  setLoading(false);
                  if (err.message.includes('insufficient funds')) {
                    setInsufficientBalance(true);
                  }
                });
            } else {
              //console.warn('MM',">>>>>>tokenOneAmount 111", fetchedTokenOneValue, fetchedTokenTwoValue)
              liquidityTransaction = await routerContractObject.methods.addLiquidity
                (tokenFirst.token_address, tokenSecond.token_address, fetchedTokenOneValue * (10 ** 9)
                  , fetchedTokenTwoValue * (10 ** 9), amountAMin.toString(), amountBMin.toString(),
                  userAddress, deadline);

              //console.warn('MM','-----params------- token', tokenFirst.token_address, tokenSecond.token_address, fetchedTokenOneValue * (10 ** 9)
              //           , fetchedTokenTwoValue * (10 ** 9), amountAMin.toString(), amountBMin.toString(),
              // userAddress, deadline);

              liquidityTransaction
                .estimateGas({ from: userAddress, value: ethValue })
                .then(gasEstimate => {
                  //console.warn('MM','-----estimateGas-------', gasEstimate);
                  setInsufficientBalance(false);
                  setGasEstimate(gasEstimate + GAS_BUFFER);
                  setTransactionFee(Singleton.getInstance().toFixed(gasEstimate * gasPrice * GAS_FEE_MULTIPLIER, 6,),);
                  //console.warn('MM','Singleton.getInstance().toFixed(((gasEstimate) * gasPrice * GAS_FEE_MULTIPLIER:::', gasEstimate * gasPrice * GAS_FEE_MULTIPLIER,);
                  setRawTxnObj({ type: "token", data: liquidityTransaction.encodeABI(), value: amountAMin.toString(), });
                  setLoading(false);
                  return resolve(gasEstimate);
                })
                .catch(err => {
                  //console.warn('MM',err.message);
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
      chainId: constants.network == 'testnet' ?  parseInt(constants.CHAIN_ID_ETH) : 1,
    };

    //console.warn('MM','rawTransaction =>', rawTransaction);

    let txn = await web3Object.eth.accounts.signTransaction(
      rawTransaction,
      pvtKey,
    );
    let access_token = Singleton.getInstance().access_token;
    let blockChain = blockChain;
    let coin_symbol = tokenFirst.coin_symbol.toLowerCase();
    let data = {
      from: from.toLowerCase(),
      to: to,
      amount: tokenOneAmount,
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

    let result = await getWeb3Object().eth.sendSignedTransaction(
      serializedTran,
    );
    //console.warn('MM','serializedTran => result', result);
    data.tx_hash = result.transactionHash;
    await sendTransactionToBackend(data, Constants.NETWORK.ETHEREUM, value == '0x0' ? rawTxnObj?.tokenContractAddress : constants.COIN_SYMBOL.ETH,);
    return result;
    // return await dispatch(sendETH({ data, access_token, blockChain, coin_symbol })).then((res) => {
    //   setLoading(false)
    // }).catch((err) => {
    //   setLoading(false)
    //   Singleton.showAlert(err.message)
    // });
  };

  const getApproval = () => {
    approveTransaction(allownceTxnObj.tokenContractObject, routerAddress, userAddress, allownceTxnObj.path,
    ).then(resultApprove => {
      //console.warn('MM','approve send transaction response ==>>', resultApprove);
      setUserApproval(true);
    });
    // setTokenOneAmount('');
    // setTokenTwoAmount('');
  };

  const existingCoinList = text => {
    if (timer != undefined) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      searchExistingFilterFunction(text);
      Keyboard.dismiss();
    }, 800);
  };
  const searchFilterFunction = search => {
    const NameList = [];
    //  setNonExistingCoinList([]);
    setExistingCoinList([])
    if (search == '') {
      setExistingCoinList(coinList);
    } else {
      coinList.filter(value => {
        if (
          value.name.toLowerCase().includes(search.toLowerCase()) ||
          value.coin_symbol.toLowerCase().includes(search.toLowerCase())
        ) {
          NameList.push(value);
          setExistingCoinList(NameList);
        }
      });
    }
  };
  const nonExistingCoinList = text => {
    if (timer != undefined) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      searchFilterFunction(text);
      Keyboard.dismiss();
    }, 800);
  };

  const swap = async () => {
    //console.warn('MM','\n\n\n **** SWAP TRANSACTION ALERT ***** \n\n\n');
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
    getUserBal({ tokenFirst });
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
            setToggleSwap(false);
          },
        },
      ],
      { cancelable: false },
    );
    return result;
  };

  const sendTransactionToBackend = (
    data,
    blockChain = Constants.NETWORK.ETHEREUM,
    coin_symbol = constants.COIN_SYMBOL.ETH,
  ) => {
    return new Promise((resolve, reject) => {
      let access_token = Singleton.getInstance().access_token;

      //console.warn('MM','eth data::::', data);
      ////console.log(
      // 'eth data::::',
      //   `https://api.saita.pro/prod/api/v1/${blockChain}/${coin_symbol}/savetrnx`,
      //   access_token,
      //   );
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
    <Wrap>
      <View style={styles.roundView}>
        {tabstatus == 'Rezor Swap' && (
          <ScrollView style={styles.innerRoundView}>
            <View style={{ marginBottom: 40, paddingBottom: 20 }}>
              <Text style={{ color: '#CACACA' }}>You Send </Text>
              <SwapView
                onPress={() => {
                  setExistingCoinModal(true);
                  setSearch('');
                  setExistingCoinList(coinList);
                }}
                token={tokenFirst}
                defaultValue={tokenOneAmount}
                onChangeText={value => {
                  setSelectedInput(SELECTED_INPUT.firstInput);
                  setTokenOneAmount(value);
                  setToggleSwap(false);
                  setActiveIndex(-1);
                  //console.warn('MM','===>>>', value);
                  // onChangeText({
                  //   tokenFirst,
                  //   tokenSecond,
                  //   value,
                  //   type: SELECTED_INPUT.firstInput,
                  // });

                  onChangeText({ tokenFirst, tokenSecond, value, type: SELECTED_INPUT.firstInput, });

                }}
                userBal={userBal}
              />
              <View style={styles.receiveView}>
                <Text style={styles.receivetxt}>You Receive(Estimate)</Text>
                <TouchableOpacity
                  onPress={() => {
                    setLoading(true);
                    if (tokenSecond.isExist == false) {
                      Singleton.showAlert(
                        'Please add this token from add custom token screen to enable swaping',
                      );
                      setLoading(false);
                      return;
                    }
                    if (selectedInput == SELECTED_INPUT.firstInput) {
                      { 
                 //  console.warn('MM',"result >> tempValue 111"); 
                      }
                      if (toggleSwap) {
                        onChangeText({
                          tokenFirst: tokenSecond,
                          tokenSecond: tokenFirst,
                          value: tokenTwoAmount,
                          type: SELECTED_INPUT.firstInput,
                        });
                      } else {
                        onChangeText({
                          tokenFirst: tokenSecond,
                          tokenSecond: tokenFirst,
                          value: tokenOneAmount,
                          type: SELECTED_INPUT.secondInput,
                        });
                      }
                    } else {

                     
                  //  console.warn('MM',"result >> tempValue else");
                      
                      if (toggleSwap) {
                        onChangeText({
                          tokenFirst: tokenSecond,
                          tokenSecond: tokenFirst,
                          value: tokenOneAmount,
                          type: SELECTED_INPUT.secondInput,
                        });
                      } else {
                        onChangeText({
                          tokenFirst: tokenSecond,
                          tokenSecond: tokenFirst,
                          value: tokenTwoAmount,
                          type: SELECTED_INPUT.firstInput,
                        });
                      }
                    }
                    let temp = tokenFirst;
                    setTokenFirst(tokenSecond);
                    setTokenSecond(temp);
                    let tempValue = tokenOneAmount;
                    setTokenOneAmount(tokenTwoAmount);
                    setTokenTwoAmount(tempValue);
                    setToggleSwap(!toggleSwap);
                    setActiveIndex(undefined);
                  }
                  }>
                  <Image source={images.swapIcon} style={styles.swapIcon} />
                </TouchableOpacity>

                <Text style={styles.receiverighttext}>0</Text>
              </View>
              <SwapView
                onPress={() => {
                  setNonExistingCoinModal(true);
                  setSearch('');
                  setExistingCoinList(coinList);
                }}
                token={tokenSecond}
                defaultValue={tokenTwoAmount}
                onChangeText={value => {
                  setSelectedInput(SELECTED_INPUT.secondInput);
                  setToggleSwap(false);
                  // setTokenOneAmount(value);
                  setTokenTwoAmount(value);
                  setActiveIndex(-1);
                  //console.warn('MM','===>>>222', value);
                  onChangeText({
                    tokenFirst,
                    tokenSecond,
                    value,
                    type: SELECTED_INPUT.secondInput,
                  });
                }}
              />
              <Text style={{ color: Colors.white, margin: 10 }}>
                Prices and Pool Share
              </Text>

              <View style={{ borderColor: Colors.pink, borderWidth: 1, borderRadius: 10, flexDirection: 'column' }}>

                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                  <Text style={{ color: Colors.white, margin: 10 }}> 0.070 </Text>
                  <Text style={{ color: Colors.white, margin: 10 }}> 12.301910034  </Text>
                  <Text style={{ color: Colors.white, margin: 10 }}>  %  </Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                  <Text style={{ color: Colors.white, marginTop: 10 }}> ETH per BTC </Text>
                  <Text style={{ color: Colors.white, margin: 10 }}> BTC per ETH  </Text>
                  <Text style={{ color: Colors.white, margin: 10 }}>  BTC per ETH  </Text>
                </View>
              </View>

              <View style={{ borderColor: Colors.pink, borderWidth: 1, borderRadius: 10, flexDirection: 'column', marginTop: 10 }}>



                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={Images.eth_s}></Image>
                    <Image style={{ marginLeft: -12 }} source={Images.btc_s}></Image>
                    <Text style={{ color: Colors.white, margin: 10 }}> ETH/BTC </Text>
                  </View>

                  <Text style={{ color: Colors.white, margin: 10 }}> 0.0000 </Text>
                </View>


                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: Colors.white, margin: 10 }}> BTC </Text>
                  <Text style={{ color: Colors.white, margin: 10 }}> 0.00469743 </Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: Colors.white, margin: 10 }}> ETH </Text>
                  <Text style={{ color: Colors.white, margin: 10 }}> 0.0000 </Text>
                </View>
              </View>
              <BasicButton
                // onPress={()=> Actions.SwapScreen()}
                // onPress={() => !isInsufficientBalance && swap()}

                onPress={async () => {
                  //console.warn('MM',">>>>>>>>>> tokenOneAmount", tokenOneAmount, tokenTwoAmount);
                  if (tokenOneAmount == undefined || tokenOneAmount == 0) {
                    Singleton.showAlert('Please enter amount to swap');
                  } else if (tokenTwoAmount == undefined || tokenTwoAmount == 0) {
                    Singleton.showAlert(`${tokenFirst.name}'s equivalent amount to ${tokenSecond.name} is not received.`,);
                  } else if (parseFloat(userBal) > parseFloat(tokenOneAmount)) {
                    //console.warn('MM',">>>>>>>>>> isApproved", isApproved);
                    if (isApproved) {
                      let totalFee = (gasPrice * gasEstimate).toFixed(0);
                      //console.warn('MM',">>>>>>>>>> totalFee11", totalFee, totalFee * GAS_FEE_MULTIPLIER, rawTxnObj?.value);
                      const web3Object = getWeb3Object();
                      let ethBal = await web3Object.eth.getBalance(userAddress,);
                      //console.warn('MM',">>>>>>>>>> ethBal", ethBal);
                      if (rawTxnObj?.type == constants.COIN_SYMBOL.ETH) {
                        totalFee = await bigNumberSafeMath(totalFee, '+', rawTxnObj?.value,);
                        //console.warn('MM',">>>>>>>>>> totalFee", totalFee);
                      }
                      if (ethBal - Singleton.getInstance().exponentialToDecimal(totalFee) < 0) {
                        //console.warn('MM',">>>>>>>>>> ethBal", ethBal, Singleton.getInstance().exponentialToDecimal(totalFee));
                        Singleton.showAlert("You don't have enough eth to perform transaction",);
                        return;
                      }
                      setSwapModal(true);
                    } else {
                      let totalFee = (gasPrice * gasEstimate).toFixed(0);
                      const web3Object = getWeb3Object();
                      let ethBal = await web3Object.eth.getBalance(userAddress,);
                      if (ethBal - Singleton.getInstance().exponentialToDecimal(totalFee,) < 0) {
                        Singleton.showAlert("You don't have enough eth to perform transaction",);
                        return;
                      }
                      Alert.alert('Approval', `Pay ${(
                        gasPrice *
                        gasEstimate *
                        GAS_FEE_MULTIPLIER
                      ).toFixed(6,)} ETH transaction fee for token approval`,
                        [{
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
                }}
                title={
                  isInsufficientBalance
                    ? 'Insufficient Balance'
                    : isApproved
                      ? 'Add Liquidity'
                      : 'Approval'
                }
                btnStyle={[styles.btnStyle]}
                text={
                  isInsufficientBalance
                    ? 'Insufficient Balance'
                    : isApproved
                      ? 'Add Liquidity'
                      : 'Approval'
                }></BasicButton>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 30,
                }}>
                {BUTTONPERCENTAGELIST.map((item, index) => {
                  return (
                    <ButtonPercentage
                      customStyle={
                        index == activeIndex && {
                          backgroundColor: Colors?.buttonColor2,
                        }
                      }
                      title={item}
                      onPress={async () => {
                        setActiveIndex(index);
                        setToggleSwap(false);
                        setSelectedInput(SELECTED_INPUT.firstInput);
                        if (tokenFirst.is_token == 1) {

                          let balance = parseFloat(userBal);
                          if (index === 3) {
                            if (balance == 0) {
                              balance = 0;
                            } else {
                              balance = Singleton.getInstance().toFixed(balance - 0.0000009, 6).toString();
                            }
                          } else if (index !== 3) {
                            balance = Singleton.getInstance()
                              .toFixed(balance * (0.25 * (index + 1)), 6)
                              .toString();
                            //console.warn('MM',balance, 'balancebalance');
                          }
                          setTokenOneAmount(balance);
                          onChangeText({
                            tokenFirst: tokenFirst,
                            tokenSecond: tokenSecond,
                            value: balance,
                            type: SELECTED_INPUT.firstInput,
                          });
                        } else {
                          let balance = parseFloat(userEthBal);
                          //console.warn('MM',balance, 'balance--');
                          if (index == 3) {
                            if (balance <= 0) {
                              setTokenOneAmount(balance);
                            } else {
                              let amount = (balance - 0.0000001).toString();
                              const gasEstimate = await onChangeText({
                                tokenFirst: tokenFirst,
                                tokenSecond: tokenSecond,
                                value: amount,
                                type: SELECTED_INPUT.firstInput,
                              });
                              const totalFee =
                                gasEstimate * gasPrice * GAS_FEE_MULTIPLIER;
                              //console.warn('MM',totalFee, 'totalFess');
                              if (balance - totalFee < 0) {
                                setTokenOneAmount(
                                  Singleton.getInstance()
                                    .toFixed(balance, 6)
                                    .toString(),
                                );
                              } else {
                                setTokenOneAmount(
                                  Singleton.getInstance()
                                    .toFixed(balance - totalFee, 6)
                                    .toString(),
                                );
                                const data = balance - totalFee;
                                //console.warn('MM','==++++=>>>', data);
                              }
                            }
                          } else if (index != 3) {
                            let amount = Singleton.getInstance()
                              .toFixed(balance * (0.25 * (index + 1)), 6)
                              .toString();
                            //console.warn('MM',amount, 'aa----');
                            setTokenOneAmount(amount);
                            //console.warn('MM',tokenOneAmount, 'toktok');
                            onChangeText({
                              tokenFirst: tokenFirst,
                              tokenSecond: tokenSecond,
                              value: amount,
                              type: SELECTED_INPUT.firstInput,
                            });
                            //console.warn('MM','=--==----==>>>', amount);
                          }
                        }
                      }}
                    />
                  );
                })}
              </View>
            </View>
          </ScrollView>
        )}
      </View>


      <Modal
        animationType="slide"
        transparent={true}
        visible={NonExistingCoinModal}
        onRequestClose={() => { setNonExistingCoinModal(false); }}>
        <>
          <Wrap>
            {/* <MainHeader
              onpress3={() => Singleton.showAlert("HBJKLB")}
              styleImg3={{tintColor: '#B1B1B1',borderWidth:2,borderColor:'red',padding:10}}
              thridImg={images.cancel}
            /> */}
            <View
              style={{
                paddingTop: 25,
                flex: 1,
                backgroundColor: Colors.screenBg,
              }}>
              <InputtextSearch
                placeholder="Search"
                returnKeyType={'done'}
                search={!search ? true : false}
                clear={search ? true : false}
                pressClear={() => {
                  setSearch('');
                  searchFilterFunction('');
                }}
                onChangeNumber={text => {
                  setSearch(text);
                  nonExistingCoinList(text);
                }}
                value={search}
                style={{ backgroundColor: Colors.headerBg }}
              />
              <FlatList
                data={ExistingCoinList}
                showsVerticalScrollIndicator={false}
                bounces={false}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {

                      if (item.coin_symbol == tokenFirst.coin_symbol) {
                        return;
                        let temp = tokenSecond;
                        setTokenFirst(temp);
                        onChangeText({
                          tokenFirst: temp,
                          tokenSecond: item,
                          value: tokenOneAmount,
                          type: SELECTED_INPUT.firstInput,
                        });
                      } else {

                        onChangeText({
                          tokenFirst: tokenFirst,
                          tokenSecond: item,
                          value: tokenOneAmount,
                          type: SELECTED_INPUT.firstInput,
                        });
                      }
                      setTokenSecond(item);
                      setNonExistingCoinModal(false);
                    }}
                    style={styles.viewStyle}>
                    <Text style={styles.textstyle}>{item.name}</Text>
                    <FastImage
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        marginBottom: 10,
                      }}
                      source={{ uri: item.logoURI }}
                    />
                  </TouchableOpacity>
                )}
              />
            </View>
          </Wrap>
        </>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={ExistingCoinModal}
        onRequestClose={() => {
          setExistingCoinModal(false);
        }}>
        <>
          <Wrap>
            <MainHeader
              onpress3={() => setExistingCoinModal(false)}
              styleImg3={{ tintColor: '#B1B1B1' }}
              thridImg={images.cancel}
            />

            {/* <TouchableOpacity onPress={() => alert("dddddddddddd")}>
              <View style={{ backgroundColor: "red", alignItems: 'flex-end' }}>
                <Image style={{ height: 20, width: 20, margin: 10, tintColor: "white", }} source={images.cancel}>
                </Image>
              </View>
            </TouchableOpacity> */}

            <View
              style={{
                paddingTop: 25,
                flex: 1,
                backgroundColor: Colors.screenBg,
              }}>
              <InputtextSearch
                placeholder="Search"
                returnKeyType={'done'}
                search={!search ? true : false}
                clear={search ? true : false}

                pressClear={() => {
                  setSearch('');
                  searchFilterFunction('');
                }}
                onChangeNumber={text => {
                  setSearch(text);
                  nonExistingCoinList(text);
                }}
                value={search}
                style={{ backgroundColor: Colors.headerBg }}
              />
              <FlatList
                data={ExistingCoinList}
                showsVerticalScrollIndicator={false}
                bounces={false}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (

                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {


                      if (item.coin_symbol == tokenSecond.coin_symbol) {

                        let temp = tokenFirst;
                        setTokenSecond(temp);
                        onChangeText({
                          tokenFirst: item,
                          tokenSecond: temp,
                          value: tokenOneAmount,
                          type: SELECTED_INPUT.firstInput,
                        });
                      } else {

                        onChangeText({
                          tokenFirst: item,
                          tokenSecond: tokenSecond,
                          value: tokenOneAmount,
                          type: SELECTED_INPUT.firstInput,
                        });
                      }
                      setTokenFirst(item);
                      setExistingCoinModal(false);
                    }}

                  >

                    <View style={styles.viewStyle}>

                      <Text style={styles.textstyle}>{item.name}</Text>
                      <FastImage
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 16,
                          marginBottom: 10,
                        }}
                        resizeMode={FastImage.resizeMode.contain}
                        source={{ uri: item.logoURI }}
                      />
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          </Wrap>
        </>
      </Modal>

      {isLoading && <Loader smallLoader={false} />}

      {swapModal && (
        <ModalSwap
          toCoinName={tokenFirst.name}
          toCoinSymbol={tokenFirst.coin_symbol}
          fromCoinName={tokenSecond.name}
          fromCoinSymbol={tokenSecond.coin_symbol}
          toValue={tokenOneAmount}
          fromValue={tokenTwoAmount}
          symbol={'ETH'}
          txnFee={(gasPrice * gasEstimate * GAS_FEE_MULTIPLIER).toFixed(6)}
          onPress={() => {
            setSwapModal(false);
            setLoading(true);
            swap();
          }}
          onCancel={() => {
            setSwapModal(false);
          }}
        />
      )}
    </Wrap>
  );
};

// const EthClick = () => {

//   alert('eth')
// }
// const BnbClick = () => {
//   alert('bnb')
// }

const SwapView = ({ onPress, token, onChangeText, userBal, defaultValue }) => {
  const [sliderValue, setSliderValue] = useState(0);
  return (
    <View style={styles.swapView}>
      <View style={styles.swapinnerView}>
        <View style={{}}>
          <Text style={{ color: '#4D4D4D' }}></Text>
          <Text style={{ color: '#4D4D4D' }}></Text>
        </View>
        <TouchableOpacity
          onPress={onPress}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View>
            <Text style={styles.righttext}>{token?.coin_symbol}</Text>
            {userBal?.toString()?.length > 0 && (
              <Text style={{ color: '#4D4D4D' }}>{userBal}</Text>
            )}
          </View>
          <View>
            <Image
              resizeMode="contain"
              source={
                token?.logoURI
                  ? {
                    uri: token.logoURI,
                  }
                  : images.BtcIconSwap
              }
              style={styles.imgStyle}
            />
          </View>
        </TouchableOpacity>
      </View>
      <Inputtext
        inputStyle={{
          borderWidth: 1,
          borderColor: Colors.fadeDot,
          borderRadius: 5,
          width: '100%',
          color: Colors.white,
        }}
        keyboardType={'numeric'}
        placeholderTextColor={Colors.fadeDot}
        // labelStyle={styles.labelStyle}
        // label="Token Contract Address"
        placeholder="0.0000"
        defaultValue={defaultValue}
        onChangeNumber={text => {
          onChangeText(text);
          // updateContractAddress(text);
        }}
      />
      {/* <View style={styles.sliderView}>
        <Slider
          disabled={disabled}
          style={{width: 300, height: 40}}
          minimumValue={0}
          step={1}
          maximumValue={+userBal}
          minimumTrackTintColor="#C738B1"
          maximumTrackTintColor="#4D4D4D"
          thumbTintColor="#C738B1"
          value={defaultValue ? defaultValue : sliderValue}
          onSlidingComplete={sliderValue => {
            setSliderValue(sliderValue);
          }}
          onValueChange={sliderValue => {
            setSliderValue(sliderValue);
            onSlidingComplete(
              Singleton.getInstance().exponentialToDecimal(sliderValue),
            );
          }}
        />
      </View> */}
    </View>
  );
};

export default SwapScreen;