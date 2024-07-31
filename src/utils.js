import * as constants from './Constant';
import idaAbi from './idaAbi.json';
import { createAlchemyWeb3 } from '@alch/alchemy-web3';
import Singleton from './Singleton';
import Web3 from 'web3';
import Common from '@ethereumjs/common';
import { FeeMarketEIP1559Transaction } from '@ethereumjs/tx';
import { entropyToMnemonic, HDNode } from 'ethers/lib/utils';
import { utils, Wallet } from 'ethers';
import { NativeModules } from 'react-native';
import { API_CARD_BINANCE_CREATE_ORDER, API_CARD_EPAY_CREATE_ORDER, IS_PRODUCTION } from './Endpoints';
import { mnemonicToSeed } from 'bip39';
import { APIClient } from './Api';
import { ThemeManager } from '../ThemeManager';
const Tx = require('ethereumjs-tx');
import BigNumber from 'bignumber.js'
import { PERMISSIONS } from 'react-native-permissions';
import { showMessage } from 'react-native-flash-message';
import NodeRSA from 'node-rsa';

// https://rinkeby.infura.io/v3/ef700abe941041fe8556c43d40f131ab https://ropsten.infura.io/v3/2436cc78200f432aa2d847a7ba486391
const testnetUrlEth =
  constants.network == 'testnet'
    ? constants.testnetEth
    // ? 'https://eth-goerli.g.alchemy.com/v2/Wb58dMxk9SBhP1QirBVMFCYwgHXoWRbK'
    : Singleton.getInstance().ethLink;
const testnetUrlMatic =
  constants.network == 'testnet'
    ? 'https://polygon-mumbai.infura.io/v3/4458cf4d1689497b9a38b1d6bbf05e78'
    :  Singleton.getInstance().maticLink;
    //  'https://rpc-mainnet.maticvigil.com/'   
   
const urlBnb = constants.network == 'testnet'
  ? 'https://data-seed-prebsc-1-s1.binance.org:8545/'
  : Singleton.getInstance().bnbLink;
const testnetUrlEthDapp =
  constants.network == 'testnet'
    ? constants.testnetEth
    : Singleton.getInstance().ethLink;

const stcRPCURL = Singleton.getInstance().stcLink;

/************************************** mnemonics methods ************************************/
export const web3Stc = createAlchemyWeb3(stcRPCURL)

export const generateMnemonics = () => {
  const mnemonics = entropyToMnemonic(utils.randomBytes(16));
  //console.warn('MM','generateMnemonics =>', mnemonics);
  return mnemonics;
};

export function convertToInternationalCurrencySystem(labelValue) {

  // Nine Zeroes for Billions
  return Math.abs(Number(labelValue)) >= 1.0e+15

    ? exponentialToDecimalWithoutComma((Math.abs(Number(labelValue)) / 1.0e+15).toFixed(2)) + "Q"
    // Six Zeroes for Millions 
    : Math.abs(Number(labelValue)) >= 1.0e+12

      ? (Math.abs(Number(labelValue)) / 1.0e+12).toFixed(2) + "T"
      // Six Zeroes for Millions 
      : Math.abs(Number(labelValue)) >= 1.0e+9

        ? (Math.abs(Number(labelValue)) / 1.0e+9).toFixed(2) + "B"
        // Six Zeroes for Millions 
        : Math.abs(Number(labelValue)) >= 1.0e+6

          ? (Math.abs(Number(labelValue)) / 1.0e+6).toFixed(2) + "M"
          // Three Zeroes for Thousands
          : Math.abs(Number(labelValue)) >= 1.0e+3

            ? CommaSeprator3(labelValue, 2)

            : Singleton.getInstance().toFixednew(exponentialToDecimalWithoutComma(Math.abs(Number(labelValue))), 2);

}
export const CommaSeprator3 = (num, fixed,show) => {
  show && console.log("num:::::",num,"fixed::::",fixed);
  var val = num.toString(); //If it's not already a String
  let decimal = val?.toLowerCase();
  if (decimal?.includes("e+") || decimal?.includes("e-")) {
    let expoVal = exponentialToDecimalWithoutComma(num);
    let finalVal =
      expoVal.toString().length >= 6
        ? expoVal.substring(0, 3) +
        "..." +
        expoVal.substring(
          expoVal.toString().length - 4,
          expoVal.toString().length
        )
        : expoVal;
    return finalVal;
  }
  if (!val.includes(".")) {
    if (val?.length >= 4) {
      return (val = val?.replace(/(\d)(?=(\d{3})+$)/g, "$1,"));
    } else {
      return val;
    }
  } else if (val.includes(".")) {
    val = val.slice(0, (val.indexOf(".") + (fixed + 1)));
    var str = val.split(".");
    if (str[0].length >= 4) {
      str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, "$1,");
    }
    if (parseInt(str[0]) >= 1) {
      val = val.slice(0, val.indexOf(".") + (2 + 1));
      if (str[0].length >= 4) {
        str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, "$1,");
      }
      return str.join(".");
    }
    return str.join(".");
  }
};

/************************************** Generate ETH signed raw ************************************/

