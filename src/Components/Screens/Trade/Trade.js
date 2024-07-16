import { BigNumber } from 'bignumber.js';
import LottieView from 'lottie-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  BackHandler,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import Web3 from 'web3';
import HOUBI_ABI from '../../../../ABI/Houbi.ABI.json';
import TOKEN_ABI from '../../../../ABI/tokenContract.ABI.json';
import { ThemeManager } from '../../../../ThemeManager';
import Done from '../../../../assets/images/Done.json';
import { APIClient } from '../../../Api';
import * as constants from '../../../Constant';
import {
  HUOBI_CHECK_SWAP,
  HUOBI_FETCH_CHAIN,
  HUOBI_FETCH_FEE,
  HUOBI_FIND_TOKEN_FOR_CURRENCY,
  HUOBI_SWAP,
} from '../../../Endpoints';
import Singleton from '../../../Singleton';
import { areaDimen, heightDimen } from '../../../Utils/themeUtils';
import { getCurrentRouteName, goBack } from '../../../navigationsService';
import { Colors, Fonts, Images } from '../../../theme';
import { CommaSeprator3, exponentialToDecimalWithoutComma } from '../../../utils';
import {
  BasicButton,
  BorderLine,
  MainStatusBar,
  SimpleHeader,
  Wrap,
} from '../../common';
import { ModalTradeTx } from '../../common/ModalTradeTx';
import Loader from '../Loader/Loader';
import styles from './TradeStyle';

const SWAP_CONTRACT_ADDRESS = constants.network == 'testnet' ? '0x01c3fD2d4367cc4f85276E9E1638BF1E149f3eFe' : "0x28C4b64A442a31C9E743d65c7FECAC9E7B8D3Dcd";
const GAS_PRICE_BUFFER = 4000000000;
const feePerSwap = 0.005;
const feeForSpot = 0.002;
const sellFeePrice = 5;
const buyFeePrice = 10;
const buyMinimumAmount = 20;
const GAS_BUFFER = 10000;
const GAS_FEE_MULTIPLIER = 0.000000000000000001;

