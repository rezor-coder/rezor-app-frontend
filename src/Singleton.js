import { Alert } from 'react-native';
import * as Constants from './Constant';
const CryptoJS = require('crypto-js');
import { createAlchemyWeb3 } from '@alch/alchemy-web3';
import AsyncStorage from '@react-native-community/async-storage';
import Common from '@ethereumjs/common';
const bitcoin = require('bitcoinjs-lib');
import {
  addTrailingZeros,
  bigNumberSafeMath,
  exponentialToDecimalWithoutComma,
  validateMnemonics,
} from './utils';
import Web3 from 'web3';
import { FeeMarketEIP1559Transaction } from '@ethereumjs/tx';
import idaAbi from './Utils/idaAbi.json';
import approveAbi from './Utils/multiSenderAllowanceAbi.json';
import multiSendTokenabi from './Utils/multiSendTokenabi.json';
import multiSendTokenMaticAbi from './Utils/multiSendTokenMaticAbi.json';
import { BigNumber } from 'bignumber.js';
import { loadWalletFromPrivateKey } from './wallet';
import EncryptedStorage from 'react-native-encrypted-storage';
import Address from '@bitsler/tron-address';
import TronWeb from 'tronweb';

import { NativeModules } from 'react-native';

const { CreateWallet } = NativeModules;

const bitcore = require('bitcore-lib');
const BIP84 = require('bip84');
import { utils, Wallet } from 'ethers';
// https://rinkeby.infura.io/v3/ef700abe941041fe8556c43d40f131ab https://ropsten.infura.io/v3/805096ce0ba141b797b939635f778424
const web3 = new Web3(
  Constants.network == 'testnet'
    ? Constants.testnetEth
    : Constants.mainnetInfuraLink,
);
const web3BscUrl =
  Constants.network == 'testnet'
    ? 'https://data-seed-prebsc-1-s1.binance.org:8545/'
    : Constants.mainnetInfuraLinkBNB;

export const multiSenderContractAddress =
  Constants.network == 'testnet'
    ? '0x34fd17651CC48C7e3A0C31E5ea3152de075C4529'
    : '0xFf3de9977a7240a697758f539DFf7C466d8C7D36';
export const multiSenderBnbContractAddress =
  Constants.network == 'testnet'
    ? '0xc685Ba450353C89F70E55c237923651e42B0fd14'
    : '0x090D5A53779c5C929E990716785De55E4BFaA519';
export const MultiSenderMaticContractAddress =
  '0x16Bbd8e28FDbE9153234bCC87a5b0750fDBea598';
export const multiSenderSTCContractAddress = '0x41BD4dD1Ec4bdd5A205078A5abbD939EE65bbb5e';
export const multiSenderSTCERC20ContractAddress = '0xe6907a6FA8D543EDA16C5A0b410Bd09F7E521166';
const web3BNB = new Web3(
  web3BscUrl,
);


const testnetUrlEth =
  Constants.network == 'testnet'
    ? Constants.testnetEth
    : // ? 'https://eth-goerli.g.alchemy.com/v2/CeBAVqM26_O3EE-R3sDD-Edf5q0kD5UH'
    Constants.mainnetInfuraLink;
export const erc20MultiSenderContractAddress =
  Constants.network == 'testnet'
    ? '0x65a864EcCFd4D67a43A00A3DE5585849eCE98Fc8'
    : '0x81f50b01D65A795B0d3a3369956d77878C7ea771';
export const bep20MultiSenderContractAddress =
  Constants.network == 'testnet'
    ? '0x99698296D9F4EDe0c145BA516ed84D8EdbAF59cF'
    : '0x1E52D06DAE8b565E07670F3f5E7e5f034E7dA1dd';
export const matic20MultiSenderContractAddress =
  '0xf89509B04E9b9DA8B2F29731a0F6D21327DDa570';

const HttpProvider = TronWeb.providers.HttpProvider;

const fullNode =
  Constants.network == 'testnet'
    ? new HttpProvider('https://api.nileex.io/')
    : new HttpProvider('https://api.trongrid.io/');
const solidityNode =
  Constants.network == 'testnet'
    ? new HttpProvider('https://api.nileex.io/')
    : new HttpProvider('https://api.trongrid.io/');
const eventServer =
  Constants.network == 'testnet'
    ? new HttpProvider('https://api.nileex.io/')
    : new HttpProvider('https://api.trongrid.io/');

//main
import SmartCardAbi from '../ABI/SmartCardAbi.json';
import { IS_PRODUCTION, UPDATE_BALANCE } from './Endpoints';
import NodeRSA from 'node-rsa';
import { validateMnemonic } from 'bip39';
import { APIClient } from './Api';
// test
//import SmartCardAbi from '../ABI/SmartCardAbitest.json';
//
let routerAddressCards =
  Constants.network == 'testnet'
    ? '0xBd5EB4F64C5c9D87e1a33B08AD3FFf8D821da48E'
    : '0xCF385f63Da33227294c9f59d5B6853a321f75145';
// '0x12f939E4FB9d9ccd955a1793A39D87672649706f'; // upto 3 cards ( old production)

export default class Singleton {
  access_token = '';
  access_token_cards = '';
  defaultEthAddress = '';
  defaultBnbAddress = '';
  defaultBtcAddress = '';
  defaultStcAddress = '';
  defaultTrxAddress = '';
  static walletConnectObj = {};
  defaultMaticAddress = '';
  currentCard = 'black';
  CurrencySymbol = '$';
  CurrencySelected = 'USD';
  isLogin = '';
  isOtpModal = false;
  istxnModal = false;
  device_token = '';
  dynamicColor = '';
  statusChange = null;
  slipageTolerance = '1';
  slipageTimeout = '10';
  walletConnectRef = null;
  visible = false;
  approveRequest = false;
  showDisconnect = false;
  privateKey = null;
  isCamera = false
  bnbLink = 'https://bsc-dataseed1.binance.org:443';
  ethLink = 'https://mainnet.infura.io/v3/2436cc78200f432aa2d847a7ba486391';
  maticLink = 'https://polygon-mumbai.infura.io/v3/4458cf4d1689497b9a38b1d6bbf05e78';
  stcLink = 'https://rpc-nodes.saitascan.io';
  stcExplorerLink = 'https://saitascan.io/tx/';
  data = [
    {
      coin_family: 1,
      coin_name: 'Ethereum',
      coin_symbol: 'eth',
      coin_image:
        'https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880',
      is_token: 0,
      token_address: null,
      decimals: 1000000000000000000,
    },

    {
      coin_family: 6,
      coin_name: 'Binance',
      coin_symbol: 'bnb',
      coin_image:
        'https://assets-cdn.trustwallet.com/blockchains/smartchain/info/logo.png',
      is_token: 0,
      token_address: null,
      decimals: 1000000000000000000,
    },
    {
      coin_family: 11,
      coin_name: 'Polygon',
      coin_symbol: 'matic',
      coin_image:
        'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png',
      is_token: 0,
      token_address: null,
      decimals: 1000000000000000000,
    },
    {
      coin_family: 2,
      coin_name: 'Bitcoin',
      coin_symbol: 'btc',
      coin_image:
        'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579',
      is_token: 0,
      token_address: null,
      decimals: 100000000,
    },
    {
      coin_family: 3,
      coin_name: 'Tron',
      coin_symbol: 'trx',
      coin_image:
        'https://s2.coinmarketcap.com/static/img/coins/64x64/1958.png',
      is_token: 0,
      token_address: null,
      decimals: 1000000,
    },
    {
      coin_family: 4,
      coin_name: 'SaitaChain',
      coin_symbol: 'stc',
      coin_image:
        'https://s2.coinmarketcap.com/static/img/coins/64x64/20513.png',
      is_token: 0,
      token_address: null,
      decimals: 1000000000000000000,
    },
  ];
  SwapRouterAddress = '';
  SwapFactoryAddress = '';
  SwapWethAddress = '';
  SwapRouterBNBAddress = '';
  SwapFactoryAddressBNB = '';
  SwapWBNBAddress = '';
  SwapRouterStcAddress = '';
  SwapFactoryAddressSTC = '';
  SwapWethAddressSTC = '';
  StakeSaitamaAddress = '';
  StakingContractAddress = '';
  static bottomBar = null;

  // this is used for swap caching : M
  static coinListCaching = {
    eth: [],
    bnb: [],
    all: [],
    stc: []
  };

  static getInstance() {
    if (Singleton.myInstance == null) {
      Singleton.myInstance = new Singleton();
    }
    return this.myInstance;
  }

  static showAlert(msgs) {
    let msg = msgs
    console.log('==>', msg, global.is_alert);
    if (global.is_alert) {
      return;
    }
    if (msg?.toLowerCase()?.includes(Singleton.getInstance().bnbLink?.toLowerCase())) {
      msg = Constants.SOMETHING_WRONG
    } else if (msg?.toLowerCase()?.includes(Singleton.getInstance().ethLink?.toLowerCase())) {
      msg = Constants.SOMETHING_WRONG
    } else if (msg?.toLowerCase()?.includes(Singleton.getInstance().maticLink?.toLowerCase())) {
      msg = Constants.SOMETHING_WRONG
    } else if (msg?.toLowerCase()?.includes("CONNECTION ERROR: Couldn't connect"?.toLowerCase())) {
      msg = Constants.SOMETHING_WRONG;
    } else if (msg?.toLowerCase()?.includes('invalid json rpc response')) {
      msg = Constants.SOMETHING_WRONG;
    } else if (msg?.toLowerCase()?.includes('undefined')) {
      msg = Constants.SOMETHING_WRONG;
    } else if (msg?.toLowerCase()?.includes('transaction has been reverted by the evm')) {
      msg = Constants.SOMETHING_WRONG;
    }
    global.is_alert = true;
    Alert.alert(
      Constants.APP_NAME,

      global.disconnected ? Constants.NO_NETWORK : msg?.toString(),
      [
        {
          text: 'OK',
          onPress: () => {
            global.is_alert = false;
          },
        },
      ],
      {
        cancelable: false,
        onDismiss: () => {
          global.is_alert = false;
        },
      },
    );
  }

  saveWalletList() {
    this.newSaveData(Constants.withoutTokenList, JSON.stringify(this.data));
  }

  // getData(key) {
  //   return new Promise((resolve, reject) => {
  //     AsyncStorage.getItem(key).then(response => {
  //       //console.warn('MM','response::', response);
  //       if (response != null) {
  //         var ciphertext = CryptoJS.AES.decrypt(response, Constants.SECRET_KEY);
  //         var decryptedData = JSON.parse(ciphertext.toString(CryptoJS.enc.Utf8));
  //         //console.warn('MM',ciphertext);
  //         //console.warn('MM','get response $$$$$', decryptedData);
  //         resolve(decryptedData);
  //       }
  //       else {
  //         //console.warn('MM','get response else$$$$$', response);
  //         resolve(response);
  //       }
  //     })
  //       .catch(error => {
  //         reject(error);
  //       });
  //   });
  // }
  //************************************** validate ETH Address ************************************/
  validateEthAddress = text => {
    let reg = /^0x[a-fA-F0-9]{40}$/;
    if (reg.test(text) === false) {
      console.warn('MM', 'Eth Address is Not Correct');
      return false;
    } else {
      console.warn('MM', 'Eth Address is Correct');
      return true;
    }
  };