export const createSignedNewEthTransaction = async (
  my_address,
  to_address,
  pvt_key,
  amount,
  gasPrice
) => {
  ////console.log(
  // 'my_address::::::',
  //   my_address,
  //   'to_address:::::::::',
  //   to_address,
  //   'pvt_key::::::::::::::',
  //   pvt_key,
  //   'amount::::::::::::',
  //   amount,
  //   'test amount::::::::',
  //   Singleton.getInstance().exponentialToDecimal(amount * 10 ** 18),
  // );
  const web3 = createAlchemyWeb3(testnetUrlEth);
  let amountNew = Singleton.getInstance().exponentialToDecimal(
    amount * 10 ** 18,
  );
  console.warn('MM', 'before amountNew', amountNew);
  if (amountNew?.split('.')?.length > 0) {
    amountNew = amountNew?.split('.')[0]
  }
  // Singleton.getInstance().exponentialToDecimal(amount * 10 ** 18);
  console.warn('MM', 'amountNew', amountNew);
  var priorityOrTip = await web3.eth.getMaxPriorityFeePerGas();
  console.warn('MM', 'getMaxPriorityFeePerGas', priorityOrTip);
  var block = await web3.eth.getBlock('pending');
  console.warn('MM', 'base fee', block.baseFeePerGas);
  var nonce = await web3.eth.getTransactionCount(my_address, 'latest');
  let totalgasPrice;
  if (gasPrice) {
    totalgasPrice = gasPrice
  } else {
    totalgasPrice = await web3.eth.getGasPrice();
  }

  // var totalgasPrice = `0x${(
  //   2 * parseInt(block.baseFeePerGas, 16) +
  //   parseInt(priorityOrTip, 16)
  // ).toString(16)}`;
  //console.warn('MM','totalgasPrice', `${totalgasPrice}`);
  var defaultgaslimit = 21000;
  var transactionFeeSupplied =
    parseInt(totalgasPrice, 16) * 0.000000001 * 0.000000001 * 21000;
  console.warn('MM', 'transactionFeeSupplied', transactionFeeSupplied);
  const txData = {
    data: '',
    gasLimit: web3.utils.toHex(defaultgaslimit),
    maxPriorityFeePerGas: web3.utils.toHex(priorityOrTip),
    maxFeePerGas: web3.utils.toHex(totalgasPrice),
    nonce: nonce,
    to: to_address,
    value: web3.utils.toHex(amountNew),
    chainId: constants.network == 'testnet' ? (constants.CHAIN_ID_ETH) : '0x01',
    accessList: [],
    type: '0x02',
  };
  console.warn('MM', txData, 'txData:::::::::');
  const common = new Common({
    chain: constants.network == 'testnet' ? web3.utils.toHex(constants.CHAIN_ID_ETH) : 'mainnet',
    hardfork: 'london',
  });
  const tx = FeeMarketEIP1559Transaction.fromTxData(txData, { common });
  const privateKey = Buffer.from(pvt_key.substring(2), 'hex');
  const signedTx = await tx.sign(privateKey);

  const serializedTx = signedTx.serialize();
  console.warn('MM', 'serializedTx:::::::::::::::', serializedTx.toString('hex'));
  return { signedRaw: serializedTx.toString('hex'), nonce: nonce };
};



/************************************** Generate stc nonce ************************************/
export const getStcNonce = (address) => {
  return new Promise(async (resolve, reject) => {
    try {
      let nonce = await web3Stc.eth.getTransactionCount(address, 'latest');
      console.log("nonce stc:::::", nonce);
      resolve(nonce)
    } catch (err) {
      reject(err)
    }
  })
}
export const web3fn = (coinFamily) => {

  switch (coinFamily) {
    case 1:
      return new Web3(Singleton.getInstance().ethLink)
    case 6:
      return new Web3(Singleton.getInstance().bnbLink)
    case 11:
      return new Web3(Singleton.getInstance().maticLink)
      case 4:
        return new Web3(Singleton.getInstance().stcLink)
    default:
      return new Web3(Singleton.getInstance().ethLink)
  };
}
export const createSignedNewMaticTransaction = async (
  my_address,
  to_address,
  pvt_key,
  amount,
  totalgasPrice,
  gasLimit
) => {
  console.log(
    'my_address::::::',
    my_address,
    'to_address:::::::::',
    to_address,
    'pvt_key::::::::::::::',
    pvt_key,
    'amount::::::::::::',
    amount,
    'test amount::::::::',
    Singleton.getInstance().exponentialToDecimal(amount * 10 ** 18),
    'testnetUrlMatic:::',testnetUrlMatic
  );
  const web3 = new Web3(testnetUrlMatic);
  let amountNew = Singleton.getInstance().exponentialToDecimal(amount * 10 ** 18);

  if (amountNew?.split('.')?.length > 0) {
    amountNew = amountNew?.split('.')[0]
  }
  // let block = await web3.eth.getBlock('pending');
  // console.warn('MM', 'base fee', block.baseFeePerGas);
  let nonce = await web3.eth.getTransactionCount(my_address, 'latest');
  console.log("nonce::getting:::", nonce);
  var defaultgaslimit = 21300;
  // var transactionFeeSupplied =
  //   parseInt(totalgasPrice, 16) * 0.000000001 * 0.000000001 * 21000;
  // console.warn('MM','transactionFeeSupplied', transactionFeeSupplied);
  const txData = {
    data: '0x0',
    gasLimit: (gasLimit || defaultgaslimit),
    gasPrice: totalgasPrice,
    nonce: nonce,
    to: to_address,
    value: amountNew,
    chainId: constants.network == 'testnet' ? 80001 : 137,
    from: my_address
  };
  console.warn('MM', txData, 'txData:::::::::');
  const signedTx = await web3.eth.accounts.signTransaction(txData, pvt_key);
  console.log('ser', signedTx);
  console.warn('MM', 'serializedTx:::::::::::::::', signedTx.rawTransaction.substring(2));

  // web3.eth.sendSignedTransaction(signedTx.rawTransaction).then(res1 => {
  //     console.warn('MM', '---------------res111-------------', res1);
  //     // resolve(res1);
  //     return
  //   })
  //   .catch(err => {
  //     console.warn('MM', '---------------err-------------', err);
  //     // reject(err);
  //     return
  //   });


  return { signedRaw: signedTx.rawTransaction.substring(2), nonce: nonce };


};


