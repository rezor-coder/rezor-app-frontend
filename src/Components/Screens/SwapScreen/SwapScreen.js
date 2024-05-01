import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  ScrollView,
  Dimensions,
  Alert,
  Modal,
  SafeAreaView,
  FlatList,
  Keyboard, TouchableOpacity
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import images from '../../../theme/Images';
import { styles } from './SwapScreenStyle';
import { Inputtext, InputtextSearch, MainHeader } from '../../common';
import LinearGradient from 'react-native-linear-gradient';
// import { TouchableOpacity } from 'react-native-gesture-handler';
import { Wrap, BasicButton } from '../../common/index';
import Slider from '@react-native-community/slider';
import TOKEN_ABI from '../../../../ABI/tokenContract.ABI.json';
import ROUTER_ABI from '../../../../ABI/router.ABI.json';
// import Token_List from '../../../../ABI/tokensList';
import Web3 from 'web3';
import Singleton from '../../../Singleton';
import { CONTACT_SAVED } from '../../../Constant';
import { BigNumber } from 'bignumber.js';
import { Colors } from '../../../theme';
import { ButtonPercentage } from '../../common/ButtonPercentage';
import * as constants from '../../../Constant';
import { ModalSwap } from '../../common/ModalSwap';
import Loader from '../Loader/Loader';
import FastImage from 'react-native-fast-image';
import { APIClient } from '../../../Api';
import { getSwapList } from '../../../Redux/Actions';
import { Tab, Tabs } from 'native-base';
import { connect, useDispatch, useSelector } from 'react-redux';
import { BASE_URL } from '../../../Endpoints';
import { bigNumberSafeMath } from '../../../utils';

// let routerAddress = '0x0c17e776CD218252ADFca8D4e761D3fe757e9778'; // mainnet saitaswap router address 
// let WETH = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'  // Using Wrapped Ether (WETH) contract address to get ETH equivalent balance
const GAS_FEE_MULTIPLIER = 0.000000000000000001;
const SLIPPERAGE_PERCENTAGE = 10; //in percent
const TXN_COMPLETE_MAX_TIME = 20; //in minutes
const SELECTED_INPUT = { firstInput: 'firstInput', secondInput: 'secondInput', };
const GAS_BUFFER = 10000;
const BUTTONPERCENTAGELIST = ['25%', '50%', '75%', '100%'];
let timer = undefined;