  toFixed(num, fixed) {
    if (num) {
      num = num.toString(); //If it's not already a String

      if (num.includes('.')) {
        num = num.slice(0, num.indexOf('.') + (fixed + 1));
      }
      // alert( Number(num))
      //  //console.warn('MM','>>>>>', Number(num));
      return Number(num);
    } else {
      return num;
    }
  }
  toFixednew(num, fixed) {
    console.log("num", num, "fixed", fixed);
    if (num == undefined) {
      return (num = ' 0.00');
    } else if (num) {
      num = num.toString(); //If it's not already a String
      if (num) {
        num = num.toString(); //If it's not already a String
        if (num.includes('.')) {
          num = num.slice(0, num.indexOf('.') + (fixed + 1));
          let lengthv = num.split('.');

          if (lengthv[1].length == 1) {
            num = num + '0';
          }
        }
      }
      // //console.warn('MM','>>>>>33', Number(num) ," ",fixed,num);
      return addTrailingZeros(num, fixed);
    } else {
      return addTrailingZeros(num, fixed);
    }
  }
  /************************************************** toFixedExp **************************************************************/
  toFixedExp(num, fixed) {
    if (num) {
      num = this.exponentialToDecimalNew(num);
      let re = new RegExp('^-?\\d+(?:.\\d{0,' + (fixed || -1) + '})?');
      return num.toString().match(re)[0];
    }
    else return '0.00';
  }
  /************************************************** exponentialToDecimal ***************************************************/
  exponentialToDecimalNew = (exponential) => {
    let decimal = exponential.toString().toLowerCase();
    if (decimal.includes('e+')) {
      const exponentialSplitted = decimal.split('e+');
      let postfix = '';
      for (let i = 0; i < +exponentialSplitted[1] - (exponentialSplitted[0].includes('.') ? exponentialSplitted[0].split('.')[1].length : 0); i++) {
        postfix += '0';
      }
      const addCommas = text => {
        let j = 3;
        let textLength = text.length;
        while (j < textLength) {
          text = `${text.slice(0, textLength - j)}${text.slice(textLength - j, textLength,)}`;
          textLength++;
          j += 3 + 1;
        }
        return text;
      };
      decimal = addCommas(exponentialSplitted[0].replace('.', '') + postfix);
    }
    if (decimal.toLowerCase().includes('e-')) {
      const exponentialSplitted = decimal.split('e-');
      let prefix = '0.';
      for (let i = 0; i < +exponentialSplitted[1] - 1; i++) {
        prefix += '0';
      }
      decimal = prefix + exponentialSplitted[0].replace('.', '');
    }
    return decimal;
  }

  // ********************************  GENEARATE ETH ADDRESS FROM PVT KEY  ************************************
  getEthAddressFromPrivateKey(pvtKey) {
    try {
      let wall = loadWalletFromPrivateKey(pvtKey.replace(' ', ''));
      this.newSaveData(wall.address.toString() + '_pk', wall.privateKey);
      return { address: wall.address, error: '' };
    } catch (error) {
      return { address: '', error: 'Invalid Private Key' };
    }
  }
  clearStorage() {
    return new Promise((resolve, reject) => {
      AsyncStorage.clear()
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  clearStorageNew() {
    return new Promise((resolve, reject) => {
      EncryptedStorage.clear()
        .then(response => {
          //  console.warn('MM','clearStorage response $$$$$', response);
          resolve(response);
        })
        .catch(error => {
          //  console.warn('MM','clearStorage error $$$$$', error);
          reject(error);
        });
    });
  }
  removeItemNew(key) {
    return new Promise((resolve, reject) => {
      EncryptedStorage.removeItem(key)
        .then(response => {
          //  console.warn('MM','removeItem response $$$$$', key);
          resolve(response);
        })
        .catch(error => {
          //  console.warn('MM','removeItem error $$$$$', error);
          reject(error);
        });
    });
  }

  bigNumberSafeMath = (c, operation, d, precision) => {
    BigNumber.config({ DECIMAL_PLACES: 18 });
    var a = new BigNumber(c);
    var b = new BigNumber(d);
    var rtn;
    switch (operation.toLowerCase()) {
      case '-':
        rtn = a.minus(b);
        break;
      case '+':
        rtn = a.plus(b);
        break;
      case '*':
      case 'x':
        rtn = a.multipliedBy(b);
        break;
      case '÷':
      case '/':
        rtn = a.dividedBy(b);
        break;
      default:
        break;
    }
    return rtn.toString();
  };

  exponentialToDecimal(exponential) {
    if (exponential) {
      // //console.warn('MM','expo chk:::::', exponential);
      let decimal = exponential.toString().toLowerCase();
      if (decimal.includes('e+')) {
        const exponentialSplitted = decimal.split('e+');
        let postfix = '';
        for (
          let i = 0;
          i <
          +exponentialSplitted[1] -
          (exponentialSplitted[0].includes('.')
            ? exponentialSplitted[0].split('.')[1].length
            : 0);
          i++
        ) {
          postfix += '0';
        }
        const addCommas = text => {
          let j = 3;
          let textLength = text.length;
          while (j < textLength) {
            text = `${text.slice(0, textLength - j)}${text.slice(
              textLength - j,
              textLength,
            )}`;
            textLength++;
            j += 3 + 1;
          }
          return text;
        };
        decimal = addCommas(exponentialSplitted[0].replace('.', '') + postfix);
      }
      if (decimal.toLowerCase().includes('e-')) {
        const exponentialSplitted = decimal.split('e-');
        let prefix = '0.';
        for (let i = 0; i < +exponentialSplitted[1] - 1; i++) {
          prefix += '0';
        }
        decimal = prefix + exponentialSplitted[0].replace('.', '');
      }
      return decimal;
    }
  }
  saveData(key, value) {
    // console.warn('MM','key#####' + key + 'value #### ' + value);
    return new Promise((resolve, reject) => {
      AsyncStorage.setItem(key, value)
        .then(response => {
          resolve(value);
        })
        .catch(error => {
          //  console.warn('MM','error #### ' + error);
          reject(error);
        });
    });
  }
  getData(key) {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(key)
        .then(response => {
          //  console.warn('MM','######### GET #########' , key , response );
          resolve(response);
          // if (response != null) {
          //           var ciphertext = CryptoJS.AES.decrypt(response, Constants.SECRET_KEY);
          //           var decryptedData = JSON.parse(ciphertext.toString(CryptoJS.enc.Utf8));
          //           resolve(decryptedData);
          // } else { resolve(response); }
        })
        .catch(error => {
          reject(error);
          //  console.warn('MM','error #### getData' + error);
        });
    });
  }
  /************************************************** saveData **************************************************************/
  newSaveData = (key, value) => {
    return new Promise((resolve, reject) => {
      if (value) {
        EncryptedStorage.setItem(key, value.toString())
          .then(res => {
            //       if(key != 'hotList' && key != 'WALLET_LIST'){
            //  //  console.warn('MM','##### SAVE NEW ####' , key , res);
            //       }else{

            //  //  console.warn('MM','##### SAVE NEW ####' , key );
            //       }
            if (key == 'multi_wallet_array') {
              console.log(key, value);
            }
            // console.warn('MM','newSaveData res::::', res);
            return resolve(res);
          })
          .catch(err => {
            console.warn('MM', 'newSaveData err::::', key, err);
            return reject(err);
          });
      }
    });
    // RNSecureKeyStore.set(key, value, { accessible: ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY }).then((res) => {
    // }, (err) => {
    ////  console.warn('MM',err);
    // });
  };
  /************************************************** getData **************************************************************/
  newGetData = key => {
    return new Promise(async (resolve, reject) => {
      EncryptedStorage.getItem(key)
        .then(res => {
          // console.warn('MM','newGetData res::::key', key, '\nres::::::', res);
          //  console.warn('MM','######## GET NEW ########' , key  );
          return resolve(res);
        })
        .catch(err => {
          //  console.warn('MM','newGetData err::::', err);
          return reject(err);
        });

      // RNSecureKeyStore.get(key).then((res) => {
      //   resolve(res);
      // }).catch(err => {
      //   reject(err);
      ////  console.warn('MM','newGetData err::::', err);
      // })
    });
  };
  generateTronAddress = mnemonic => {
    // console.log('generateTronAddress==', mnemonic);
    try {
      const addressobj = new Address(mnemonic, 0);
      const address = addressobj.getAddressInfo(0).address;
      const privateKey = addressobj.getAddressInfo(0).privateKey;
      // console.log('tron address created', address, 'and private key ...');
      return { address, privateKey };
    } catch (error) {
      console.log('createTronAddress error==', error);
    }
  };

  getTronAddressFromPvtKey(privateKey) {
    try {
      const address = TronWeb.address.fromPrivateKey(privateKey);
      // console.log('tron address', address);
      this.newSaveData(`${address}_pk`, privateKey);
      return { address: address, privateKey: privateKey, error: '' };
    } catch (error) {
      return {
        address: '',
        error: 'Please check the private key',
      };
    }
  }
  // prod
  async createWallet() {
    //console.warn('MM','enter create wallet---->>>');
    return new Promise((resolve, reject) => {
      try {
        CreateWallet.generateMnemonics(async obj => {
          console.log('---------Obj', JSON.parse(obj));
          let data = JSON.parse(obj);

          let mnemonics = data?.mnemonics;
          let ethWallet = data?.eth;
          let BTC_obj = data?.btc;

          console.log('---------ethWallet', data?.eth);

          console.log('---------BTC_obj', data?.btc);

          if (ethWallet.pvtKey?.length < 66) {
            let suffix = '0x' + '0'.repeat(66 - ethWallet.pvtKey?.length);
            ethWallet.pvtKey = suffix + ethWallet.pvtKey.substring(2);
          }

          let tronObj = await this.generateTronAddress(mnemonics);
          console.log('---------tronObj', tronObj);

          // const mnemonics = await generateMnemonics();
          // ********************************  FOR ETH  ************************************
          // const ethWallet = await generateEthWallet(mnemonics);
          //console.warn('MM','ethWallet===========', ethWallet, mnemonics);
          await this.newSaveData(ethWallet.address + '_pk', ethWallet.pvtKey);
          await this.newSaveData(ethWallet.address, mnemonics);

          // let BTC_obj = await this.getBTCAddress(mnemonics, 0);
          if (Constants.network == 'testnet') {
            BTC_obj = await this.getBTCAddress(mnemonics, 0);
          }
          await this.newSaveData(BTC_obj.address + '_pk', BTC_obj.pvtKey);
          await this.newSaveData(BTC_obj.address, mnemonics);

          await this.newSaveData(tronObj.address + '_pk', tronObj.privateKey);
          await this.newSaveData(tronObj.address, mnemonics);

          return resolve({
            mnemonics,
            ethAddress: ethWallet.address,
            btcAddress: BTC_obj.address,
            trxAddress: tronObj.address,
          });
        });
      } catch (e) {
        console.warn('MM', 'create wallet error ', e);
        return reject(e);
      }
    });
  }

  // stage
  // async createWallet() {
  //   //console.warn('MM','enter create wallet---->>>');
  //   return new Promise((resolve , reject)=>{
  //     try {

  //       CreateWallet.generateMnemonics(async obj=> {
  //         // console.log('---------Obj', JSON.parse(obj));
  //         let data = JSON.parse(obj)

  //         let mnemonics = data?.mnemonics
  //         let ethWallet = data?.eth
  //         // let BTC_obj = data?.btc

  //         let tronObj = await this.generateTronAddress(mnemonics)

  //         // const mnemonics = await generateMnemonics();
  //         // ********************************  FOR ETH  ************************************
  //         // const ethWallet = await generateEthWallet(mnemonics);
  //         //console.warn('MM','ethWallet===========', ethWallet, mnemonics);
  //         await this.newSaveData(ethWallet.address + '_pk', ethWallet.pvtKey);
  //         await this.newSaveData(ethWallet.address, mnemonics);
  //         // main btc
  //         // let BTC_obj = await this.getBTCAddress(mnemonics, 0);
  //         // await this.newSaveData(BTC_obj.address + '_pk', BTC_obj.pvtKey);
  //         // await this.newSaveData(BTC_obj.address, mnemonics);

  //         // btc test
  //         let BTC_obj = await this.getBTCAddress(mnemonics, 0);
  //         await this.newSaveData(BTC_obj.address + '_pk', BTC_obj.pvtkey);
  //         await this.newSaveData(BTC_obj.address, mnemonics);

  //         await this.newSaveData(tronObj.address + '_pk', tronObj.privateKey);
  //         await this.newSaveData(tronObj.address, mnemonics);

  //         return resolve({
  //           mnemonics,
  //           ethAddress: ethWallet.address,
  //           btcAddress: BTC_obj.address,
  //           trxAddress:tronObj.address
  //         });
  //       })
  //     } catch (e) {
  //       console.warn('MM','create wallet error ', e);
  //       return reject(e);
  //     }
  //   })
  // }

  validateTronAddress = text => {
    let isTrxAddress = TronWeb.isAddress(text);
    if (isTrxAddress) {
      return true;
    } else {
      return false;
    }
  };

  tronWebObject = privateKey => {
    return new TronWeb(fullNode, solidityNode, eventServer, privateKey);
  };

  tronwebSendTRX = async (fromAddress, toAddress, amount, pvtkey) => {
    console.log('tronwebSendTRX ==fromAddress=====', fromAddress);
    console.log('tronwebSendTRX ====toAddress===', toAddress);
    console.log('tronwebSendTRX ====pvtkey===', pvtkey);
    console.log('tronwebSendTRX =====amount==', amount);

    const privateKey = pvtkey;
    const tronWeb = new TronWeb(
      fullNode,
      solidityNode,
      eventServer,
      privateKey,
    );
    console.log('tronwebSendTRX inside function');
    const tradeobj = await tronWeb.transactionBuilder.sendTrx(
      toAddress,
      tronWeb.toSun(amount),
      fromAddress,
    );
    const signedtxn = await tronWeb.trx.sign(tradeobj, privateKey);
    console.log('signed transacton is :', signedtxn.raw_data_hex);
    console.log(`signed transacton is : ${JSON.stringify(signedtxn)}`);
    return signedtxn;
  };

  tronwebSendTRX20 = async (
    fromAddress,
    toAddress,
    amount,
    token_address,
    pvtkey,
    feeLimit,
  ) => {
    console.log(fromAddress, toAddress, amount, token_address, pvtkey, feeLimit);
    try {
      const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, pvtkey);
      let parameter = [
        { type: 'address', value: toAddress },
        { type: 'uint256', value: amount },
      ];
      let options = { feeLimit: feeLimit, callValue: 0 };
      const transaction = await tronWeb.transactionBuilder.triggerSmartContract(
        token_address,
        'transfer(address,uint256)',
        options,
        parameter,
        fromAddress,
      );
      console.log(`The transaction is : ${JSON.stringify(transaction)}`);
      let transactionObject = transaction;
      if (!transactionObject.result || !transactionObject.result.result) {
        console.error('Unknown error: ' + txJson, null, 2);
        return Promise.reject('Unknown error: ' + txJson);
      }
      const signedTransaction = await tronWeb.trx.sign(
        transactionObject.transaction,
      );
      if (!signedTransaction.signature) {
        console.error('Transaction was not signed properly');
        return Promise.reject('Transaction was not signed properly');
      }
      console.log('signed transaction44444  ', JSON.stringify(signedTransaction));
      console.log(
        'signed transaction44444signedTransaction  ',
        signedTransaction,
      );
      return Promise.resolve(signedTransaction);
    } catch (error) {
      console.log(error);
      // return new Error(error);
      return Promise.reject(error);
    }
  };

