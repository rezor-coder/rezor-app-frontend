import Singleton from '../../../Singleton';
import Web3 from 'web3';
import * as constants from '../../../Constant';
import {getSwapListAll} from '../../../Redux/Actions';
import TOKEN_ABI from '../../../../ABI/tokenContract.ABI.json';
import {
  bigNumberSafeMath,
  exponentialToDecimalWithoutComma,
} from '../../../utils';
import {IS_PRODUCTION} from '../../../Endpoints';
import {APIClient} from '../../../Api';
const limit = 20;
const GAS_PRICE_EXTRA_BUFFER = 2000000000;

export const getWeb3Object = (chain, tokenFirst) => {
  console.log('chain:::::', chain, Singleton.getInstance().ethLink);
  let network;
  console.log('');
  if (chain) {
    if (chain === constants.COIN_SYMBOL.ETH) {
      network = new Web3(
        constants.network === 'testnet'
          ? constants.testnetEth
          : Singleton.getInstance().ethLink,
      );
    } else if (chain === constants.COIN_SYMBOL.STC) {
      console.log('stc:::::getWeb3Object:');
      network = new Web3(Singleton.getInstance().stcLink);
    } else {
      console.warn('MM', 'networkkk getWeb3Object bnb');
      network = new Web3(
        constants.network === 'testnet'
          ? constants.testnetBnb
          : Singleton.getInstance().bnbLink,
      );
    }
  } else {
    if (tokenFirst?.coin_family === 1) {
      console.log('eth:::::getWeb3Object:');
      network = new Web3(
        constants.network === 'testnet'
          ? constants.testnetEth
          : Singleton.getInstance().ethLink,
      );
    } else if (tokenFirst?.coin_family === 4) {
      console.log('eth:::::getWeb3Object:');
      network = new Web3(Singleton.getInstance().stcLink);
    } else {
      console.warn('MM', 'networkkk getWeb3Object bnb');
      network = new Web3(
        constants.network === 'testnet'
          ? constants.testnetBnb
          : Singleton.getInstance().bnbLink,
      );
    }
  }
  console.log('network::::', network);
  return network;
};

export const getSwapData = (
  coinFamily,
  swapId,
  search,
  page,
  setUsedFiatType,
  setPage,
  setLoading,
  dispatch,
) => {
  return new Promise((resolve, reject) => {
    Singleton.getInstance()
      .newGetData(constants.IS_PRIVATE_WALLET)
      .then(isPrivate => {
        console.log(
          'iSprivate::::getSwapListAllNew',
          isPrivate,
          coinFamily,
          swapId,
        );
        let access_token = Singleton.getInstance().access_token;
        setUsedFiatType(
          Singleton.getInstance().CurrencySelected?.toLowerCase(),
        );
        let data = {
          fiatType: Singleton.getInstance().CurrencySelected?.toLowerCase(),
          page: page ? page + 1 : 1,
          search: search,
          selectedSwapId: swapId,
          coinFamily: coinFamily,
          limit: limit,
        };
        dispatch(getSwapListAll({access_token, data}))
          .then(res => {
            setPage(page ? page + 1 : 1);
            resolve(res);
          })
          .catch(err => {
            setLoading(false);
            reject(err);
          });
      });
  });
};

export const getCoinFamilyForActiveWallet = isPrivate => {
  let coinFamily;
  if (isPrivate === constants.COIN_SYMBOL.ETH) {
    coinFamily = 1;
  } else if (isPrivate === constants.COIN_SYMBOL.STC) {
    coinFamily = 4;
  } else if (isPrivate === constants.COIN_SYMBOL.BNB) {
    coinFamily = 6;
  } else {
    coinFamily = null;
  }
  return coinFamily;
};

export const getContractObject = async (
  tokenAddress,
  tokenFirst,
  abi = TOKEN_ABI,
) => {
  console.warn(
    'MM',
    'tokenAddress:::getContractObject',
    tokenFirst?.coin_family,
  );
  try {
    const web3Object = getWeb3Object(
      tokenFirst?.coin_family === 1
        ? constants.COIN_SYMBOL.ETH
        : tokenFirst?.coin_family === 4
        ? constants.COIN_SYMBOL.STC
        : constants.COIN_SYMBOL.BNB,
      tokenFirst,
    );
    let tokenContractObject = await new web3Object.eth.Contract(
      abi,
      tokenAddress,
    );
    return tokenContractObject;
  } catch (e) {
    console.error('error ===>>', e);
  }
};