export const createSignedNewMaticTransactioxn = async (
  amount, toAddress, gasPriceTxn, gasLimitTxn, chainID, fromAddress

) => {
  return new Promise((resolve, reject) => {
    Singleton.getInstance().getData(`${fromAddress}_pk`).then((pvtKey) => {
      let data = { wallet_address: fromAddress }
      Singleton.getInstance().getData(Constants.ACCESS_TOKEN).then(access_token => {
        console.log("access_token::::", access_token);
        APIClient.getInstance().post(NONCE_Matic_API, data, access_token).then(response => {
          console.log("Nonce_MATIC::::", response);
          let nonce = response?.data;
          let amountToSend = Web3.utils.toWei(amount, 'ether',);
          const rawTxn = {
            nonce: nonce,
            gasPrice: gasPriceTxn,
            gasLimit: (gasLimitTxn + 300),
            to: toAddress,
            value: amountToSend,
            from: fromAddress,
            data: '0x0',
            chainId: chainID
          }
          web3Matic.eth.accounts.signTransaction(rawTxn, pvtKey).then(res => {
            let txtData = { "raw": res.rawTransaction.substring(2), "nonce": nonce }
            resolve(txtData);
          }).catch(err => {
            console.log("ERROR_GENERATING_SIGNED_RAW_MATIC--->", err)
            reject(err);
          })
        }).catch(err => {
          console.log("ERROR_GETTING_NONCE_MATIC_API--->", err)
          reject(err)
        })
      }).catch(err => {
        console.log("ERROR_FETCHING_ACCESS_TOKEN--->", err)
        reject(err)
      })
    }).catch((err) => {
      console.log("ERROR_FETCHING_MATIC_PVTK--->", err)
      reject(err);
    });
  });
}
/************************************** Get ETH base Fee *************************************/
export const getEthBaseFee = async () => {
  //console.warn('MM','>>>>>>>>testnetUrlEth',constants.mainnetInfuraLink)
  const web3 = createAlchemyWeb3(testnetUrlEth);
  var block = await web3.eth.getBlock('pending');
  console.log("web3.utils.hexToNumberString(block.baseFeePerGas),", web3.utils.hexToNumberString(block.baseFeePerGas));
  return web3.utils.hexToNumberString(block.baseFeePerGas);
};
export const getMaticBaseFee = async () => {
  // //console.warn('MM','>>>>>>>>testnetUrlMatic',constants.mainnetInfuraLink)
  const web3 = createAlchemyWeb3(testnetUrlMatic);
  var block = await web3.eth.getBlock('pending');
  return web3.utils.hexToNumberString(block.baseFeePerGas);
};

/************************************** Get ETH Fee *****************************************/
export const getTotalGasFee = async () => {
  const web3 = createAlchemyWeb3(testnetUrlEth);
  const gasPrice = await web3.eth.getGasPrice();
  console.log("gasPrice::<<<<<LL", gasPrice);
  return gasPrice;
};
export const getTotalGasFeeMatic = async () => {
  const web3 = createAlchemyWeb3(testnetUrlMatic);
  console.warn('MM', 'getTotalGasFeeMatic entered');
  const gasPrice = await web3.eth.getGasPrice();
  console.warn('MM', 'getTotalGasFeeMatic', gasPrice);
  return gasPrice;
};

/************************************** Generate ERC-20 signed raw ************************************/

export const createSignedNewEthTokenTransaction = async (
  my_address,
  to_address,
  pvt_key,
  amount,
  gasLimit,
  data,
  gasPrice
) => {
  console.log(
    'my_address::::::',
    my_address,
    'to_address:::::::::',
    to_address,
    'pvt_key::::::::::::::',
    pvt_key.toUpperCase(),
    'amount::::::::::::',
    amount,
    'test amount::::::::',
    Singleton.getInstance().exponentialToDecimal(amount * 10 ** 18),
  );

  const web3 = createAlchemyWeb3(testnetUrlEth);
  var priorityOrTip = await web3.eth.getMaxPriorityFeePerGas();
  console.warn('MM', 'getMaxPriorityFeePerGas', priorityOrTip);
  var block = await web3.eth.getBlock('pending');
  console.warn('MM', 'base fee', block.baseFeePerGas);
  var nonce = await web3.eth.getTransactionCount(my_address, 'latest');

  var totalgasPrice;
  if (gasPrice) {
    totalgasPrice = gasPrice
  } else {
    totalgasPrice = await web3.eth.getGasPrice();

  }
  // var totalgasPrice = `0x${(
  //   2 * parseInt(block.baseFeePerGas, 16) +
  //   parseInt(priorityOrTip, 16)
  // ).toString(16)}`;
  //console.warn('MM','totalgasPrice', `${totalgasPrice}`);
  var defaultgaslimit = gasLimit;
  var transactionFeeSupplied =
    parseInt(totalgasPrice, 16) * 0.000000001 * 0.000000001 * 21000;
  console.warn('MM', 'transactionFeeSupplied', transactionFeeSupplied);
  const txData = {
    data: data,
    gasLimit: web3.utils.toHex(defaultgaslimit),
    maxPriorityFeePerGas: web3.utils.toHex(priorityOrTip),
    maxFeePerGas: web3.utils.toHex(totalgasPrice),
    nonce: nonce,
    to: to_address,
    value: '0x0',
    chainId: constants.network == 'testnet' ? web3.utils.toHex(constants.CHAIN_ID_ETH) : '0x01',
    accessList: [],
    type: '0x02',
  };
  console.warn('MM', 'chk txnData::::::::', txData);
  const common = new Common({
    chain: constants.network == 'testnet' ? constants.NETWORK_NAME_ETH_TESTNET : 'mainnet',
    hardfork: 'london',
  });
  const tx = FeeMarketEIP1559Transaction.fromTxData(txData, { common });
  const privateKey = Buffer.from(pvt_key.substring(2), 'hex');
  const signedTx = await tx.sign(privateKey);

  const serializedTx = signedTx.serialize();
  //console.warn('MM','serializedTx:::::::::::::::', serializedTx.toString('hex'));
  return { signedRaw: serializedTx.toString('hex'), nonce: nonce };
};
export const createSignedNewMaticTokenTransaction = async (
  my_address,
  to_address,
  pvt_key,
  amount,
  gasLimit,
  data,
) => {
  ////console.log(
  // 'my_address::::::',
  //   my_address,
  //   'to_address:::::::::',
  //   to_address,
  //   'pvt_key::::::::::::::',
  //   pvt_key.toUpperCase(),
  //   'amount::::::::::::',
  //   amount,
  //   'test amount::::::::',
  //   Singleton.getInstance().exponentialToDecimal(amount * 10 ** 18),
  // );

  const web3 = createAlchemyWeb3(testnetUrlMatic);
  var priorityOrTip = await web3.eth.getMaxPriorityFeePerGas();
  //console.warn('MM','getMaxPriorityFeePerGas', priorityOrTip);
  var block = await web3.eth.getBlock('pending');
  //console.warn('MM','base fee', block.baseFeePerGas);
  var nonce = await web3.eth.getTransactionCount(my_address, 'latest');
  var totalgasPrice = await web3.eth.getGasPrice();
  // var totalgasPrice = `0x${(
  //   2 * parseInt(block.baseFeePerGas, 16) +
  //   parseInt(priorityOrTip, 16)
  // ).toString(16)}`;
  //console.warn('MM','totalgasPrice', `${totalgasPrice}`);
  var defaultgaslimit = gasLimit;
  var transactionFeeSupplied =
    parseInt(totalgasPrice, 16) * 0.000000001 * 0.000000001 * 21000;
  //console.warn('MM','transactionFeeSupplied', transactionFeeSupplied);
  const txData = {
    data: data,
    gasLimit: web3.utils.toHex(defaultgaslimit),
    maxPriorityFeePerGas: web3.utils.toHex(priorityOrTip),
    maxFeePerGas: web3.utils.toHex(totalgasPrice),
    nonce: nonce,
    to: to_address,
    value: '0x0',
    chainId:
      constants.network == 'testnet'
        ? web3.utils.toHex(80001)
        : web3.utils.toHex(137),
    accessList: [],
  };
  //console.warn('MM','chk txnData::::::::', txData);
  // const common = new Common({
  //   chain: constants.network == 'testnet' ? 'goerli' : 'mainnet',
  //   hardfork: 'london',
  // });
  const tx = FeeMarketEIP1559Transaction.fromTxData(txData);
  const privateKey = Buffer.from(pvt_key.substring(2), 'hex');
  const signedTx = await tx.sign(privateKey);

  const serializedTx = signedTx.serialize();
  //console.warn('MM','serializedTx:::::::::::::::', serializedTx.toString('hex'));
  return { signedRaw: serializedTx.toString('hex'), nonce: nonce };
};

