/* eslint-disable react/self-closing-comp */
/* eslint-disable handle-callback-err */
/* eslint-disable react-native/no-inline-styles */
import { BigNumber } from 'bignumber.js';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  ImageBackground,
  Keyboard,
  Linking,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { EventRegister } from 'react-native-event-listeners';
import FastImage from 'react-native-fast-image';
import { ScrollView } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import { useDispatch } from 'react-redux';
import Web3 from 'web3';
import SmartCardAbi from '../../../../ABI/SmartCardAbi.json';
import tokenCardAbi from '../../../../ABI/tokenCardAbi.json';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import { APIClient } from '../../../Api';
import * as Constants from '../../../Constant';
import { BASE_URL_CARD_EPAY } from '../../../Endpoints';
import { NavigationStrings } from '../../../Navigation/NavigationStrings';
import {
  applyAnotherCard,
  getUserCardDetail,
  sendCardPaymentrx,
  sendOtpCard,
  signupCards
} from '../../../Redux/Actions/SaitaCardAction';
import Singleton from '../../../Singleton';
import { areaDimen, heightDimen, widthDimen } from '../../../Utils/themeUtils';
import { countryData } from '../../../countryCodes';
import { getCurrentRouteName, goBack, navigate } from '../../../navigationsService';
import { Colors, Fonts, Images } from '../../../theme';
import fonts from '../../../theme/Fonts';
import { createOrderForSaitaCard, createOrderForSaitaCard_Binance } from '../../../utils';
import {
  BasicButton,
  BasicInputBox,
  BasicInputBoxPassword,
  BasicInputBoxSelect,
  BorderLine,
  CheckBox,
  SimpleHeader,
  Wrap
} from '../../common';
import { ModalCardTrx } from '../../common/ModalCardTrx';
import CountryCodes from '../CountryCodes/CountryCodes';
import Loader from '../Loader/Loader';
import styles from './SaitaCardApplyFormStyle';
let routerAddressCards =
  Constants.network == 'testnet'
    ? '0xBd5EB4F64C5c9D87e1a33B08AD3FFf8D821da48E'
    : '0x12f939E4FB9d9ccd955a1793A39D87672649706f';

let toAddress = '0x17F72CF26042Cf58a43fEe2250b49Dd2B3bb1C05';

