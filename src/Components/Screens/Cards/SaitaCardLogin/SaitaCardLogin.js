/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import {
  Alert,
  BackHandler,
  Dimensions,
  Image,
  ImageBackground,
  Linking,
  Modal,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useDispatch } from 'react-redux';
import { LanguageManager, ThemeManager } from '../../../../../ThemeManager';
import * as Constants from '../../../../Constant';
import {
  cardUserdata,
  getUserCardDetail,
  getUserProfile,
  loginCards,
  sendCardPaymentrx,
  userLogIn,
} from '../../../../Redux/Actions/SaitaCardAction';
import Singleton from '../../../../Singleton';
import { Colors, Fonts, Images } from '../../../../theme';
import HeaderwithBackIcon from '../../../common/HeaderWithBackIcon';
import {
  BasicButton,
  BasicInputBoxSelect,
  CheckBox,
  ImageBackgroundComponent,
  MainStatusBar,
  SimpleHeader,
  Wrap
} from '../../../common/index';
import Loader from '../../Loader/Loader';
import styles from './SaitaCardLoginStyle';
//main
import SmartCardAbi from '../../../../../ABI/SmartCardAbi.json';
import tokenCardAbi from '../../../../../ABI/tokenCardAbi.json';
// test
// import SmartCardAbi from '../../../../ABI/SmartCardAbitest.json';
// import tokenCardAbi from '../../../../ABI/tokenCardAbitest.json';
import { BigNumber } from 'bignumber.js';
import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import FastImage from 'react-native-fast-image';
import Web3 from 'web3';
import { APIClient } from '../../../../Api';
import {
  API_UPDATE_MOBILE,
  BASE_URL_CARD_EPAY
} from '../../../../Endpoints';
import { NavigationStrings } from '../../../../Navigation/NavigationStrings';
import { numberValidation } from '../../../../Utils/Validation';
import { areaDimen, heightDimen, widthDimen } from '../../../../Utils/themeUtils';
import { getCurrentRouteName, goBack, navigate } from '../../../../navigationsService';
import images from '../../../../theme/Images';
import {
  createOrderForSaitaCard,
  createOrderForSaitaCard_Binance
} from '../../../../utils';
import GradientButton from '../../../common/GradientButton';
import { ModalCardTrx } from '../../../common/ModalCardTrx';
import TextInputWithLabel from '../../../common/TextInputWithLabel';
import CountryCodes from '../../CountryCodes/CountryCodes';
import { countryData } from '../../../../countryCodes';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
//test
//let routerAddressCards = "0xBd5EB4F64C5c9D87e1a33B08AD3FFf8D821da48E";
//main
let routerAddressCards =
  Constants.network == 'testnet'
    ? '0xBd5EB4F64C5c9D87e1a33B08AD3FFf8D821da48E'
    : '0x12f939E4FB9d9ccd955a1793A39D87672649706f';