/************************************** Generate ETH Wallet ************************************/
// export const generateEthWallet = mnemonics => {
//   const wallet = Wallet.fromMnemonic(mnemonics);
//   // console.warn('MM','generateEthWallet =>', wallet);
//   return wallet;
// };
export const generateEthWallet = async (mnemonics) => {
  // const wallet = Wallet.fromMnemonic(mnemonics);
  const seed = await mnemonicToSeed(mnemonics);
  const hdNode = HDNode._fromSeed(seed);
  const wallet = hdNode.derivePath(`m/44'/60'/0'/0/0`);
  // console.log("generateEthWallet =>", wallet);
  return wallet;
};
// sock hero wrist multiply entry parrot palace risk current type leader little
/************************************** Generate bep-20 data encode *****************************************/

export const bnbDataEncode = async (tokenAdrs, toAdrs, amountSent) => {
  var amountToSend = amountSent
  console.log("urlBnb:::::", urlBnb);
  const web3BNB = new Web3(
    urlBnb
  );
  console.warn('MM', '----------------------- tokenAdrs ', tokenAdrs);
  console.warn('MM', '----------------------- toAdrs ', toAdrs);
  console.warn('MM', '----------------------- amountSent ', amountToSend);
  var contract = await new web3BNB.eth.Contract(idaAbi, tokenAdrs);
  console.warn('MM', '----------------------- dataEncoded ', dataEncoded);
  let dataEncoded = await contract.methods
    .transfer(toAdrs, amountToSend.toString())
    .encodeABI();
  console.warn('MM', '----------------------- dataEncoded ', dataEncoded);
  return dataEncoded;
};
/************************************** Generate stc erc-20 data encode *****************************************/

export const stcDataEncode = async (tokenAdrs, toAdrs, amountSent) => {
  var amountToSend = amountSent
  console.log("urlBnb:::::", urlBnb);
  const web3Stc = new Web3(
    stcRPCURL
  );
  console.warn('MM', '----------------------- tokenAdrs ', tokenAdrs);
  console.warn('MM', '----------------------- toAdrs ', toAdrs);
  console.warn('MM', '----------------------- amountSent ', amountToSend);
  var contract = await new web3Stc.eth.Contract(idaAbi, tokenAdrs);
  console.warn('MM', '----------------------- dataEncoded ', dataEncoded);
  let dataEncoded = await contract.methods
    .transfer(toAdrs, amountToSend.toString())
    .encodeABI();
  console.warn('MM', '----------------------- dataEncoded ', dataEncoded);
  return dataEncoded;
};
// ************************************** Generate BEP-20 signed raw *****************************************

export const sendTokenBNB = async (
  toAddress,
  encodeData,
  nonce,
  gasPriceTxn,
  gasLimitTxn,
  chainID,
  pvtKey,
  value,
) => {
  return new Promise((resolve, reject) => {
    console.log("urlBnb:::::", urlBnb);
    const web3BNB = new Web3(
      urlBnb
    );
    const rawTransaction = {
      nonce: nonce,
      gasPrice: gasPriceTxn,
      gasLimit: gasLimitTxn,
      to: toAddress,
      value: value ? value : '',
      from: Singleton.getInstance().defaultBnbAddress,
      data: encodeData,
      chainId: chainID,
    };
    //console.warn('MM',encodeData, '---encodeData---');
    // console.warn('MM','RAW_DATA=====', rawTransaction, '\npvtKey::::::', pvtKey);
    web3BNB.eth.accounts
      .signTransaction(rawTransaction, pvtKey)
      .then(res => {
        // console.warn('MM','------------raw txn-----------', res.rawTransaction);
        resolve(res.rawTransaction.slice(2));
      })
      .catch(error => {
        reject(error);
      });
  });
};
// ************************************** Generate STC ERC-20 signed raw *****************************************

export const sendTokenSTC = async (
  toAddress,
  encodeData,
  nonce,
  gasPriceTxn,
  gasLimitTxn,
  chainID,
  pvtKey,
  value,
) => {
  return new Promise((resolve, reject) => {
    console.log("urlBnb:::::", stcRPCURL);
    const web3Stc = new Web3(
      stcRPCURL
    );
    const rawTransaction = {
      nonce: nonce,
      gasPrice: gasPriceTxn,
      gasLimit: gasLimitTxn,
      to: toAddress,
      value: value ? value : '',
      from: Singleton.getInstance().defaultStcAddress,
      data: encodeData,
      chainId: chainID,
    };
    //console.warn('MM',encodeData, '---encodeData---');
    console.warn('MM','RAW_DATA=====', rawTransaction, '\npvtKey::::::', pvtKey);
    web3Stc.eth.accounts
      .signTransaction(rawTransaction, pvtKey)
      .then(res => {
        // console.warn('MM','------------raw txn-----------', res.rawTransaction);
        resolve(res.rawTransaction.slice(2));
      })
      .catch(error => {
        reject(error);
      });
  });
};
// ************************************** Generate BNB signed raw *****************************************

