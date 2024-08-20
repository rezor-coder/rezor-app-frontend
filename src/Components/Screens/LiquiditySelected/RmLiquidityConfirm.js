import { BigNumber } from 'bignumber.js';
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, Image, Text, View } from 'react-native';
import { EventRegister } from 'react-native-event-listeners';
import Web3 from 'web3';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import * as constants from '../../../Constant';
import { PERCENTAGE_VALUES } from '../../../Constant';
import Singleton from '../../../Singleton';
import { Colors } from '../../../theme';
import { ButtonPrimary, PercentBtn, SimpleHeader, Wrap } from '../../common';
import Loader from '../Loader/Loader';
import { RevomeConfirmation } from './RevomeConfirmation';
import styles from './style';

//const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/39f09bbfb5754cd480eee6c763227883'));
const web3 = new Web3(constants.mainnetInfuraLink);
// let routerAddress = constants.SwapRouterAddress; // mainnet saitaswap router address
// const TXN_COMPLETE_MAX_TIME = 10;
// const SLIPPERAGE_PERCENTAGE = 7.5;

// let userAddress = Singleton.getInstance().defaultEthAddress;
import PAIR_ABI from '../../../../ABI/Pair.ABI.json';
import ROUTER_ABI from '../../../../ABI/router.ABI.json';
import { APIClient } from '../../../Api';
import { NavigationStrings } from '../../../Navigation/NavigationStrings';
import { getCurrentRouteName, navigate } from '../../../navigationsService';

const GAS_FEE_MULTIPLIER = 0.000000000000000001;
const GAS_BUFFER = 10000;

const LiquidityValue = ({ title, value, customView }) => {
  return (
    <View style={[styles.row1, customView]}>
      <Text style={[styles.textReg12, { color: ThemeManager.colors.textColor }]}>
        {title}
      </Text>
      <Text style={[styles.textReg12, { color: ThemeManager.colors.textColor }]}>
        {value}
      </Text>
    </View>
  );
};