const getTokenBalance = async (tokenAddress, address, tokenFirst) => {
  console.warn('MM', 'chk tokenAddresss::::::', tokenAddress, address);
  try {
    const contract = await getContractObject(tokenAddress, tokenFirst);
    let result = await contract.methods.balanceOf(address).call();
    console.warn('MM', 'chk result::::::', result);
    return result;
  } catch (error) {
    console.warn('MM', 'Error ==>> :', error);
    return error;
  }
};

export const getUserBal = async (
  tokenFirst,
  userAddress,
  setUserBal,
  setCoinBalance,
  setLoading,
  coinBalance,
) => {
  try {
    console.warn(
      'MM',
      '-------------tokenFirst-------------getUserBal',
      tokenFirst,
    );
    console.warn('MM', '===>>', tokenFirst);
    const web3Object = getWeb3Object(
      tokenFirst?.coin_family === 1
        ? constants.COIN_SYMBOL.ETH
        : tokenFirst?.coin_family === 4
        ? constants.COIN_SYMBOL.STC
        : constants.COIN_SYMBOL.BNB,
      tokenFirst,
    );

    if (tokenFirst?.is_token === 0) {
      console.warn('MM', '===>>0000');
      let ethBal = 0;
      let bal = await web3Object.eth.getBalance(userAddress);
      ethBal = exponentialToDecimalWithoutComma(bal);
      console.log(
        'user ethBal ===>>',
        ethBal / 10 ** tokenFirst.decimals,
        'in wei ',
        ethBal,
      );
      let value = bigNumberSafeMath(ethBal, '/', 10 ** tokenFirst.decimals);
      console.log(
        'Singleton.getInstance().toFixed(value, 8)',
        Singleton.getInstance().toFixednew(
          exponentialToDecimalWithoutComma(isNaN(value) ? 0 : value),
          tokenFirst.decimals,
        ),
        value,
      );
      console.log('userBal ETH---Balance====', value);
      console.log(
        '--------------------bal',
        exponentialToDecimalWithoutComma(isNaN(value) ? 0 : value),
      );
      setUserBal(isNaN(value) ? 0 : exponentialToDecimalWithoutComma(value));
      setCoinBalance({
        ...coinBalance,
        [tokenFirst?.id]: {
          balance: isNaN(value) ? 0 : exponentialToDecimalWithoutComma(value),

          is_token: 0,
        },
      });
      return ethBal;
    } else {
      console.warn('MM', '===>>1111');
      let userBal;
      let bal = await getTokenBalance(
        tokenFirst.token_address,
        userAddress,
        tokenFirst,
      );
      console.log('MM', '***********************bal====', bal);
      userBal = exponentialToDecimalWithoutComma(bal);
      console.warn('MM', '***********************', bal);
      console.warn(
        'MM',
        '***************userBal / 10 ** tokenFirst.decimals******* * istoken ====1 ',
        userBal / 10 ** tokenFirst.decimals,
      );

      let value = bigNumberSafeMath(userBal, '/', 10 ** tokenFirst.decimals);
      console.log('userBal ETH---Balance============', value);

      setUserBal(isNaN(value) ? 0 : exponentialToDecimalWithoutComma(value));
      setCoinBalance({
        ...coinBalance,
        [tokenFirst?.id]: {
          balance: isNaN(value) ? 0 : exponentialToDecimalWithoutComma(value),

          is_token: 1,
        },
      });
      return +userBal;
    }
  } catch (error) {
    setLoading(false);
  }
};