  getBTCAddress = async (mnemonics, addressIndex) => {
    var root = new BIP84.fromSeed(
      mnemonics,
      '',
      // false,
      Constants.network == 'testnet' ? true : false,
    ); //pass true for testnet and false for mainnet
    // var root = new BIP84.fromSeed(mnemonics, '', true); //pass true for testnet and false for mainnet

    var child0 = root.deriveAccount(0);

    //console.warn('MM','mnemonic:', mnemonics);
    //console.warn('MM','rootpriv:', root.getRootPrivateKey());
    //console.warn('MM','rootpub:', root.getRootPublicKey());
    //console.warn('MM','\n');

    var account0 = new BIP84.fromZPrv(child0);

    //console.warn('MM',"Account 0, first receiving address = m/84'/0'/0'/0/0");
    //console.warn('MM','Prvkey is:', account0.getPrivateKey(0));
    //console.warn('MM','Pubkey:', account0.getPublicKey(0));
    //console.warn('MM','Address is :', account0.getAddress(0));
    //console.warn('MM','\n');
    const obj = {
      address: account0.getAddress(0),
      pvtKey: account0.getPrivateKey(0),
      mnemonics: mnemonics,
      index: addressIndex,
    };
    //console.warn('MM','\n obj: ', obj);
    //console.warn('MM','\n obj.address: ', obj.address);

    return obj;
  };
  validateBTCAddress = text => {
    ////console.log(
    // 'address to validate - ',
    //   text,
    //   ' = ',
    //   bitcore.Address.isValid(
    //     text,
    //     Constants.network == 'testnet'
    //       ? bitcore.Networks.testnet
    //       : bitcore.Networks.mainnet,
    //   ),
    // );
    return bitcore.Address.isValid(
      text,
      Constants.network == 'testnet'
        ? bitcore.Networks.testnet
        : bitcore.Networks.mainnet,
    );
  };

  getBtcAddressFromPrivateKey(key) {
    try {
      // Replace `privateKeyWIF` with your actual private key in WIF format
      const accountPrivateKey = key;
      const privateKey = accountPrivateKey;
      const network = bitcoin.networks.mainnet;
      const keyPair = bitcoin.ECPair.fromWIF(privateKey, network);
      const { address } = bitcoin.payments.p2wpkh({
        pubkey: keyPair.publicKey,
        network,
      });
      this.newSaveData(address.toString() + '_pk', key);
      // console.warn('MM','Address:', address);
      return {
        address: address,
        pvtkey: key,
        error: '',
      };
    } catch (error) {
      //  console.warn('MM','error SegWit address:', error);
      return {
        address: '',
        error: 'Invalid Private Key',
      };
    }
  }
  // exponentialToDecimal(exponential) {
  //   let decimal = exponential.toString().toLowerCase();
  //   if (decimal.includes('e+')) {
  //     const exponentialSplitted = decimal.split('e+');
  //     let postfix = '';
  //     for (
  //       let i = 0;
  //       i <
  //       +exponentialSplitted[1] -
  //         (exponentialSplitted[0].includes('.')
  //           ? exponentialSplitted[0].split('.')[1].length
  //           : 0);
  //       i++
  //     ) {
  //       postfix += '0';
  //     }
  //     const addCommas = text => {
  //       let j = 3;
  //       let textLength = text.length;
  //       while (j < textLength) {
  //         text = `${text.slice(0, textLength - j)}${text.slice(
  //           textLength - j,
  //           textLength,
  //         )}`;
  //         textLength++;
  //         j += 3 + 1;
  //       }
  //       return text;
  //     };
  //     decimal = addCommas(exponentialSplitted[0].replace('.', '') + postfix);
  //   }
  //   if (decimal.toLowerCase().includes('e-')) {
  //     const exponentialSplitted = decimal.split('e-');
  //     let prefix = '0.';
  //     for (let i = 0; i < +exponentialSplitted[1] - 1; i++) {
  //       prefix += '0';
  //     }
  //     decimal = prefix + exponentialSplitted[0].replace('.', '');
  //   }
  //   return decimal;
  // }