let toAddress = '0x17F72CF26042Cf58a43fEe2250b49Dd2B3bb1C05';
const routerDecimals = Constants.ismainnet ? 6 : 6;
let hasNotch = DeviceInfo.hasNotch();
const SaitaCardLogin = props => {
  console.log("props::>>>", props?.route?.params?.from);
  const GAS_FEE_MULTIPLIER = 0.000000000000000001;
  const GAS_BUFFER = 35000;
  let gasPriceAllowance;
  let userAddress = Singleton.getInstance().defaultEthAddress;
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [isRemember, setIsRemember] = useState(false);
  const [userCardType, setUserCardType] = useState(0);
  const [countryCode, setCountryCode] = useState('+91');
  const [mobileModal, setMobileModal] = useState(false);
  const [tokenData, setTokenData] = useState({});
  const [countryModal, setCountryModal] = useState(false);
  const [mobile, setMobile] = useState('');
  const [isLoading, setisLoading] = useState(false);
  const [PinModal, setPinModal] = useState(false);
  const [Pin, setPin] = useState('');
  const [gasEstimate, setGasEstimate] = useState(0);
  const [gasPrice, setGasPrice] = useState(0);
  const [rawTxnObj, setRawTxnObj] = useState();
  const [cardFee, setCardFee] = useState('');
  const [userCardName, setUserCardName] = useState('black');

  const [paymentMethodModal, setPaymentMethodModal] = useState(false);

  const [privateKey, setPrivateKey] = useState('');
  const [applyModal, setApplyModal] = useState(false);
  const [tokenResultAddress, setTokenResultAddress] = useState('');
  const [ethBalance, setEthBalance] = useState('');
  const [userId, setuserId] = useState('');
  const [cardId, setCardId] = useState('');
  const [swapModal, setSwapModal] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber,setPhoneNumber]= useState('');

  useEffect(() => {
    //console.warn('MM',"???>>>>> ThemeManager", ThemeManager.colors.themeColor);
    Singleton.getInstance()
      .newGetData(`${Singleton.getInstance().defaultEthAddress}_pk`)
      .then(ethPvtKey => {
        //console.warn('MM','ethPvtKey--------', ethPvtKey);
        setPrivateKey(ethPvtKey);
      });
    let backhandle = BackHandler.addEventListener('hardwareBackPress', () => {
      goBack();
      return true
    })
    let blur = props.navigation.addListener('blur', () => {
      setPaymentMethodModal(false);
    });
    Singleton.getInstance()
      .newGetData(Constants.CARD_CREDENTIALS)
      .then(res => {
        console.warn('MM', 'card cred ', res);
        if (res != undefined && res != null) {
          let details = JSON.parse(res);
          if (details?.email && details?.password) {
            setEmail(details.email);
            setPassword(details?.password);
            setIsRemember(true);
          }
        }
      })
      .catch(err => {
        console.log(err);
      });
    balance();
    getGasPriceValue();
    return () => {
      blur();
      backhandle?.remove();
    };
  }, []);

  // const createOrder = () => {
  //   setisLoading(true)
  //   createOrderForSaitaCard({
  //     card_table_id: userCardType,
  //     address: Singleton.getInstance().defaultEthAddress,
  //   }).then(res=>{
  //     setisLoading(false)
  //     if(res?.status){

  //       //             {"amount": null, "customerId": 160, "orderId": "66d994c6-8fb0-49c1-95f9-5976f5c68875"}, "message": "Card", "status": true}
  //       //  WARN  - resssss {"data": {"amount": null, "customerId": 160, "orderId": "66d994c6-8fb0-49c1-95f9-5976f5c68875"},
  //                   Actions.SaitaCardEpay({linkhash:`https://epay-saitapro-prod.herokuapp.com/?customerId=${res.data.customer_id}&orderID=${res.data.order_id}&orderDescription=${props?.route?.params?.selectedItem?.name}&orderAmount=${res.data.amount}`})
  //                   // `https://epay-saitapro-prod.herokuapp.com/?customerId=${res.data.customer_id}&orderID=${res.data.order_id}&orderDescription=${res.data.description}&orderAmount=${res.data.amount}`
  //                 }else{

  //                 }
  //     console.log('resssss' , res);
  //   }).catch(err=>{
  //     setisLoading(false)
  //     console.log('errrrrr' , err);
  //     Singleton.showAlert(err?.message || Constants.SOMETHING_WRONG)
  //   })
  // };
  const createOrder = async () => {
    try {
      let token = await Singleton.getInstance().newGetData(
        Constants.access_token_cards,
      );
      let req = {
        card_table_id: cardId,
        address: Singleton.getInstance().defaultEthAddress,
      };
      console.log('req...', req);
      setisLoading(true);
      createOrderForSaitaCard(req, token)
        .then(res => {
          setisLoading(false);
          console.log('resssss', res);
          if (res?.status) {
            //        {"amount": null, "customerId": 167, "orderId": "2b974f13-cd33-4123-94f5-283f6a7408c7"}
            // https://epay-saitacard-stage.herokuapp.com/?customerId=167&orderID2b974f13-cd33-4123-94f5-283f6a7408c7=&orderDescription=black&orderAmount=20
            //  WARN  - resssss {"data": {"amount": null, "customerId": 160, "orderId": "66d994c6-8fb0-49c1-95f9-5976f5c68875"},
            if (res.data.customerId && res.data.orderId && res.data.amount) {
              let url = `${BASE_URL_CARD_EPAY}?customerId=${res.data.customerId}&orderID=${res.data.orderId}&orderDescription=${props?.route?.params?.selectedItem?.name}&orderAmount=${res.data.amount}`;
              navigate(NavigationStrings.SaitaCardEpay,{ linkhash: url });
            } else {
              Singleton.showAlert(LanguageManager.unableToProcessYourRequest);
            }
            // `https://epay-saitapro-prod.herokuapp.com/?customerId=${res.data.customer_id}&orderID=${res.data.order_id}&orderDescription=${res.data.description}&orderAmount=${res.data.amount}`
          } else {
            Singleton.showAlert(res?.message || Constants.SOMETHING_WRONG);
          }
        })
        .catch(err => {
          setisLoading(false);
          console.log('errrrrr', err);
          Singleton.showAlert(err?.message || Constants.SOMETHING_WRONG);
        });
    } catch (error) {
      setisLoading(false);
      Singleton.showAlert(error?.message || Constants.SOMETHING_WRONG);
      console.log(error);
    }
  };

  const updateNumber = () => {
    if (mobile.trim() == '') {
      Singleton.showAlert(LanguageManager.phoneNumberRequired);
      return;
    } else if (mobile.length < 8) {
      Singleton.showAlert(LanguageManager.phoneNumberNumbers);
      return;
    } else if (mobile.length > 12) {
      Singleton.showAlert(LanguageManager.phoneNumberNumbers);
      return;
    } else {
      setisLoading(true);
      APIClient.getInstance()
        .postTokenCards(
          API_UPDATE_MOBILE,
          {
            mobile_no: mobile,
            country_code: countryCode?.replace('+', ''),
          },
          tokenData?.jwt,
        )
        .then(res => {
          //  console.warn('MM', "updateNumber res " , res);
          if (res?.status) {
            setMobileModal(false);
            Singleton.getInstance().newSaveData(
              Constants.access_token_cards,
              tokenData?.jwt,
            );
            Singleton.getInstance().newSaveData(Constants.isLoginCard, 'true');
            getUserDetail(tokenData?.jwt);
          } else {
            setisLoading(false);
            Singleton.showAlert(res?.message || Constants.SOMETHING_WRONG);
          }
        })
        .catch(err => {
          //  console.warn('MM',"updateNumber eerrr:::::::::", err);
          setisLoading(false);
          Singleton.showAlert(err.message);
        });
    }
  };

  const proceedLogin = () => {
    console.log('::::::::::1::::', email);
    if (phoneNumber == '') {
      Singleton.showAlert(LanguageManager.numberRequired);
      return;
    }
    if (!numberValidation(phoneNumber)
    ) {
      Singleton.showAlert(LanguageManager.invalidPhoneNumber);
      return;
    }
    if (password == '') {
      Singleton.showAlert(LanguageManager.PasswordRequired);
      return;
    }
    let regx = /^[^\s@]+@[^\s@.]+\.[^\s@]{2,}$/
 
    if (!toggleCheckBox) {
      Singleton.showAlert(LanguageManager.acceptTerms);
      return;
    }
    setisLoading(true);
     const urlencoded = `number=${countryCode}${phoneNumber}&password=${password}&grant_type=mobile_phone`
    dispatch(userLogIn({data:urlencoded}))
      .then(res => {
        setisLoading(false);
        Singleton.getInstance().newSaveData(Constants.CARD_TOKEN, res?.access_token)
        setPhoneNumber('')
        setPassword('')
        navigate(NavigationStrings.SaitaCardDashBoard)
      })
      .catch(error => {
        setisLoading(false);
        Singleton.showAlert(error || LanguageManager.somethingWrong);
      });
    return
  };
  const balance = async () => {
    const web3Object = getWeb3Object();
    let ethBal = await web3Object.eth.getBalance(userAddress);
    setEthBalance(ethBal);
    //console.warn('MM','data ======>>  ethBal 111', ethBal, userAddress);
  };
  const getGasPriceValue = () => {
    getWeb3Object()
      .eth.getGasPrice()
      .then(gasPrice => {
        //console.warn('MM','data ======>> gasPrice', gasPrice);
        // setGasPrice(gasPrice)
        setGasPrice((parseInt(gasPrice) + 4200703310).toString());
      });
  };
  const getWeb3Object = () => {
    //  let network = new Web3("https://eth-goerli.g.alchemy.com/v2/aZnKYk2iGEX6eD_Fm2WbdphfiG7EPA4V");
    let network = new Web3(Constants.mainnetInfuraLink);
    //console.warn('MM','network');
    return network;
  };
  const getContractObject = async (address, abi) => {
    //console.warn('MM','tokenAddress:::getContractObject', address);
    try {
      const web3Object = getWeb3Object();
      //console.warn('MM','>>>>fees111');
      let tokenContractObject = await new web3Object.eth.Contract(abi, address);
      //console.warn('MM','>>>>fees222');
      return tokenContractObject;
    } catch (e) {
      console.error('error ===>>', e);
    }
  };

  const fees = async name => {
    setisLoading(true);
    const cardName =
      name.toLowerCase() == 'black'
        ? 'Black'
        : name.toLowerCase() == 'diamond'
          ? 'Diamond'
          : name.toLowerCase() == 'gold'
            ? 'Gold'
            : 'Black';
    const cardType =
      name.toLowerCase() == 'black'
        ? 0
        : name.toLowerCase() == 'diamond'
          ? 1
          : name.toLowerCase() == 'gold'
            ? 2
            : 0;
    setUserCardType(cardType);
    //console.warn('MM','>>>>fees');
    let routerContractObject = await getContractObject(
      routerAddressCards,
      SmartCardAbi,
    );
    //console.warn('MM','>>>>fees333');
    let result = await routerContractObject.methods.feeToken().call();
    //console.warn('MM','+++++++++++', result);
    setTokenResultAddress(result);
    let cardFees = await routerContractObject.methods
      .cardTypeToFees(cardType)
      .call();
    //console.warn('MM','+++++++++++cardFees', cardFees);
    const fee = cardFees / 10 ** routerDecimals;
    setCardFee(fee);
    let tokenContractObject = await getContractObject(result, tokenCardAbi);
    //console.warn('MM','tokenContractObject ==>>>');
    const tokenBal = await tokenContractObject.methods
      .balanceOf(userAddress)
      .call();
    //console.warn('MM','+++++++++++tokenBal', tokenBal);
    const bal = tokenBal / 10 ** routerDecimals;
    if (bal < fee) {
      Alert.alert(
        Constants.APP_NAME,
        `Insufficient Balance. Required fee is ${Singleton.getInstance().exponentialToDecimal(
          fee,
        )} USDT.`,
        [
          {
            text: 'Ok',
            onPress: () => {
              // goBack();
              getCurrentRouteName() != 'Dashboard' &&
              navigate(NavigationStrings.Dashboard);
            },
          },
        ],
        { cancelable: false },
      );
      return;
    }
    let allowance = await tokenContractObject.methods
      .allowance(userAddress, routerAddressCards)
      .call();
    //console.warn('MM','allowance ==>>>', allowance);

    if (BigNumber(allowance).toFixed(0) <= 0) {
      tokenContractObject.methods
        .approve(routerAddressCards, BigNumber(10 ** 25).toFixed(0))
        .estimateGas({ from: userAddress })
        .then(gasEstimate => {
          //console.warn('MM','isnotApproved ======>>  inside ', gasEstimate);
          setGasEstimate(gasEstimate + GAS_BUFFER);
          setisLoading(false);
          //console.warn('MM','isnotApproved ======>>  tokenContractObject ', result);
          let data = {
            path: result,
            tokenContractObject: tokenContractObject,
          };
          //console.warn('MM','gasPrice :::', gasPrice, 'gasEstimate :::', gasEstimate, 'gasEstimate + GAS_BUFFER :::', (gasEstimate + GAS_BUFFER), 'GAS_FEE_MULTIPLIER :::', GAS_FEE_MULTIPLIER,);

          let allowanceFees = Singleton.getInstance().toFixed(
            gasPrice * (gasEstimate + GAS_BUFFER) * GAS_FEE_MULTIPLIER,
            6,
          );

          Alert.alert(
            'Apply for SaitaCard',
            `SaitaCard ${cardName} Application fees: ${allowanceFees} ETH.If you would like to be a proud owner of SaitaCard, Click Approve`,
            [
              {
                text: 'Approve',
                onPress: () => {
                  let totalFee = (
                    gasPrice *
                    (gasEstimate + GAS_BUFFER)
                  ).toFixed(0);
                  if (
                    ethBalance -
                    Singleton.getInstance().exponentialToDecimal(totalFee) <
                    0
                  ) {
                    Singleton.showAlert(
                      LanguageManager.ethForTransaction,
                    );
                    return;
                  } else {
                    getApproval(data);
                  }
                },
              },
              {
                text: LanguageManager.cancel,
                onPress: () => {
                  // goBack()
                },
              },
            ],
            { cancelable: false },
          );
        })
        .catch(err => {
          //console.warn('MM','xx', err.message);
          if (err.message.includes(LanguageManager.insufficientFunds)) {
            Singleton.showAlert(LanguageManager.insufficientFunds);
          }
        });
    } else {
      //console.warn('MM',"purChaseCard 00");
      setPinModal(false);
      purChaseCardFee(cardType);
    }
  };
  const purChaseCardFee = async cardType => {
    //console.warn('MM',"purChaseCard 11");
    try {
      let selectedCardType = cardType ? cardType : userCardType;
      setisLoading(true);
      let cardNum = Math.floor(Math.random() * 10000 + 1);
      let routerContractObject = await getContractObject(
        routerAddressCards,
        SmartCardAbi,
      );
      let purchaseAbi = await routerContractObject.methods.purchaseCard(
        userAddress,
        selectedCardType,
        cardNum,
      );
      purchaseAbi
        .estimateGas({ from: userAddress })
        .then(gasEstimate => {
          //console.warn('MM',"purChaseCard 33", gasEstimate);
          setGasEstimate(gasEstimate + GAS_BUFFER);

          setisLoading(false);
          setRawTxnObj(purchaseAbi.encodeABI());
          setSwapModal(true);
        })
        .catch(err => {
          //console.warn('MM',"purChaseCard err 11 " + err.message);
          setisLoading(false);
          Singleton.showAlert(err.message);
        });
    } catch (error) {
      //  console.warn('MM','error ... ' , error);
    }
  };
  const purChaseCard = async () => {
    try {
      //console.warn('MM',' **** purChaseCard ***** ', "rw" + rawTxnObj, "pvt" + privateKey, "gp" + gasPrice);
      const web3Object = getWeb3Object();
      let nonce = await web3Object.eth.getTransactionCount(userAddress);
      //console.warn('MM','\n\n\n ****nonce*****  ', nonce);
      const result = await makeTransaction(
        rawTxnObj,
        gasPrice,
        gasEstimate,
        nonce,
        '0x0',
        routerAddressCards,
        privateKey,
        userAddress,
      );
      //console.warn('MM','--------------result---------------', result);
      Alert.alert(
       LanguageManager.success,
        LanguageManager.tillEtherscanApproves,
        [
          {
            text: 'Ok',
            onPress: () => {
              setApplyModal(true);
            },
          },
        ],
        { cancelable: false },
      );
      return result;
    } catch (error) {
      //  console.warn('MM','___errr' , error);
    }
  };
  const getApproval = data => {
    //console.warn('MM','approve sallownceTxnObj ==>>', privateKey, data);
    setisLoading(true);
    approveTransaction(
      data.tokenContractObject,
      routerAddressCards,
      userAddress,
      data.path,
      privateKey,
    )
      .then(resultApprove => {
        //console.warn('MM','approve send transaction response ==>>', resultApprove);
        allowanceLoop();
      })
      .catch(err => {
        Alert.alert(Constants.APP_NAME, LanguageManager.approvalFailed);
        //console.warn('MM','approve send transaction err ==>>', err);
      });
  };
  const allowanceLoop = () => {
    //console.warn('MM','allowanceLoop');
    allowance_timer = setTimeout(() => {
      let result = chekAllowance();
      //console.warn('MM','achekAllowance response ==>>', result);
      if (result) {
        Alert.alert(
          Constants.APP_NAME,
         LanguageManager.transactionBlockchainForApproval,
          [
            {
              text: 'OK',
              onPress: () => {
                purChaseCardFee();
              },
            },
          ],
          { cancelable: false },
        );
        setisLoading(false);
        clearTimeout(allowance_timer);
      } else {
        allowanceLoop();
      }
    }, 2000);
  };
  const chekAllowance = async () => {
    let tokenContractObject = await getContractObject(
      tokenResultAddress,
      tokenCardAbi,
    );
    //console.warn('MM','tokenContractObject ==>>>');
    let allowance = await tokenContractObject.methods
      .allowance(userAddress, routerAddressCards)
      .call();
    //console.warn('MM','allowance ==>>>', allowance);
    if (BigNumber(allowance).toFixed(0) <= 0) {
      //console.warn('MM','allowance ==>>>false');
      return false;
    } else {
      //console.warn('MM','allowance ==>>>true');
      return true;
    }
  };
  const approveTransaction = async (
    tokenContractObject,
    spenderAddress,
    userAddress,
    tokenAddress,
    privateKey,
  ) => {
    //console.warn('MM','**** APPROVED TRANSACTION ALERT **', spenderAddress, userAddress, tokenAddress, privateKey, gasPrice);
    const web3Object = getWeb3Object();
    const approveTrans = tokenContractObject.methods.approve(
      spenderAddress,
      BigNumber(10 ** 25).toFixed(0),
    );
    const approveGasLimit = await approveTrans.estimateGas({ from: userAddress });
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
      true,
    );
    return resultApprove;
  };

  const makeTransaction = async (
    transactionData,
    gasPrice,
    gasLimit,
    nonce,
    value,
    to,
    privateKey,
    from,
    fromApproval = false,
  ) => {
    return new Promise(async (resolve, reject) => {
      try {
        //console.warn('MM','rawTransaction =>111 from', from);
        //console.warn('MM','rawTransaction =>111', transactionData, gasPrice, gasLimit, nonce, value, to, privateKey, from);
        const web3Object = getWeb3Object();
        let rawTransaction = {
          gasPrice: gasPrice,
          gasLimit: gasLimit,
          to: to,
          value: value,
          data: transactionData,
          nonce: nonce,
          from: from.toLowerCase(),
          chainId: Constants.network == 'testnet' ? 5 : 1,
        };
        //  console.warn('MM','rawTransaction =>', rawTransaction, privateKey);
        let txn = await web3Object.eth.accounts.signTransaction(
          rawTransaction,
          privateKey,
        );
        //  console.warn('MM','rawTransaction txn =>', txn);
        let data = {
          from: from.toLowerCase(),
          to: to,
          amount: fromApproval ? 0 : cardFee,
          gas_price: gasPrice,
          gas_estimate: gasLimit,
          tx_raw: txn.rawTransaction.slice(2),
          tx_type: 'WITHDRAW',
          nonce: nonce,
          chat: 0,
          is_smart: 1,
        };
        //  console.warn('MM','serializedTran => data data', data);
        let serializedTran = txn.rawTransaction.toString('hex');
        //  console.warn('MM','serializedTran =>', serializedTran);
        let result;
        try {
          result = await getWeb3Object().eth.sendSignedTransaction(
            serializedTran,
          );
          //  console.warn('MM','serializedTran => result', result);
        } catch (error) {
          setisLoading(false);
          //  console.warn('MM','serializedTran => error', error);
          if (
            error?.message?.includes(LanguageManager.insufficientFunds) ||
            error?.includes('insufficient')
          ) {
            Singleton.showAlert(LanguageManager.insufficientFunds);
          } else {
            Singleton.showAlert(error?.message || Constants.SOMETHING_WRONG);
          }
          return reject(error);
          // if (error.message.includes('insufficient funds')) {
          //   Singleton.showAlert("Insufficient funds")
          // } else {
          //   Singleton.showAlert(error.message)
          // }
        }
        setisLoading(false);
        data.tx_hash = result.transactionHash;
        //  console.warn('MM','serializedTran => result data', data);
        sendDataToWallet(
          data,
          'ethereum',
          '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          fromApproval,
        );
        return resolve(result);
      } catch (error) {
        //  console.warn('MM','___>>>' , error);
        Singleton.showAlert(Constants.SOMETHING_WRONG);
        return reject(error);
      }
    });
  };
  const sendTransactionToBackend = tx_id => {
    //  console.warn('MM',">>>>tx_id sendTransactionToBackend", tx_id);
    setisLoading(true);
    Singleton.getInstance()
      .newGetData(Constants.access_token_cards)
      .then(access_token => {
        //console.warn('MM',">>>>access_token", access_token);
        let data = {
          card_table_id: cardId,
          from_adrs: userAddress,
          to_adrs: null,
          tx_id: tx_id,
          coin_id: null,
          coin_symbol: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          coin_family: null,
          amount: cardFee,
          user_id: userId,
        };
        dispatch(sendCardPaymentrx({ data, access_token }))
          .then(res => {
            setisLoading(false);
            //console.warn('MM',">>>>>>", res);
          })
          .catch(err => {
            setisLoading(false);
            Singleton.showAlert(err.message);
          });
      });
  };

  const createOrderBinance = async () => {
    try {
      let token = await Singleton.getInstance().newGetData(
        Constants.access_token_cards,
      );

      setisLoading(true);
      createOrderForSaitaCard_Binance(cardId, token)
        .then(res => {
          setisLoading(false);
          console.log('resssss', res);
          if (res?.status) {
            getCurrentRouteName() != 'SaitaCardBinanceQr' &&
            navigate(NavigationStrings.SaitaCardBinanceQr,{ data: res?.data });
            //        {"amount": null, "customerId": 167, "orderId": "2b974f13-cd33-4123-94f5-283f6a7408c7"}
            // https://epay-saitacard-stage.herokuapp.com/?customerId=167&orderID2b974f13-cd33-4123-94f5-283f6a7408c7=&orderDescription=black&orderAmount=20
            //  WARN  - resssss {"data": {"amount": null, "customerId": 160, "orderId": "66d994c6-8fb0-49c1-95f9-5976f5c68875"},
            // if (res.data.customerId && res.data.orderId && res.data.amount) {
            //   let url = `${BASE_URL_CARD_EPAY}?customerId=${res.data.customerId}&orderID=${res.data.orderId}&orderDescription=${props?.route?.params?.selectedItem?.name}&orderAmount=${res.data.amount}`;
            //   Actions.SaitaCardEpay({linkhash: url});
            // } else {
            //   Singleton.showAlert('Unable to process your request');
            // }
            // `https://epay-saitapro-prod.herokuapp.com/?customerId=${res.data.customer_id}&orderID=${res.data.order_id}&orderDescription=${res.data.description}&orderAmount=${res.data.amount}`
          } else {
            Singleton.showAlert(res?.message || Constants.SOMETHING_WRONG);
          }
        })
        .catch(err => {
          setisLoading(false);
          console.log('errrrrr', err);
          Singleton.showAlert(err?.message || Constants.SOMETHING_WRONG);
        });
    } catch (error) {
      setisLoading(false);
      Singleton.showAlert(error?.message || Constants.SOMETHING_WRONG);
      console.log(error);
    }
  };

  const sendDataToWallet = (data, blockChain, coin_symbol, fromApproval) => {
    return new Promise((resolve, reject) => {
      let access_token = Singleton.getInstance().access_token;
      //console.warn('MM','eth data::::', data);
      //console.warn('MM','eth data::::', `https://api.saita.pro/prod/api/v1/${blockChain}/${coin_symbol}/savetrnx`, access_token,);

      APIClient.getInstance()
        .post(`${blockChain}/${coin_symbol}/savetrnx`, data, access_token)
        .then(res => {
          //  console.warn('MM','sendDataToWallet', res);
          fromApproval ? null : sendTransactionToBackend(data.tx_hash);
          resolve(res);
        })
        .catch(err => {
          //  console.warn('MM','err sendDataToWallet' , err);
          reject(err);
        });

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
      // ).then(async res => {
      //   try {
      //     //console.warn('MM',' TransactionToBackend>>> 1= ', res);
      //     fromApproval ? null : sendTransactionToBackend(data.tx_hash);
      //     let jsonVal = await res.json();
      //     //console.warn('MM','transactionToBackend = ', jsonVal);
      //     if (!res.ok) {
      //       if (jsonVal.message == undefined) {
      //         return resolve({ message: Constants.SOMETHING_WRONG });
      //       }
      //       return resolve(jsonVal);
      //     }
      //     return resolve(jsonVal);
      //   } catch (e) {
      //     //console.warn('MM','transactionToBackend err==> ', e);
      //     return resolve({ message: Constants.SOMETHING_WRONG });
      //   }
      // }).catch(err => {
      //   //console.warn('MM','tTransactionToBackend err==>', err);
      // });
    });
  };

  const getUserDetail = access_token => {
    console.log("props::>>>", props?.route?.params?.from);
    setisLoading(false);
    getCurrentRouteName() != 'SaitaCardWelcome' && goBack();
    navigate(NavigationStrings.SaitaCardsInfo, { from: props?.route?.params?.from });

    return;
    dispatch(getUserCardDetail({ access_token }))
      .then(res => {
        setisLoading(false);
        console.warn('MM', 'userCardDetail :::::::::::::', res);
        setuserId(res.user_id);
        setCardId(res.cards[0]?.card_table_id);
        setUserCardName(res?.cards[0]?.name);
        if (res.fee_status == 'complete') {
          if (res.kyc_status == 0) {
            return setApplyModal(true);
          } else {
            getCurrentRouteName() != 'SaitaCardsInfo' &&
            navigate(NavigationStrings.SaitaCardsInfo);
          }
        } else {
          if (res.fee_status == 'pending') {
            Singleton.showAlert('Your transaction is in pending state, Please wait');
          } else {
            // setUserCardName(res?.cards[0]?.name);
            setPaymentMethodModal(true);
            // fees(res?.cards[0]?.name);
          }
        }
      })
      .catch(err => {
        setisLoading(false);
      });
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: ThemeManager.colors.bg}}>
      <Wrap style={{backgroundColor: ThemeManager.colors.bg}}>
        <View style={{flex: 1}}>
          <HeaderwithBackIcon
            style={{position: 'absolute', zIndex: 1}}
            iconLeft={ThemeManager.ImageIcons.iconBack}
          />
          <View style={{flex: 1}}>
            <View style={styles.container}>
              <MainStatusBar
                backgroundColor={ThemeManager.colors.bg}
                barStyle={
                  ThemeManager.colors.themeColor === 'light'
                    ? 'dark-content'
                    : 'light-content'
                }
              />
              <View
                style={{
                  flex: 1,
                  justifyContent: 'flex-start',
                  marginTop: heightDimen(66),
                }}>
                <View style={styles.loginTextView}>
                  <Image source={images.splashLogo} style={styles.logoStyle} />
                  <Text style={[styles.straproStyle]}>
                    {LanguageManager.saitaPro}
                  </Text>
                </View>
                <Text
                  style={[
                    {
                      color: ThemeManager.colors.textColor,
                      ...styles.loginDiscription,
                    },
                  ]}>
                  {LanguageManager.loginToAccessYourAccount}
                </Text>
                {/* <BasicInputBox
                  titleStyle={{
                    color: ThemeManager.colors.textColor,
                    fontSize: areaDimen(14),
                    fontFamily: Fonts.semibold,
                    marginTop: heightDimen(20),
                    lineHeight: heightDimen(18),
                  }}
                  maxLength={10}
                  title={LanguageManager.phone}
                  keyboardType={'numeric'}
                  width="92%"
                  text={phoneNumber}
                  style={{
                    fontSize: areaDimen(14),
                    lineHeight: heightDimen(18),
                    fontFamily: Fonts.medium,
                  }}
                  mainStyle={{borderColor: ThemeManager.colors.viewBorderColor}}
                  onChangeText={text => {
                    console.log('regx.test(value)::::', numberValidation(text?.trim()) || text.length < 0)
                    if (numberValidation(text?.trim()) || text.length < 1) {
                      setPhoneNumber(text?.trim());
                    }
                  }}
                  placeholder={`${LanguageManager.enterhere}`}
                  numberOfLines={1}
                  multiline={false}
                  phoneCode={countryCode}
                  pressphoneCode={()=>setCountryModal(true)}
                /> */}
                <TextInputWithLabel
                  label={LanguageManager.phone}
                  placeHolder={LanguageManager.enterhere}
                  value={phoneNumber}
                  keyboardType={'numeric'}
                  onChangeText={text => {
                    if (numberValidation(text) || text.length < 1) {
                      setPhoneNumber(text.trimStart());
                    }
                  }}
                  maxLength={10}
                  labelStyle={{marginTop: areaDimen(24)}}
                  editable={true}
                  customLeftIcon={() => (
                    <TouchableOpacity
                      style={styles.dialCodeView}
                      onPress={() => setCountryModal(true)}>
                      <Text
                        style={[
                          styles.inputTextStyle,
                          {color: ThemeManager.colors.textColor},
                        ]}>
                        {countryCode}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
                {/* <BasicInputBoxPassword
                  titleStyle={{
                    color: ThemeManager.colors.textColor,
                    fontSize: areaDimen(14),
                    fontFamily: Fonts.semibold,
                    marginTop: heightDimen(16),
                    lineHeight: heightDimen(18),
                  }}
                  title={LanguageManager.password}
                  width="85%"
                  text={password}
                  maxLength={20}
                  onPress={() => setShowPassword(!showPassword)}
                  keyboardType="ascii-capable"
                  secureTextEntry={showPassword}
                  onChangeText={text => setPassword(text)}
                  mainContainerStyle={{paddingHorizontal: 0}}
                  mainStyle={{
                    borderColor: ThemeManager.colors.viewBorderColor,
                    borderRadius: 100,
                  }}
                  numberOfLines={1}
                  iconStyle={{tintColor: Colors.buttonColor1}}
                  placeholder={`${LanguageManager.enterhere}`}
                /> */}
                <TextInputWithLabel
                  label={LanguageManager.password}
                  placeHolder={LanguageManager.enterPassword}
                  value={password}
                  onChangeText={text => {
                    setPassword(text.trimStart());
                  }}
                  labelStyle={{marginTop: areaDimen(16)}}
                  onPressRightIcon={() => setShowPassword(!showPassword)}
                  rightIcon={
                    !!showPassword ? Images.eyeOpened : Images.eyeClosed
                  }
                  secureTextEntry={!showPassword}
                  editable={true}
                />

                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: areaDimen(15),
                    justifyContent: 'space-between',
                  }}>
                  <CheckBox
                    checkBoxLeft={5}
                    checkboxstyle={{
                      height: areaDimen(16),
                      width: areaDimen(16),
                      marginTop:
                        Platform.OS == 'ios' ? areaDimen(1) : areaDimen(2),
                    }}
                    checkboxColor={ThemeManager.colors.checkBoxColor}
                    isStored={isRemember}
                    onHandleCheckBox={() => {
                      setIsRemember(!isRemember);
                    }}
                    labelTextstyle={{
                      marginLeft: 10,
                      color: ThemeManager.colors.textColor,
                      minWidth: widthDimen(152),
                      fontSize: areaDimen(14),
                      // bottom:heightDimen(2)
                    }}
                    label={LanguageManager.rememberMe}
                  />
                  <TouchableOpacity
                    onPress={() =>
                      getCurrentRouteName() != 'SaitaCardForgot' &&
                      navigate(NavigationStrings.SaitaCardForgot)
                    }
                    style={{
                      alignItems: 'flex-end',
                      width: '50%',
                    }}>
                    <Text
                      style={{
                        fontFamily: Fonts.medium,
                        fontSize: areaDimen(14),
                        // color: ThemeManager.colors.textColor,
                        color: Colors.buttonColor1,
                      }}>
                      {LanguageManager.forgotPassword}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={{flex: 1, justifyContent: 'flex-end'}}>
              <View
                style={{
                  marginHorizontal: widthDimen(20),
                  marginBottom: heightDimen(10),
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    width: '100%',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    style={{bottom: -1}}
                    onPress={() => {
                      setToggleCheckBox(!toggleCheckBox);
                    }}>
                    <FastImage
                      style={{
                        height: heightDimen(18),
                        width: widthDimen(30),
                      }}
                      resizeMode={FastImage.resizeMode.contain}
                      source={
                        toggleCheckBox
                          ? Images.toggleOn
                          : ThemeManager.ImageIcons.toggleOff
                      }
                    />
                  </TouchableOpacity>
                  {/* <CheckBox
                  checkBoxLeft={0}
                  checkboxstyle={{width: areaDimen(16), height: areaDimen(16)}}
                  checkboxColor={ThemeManager.colors.checkBoxColor}
                  isStored={toggleCheckBox}
                  onHandleCheckBox={() => {
                    setToggleCheckBox(!toggleCheckBox);
                  }}
                /> */}
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      marginLeft: widthDimen(8),
                    }}>
                    <Text
                      style={{
                        fontFamily: Fonts.regular,
                        fontSize: areaDimen(15),
                        color: ThemeManager.colors.inActiveColor,
                        lineHeight: heightDimen(22),
                      }}>
                      {LanguageManager.readAndAccept}
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        Linking.openURL(
                          'https://d18zkqei0yjvv8.cloudfront.net/T&C.pdf',
                        )
                      }>
                      <Text
                        style={{
                          color: ThemeManager.colors.headingText,
                          fontFamily: Fonts.semibold,
                          fontSize: areaDimen(15),
                          lineHeight: heightDimen(22),
                        }}>
                        {LanguageManager.termsOfService}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <GradientButton
                onPress={proceedLogin}
                title={LanguageManager.proceed}
                buttonStyle={styles.buttonView}
              />
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => navigate(NavigationStrings.RegisterNow)}>
                <Text
                  style={[
                    styles.registerText,
                    {color: ThemeManager.colors.textColor},
                  ]}>
                  {LanguageManager.dontHaveAccount}{' '}
                  <Text style={{color: Colors.buttonColor1}}>{LanguageManager.registerNow}</Text>
                </Text>
              </TouchableOpacity>
              {/* <BasicButton
                onPress={() => proceedLogin()}
                btnStyle={[
                  styles.btnStyle,
                  {
                    marginHorizontal: widthDimen(22),
                    marginBottom: heightDimen(30),
                  },
                ]}
                text="Login"
              /> */}
            </View>
          </View>
          {/* *********************************************************** MODAL FOR Apply ********************************************************************** */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={applyModal}
            onRequestClose={() => setApplyModal(false)}>
            <Wrap
              style={{backgroundColor: ThemeManager.colors.backgroundColor}}>
              <ImageBackgroundComponent style={{height: windowHeight}}>
                <SimpleHeader
                  back={false}
                  backPressed={() => setApplyModal(false)}
                />
                <View
                  style={{
                    height: '50%',
                    width: '90%',
                    alignItems: 'center',
                    alignSelf: 'center',
                    justifyContent: 'center',
                  }}>
                  <ImageBackground
                    resizeMode="contain"
                    style={styles.imgcards}
                    source={Images.cardblackform}>
                    <View
                      style={{
                        backgroundColor: 'rgba(57, 57, 57, 0.7)',
                        borderRadius: 17,
                        height: '30%',
                        width: '50%',
                        justifyContent: 'center',
                        padding: 10,
                      }}>
                      <Text style={styles.txtone}>{LanguageManager.applicationFee}</Text>
                      <Text style={styles.txttwo}>USD 249</Text>
                      <Text style={styles.txtthree}>Only USD 199*</Text>
                    </View>
                  </ImageBackground>
                </View>
                <View style={{height: '20%'}}>
                  <Text
                    style={[
                      styles.txtWelcome,
                      {color: ThemeManager.colors.textColor, marginTop: 15},
                    ]}>
                   {LanguageManager.thanksForApplySaitaCard}{'\n'}SaitaCard{' '}
                    <Text
                      style={[
                        styles.txtWelcome,
                        {
                          color: ThemeManager.colors.textColor,
                          marginTop: 15,
                          textTransform: 'capitalize',
                        },
                      ]}>
                      {userCardName}
                    </Text>
                  </Text>
                  <Text style={[styles.txtkyc]}>
                    Now you need to complete your{'\n'}identification process
                    (KYC) to start{'\n'}using SaitaCard
                  </Text>
                </View>
                <View style={{alignItems: 'center', height: '30%'}}>
                  <BasicButton
                    onPress={() => {
                      setApplyModal(false);
                      getCurrentRouteName() != 'KycShufti' &&
                      navigate(NavigationStrings.KycShufti,{email: email});
                    }}
                    btnStyle={styles.btnStylekyc}
                    customGradient={styles.customGrad}
                    text={'Start KYC Process'}
                    textStyle={{fontSize: 16, fontFamily: Fonts.medium}}
                  />
                </View>
              </ImageBackgroundComponent>
            </Wrap>
            {isLoading && <Loader />}
          </Modal>
          {swapModal && (
            <ModalCardTrx
              fromCoin={userAddress}
              showFee={true}
              cardFee={cardFee}
              cardCurrency={'USDT'}
              toCoin={toAddress}
              symbol={'ETH'}
              txnFee={(gasPrice * gasEstimate * GAS_FEE_MULTIPLIER).toFixed(6)}
              onPress={() => {
                setSwapModal(false);
                setisLoading(true);
                purChaseCard();
              }}
              onCancel={() => {
                setSwapModal(false);
              }}
            />
          )}
          {isLoading && <Loader />}
        </View>

        <Modal
          visible={mobileModal}
          animationType="slide"
          onRequestClose={() => {
            setMobileModal(false);
            goBack();
          }}
          transparent>
          <View
            style={{
              backgroundColor: '#0002',
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                backgroundColor: ThemeManager.colors.backgroundColor,
                padding: 20,
                borderRadius: 20,
                alignItems: 'center',
                marginHorizontal: 25,
              }}>
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  right: 25,
                  top: 15,
                }}
                onPress={() => {
                  setMobileModal(false);
                  goBack();
                }}>
                <Text
                  style={{
                    color: ThemeManager.colors.textColor,
                    fontSize: 20,
                    fontFamily: Fonts.bold,
                  }}>
                  X
                </Text>
              </TouchableOpacity>
              <Text
                style={{
                  fontFamily: Fonts.bold,
                  fontSize: 20,
                  color: ThemeManager.colors.textColor,
                }}>
               {LanguageManager.alert}
              </Text>
              <Text
                style={{
                  fontFamily: Fonts.regular,
                  fontSize: 15,
                  color: ThemeManager.colors.textColor,
                }}>
                {LanguageManager.pleaseEnterYourMobileNumber}
              </Text>
              <BasicInputBoxSelect
                disabled={false}
                pressPhone={() => {
                  setMobileModal(false);
                  setCountryModal(true);
                }}
                countrycode={countryCode}
                titleStyle={{
                  color: ThemeManager.colors.textColor,
                  fontSize: 13,
                  fontFamily: Fonts.semibold,
                }}
                title={LanguageManager.phoneNumber}
                mainStyle={{borderColor: ThemeManager.colors.inputBoxColor}}
                keyboardType="number-pad"
                onChangeText={text => {
                  if (Constants.NUMBER_ONLY_REGEX.test(text)) {
                    setMobile(text);
                  }
                }}
                editable={true}
                text={mobile}
                maxLength={15}
                width={'80%'}
                placeholder={LanguageManager.enterhere}
              />
              <BasicButton
                onPress={() => {
                  updateNumber();
                }}
                btnStyle={styles.btnStylekyc}
                customGradient={[styles.customGrad]}
                text={LanguageManager.confirm}
                textStyle={{fontSize: 16, fontFamily: Fonts.medium}}
              />
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={countryModal}
          onRequestClose={() => {
            setCountryModal(false);
          }}>
          <SafeAreaView style={{backgroundColor: Colors.White, flex: 1}}>
            <CountryCodes
              List={countryData}
              twoItems={true}
              onPress={item => {
                setCountryCode(item.dial_code);
                setCountryModal(false);
              }}
              closeModal={() => {
                setCountryModal(false);
              }}
            />
          </SafeAreaView>
        </Modal>

        <Modal
          visible={paymentMethodModal}
          animationType="fade"
          onRequestClose={() => {
            setPaymentMethodModal(false);
            goBack();
          }}
          transparent>
          <View
            style={{
              backgroundColor: '#000a',
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                backgroundColor: ThemeManager.colors.backgroundColor,
                padding: 20,
                borderRadius: 20,
                marginHorizontal: 25,
              }}>
              <Text
                style={{
                  fontFamily: Fonts.semibold,
                  fontSize: 14,
                  color: ThemeManager.colors.textColor,
                }}>
               {LanguageManager.choosePaymentMethod}
              </Text>
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  right: 25,
                  top: 15,
                }}
                onPress={() => {
                  setPaymentMethodModal(false);
                  goBack();
                }}>
                <Text
                  style={{
                    color: ThemeManager.colors.textColor,
                    fontSize: 18,
                    fontFamily: Fonts.bold,
                  }}>
                  X
                </Text>
              </TouchableOpacity>
              <BasicButton
                onPress={() => {
                  setPaymentMethodModal(false);
                  fees(userCardName);
                }}
                btnStyle={{
                  width: windowWidth * 0.8,
                  height: 50,
                  marginTop: 20,
                }}
                customGradient={{
                  borderRadius: 12,
                }}
                text={LanguageManager.payUsingUsdt}
                textStyle={{fontSize: 16, fontFamily: Fonts.medium}}
              />
              <BasicButton
                onPress={() => {
                  createOrder();
                  setPaymentMethodModal(false);
                }}
                customColor={[
                  ThemeManager.colors.backgroundColor,
                  ThemeManager.colors.backgroundColor,
                ]}
                btnStyle={{
                  width: windowWidth * 0.8,
                  height: 50,
                  marginTop: 20,
                }}
                customGradient={{
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: ThemeManager.colors.textColor,
                }}
                text={LanguageManager.payUsingVisa}
                textStyle={{
                  fontSize: 16,
                  fontFamily: Fonts.medium,
                  color: ThemeManager.colors.textColor,
                }}
              />
              <BasicButton
                onPress={() => {
                  setPaymentMethodModal(false);
                  createOrderBinance();
                }}
                customColor={[
                  ThemeManager.colors.backgroundColor,
                  ThemeManager.colors.backgroundColor,
                ]}
                btnStyle={{
                  width: windowWidth * 0.8,
                  height: 50,
                  marginTop: 20,
                }}
                customGradient={{
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: ThemeManager.colors.textColor,
                }}
                text={LanguageManager.payUsingBinancePay}
                textStyle={{
                  fontSize: 16,
                  fontFamily: Fonts.medium,
                  color: ThemeManager.colors.textColor,
                }}
              />
            </View>
          </View>
        </Modal>
      </Wrap>
    </SafeAreaView>
  );
};

export default SaitaCardLogin;