export const getUserBalSecond = async (
  tokenSecond,
  tokenFirst,
  userAddress,
  setUserBal,
  setCoinBalanceSecond,
  coinBalanceSecond,
  setLoading,
) => {
  try {
    console.warn(
      'MM',
      '-------------tokenSecond-------------getUserBalSecond',
      tokenSecond,
    );
    console.warn('MM', '===>>', tokenSecond);
    const web3Object = getWeb3Object(
      tokenSecond?.coin_family === 1
        ? constants.COIN_SYMBOL.ETH
        : tokenSecond?.coin_family === 4
        ? constants.COIN_SYMBOL.STC
        : constants.COIN_SYMBOL.BNB,
      tokenFirst,
    );

    if (tokenSecond?.is_token === 0) {
      console.warn('MM', '===>>0000--SECOND');
      let ethBal = 0;
      let bal = await web3Object.eth.getBalance(userAddress);
      ethBal = exponentialToDecimalWithoutComma(bal);
      console.log(
        'user ethBal ===>>',
        ethBal / 10 ** tokenSecond.decimals,
        'in wei ',
        ethBal,
      );
      let value = bigNumberSafeMath(ethBal, '/', 10 ** tokenSecond.decimals);
      console.log(
        'Singleton.getInstance().toFixed(value, 8)',
        Singleton.getInstance().toFixednew(
          exponentialToDecimalWithoutComma(isNaN(value) ? 0 : value),
          tokenSecond.decimals,
        ),
        value,
      );
      console.log('userBal ETH---Balance====', value);
      console.log(
        '--------------------bal',
        exponentialToDecimalWithoutComma(isNaN(value) ? 0 : value),
      );
      setUserBal(exponentialToDecimalWithoutComma(isNaN(value) ? 0 : value));
      setCoinBalanceSecond({
        ...coinBalanceSecond,
        [tokenSecond?.id]: {
          balance: isNaN(value) ? 0 : exponentialToDecimalWithoutComma(value),

          is_token: 0,
        },
      });
      return ethBal;
    } else {
      console.warn('MM', '===>>1111--SECOND');
      let userBal;
      let bal = await getTokenBalance(
        tokenSecond.token_address,
        userAddress,
        tokenSecond,
      );
      console.log('MM', '***********************bal====', bal);
      userBal = exponentialToDecimalWithoutComma(bal);
      console.warn('MM', '***********************', bal);
      console.warn(
        'MM',
        '***************userBal / 10 ** tokenFirst.decimals********* istoken ====@nd',
        userBal / 10 ** tokenSecond.decimals,
      );
      let value = bigNumberSafeMath(userBal, '/', 10 ** tokenSecond.decimals);
      console.log('userBal ETH---Balance============', value);

      setUserBal(isNaN(value) ? 0 : exponentialToDecimalWithoutComma(value));
      setCoinBalanceSecond({
        ...coinBalanceSecond,
        [tokenSecond?.id]: {
          balance: isNaN(value) ? 0 : exponentialToDecimalWithoutComma(value),

          is_token: 1,
        },
      });
      return +userBal;
    }
  } catch (error) {
    setLoading(false);
  }
};

export const getGasPrice = (tokenFirst, setGasPrice) => {
  getWeb3Object(
    tokenFirst?.coin_family === 1
      ? constants.COIN_SYMBOL.ETH
      : tokenFirst?.coin_family === 4
      ? constants.COIN_SYMBOL.STC
      : constants.COIN_SYMBOL.BNB,
    tokenFirst,
  )
    .eth.getGasPrice()
    .then(gas => {
      console.log('________-gas', gas);
      let gasfee = gas;
      if (tokenFirst?.coin_family === 1) {
        gasfee = (parseInt(gasfee) + GAS_PRICE_EXTRA_BUFFER).toString();
      }
      console.log('________-gas final', gasfee);
      setGasPrice(gasfee);
    });
};