export const getBnbRaw = async (
  amount,
  toAddress,
  nonce,
  gasPriceTxn,
  gasLimitTxn,
  chainID,
  pvtKey,
) => {
  console.log("urlBnb:::::", urlBnb);
  const web3BNB = new Web3(
    urlBnb
  );
  var amountToSend = web3BNB.utils.toWei(amount, 'ether');
  console.warn('MM', amount + 'klsdjnfklnsd  bnb' + '-----chainID', chainID);
  console.warn('MM', 'in send bnb');
  console.warn('MM', Singleton.getInstance().defaultBnbAddress);
  return new Promise((resolve, reject) => {
    const web3BNB = new Web3(
      urlBnb
    );
    try {
      // let amountToSend = web3BNB.utils.toWei(amount, "ether");
      console.warn('MM', 'in send bnb');
      const rawTxn = {
        nonce: nonce,
        gasPrice: gasPriceTxn,
        gasLimit: gasLimitTxn + 100,
        to: toAddress,
        value: amountToSend,
        from: Singleton.getInstance().defaultBnbAddress,
        data: '0x0',
      };
      console.log("urlBnb:::::", urlBnb);
      const web3BNB = new Web3(
        urlBnb
      );
      console.warn('MM', 'RAW-----', rawTxn);
      web3BNB.eth.accounts.signTransaction(rawTxn, pvtKey).then(res => {
        ////console.log(
        // '------------raw txn-----------',
        //   res.rawTransaction.slice(2),
        //     );
        console.warn('MM', '------------raw txn-----------nonce', nonce);
        resolve(res.rawTransaction.slice(2));
      });
    } catch (e) {
      console.log("error:::", e);
    }

  });
};

// ************************************** Generate Stc signed raw *****************************************

export const getStcRaw = async (
  amount,
  toAddress,
  nonce,
  gasPriceTxn,
  gasLimitTxn,
  chainID,
  pvtKey,
) => {
  console.log("urlstcRPCURL:::::", stcRPCURL);
  const web3STC = new Web3(
    stcRPCURL
  );
  var amountToSend = web3STC.utils.toWei(amount, 'ether');
  console.warn('MM', amount + 'klsdjnfklnsd  stc' + '-----chainID', chainID);
  console.warn('MM', 'in send stc');
  console.warn('MM', Singleton.getInstance().defaultStcAddress);
  return new Promise((resolve, reject) => {
    try {
      
      console.warn('MM', 'in send bnb');
      const rawTxn = {
        nonce: nonce,
        gasPrice:gasPriceTxn,
        gasLimit: Web3.utils.toHex(exponentialToDecimalWithoutComma(gasLimitTxn)),
        to: toAddress,
        value: Web3.utils.toHex(exponentialToDecimalWithoutComma(amountToSend)),
        from: Singleton.getInstance().defaultBnbAddress,
        data: '0x0',
      };
      console.warn('MM', 'rawTxn',rawTxn);
      console.log("urlStc:::::", stcRPCURL);
      const web3STC = new Web3(
        stcRPCURL
      );
      console.warn('MM', 'RAW-----', rawTxn);
      web3STC.eth.accounts.signTransaction(rawTxn, pvtKey).then(res => {
        console.warn('MM', '------------raw txn-----------nonce', nonce);
        resolve(res.rawTransaction.slice(2));
      }).catch(err=>{
        console.warn('MM', '------------raw txn-----------err', err);
        reject(err)
      })
    } catch (e) {
      console.log("error:::", e);
    }

  });
};
// ****************************************** validateMnemonics ***********************************************
export const validateMnemonics = mnemonics => {
  return new Promise((resolve, reject) => {
    const wallet = Wallet.fromMnemonic(mnemonics);
    if (wallet.address) {
      resolve(true);
    } else {
      reject('Enter valid  Mnemonics');
    }
  });
};

// ***DAPPS DATA///////////////////////////////////////////////////////////////////

/************************************** Get ETH Fee *****************************************/
export const getTotalGasFeeDapp = async () => {
  const web3 = createAlchemyWeb3(testnetUrlEth);
  const gasPrice = await web3.eth.getGasPrice();
  return gasPrice;
};
/************************************************************ */
export const getPriorityDapp = async my_address => {
  const web3 = createAlchemyWeb3(testnetUrlEth);
  var priorityOrTip = await web3.eth.getMaxPriorityFeePerGas();
  //console.warn('MM','getMaxPriorityFeePerGas', priorityOrTip);
  return priorityOrTip;
};
/************************************************************ */
export const getNonceValueDapp = async my_address => {
  const web3 = createAlchemyWeb3(testnetUrlEthDapp);
  var nonce = await web3.eth.getTransactionCount(my_address, 'latest');
  return nonce;
};

/************************************** Get ETH base Fee *************************************/
export const getEthBaseFeeDapp = async () => {
  const web3 = createAlchemyWeb3(testnetUrlEthDapp);
  var block = await web3.eth.getBlock('pending');
  return web3.utils.hexToNumberString(block.baseFeePerGas);
};

/************************************ Genrate eth dapp signed raw ****************************************************** */