export default function Trade(props) {
  const [tab, setTab] = useState('buy');
  const [isPopUp, setIsPopUp] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState(props?.route?.params?.item);
  const [isLoading, setIsLoading] = useState(false);
  const [minBuyAmount, setMinBuyAmount] = useState(0);
  const [minSellAmount, setMinSellAmount] = useState(0);
  const [userbalance, setUserbalance] = useState(0);
  const [gasEstimate, setGasEstimate] = useState(0);
  const [gasPrice, setGasPrice] = useState('');
  const [userApproval, setUserApproval] = useState(false);
  const [ethBalance, setEthBalance] = useState('');
  const [chain, setChain] = useState('');
  const timer = useRef();
  const [payableAmount, setpayableAmount] = useState();
  const [feeData, setFeeData] = useState({
    fee: '0',
    minimumWithdraw: '0',
    precision: 0,
    price: { Buy: 0, Sell: 0 },
  });
  const [amount, setAmount] = useState('0');
  const [isTabChanged, setisTabChanged] = useState(false)
  const [userAddress, setuserAddress] = useState('');
  const [swapModal, setSwapModal] = useState(false);
  const [rawTxnObj, setRawTxnObj] = useState({});

  /******************************************************************************************/
  useEffect(() => {
    fetchChain()
  }, [tab])

  /******************************************************************************************/
  useEffect(() => {
    let backHandle = null;
    backHandle = BackHandler.addEventListener('hardwareBackPress', backAction);
    setuserAddress(Singleton.getInstance().defaultEthAddress);
    balance(Singleton.getInstance().defaultEthAddress);
    let focus = props.navigation.addListener('focus', () => {
      backHandle = BackHandler.addEventListener('hardwareBackPress', backAction);
      setIsPopUp(false)
      setSwapModal(false)
    })
    let blur = props.navigation.addListener('blur', () => {
      backHandle?.remove()
    })
    return () => {
      focus()
      backHandle?.remove();
    }
  }, []);
  const backAction=()=>{
    goBack();
    return true;
  }
  /******************************************************************************************/
  const balance = async address => {
    try {
      const web3Object = getWeb3Object();
      let ethBal = await web3Object.eth.getBalance(address);
      let gas_price = await web3Object.eth.getGasPrice();
      gas_price = (parseInt(gas_price) + GAS_PRICE_BUFFER).toString()
      setGasPrice(gas_price);
      setEthBalance(ethBal);
      console.log('MM', 'data ======>>  ethBal ', ethBal, address);
    } catch (error) {
      console.log('error in balance', error);
    }
  };

  /******************************************************************************************/
  async function fetchChain(selected_Coin = selectedCoin) {
    setIsLoading(true);
    APIClient.getInstance().postHuobi(HUOBI_FETCH_CHAIN, {
      currency: tab == 'buy' ? selected_Coin?.receivingCurrency : selected_Coin?.receivableCurrency,
      baseChain: 'ETH'
    }).then(res => {
      console.log('res fetchChain', res);
      if (!res?.error) {
        setChain(res?.data?.chain);
        fetchFee(res?.data?.chain, selected_Coin);
      } else {
        setisTabChanged(false)
        setIsLoading(false);
        Singleton.showAlert(res?.message || 'Something went wrong');
      }
    }).catch(err => {
      setisTabChanged(false)
      setIsLoading(false);
      console.log('err', err);
    });
  }

  /******************************************************************************************/
  async function findTokenForCurrency(currency) {
    try {
      let res = await APIClient.getInstance().postHuobi(HUOBI_FIND_TOKEN_FOR_CURRENCY, { currency: currency });
      if (!res?.error) {
        return Promise.resolve(res);
      } else {
        return Promise.reject(res);
      }
    } catch (err) {
      console.log('err in findTokenForCurrency', err);
      return Promise.reject(err);
    }
  }

  /******************************************************************************************/
  async function fetchFee(chain, selected_Coin = selectedCoin) {
    APIClient.getInstance().postHuobi(HUOBI_FETCH_FEE, {
      period: '1min', //static
      currency: tab == 'buy' ? selected_Coin?.receivingCurrency : selected_Coin?.receivableCurrency, //if buy receivingCurrency ,if Sell receivableCurrency
      chain: chain, //chain from fetchChain api
      symbol: selected_Coin?.symbol, // symbol from fetchChain api
    }).then(res => {
      setIsLoading(false);
      console.log('res fetchFee', res);
      if (!res?.error) {
        setFeeData(res?.data);
        setMinBuyAmount((Number(res?.data?.minimumWithdraw) + Number(res?.data?.fee) + (Number(res?.data?.minimumWithdraw) + Number(res?.data?.fee)) * feePerSwap) * Number(res?.data?.price?.Buy) > 10 ? (Number(res?.data?.minimumWithdraw) + Number(res?.data?.fee) + (Number(res?.data?.minimumWithdraw) + Number(res?.data?.fee)) * feePerSwap) * Number(res?.data?.price?.Buy) + buyFeePrice : buyMinimumAmount);
        setMinSellAmount((Number(res?.data?.minimumWithdraw) + Number(res?.data?.fee) + (Number(res?.data?.minimumWithdraw) + Number(res?.data?.fee)) * feePerSwap) * Number(res?.data?.price?.Sell));
        setisTabChanged(false)
      } else {
        Singleton.showAlert(res?.message || 'Something went wrong');
        setisTabChanged(false)
      }
    }).catch(err => {
      setisTabChanged(false)
      setIsLoading(false);
      console.log('err', err);
    });
  }

  /******************************************************************************************/
  async function checkSwap() {
    try {
      let minAmount = tab == 'buy' ? minBuyAmount : minSellAmount;
      if (amount < minAmount) {
        console.log('min amount ---', minAmount);
        Singleton.showAlert('Minimum amount is ' + minAmount?.toFixed(2) + ' ' + (tab == 'buy' ? selectedCoin?.receivableCurrency?.toUpperCase() : selectedCoin?.receivingCurrency?.toUpperCase()));
        return;
      }
      setIsLoading(true);
      let res = await APIClient.getInstance().postHuobi(HUOBI_CHECK_SWAP, {
        symbol: selectedCoin?.symbol, // symbol from fetchChain api
        period: '1min',
        currencyW: 'usdt',
        amount: amount, //user input ammount
        type: tab == 'buy' ? 'Buy' : 'Sell',
        feePerSwap: feePerSwap,

      });
      console.log('res checkSwap', res);
      if (!res?.error) {
        if (res?.sufficientBalance) {
          let [curr1, curr2] = await Promise.all([findTokenForCurrency(selectedCoin?.receivingCurrency), findTokenForCurrency(selectedCoin?.receivableCurrency)]);
          console.log('result curr1', curr1);
          console.log('result curr2', curr2);
          if (curr1?.data && curr2?.data) {
            console.log('data exist');
            let tokenExhange = tab == 'buy' ? curr2?.data : curr1?.data
            let tokenDesired = tab == 'buy' ? curr1?.data : curr2?.data;
            let tokenAddress = tokenExhange?.tokenAddress
            let tokenContractObj = await getContractObject(tokenAddress);
            try {
              let user_token_bal = await tokenContractObj.methods.balanceOf(userAddress).call()
              console.log('user ', userAddress, ' token balance', user_token_bal, ', amount req.', amount * 10 ** tokenExhange?.decimal);
              if (user_token_bal < amount * 10 ** tokenExhange?.decimal) {
                Singleton.showAlert('Insufficient Balance')
                setIsLoading(false)
                return
              }
            } catch (error) {
              console.log('errrr', error);
              Singleton.showAlert('Unable to fetch user balance')
              setIsLoading(false)
              return
            }
            let isApproved = await checkContractApproval(tokenAddress, amount * 10 ** tokenExhange?.decimal);
            console.log('____isApproved ', isApproved);
            if (isApproved) {
              swapFee(tokenExhange, tokenDesired)
            } else {
              console.log('gas price ', gasPrice);
              let tokenContractObject = await getContractObject(tokenAddress);
              tokenContractObject.methods.approve(SWAP_CONTRACT_ADDRESS, BigNumber(10 ** 30).toFixed(0)).estimateGas({ from: userAddress }).then(async gasEstimate => {
                console.log('MM', 'isnotApproved ======>>  inside ', gasEstimate);
                setGasEstimate(gasEstimate + GAS_BUFFER);
                setIsLoading(false);
                let allowanceFees = gasPrice * (gasEstimate + GAS_BUFFER) * GAS_FEE_MULTIPLIER;
                Alert.alert('Approval', `Pay ${Singleton.getInstance().exponentialToDecimal(allowanceFees)} ETH transaction fee for token approval`,
                  [{
                    text: 'Approve',
                    onPress: async () => {
                      if (global.disconnected) {
                        Singleton.showAlert(constants.NO_NETWORK)
                        setIsLoading(false)
                        return
                      }
                      let totalFee = (gasPrice * (gasEstimate + GAS_BUFFER)).toFixed(0);
                      console.log(totalFee);
                      if (ethBalance - Singleton.getInstance().exponentialToDecimal(totalFee) < 0) {
                        Singleton.showAlert("You don't have enough ETH to perform transaction");
                        return;
                      } else {
                        let pvtkey = await Singleton.getInstance().newGetData(userAddress + '_pk');
                        approveTransaction(tokenContractObject, SWAP_CONTRACT_ADDRESS, userAddress, tokenAddress, pvtkey, gasPrice);
                      }
                    },
                  },
                  {
                    text: 'Cancel',
                    onPress: () => {
                      // goBack()
                    },
                  },
                  ],
                  { cancelable: false },
                );
              }).catch(err => {
                console.log(err);
                setIsLoading(false);
                //console.log('MM','xx', err.message);
                if (err.message.includes('insufficient funds')) {
                  Singleton.showAlert('Insufficient funds');
                }
                else {
                  Singleton.showAlert(err?.message || constants.SOMETHING_WRONG)
                }
              });
            }
          } else {
            setIsLoading(false);
            Singleton.showAlert(curr1?.message || curr2?.message || 'Token unavailable.');
          }
        } else {
          setIsLoading(false);
          Singleton.showAlert(res?.message || 'Insufficient funds');
        }
        // setFee(res?.data);
      } else {
        setIsLoading(false);
        Singleton.showAlert(res?.message || 'Something went wrong');
      }
    } catch (err) {
      setIsLoading(false);
      console.log('err', err);
    }
  }

  /******************************************************************************************/
  const swapFee = async (tokenExchange, tokenDesired) => {
    console.log('MM', 'swapFee start');
    try {
      setIsLoading(true);
      let routerContractObject = await getContractObject(SWAP_CONTRACT_ADDRESS, HOUBI_ABI);
      let final_amount = exponentialToDecimalWithoutComma(amount * 10 ** tokenExchange?.decimal)
      console.log('swapFee amount to swap', final_amount);
      let swap_abi = await routerContractObject.methods.swap(tokenExchange?.tokenAddress, tokenDesired?.tokenAddress, final_amount);
      swap_abi.estimateGas({ from: userAddress }).then(gasEstimate => {
        console.log('MM', 'swapFee ', gasEstimate);
        setGasEstimate(gasEstimate + GAS_BUFFER);
        setIsLoading(false)
        setRawTxnObj(swap_abi.encodeABI());
        setSwapModal(true);
      }).catch(err => {
        console.log('MM', "swapfee err 11 " + err.message);
        setIsLoading(false);
        if (err?.toString().includes('Insufficient')) {
          Singleton.showAlert('Insufficient Funds')
        } else
          Singleton.showAlert(err?.message || constants.SOMETHING_WRONG)
      });
    } catch (error) {
      console.log('MM', 'error swapFee ... ', error);
    }
  };

  /******************************************************************************************/
  const swap = async () => {
    if (global.disconnected) {
      Singleton.showAlert(constants.NO_NETWORK)
      setIsLoading(false)
      return
    }
    try {
      setIsLoading(true);
      const web3Object = getWeb3Object();
      let nonce = await web3Object.eth.getTransactionCount(userAddress);
      let pvtkey = await Singleton.getInstance().newGetData(userAddress + '_pk');
      const result = await makeTransaction(rawTxnObj, gasPrice, gasEstimate, nonce, '0x0', SWAP_CONTRACT_ADDRESS, pvtkey, userAddress);
      console.log('MM', '--------------result---------------', result);
      let clientOrderID = parseInt(Math.random() * 10000)
      let data = {
        symbol: selectedCoin?.symbol,
        period: '1min',
        currencyW: 'usdt',
        address: userAddress?.toLowerCase(),
        amount: amount,
        chainForWithdraw: chain,
        type: tab == 'buy' ? 'Buy' : 'Sell',
        userAddress: userAddress?.toLowerCase(),
        feePerSwap: feePerSwap?.toString(),
        feeForSpot: feeForSpot?.toString(),
        spotType: 'buy-market',
        source: 'spot-api',
        clientOrderID: clientOrderID.toString(),
        currencySwap: tab != 'buy' ? selectedCoin?.receivableCurrency : selectedCoin?.receivingCurrency,
        hash: result.transactionHash,
      };
      console.log('data... ', data);
      setTimeout(() => {
        APIClient.getInstance().postHuobi(HUOBI_SWAP, data).then(res => {
          console.log(res);
          setIsLoading(false)
          if (res?.error) {
            Singleton.showAlert(res?.message && typeof (res?.message) == 'string' ? res?.message : constants.SOMETHING_WRONG)
          } else {
            setTimeout(() => {
              setIsPopUp(true)
            }, 100);
            setAmount('0')
            setpayableAmount()
          }
        }).catch(err => {
          console.log(err);
          setIsLoading(false)
          Singleton.showAlert(err?.message && typeof (err?.message) == 'string' ? err?.message : constants.SOMETHING_WRONG)
        })
      }, 8000);
      // return result;
    } catch (error) {
      setIsLoading(false)
      Singleton.showAlert(error?.message || constants.SOMETHING_WRONG)
    }
  };

  /******************************************************************************************/
  const approveTransaction = async (tokenContractObject, spenderAddress, userAddress, tokenAddress, privateKey, gasPrice) => {
    try {
      setIsLoading(true);
      //console.log('MM','**** APPROVED TRANSACTION ALERT **', spenderAddress, userAddress, tokenAddress, privateKey, gasPrice);
      const web3Object = getWeb3Object();
      const approveTrans = tokenContractObject.methods.approve(spenderAddress, BigNumber(10 ** 30).toFixed(0));
      const approveGasLimit = await approveTrans.estimateGas({ from: userAddress });
      console.log('MM', 'approveGasLimit ===>>>', approveGasLimit);
      const nonce = await web3Object.eth.getTransactionCount(userAddress);
      //console.log('MM','nonce ===>>>', nonce, privateKey);
      const resultApprove = await makeTransaction(approveTrans.encodeABI(), gasPrice, approveGasLimit + 10000, nonce, '0x0', tokenAddress, privateKey, userAddress);
      setIsLoading(false)
      if (resultApprove.transactionHash) {
        Alert.alert(
          constants.APP_NAME,
          'Transaction request sent to Blockchain for Approval',
          [
            {
              text: 'OK',
              onPress: () => {
              },
            },
          ],
          { cancelable: false },
        );
      }
      // return resultApprove;
    } catch (error) {
      setIsLoading(false);
      console.log('errrr approval', error);
    }
  };

  /******************************************************************************************/
  const makeTransaction = async (transactionData, gasPrice, gasLimit, nonce, value, to, privateKey, from, fromApproval = false) => {
    return new Promise(async (resolve, reject) => {
      try {
        //console.log('MM','rawTransaction =>111 from', from);
        //console.log('MM','rawTransaction =>111', transactionData, gasPrice, gasLimit, nonce, value, to, privateKey, from);
        const web3Object = getWeb3Object();
        let rawTransaction = {
          gasPrice: gasPrice,
          gasLimit: gasLimit,
          to: to,
          value: value,
          data: transactionData,
          nonce: nonce,
          from: from.toLowerCase(),
          chainId: constants.network == 'testnet' ? 5 : 1,
        };
        //  console.log('MM','rawTransaction =>', rawTransaction, privateKey);
        let txn = await web3Object.eth.accounts.signTransaction(rawTransaction, privateKey);
        //  console.log('MM','rawTransaction txn =>', txn);
        let data = {
          from: from.toLowerCase(),
          to: to,
          amount: 0,
          gas_price: gasPrice,
          gas_estimate: gasLimit,
          tx_raw: txn.rawTransaction.slice(2),
          tx_type: 'WITHDRAW',
          nonce: nonce,
          chat: 0,
          is_smart: 1,
        };
        console.log('MM', 'serializedTran => data data', data);
        let serializedTran = txn.rawTransaction.toString('hex');
        let result;
        try {
          result = await getWeb3Object().eth.sendSignedTransaction(serializedTran);
        } catch (error) {
          setIsLoading(false);
          if (error?.message && error?.message?.includes('insufficient funds') || error?.includes('insufficient')) {
            Singleton.showAlert('Insufficient funds');
          } else {
            Singleton.showAlert(error?.message || constants.SOMETHING_WRONG);
          }
          return reject(error);
        }
        data.tx_hash = result.transactionHash;
        resolve(result);
        try {
        } catch (error) {
          console.log('error in sendDataToWallet', error);
        }
      } catch (error) {
        Singleton.showAlert(constants.SOMETHING_WRONG);
        return reject(error);
      }
    });
  };

  /******************************************************************************************/
  const checkContractApproval = async (router, amount) => {
    try {
      console.log('MM', 'checkContractApproval****', router, amount);
      let tokenContractObject = await getContractObject(router);
      let allowance = await tokenContractObject.methods.allowance(userAddress, SWAP_CONTRACT_ADDRESS).call();
      console.log('MM', 'allowance ==>>>', allowance, BigNumber(amount).toFixed(0), +allowance <= +amount);
      // if (BigNumber(allowance).toFixed(0) <= BigNumber(amount).toFixed(0)) {
      if (+allowance <= +amount) {
        setUserApproval(false);
        return false;
      } else {
        setUserApproval(true);
        return true;
      }
    } catch (error) {
      console.log('error in checkallowance', error);
      return false;
    }
  };

  /******************************************************************************************/
  const getWeb3Object = () => {
    return constants.network == 'mainnet' ? new Web3(constants.mainnetInfuraLink) : new Web3(constants.testnetEth);
  };

  /******************************************************************************************/
  const getContractObject = async (tokenAddress, abi = TOKEN_ABI) => {
    try {
      const web3Object = getWeb3Object();
      let tokenContractObject = await new web3Object.eth.Contract(abi, tokenAddress);
      return tokenContractObject;
    } catch (e) {
      console.error('error ===>>', e);
    }
  };

  /******************************************************************************************/
  const numPressed = num => {
    num = num?.toString();
    console.log('amount---', amount, amount?.length);
    if (num == '') return;
    if (num == 'Del') {
      if (amount?.length > 0) {
        let newAmount = amount?.slice(0, amount?.length - 1);
        console.log('new amm', newAmount);
        setAmount(newAmount ? newAmount : '0');
      }
      if (amount == undefined) {
        setAmount('0');
      }
      return;
    }
    if (amount?.includes('.')) {
      if (num == '.') return;
      if (amount?.split('.')[1]?.length != undefined && amount?.split('.')[1]?.length >= (feeData?.precision || 6)) {
        return;
      }
    } else {
      if (amount?.length > 11) {
        return
      }
    }
    setAmount(prev => {
      console.log('prev..', prev, 'num..', num);
      return prev == '0' ? (num == '.' ? '0.' : num) : prev + num;
    });
  }

  /******************************************************************************************/
  const MyButton = ({ num }) => {
    return (
      <TouchableOpacity
        onPress={() => numPressed(num)}
        style={{ width: '33%', alignSelf: 'center', alignItems: 'center', paddingVertical: heightDimen(20), }}>
        <Text style={[styles.Number, { color: ThemeManager.colors.textColor }]}>{num}</Text>
      </TouchableOpacity>
    );
  };

  /******************************************************************************************/
  console.log("selectedCoin?.receivingCurrency==", selectedCoin)
  return (
    <Wrap style={{ backgroundColor: ThemeManager.colors.bg }}>
      <MainStatusBar
        backgroundColor={ThemeManager.colors.bg}
        barStyle={ThemeManager.colors.themeColor === 'light' ? 'dark-content' : 'light-content'}
      />
      <SimpleHeader
        title={tab == 'buy' ? `Buy ${selectedCoin?.receivingCurrency?.toUpperCase()}` : `Sell ${selectedCoin?.receivingCurrency?.toUpperCase()}`}
        backImage={ThemeManager.ImageIcons.iconBack}
        titleStyle={{ textTransform: 'none' }}
        imageShow
        back={false}
        backPressed={() => { getCurrentRouteName() != 'Market' && goBack() }}
      />
      <BorderLine />
      {/* <View style={{ marginTop: heightDimen(23), marginBottom: heightDimen(25), paddingHorizontal: widthDimen(15), alignItems: 'center', width: '100%', borderBottomWidth: 1, borderColor: ThemeManager.colors.viewBorderColor, }} /> */}
      <View style={[styles.ViewBg, { backgroundColor: ThemeManager.colors.iconBg,borderColor:'#86868B' }]}>
        <BasicButton
          onPress={() => {
            setTab('buy');
            setisTabChanged(true)
            setAmount('0')
          }}
          btnStyle={styles.btnStyle}
          text={'Buy'}
          textStyle={{ color: tab == 'sell'?ThemeManager.colors.iconColor:Colors.white, fontSize: areaDimen(16), lineHeight: areaDimen(19) }}
          customGradient={{ borderTopLeftRadius: 25, borderTopRightRadius: tab == 'sell' ? 0 : 25, borderBottomLeftRadius: 25, borderBottomRightRadius: tab == 'sell' ? 0 : 25, height: heightDimen(40) }}
          customColor={tab == 'sell' ? [ThemeManager.colors.iconBg, ThemeManager.colors.iconBg] : [ThemeManager.colors.buy, ThemeManager.colors.buy]}
        />
        <BasicButton
          onPress={() => {
            setAmount('0')
            setisTabChanged(true)
            setTab('sell');
          }}
          btnStyle={styles.SellStyle}
          textStyle={{  color: tab == 'buy'?ThemeManager.colors.iconColor:Colors.white, fontSize: areaDimen(16), lineHeight: areaDimen(19) }}
          text={'Sell'}
          customGradient={{ borderTopRightRadius: 25, borderTopLeftRadius: tab == 'buy' ? 0 : 25, borderBottomRightRadius: 25, borderBottomLeftRadius: tab == 'buy' ? 0 : 25, height: heightDimen(40) }}
          customColor={tab == 'buy' ? [ThemeManager.colors.iconBg, ThemeManager.colors.iconBg] : [ThemeManager.colors.sell, ThemeManager.colors.sell]}
        />
      </View>

      <Text style={[styles.txt1, { color: ThemeManager.colors.textColor }]}>Enter Amount</Text>

      <View style={styles.wrap}>
        <View style={[styles.ViewStyle, { borderColor: ThemeManager.colors.viewBorderColor, backgroundColor: ThemeManager.colors.dashboardBg }]}>
          <Text style={[styles.txt, { color: ThemeManager.colors.textColor, textAlign: 'left' }]}>{tab == 'buy' ? amount == 0 ? '0' : `${CommaSeprator3(amount, feeData?.precision)}` : amount == 0 ? '0' : CommaSeprator3(amount, feeData?.precision)}</Text>
        </View>
      </View>

      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <Text style={[styles.MINTxt, { color: ThemeManager.colors.textColor }]}>
          MIN{' '}{!isTabChanged ? tab == 'buy' ? minBuyAmount && minBuyAmount?.toFixed(2) : minSellAmount && minSellAmount?.toFixed(2) : '0.0'}{' '}{tab == 'buy' ? selectedCoin?.receivableCurrency?.toUpperCase() : selectedCoin?.receivingCurrency?.toUpperCase()}
        </Text>
        <BasicButton
          onPress={() => { checkSwap() }}
          btnStyle={styles.ContinueStyle}
          text={tab == 'buy' ? 'Buy' : 'Sell'}
          customGradient={{ height: heightDimen(60), borderRadius: heightDimen(30) }}
          customColor={tab == 'buy' ? [ThemeManager.colors.buy, ThemeManager.colors.buy] : [ThemeManager.colors.sell, ThemeManager.colors.sell]}
        />
        <View style={{ marginBottom: heightDimen(20) }}>
          <View style={{ ...styles.txtInput, marginTop: heightDimen(5) }}>
            <MyButton num={'1'} />
            <MyButton num={'2'} />
            <MyButton num={'3'} />
          </View>

          <View style={styles.txtInput}>
            <MyButton num={'4'} />
            <MyButton num={'5'} />
            <MyButton num={'6'} />
          </View>

          <View style={styles.txtInput}>
            <MyButton num={'7'} />
            <MyButton num={'8'} />
            <MyButton num={'9'} />
          </View>

          <View style={styles.txtInput}>
            <MyButton num={'.'} />
            <MyButton num={'0'} />
            <TouchableOpacity onPress={() => numPressed('Del')} style={{ width: '33%', alignSelf: 'center', alignItems: 'center',paddingVertical:heightDimen(20) }}>
              <Image source={ThemeManager.ImageIcons.delImage} style={{ width: 22, height: 22, tintColor: ThemeManager.colors.textColor }} resizeMode='contain' />
            </TouchableOpacity>
          </View>
        </View>

      </View>

      <Modal visible={isPopUp} onRequestClose={setIsPopUp} transparent statusBarTranslucent animationType="fade">
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000a',

          }}>
          <TouchableOpacity
            onPress={() => { setIsPopUp(false) }}
            style={{ position: 'absolute', right: 25, top: getStatusBarHeight() + 25 }}>
            <Image
              source={Images.close}
              style={{
                width: 24,
                height: 24,
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <View
            style={{
              width: '80%',
              margin: 20,
              padding: 20,
              borderRadius: 20,
              backgroundColor: ThemeManager.colors.textColor,
              alignItems: 'center',
            }}>
            <LottieView source={Done} style={{ width: '100%' }} autoPlay loop />

            <Text
              style={{
                color: ThemeManager.colors.backgroundColor,
                fontFamily: Fonts.semibold,
                fontSize: 18,
                textAlign: 'center',
              }}>
              Completed
            </Text>
            <Text
              style={{
                color: ThemeManager.colors.placeholderTextColor,
                fontFamily: Fonts.regular,
                textAlign: 'center',

                marginBottom: 10
              }}>
              Swap successful
            </Text>
          </View>
        </View>
      </Modal>

      {swapModal && (
        <ModalTradeTx
          fromCoin={userAddress}
          showFee={true}
          cardFee={amount?.toString()}
          cardCurrency={tab == 'buy' ? selectedCoin?.receivableCurrency?.toUpperCase() : selectedCoin?.receivingCurrency?.toUpperCase()}
          toCoin={SWAP_CONTRACT_ADDRESS}
          symbol={'ETH'}
          txnFee={(gasPrice * gasEstimate * GAS_FEE_MULTIPLIER).toFixed(6)}
          onPress={() => {
            setSwapModal(false);
            setIsLoading(true);
            swap();
          }}
          onCancel={() => {
            setSwapModal(false);
            setIsLoading(false)
          }}
        />
      )}

      {isLoading && <Loader />}
    </Wrap>
  );
}