const sendTransactionToBackend = (
  data,
  tokenFirst,
  coin_symbol,
  isApproval,
  rawTxnObj,
) => {
  let blockChain =
    tokenFirst?.coin_family === 1
      ? constants.NETWORK.ETHEREUM
      : tokenFirst?.coin_family === 4
      ? constants.NETWORK.SAITACHAIN
      : constants.NETWORK.BINANCE_SMART_CHAIN;
  return new Promise((resolve, reject) => {
    console.warn('MM', 'eth data:::: ccvc tkn', tokenFirst.coin_symbol);
    if (tokenFirst?.coin_family === 1) {
      coin_symbol = isApproval
        ? constants.COIN_SYMBOL.ETH
        : tokenFirst.coin_symbol.toLowerCase() === constants.COIN_SYMBOL.ETH
        ? constants.COIN_SYMBOL.ETH
        : rawTxnObj?.tokenContractAddress;
    } else if (tokenFirst?.coin_family === 4) {
      coin_symbol = isApproval
        ? constants.COIN_SYMBOL.STC
        : tokenFirst.coin_family === 4 &&
          tokenFirst.coin_symbol.toLowerCase() === constants.COIN_SYMBOL.STC
        ? constants.COIN_SYMBOL.STC
        : rawTxnObj?.tokenContractAddress;
    } else {
      coin_symbol = isApproval
        ? constants.COIN_SYMBOL.BNB
        : tokenFirst.coin_symbol.toLowerCase() === constants.COIN_SYMBOL.BNB
        ? constants.COIN_SYMBOL.BNB
        : rawTxnObj?.tokenContractAddress;
    }
    let access_token = Singleton.getInstance().access_token;
    console.warn('MM', 'eth data::::', data);
    console.warn(
      'MM',
      'eth data::::',
      `https://api.saita.pro/prod/api/v1/${blockChain}/${coin_symbol}/savetrnx`,
      access_token,
    );
    APIClient.getInstance()
      .post(`${blockChain}/${coin_symbol}/savetrnx`, data, access_token)
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const makeTransaction = async (
  transactionData,
  gasPrice,
  gasLimit,
  nonce,
  value,
  to,
  pvtKey,
  from,
  isApproval,
  tokenFirst,
  isApproved,
  tokenOneAmount,
  rawTxnObj,
) => {
  return new Promise(async (resolve, reject) => {
    console.warn('MM', 'rawTransaction =>111');
    setTimeout(async () => {
      try {
        if (global.disconnected) {
          reject({message: constants.NO_NETWORK});
          return;
        }
        const web3Object = getWeb3Object(
          tokenFirst?.coin_family === 1
            ? constants.COIN_SYMBOL.ETH
            : tokenFirst?.coin_family === 4
            ? constants.COIN_SYMBOL.STC
            : constants.COIN_SYMBOL.BNB,
          tokenFirst,
        );
        let rawTransaction = {
          gasPrice: gasPrice,
          gasLimit: gasLimit,
          to: to,
          value: value,
          data: transactionData,
          nonce: nonce,
          from: from.toLowerCase(),
          chainId:
            tokenFirst?.coin_family == 1
              ? parseInt(constants.CHAIN_ID_ETH)
              : tokenFirst?.coin_family == 4
              ? IS_PRODUCTION === 0
                ? 129
                : 1209
              : parseInt(constants.CHAIN_ID_BNB),
        };
        console.warn('MM', 'rawTransaction =>', rawTransaction);
        if (global.disconnected) {
          reject({message: constants.NO_NETWORK});
          return;
        }
        let txn = await web3Object.eth.accounts.signTransaction(
          rawTransaction,
          pvtKey,
        );
        console.log('txn:::::', txn);
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
        console.warn('MM', 'serializedTran => data data', data);
        console.warn('MM', 'serializedTran => data rawTxnObj', rawTxnObj);
        let serializedTran = txn.rawTransaction.toString('hex');
        console.warn('MM', 'serializedTran =>', serializedTran);
        if (global.disconnected) {
          reject({message: constants.NO_NETWORK});
          return;
        }
        let result = await getWeb3Object(
          tokenFirst?.coin_family === 1
            ? constants.COIN_SYMBOL.ETH
            : tokenFirst?.coin_family === 4
            ? constants.COIN_SYMBOL.STC
            : constants.COIN_SYMBOL.BNB,
          tokenFirst,
        ).eth.sendSignedTransaction(serializedTran);
        console.warn('MM', 'serializedTran => result', result);
        data.tx_hash = result.transactionHash;
        await sendTransactionToBackend(
          data,
          tokenFirst,
          value === '0x0'
            ? rawTxnObj?.tokenContractAddress
            : tokenFirst?.coin_family === 1
            ? constants.COIN_SYMBOL.ETH
            : tokenFirst?.coin_family === 4
            ? constants.COIN_SYMBOL.STC
            : constants.COIN_SYMBOL.BNB,
          isApproval,
          rawTxnObj,
        );
        return resolve(result);
      } catch (error) {
        return reject(error);
      }
    }, 1500);
  });
};

export const calculatePercentage = (percentage, balance) => {
  console.log(
    'percentage::::::',
    percentage,
    'balance:::::::',
    exponentialToDecimalWithoutComma(balance),
  );
  let result = Singleton.getInstance().bigNumberSafeMath(
    percentage / 100,
    '*',
    balance,
  );
  console.log('result', exponentialToDecimalWithoutComma(result));
  return result;
};

export const checkforPair = (item, tokenSecond, setIsPairSupported) => {
  let tokenContractAddress =
    item?.is_token === 0 ? tokenSecond?.token_address : item.token_address;
  Singleton.getInstance()
    .checkFactoryForPair(item.coin_family, tokenContractAddress)
    .then(res => {
      console.log('res::::::checkforPair', res);
      if (!res) {
        setIsPairSupported(false);
        Singleton.showAlert(`Pair not supported at the moment.`);
      }
    })
    .catch(err => {
      console.log('err::::::checkforPair', err);
    });
};