export const getDappSignedTxn = async (
  pKey,
  toAmount,
  gas_gwei_price,
  gas_estimate,
  nonce,
  toAddress,
  myAddress,
  data,
  symbol,
  priorityFees,
) => {
  var gasPrice = gas_gwei_price;
  var gasLimit = gas_estimate;
  //console.warn('MM','chk gasPrice:::::', gasPrice);
  //console.warn('MM','chk priorityFees:::::', priorityFees);
  const web3 = createAlchemyWeb3(testnetUrlEth);
  var block = await web3.eth.getBlock('pending');
  //console.warn('MM','base fee', block.baseFeePerGas);
  var nonce = await web3.eth.getTransactionCount(myAddress, 'latest');
  var totalgasPrice = await web3.eth.getGasPrice(); //`0x${(2 * parseInt(block.baseFeePerGas, 16) + parseInt(priorityFees, 16)).toString(16)}`;
  const rawTransaction = {
    data: data,
    gasLimit: web3.utils.toHex(gasLimit),
    maxPriorityFeePerGas: web3.utils.toHex(priorityFees),
    maxFeePerGas: web3.utils.toHex(totalgasPrice),
    nonce: nonce,
    to: toAddress,
    value: toAmount,
    chainId: constants.network == 'testnet' ? web3.utils.toHex(constants.CHAIN_ID_ETH) : '0x01',
    accessList: [],
    type: '0x02',
  };

  console.warn('MM','RAW__------', rawTransaction);
  //console.warn('MM','PRIVATE------', pKey);

  const common = new Common({
    chain: constants.network == 'testnet' ? constants.NETWORK_NAME_ETH_TESTNET : 'mainnet',
    hardfork: 'london',
  });
  const tx = FeeMarketEIP1559Transaction.fromTxData(rawTransaction, { common });
  const privateKey = Buffer.from(pKey.substring(2), 'hex');
  const signedTx = tx.sign(privateKey);

  const serializedTx = signedTx.serialize();
  //console.warn('MM','serializedTx:::::::::::::::', serializedTx.toString('hex'));
  return serializedTx.toString('hex');
};

/************************************ Genrate bnb dapp signed raw ****************************************************** */
export const getsignRawTxnDappBnb = async (
  pKey,
  toAmount,
  gas_gwei_price,
  gas_estimate,
  nonce,
  toAddress,
  myAddress,
  data,
  chainId,
) => {
  console.log("urlBnb:::::", urlBnb);
  const web3BNB = new Web3(
    urlBnb
  );
  //console.warn('MM','this.props.toAmount', toAmount);
  var amountToSend = web3BNB.utils.toWei(toAmount ? toAmount : '0', 'ether');
  //console.warn('MM','amountToSend', amountToSend);
  var amount = web3BNB.utils.toHex(amountToSend);
  return new Promise((resolve, reject) => {
    const rawTransaction = {
      nonce: nonce,
      gasPrice: web3BNB.utils.toHex(gas_gwei_price),
      gasLimit: web3BNB.utils.toHex(gas_estimate),
      to: toAddress,
      value: amount ? amount : '0x0',
      from: myAddress,
      data: data,
      chainId: chainId,
    };
    //console.warn('MM','RAW-----', rawTransaction);
    web3BNB.eth.accounts
      .signTransaction(rawTransaction, pKey)
      .then(res => {
        ////console.log(
        // '------------raw txn-----------',
        //   res.rawTransaction.slice(2),
        // );
        //console.warn('MM','------------raw txn-----------nonce', nonce);
        resolve(res.rawTransaction.slice(2));
      })
      .catch(error => {
        Singleton.showAlert('' + error);
        reject(error);
      });
  });
};
/************************************ Genrate stc dapp signed raw ****************************************************** */
export const getsignRawTxnDappStc = async (
  pKey,
  toAmount,
  gas_gwei_price,
  gas_estimate,
  nonce,
  toAddress,
  myAddress,
  data,
  chainId,
) => {
  console.log("urlStc:::::", stcRPCURL);
  const web3Stc = new Web3(
    stcRPCURL
  );
  //console.warn('MM','this.props.toAmount', toAmount);
  console.warn('MM','amountToSend', exponentialToDecimalWithoutComma(toAmount))
  var amountToSend = web3Stc.utils.toWei(toAmount ? exponentialToDecimalWithoutComma(toAmount) : '0', 'ether');
  console.log('data>>>>>>',web3Stc);
  var amount = web3Stc.utils.toHex(amountToSend);
  return new Promise((resolve, reject) => {
    const rawTransaction = {
      nonce: nonce,
      gasPrice: web3Stc.utils.toHex(gas_gwei_price),
      gasLimit: web3Stc.utils.toHex(gas_estimate),
      to: toAddress,
      value: amount ? amount : '0x0',
      from: myAddress,
      data: data,
      chainId: chainId,
    };
    console.warn('MM','RAW-----', rawTransaction);
    web3Stc.eth.accounts
      .signTransaction(rawTransaction, pKey)
      .then(res => {
        console.log(
        '------------raw txn-----------',
          res.rawTransaction.slice(2),
        );
        console.warn('MM','------------raw txn-----------nonce', nonce);
        resolve(res.rawTransaction.slice(2));
      })
      .catch(error => {
        Singleton.showAlert('' + error);
        reject(error);
      });
  });
};
/************************************ Genrate matic dapp signed raw ****************************************************** */
export const getsignRawTxnDappMatic = async (
  pKey,
  toAmount,
  gas_gwei_price,
  gas_estimate,
  nonce,
  toAddress,
  myAddress,
  data,
  chainId,
) => {
  //console.log('this.props.toAmount', toAmount);
  let web3 = new Web3(constants.network == 'testnet' ? constants.testnetMatic : Singleton.getInstance().maticLink)
  var amountToSend = web3.utils.toWei(toAmount ? toAmount : '0', 'ether');
  //console.log('amountToSend', amountToSend);
  var amount = web3.utils.toHex(amountToSend);
  return new Promise((resolve, reject) => {
    const rawTransaction = {
      nonce: nonce,
      gasPrice: web3.utils.toHex(gas_gwei_price),
      gasLimit: web3.utils.toHex(gas_estimate),
      to: toAddress,
      value: amount ? amount : '0x0',
      from: myAddress,
      data: data,
      chainId: chainId,
    };
    //console.log('RAW-----', rawTransaction);
    web3.eth.accounts
      .signTransaction(rawTransaction, pKey)
      .then(res => {
        //console.log(
        // '------------raw txn-----------',
        //   res.rawTransaction.slice(2),
        // );
        //console.log('------------raw txn-----------nonce', nonce);
        resolve(res.rawTransaction.slice(2));
      })
      .catch(error => {
        Singleton.showAlert('' + error);
        reject(error);
      });
  });
};