const routerDecimals = Constants.ismainnet ? 6 : 6;
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const SaitaCardApplyForm = props => {
  const dispatch = useDispatch();
  const [selectedMethod, setSelectedMethod] = useState('')
  const [disableSend, setDisableSend] = useState(false);
  const [buttonName, setButtonName] = useState('Send');
  const [finalEmail, setFinalEmail] = useState('');
  const [editable, setEditable] = useState(false);
  const [feePaid, setFeePaid] = useState(false);
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [toggleCheckBoxtwo, setToggleCheckBoxTwo] = useState(false);
  const [PinModal, setPinModal] = useState(false);
  const [countryModal, setCountryModal] = useState(false);
  const [countryListModal, setCountryListModal] = useState(false);
  const [Pin, setPin] = useState('');
  const [countrycode, setCountryCode] = useState('+91');
  const [swapModal, setSwapModal] = useState(false);
  const [email, setEmail] = useState('');
  const [cardFee, setCardFee] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [number, setNumber] = useState('');
  const [address, setAddress] = useState('');
  const [address1, setAddress1] = useState('');
  const [state, setstate] = useState('');
  const [country, setcountry] = useState('');
  const [zipcode, setzipcode] = useState('');
  const [isLoading, setisLoading] = useState(false);
  const [gasEstimate, setGasEstimate] = useState(0);
  const [gasPrice, setGasPrice] = useState(0);
  const [rawTxnObj, setRawTxnObj] = useState();
  const [userCardType, setUserCardType] = useState(0);
  const GAS_FEE_MULTIPLIER = 0.000000000000000001;
  const GAS_BUFFER = 35000;
  const [privateKey, setPrivateKey] = useState('');
  const [applyModal, setApplyModal] = useState(false);
  const [tokenResultAddress, setTokenResultAddress] = useState('');
  const [ethBalance, setEthBalance] = useState('');
  const [iskycApproved, setiskycApproved] = useState(false);

  const [paymentMethodModal, setPaymentMethodModal] = useState(false);

  const [userId, setuserId] = useState('');

  const [time, setTime] = React.useState(props.initialValue || 60);
  const timerRef = React.useRef(time);
  const [showTime, setshowTime] = useState(false);

  let userAddress = Singleton.getInstance().defaultEthAddress;
  let allowance_timer;

  let pvtKey;
  useEffect(() => {
    EventRegister.addEventListener('txnModal', data1 => {
      console.warn('MM', 'data1data1data1', data1);
      setSwapModal(false);
      setTimeout(() => {
        setSwapModal(true);
      }, 500);
    });
    console.warn('MM', 'selected Item::::::>>', props?.route?.params?.selectedItem);
    Singleton.getInstance()
      .newGetData(`${Singleton.getInstance().defaultEthAddress}_pk`)
      .then(ethPvtKey => {
        console.warn('MM', 'ethPvtKey--------', ethPvtKey);
        pvtKey = ethPvtKey;
        setPrivateKey(ethPvtKey);
      });
    balance();
    getGasPriceValue();
    checkPayment(true);
  }, []);

  const createOrder = async () => {
    try {
      let token = await Singleton.getInstance().newGetData(
        Constants.access_token_cards,
      );
      let req = {
        card_table_id: props?.route?.params?.selectedItem?.card_table_id,
        address: Singleton.getInstance().defaultEthAddress,
      };
      console.log('req...', req);
      setisLoading(true);
      createOrderForSaitaCard(req, token)
        .then(res => {
          setPaymentMethodModal(false)
          setisLoading(false);
          console.log('resssss', res);
          if (res?.status) {
            if (res.data.customerId && res.data.orderId && res.data.amount) {
              let url = `${BASE_URL_CARD_EPAY}?customerId=${res.data.customerId}&orderID=${res.data.orderId}&orderDescription=${props?.selectedItem?.name}&orderAmount=${res.data.amount}`;
              navigate(NavigationStrings.SaitaCardEpay,{ linkhash: url });
            } else {
              Singleton.showAlert('Unable to process your request');
            }
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
  const createOrderBinance = async () => {
    try {
      let token = await Singleton.getInstance().newGetData(
        Constants.access_token_cards,
      );
      let bnb_pay_order_type = 'full';
      console.log('ppp', bnb_pay_order_type);
      setisLoading(true);
      createOrderForSaitaCard_Binance(
        {
          card_table_id: props?.route?.params?.selectedItem?.card_table_id,
          bnb_pay_order_type,
          card_category: props?.route?.params?.selectedItem.card_type,
        },
        token,
      )
        .then(res => {
          setisLoading(false);
          console.log('resssss', res);
          if (res?.status) {
            getCurrentRouteName() != 'SaitaCardBinanceQr' &&
            navigate(NavigationStrings.SaitaCardBinanceQr, {data: res?.data});
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
  const checkPayment = isFirst => {
    setisLoading(true);
    Singleton.getInstance()
      .newGetData(Constants.access_token_cards)
      .then(access_token => {
        console.warn('MM', '>>>>access_token', access_token);
        checkuserDetail(access_token, isFirst);
      });
  };
  const balance = async () => {
    const web3Object = getWeb3Object();
    let ethBal = await web3Object.eth.getBalance(userAddress);
    setEthBalance(ethBal);
    console.warn('MM', 'data ======>>  ethBal 111', ethBal, userAddress);
  };
  const getGasPriceValue = () => {
    getWeb3Object()
      .eth.getGasPrice()
      .then(async gasPrice => {
        console.warn('MM', 'data ======>> gasPrice', gasPrice);
        setGasPrice((parseInt(gasPrice) + 4200703310).toString());
      });
  };

  const getWeb3Object = () => {
    let network = new Web3(Singleton.getInstance().ethLink);
    console.warn('MM', 'network');
    return network;
  };

  const getContractObject = async (address, abi) => {
    try {
      const web3Object = getWeb3Object();
      console.warn('MM', '>>>>fees111');
      let tokenContractObject;
      try {
        tokenContractObject = await new web3Object.eth.Contract(abi, address);
      } catch (error) {
        console.warn('MM', '>>>>errorerror', error);
      }

      console.warn('MM', '>>>>fees222');
      return tokenContractObject;
    } catch (e) {
      console.error('error ===>>', e);
    }
  };

  const fees = async () => {
    console.warn('MM', '>>>>>SignUpUser233333,');
    try {
      setisLoading(true);
      console.warn('MM', '>>>>fees');
      let routerContractObject = await getContractObject(
        routerAddressCards,
        SmartCardAbi,
      );
      console.warn('MM', '>>>>fees333');
      let result = await routerContractObject.methods.feeToken().call();
      console.warn('MM', '+++++++++++', result);
      setTokenResultAddress(result);
      const cardType =
        props?.route?.params?.selectedItem.name?.toLowerCase() == 'black'
          ? 0
          : props?.route?.params?.selectedItem.name?.toLowerCase() == 'diamond'
            ? 1
            : props?.route?.params?.selectedItem.name?.toLowerCase() == 'gold'
              ? 2
              : 0;
      setUserCardType(cardType);
      let cardFees = await routerContractObject.methods
        .cardTypeToFees(cardType)
        .call();
      console.warn('MM', '+++++++++++cardFees', cardFees);
      const fee = Singleton.getInstance().exponentialToDecimal(
        cardFees / 10 ** routerDecimals,
      );
      console.warn('MM', '+++++++++++cardFee  >>>', fee, routerDecimals);
      setCardFee(fee);
      let tokenContractObject = await getContractObject(result, tokenCardAbi);
      const tokenBal = await tokenContractObject.methods
        .balanceOf(userAddress)
        .call();
      console.warn('MM', '+++++++++++tokenBal', tokenBal, userAddress);
      const bal = tokenBal / 10 ** routerDecimals;
      console.warn('MM', '+++++++++++tokenBal', bal, fee);
      if (bal < fee) {
        setisLoading(false);
        Alert.alert(
          Constants.APP_NAME,
          `Insufficient Balance. Required fee is ${Singleton.getInstance().exponentialToDecimal(
            fee,
          )} USDT.`,
          [
            {
              text: 'Ok',
              onPress: () => { },
            },
          ],
          { cancelable: false },
        );
        return;
      }
      console.warn('MM', 'tokenContractObject ==>>>');
      let allowance = await tokenContractObject.methods
        .allowance(userAddress, routerAddressCards)
        .call();
      console.warn('MM', 'allowance ==>>> 111', allowance);

      if (BigNumber(allowance).toFixed(0) <= 0) {
        tokenContractObject.methods
          .approve(routerAddressCards, BigNumber(10 ** 25).toFixed(0))
          .estimateGas({ from: userAddress })
          .then(gasEstimate => {
            setGasEstimate(gasEstimate + GAS_BUFFER);
            setisLoading(false);
            let data = {
              path: result,
              tokenContractObject: tokenContractObject,
            };

            const cardName =
              props?.route?.params?.selectedItem.name?.toLowerCase() == 'black'
                ? 'Black'
                : props?.route?.params?.selectedItem.name?.toLowerCase() == 'diamond'
                  ? 'Diamond'
                  : props?.route?.params?.selectedItem.name?.toLowerCase() == 'gold'
                    ? 'Gold'
                    : 'Black';
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
                        "You don't have enough ETH to perform transaction",
                      );
                      return;
                    } else {
                      getApproval(data);
                    }
                  },
                },
                {
                  text: 'Cancel',
                  onPress: () => { },
                },
              ],
              { cancelable: false },
            );
          })
          .catch(err => {
            if (err.message.includes('insufficient funds')) {
              Singleton.showAlert('Insufficient funds');
            }
          });
      } else {
        console.warn('MM', 'purChaseCard 00');
        setPinModal(false);
        Singleton.getInstance().isOtpModal = false;
        purChaseCardFee(cardType);
      }
    } catch (error) { }
  };
  const purChaseCardFee = async cardType => {
    setisLoading(true);
    let selectedCardType = cardType ? cardType : userCardType;
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
        setGasEstimate(gasEstimate + GAS_BUFFER);
        setisLoading(false);
        setRawTxnObj(purchaseAbi.encodeABI());
        setSwapModal(true);
        Singleton.getInstance().istxnModal = true;
      })
      .catch(err => {
        setisLoading(false);
        Singleton.showAlert(err.message);
      });
  };

  const purChaseCard = async () => {
    try {
      const web3Object = await getWeb3Object();
      const nonce = await web3Object.eth.getTransactionCount(userAddress);
      console.warn('MM', '\n\n\n ****nonce*****  ', nonce);
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
      setTimeout(() => {
        Alert.alert(
          'Success',
          'Till etherscan approves the transaction, lets make a SaitaCard Wish list',
          [
            {
              text: 'Ok',
              onPress: () => {
                navigate(NavigationStrings.SaitaCardsInfo);
              },
            },
          ],
          { cancelable: false },
        );
      }, 400);
      return result;
    } catch (error) { }
  };

  const getApproval = data => {
    console.warn('MM', 'approve sallownceTxnObj ==>>', privateKey, data);
    setisLoading(true);
    approveTransaction(
      data.tokenContractObject,
      routerAddressCards,
      userAddress,
      data.path,
      privateKey,
    )
      .then(resultApprove => {
        allowanceLoop();
      })
      .catch(err => {
        Alert.alert(Constants.APP_NAME, 'Approval Failed');
      });
  };

  const allowanceLoop = () => {
    console.warn('MM', 'allowanceLoop');
    allowance_timer = setTimeout(() => {
      let result = chekAllowance();
      if (result) {
        Alert.alert(
          Constants.APP_NAME,
          'Transaction sent to Blockchain for Approval',
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
    console.warn('MM', 'tokenContractObject ==>>>');
    let allowance = await tokenContractObject.methods
      .allowance(userAddress, routerAddressCards)
      .call();
    if (BigNumber(allowance).toFixed(0) <= 0) {
      console.warn('MM', 'allowance ==>>>false');
      return false;
    } else {
      console.warn('MM', 'allowance ==>>>true');
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
    try {
      console.log(
        'MM',
        '**** APPROVED TRANSACTION ALERT **',
        spenderAddress,
        userAddress,
        tokenAddress,
        privateKey,
        gasPrice,
      );
      const web3Object = getWeb3Object();
      const approveTrans = tokenContractObject.methods.approve(
        spenderAddress,
        BigNumber(10 ** 25).toFixed(0),
      );
      const approveGasLimit = await approveTrans.estimateGas({
        from: userAddress,
      });
      console.warn('MM', 'approveGasLimit ===>>>', approveGasLimit);
      const nonce = await web3Object.eth.getTransactionCount(userAddress);
      console.warn('MM', 'nonce ===>>>', nonce, privateKey);
      const resultApprove = await makeTransaction(
        approveTrans.encodeABI(),
        gasPrice,
        approveGasLimit + GAS_BUFFER,
        nonce,
        '0x0',
        tokenAddress,
        privateKey,
        userAddress,
        true,
      );
      return resultApprove;
    } catch (error) {
      Singleton.showAlert(Constants.SOMETHING_WRONG);
      return 0;
    }
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
        let txn = await web3Object.eth.accounts.signTransaction(
          rawTransaction,
          privateKey,
        );
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
        let serializedTran = txn.rawTransaction.toString('hex');
        let result;
        try {
          result = await getWeb3Object().eth.sendSignedTransaction(
            serializedTran,
          );
        } catch (error) {
          setisLoading(false);
          if (
            error?.message?.includes('insufficient funds') ||
            error?.includes('insufficient')
          ) {
            Singleton.showAlert('Insufficient funds');
          } else {
            Singleton.showAlert(error?.message || Constants.SOMETHING_WRONG);
          }
          return reject(error);
        }
        setisLoading(false);
        data.tx_hash = result?.transactionHash;
        await sendDataToWallet(
          data,
          Constants.NETWORK.ETHEREUM,
          '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          fromApproval,
        );

        return resolve(result);
      } catch (error) {
        Singleton.showAlert(Constants.SOMETHING_WRONG);
      }
    });
  };

  const sendTransactionToBackend = tx_id => {
    setisLoading(true);
    Singleton.getInstance()
      .newGetData(Constants.access_token_cards)
      .then(access_token => {
        let data = {
          card_table_id: props?.route?.params?.cardType,
          from_adrs: userAddress,
          to_adrs: null,
          tx_id: tx_id,
          coin_id: null,
          coin_symbol: 'usdt',
          coin_family: null,
          amount: cardFee,
          user_id: userId,
        };
        dispatch(sendCardPaymentrx({ data, access_token }))
          .then(res => {
            setisLoading(false);
          })
          .catch(err => {
            setisLoading(false);
            Singleton.showAlert(err.message);
          });
      });
  };

  const sendDataToWallet = (data, blockChain, coin_symbol, fromApproval) => {
    return new Promise((resolve, reject) => {
      let access_token = Singleton.getInstance().access_token;
      APIClient.getInstance()
        .post(`${blockChain}/${coin_symbol}/savetrnx`, data, access_token)
        .then(res => {
          resolve(res);
          if (fromApproval) {
          } else {
            sendTransactionToBackend(data.tx_hash);
          }
        })
        .catch(err => {
          Singleton.showAlert(err?.message || Constants.SOMETHING_WRONG);
          reject(err);
        });
    });
  };
  const onProceed = () => {
    Keyboard.dismiss();
    if (editable) {
      if (firstname.trim() == '') {
        Singleton.showAlert('First Name field is required');
        return;
      } else if (lastname.trim() == '') {
        Singleton.showAlert('Last Name field is required');
        return;
      } else if (firstname.length < 3) {
        Singleton.showAlert('Name field must be greater than 3 characters');
        return;
      } else if (number.trim() == '') {
        Singleton.showAlert('Phone Number field is required');
        return;
      } else if (number.length < 8) {
        Singleton.showAlert('Phone number should be between 8-12 numbers');
        return;
      } else if (number.length > 12) {
        Singleton.showAlert('Phone number should be between 8-12 numbers');
        return;
      } else if (address.trim() == '') {
        Singleton.showAlert('Address 01 field is required');
        return;
      } else if (address.length < 5) {
        Singleton.showAlert(
          'Address 01 field must be greater than 5 characters.',
        );
        return;
      } else if (state.trim() == '') {
        Singleton.showAlert('State field is required');
        return;
      } else if (country.trim() == '') {
        Singleton.showAlert('Country field is required');
        return;
      } else if (zipcode.trim() == '') {
        Singleton.showAlert('Zip Code field is required');
        return;
      } else if (email.trim() == '') {
        Singleton.showAlert('Email field is required');
        return;
      } else if (password == '') {
        Singleton.showAlert('Password field is required.');
        return;
      } else if (password.length < 6) {
        Singleton.showAlert('Password must be greater than 5 characters');
        return;
      } else if (Constants.PASSWORD_REGEX.test(password) == false) {
        Singleton.showAlert(
          'Password must include a special character, upper and lower case letters and a number',
        );
        return;
      } else if (Constants.EMAIL_REGEX.test(email) == false) {
        Singleton.showAlert('Please provide valid email.');
        return;
      } else if (!toggleCheckBox) {
        Singleton.showAlert('Accept Terms & Conditions');
        return;
      } else if (!toggleCheckBoxtwo) {
        Singleton.showAlert('Accept Email & SMS Communication');
        return;
      }
      SignUpUser();
    } else {
      if (!toggleCheckBox) {
        Singleton.showAlert('Accept Terms & Conditions');
        return;
      } else if (!toggleCheckBoxtwo) {
        Singleton.showAlert('Accept Email & SMS Communication');
        return;
      }
      const selectedItem = props?.route?.params?.selectedItem;
      console.warn('MM', 'selectedItem::::::::::', selectedItem);
      if (selectedItem.fee_status == 'complete') {
        if (selectedItem.kyc_status == 0) {
          setApplyModal(true);
        } else if (
          selectedItem.kyc_status == 2 &&
          selectedItem.card_applied == null
        ) {
          applyCard();
        }
      } else {
        if (selectedItem.fee_status == 'pending') {
          Singleton.showAlert(
            'Your transaction is in pending state, Please wait',
          );
        } else {
          setPaymentMethodModal(true);

          // fees();
        }
      }
    }
  };
  const redirect = msg => {
    Alert.alert(
      'SaitaPro',
      msg,
      [
        {
          text: 'Ok',
          onPress: () => {
            navigate(NavigationStrings.SaitaCardLogin);
          },
        },
      ],
      { cancelable: false },
    );
  };
  const applyCard = () => {
    setisLoading(true);
    Singleton.getInstance()
      .newGetData(Constants.access_token_cards)
      .then(access_token => {
        let data = {
          card_table_id: props?.route?.params?.selectedItem.card_table_id,
          card_type_id: props?.route?.params?.selectedItem.card_type_id,
          card_name: props?.route?.params?.selectedItem.name,
        };
        dispatch(applyAnotherCard({ data, access_token }))
          .then(res => {
            console.warn('MM', 'apply card res:::::', res);
            setisLoading(false);
            const cardName =
              props?.route?.params?.selectedItem.name?.toLowerCase() == 'black'
                ? 'Black'
                : props?.route?.params?.selectedItem.name?.toLowerCase() == 'diamond'
                  ? 'Diamond'
                  : props?.route?.params?.selectedItem.name?.toLowerCase() == 'gold'
                    ? 'Gold'
                    : 'Black';
            Alert.alert(
              Constants.APP_NAME,
              `${cardName} card applied successfully`,
              [
                {
                  text: 'Ok',
                  onPress: () => {
                    navigate(NavigationStrings.SaitaCardsInfo);
                  },
                },
              ],
              { cancelable: false },
            );
          })
          .catch(err => {
            console.warn('MM', 'apply card err:::::', err);
            setisLoading(false);
            Singleton.showAlert(err.message);
          });
      });
  };
  const applyAndPay = () => {
    setisLoading(true);
    let data = {
      email: email,
    };
    dispatch(sendOtpCard({ data }))
      .then(res => {
        setisLoading(false);
        console.warn('MM', '>>>>>>', res);
        if (res.status) {
          setshowTime(true);
          timerRef.current = 60;
          setTime(60);
          startTimer();
          setPin('');
        } else {
          setisLoading(false);
          Singleton.showAlert(res.message);
        }
      })
      .catch(err => {
        console.warn('MM', err);
        setisLoading(false);
        if (
          err.message.includes('Email already verifed. Please try to login.')
        ) {
          redirect(err.message);
        } else {
          Singleton.showAlert(err.message);
        }
      });
  };

  const resendOtp = () => {
    setisLoading(true);
    let data = {
      email: email,
    };
    dispatch(sendOtpCard({ data }))
      .then(res => {
        setisLoading(false);
        console.warn('MM', '>>>>>>', res);
        if (res.status) {
          console.warn('MM', '>>>>>>iiiiiiiiii', res);
          setshowTime(true);
          startTimer();
        }
      })
      .catch(err => {
        setisLoading(false);
        Singleton.showAlert(err.message);
      });
  };
  const SignUpUser = () => {
    console.warn('MM', '>>>>>SignUpUser,');
    if (Pin.length < 6) {
      Singleton.showAlert('Enter valid OTP');
      return;
    } else if (userId) {
      setEditable(false);
      setPinModal(false);
      console.warn('MM', '>>>>>SignUpUser222,');
      setPaymentMethodModal(true);
      return;
    }
    setisLoading(true);
    let data = {
      first_name: firstname,
      last_name: lastname,
      country_code: countrycode.replace('+', ''),
      mobile_no: number,
      address_01: address,
      address_02: address1,
      state: state,
      country: country,
      zip_code: zipcode,
      email: email,
      password: password,
      card_type_id: props?.route?.params?.selectedItem.card_type_id,
      card_table_id: props?.route?.params?.cardType,
      otp: Pin,
      card_name: props?.route?.params?.selectedItem.name,
      device_token: Singleton.getInstance().device_token,
    };
    dispatch(signupCards({ data }))
      .then(res => {
        setisLoading(false);
        console.warn('MM', '>>>>>>', res);
        if (res.status) {
          Singleton.getInstance().newSaveData(
            Constants.access_token_cards,
            res.data.jwt,
          );
          setuserId(res.data.userId);
          setPinModal(false);
          setPaymentMethodModal(true);
        } else {
          Singleton.showAlert(res.message);
        }
      })
      .catch(err => {
        setisLoading(false);
        Singleton.showAlert(err.message);
      });
  };

  const checkuserDetail = (access_token, isFirst) => {
    dispatch(getUserCardDetail({ access_token }))
      .then(res => {
        console.warn('MM', 'MM', 'getUserCardDetail ::::::: ApplyForm', res);

        const selectedData = props?.route?.params?.selectedItem;
        if (
          selectedData.fee_status == 'complete' &&
          selectedData.kyc_status == 2 &&
          selectedData.card_applied == null
        ) {
          setFeePaid(true);
        } else {
          setFeePaid(false);
        }
        if (res.cards.length > 0) {
          setFirstName(res.full_name.split(' ')[0]);
          setLastName(res.full_name.split(' ')[1]);
          setCountryCode('+' + res.country_code);
          setNumber(res.mobile_no);
          setAddress(res.address_01);
          setAddress1(res.address_02);
          setstate(res.state);
          setcountry(res.country);
          setzipcode(res.zip_code);
          setEmail(res.email);
          setuserId(res.user_id);
          setEditable(false);
          setPaymentMethodModal(true)
        } else {
          setEditable(true);
          if (res.kyc_status == 2) {
            setiskycApproved(true);
          } else {
            setiskycApproved(false);
          }
          if (isFirst) {
            return;
          }
          console.warn('MM', '>>>> selectedData', selectedData);
          if (selectedData.fee_status == 'complete') {
            setApplyModal(false);
            getCurrentRouteName() != 'KycShufti' &&
            navigate(NavigationStrings.KycShufti,{ email: email });
          } else if (selectedData.fee_status == 'failed') {
            Singleton.showAlert('Payment Failed, Please try again.');
          } else {
            Singleton.showAlert('Waiting for Blockchain Confirmation.');
          }
        }
        setisLoading(false);
      })
      .catch(err => {
        setisLoading(false);
        setEditable(true);
      });
  };
  const startTimer = () => {
    console.warn('MM', 'startTimer1111', timerRef);
    const timerId = setInterval(() => {
      console.warn('MM', 'startTimer222', timerRef);
      timerRef.current -= 1;
      if (timerRef.current < 0) {
        console.warn('MM', 'startTimer333', timerRef);
        clearInterval(timerId);
        setTime(60);
        timerRef.current = 60;
      } else {
        console.warn('MM', 'startTimer4444', timerRef);
        if (timerRef.current == 0) {
          if (email == finalEmail) {
            setButtonName('Resend');
          }
          setDisableSend(false);
          console.warn('MM', 'startTimer5555', timerRef);
          setshowTime(false);
          setTime(60);
        }
        console.warn('MM', 'startTimer6666', timerRef);
        setTime(timerRef.current);
      }
    }, 1000);
  };
  if (PinModal) {
    return (
      <Wrap style={{ backgroundColor: ThemeManager.colors.backgroundColor }}>
        <SimpleHeader
          back={false}
          backPressed={() => {
            setPinModal(false);
          }}
          title={LanguageManager.otp}
        />
        <BorderLine
          borderColor={{ backgroundColor: ThemeManager.colors.chooseBorder }}
        />
        <View style={{ alignItems: 'center', marginTop: 30 }}>
          <Text
            style={{
              fontSize: 13,
              fontFamily: fonts.semibold,
              color: ThemeManager.colors.textColor,
            }}>
            {LanguageManager.otptext}
          </Text>
        </View>
        <View style={{ alignItems: 'center', marginTop: 20, flex: 1 }}>
          <SmoothPinCodeInput
            autoFocus={true}
            cellSize={42}
            codeLength={6}
            cellStyleFocused={{ borderColor: ThemeManager.colors.textColor }}
            cellStyle={[
              styles.cellStyle,
              { borderColor: ThemeManager.colors.viewBorderColor },
            ]}
            textStyle={[
              styles.inputText,
              { color: ThemeManager.colors.textColor },
            ]}
            value={Pin}
            onTextChange={text => {
              if (Constants.NUMBER_ONLY_REGEX.test(text)) {
                setPin(text);
              }
            }}
          />
          {showTime == false && (
            <TouchableOpacity
              onPress={() => {
                resendOtp();
              }}>
              <Text style={[styles.numbertitleStyle, { color: Colors.red_dark }]}>
                {' '}
                Resend Code
              </Text>
            </TouchableOpacity>
          )}
          {showTime && (
            <View>
              <Text style={[styles.numbertitleStyle, { color: Colors.red_dark }]}>
                {' '}
                {`00:${time}`}
              </Text>
            </View>
          )}
        </View>

        <View style={{ alignItems: 'center' }}>
          <BasicButton
            btnStyle={{
              marginVertical: 20,
              height: heightDimen(60),
              width: '84%',
              borderRadius: 10,
            }}
            onPress={() => SignUpUser()}
            customGradient={{ borderRadius: heightDimen(30), height: heightDimen(60) }}
            text={LanguageManager.proceed}
            textStyle={{ fontSize: 16, fontFamily: fonts.semibold }}
          />
        </View>
        {isLoading && <Loader />}
      </Wrap>
    );
  }
  const onPressRightText = () => {
    Keyboard.dismiss();
    let regx = /^[^\s@]+@[^\s@.]+\.[^\s@]{2,}$/;
    if (email.trim() == '') {
      Singleton.showAlert('Please enter your email.');
      return;
    } else if (!regx.test(email?.trim())) {
      Singleton.showAlert('Please enter valied email.');
      return;
    } else {
      setDisableSend(true);
      setFinalEmail(email);
      applyAndPay('sendCode');
    }
  };
  const onPressPay = () => {
    console.log('paymentMode', selectedMethod);
    if(selectedMethod=='ePay'){
      createOrder();
    }else  if(selectedMethod=='bPay'){
      createOrderBinance();
    }else{
      fees();
    }
  };
  return (
    <>
      <Wrap style={{ backgroundColor: ThemeManager.colors.bg }}>
        <SimpleHeader
          title={`SaitaCard ${props?.route?.params?.selectedItem.name?.toLowerCase() == 'black'
              ? 'Black'
              : props?.route?.params?.selectedItem.name?.toLowerCase() == 'diamond'
                ? 'Diamond'
                : props?.route?.params?.selectedItem.name?.toLowerCase() == 'gold'
                  ? 'Gold'
                  : 'Black'
            }`}
          backImage={ThemeManager.ImageIcons.iconBack}
          titleStyle={{ marginRight: 30 }}
          imageShow
          back={false}
          backPressed={() => {
            goBack();
          }}
        />
        <BorderLine
          borderColor={{ backgroundColor: ThemeManager.colors.viewBorderColor }}
        />
        <ScrollView >
          <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            enableOnAndroid={true}
            keyboardShouldPersistTaps={'always'}
            bounces={false}
            style={{paddingBottom:heightDimen(30)}}
            >
            <View style={[styles.container]}>
              <View style={{ flex: 1, paddingHorizontal: widthDimen(22) }}>
                <BasicInputBox
                  editable={editable}
                  titleStyle={{
                    color: ThemeManager.colors.textColor,
                    fontSize: 13,
                    fontFamily: fonts.semibold,
                  }}
                  title={LanguageManager.firstName}
                  maxLength={20}
                  mainStyle={{ borderColor: ThemeManager.colors.viewBorderColor }}
                  width="100%"
                  text={firstname}
                  keyboardType={
                    Platform.OS == 'ios' ? 'ascii-capable' : 'visible-password'
                  }
                  onChangeText={text => {
                    if (Constants.ALPHABET_REGEX.test(text)) {
                      setFirstName(text);
                    }
                  }}
                  placeholder={LanguageManager.enterhere}></BasicInputBox>
                <BasicInputBox
                  editable={editable}
                  titleStyle={{
                    color: ThemeManager.colors.textColor,
                    fontSize: 13,
                    fontFamily: fonts.semibold,
                  }}
                  title={LanguageManager.lastName}
                  maxLength={20}
                  mainStyle={{ borderColor: ThemeManager.colors.viewBorderColor }}
                  width="100%"
                  keyboardType={
                    Platform.OS == 'ios' ? 'ascii-capable' : 'visible-password'
                  }
                  text={lastname}
                  onChangeText={text => {
                    if (Constants.ALPHABET_REGEX.test(text)) {
                      setLastName(text);
                    }
                  }}
                  placeholder={LanguageManager.enterhere}></BasicInputBox>
                <BasicInputBoxSelect
                  disabled={editable ? false : true}
                  pressPhone={() => setCountryModal(true)}
                  countrycode={countrycode}
                  titleStyle={{
                    color: ThemeManager.colors.textColor,
                    fontSize: 13,
                    fontFamily: fonts.semibold,
                  }}
                  title={LanguageManager.phoneNumber}
                  mainStyle={{
                    borderColor: ThemeManager.colors.viewBorderColor,
                    borderRadius: 100,
                  }}
                  keyboardType="number-pad"
                  onChangeText={text => {
                    if (Constants.NUMBER_ONLY_REGEX.test(text)) {
                      setNumber(text);
                    }
                  }}
                  editable={editable}
                  text={number}
                  maxLength={15}
                  width={'80%'}
                  mainContainerStyle={{
                    marginTop: heightDimen(10),
                    paddingHorizontal: 0,
                  }}
                  placeholder={LanguageManager.enterhere}></BasicInputBoxSelect>
                <BasicInputBox
                  editable={editable}
                  titleStyle={{
                    color: ThemeManager.colors.textColor,
                    fontSize: 13,
                    fontFamily: fonts.semibold,
                  }}
                  title={LanguageManager.address1}
                  maxLength={30}
                  keyboardType={
                    Platform.OS == 'ios' ? 'ascii-capable' : 'visible-password'
                  }
                  onChangeText={text => setAddress(text)}
                  mainStyle={{ borderColor: ThemeManager.colors.viewBorderColor }}
                  width="100%"
                  text={address}
                  placeholder={LanguageManager.enterhere}></BasicInputBox>
                <BasicInputBox
                  editable={editable}
                  titleStyle={{
                    color: ThemeManager.colors.textColor,
                    fontSize: 13,
                    fontFamily: fonts.semibold,
                  }}
                  title={LanguageManager.address2}
                  width="100%"
                  maxLength={30}
                  text={address1}
                  keyboardType={
                    Platform.OS == 'ios' ? 'ascii-capable' : 'visible-password'
                  }
                  onChangeText={text => setAddress1(text)}
                  mainStyle={{ borderColor: ThemeManager.colors.viewBorderColor }}
                  placeholder={LanguageManager.enterhere}></BasicInputBox>

                <View
                  style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <BasicInputBox
                    editable={editable}
                    titleStyle={{
                      color: ThemeManager.colors.textColor,
                      fontSize: 13,
                      fontFamily: fonts.semibold,
                    }}
                    title={LanguageManager.state}
                    mainContainerStyle={{ width: '48%' }}
                    keyboardType={
                      Platform.OS == 'ios' ? 'ascii-capable' : 'visible-password'
                    }
                    maxLength={20}
                    text={state}
                    onChangeText={text => {
                      if (Constants.ALPHABET_REGEX.test(text)) {
                        setstate(text);
                      }
                    }}
                    style={{ flex: 1 }}
                    mainStyle={{ borderColor: ThemeManager.colors.viewBorderColor }}
                    placeholder={LanguageManager.enterhere}></BasicInputBox>

                  <View style={{ width: '48%' }}>
                    <BasicInputBox
                      editable={editable}
                      titleStyle={{
                        color: ThemeManager.colors.textColor,
                        fontSize: 13,
                        fontFamily: fonts.semibold,
                      }}
                      title={LanguageManager.country}
                      mainContainerStyle={{ width: '100%' }}
                      maxLength={20}
                      text={country}
                      onChangeText={text => {
                        if (Constants.ALPHABET_REGEX.test(text)) {
                        }
                      }}
                      style={{ flex: 1 }}
                      mainStyle={{
                        borderColor: ThemeManager.colors.viewBorderColor,
                      }}
                      placeholder={LanguageManager.enterhere}></BasicInputBox>
                    <TouchableOpacity
                      onPress={() => {
                        if (editable) {
                          setCountryListModal(true);
                        } else {
                        }
                      }}
                      style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                      }}></TouchableOpacity>
                  </View>
                </View>

                <BasicInputBox
                  editable={editable}
                  titleStyle={{
                    color: ThemeManager.colors.textColor,
                    fontSize: 13,
                    fontFamily: fonts.semibold,
                  }}
                  title={LanguageManager.zipcode}
                  width="100%"
                  maxLength={20}
                  keyboardType={
                    Platform.OS == 'ios' ? 'ascii-capable' : 'visible-password'
                  }
                  text={zipcode}
                  onChangeText={text => {
                    setzipcode(text);
                  }}
                  mainStyle={{ borderColor: ThemeManager.colors.viewBorderColor }}
                  placeholder={LanguageManager.enterhere}></BasicInputBox>

                <BasicInputBox
                  titleStyle={{
                    color: ThemeManager.colors.textColor,
                    fontSize: areaDimen(14),
                    lineHeight: heightDimen(18),
                    fontFamily: fonts.medium,
                  }}
                  title={LanguageManager.emailid}
                  width="100%"
                  maxLength={40}
                  keyboardType={
                    Platform.OS == 'ios' ? 'ascii-capable' : 'visible-password'
                  }
                  text={email}
                  onChangeText={text => {
                    timerRef.current = 0;
                    setButtonName('Send');
                    setDisableSend(false);
                    setshowTime(false);
                    if (text) {
                      text = text?.trim();
                    }
                    setEmail(text);
                  }}
                  mainStyle={{
                    borderColor: ThemeManager.colors.viewBorderColor,
                  }}
                  placeholder={LanguageManager.enterhere}
                  onPressRightText={() => {
                    onPressRightText();
                  }}
                  editable={editable}
                  disabledRight={disableSend}
                  disableColor={ThemeManager.colors.inActiveColor}
                  rightText={`${buttonName} Code`}
                />
                {showTime && (
                  <View>
                    <Text
                      style={[styles.numbertitleStyle, { color: Colors.red_dark }]}>
                      {' '}
                      {`00:${time}`}
                    </Text>
                  </View>
                )}
                {editable && (
                  <BasicInputBoxPassword
                    titleStyle={{
                      color: ThemeManager.colors.textColor,
                      fontSize: areaDimen(14),
                      lineHeight: heightDimen(18),
                      fontFamily: fonts.medium,
                      marginTop: heightDimen(15),
                    }}
                    title={LanguageManager.password}
                    width="85%"
                    maxLength={20}
                    onPress={() => setShowPassword(!showPassword)}
                    secureTextEntry={showPassword}
                    onChangeText={text => {
                      setPassword(text);
                    }}
                    mainContainerStyle={{ paddingHorizontal: 0 }}
                    mainStyle={{
                      borderColor: ThemeManager.colors.viewBorderColor,
                    }}
                    placeholder={
                      LanguageManager.enterhere
                    }></BasicInputBoxPassword>
                )}
                <Text
                  style={[
                    {
                      color: ThemeManager.colors.textColor,
                      left: 0,
                      marginTop: heightDimen(15),
                      color: ThemeManager.colors.textColor,
                      fontSize: areaDimen(14),
                      lineHeight: heightDimen(18),
                      fontFamily: fonts.medium,
                    },
                  ]}>
                  Enter 6Digit Code
                </Text>
                <View
                  style={{
                    marginHorizontal: widthDimen(22),
                    marginTop: heightDimen(10),
                    paddingLeft: widthDimen(10),
                  }}>
                  <SmoothPinCodeInput
                    autoFocus={false}
                    cellSize={42}
                    codeLength={6}
                    cellStyleFocused={{
                      borderColor: ThemeManager.colors.primary,
                      borderRadius: areaDimen(27),
                    }}
                    cellStyle={[
                      styles.cellStyle,
                      {
                        borderColor: ThemeManager.colors.viewBorderColor,
                        borderRadius: 25,
                      },
                    ]}
                    textStyle={[
                      styles.inputText,
                      {
                        color: ThemeManager.colors.textColor,
                        fontSize: areaDimen(16),
                        lineHeight: heightDimen(26),
                        fontFamily: fonts.medium,
                      },
                    ]}
                    value={Pin}
                    onTextChange={text => {
                      if (Constants.NUMBER_ONLY_REGEX.test(text)) {
                        setPin(text);
                      }
                    }}
                  />
                </View>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  width: '90%',
                  marginTop: 30,
                  alignItems: 'center',
                }}>
                <CheckBox
                  checkBoxLeft={5}
                  checkboxstyle={{ width: 16, height: 16 }}
                  checkboxColor={ThemeManager.colors.viewBorderColor}
                  isStored={toggleCheckBox}
                  onHandleCheckBox={() => {
                    setToggleCheckBox(!toggleCheckBox);
                  }}
                />
                <View style={{ flexDirection: 'row', marginHorizontal: 20 }}>
                  <Text
                    style={{
                      fontFamily: fonts.regular,
                      fontSize: 15,
                      color: ThemeManager.colors.inActiveColor,
                    }}>
                    {'I agree to the '}
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      Linking.openURL(
                        'https://d18zkqei0yjvv8.cloudfront.net/T&C.pdf',
                      )
                    }
                    style={{}}>
                    <Text
                      style={{
                        color:ThemeManager.colors.textColor,
                        fontFamily: fonts.semibold,
                        fontSize: areaDimen(15),
                      }}>
                      {'Terms & Conditions '}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={{ flexDirection: 'row', width: '90%', marginTop: 10 }}>
                <CheckBox
                  checkBoxLeft={5}
                  checkboxstyle={{ width: 16, height: 16 }}
                  checkboxColor={ThemeManager.colors.viewBorderColor}
                  isStored={toggleCheckBoxtwo}
                  onHandleCheckBox={() => {
                    setToggleCheckBoxTwo(!toggleCheckBoxtwo);
                  }}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    marginHorizontal: 20,
                    flexWrap: 'wrap',
                  }}>
                  <Text
                    style={{
                      fontFamily: fonts.regular,
                      fontSize: 15,
                      color: ThemeManager.colors.inActiveColor,
                    }}>
                    I want to receive email and SMS communication from{' '}
                  </Text>
                  <TouchableOpacity
                    onPress={() => Linking.openURL('https://www.saitacard.io/')}>
                    <Text
                      style={{
                        fontFamily: fonts.semibold,
                        fontSize: areaDimen(15),
                        color: ThemeManager.colors.textColor
                      }}>
                      SaitaCard,{' '}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      Linking.openURL('https://www.saitamatoken.com/')
                    }>
                    <Text
                      style={{
                        fontFamily: fonts.semibold,
                        fontSize: areaDimen(15),
                        color: ThemeManager.colors.textColor
                      }}>
                      Saitama{' '}
                    </Text>
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontFamily: fonts.regular,
                      fontSize: 15,
                      color: ThemeManager.colors.inActiveColor,
                    }}>
                    and{' '}
                  </Text>
                  <TouchableOpacity
                    onPress={() => Linking.openURL('https://epay.me/')}>
                    <Text
                      style={{
                        fontFamily: fonts.semibold,
                        fontSize: areaDimen(15),
                        color: ThemeManager.colors.textColor
                      }}>
                      ePay.me
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

            </View>
          </KeyboardAwareScrollView>
        </ScrollView>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            marginBottom: heightDimen(60),
            paddingTop: heightDimen(10),
          }}>
          <BasicButton
            onPress={() => {
              onProceed();
            }}
            btnStyle={{
              width: '85%',
              marginVertical: 20,
              justifyContent: 'center',
              borderRadius: 100,
              marginBottom:heightDimen(40)
            }}
            customGradient={{
              borderRadius: 100,
              height: heightDimen(60),
              alignSelf: 'center',
            }}
            text={feePaid ? LanguageManager.apply : LanguageManager.applyfees}
            textStyle={{ fontSize: 16, fontFamily: fonts.semibold }}
          />
        </View>
        {/* *********************************************************** MODAL FOR Country dial ********************************************************************** */}

        <Modal
          animationType="slide"
          transparent={true}
          visible={countryListModal}
          onRequestClose={() => setCountryListModal(false)}>
          <SafeAreaView
            style={{ backgroundColor: ThemeManager.colors.bg, flex: 1 }}>
            <CountryCodes
              List={countryData}
              twoItems={true}
              hideCode={true}
              onPress={item => {
                // console.log(item);
                console.log(
                  'MM',
                  '????',
                  item,
                  item.dial_code.replace('+', ''),
                );
                // setCountryCode(item.dial_code);
                setcountry(item?.name);
                setCountryListModal(false);
              }}
              closeModal={() => setCountryListModal(false)}
            />
          </SafeAreaView>
        </Modal>

        {/* *********************************************************** MODAL FOR Country ********************************************************************** */}

        <Modal
          animationType="slide"
          transparent={true}
          visible={countryModal}
          onRequestClose={() => setCountryModal(false)}>
          <SafeAreaView
            style={{ backgroundColor: ThemeManager.colors.bg, flex: 1 }}>
            <CountryCodes
              List={countryData}
              twoItems={true}
              onPress={item => {
                console.log(
                  'MM',
                  '????',
                  item,
                  item.dial_code.replace('+', ''),
                );
                setCountryCode(item.dial_code);
                setCountryModal(false);
              }}
              closeModal={() => setCountryModal(false)}
            />
          </SafeAreaView>
        </Modal>

        {/* *********************************************************** MODAL FOR Apply ********************************************************************** */}
        <Modal
        animationType="slide"
        transparent={true}
        visible={applyModal}
        onRequestClose={() => setApplyModal(false)}>
        <Wrap style={{backgroundColor: ThemeManager.colors.backgroundColor}}>
          <View style={{height: windowHeight}}>
            <SimpleHeader
              back={false}
              backPressed={() => setApplyModal(false)}
            />
            <View
              style={{
                marginTop: 45,
                height: '50%',
                width: '90%',
                alignItems: 'center',
                alignSelf: 'center',
                justifyContent: 'center',
              }}>
              <ImageBackground
                resizeMode="contain"
                style={styles.imgcards}
                source={{uri: props?.route?.params?.selectedItem.card_image}}>
                <View
                  style={{
                    backgroundColor: 'rgba(57, 57, 57, 0.7)',
                    borderRadius: 17,
                    // height: '30%',
                    height:
                      props?.selectedItem?.card_type == 'physical'
                        ? '20%'
                        : '30%',
                    width: '50%',
                    justifyContent: 'center',
                    padding: 10,
                  }}>
                  <Text style={styles.txtone}>Application Fee:</Text>
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
                Thank you for applying for{'\n'}SaitaCard{' '}
                <Text
                  style={[
                    styles.txtWelcome,
                    {
                      color: ThemeManager.colors.textColor,
                      marginTop: 15,
                      textTransform: 'capitalize',
                    },
                  ]}>
                  {props?.route?.params?.selectedItem.name}
                </Text>
              </Text>
              <Text style={[styles.txtkyc]}>
                Now you need to complete your{'\n'}identification process (KYC)
                to start{'\n'}using SaitaCard
              </Text>
            </View>

            <View style={{alignItems: 'center', height: '30%'}}>
              <BasicButton
                onPress={() => {
                  checkPayment(false);
                }}
                btnStyle={styles.btnStyle}
                customGradient={styles.customGrad}
                text={'Start KYC Process'}
                textStyle={{fontSize: 16, fontFamily: fonts.medium}}
              />
            </View>
          </View>
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
              Singleton.getInstance().istxnModal = false;
              setisLoading(true);
              purChaseCard();
            }}
            onCancel={() => {
              setSwapModal(false);
              Singleton.getInstance().istxnModal = false;
            }}
          />
        )}

        <Modal
          animationType="slide"
          transparent={true}
          visible={paymentMethodModal}
          style={{ flex: 1 }}
          onRequestClose={() => {
            setPaymentMethodModal(false)
            goBack();
          }}>
          <Pressable
            style={{
              flex: 1,

              justifyContent: 'flex-end',
            }}
            onPress={() => {
              setPaymentMethodModal(false)
              goBack();
            }}>
            <View
              style={{
                flex: 1,
                backgroundColor: '#0E0E0E',
                opacity: 0.5,
                position: 'relative',
              }}></View>
            <View
              style={{
                width: '100%',
                backgroundColor: ThemeManager.colors.bg,
                borderTopStartRadius: areaDimen(20),
                borderTopEndRadius: areaDimen(20),
                opacity: 20,
                position: 'absolute',
                padding: areaDimen(22),
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  marginTop: heightDimen(14),
                }}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      marginRight: areaDimen(-24),
                      color: ThemeManager.colors.textColor,
                      fontFamily: fonts.semibold,
                      fontSize: areaDimen(18),
                    }}>
                    Choose Payment Option
                  </Text>
                </View>
                <FastImage
                  source={Images.modalCancel}
                  style={{ height: areaDimen(24), width: areaDimen(24) }}
                />
              </View>
              <TouchableOpacity
                style={{
                  height: heightDimen(66),
                  padding: areaDimen(22),
                  flexDirection: 'row',
                  backgroundColor: ThemeManager.colors.backgroundColor,
                  borderRadius: areaDimen(12),
                  marginTop: heightDimen(30),
                  alignItems: 'center',
                  borderColor: ThemeManager.colors.primary,
                  borderWidth: selectedMethod == 'wallet' ? 1 : 0,
                }}
                onPress={() => setSelectedMethod('wallet')}>
                <View
                  style={{
                    height: areaDimen(30),
                    width: areaDimen(30),
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: ThemeManager.colors.primary,
                    borderRadius: 100,
                  }}>
                  <FastImage
                    source={Images.cardPayWallet}
                    style={{ height: areaDimen(13), width: areaDimen(15) }}
                  />
                </View>
                <Text
                  style={{
                    marginLeft: widthDimen(16),
                    color: ThemeManager.colors.textColor,
                    fontFamily: fonts.semibold,
                    fontSize: areaDimen(14),
                  }}>
                  Pay using SaitaPro Wallet
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  height: heightDimen(66),
                  padding: areaDimen(22),
                  flexDirection: 'row',
                  backgroundColor: ThemeManager.colors.backgroundColor,
                  borderRadius: areaDimen(12),
                  marginTop: heightDimen(18),
                  alignItems: 'center',
                  borderColor: ThemeManager.colors.primary,
                  borderWidth: selectedMethod == 'ePay' ? 1 : 0,
                }}
                onPress={() => setSelectedMethod('ePay')}>
                <View
                  style={{
                    height: areaDimen(30),
                    width: areaDimen(30),
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: ThemeManager.colors.primary,
                    borderRadius: 100,
                  }}>
                  <FastImage
                    source={Images.cardPayGateWay}
                    style={{ height: areaDimen(13), width: areaDimen(15) }}
                  />
                </View>
                <Text
                  style={{
                    marginLeft: widthDimen(16),
                    color: ThemeManager.colors.textColor,
                    fontFamily: fonts.semibold,
                    fontSize: areaDimen(14),
                  }}>
                  Pay using e.PAY Payment Gateway
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  height: heightDimen(66),
                  padding: areaDimen(22),
                  flexDirection: 'row',
                  backgroundColor: ThemeManager.colors.backgroundColor,
                  borderRadius: areaDimen(12),
                  marginTop: heightDimen(18),
                  alignItems: 'center',
                  borderColor: ThemeManager.colors.primary,
                  borderWidth: selectedMethod == 'bPay' ? 1 : 0,
                }}
                onPress={() => setSelectedMethod('bPay')}>
                <View
                  style={{
                    height: areaDimen(30),
                    width: areaDimen(30),
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: ThemeManager.colors.primary,
                    borderRadius: 100,
                  }}>
                  <FastImage
                    source={Images.cardPayGateWay}
                    style={{ height: areaDimen(13), width: areaDimen(15) }}
                  />
                </View>
                <Text
                  style={{
                    marginLeft: widthDimen(16),
                    color: ThemeManager.colors.textColor,
                    fontFamily: fonts.semibold,
                    fontSize: areaDimen(14),
                  }}>
                  Pay using BINANCE PAY
                </Text>
              </TouchableOpacity>
              <BasicButton
                onPress={() => {
                  // setPaymentMethodModal(false);
                  onPressPay();
                }}
                customGradient={{
                  borderRadius: 100,
                  marginTop: heightDimen(38),
                  marginBottom:heightDimen(40)
                }}
                text={'Continue'}
                textStyle={{ fontSize: 16, fontFamily: Fonts.medium }}
              />
            </View>
          </Pressable>
          {isLoading && <Loader />}
        </Modal>
      </Wrap>
      {isLoading && <Loader />}
    </>
  );
};

export default SaitaCardApplyForm;