const RmLiquidityConfirm = props => {

  let routerAddress = Singleton.getInstance().SwapRouterAddress; // mainnet saitaswap router address


  let SLIPPERAGE_PERCENTAGE = Singleton.getInstance().slipageTolerance; //in percent
  let TXN_COMPLETE_MAX_TIME = Singleton.getInstance().slipageTimeout; //in minutes
  const balance = 90;
  const { selectedToCoin, selectedFromCoin, pairBalance, secondTokenSupply, firstTokenSupply, poolSupply, resultPair,
    pairNonce, FilteredCoinOne, FilteredCoinTwo } =props?.route?.params;
  const [selectedPercentage, setSelectedPercent] = useState(0);
  const [isShowConfirm, setShowConfirm] = useState(false);
  const [amountValue, setAmountValue] = useState('');
  const [firstDeposit, setFirstDeposit] = useState(0);
  const [liquidityRemoveValue, setLiquidityRemoveValue] = useState(0);
  const [secondDeposit, setSecondDeposit] = useState(0);
  const [pvtKey, setEthPvtKey] = useState('');
  const [isSigned, setIsSigned] = useState(false);
  const [gasEstimate, setGasEstimate] = useState(0);
  const [transactionFee, setTransactionFee] = useState('0.00');
  const [gasPrice, setGasPrice] = useState(0);
  const [deadline, setDeadline] = useState(0);
  const [rawTxnObj, setRawTxnObj] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [userBal, setUserBal] = useState(0);
  const [isInsufficientBalance, setInsufficientBalance] = useState(false);
  const [indexPosition, setindexPosition] = useState(0);

  const getWeb3Object = () => {

    let network = new Web3(constants.mainnetInfuraLink);
    return network;

  };
  const getUserBal = async () => {
    let ethBal = await getWeb3Object().eth.getBalance(Singleton.getInstance().defaultEthAddress);
    const value = ethBal / 10 ** 18;
    setUserBal(Singleton.getInstance().toFixed(value, 8));
  }
  const getGasPrice = () => {
    getWeb3Object()
      .eth.getGasPrice()
      .then(gas => {
        setGasPrice(gas);
        getUserBal()
        setLoading(false)
      }).catch(() => {
        setLoading(false)
      });;
  };

  const getContractObject = async (tokenAddress, abi) => {
    const web3Object = getWeb3Object();
    let tokenContractObject = new web3Object.eth.Contract(abi, tokenAddress,);
    return tokenContractObject;

  };

  //6 . E/T  withoutFee
  const removeLiquidityETHWithPermit = async (r, s, v, value) => {
    //console.warn('MM',"-----v2", v, r, s);
    let amountEth = firstDeposit * (10 ** FilteredCoinOne.decimals)
    let amountToken = secondDeposit * (10 ** FilteredCoinTwo.decimals)
    const amountETHMin = BigNumber(amountEth - (amountEth * SLIPPERAGE_PERCENTAGE) / 100)
    const amountTokenMin = BigNumber(amountToken - (amountToken * SLIPPERAGE_PERCENTAGE) / 100)

    let routerContractObject = await getContractObject(routerAddress, ROUTER_ABI,);
    //console.warn('MM',"removeLiquidityETHWithPermit params", resultPair, parseInt(value), parseInt(amountTokenMin), parseInt(amountETHMin), Singleton.getInstance().defaultEthAddress, deadline,
    // false, v, r, s, SLIPPERAGE_PERCENTAGE);

    let removeLiquidityTransaction = await routerContractObject.methods.removeLiquidityETHWithPermit(selectedFromCoin.token_address,
      parseInt(value), parseInt(amountTokenMin), parseInt(amountETHMin), Singleton.getInstance().defaultEthAddress, deadline,
      false, v, r, s);

    //console.warn('MM'," value ", value.toString(), Singleton.getInstance().defaultEthAddress);
    removeLiquidityTransaction
      .estimateGas({ from: Singleton.getInstance().defaultEthAddress })
      .then(gasEstimate => {
        //console.warn('MM',"????gasEstimate", gasEstimate);
        setLoading(false)
        //console.warn('MM',"removeLiquidityWithPermit gasEstimate", gasEstimate);
        setGasEstimate(gasEstimate + GAS_BUFFER);
        setTransactionFee(Singleton.getInstance().toFixed(gasEstimate * gasPrice * GAS_FEE_MULTIPLIER, 8,),);
        //console.warn('MM','Singleton.getInstance().toFixed(((gasEstimate) * gasPrice * GAS_FEE_MULTIPLIER:::', gasEstimate * gasPrice * GAS_FEE_MULTIPLIER,);
        let fee = Singleton.getInstance().toFixed(gasEstimate * gasPrice * GAS_FEE_MULTIPLIER, 8)
        if (userBal < fee) {
          setInsufficientBalance(true);
        } else {
          setInsufficientBalance(false);
        }
        setRawTxnObj({
          type: FilteredCoinOne.coin_symbol.toLowerCase(),
          data: removeLiquidityTransaction.encodeABI(),
          value: amountETHMin.toString(),
          tokenContractAddress: FilteredCoinOne.token_address,
        });
      })
      .catch(err => {
        setLoading(false)
        //console.warn('MM',"errwww e" + err);
      });
  }

  //7 . E/T  withoutFee
  const removeLiquidityETHWithPermitSupportingFeeOnTransferTokens = async (r, s, v, value) => {
    //console.warn('MM',"-----v2", v, r, s);
    let amountEth = firstDeposit * (10 ** FilteredCoinOne.decimals)
    let amountToken = secondDeposit * (10 ** FilteredCoinTwo.decimals)
    const amountETHMin = BigNumber(amountEth - (amountEth * SLIPPERAGE_PERCENTAGE) / 100)
    const amountTokenMin = BigNumber(amountToken - (amountToken * SLIPPERAGE_PERCENTAGE) / 100)

    let routerContractObject = await getContractObject(routerAddress, ROUTER_ABI,);

    let tokenAddress = selectedFromCoin.is_token == 1 ? selectedFromCoin.token_address : selectedToCoin.token_address
    //console.warn('MM',"removeLiquidityETHWithPermitSupportingFeeOnTransferTokens params", tokenAddress, parseInt(value), parseInt(amountTokenMin), parseInt(amountETHMin), Singleton.getInstance().defaultEthAddress, deadline,
    // false, v, r, s, SLIPPERAGE_PERCENTAGE, TXN_COMPLETE_MAX_TIME);
    let removeLiquidityTransaction = await routerContractObject.methods.removeLiquidityETHWithPermitSupportingFeeOnTransferTokens(tokenAddress,
      parseInt(value), parseInt(amountTokenMin), parseInt(amountETHMin), Singleton.getInstance().defaultEthAddress, deadline,
      false, v, r, s);


    //console.warn('MM'," value ", value.toString(), Singleton.getInstance().defaultEthAddress);
    removeLiquidityTransaction
      .estimateGas({ from: Singleton.getInstance().defaultEthAddress })
      .then(gasEstimate => {
        //console.warn('MM',"????gasEstimate", gasEstimate);
        setLoading(false)
        //console.warn('MM',"removeLiquidityWithPermit gasEstimate", gasEstimate);
        setGasEstimate(gasEstimate + GAS_BUFFER);
        setTransactionFee(Singleton.getInstance().toFixed(gasEstimate * gasPrice * GAS_FEE_MULTIPLIER, 8,),);
        //console.warn('MM','Singleton.getInstance().toFixed(((gasEstimate) * gasPrice * GAS_FEE_MULTIPLIER:::', gasEstimate * gasPrice * GAS_FEE_MULTIPLIER,);
        let fee = Singleton.getInstance().toFixed(gasEstimate * gasPrice * GAS_FEE_MULTIPLIER, 8)
        if (userBal < fee) {
          setInsufficientBalance(true);
        } else {
          setInsufficientBalance(false);
        }
        setRawTxnObj({
          type: FilteredCoinOne.coin_symbol.toLowerCase(),
          data: removeLiquidityTransaction.encodeABI(),
          value: amountETHMin.toString(),
          tokenContractAddress: FilteredCoinOne.token_address,
        });
      })
      .catch(err => {
        setLoading(false)
        //console.warn('MM',"errwww e" + err);
      });
  }
  //8. T/T  withoutFee
  const removeLiquidityWithPermit = async (r, s, v, value) => {
    //console.warn('MM',"----- removeLiquidityWithPermit", v, r, s);
    let amountEth = firstDeposit * (10 ** FilteredCoinOne.decimals)
    let amountToken = secondDeposit * (10 ** FilteredCoinTwo.decimals)
    const amountETHMin = BigNumber(amountEth - (amountEth * SLIPPERAGE_PERCENTAGE) / 100)
    const amountTokenMin = BigNumber(amountToken - (amountToken * SLIPPERAGE_PERCENTAGE) / 100)

    let routerContractObject = await getContractObject(routerAddress, ROUTER_ABI,);
    //console.warn('MM',"removeLiquidityWithPermit params", FilteredCoinOne.token_address, FilteredCoinTwo.token_address,
    // parseInt(value), parseInt(amountETHMin), parseInt(amountTokenMin), Singleton.getInstance().defaultEthAddress, deadline,
    //   false, v, r, s, SLIPPERAGE_PERCENTAGE);

    let removeLiquidityTransaction = await routerContractObject.methods.removeLiquidityWithPermit(FilteredCoinOne.token_address, FilteredCoinTwo.token_address,
      parseInt(value), parseInt(amountETHMin), parseInt(amountTokenMin), Singleton.getInstance().defaultEthAddress, deadline,
      false, v, r, s);

    //console.warn('MM'," value ", value.toString(), Singleton.getInstance().defaultEthAddress);
    removeLiquidityTransaction
      .estimateGas({ from: Singleton.getInstance().defaultEthAddress })
      .then(gasEstimate => {
        setLoading(false)
        //console.warn('MM',"removeLiquidityWithPermit gasEstimate", gasEstimate);
        setGasEstimate(gasEstimate + GAS_BUFFER);
        setTransactionFee(Singleton.getInstance().toFixed(gasEstimate * gasPrice * GAS_FEE_MULTIPLIER, 8,),);
        //console.warn('MM','Singleton.getInstance().toFixed(((gasEstimate) * gasPrice * GAS_FEE_MULTIPLIER:::', gasEstimate * gasPrice * GAS_FEE_MULTIPLIER,);
        let fee = Singleton.getInstance().toFixed(gasEstimate * gasPrice * GAS_FEE_MULTIPLIER, 8)
        if (userBal < fee) {
          setInsufficientBalance(true);
        } else {
          setInsufficientBalance(false);
        }

        setRawTxnObj({
          type: FilteredCoinOne.coin_symbol.toLowerCase(),
          data: removeLiquidityTransaction.encodeABI(),
          value: amountETHMin.toString(),
          tokenContractAddress: FilteredCoinOne.token_address,
        });
      })
      .catch(err => {
        setLoading(false)
        //console.warn('MM',"err removeLiquidityWithPermit" + err);
      });
  }


  const signRemoveTransaction = async (pairBalance, pairNonce, resultPair, pvtKey) => {
    // pair = pair address

    try {

      let owner = Singleton.getInstance().defaultEthAddress
      let PairrouterContractObject = await getContractObject(resultPair, PAIR_ABI,);
      let nonce = await PairrouterContractObject.methods
        .nonces(owner)
        .call();

      let spender = routerAddress
      let value = ((selectedPercentage / 100) * (pairBalance) * 10 ** 18).toFixed(0)
      setLiquidityRemoveValue(value)
      let chainId = constants.network == 'testnet' ? parseInt(constants.CHAIN_ID_ETH) : 1//web3.utils.hexToNumber("0x01");
      //console.warn('MM',"Data:", nonce, "owner " + owner, value, spender, deadline, resultPair, chainId);

      const EIP712Domain = [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
      ];
      const domain = {
        name: "SaitaSwap LPs",
        version: "1",
        chainId,
        verifyingContract: resultPair,
      };

      const Permit = [
        { name: "owner", type: "address" },
        { name: "spender", type: "address" },
        { name: "value", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ];
      const message = {
        owner,
        spender,
        value: parseInt(value),
        nonce: parseInt(nonce),
        deadline,
        // owner: "0x9f6c625d17287ababfd06f9bb334a47a6e4922b7",
        // spender: "0x0c17e776CD218252ADFca8D4e761D3fe757e9778",
        // deadline: 1669380556,
        // nonce: 0,
        // value: 11893362156353,  
      };
      //console.warn('MM',"message", message, Permit);
      const data = JSON.stringify({
        types: { EIP712Domain, Permit, },
        domain,
        primaryType: "Permit",
        message,
      });

      //const from = owner;   get pvt key / value

      //console.warn('MM','--------data', domain,
      // {
      //   Permit: Permit
      // },
      //   message)
      let wallet = new ethers.Wallet(pvtKey);
      wallet._signTypedData(
        domain,
        {
          Permit: Permit
        },
        message

      ).then(async (resww) => {
        //console.warn('MM','----------resww', resww);
        let { r, s, v } = getSignatureParameters(resww)
        setIsSigned(true)
        Singleton.showAlert("Signed Succesfully.")
        //console.warn('MM','--------r', r, '---------s', s, '--------v', v)
        if (selectedToCoin.coin_symbol.toLowerCase() == constants.COIN_SYMBOL.ETH || selectedFromCoin.coin_symbol.toLowerCase() == constants.COIN_SYMBOL.ETH) {
          //6 E/T
          if (selectedToCoin.coin_symbol.toLowerCase() == constants.COIN_SYMBOL.ETH) {
            if (selectedFromCoin.is_fee == 0) {
              //no fee
              //console.warn('MM',">>>>> removeLiquidityETHWithPermit 1");
              removeLiquidityETHWithPermit(r, s, v, value)
            } else {
              //with fee
              //console.warn('MM',">>>>> removeLiquidityETHWithPermitSupportingFeeOnTransferTokens 2");
              removeLiquidityETHWithPermitSupportingFeeOnTransferTokens(r, s, v, value)
            }

          } else {
            if (selectedToCoin.is_fee == 0) {
              //no fee
              //console.warn('MM',">>>>> removeLiquidityETHWithPermit3");
              removeLiquidityETHWithPermit(r, s, v, value)
            } else {
              //with fee
              //console.warn('MM',">>>>> removeLiquidityETHWithPermitSupportingFeeOnTransferTokens 4");
              removeLiquidityETHWithPermitSupportingFeeOnTransferTokens(r, s, v, value)
            }
          }

        } else {
          //8 T/T
          removeLiquidityWithPermit(r, s, v, value)
        }

      }).catch(err => {
        setLoading(false)
        setIsSigned(false)
        //console.warn('MM','----------err', err);
      });


    } catch (err) {
      setIsSigned(false)
      //console.warn('MM',"message err", err);
      return err;
    }
  };

  const getSignatureParameters = (signature) => {
    if (!web3.utils.isHexStrict(signature)) {
      throw new Error(
        'Given value "'.concat(signature, '" is not a valid hex string.'),
      );
    }
    var r = signature.slice(0, 66);
    var s = '0x'.concat(signature.slice(66, 130));
    var v = '0x'.concat(signature.slice(130, 132));
    v = web3.utils.hexToNumber(v);
    if (![27, 28].includes(v)) v += 27;
    return {
      r: r,
      s: s,
      v: v,
    };
  }

  const removeLiquidity = async () => {
    setLoading(true)
    //console.warn('MM','\n\n\n **** remove TRANSACTION ALERT ***** \n\n\n');
    const web3Object = getWeb3Object();
    let nonce = await web3Object.eth.getTransactionCount(Singleton.getInstance().defaultEthAddress);
    //console.warn('MM','\n\n\n ****nonce*****  ', nonce);
    const result = await makeTransaction(
      rawTxnObj.data,
      gasPrice,
      gasEstimate,
      nonce,
      '0x0',
      routerAddress,
      pvtKey,
      Singleton.getInstance().defaultEthAddress,
    );
    //console.warn('MM','--------------result---------------', result);
    setRawTxnObj({});
    setLoading(false);
    Alert.alert(
      'Success',
      `Transaction is broadcasted successfully. Waiting for blockchain confirmation `,
      [
        {
          text: 'Ok',
          onPress: () => {
            navigate(NavigationStrings.SwapNew)
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
    let txn = await web3Object.eth.accounts.signTransaction(rawTransaction, pvtKey,);
    //console.warn('MM','rawTransaction txn =>', txn);
    let data = {
      from: from.toLowerCase(),
      to: to,
      amount: value,
      gas_price: gasPrice,
      gas_estimate: gasLimit,
      tx_raw: txn.rawTransaction.slice(2),
      tx_type: 'WITHDRAW',
      nonce: nonce,
      chat: 0,
      is_smart: 1,
    };
    //console.warn('MM','serializedTran => data data', data);
    //console.warn('MM','serializedTran => data rawTxnObj', rawTxnObj);
    let serializedTran = txn.rawTransaction.toString('hex');
    //console.warn('MM','serializedTran =>', serializedTran);

    let result = await getWeb3Object().eth.sendSignedTransaction(serializedTran);
    //console.warn('MM','serializedTran => result', result);
    data.tx_hash = result.transactionHash;
    await sendTransactionToBackend(data, constants.NETWORK.ETHEREUM, value == '0x0' ? rawTxnObj?.tokenContractAddress : constants.COIN_SYMBOL.ETH,);
    return result;
  };

  const sendTransactionToBackend = (
    data,
    blockChain = constants.NETWORK.ETHEREUM,
    coin_symbol

  ) => {
    return new Promise((resolve, reject) => {
      //console.warn('MM','eth data:::: ccvc tkn', FilteredCoinOne.coin_symbol)
      coin_symbol = FilteredCoinOne.coin_symbol.toLowerCase() == constants.COIN_SYMBOL.ETH ? "eth" : rawTxnObj?.tokenContractAddress
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
      //       //console.warn('MM',' TransactionToBackend>>> 1= ', res);
      //       let jsonVal = await res.json();
      //       //console.warn('MM','transactionToBackend = ', jsonVal);
      //       if (!res.ok) {
      //         if (jsonVal.message == undefined) {
      //           return resolve({ message: constants.SOMETHING_WRONG });
      //         }
      //         return resolve(jsonVal);
      //       }
      //       return resolve(jsonVal);
      //     } catch (e) {
      //       //console.warn('MM','transactionToBackend err==> ', e);
      //       return resolve({ message: constants.SOMETHING_WRONG });
      //     }
      //   })
      //   .catch(err => {
      //     setLoading(false)
      //     //console.warn('MM','tTransactionToBackend err==>', err);
      //   });
    });
  };


  useEffect(() => {
    setLoading(true)
    routerAddress = Singleton.getInstance().SwapRouterAddress
    //console.warn('MM','======= remove', Singleton.getInstance().slipageTolerance, Singleton.getInstance().slipageTimeout);


    let eventListner = EventRegister.addEventListener('swapData', data => {
      //console.warn('MM','======= remove data', data);
      if (data != "") {
      SLIPPERAGE_PERCENTAGE = data?.tolerance || Singleton.getInstance().slipageTolerance;
      TXN_COMPLETE_MAX_TIME = data?.timeout || Singleton.getInstance().slipageTimeout;
      }
      setindexPosition(3445);
    });

    Singleton.getInstance()
      .newGetData(`${Singleton.getInstance().defaultEthAddress}_pk`)
      .then(ethPvtKey => {
        setEthPvtKey(ethPvtKey);
      })

    getGasPrice()
    let deadline = Math.floor(new Date().getTime() / 1000);
    deadline = deadline + TXN_COMPLETE_MAX_TIME * 60;
    setDeadline(deadline)
    return () => {
      EventRegister.removeEventListener(eventListner);
    };
  }, []);
  return (
    <Wrap style={{ backgroundColor: ThemeManager.colors.backgroundColor }}>
      <SimpleHeader
        title={LanguageManager.removeLiquidity}
        backImage={ThemeManager.ImageIcons.iconBack}
        titleStyle
        imageShow
        back
        history
        onPressHistory={() => {
          getCurrentRouteName() != 'SwapSettings' && navigate(NavigationStrings.SwapSettings,{
            onGoBack: data => {
              //console.warn('MM','DATA======');
            },
          });
        }
        }

      />
      <View style={styles.wrap}>
        <View style={styles.row1}>
          <Text
            style={[styles.textSm14, { color: ThemeManager.colors.textColor }]}>
            Amount
          </Text>
          <Text style={[styles.textReg12, { color: Colors.pink }]}>Detailed</Text>
        </View>


        <View style={styles.row1}>
          {PERCENTAGE_VALUES.map(res => {
            return (
              <PercentBtn
                btnstyle={styles.percentBtn}
                text={res.title}
                normal={selectedPercentage == res.value ? true : undefined}
                onPress={() => {
                  setSelectedPercent(res.value);
                  const amountByPercent = (res.value / 100) * balance;
                  setAmountValue(`${amountByPercent}`);
                  const amountFirst = (res.value / 100) * firstTokenSupply;
                  const amountSecond = (res.value / 100) * secondTokenSupply;
                  setFirstDeposit(amountFirst)
                  setSecondDeposit(amountSecond)
                }}
              />
            );
          })}

          {/* <ButtonPrimary text={'25%'} /> */}
        </View>

        <View style={[styles.pinkRoundBox]}>
          <LiquidityValue
            title={`${selectedToCoin?.coin_symbol.toUpperCase()}`}
            value={Singleton.getInstance().toFixed(firstDeposit, 8)}
            customView={{ marginTop: -5 }}
          />
          <LiquidityValue
            title={`${selectedFromCoin?.coin_symbol.toUpperCase()}`}
            value={Singleton.getInstance().toFixed(secondDeposit, 8)}
          />
        </View>
        <Text
          style={[
            styles.textSm14,
            { color: ThemeManager.colors.textColor, marginTop: 15 },
          ]}>
          LP Tokens in your wallet
        </Text>
        <View style={styles.pinkRoundBox}>
          <View style={styles.row}>
            <View style={{ width: 60 }}>
              <View style={styles.toImageView}>
                <Image
                  style={styles.toImage}
                  source={{ uri: selectedToCoin?.coin_image }}
                />
              </View>
              <View style={styles.fromImageView}>
                <Image
                  style={styles.toImage}
                  source={{ uri: selectedFromCoin?.coin_image }}
                />
              </View>
            </View>
            <Text
              style={[
                styles.textReg14,
                {
                  color: ThemeManager.colors.textColor,
                },
              ]}>
              {selectedToCoin.coin_symbol}/{selectedFromCoin.coin_symbol}
            </Text>
            <Text
              style={[
                styles.textReg12,
                {
                  color: ThemeManager.colors.textColor,
                  position: 'absolute',
                  right: 0,
                },
              ]}>
              {Singleton.getInstance().toFixed((pairBalance / 10 ** 18), 8)}
            </Text>
          </View>
          <LiquidityValue
            title={`${selectedToCoin?.coin_symbol.toUpperCase()}`}
            value={Singleton.getInstance().toFixed(firstTokenSupply, 8)}
          />
          <LiquidityValue
            title={`${selectedFromCoin?.coin_symbol.toUpperCase()}`}
            value={Singleton.getInstance().toFixed(secondTokenSupply, 8)}
          />
        </View>
        <View style={styles.continueBox}>


          <ButtonPrimary
            onpress={() => {
              if (selectedPercentage == 0) {
                Singleton.showAlert("Please select Amount")
                return
              }
              signRemoveTransaction((pairBalance / 10 ** 18), pairNonce, resultPair, pvtKey)
            }}
            btnstyle={styles.continueBtn1}
            text={"Sign"}
          />
          <ButtonPrimary
            onpress={() => {
              if (!isSigned) {
                Singleton.showAlert("Sign Transaction First")
                return
              }
              if (isInsufficientBalance) {
                Singleton.showAlert("You don't have enough ETH to perform transaction! Required Fee is " + transactionFee + " ETH.");
                return
              }
              setShowConfirm(true);
            }}
            btnstyle={styles.continueBtn1}
            text={LanguageManager.remove}
          />
        </View>

      </View>
      <RevomeConfirmation
        firstTokenSupplyValue={Singleton.getInstance().toFixed(firstDeposit, 8)}
        secondTokenSupplyValue={Singleton.getInstance().toFixed(secondDeposit, 8)}
        selectedToCoin={selectedToCoin}
        selectedFromCoin={selectedFromCoin}
        transactionFee={transactionFee}
        isVisible={isShowConfirm}
        onClose={() => {

          setShowConfirm(false);

        }}
        onConfirm={() => {

          setShowConfirm(false);
          removeLiquidity()
        }}
      />
      {isLoading && (
        <Loader
          smallLoader={false}
          customheight={{ height: Dimensions.get('window').height }}
        />
      )}
    </Wrap>
  );
};

export { LiquidityValue, RmLiquidityConfirm };