const SwapScreen = ({ slippage, timeout }) => {
  let routerAddress = Singleton.getInstance().SwapRouterAddress; // mainnet saitaswap router address 
  let WETH = Singleton.getInstance().SwapWethAddress  // Using Wrapped Ether (WETH) contract address to get ETH equivalent balance
  let userAddress = Singleton.getInstance().defaultEthAddress;
  const [tabstatus, setTabSatus] = useState('Saita Swap');
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

  const [allownceTxnObj, setAllowancetxnObj] = useState({});
  const [transactionFee, setTransactionFee] = useState('0.00');

  // const [coinList, setCoinList] = useState(Token_List);
  // // const [tokenFirst, setTokenFirst] = useState(Token_List[0]);
  // // const [tokenSecond, setTokenSecond] = useState(Token_List[1]);
  // const [tokenFirst, setTokenFirst] = useState(coinList[0]);
  // const [tokenSecond, setTokenSecond] = useState(coinList[1]);
  const [coinList, setCoinList] = useState();
  const [tokenFirst, setTokenFirst] = useState();
  const [tokenSecond, setTokenSecond] = useState();

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

    getGasPrice();
    getSwapListApi();
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
    setLoading(true)
    let access_token = Singleton.getInstance().access_token;
    dispatch(getSwapList({ access_token }))
      .then(res => {
        setCoinList(res.data)
        setTimeout(() => {
          getUserBal(res.data[0]);
        }, 1500);
        setTokenFirst(res.data[0])
        setTokenSecond(res.data[1])
        //console.warn('MM','res :::::::::', res.data[0]);
        setLoading(true)
      })
      .catch(err => {
        setLoading(false)
        //console.warn('MM','err price:::::::::', err);
      });
  }
  const getWeb3Object = () => {
    return constants.network == 'mainnet'
      ? new Web3(
        'https://mainnet.infura.io/v3/39f09bbfb5754cd480eee6c763227883',
      )
      : new Web3(
        ' https://rinkeby.infura.io/v3/ef700abe941041fe8556c43d40f131ab',
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

  const getUserBal = async (tokenFirst) => {
    try {
      //console.warn('MM','-------------userAddress-------------', userAddress);
      //console.warn('MM','===>>getUserBal', tokenFirst);
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
    const approveTrans = tokenContractObject.methods.approve(spenderAddress, BigNumber(10 ** 25).toFixed(0),);
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

  const checkContractApproval = async ({ path, result }) => {
    //console.warn('MM','checkContractApproval****', path, result);
    let tokenContractObject = await getContractObject(path[0]);

    let userTokenBal = await tokenContractObject.methods
      .balanceOf(userAddress)
      .call();
    //console.warn('MM','userTokenBal ==>>>', userTokenBal);
    let allowance = await tokenContractObject.methods
      .allowance(userAddress, routerAddress)
      .call();
    //console.warn('MM','allowance ==>>>', allowance);
    if (BigNumber(allowance).toFixed(0) <= parseInt(result[0])) {
      setUserApproval(false);
      return false;
    } else {
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

  const onChangeText = async ({ tokenFirst, tokenSecond, type, value }) => {
    let prvtKey = privateKey;
    setPrivateKey(prvtKey);
    return new Promise((resolve, reject) => {
      setInsufficientBalance(false);
      getWeb3Object()
        .eth.getGasPrice()
        .then(async gasPrice => {
          const userBal = await getUserBal(tokenFirst, tokenSecond);
          if (!value || parseFloat(value) <= 0) {
            //empty value
            type == SELECTED_INPUT.firstInput
              ? setTokenTwoAmount('')
              : setTokenOneAmount('');
            setLoading(false);
            return;
          }
          const firstAddress = tokenFirst.coin_symbol.toLowerCase() == 'eth' ? WETH : tokenFirst.token_address;
          const secondAddress = tokenSecond.coin_symbol.toLowerCase() == 'eth' ? WETH : tokenSecond.token_address;
          let path = [firstAddress, secondAddress];
          //console.warn('MM','chk path::::::', path);
          //console.warn('MM','chk path:::::: tokenFirst', tokenFirst);
          //console.warn('MM','chk path:::::: tokenSecond', tokenSecond);
          const { result } = await getAmountsInOut(tokenFirst.decimals, tokenSecond.decimals, value, type, path,);
          //console.warn('MM','result >>', result);
          if (type == SELECTED_INPUT.firstInput) {
            //console.warn('MM','result >> type', type);
            setTokenTwoAmount(`${Singleton.getInstance().toFixed(result[1] / 10 ** tokenSecond.decimals, 6,)}`,);
          } else {
            //console.warn('MM','result >> type', type);
            setTokenOneAmount(`${Singleton.getInstance().toFixed(result[0] / 10 ** tokenFirst.decimals, 6,)}`,);
          }
          const routerContractObject = await getContractObject(routerAddress, ROUTER_ABI,);
          const amountAMin = BigNumber(result[0]).toFixed(0);
          const amountBMin = BigNumber(result[1] - (result[1] * SLIPPERAGE_PERCENTAGE) / 100,).toFixed(0);
          //console.warn('MM','amountBMin >>', amountBMin);
          let deadline = Math.floor(new Date().getTime() / 1000);
          deadline = deadline + TXN_COMPLETE_MAX_TIME * 60;
          //console.warn('MM','chk userBal:::::: userBal', userBal);
          //console.warn('MM','chk result:::::: result', result[0]);
          if (userBal < result[0]) {
            setInsufficientBalance(true);
          } else {
            setInsufficientBalance(false);
          }


          if (tokenFirst.coin_symbol.toLowerCase() == 'eth') {
            // ETH to Token 
            setUserApproval(true);
            let swapTransaction;
            if (type == SELECTED_INPUT.firstInput) {
              swapTransaction = await routerContractObject.methods.swapExactETHForTokens(amountBMin.toString(), path, userAddress, deadline,);
            }
            else if (type == SELECTED_INPUT.secondInput) {
              swapTransaction = await routerContractObject.methods.swapETHForExactTokens(amountBMin.toString(), path, userAddress, deadline,);
            }
            //console.warn('MM','-----swapExactETHForTokens-------', amountBMin.toString(), path, userAddress, deadline);
            swapTransaction
              .estimateGas({ from: userAddress, value: amountAMin.toString() })
              .then(gasEstimate => {
                //console.warn('MM','-----estimateGas-------', gasEstimate);
                setInsufficientBalance(false);
                setGasEstimate(gasEstimate + GAS_BUFFER);
                setTransactionFee(Singleton.getInstance().toFixed(gasEstimate * gasPrice * GAS_FEE_MULTIPLIER, 6,),);
                //console.warn('MM','Singleton.getInstance().toFixed(((gasEstimate) * gasPrice * GAS_FEE_MULTIPLIER:::', gasEstimate * gasPrice * GAS_FEE_MULTIPLIER,);
                setRawTxnObj({ type: tokenFirst.coin_symbol.toLowerCase(), data: swapTransaction.encodeABI(), value: amountAMin.toString(), });
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
            const isApproved = await checkContractApproval({ path, result });
            //console.warn('MM','isApproved ======>>', isApproved);
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
            }
            //console.warn('MM','isApproved ======>>  after approved');
            if (tokenSecond.coin_symbol.toLowerCase() == 'eth') {
              // Token to ETH swapExactTokensForETH
              //console.warn('MM','Token to ETH ======>>', amountAMin.toString(), amountBMin.toString(), path, userAddress, deadline,);
              let swapTransaction
              if (type == SELECTED_INPUT.firstInput) {
                swapTransaction = await routerContractObject.methods.swapExactTokensForETH(amountAMin.toString(), amountBMin.toString(), path, userAddress, deadline,);
              }
              else if (type == SELECTED_INPUT.secondInput) {
                swapTransaction = await routerContractObject.methods.swapTokensForExactETH(amountAMin.toString(), amountBMin.toString(), path, userAddress, deadline,);
              }
              //console.warn('MM','swapTransaction>', amountAMin.toString(), amountBMin.toString(), path, userAddress, deadline,);
              swapTransaction
                .estimateGas({ from: userAddress })
                .then(gasEstimate => {
                  setGasEstimate(gasEstimate + GAS_BUFFER);
                  setRawTxnObj({
                    type: 'token',
                    data: swapTransaction.encodeABI(),
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
                  //console.warn('MM','www', err.message);
                  setLoading(false);
                  if (err.message.includes('insufficient funds')) {
                    setInsufficientBalance(true);
                  }
                });
            } else {

              // Token to Token
              let swapTransaction
              //console.warn('MM','swapTransaction>', amountAMin.toString(), amountBMin.toString(), path, userAddress, deadline,);
              if (type == SELECTED_INPUT.firstInput) {
                swapTransaction = await routerContractObject.methods.swapExactTokensForTokens(amountAMin.toString(), amountBMin.toString(), path, userAddress, deadline,);
              }
              else if (type == SELECTED_INPUT.secondInput) {
                swapTransaction = await routerContractObject.methods.swapTokensForExactTokens(amountAMin.toString(), amountBMin.toString(), path, userAddress, deadline,);
              }
              swapTransaction
                .estimateGas({ from: userAddress })
                .then(gasEstimate => {
                  setGasEstimate(gasEstimate + GAS_BUFFER);
                  setRawTxnObj({
                    type: 'token',
                    data: swapTransaction.encodeABI(),
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
                  //console.warn('MM',err.message);
                  setLoading(false);
                  if (err.message.includes('insufficient funds')) {
                    setInsufficientBalance(true);
                  }
                });
            }
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
      chainId:  constants.network == 'testnet' ? parseInt(constants.CHAIN_ID_ETH)  : 1,
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

    data.tx_hash = result.transactionHash;
    await sendTransactionToBackend(data, 'ethereum', value == '0x0' ? rawTxnObj?.tokenContractAddress : 'eth',);
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
    getUserBal(tokenFirst);
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
  // await sendTransactionToBackend(data, 'ethereum', value == '0x0' ? rawTxnObj?.tokenContractAddress : 'eth',);
  const sendTransactionToBackend = (
    data,
    blockChain = 'ethereum',
    coin_symbol = 'eth',
  ) => {
    return new Promise((resolve, reject) => {
      let access_token = Singleton.getInstance().access_token;

      //console.warn('MM','eth data::::', data);
      ////console.log(
      // 'eth data::::',
      //   `https://api.saita.pro/prod/api/v1/${blockChain}/${coin_symbol}/savetrnx`,
      //   access_token,
      // );
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
        {tabstatus == 'Saita Swap' && (
          <ScrollView style={styles.innerRoundView}>
            <View style={{ marginBottom: 40, paddingBottom: 20 }}>
              <Text style={{ color: '#CACACA' }}>You Send</Text>
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
                  onChangeText({
                    tokenFirst,
                    tokenSecond,
                    value,
                    type: SELECTED_INPUT.firstInput,
                  });
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
                      // { console.warn('MM',"result >> tempValue 111"); }
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

                      // { console.warn('MM',"result >> tempValue else"); }
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
                  //console.warn('MM','===>>>', value);
                  onChangeText({
                    tokenFirst,
                    tokenSecond,
                    value,
                    type: SELECTED_INPUT.secondInput,
                  });
                }}
              />
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
                      if (rawTxnObj?.type == 'eth') {
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
                      ? 'Swap'
                      : 'Approval'
                }
                btnStyle={[styles.btnStyle]}
                text={
                  isInsufficientBalance
                    ? 'Insufficient Balance'
                    : isApproved
                      ? 'Swap'
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
                      customStyle={index == activeIndex && { backgroundColor: Colors?.buttonColor2, }}
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
                      source={{ uri: item.coin_image }}
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
                        source={{ uri: item.coin_image }}
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
                token?.coin_image
                  ? {
                    uri: token.coin_image,
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