  async updateBalance(coin_id, wallet_address) {
    try {
      // console.log('updateBalance' , coin_id , wallet_address);
      let token = await Singleton.getInstance().newGetData(
        Constants.access_token,
      );
      let res = await APIClient.getInstance().post(
        UPDATE_BALANCE,
        { coin_id, wallet_address },
        token,
      );
      console.log('res updateBalance', res);
    } catch (error) {
      console.log('error updateBalance', error);
    }
  }
  // ********************************  CHECK FACTORY FOR PAIR  ************************************
  checkFactoryForPair = (coin_family, tokenContractAddress,isDummy) => {
    return new Promise(async (resolve, reject) => {
      let factoryAddress, rpcUrl, wrappedCoin;
      if (coin_family == 1) {
        factoryAddress = this.SwapFactoryAddress;
        wrappedCoin = this.SwapWethAddress;
        rpcUrl = testnetUrlEth;
      } else if (coin_family == 4) {
        factoryAddress = this.SwapFactoryAddressSTC;
        wrappedCoin = this.SwapWethAddressSTC;
        rpcUrl = this.stcLink;
      } else if (coin_family == 6) {
        factoryAddress = this.SwapFactoryAddressBNB;
        wrappedCoin = this.SwapWBNBAddress;
        rpcUrl = web3BscUrl;
      }
      const liqABI = [{ "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "token0", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "factory", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "address", "name": "", "type": "address" }, { "internalType": "address", "name": "", "type": "address" }], "name": "getPair", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getReserves", "outputs": [{ "internalType": "uint112", "name": "_reserve0", "type": "uint112" }, { "internalType": "uint112", "name": "_reserve1", "type": "uint112" }, { "internalType": "uint32", "name": "_blockTimestampLast", "type": "uint32" }], "payable": false, "stateMutability": "view", "type": "function" }];
      const web3 = new Web3(rpcUrl);
      const web3Factory = new web3.eth.Contract(liqABI, factoryAddress);
      try {
        web3Factory.methods.getPair(wrappedCoin, tokenContractAddress).call(function (err, pairAddress) {
          console.log("Pair Address: ", pairAddress);
          if (pairAddress == '0x0000000000000000000000000000000000000000') {
            resolve(false)
          } else {
            if(isDummy){
              resolve(pairAddress)
            }else{
              resolve(true)
            }

          }
        })
      } catch (err) {
        reject(false)
      }
    })
  }
  // ********************************  GET COMMISSION FOR COINS  ************************************
  async getDataForMultiEth(
    addressArr,
    amount,
    coin_family,
    totalAmount,
    myAddress,
    referalAddress,
  ) {
    return new Promise(async (resolve, reject) => {
      const emptyAddress = /^0x0+$/.test(referalAddress);
      //console.warn('MM','addis_valid', emptyAddress);
      try {
        let minAbi = [
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: 'address',
                name: 'previousOwner',
                type: 'address',
              },
              {
                indexed: true,
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
              },
            ],
            name: 'OwnershipTransferred',
            type: 'event',
          },
          {
            inputs: [],
            name: 'getCommisionAddress',
            outputs: [{ internalType: 'address', name: '', type: 'address' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'getCommissionPercentage',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'getRefferalCommissionPercentage',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [
              { internalType: 'address[]', name: 'addresses', type: 'address[]' },
              { internalType: 'uint256[]', name: 'amt', type: 'uint256[]' },
              {
                internalType: 'address',
                name: '_referralAddress',
                type: 'address',
              },
            ],
            name: 'multipleOutputs',
            outputs: [],
            stateMutability: 'payable',
            type: 'function',
          },
          {
            inputs: [],
            name: 'owner',
            outputs: [{ internalType: 'address', name: '', type: 'address' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [
              { internalType: 'address', name: 'newOwner', type: 'address' },
            ],
            name: 'transferOwnership',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [
              {
                internalType: 'address',
                name: '_commissionAddress',
                type: 'address',
              },
            ],
            name: 'updateCommissionAddress',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [
              {
                internalType: 'uint256',
                name: '_commissionPercentage',
                type: 'uint256',
              },
            ],
            name: 'updateComssionPercentage',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [
              {
                internalType: 'uint256',
                name: '_refferalCommissionPercentage',
                type: 'uint256',
              },
            ],
            name: 'updateRefferalComssionPercentage',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
        ];
        let contract;
        const web3Dapp = new Web3(web3BscUrl);
        if (coin_family == 1) {
          contract = await new web3.eth.Contract(
            minAbi,
            coin_family == 1
              ? multiSenderContractAddress
              : multiSenderBnbContractAddress,
          );
        } else if (coin_family == 6) {
          contract = await new web3Dapp.eth.Contract(
            minAbi,
            coin_family == 1
              ? multiSenderContractAddress
              : multiSenderBnbContractAddress,
          );
        }
        let amountArray = amount.map(item => {
          return web3.utils.toWei(`${this.toFixednew(item, 8)}`, 'ether');
          // return web3.utils.toWei("0.00001", "ether")
        });
        console.warn('MM', amountArray);

        let data = contract.methods
          .multipleOutputs(addressArr, amountArray, referalAddress)
          .encodeABI();

        console.warn('MM', 'data----------------', data);
        const commissionPercentage = await contract.methods
          .getCommissionPercentage()
          .call();
        console.warn('MM', 'commissionPercentage----------------', commissionPercentage);

        const RefcommissionPercentage = await contract.methods
          .getRefferalCommissionPercentage()
          .call();
        console.warn('MM', 'RefcommissionPercentage----------------', RefcommissionPercentage);
        console.log(
          'total value in gwei RefcommissionPercentage',
          RefcommissionPercentage,
        );

        const commission = commissionPercentage / 100;
        const RefCommission =
          emptyAddress == true ? 0 : RefcommissionPercentage / 100;
        const amountAfterCommission = (
          parseFloat(totalAmount) +
          parseFloat(totalAmount * (commission / 100)) +
          parseFloat(totalAmount * (RefCommission / 100))
        ).toString();
        console.warn('MM', 'parseFloat(totalAmount * (commission / 100))----------------', parseFloat(totalAmount * (commission / 100)));
        console.warn('MM', 'parseFloat(totalAmount * (RefCommission / 100))----------------', parseFloat(totalAmount * (RefCommission / 100)));
        console.warn('MM', 'amountAfterCommission', amountAfterCommission);

        const amountToSend = web3.utils.toWei(this.toFixednew(amountAfterCommission, 8), 'ether');
        console.warn('MM', 'amountToSend', amountToSend);
        const gasLimit = await contract.methods
          .multipleOutputs(addressArr, amountArray, referalAddress)
          .estimateGas({ value: amountToSend?.toString(), from: myAddress });
        console.warn('MM', 'total value in gwei', amountToSend);
        console.warn('MM', 'amountAfterCommission', amountAfterCommission);
        console.warn('MM', 'commission', commission);
        console.warn('MM', 'RefCommission', RefCommission);
        console.warn('MM', '---comm', commissionPercentage);
        console.warn('MM', '---gasLimit', gasLimit);
        // //console.warn('MM','let TOTT amount--- ', parseFloat(totalAmount));
        // ////console.log(
        //   'let comm amount--- ',
        //   this.exponentialToDecimal(parseFloat(totalAmount * (commission / 100))),
        // );
        // ////console.log(
        //   'let REFcomm amount--- ',
        //   this.exponentialToDecimal(
        //     parseFloat(totalAmount * (RefCommission / 100)),
        //   ),
        // );

        return resolve({
          data: data,
          commissionPercentage: commissionPercentage,
          gasLimit: (gasLimit).toFixed(0),
          amountAfterCommission: amountAfterCommission,
          commissionAmt: this.exponentialToDecimal(
            parseFloat(totalAmount * (commission / 100)),
          ),
        });
      } catch (err) {
        console.warn('MM', 'errrrrr:::::::::::::', err);
        const isExist = err.toString().includes('insufficient funds');
        console.log("isExist", isExist);
        if (global.disconnected) {
          Singleton.showAlert(Constants.NO_NETWORK);
          return reject(Constants.NO_NETWORK);
        }
        else if (isExist) {
          Singleton.showAlert('Insufficient funds for Group Transfer.');
          return reject(err);
        } else {
          Singleton.showAlert('Something went wrong.');
          return reject(err);
        }

      }
    });
  }
  // ********************************  GET COMMISSION FOR COINS STC ************************************
  async getDataForMultiSTC(
    addressArr,
    amount,
    coin_family,
    totalAmount,
    myAddress,
    referalAddress,
  ) {
    return new Promise(async (resolve, reject) => {
      const emptyAddress = /^0x0+$/.test(referalAddress);
      try {
        let minAbi = [{ "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "inputs": [], "name": "getCommisionAddress", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getCommissionPercentage", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address[]", "name": "addresses", "type": "address[]" }, { "internalType": "uint256[]", "name": "amt", "type": "uint256[]" }], "name": "multipleOutputs", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_commissionAddress", "type": "address" }], "name": "updateCommissionAddress", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_commissionPercentage", "type": "uint256" }], "name": "updateComssionPercentage", "outputs": [], "stateMutability": "nonpayable", "type": "function" }];

        const web3Dapp = new Web3(this.stcLink);
        let contract = await new web3Dapp.eth.Contract(
          minAbi,
          multiSenderSTCContractAddress,
        );
        let amountArray = amount.map(item => {
          return Web3.utils.toWei(`${this.toFixednew(item, 8)}`, 'ether');
        });
        // console.warn('MM', amountArray);

        let data = contract.methods
          .multipleOutputs(addressArr, amountArray)
          .encodeABI();

        // console.warn('MM', 'data----------------', data);
        const commissionPercentage = await contract.methods.getCommissionPercentage().call();
        console.warn('MM', 'commissionPercentage----------------', commissionPercentage);


        const commission = commissionPercentage / 100;
        const RefCommission = 0;
        const amountAfterCommissionOld = (
          parseFloat(totalAmount) +
          parseFloat(totalAmount * (commission / 100)) +
          parseFloat(totalAmount * (RefCommission / 100))
        ).toString();
        console.log("amountAfterCommissionOld::::::", amountAfterCommissionOld);
        let commisonFinal = bigNumberSafeMath(totalAmount, '*', bigNumberSafeMath(commission, '/', 100))
        console.log("commisonFinal::::::", commisonFinal);
        let RefCommissionFinal = bigNumberSafeMath(totalAmount, '*', bigNumberSafeMath(RefCommission, '/', 100))
        console.log("RefCommissionFinal::::::", amountAfterCommissionOld);
        const amountAfterCommission = bigNumberSafeMath(totalAmount, "+", bigNumberSafeMath(commisonFinal, "+", RefCommissionFinal))
        console.warn('MM', 'amountAfterCommission', amountAfterCommission);
        const amountToSend = web3.utils.toWei(this.toFixednew(amountAfterCommission, 8)?.toString(), 'ether');
        console.log("amountToSend::::::", amountToSend);
        const gasLimit = await contract.methods
          .multipleOutputs(addressArr, amountArray)
          .estimateGas({ value: amountToSend?.toString(), from: myAddress });
        console.warn('MM', 'total value in gwei', amountToSend);
        console.warn('MM', 'amountAfterCommission', amountAfterCommission);
        console.warn('MM', 'commission', commission);
        console.warn('MM', 'RefCommission', RefCommission);
        console.warn('MM', '---comm', commissionPercentage);
        console.warn('MM', '---gasLimit', gasLimit);
        console.warn('MM', 'let TOTT amount--- ', parseFloat(totalAmount));
        console.log(
          'let comm amount--- ',
          this.exponentialToDecimal(parseFloat(totalAmount * (commission / 100))),
        );
        console.log(
          'let REFcomm amount--- ',
          this.exponentialToDecimal(
            parseFloat(totalAmount * (RefCommission / 100)),
          ),
        );

        return resolve({
          data: data,
          commissionPercentage: commissionPercentage,
          gasLimit: (gasLimit).toFixed(0),
          amountAfterCommission: amountAfterCommission,
          commissionAmt: this.exponentialToDecimal(
            parseFloat(totalAmount * (commission / 100)),
          ),
        });
      } catch (err) {
        console.warn('MM', 'errrrrr:::::::::::::', err);
        const isExist = err.toString().includes('insufficient funds');
        console.log("isExist", isExist);
        if (global.disconnected) {
          Singleton.showAlert(Constants.NO_NETWORK);
          return reject(Constants.NO_NETWORK);
        }
        else if (isExist) {
          Singleton.showAlert('Insufficient funds for Group Transfer.');
          return reject(err);
        } else {
          Singleton.showAlert('Something went wrong.');
          return reject(err);
        }

      }
    });
  }
  async getDataForMultiMatic(
    addressArr,
    amount,
    coin_family,
    totalAmount,
    myAddress,
    referalAddress,
  ) {
    const emptyAddress = /^0x0+$/.test(referalAddress);
    //console.log('addis_valid', emptyAddress);
    try {
      let minAbi = [
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'previousOwner',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'newOwner',
              type: 'address',
            },
          ],
          name: 'OwnershipTransferred',
          type: 'event',
        },
        {
          inputs: [],
          name: 'getCommisionAddress',
          outputs: [{ internalType: 'address', name: '', type: 'address' }],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'getCommissionPercentage',
          outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'getRefferalCommissionPercentage',
          outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            { internalType: 'address[]', name: 'addresses', type: 'address[]' },
            { internalType: 'uint256[]', name: 'amt', type: 'uint256[]' },
          ],
          name: 'multipleOutputs',
          outputs: [],
          stateMutability: 'payable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'owner',
          outputs: [{ internalType: 'address', name: '', type: 'address' }],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            { internalType: 'address', name: 'newOwner', type: 'address' },
          ],
          name: 'transferOwnership',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: '_commissionAddress',
              type: 'address',
            },
          ],
          name: 'updateCommissionAddress',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: '_commissionPercentage',
              type: 'uint256',
            },
          ],
          name: 'updateComssionPercentage',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: '_refferalCommissionPercentage',
              type: 'uint256',
            },
          ],
          name: 'updateRefferalComssionPercentage',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ];
      let contract;
      let rpcUrls = Constants.network == 'testnet'
        ? 'https://polygon-mumbai.infura.io/v3/4458cf4d1689497b9a38b1d6bbf05e78'
        : Singleton.getInstance().maticLink;
      const web3Dapp = new Web3(rpcUrls);
      // if (coin_family == 1) {
      //   contract = await new web3.eth.Contract(
      //     minAbi,
      //     coin_family == 1
      //       ? multiSenderContractAddress
      //       : multiSenderBnbContractAddress,
      //   );
      // } else if (coin_family == 6) {
      //   contract = await new web3Dapp.eth.Contract(
      //     minAbi,
      //     coin_family == 1
      //       ? multiSenderContractAddress
      //       : multiSenderBnbContractAddress,
      //   );
      // }
      contract = await new web3Dapp.eth.Contract(
        minAbi,
        MultiSenderMaticContractAddress,
      );
      //console.log(
      // 'address',
      //   addressArr,
      //   'amount =',
      //   amount,
      //   'referalAddress ===',
      //   referalAddress,
      //   'coin_family::::',
      //   coin_family,
      // );
      let amountArray = amount.map(item => {
        return web3.utils.toWei(`${this.toFixednew(item, 8)}`, 'ether');
        // return web3.utils.toWei("0.00001", "ether")
      });
      // console.log(amountArray);

      let data = await contract.methods
        .multipleOutputs(addressArr, amountArray)
        .encodeABI();

      // console.log('data----------------', data);
      const commissionPercentage = await contract.methods
        .getCommissionPercentage()
        .call();
      // console.log('commissionPercentage----------------', commissionPercentage);

      // const RefcommissionPercentage = await contract.methods
      //   .getRefferalCommissionPercentage()
      //   .call(); // this is not available in matic ...

      //console.log(
      // 'total value in gwei RefcommissionPercentage',
      //   RefcommissionPercentage,
      // );

      const commission = commissionPercentage / 100;
      // const RefCommission =
      //   emptyAddress == true ? 0 : RefcommissionPercentage / 100;
      const amountAfterCommission = (
        parseFloat(totalAmount) + parseFloat(totalAmount * (commission / 100))
      )
        // parseFloat(totalAmount * (RefCommission / 100))
        .toString();
      // console.log('amountAfterCommission', amountAfterCommission);

      const amountToSend = web3.utils.toWei(this.toFixednew(amountAfterCommission, 8), 'ether');
      // console.log('amountToSend', amountToSend);
      const gasLimit = await contract.methods
        .multipleOutputs(addressArr, amountArray)
        .estimateGas({ value: amountToSend?.toString(), from: myAddress });
      // //console.log('total value in gwei', amountToSend);
      // //console.log('amountAfterCommission', amountAfterCommission);
      // //console.log('commission', commission);
      // //console.log('RefCommission', RefCommission);
      // //console.log('---comm', commissionPercentage);
      // console.log('---gasLimit', gasLimit);
      // //console.log('let TOTT amount--- ', parseFloat(totalAmount));
      // //console.log(
      //   'let comm amount--- ',
      //   this.exponentialToDecimal(parseFloat(totalAmount * (commission / 100))),
      // );
      // //console.log(
      //   'let REFcomm amount--- ',
      //   this.exponentialToDecimal(
      //     parseFloat(totalAmount * (RefCommission / 100)),
      //   ),
      // );

      return {
        data: data,
        commissionPercentage: commissionPercentage,
        gasLimit: (gasLimit * 1.5).toFixed(0),
        amountAfterCommission: amountAfterCommission,
        commissionAmt: this.exponentialToDecimal(
          parseFloat(totalAmount * (commission / 100)),
        ),
      };
    } catch (err) {
      console.log('errrrrr:::::::::::::', err);
      const isExist = err.toString().includes('insufficient funds');
      if (global.disconnected) {
        Singleton.showAlert(Constants.NO_NETWORK);
        return reject(Constants.NO_NETWORK);
      }
      else if (isExist) {
        Singleton.showAlert('Insufficient funds for Group Transfer.');
        return reject(err);
      } else {
        Singleton.showAlert('Something went wrong.');
        return reject(err);
      }
    }
  }

  //*********************************EthSignedRawMultisender************************************************ */
  getsignRawTxnEth = async (
    pKey,
    token_address,
    toAmount,
    gasLimit,
    my_address,
    dataEncoded,
    gasPrice,
  ) => {
    // //console.log(
    //   gasPrice + '  gasPrice',
    //   pKey + 'pKey---',
    //   token_address + 'token_address-----',
    //   toAmount + 'toAmount----',
    //   gasLimit + 'gasLimit-----',
    //   my_address + 'my_address----',
    //   dataEncoded + 'dataEncoded',
    // );
    try {
      var amountToSend = web3.utils.toWei(this.toFixednew(toAmount, 8), 'ether');
      var amount = web3.utils.toHex(amountToSend);
      const web3Raw = createAlchemyWeb3(testnetUrlEth);
      var priorityOrTip = await web3Raw.eth.getMaxPriorityFeePerGas();
      //console.warn('MM','getMaxPriorityFeePerGas', priorityOrTip);
      var block = await web3Raw.eth.getBlock('pending');
      //console.warn('MM','base fee', block.baseFeePerGas);
      var nonce = await web3Raw.eth.getTransactionCount(my_address, 'latest');
      var totalgasPrice = `0x${(
        2 * parseInt(block.baseFeePerGas, 16) +
        parseInt(priorityOrTip, 16)
      ).toString(16)}`;
      //console.warn('MM','totalgasPrice', `${gasPrice}`);
      const txData = {
        data: dataEncoded,
        gasLimit: web3Raw.utils.toHex(gasLimit),
        maxPriorityFeePerGas: priorityOrTip,
        maxFeePerGas: web3Raw.utils.toHex(gasPrice),
        nonce: nonce,
        to: token_address,
        value: amount,
        chainId: Constants.network == 'testnet' ? '0x04' : '0x01',
        accessList: [],
        type: '0x02',
      };
      const common = new Common({
        chain:
          Constants.network == 'testnet'
            ? Constants.NETWORK_NAME_ETH_TESTNET
            : 'mainnet',
        hardfork: 'london',
      });
      const tx = FeeMarketEIP1559Transaction.fromTxData(txData, { common });
      const privateKey = Buffer.from(pKey.substring(2), 'hex');
      const signedTx = await tx.sign(privateKey);
      const serializedTx = signedTx.serialize();
      //console.warn('MM','serializedTx:::::::::::::::', serializedTx.toString('hex'));
      return { signedRaw: serializedTx.toString('hex'), nonce: nonce };
    } catch (e) {
      return e
    }
  };

  //*********************************BnbSignedRawMultisender************************************************ */
  getsignRawTxnBnb = async (
    pKey,
    token_address,
    toAmount,
    gasPriceTxn,
    gasLimitTxn,
    nonce,
    my_address,
    dataEncoded,
  ) => {
    // ////console.log(
    //   'pKey--- ' + pKey,
    //   'token_address----- ' + token_address,
    //   'toAmount---- ' + toAmount,
    //   'gasLimit----- ' + gasLimitTxn,
    //   'my_address---- ' + my_address,
    //   'dataEncoded ' + dataEncoded,
    // );
    var amountToSend;
    if (toAmount != '0x0') {
      amountToSend = web3BNB.utils.toWei(this.toFixednew(toAmount, 8), 'ether');
    } else {
      amountToSend = toAmount;
    }
    const non = await web3BNB.eth.getTransactionCount(my_address);
    return new Promise((resolve, reject) => {
      const rawTxn = {
        nonce: non,
        gasPrice: gasPriceTxn,
        gasLimit: web3BNB.utils.toHex(gasLimitTxn),
        to: token_address,
        value: amountToSend,
        from: my_address,
        data: dataEncoded,
      };
      console.warn('MM', 'RAW-----', rawTxn);

      web3BNB.eth.accounts
        .signTransaction(rawTxn, pKey)
        .then(res => {
          console.log(
            '------------raw txn-----------',
            res.rawTransaction.slice(2),
          );

          console.warn('MM', '------------raw txn-----------nonce', nonce);
          web3BNB.eth
            .sendSignedTransaction(res.rawTransaction)
            .then(res1 => {
              console.warn('MM', '---------------res111-------------', res1);
              resolve(res1);
            })
            .catch(err => {
              console.warn('MM', '---------------err-------------', err);
              reject(err);
            });
        })
        .catch(error => {
          console.warn('MM', 'CATCH---------', error);
          reject(error);
        });
    });
  };
  //*********************************STCSignedRawMultisender************************************************ */
  getsignRawTxnStc = async (
    pKey,
    token_address,
    toAmount,
    gasPriceTxn,
    gasLimitTxn,
    nonce,
    my_address,
    dataEncoded,
  ) => {
    console.log(
      'pKey--- ' + pKey,
      'token_address----- ' + token_address,
      'toAmount---- ' + toAmount,
      'gasLimit----- ' + gasLimitTxn,
      'my_address---- ' + my_address,
      'dataEncoded ' + dataEncoded,
      'Singleton.getInstance().stcLink', this.stcLink,
      "gasPriceTxn_____", gasPriceTxn
    );
    var amountToSend;
    if (toAmount != '0x0') {
      amountToSend = Web3.utils.toWei(this.toFixednew(exponentialToDecimalWithoutComma(toAmount), 8), 'ether');
    } else {
      amountToSend = toAmount;
    }
    const web3STC = new Web3(this.stcLink)
    console.log("web3STC::::", web3STC, amountToSend);
    return new Promise((resolve, reject) => {
      const rawTxn = {
        nonce: nonce,
        gasPrice: gasPriceTxn,
        gasLimit: Web3.utils.toHex(gasLimitTxn),
        to: token_address,
        value: Web3.utils.toHex(exponentialToDecimalWithoutComma(amountToSend)),
        from: my_address,
        data: dataEncoded,
        chainId: 1209
      };
      console.warn('MM', 'RAW-----', rawTxn);

      web3STC.eth.accounts
        .signTransaction(rawTxn, pKey)
        .then(res => {
          console.log(
            '------------raw txn-----------',
            res.rawTransaction.slice(2),
          );

          console.warn('MM', '------------raw txn-----------nonce', nonce);
          // resolve( res.rawTransaction.slice(2))
          web3STC.eth
            .sendSignedTransaction(res.rawTransaction)
            .then(res1 => {
              console.warn('MM', '---------------res111-------------', res1);
              resolve(res1);
            })
            .catch(err => {
              console.warn('MM', '---------------err-------------', err);
              reject(err);
            });
        })
        .catch(error => {
          console.warn('MM', 'CATCH---------', error);
          reject(error);
        });
    });
  };
  getsignRawTxnMatic = async (
    pKey,
    token_address,
    toAmount,
    gasPriceTxn,
    gasLimitTxn,
    nonce,
    my_address,
    dataEncoded,
  ) => {
    return new Promise(async (resolve, reject) => {
      let rpcUrls = Constants.network == 'testnet'
        ? 'https://polygon-mumbai.infura.io/v3/4458cf4d1689497b9a38b1d6bbf05e78'
        : Singleton.getInstance().maticLink;
      const web3Matic = new Web3(rpcUrls)
      console.log(
        '>>>>>>>>>>>>>>>>>>>>' + 'pKey--- ' + pKey,
        'token_address----- ' + token_address,
        'toAmount---- ' + toAmount,
        'gasPriceTxn---- ' + gasPriceTxn,
        'gasLimit----- ' + gasLimitTxn,
        'my_address---- ' + my_address,
        'dataEncoded ' + dataEncoded,
      );
      var amountToSend;
      if (toAmount != '0x0') {
        amountToSend = web3Matic.utils.toWei(this.toFixednew(toAmount, 8), 'ether');
      } else {
        amountToSend = toAmount;
      }
      try {
        console.log('amountToSend:::::', amountToSend);
        const non = await web3Matic.eth.getTransactionCount(my_address);
        console.log('nonce:::::', non);
        const rawTxn = {
          nonce: non,
          gasPrice: gasPriceTxn,
          gasLimit: web3Matic.utils.toHex(gasLimitTxn),
          to: token_address,
          value: amountToSend,
          from: my_address,
          data: dataEncoded,
        };
        console.log('RAW-----', rawTxn);

        web3Matic.eth.accounts
          .signTransaction(rawTxn, pKey)
          .then(res => {
            console.log(
              '------------raw txn-----------',
              res.rawTransaction.slice(2),
            );

            console.log('------------raw txn-----------nonce', nonce);
            web3Matic.eth
              .sendSignedTransaction(res.rawTransaction)
              .then(res1 => {
                console.log('---------------res111-------------', res1);
                resolve(res1);
              })
              .catch(err => {
                console.log('---------------err-------------', err);
                reject(err);
              });
          })
          .catch(error => {
            console.log('CATCH---------', error);
            reject(error);
          });
      } catch (e) {
        console.log('CATCH---------', error);
        reject(e);
      }
    });
  };

  // ********************************  CHECK ALLOWANCE FOR MULTISENDER ETH, BNB COIN  ************************************
  async checkAllowance(contractAdd, walletAddress, coin_family) {
    console.log("coin_family::::", coin_family, "walletAddress:::::", walletAddress, "contractAdd::::", contractAdd);
    return new Promise(async (resolve, reject) => {
      let rpcUrls = Constants.network == 'testnet'
        ? 'https://polygon-mumbai.infura.io/v3/4458cf4d1689497b9a38b1d6bbf05e78'
        : Singleton.getInstance().maticLink;
      try {
        const mintokenABI = idaAbi;
        const contractAddress = contractAdd;
        if (coin_family == 1) {
          const contract = new web3.eth.Contract(mintokenABI, contractAddress);
          // //console.warn('MM','CONTRACT_------------', contract);
          const allowance = await contract.methods
            .allowance(walletAddress, erc20MultiSenderContractAddress)
            .call();
          // //console.warn('MM','allowance---- ', allowance);
          resolve(allowance);
        } else if (coin_family == 6) {
          let web3Dapp = new Web3(web3BscUrl);
          var contract = new web3Dapp.eth.Contract(
            mintokenABI,
            contractAddress,
          );
          const allowance = await contract.methods
            .allowance(walletAddress, bep20MultiSenderContractAddress)
            .call();
          //console.warn('MM','allowance---- ', allowance);
          resolve(allowance);
        } else if (coin_family == 11) {
          let web3Dapp = new Web3(rpcUrls);
          var contract = new web3Dapp.eth.Contract(
            mintokenABI,
            contractAddress,
          );
          const allowance = await contract.methods
            .allowance(walletAddress, matic20MultiSenderContractAddress)
            .call();
          //console.log('allowance---- ', allowance);
          resolve(allowance);
        } else if (coin_family == 4) {
          console.log("coinfamily4:::::::::::::", this.stcLink, multiSenderSTCERC20ContractAddress);
          let web3Dapp = new Web3(this.stcLink);
          var contract = new web3Dapp.eth.Contract(
            mintokenABI,
            contractAddress,
          );
          const allowance = await contract.methods
            .allowance(walletAddress, multiSenderSTCERC20ContractAddress)
            .call();
          console.log('allowance---- ', allowance);
          resolve(allowance);
        }
      } catch (error) {
        console.log('error in alloance', error);
        if (error?.includes('Out of Gas')) {
          return reject({ message: 'Insufficient funds' });
        }
        reject(error);
      }
    });
  }
  // ********************************  GET COMMISSION FOR TOKENS  ************************************
  async getDataForMultiEthToken(
    addressArr,
    amount,
    tokenAddress,
    decimals,
    coin_family,
    totalAmount,
    myAddress,
    referalAddress,
  ) {
    let minAbis = multiSendTokenabi;
    try {
      var contract;
      let rpc;
      if (coin_family == 6) {
        rpc = this.bnbLink
      } else if (coin_family == 4) {
        rpc = this.stcLink
      } else if (coin_family == 1) {
        rpc = this.ethLink
      }
      console.log("rpc::::", rpc);
      let web3Dapp = new Web3(rpc);
      if (coin_family == 1) {
        contract = await new web3.eth.Contract(
          minAbis,
          erc20MultiSenderContractAddress,
        );
      } else if (coin_family == 6) {
        contract = await new web3Dapp.eth.Contract(
          minAbis,
          bep20MultiSenderContractAddress,
        );
      }
      let amountArray = amount.map(item => {
        const amountToSend = item * decimals;
        const amountToSendwithouexpo = this.exponentialToDecimal(amountToSend);
        const removedDecimal = amountToSendwithouexpo.split('.')[0];
        return removedDecimal;
      });
      console.warn('MM', 'amountArray---->', amountArray);
      const data = contract.methods
        .makeTransfer(addressArr, amountArray, tokenAddress, referalAddress)
        .encodeABI();
      console.log("data:::::::", data);
      const commissionAmount = await contract.methods
        .getCommissionAmount()
        .call();
      console.log("commissionAmount:::::::", commissionAmount);
      const commission = commissionAmount;
      const amountAfterCommission = parseFloat(commission).toString();
      console.log('parseFloat(commission)  ', parseFloat(commission));
      const gasLimit = await contract.methods
        .makeTransfer(addressArr, amountArray, tokenAddress, referalAddress)
        .estimateGas({ value: amountAfterCommission?.toString(), from: myAddress });
      return {
        data: data,
        commissionAmount: commissionAmount,
        amountAfterCommission: (
          parseFloat(amountAfterCommission) /
          10 ** 18
        ).toString(),
        gasLimit: (gasLimit * 1.5).toFixed(0),
        commissionAmt: this.exponentialToDecimal(parseFloat(commission)),
      };
    } catch (err) {
      console.log('errrrrr:::::::::::::', err);
      const isExist = err.toString().includes('insufficient funds');
      if (global.disconnected) {
        Singleton.showAlert(Constants.NO_NETWORK);
        return Constants.NO_NETWORK;
      }
      else if (isExist) {
        Singleton.showAlert('Insufficient funds for Group Transfer.');
        return err;
      } else {
        Singleton.showAlert('Something went wrong.');
        return err;
      }
    }
  }
  async getDataForMultiSTCToken(
    addressArr,
    amount,
    tokenAddress,
    decimals,
    myAddress,
    referalAddress,
  ) {
    let minAbis =[ { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "OwnershipTransferred", "type": "event" }, { "inputs": [], "name": "getCommisionAddress", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getCommissionAmount", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address payable[]", "name": "addressArray", "type": "address[]" }, { "internalType": "uint256[]", "name": "amountArray", "type": "uint256[]" }, { "internalType": "address", "name": "contractAddress", "type": "address" } ], "name": "makeTransfer", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "_commissionAddress", "type": "address" } ], "name": "updateCommissionAddress", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_commissionAmount", "type": "uint256" } ], "name": "updateComssionAmount", "outputs": [], "stateMutability": "nonpayable", "type": "function" } ];
    try {
      let web3Dapp = new Web3(this.stcLink);
      let contract = new web3Dapp.eth.Contract(
        minAbis,
        multiSenderSTCERC20ContractAddress,
      );
      let amountArray = amount.map(item => {
        const amountToSend = item * decimals;
        const amountToSendwithouexpo = this.exponentialToDecimal(amountToSend);
        const removedDecimal = amountToSendwithouexpo.split('.')[0];
        return removedDecimal;
      });
      console.warn('MM', 'amountArray---->', amountArray, "addressArr____", addressArr, "tokenAddress", tokenAddress, "referalAddress", referalAddress);
      const data = contract.methods
        .makeTransfer(addressArr, amountArray, tokenAddress)
        .encodeABI();
      console.log("data:::::::", data);
      const commissionAmount = await contract.methods
        .getCommissionAmount()
        .call();
      console.log("commissionAmount:::::::", commissionAmount);
      const commission = commissionAmount;
      const amountAfterCommission = parseFloat(commission).toString();
      console.log('parseFloat(commission)  ', parseFloat(commission));
      const gasLimit = await contract.methods
        .makeTransfer(addressArr, amountArray, tokenAddress)
        .estimateGas({ value: amountAfterCommission?.toString(), from: myAddress });
      console.log('---gasLimit', gasLimit);
      return {
        data: data,
        commissionAmount: commissionAmount,
        amountAfterCommission: (
          parseFloat(amountAfterCommission) /
          10 ** 18
        ).toString(),
        gasLimit: (gasLimit).toFixed(0),
        commissionAmt: this.exponentialToDecimal(parseFloat(commission)),
      };
    } catch (err) {
      console.log('errrrrr:::::::::::::', err);
      const isExist = err.toString().includes('insufficient funds');
      if (global.disconnected) {
        Singleton.showAlert(Constants.NO_NETWORK);
        return Constants.NO_NETWORK;
      }
      else if (isExist) {
        Singleton.showAlert('Insufficient funds for Group Transfer.');
        return err;
      } else {
        Singleton.showAlert('Something went wrong.');
        return err;
      }
    }
  }
  async getDataForMultiMaticToken(
    addressArr,
    amount,
    tokenAddress,
    decimals,
    coin_family,
    totalAmount,
    myAddress,
    referalAddress,
  ) {
    const emptyAddress = /^0x0+$/.test(referalAddress);
    // //console.log('addis_valid', emptyAddress);
    let minAbis = multiSendTokenMaticAbi;
    try {
      let contract;
      let rpcUrls = Constants.network == 'testnet'
        ? 'https://polygon-mumbai.infura.io/v3/4458cf4d1689497b9a38b1d6bbf05e78'
        : Singleton.getInstance().maticLink;
      let web3Dapp = new Web3(rpcUrls);
      // if (coin_family == 1) {
      //   contract = await new web3.eth.Contract(
      //     minAbis,
      //     erc20MultiSenderContractAddress,
      //   );
      // } else if (coin_family == 6) {
      //   contract = await new web3Dapp.eth.Contract(
      //     minAbis,
      //     bep20MultiSenderContractAddress,
      //   );
      // }
      contract = await new web3Dapp.eth.Contract(
        minAbis,
        matic20MultiSenderContractAddress,
      );
      //console.log(
      // 'address',
      //   addressArr,
      //   'amount =',
      //   amount,
      //   'token address',
      //   tokenAddress,
      //   'decimals',
      //   decimals,
      //   'referalAddress',
      //   referalAddress,
      //   'coin_family',
      //   coin_family,
      // );
      let amountArray = amount.map(item => {
        const amountToSend = item * decimals;
        const amountToSendwithouexpo = this.exponentialToDecimal(amountToSend);
        const removedDecimal = amountToSendwithouexpo.split('.')[0];
        return removedDecimal;
      });
      // console.log('amountArray---->', amountArray);
      const data = await contract.methods
        .makeTransfer(addressArr, amountArray, tokenAddress)
        .encodeABI();
      const commissionAmount = await contract.methods
        .getCommissionAmount()
        .call();
      // const RefcommissionAmount = await contract.methods
      //   .getReferralAmount()
      //   .call();
      const commission = commissionAmount;
      // const RefCommission = emptyAddress == true ? 0 : RefcommissionAmount;
      const amountAfterCommission = parseFloat(commission).toString();
      const gasLimit = await contract.methods
        .makeTransfer(addressArr, amountArray, tokenAddress)
        .estimateGas({ value: amountAfterCommission?.toString(), from: myAddress });
      //console.log('---gasLimit', gasLimit);

      //console.warn('MM','parseFloat(commission)  ', parseFloat(commission));
      return {
        data: data,
        commissionAmount: commissionAmount,
        gasLimit: (gasLimit * 1.5).toFixed(0),
        amountAfterCommission: (
          parseFloat(amountAfterCommission) /
          10 ** 18
        ).toString(),
        commissionAmt: this.exponentialToDecimal(parseFloat(commission)),
      };
    } catch (err) {
      console.log('errrrrr:::::::::::::', err);
      const isExist = err.toString().includes('insufficient funds');
      if (global.disconnected) {
        Singleton.showAlert(Constants.NO_NETWORK);
        return reject(Constants.NO_NETWORK);
      }
      else if (isExist) {
        Singleton.showAlert('Insufficient funds for Group Transfer.');
        return reject(err);
      } else {
        Singleton.showAlert('Something went wrong.');
        return reject(err);
      }
    }
  }
  //*********************************EthTokenSignedRawMultisender*********************************************** /
  getsignRawTxnEthToken = async (
    pKey,
    token_address,
    gasLimit,
    my_address,
    dataEncoded,
    value,
    gasPrice,
  ) => {
    // ////console.log(
    //   gasPrice + ' gasPrice' + pKey + 'pKey---',
    //   token_address + 'token_address-----',
    //   gasLimit + 'gasLimit-----',
    //   'value',
    //   value,
    //   my_address + 'my_address----',
    //   dataEncoded + 'dataEncoded',
    // );
    var amount = web3.utils.toWei(this.toFixednew(value, 8), 'ether');
    const web3Raw = createAlchemyWeb3(testnetUrlEth);
    var priorityOrTip = await web3Raw.eth.getMaxPriorityFeePerGas();
    //console.warn('MM','getMaxPriorityFeePerGas', priorityOrTip);
    var block = await web3Raw.eth.getBlock('pending');
    //console.warn('MM','base fee', block.baseFeePerGas);
    var nonce = await web3Raw.eth.getTransactionCount(my_address, 'latest');
    // var totalgasPrice = `0x${(2 * parseInt(block.baseFeePerGas, 16) + parseInt(priorityOrTip, 16)).toString(16)}`;
    var totalgasPrice = await web3Raw.eth.getGasPrice();
    // //console.warn('MM','totalgasPrice--- totkn--- ', totalgasPrice);

    // //console.warn('MM','totalgasPrice', `${gasPrice}`);
    const txData = {
      data: dataEncoded,
      gasLimit: web3Raw.utils.toHex(gasLimit),
      maxPriorityFeePerGas: priorityOrTip,
      maxFeePerGas: web3Raw.utils.toHex(gasPrice),
      nonce: nonce,
      to: token_address,
      value: web3.utils.toHex(amount),
      chainId: Constants.network == 'testnet' ? '0x04' : '0x01',
      accessList: [],
      type: '0x02',
    };
    //console.warn('MM','txData', txData);
    const common = new Common({
      chain:
        Constants.network == 'testnet'
          ? Constants.NETWORK_NAME_ETH_TESTNET
          : 'mainnet',
      hardfork: 'london',
    });
    const tx = FeeMarketEIP1559Transaction.fromTxData(txData, { common });
    const privateKey = Buffer.from(pKey.substring(2), 'hex');
    const signedTx = await tx.sign(privateKey);
    const serializedTx = signedTx.serialize();
    //console.warn('MM','serializedTx:::::::::::::::', serializedTx.toString('hex'));

    return { signedRaw: serializedTx.toString('hex'), nonce: nonce };
  };

  ParseFloatNumber(str, val) {
    // //console.warn('MM','str typeof--', typeof str);
    // if (str.toString()?.includes('.')) {
    //   //console.warn('MM','chcek string=-=-=', str);
    // } else {
    //   //console.warn('MM','chcek string=-=-=else', str);
    // }
    // //console.warn('MM','check str---', str, val);
    str = str.toString();
    str = str.slice(0, str.indexOf('.') + val + 1);
    let a = str.split('.');

    if (a[1] == undefined) {
      a = a[0];
      return a;
    } else {
      a = a[0] + '.' + a[1].toString().padEnd(val, 0);
      return a;
    }
  }
  ParseFloatNumberOnly(str, val) {
    var re = new RegExp('^-?\\d+(?:.\\d{0,' + (val || -1) + '})?');
    return str.toString().match(re)[0];
  }
  //*********************************TokenApproval************************************************ */

  getsignRawTxnTokenApproval = async (
    pKey,
    token_address,
    gasPriceTxn,
    gasLimit,
    nonce,
    my_address,
    coin_family,
  ) => {
    var amountToApprove = exponentialToDecimalWithoutComma(10 ** 25);
    console.warn('MM', 'exponential with comma----', amountToApprove);
    var contract = await new web3.eth.Contract(approveAbi, token_address);
    let dataEncoded = contract.methods
      .approve(
        coin_family == 1
          ? erc20MultiSenderContractAddress
          : coin_family == 6
            ? bep20MultiSenderContractAddress
            : coin_family == 4
              ? multiSenderSTCERC20ContractAddress
              : matic20MultiSenderContractAddress,
        amountToApprove,
      )
      .encodeABI();
    if (coin_family == 1) {
      console.warn('MM', '_____ testnetUrlEth', testnetUrlEth);
      const web3Approval = createAlchemyWeb3(this.ethLink);
      var priorityOrTip = await web3Approval.eth.getMaxPriorityFeePerGas();
      console.warn('MM', 'getMaxPriorityFeePerGas', priorityOrTip);
      var block = await web3Approval.eth.getBlock('pending');
      console.warn('MM', 'base fee', block.baseFeePerGas);
      var nonce = await web3Approval.eth.getTransactionCount(
        my_address,
        'latest',
      );
      var totalgasPrice = await web3.eth.getGasPrice();
      var totalgasPrice = `0x${(
        2 * parseInt(block.baseFeePerGas, 16) +
        parseInt(priorityOrTip, 16)
      ).toString(16)}`;
      console.warn('MM', 'totalgasPrice', `${totalgasPrice}`);
      var defaultgaslimit = gasLimit;
      console.warn('MM', 'totalgasPrice', `${totalgasPrice}`);
      var transactionFeeSupplied =
        parseInt(totalgasPrice, 16) * 0.000000001 * 0.000000001 * 21000;
      console.warn('MM', 'transactionFeeSupplied', transactionFeeSupplied);
      const txData = {
        data: dataEncoded,
        gasLimit: web3Approval.utils.toHex(defaultgaslimit),
        maxPriorityFeePerGas: web3BNB.utils.toHex(priorityOrTip),
        maxFeePerGas: web3BNB.utils.toHex(gasPriceTxn),
        nonce: nonce,
        to: token_address,
        value: '0x0',
        chainId: Constants.network == 'testnet' ? '0x04' : '0x01',
        accessList: [],
        type: '0x02',
      };
      console.log("txData:::::", txData);
      const common = new Common({
        chain:
          Constants.network == 'testnet'
            ? Constants.NETWORK_NAME_ETH_TESTNET
            : 'mainnet',
        hardfork: 'london',
      });
      const tx = FeeMarketEIP1559Transaction.fromTxData(txData, { common });
      const privateKey = Buffer.from(pKey.substring(2), 'hex');
      const signedTx = await tx.sign(privateKey);
      const serializedTx = signedTx.serialize();
      console.warn('MM', 'serializedTx:::::::::::::::', serializedTx.toString('hex'));
      return { signedRaw: serializedTx.toString('hex'), nonce: nonce };
    } else if (coin_family == 6) {
      const non = await web3BNB.eth.getTransactionCount(my_address);
      console.warn('MM', 'RAW_DATA==== non =', non);
      return new Promise((resolve, reject) => {
        const rawTransaction = {
          nonce: non,
          gasPrice: web3BNB.utils.toHex(gasPriceTxn),
          gasLimit: web3BNB.utils.toHex(gasLimit),
          to: token_address,
          value: '',
          from: my_address,
          data: dataEncoded,
          chainId: parseInt(Constants.CHAIN_ID_BNB),
        };
        console.warn('MM', dataEncoded, '---encodeData---');
        console.warn('MM', 'RAW_DATA=====', rawTransaction);
        web3BNB.eth.accounts
          .signTransaction(rawTransaction, pKey)
          .then(res => {
            console.warn('MM', '------------raw txn-----------', res.rawTransaction);
            web3BNB.eth
              .sendSignedTransaction(res.rawTransaction)
              .then(res1 => {
                console.warn('MM', '---------------res111-------------', res1);
                resolve(res1);
              })
              .catch(err => {
                reject(err);
                console.warn('MM', '---------------error', err);
              });
          })
          .catch(error => {
            reject(error);
          });
      });
    } else if (coin_family == 11) {
      let rpcUrls = Constants.network == 'testnet'
        ? 'https://polygon-mumbai.infura.io/v3/4458cf4d1689497b9a38b1d6bbf05e78'
        : Singleton.getInstance().maticLink;
      const web3Matic = new Web3(rpcUrls)
      const non = await web3Matic.eth.getTransactionCount(my_address);
      console.log('RAW_DATA==== non =', non);
      return new Promise((resolve, reject) => {
        const rawTransaction = {
          nonce: non,
          gasPrice: web3Matic.utils.toHex(gasPriceTxn),
          gasLimit: web3Matic.utils.toHex(gasLimit),
          to: token_address,
          value: '',
          from: my_address,
          data: dataEncoded,
          chainId: 137,
        };
        console.log(dataEncoded, '---encodeData---');
        console.log('RAW_DATA=====', rawTransaction);
        web3Matic.eth.accounts
          .signTransaction(rawTransaction, pKey)
          .then(res => {
            //console.log('------------raw txn-----------', res.rawTransaction);
            web3Matic.eth
              .sendSignedTransaction(res.rawTransaction)
              .then(res1 => {
                console.log('---------------res111-------------', res1);
                resolve(res1);
              })
              .catch(err => {
                reject(err);
                console.log('---------------error', err);
              });
          })
          .catch(error => {
            reject(error);
          });
      });
    } else if (coin_family == 4) {
      let rpcUrls = this.stcLink;
      const web3STC = new Web3(rpcUrls)
      const non = await web3STC.eth.getTransactionCount(my_address);
      console.log('RAW_DATA==== non =', non);
      return new Promise((resolve, reject) => {
        const rawTransaction = {
          nonce: non,
          gasPrice: web3STC.utils.toHex(gasPriceTxn),
          gasLimit: web3STC.utils.toHex(gasLimit),
          to: token_address,
          value: '',
          from: my_address,
          data: dataEncoded,
          chainId: 1209,
        };
        console.log(dataEncoded, '---encodeData---');
        console.log('RAW_DATA=====', rawTransaction);
        web3STC.eth.accounts
          .signTransaction(rawTransaction, pKey)
          .then(res => {
            //console.log('------------raw txn-----------', res.rawTransaction);
            web3STC.eth
              .sendSignedTransaction(res.rawTransaction)
              .then(res1 => {
                console.log('---------------res111-------------', res1);
                resolve(res1);
              })
              .catch(err => {
                reject(err);
                console.log('---------------error', err);
              });
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  };

  async validateMnemonics(mnemonics) {
    return new Promise(async (resolve, reject) => {
      try {
        const validMnemonics = await validateMnemonics(mnemonics);
        resolve(validMnemonics);
      } catch (e) {
        reject('Invalid mnemonics');
      }
    });
  }

  // prod
  async importWallet(mnemonics, btcOnly = false) {
    return new Promise(async (resolve, reject) => {
      try {
        // ********************************  FOR ETH  ************************************
        CreateWallet.generateAddressFromMnemonics(mnemonics, async obj => {
          console.log('---------Obj', JSON.parse(obj));
          let data = JSON.parse(obj);
          let ethWallet = data.eth;
          let tronObj;
          let BTC_obj = data.btc;

          if (ethWallet.pvtKey?.length < 66) {
            let suffix = '0x' + '0'.repeat(66 - ethWallet.pvtKey?.length);
            ethWallet.pvtKey = suffix + ethWallet.pvtKey.substring(2);
          }

          if (!validateMnemonic(mnemonics)) {
            return reject('Invalid Mnemonics');
          }
          // if(!btcOnly){

          // let ethWallet1 = await generateEthWallet(mnemonics);
          // console.log(ethWallet1);
          tronObj = await this.generateTronAddress(mnemonics);
          // console.log('ethWallet' , ethWallet);
          // if(!ethWallet.address){
          //   return reject('Invalid Mnemonics')
          // }
          await this.newSaveData(ethWallet.address + '_pk', ethWallet.pvtKey);
          await this.newSaveData(ethWallet.address, mnemonics);

          await this.newSaveData(tronObj.address + '_pk', tronObj.privateKey);
          await this.newSaveData(tronObj.address, mnemonics);
          // }
          if (Constants.network == 'testnet') {
            BTC_obj = await this.getBTCAddress(mnemonics, 0);
          }
          // let BTC_obj = await this.getBTCAddress(mnemonics, 0);
          await this.newSaveData(BTC_obj.address + '_pk', BTC_obj.pvtKey);
          await this.newSaveData(BTC_obj.address, mnemonics);

          // if(!btcOnly){

          return resolve({
            mnemonics,
            ethAddress: ethWallet.address,
            btcAddress: BTC_obj.address,
            trxAddress: tronObj.address,
          });
          // }else{

          //   return resolve({
          //     mnemonics,
          //     btcAddress: BTC_obj.address,
          //   });
          // }
        });
      } catch (e) {
        //console.warn('MM','import wallet error ', e);
        return reject(e);
      }
    });
  }
  // stage
  // async importWallet(mnemonics , btcOnly = false) {
  //   return new Promise(async (resolve , reject) =>{

  //   try {
  //     // ********************************  FOR ETH  ************************************
  //     CreateWallet.generateAddressFromMnemonics(mnemonics, async obj=> {
  //       console.log('---------Obj', JSON.parse(obj));
  //       let data = JSON.parse(obj)
  //     let ethWallet = data.eth;
  //     let tronObj;
  //     //  let BTC_obj = data.btc
  //     if(!validateMnemonic(mnemonics))
  //     return reject('Invalid Mnemonics')
  //     // if(!btcOnly){

  //       // ethWallet = await generateEthWallet(mnemonics);
  //       tronObj = await this.generateTronAddress(mnemonics)
  //       // console.log('ethWallet' , ethWallet);
  //       // if(!ethWallet.address){
  //       //   return reject('Invalid Mnemonics')
  //       // }
  //       await this.newSaveData(ethWallet.address + '_pk', ethWallet.pvtKey);
  //       await this.newSaveData(ethWallet.address, mnemonics);

  //       await this.newSaveData(tronObj.address + '_pk', tronObj.privateKey);
  //         await this.newSaveData(tronObj.address, mnemonics);
  //       // main btc
  //     // await this.newSaveData(BTC_obj.address + '_pk', BTC_obj.pvtkey);
  //     // await this.newSaveData(BTC_obj.address, mnemonics);
  //     // }

  //       // test btc
  //     let BTC_obj = await this.getBTCAddress(mnemonics, 0);
  //     await this.newSaveData(BTC_obj.address + '_pk', BTC_obj.pvtkey);
  //     await this.newSaveData(BTC_obj.address, mnemonics);

  //     // if(!btcOnly){

  //       return resolve({
  //         mnemonics,
  //         ethAddress: ethWallet.address,
  //         btcAddress: BTC_obj.address,
  //         trxAddress:tronObj.address
  //       });
  //     // }else{

  //     //   return resolve({
  //     //     mnemonics,
  //     //     btcAddress: BTC_obj.address,
  //     //   });
  //     // }
  //   })
  //   } catch (e) {
  //     //console.warn('MM','import wallet error ', e);
  //     return reject(e);
  //   }

  // })
  // }

  gettxStatus(type) {
    switch (type) {
      case 1:
        return 'Consume';
      case 2:
        return 'Recharge';
      case 3:
        return 'Withdrawal';
      case 4:
        return ' Transfer In';
      case 5:
        return 'Transfer Out';
      case 6:
        return 'Other';
      case 7:
        return 'Settlement adjustment';
      case 8:
        return 'Refund';
      default:
        return 'Consume';
    }
  }

  async cardfees(checkCardType) {
    try {
      //  console.warn('MM','+++++++++++cardFees11');
      let routerContractObject = await this.getContractObject(
        routerAddressCards,
        SmartCardAbi,
      );
      //console.warn('MM','+++++++++++cardFees22');
      const cardType =
        checkCardType?.toLowerCase() == 'black'
          ? 0
          : checkCardType?.toLowerCase() == 'diamond'
            ? 1
            : checkCardType?.toLowerCase() == 'gold'
              ? 2
              : 0;
      //console.warn('MM','+++++++++++cardFees33', cardType);
      let cardFees = await routerContractObject.methods
        .cardTypeToFees(cardType)
        .call();
      //console.warn('MM','+++++++++++cardFee  >>>', cardFees);
      return Promise.resolve(cardFees);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  getWeb3Object() {
    //  let network = new Web3("https://eth-goerli.g.alchemy.com/v2/aZnKYk2iGEX6eD_Fm2WbdphfiG7EPA4V");
    let network = new Web3(Singleton.getInstance().ethLink);
    //console.warn('MM','network');
    return network;
  }

  async getContractObject(address, abi) {
    try {
      const web3Object = this.getWeb3Object();
      let tokenContractObject;
      try {
        tokenContractObject = await new web3Object.eth.Contract(abi, address);
      } catch (error) {
        //console.warn('MM','>>>>errorerror', error);
      }
      return tokenContractObject;
    } catch (e) {
      console.error('error ===>>', e);
    }
  }
  //*******************************DAPP SIGN TXN FOR APPROVAL************************* */
  //   async dappApprovalHash(pvt_key, approvalParam) {
  //     return new Promise((resolve, reject) => {
  // console.log("pvt_key:::::",pvt_key);
  // console.log("approvalParam:::::",approvalParam);
  //       let wallet = new Wallet(pvt_key);
  //       wallet._signTypedData(
  //         approvalParam.domain,
  //         approvalParam.types,
  //         approvalParam.message
  //       ).then(async (resww) => {

  //         const sig = utils.splitSignature(resww);

  //         let verify = utils.verifyTypedData(
  //           approvalParam.domain,
  //           approvalParam.types,
  //           approvalParam.message,
  //           sig
  //         );
  //         console.log("verify::::", verify);
  //         resolve(resww);
  //       })
  //         .catch((err) => {

  //           reject(err);
  //         });
  //     });
  //   }

  encodeJWT = data => {
    const second = new NodeRSA(Constants.SAITAMASK_WALLET_KEY);
    second.setOptions({ encryptionScheme: 'pkcs1' });
    const enc = second.encrypt(data, 'base64');
    //  console.warn('MM','enc::::', enc);
    return enc;
  };
  async dappApprovalHash(pvt_key, approvalParam) {
    console.log("approvalParam", approvalParam);
    console.log("pvt_key", pvt_key);
    return new Promise((resolve, reject) => {
      let wallet = new Wallet(pvt_key);
      wallet
        ._signTypedData(
          approvalParam.domain,
          approvalParam.types,
          approvalParam.message,
        )
        .then(async resww => {
          // console.log('----------resww', resww);
          const sig = utils.splitSignature(resww);
          // console.log('--------sig', sig)
          let verify = utils.verifyTypedData(
            approvalParam.domain,
            approvalParam.types,
            approvalParam.message,
            sig,
          );
          // console.log('--------verify', verify);
          resolve(resww);
        })
        .catch(err => {
          // console.log('----------err', err);
          reject(err);
        });
    });
  }
}