export const validateEmail = email => {
  var re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

export const exponentialToDecimalWithoutComma = (exponential,show) => {
  show && console.log("exponential:::::::>>>>>>>",exponential);
  let decimal = exponential?.toString()?.toLowerCase();
  if (decimal?.includes("e+")) {
    const exponentialSplitted = decimal?.split("e+");
    let postfix = "";
    for (
      let i = 0;
      i <
      +exponentialSplitted[1] -
      (exponentialSplitted[0].includes(".")
        ? exponentialSplitted[0].split(".")[1].length
        : 0);
      i++
    ) {
      postfix += "0";
    }
    const addCommas = (text) => {
      let j = 3;
      let textLength = text?.length;
      while (j < textLength) {
        text = `${text.slice(0, textLength - j)}${text.slice(
          textLength - j,
          textLength
        )}`;
        textLength++;
        j += 3 + 1;
      }
      return text;
    };
    decimal = addCommas(exponentialSplitted[0]?.replace(".", "") + postfix);
  }
  if (decimal?.toLowerCase()?.includes("e-")) {
    const exponentialSplitted = decimal?.split("e-");
    let prefix = "0.";
    for (let i = 0; i < +exponentialSplitted[1] - 1; i++) {
      prefix += "0";
    }
    decimal = prefix + exponentialSplitted[0].replace(".", "");
  }
  return decimal;
};

export const preventScreenShot = (value) => {
  const { RootModule } = NativeModules;
  RootModule.preventScreenshot(value)
}

export const storageKeys = [
  constants.device_token,
  constants.IS_THEME_ENABLE,
  constants.CURRENT_THEME_MODE,
  constants.withoutTokenList,
  constants.ENABLE_PIN,
  constants.LangauageIndex,
  constants.Langauage,
  constants.PIN,
  constants.ENABLE_PIN,
  constants.access_token,
  constants.USER_NAME,
  constants.GRADIENT_COLOR,
  constants.CURRENCY_SELECTED,
  constants.CURRENCY_SYMBOL,
  constants.IS_LOGIN,
  constants.login_data,
  constants.multi_wallet_array,
  constants.addresKeyList,
  constants.coinFamilyKeys,
  constants.access_token_cards,
  constants.refresh_token_cards,
  constants.isLoginCard,
  constants.black_access_token,
  constants.diamond_access_token,
  constants.gold_access_token,
  constants.SOCIAL_LINKS,
  constants.BUTTON_THEME,
  constants.HOT_LIST,
  constants.DAPP_LIST,
  constants.FINANCE_LIST,
  constants.ACTIVE_WALLET,
  constants.WALLET_LIST,
]

/************************************* Generate ETH signed raw ***********************************/

export const signWalletConnectTxn = async (
  pvt_key,
  my_address,
  to_address,
  gasPrice,
  gasLimit,
  amount,
  dataEncoded,
  nonce,
  coin_symbol,
  estimateGas,
) => {
  console.log(
    'my_address::::::',
    my_address,
    'to_address:::::::::',
    to_address,
    'pvt_key::::::::::::::',
    pvt_key.toUpperCase(),
    'amount::::::::::::',
    amount,
    'test amount::::::::',
  );
  const web3 = createAlchemyWeb3(testnetUrlEth);
  let amountNew = exponentialToDecimalWithoutComma(amount);
  var priorityOrTip = await web3.eth.getMaxPriorityFeePerGas();
  console.log('getMaxPriorityFeePerGas', priorityOrTip);
  var block = await web3.eth.getBlock('pending');
  console.log('base fee', block.baseFeePerGas);
  var nonce = await web3.eth.getTransactionCount(my_address, 'latest');
  var totalgasPrice = `0x${(
    2 * parseInt(block.baseFeePerGas, 16) +
    parseInt(priorityOrTip, 16)
  ).toString(16)}`;
  console.log('totalgasPrice', `${totalgasPrice}`);

  const txData = {
    data: dataEncoded,
    gasLimit: web3.utils.toHex(estimateGas),
    maxPriorityFeePerGas: priorityOrTip,
    maxFeePerGas: gasPrice,
    nonce: nonce,
    to: to_address,
    value: web3.utils.toHex(amountNew),
    chainId: constants.network == 'testnet' ? '0x05' : '0x01',
    accessList: [],
    type: '0x02',
  };
  console.log('txData::::', txData);
  const common = new Common({
    chain: constants.network == 'testnet' ? constants.NETWORK_NAME_ETH_TESTNET : 'mainnet',
    hardfork: 'london',
  });
  const tx = FeeMarketEIP1559Transaction.fromTxData(txData, { common });
  const privateKey = pvt_key.includes('0x')
    ? Buffer.from(pvt_key.substring(2), 'hex')
    : Buffer.from(pvt_key, 'hex');
  const signedTx = await tx.sign(privateKey);

  const serializedTx = signedTx.serialize();
  console.log('serializedTx:::::::::::::::', serializedTx.toString('hex'));
  return { signedRaw: serializedTx.toString('hex'), nonce: nonce };
};
/************************************* Generate Matic signed raw ***********************************/

export const signWalletConnectTxnMatic = async (
  pvt_key,
  my_address,
  to_address,
  gasPrice,
  gasLimit,
  amount,
  dataEncoded,
  nonce,
  coin_symbol,
  estimateGas,
) => {
  // console.log(
  //   'my_address::::::',
  //   my_address,
  //   'to_address:::::::::',
  //   to_address,
  //   'pvt_key::::::::::::::',
  //   pvt_key.toUpperCase(),
  //   'amount::::::::::::',
  //   amount,
  //   'test amount::::::::',
  // );
  const web3 = createAlchemyWeb3(Singleton.getInstance().maticLink);
  let amountNew = exponentialToDecimalWithoutComma(amount);
  var priorityOrTip = await web3.eth.getMaxPriorityFeePerGas();
  //console.log('getMaxPriorityFeePerGas', priorityOrTip);
  // var block = await web3.eth.getBlock('pending');
  //console.log('base fee', block.baseFeePerGas);
  var nonce = await web3.eth.getTransactionCount(my_address, 'latest');
  // var totalgasPrice = `0x${(
  //   2 * parseInt(block.baseFeePerGas, 16) +
  //   parseInt(priorityOrTip, 16)
  // ).toString(16)}`;
  //console.log('totalgasPrice', `${totalgasPrice}`);
  // var defaultgaslimit = 21000;
  // var transactionFeeSupplied = parseInt(totalgasPrice, 16); // 0.000000001  0.000000001 * 21000;
  //console.log('transactionFeeSupplied', transactionFeeSupplied);
  const txData = {
    data: dataEncoded,
    gasLimit: web3.utils.toHex(estimateGas),
    maxPriorityFeePerGas: priorityOrTip,
    maxFeePerGas: gasPrice,
    nonce: nonce,
    to: to_address,
    value: web3.utils.toHex(amountNew),

    chainId:
      constants.network == 'testnet'
        ? web3.utils.toHex(80001)
        : web3.utils.toHex(137),
    accessList: [],
    // type: '0x02',
  };
  //console.log('txData::::', txData);
  // const common = new Common({
  //   chain: constants.network == 'testnet' ? constants.NETWORK_NAME_ETH_TESTNET : 'mainnet',
  //   hardfork: 'london',
  // });
  const tx = FeeMarketEIP1559Transaction.fromTxData(txData);
  const privateKey = pvt_key.includes('0x')
    ? Buffer.from(pvt_key.substring(2), 'hex')
    : Buffer.from(pvt_key, 'hex');
  const signedTx = await tx.sign(privateKey);

  const serializedTx = signedTx.serialize();
  //console.log('serializedTx:::::::::::::::', serializedTx.toString('hex'));
  return { signedRaw: serializedTx.toString('hex'), nonce: nonce };
};









export const createOrderForSaitaCard = (data, token) => {

  return new Promise((resolve, reject) => {

    APIClient.getInstance().postTokenCards(API_CARD_EPAY_CREATE_ORDER, data, token)
      .then(res => {

        return resolve(res)
      }).catch(err => {
        return reject(err)
      })


  })

}

export const createOrderForSaitaCard_Binance = (req, token) => {

  return new Promise((resolve, reject) => {

    //  let req = {

    //     env: {
    //       terminalType: 'APP',
    //     },

    //     // card_table_id: cardId,
    //     description: 'Saitapro Card',
    //     goodsDetails: [
    //       {
    //         goodsType: '01',
    //         goodsCategory: 'D000',
    //         referenceGoodsId: '7876763A3B',
    //         goodsName: 'Saitapro Card',
    //         goodsDetail: 'Saitapro Card',
    //       },
    //     ],
    //     // bnb_pay_order_type:bnb_pay_order_type

    //   };


    APIClient.getInstance().postTokenCards(API_CARD_BINANCE_CREATE_ORDER, req, token)
      .then(res => {

        return resolve(res)
      }).catch(err => {
        return reject(err)
      })


  })
}


export const MyThemeTester = () => {
  ThemeManager.getLanguage() == 'theme1' ?
    ThemeManager.setLanguage('theme2') :
    ThemeManager.setLanguage('theme1')
}

export const calculatePercentage = (percentage, balance) => {
  console.log("percentage::::::", percentage, "balance:::::::", BigNumber(exponentialToDecimalWithoutComma(balance)));
  let result = parseFloat((percentage / 100) * balance)
  console.log("result", result);
  return result
}

export const signPersonalMessage = async (data, pKey, coinFamily) => {
  return new Promise(async (resolve, reject) => {
    try {
      const web3 = await web3fn(coinFamily)
      const signature = web3.eth.accounts.sign(data, pKey);
      resolve(signature?.signature);
    } catch (err) {
      reject(err);
    }
  });
};

export function bigNumberSafeMath(c, operation, d) {
  if (c == '.') {
    c = 0
  }
  if (d == '.') {
    d = 0
  }
  BigNumber.config({ DECIMAL_PLACES: 18 });
  let a = new BigNumber(c?.toString());
  let b = new BigNumber(typeof d === "number" ? d?.toString() : d?.toString());
  let rtn;
  console.log("fghsgh>>>>>>", a?.multipliedBy(b)?.toString(), a, b);
  // Figure out which operation to perform.
  switch (operation.toLowerCase()) {
    case "-":
      rtn = a.minus(b);
      break;
    case "+":
      rtn = a.plus(b);
      break;
    case "*":
      rtn = a.multipliedBy(b);
      break;
    case "x":
      rtn = a.multipliedBy(b);
      break;
    case "÷":
      rtn = a.dividedBy(b);
      break;
    case "/":
      rtn = a.dividedBy(b);
      break;
    default:
      //operator = operation;
      break;
  }
  console.log("c:::", c, "operation::", operation, "d::", d, "rtn::;", exponentialToDecimalWithoutComma(rtn));
  return exponentialToDecimalWithoutComma(rtn);
}
export const addTrailingZeros = (num, numZeros) => {
  let newNum = num?.toString()
  if (num?.toString()?.includes('.')) {
    let decimalNums = num?.toString()?.split('.')[1]

    if (decimalNums?.length < numZeros) {
      while (newNum.toString().split('.')[1].length < numZeros) {
        newNum = newNum + '0'
      }

    }
  } else {
    newNum = newNum + '.'
    console.log(newNum?.toString()?.split('.')[1]?.length)
    while (newNum.toString().split('.')[1].length != numZeros) {
      newNum = newNum + '0'
    }
  }
  return newNum
}
const faceIdPermission = Platform.select({
  ios: PERMISSIONS.IOS.FACE_ID,
});
export const testCheckPermission = async () => {
  // Throws if face id is locked out
  return await check(faceIdPermission);
};

export const showSuccess = (message, description) => {
  showMessage({
    message,
    description,
    type: 'success',
    floating: true,
    icon: 'success',
  });
};
export const showError = (message, description) => {
  showMessage({
    message,
    description,
    type: 'danger',
    floating: true,
    icon: 'auto',
  });
};
/************************************************** exponentialToDecimal ***************************************************/
export const exponentialToDecimal = (exponential) => {
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
/************************************************** toFixedExp **************************************************************/
export function toFixedExp(num, fixed) {
  if (num) {
    num = exponentialToDecimal(num);
    let re = new RegExp('^-?\\d+(?:.\\d{0,' + (fixed || -1) + '})?');
    return num?.toString()?.match(re)?.[0];
  }
  else return '0.00';
}
export const decryptionCard = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const key = new NodeRSA(constants.CARD_PVT_KEY);
      key.setOptions({ encryptionScheme: "pkcs1" });
      const decrypted = await key.decrypt(data,'utf8');
      let originalText = decrypted
      console.log("originalText:::", originalText);
      resolve(originalText);
    } catch (err) {
      console.log("errr:::::", err)
      reject(err)
    }
  })
};