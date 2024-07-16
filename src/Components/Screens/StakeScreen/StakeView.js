import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import colors from '../../../theme/Colors';
import { BasicButton } from '../../common';
// import {styles} from './StakingPoolsStyle';
import fonts from '../../../theme/Fonts';

import Web3 from 'web3';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import * as constants from '../../../Constant';
import Singleton from '../../../Singleton';
import Colors from '../../../theme/Colors';
import Fonts from '../../../theme/Fonts';
import Images from '../../../theme/Images';
import styles from './StakeStyle';

import { BigNumber } from 'bignumber.js';
import debounce from 'lodash.debounce';
import { APIClient } from '../../../Api';
import { exponentialToDecimalWithoutComma } from '../../../utils';
import STAKING_CONTRACT_ABI from './SaitaABI.json';
import TOKEN_CONTRACT_ABI from './tokenContract.ABI.json';
import { goBack } from '../../../navigationsService';
let isStakeButtonClicked = false;

const StakeView = props => {
  const daysSelection = [
    // {days: '0 Days', id: 0, selected: true},
    { days: '30 Days', id: 0, selected: true },
    { days: '60 Days', id: 1, selected: false },
    { days: '90 Days', id: 2, selected: false },
  ];
  const SAITAMA_DECEMALS = 9;

  const GAS_FEE_MULTIPLIER = 0.000000000000000001;
  const TotalSeconds = 86400;
  // const TokenContractAddress = '0xCE3f08e664693ca792caCE4af1364D5e220827B2'; // saitama address
  // const StakingContractAddress = '0x409353a02Ba3CCf60F3c503A6fd842a7A9C20782'; //proxy

  // const TokenContractAddress = constants.StakeSaitamaAddress; // saitama address
  // const StakingContractAddress = constants.StakingContractAddress; //proxy

  // const getWeb3Object = () => {
  //   return constants.network == 'mainnet' ? new Web3( 'https://mainnet.infura.io/v3/39f09bbfb5754cd480eee6c763227883', )
  //     : new Web3(  'https://rinkeby.infura.io/v3/39f09bbfb5754cd480eee6c763227883', );
  //      // 'https://data-seed-prebsc-1-s1.binance.org:8545/',)
  // };
  const getWeb3Object = () => {
    return constants.network == 'mainnet' ? new Web3(Singleton.getInstance().ethLink)
      : new Web3(constants.testnetEth);

  };
  const userAddress = Singleton.getInstance().defaultEthAddress;
  const GAS_BUFFER = 10000;

  const [days, setSelectedDays] = useState(30);
  // const [stakeSelected, setStakeSelected] = useState(true);
  const [daysSelected, setDaysSelected] = useState('15 Days');
  const [daysSelectedIndex, setDaysSelectedIndex] = useState(0);
  const [inputAmount, setAmount] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [privateKey, setPrivateKey] = useState('');
  const [userBal, setUserBal] = useState(0);
  const [gasPrice, setGasPrice] = useState(0);

  const [reward, setReward] = useState(0);
  const [finalRewards, setfinalRewards] = useState(0);
  const [isInsufficientBalance, setInsufficientBalance] = useState(false);
  const [isApproved, setUserApproval] = useState(true);
  const [gasEstimate, setGasEstimate] = useState(0);
  const [userWalletAddress, setUserWalletAddress] = useState(
    Singleton.getInstance().defaultEthAddress,
  );
  const [allownceTxnObj, setAllowancetxnObj] = useState({});
  // const [stakingArray, setStakingArray] = useState([]);

  useEffect(() => {
    getRewardPoints(0);
    getUserBal(userWalletAddress);
    getGasPrice();
    Singleton.getInstance()
      .newGetData(`${Singleton.getInstance().defaultEthAddress}_pk`)
      .then(ethPvtKey => {
        //console.warn('MM','ethPvtKey--------', ethPvtKey);
        setPrivateKey(ethPvtKey);
      });
  }, []);
  useEffect(() => {
    props.loader(isLoading);
  }, [isLoading]);

  const getRewardPoints = async index => {
    try {
      if(global.disconnected){
        Singleton.showAlert(constants.NO_NETWORK)
        setLoading(false)
        return
      }
        console.warn('MM' , 'getRewardPoints');
    
    setLoading(true);
    let days = daysSelection[index].days.split(' ');
    
    setSelectedDays(days[0]);
    let contract = await getContractObject(
      Singleton.getInstance().StakingContractAddress,
      STAKING_CONTRACT_ABI,
    );
    
    let rewardPercent = await contract.methods
      .rewardPercent(days[0] * TotalSeconds)
      .call();

    //console.warn('MM','rewardPercent  ==>>>', rewardPercent, rewardPercent / 100);
    setReward(rewardPercent / 100);
    let calRewards =
      inputAmount && reward
        ? inputAmount * (rewardPercent / 100 / 100) * (days[0] / 365)
        : 0;
        
    ////console.log(
    // '>>>>',
    //   inputAmount,
    //   rewardPercent / 100,
    //   days[0],
    //   'calRewards  ' + calRewards,
    // );
    setfinalRewards(calRewards);
    setLoading(false);
  } catch (error) {
    console.warn('MM' , 'error in reward' , error);
    setLoading(false)
    Singleton.showAlert(error?.message || constants.SOMETHING_WRONG)   
  }
  };

  const getFinalReward = inputAmount => {
    if (inputAmount > 0) {
      let calRewards =
        inputAmount && reward ? inputAmount * (reward / 100) * (days / 365) : 0;
      ////console.log(
      // '>>>>..oooo',
      //   inputAmount,
      //   reward / 100,
      //   days,
      //   'calRewards  ' + calRewards,
      //   );
      setfinalRewards(exponentialToDecimalWithoutComma(calRewards));
    } else {
      setfinalRewards(0);
    }
  };
  const getContractObject = async (tokenAddress, abi = TOKEN_CONTRACT_ABI) => {
    //console.warn('MM','tokenAddress:::getContractObject', tokenAddress);
    try {
      const web3Object = getWeb3Object();
      let tokenContractObject = await new web3Object.eth.Contract(
        abi,
        tokenAddress,
      );
      return tokenContractObject;
    } catch (e) {
      console.error('error ===>>', e);
    }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handler = useCallback(
    debounce(text => onChangeText(text), 350),
    [],
  );
  const getGasPrice = () => {
    getWeb3Object()
      .eth.getGasPrice()
      .then(gas => {
        ////console.log(
        // '-----------------gasPrice-----------',
        //   gas,
        //   'ethPvtKey::::',
        //   privateKey,
        //   );
        setGasPrice((parseInt(gas) + 4200703310).toString());
      });
  };
  const getTokenBalance = async (tokenAddress, address) => {
    try {
      //console.warn('MM','getTokenBalance ::::::', tokenAddress, address);
      const contract = await getContractObject(tokenAddress);
      let result = await contract.methods.balanceOf(address).call();
      //console.warn('MM','chk result::::::', result);
      return BigNumber(result);
    } catch (error) {
      //console.warn('MM','Error ==>> :', error);
      return error;
    }
  };
  const getUserBal = async userAddress => {
    try {
      //console.warn('MM','-------------userAddress-------------', userAddress);
      let userBal = await getTokenBalance(Singleton.getInstance().StakeSaitamaAddress, userAddress);
      //console.warn('MM','***********************', userBal);
      setUserBal(
        Singleton.getInstance().toFixed(userBal / 10 ** SAITAMA_DECEMALS, 8),
      );

      // Alert.alert(
      //   constants.APP_NAME,
      //   "Please wait for blockchain confirmation",
      //   [{
      //     text: 'OK', onPress: () => {
      //       goBack()

      //     }
      //   }
      //   ],
      //   { cancelable: false },
      // );
      //   const contract =   getWeb3Object()
      // //console.warn('MM','chk contract:::approve', contract);
      // const txnReceipt = await contract.eth.getTransactionReceipt('0x3ff160f4b8046b8da122a39eec0b46f72406ca010d8d4cb0f1dab5f57af7d4df')
      // //console.warn('MM','txnReceipt:::::111', txnReceipt);
      // //console.warn('MM','txnReceipt:::::2222', txnReceipt?.status);

      setLoading(false);
      return +userBal;
    } catch (error) {
      setLoading(false);
    }
  };

  const doStake = async () => {
    //console.warn('MM','--------------inside result---------------', result);
    setLoading(true);
    const web3Object = getWeb3Object();
    let stakingContract = await getContractObject(
      Singleton.getInstance().StakingContractAddress,
      STAKING_CONTRACT_ABI,
    );
    // const transactionNo = await contract.methods
    // .stakingTx(userAddress)
    // .call();

    let stakeTransaction = stakingContract.methods.stake(
      days * TotalSeconds,
      BigNumber(inputAmount) * 10 ** SAITAMA_DECEMALS,
    );
    let gasLimit = await stakeTransaction.estimateGas({
      from: userWalletAddress,
    });
    //console.warn('MM','gasLimit ===>>>', gasLimit);
    const nonce = await web3Object.eth.getTransactionCount(userWalletAddress);
    const result = await makeTransaction(
      stakeTransaction.encodeABI(),
      gasPrice,
      gasLimit + 10000,
      nonce,
      '0x0',
      Singleton.getInstance().StakingContractAddress,
      privateKey,
      userWalletAddress,
    );
    //console.warn('MM','--------------result---------------', result);
    setAllowancetxnObj({});
    getUserBal(userWalletAddress);
    setLoading(false);
    // setInputAmount('');
    Alert.alert(
      'Success',
      `Transaction is broadcasted successfully. Waiting for blockchain confirmation `,
      [
        {
          text: 'Ok',
          onPress: () => {
            goBack()
          },
        },
      ],
      { cancelable: false },
    );
    return result;
  };

  const makeTransaction = async (
    transactionData,
    gasPrice1,
    gasLimit,
    nonce,
    value,
    to,
    pvtKey,
    from,
  ) => {
    try {
      const web3Object = getWeb3Object();
      let rawTransaction = {
        gasPrice: gasPrice1,
        gasLimit: gasLimit,
        to: to,
        value: value,
        data: transactionData,
        nonce: nonce,
        from: from.toLowerCase(),
        chainId:  constants.network == 'testnet' ? parseInt(constants.CHAIN_ID_ETH) : 1,
      };
      //console.warn('MM','rawTransaction =>', rawTransaction);
      let txn = await web3Object.eth.accounts.signTransaction(
        rawTransaction,
        pvtKey,
      );
      let blockChain = blockChain;
      let data = {
        from: from.toLowerCase(),
        to: to,
        amount: isApproved ? inputAmount : 0,
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
      await sendTransactionToBackend(data);
      return result;
    } catch (err) {
      //console.warn('MM','sendSignedTransaction err', err);
      //console.warn('MM','sendSignedTransaction err', err.Error);
      Singleton.showAlert(err);
      setLoading(false);
      return;
    }
  };

  const sendTransactionToBackend = (
    data,
    blockChain = 'ethereum',
    coin_symbol = Singleton.getInstance().StakeSaitamaAddress,
  ) => {
    return new Promise((resolve, reject) => {
      let access_token = Singleton.getInstance().access_token;

      //console.warn('MM','eth data::::1111', data);
      ////console.log(
      // 'eth data::::2222',
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

  const onChangeText = value => {
 //  console.warn('MM',value);
    let a = value > 0;
    if (!a) {
      setLoading(false)
      return;
    }
    //console.warn('MM','inside onchangetext', value);
    return new Promise(async (resolve, reject) => {
      try {
        if (!value || parseFloat(value) <= 0) {
          //empty value
          setUserApproval(true);
          setInsufficientBalance(false);
          return;
        }
        //console.warn('MM','isApproved ======>> userBal', userBal, value);
        setLoading(true);
        if (userBal < value) {
          //console.warn('MM','isApproved ======>> userBal in false');
          setInsufficientBalance(true);
        } else {
          //console.warn('MM','isApproved ======>> userBal ouutttt false');
          setInsufficientBalance(false);
        }
        value = value * 10 ** SAITAMA_DECEMALS;
        const isApproved = await checkContractApproval(
          Singleton.getInstance().StakeSaitamaAddress,
          userAddress,
          Singleton.getInstance().StakingContractAddress,
          value,
        );
        //console.warn('MM','isApproved ======>>', isApproved);
        if (!isApproved) {
          let tokenContractObject = await getContractObject(
            Singleton.getInstance().StakeSaitamaAddress,
          );
          setAllowancetxnObj({ tokenContractObject: tokenContractObject });
          tokenContractObject.methods.approve(Singleton.getInstance().StakingContractAddress, BigNumber(10 ** 25).toFixed(0)).estimateGas({ from: userAddress })
            .then(gasEstimate => {
              //console.warn('MM',"gasEstimate::::::::", gasEstimate);
              setGasEstimate(gasEstimate + GAS_BUFFER);
              setLoading(false);
              //   setTransactionFee(
              //     Singleton.getInstance().toFixed(
              //       gasEstimate * gasPrice * GAS_FEE_MULTIPLIER,
              //       6,
              //     ),
              //   );
              return resolve(gasEstimate);
            })
            .catch(err => {
              //console.warn('MM','xx', err.message);
              setLoading(false);
              if (err.message.includes('insufficient funds')) {
                setInsufficientBalance(true);
              }
            });
          return resolve('');
        } else {
          setLoading(false);
          setLoading(true);
          let stakingContract = await getContractObject(
            Singleton.getInstance().StakingContractAddress,
            STAKING_CONTRACT_ABI,
          );
          if (!(daysSelectedIndex >= 0)) {
            return resolve('');
          }
          let time = days * TotalSeconds;
          //console.warn('MM','stakingContract time', time);
          ////console.log(
          // 'stakingContract estimate gas ',
          //   days,
          //   TotalSeconds,
          //   time,
          //   BigNumber(value).toFixed(0),
          //   );
          let gasEstimate = await stakingContract.methods
            .stake(time, BigNumber(value).toFixed(0))
            .estimateGas({ from: userAddress });
          //console.warn('MM','gasEstimate_Staking', gasEstimate);
          setLoading(false);
          setGasEstimate(gasEstimate + GAS_BUFFER);
          resolve('');
        }
      } catch (error) {
        setLoading(false);
        //console.warn('MM','onchnage text error', error);
        reject(error);
      }
    });
  };

  const checkContractApproval = async (
    contractAddress,
    userAddress,
    spenderAddress,
    amount,
  ) => {
    setUserApproval(false);
    let tokenContractObject = await getContractObject(contractAddress);
    let userTokenBal = await tokenContractObject.methods
      .balanceOf(userAddress)
      .call();
    //console.warn('MM','userTokenBal ==>>>', userTokenBal);
    let allowance = await tokenContractObject.methods
      .allowance(userAddress, spenderAddress)
      .call();
    //console.warn('MM','allowance ==>>>', allowance);
    if (BigNumber(allowance).toFixed(0) <= parseInt(amount)) {
      setUserApproval(false);
      return false;
    } else {
      setUserApproval(true);
      return true;
    }
  };

  const getApproval = () => {
    setLoading(true);
    approveTransaction(
      allownceTxnObj.tokenContractObject,
      Singleton.getInstance().StakingContractAddress,
      userAddress,
      Singleton.getInstance().StakeSaitamaAddress,
    )
      .then(resultApprove => {
        setLoading(false);
 //  console.warn('MM','approve send transaction response ==>>', resultApprove);
        Alert.alert(
          constants.APP_NAME,
          'Please wait for blockchain confirmation, Once Approved You can start Staking.',
          [
            {
              text: 'OK',
              onPress: () => {
                goBack();
              },
            },
          ],
          { cancelable: false },
        );
        setUserApproval(true);
      })
      .catch(err => {
        Alert.alert(constants.APP_NAME, 'Approval Failed');
        //console.warn('MM','approve send transaction err ==>>', err);
      })
      .finally(() => {
        setLoading(false);
      });

    // setLoading(true);
    // approveTransaction(allownceTxnObj.tokenContractObject, StakingContractAddress, userAddress, TokenContractAddress,)
    //   .then(resultApprove => {
    //     //console.warn('MM','chk contract::: resultApprove ', resultApprove);
    //     if (resultApprove) {
    //       setTimeout(async () => {
    //         const contract = getWeb3Object()
    //         //console.warn('MM','chk contract:::approve', contract);
    //         const txnReceipt = await contract.eth.getTransactionReceipt(resultApprove?.tx_hash || resultApprove?.transactionHash)
    //         //console.warn('MM','txnReceipt:::::', txnReceipt ,txnReceipt?.status);

    //         if (txnReceipt) {
    //           //console.warn('MM',"inputAmount:::",inputAmount);
    //           //console.warn('MM','txnReceipt::::: in ', txnReceipt?.status);
    //           if (txnReceipt?.status == true) {
    //             setUserApproval(true)
    //             onChangeText(inputAmount)
    //             Alert.alert(constants.APP_NAME, 'Approval Success')
    //             setLoading(false)
    //           } else {
    //             setUserApproval(false)
    //             Alert.alert(constants.APP_NAME, 'Approval Failed')
    //             setLoading(false)
    //           }
    //         }
    //         else {
    //           //console.warn('MM','txnReceipt::::: else ');
    //           setLoading(false)
    //           setUserApproval(false)
    //           Alert.alert(
    //             constants.APP_NAME,
    //             resultApprove?.message,
    //             [{
    //               text: 'OK', onPress: () => {
    //                 goBack()

    //               }
    //             }
    //             ],
    //             { cancelable: false },
    //           );
    //           setLoading(false)
    //         }

    //       }, 6000);
    //     }
    //     else {
    //       //console.warn('MM','txnReceipt:::::outside',);
    //       setTimeout(async () => {
    //         setUserApproval(false)
    //         setLoading(false)
    //         Alert.alert(
    //           constants.APP_NAME,
    //           "Please wait for blockchain confirmation",
    //           [{
    //             text: 'OK', onPress: () => {
    //               goBack()

    //             }
    //           }
    //           ],
    //           { cancelable: false },
    //         );

    //       }, 1000);
    //     }
    //     //console.warn('MM','approve send transaction response ==>>', resultApprove);

    //   })
    //   .catch(err => {
    //     //console.warn('MM','approve send transaction err ==>>', err);
    //   })
    //   .finally(() => {
    //     setLoading(false);
    //   });
  };
  const approveTransaction = async (
    tokenContractObject,
    spenderAddress,
    userAddress,
    tokenAddress,
  ) => {
    return new Promise(async (resolve, reject) => {
      try {
        //console.warn('MM','\n\n\n **** APPROVED TRANSACTION ALERT ***** \n\n\n');
        //console.warn('MM',spenderAddress, userAddress, tokenAddress);
        const web3Object = getWeb3Object();
        const approveTrans = tokenContractObject.methods.approve(
          spenderAddress,
          BigNumber(10 ** 25).toFixed(0),
        );
        //console.warn('MM',"approveTrans::::", approveTrans);
        const approveGasLimit = await approveTrans.estimateGas({
          from: userAddress,
        });
        //console.warn('MM','approveGasLimit ===>>>', approveGasLimit);
        const nonce = await web3Object.eth.getTransactionCount(
          userAddress,
          'latest',
        );

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
        return resolve(resultApprove);
      } catch (e) {
        //console.warn('MM','chk approve txn err::::', e);
        return reject(null);
      }
    });
  };

  const onPressSwap = async (gasPrice, gasEstimate) => {
    //console.warn('MM',"gasPrice::::", gasPrice);
    //console.warn('MM',"gasEstimate::::", gasEstimate);
    //console.warn('MM',"GAS_FEE_MULTIPLIER::::", GAS_FEE_MULTIPLIER);
    let txn_fee = gasPrice * gasEstimate * GAS_FEE_MULTIPLIER
    //console.warn('MM',"txn_fee::::", txn_fee);
    if (!isStakeButtonClicked) {
      isStakeButtonClicked = true;
      setTimeout(() => {
        isStakeButtonClicked = false;
      }, 1000);
      ////console.log(
      // '>>>> inputAmount ====',
      //   inputAmount,
      //   userBal,
      //   userWalletAddress,
      //   );
      if (inputAmount == undefined || inputAmount == 0) {
        Singleton.showAlert('Please enter amount to Stake');
      } else if (parseFloat(userBal) >= parseFloat(inputAmount)) {
        ////console.log(
        // '>>>> inputAmount ',
        //   inputAmount,
        //   userBal,
        //   userWalletAddress,
        //       );
        if (isApproved) {
          if (!(daysSelectedIndex >= 0)) {
            Singleton.showAlert('Please select number of days');
            return;
          }
          let totalFee = (gasPrice * gasEstimate).toFixed(0);
          const web3Object = getWeb3Object();
          let ethBal = await web3Object.eth.getBalance(userWalletAddress);
          //console.warn('MM','>>>> ethBal ', totalFee, ethBal);
          if (
            ethBal -
            Singleton.getInstance().exponentialToDecimal(totalFee) <
            0
          ) {
            Singleton.showAlert(
              "You don't have enough eth to perform transaction! Required " +
              (totalFee / 10 ** 18).toFixed(8) +
              ' Eth',
            );
            return;
          }
          Alert.alert(
            'Stake',
            `Pay ${(txn_fee).toFixed(6)} ETH transaction fee for staking.`,
            [
              {
                text: 'Approve',
                onPress: () => {
                  doStake();
                },
              },
              {
                text: 'Cancel',
                onPress: () => { },
              },
            ],
            { cancelable: false },
          );
        } else {
          let totalFee = (gasPrice * gasEstimate).toFixed(0);
          const web3Object = getWeb3Object();
          let ethBal = await web3Object.eth.getBalance(userAddress);
          if (
            ethBal -
            Singleton.getInstance().exponentialToDecimal(totalFee) <
            0
          ) {
            Singleton.showAlert(
              "You don't have enough ETH to perform transaction",
            );
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
            )} ETH transaction fee for token approval`,
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
        Singleton.showAlert("You don't have enough Saitama balance");
      }

    }


  }

  return (
    <View style={{ marginHorizontal: 20 }}>
      <Text
        style={[
          styles.balance,
          {
            color: ThemeManager.colors.textColor,
            fontSize: 14,
            fontFamily: fonts.semibold,
            marginBottom: 20,
          },
        ]}>
        {LanguageManager.duration}
      </Text>

      <ScrollView
        bounces={false}
        contentContainerStyle={{ flex: 1 }}
        alwaysBounceHorizontal={false}
        showsHorizontalScrollIndicator={false}
        horizontal={true}>
        {daysSelection.map((item, index) => {
          return (
            <>
              {daysSelectedIndex == index ? (
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
                  customGradient={{ borderRadius: 10, height: 40 }}
                  // colors={Singleton.getInstance().dynamicColor}
                  text={item.days}
                  textStyle={{ fontSize: 14, fontFamily: fonts.regular }}
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
                    setDaysSelectedIndex(index);
                    setDaysSelected(item.days);
                    getRewardPoints(index);
                  }}>
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: fonts.regular,
                      color:
                        daysSelectedIndex === index
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
      </ScrollView>
      <Text
        style={[
          styles.balance,
          {
            color: ThemeManager.colors.textColor,
            fontSize: 14,
            fontFamily: fonts.semibold,
            marginTop: 30,
          },
        ]}>
        {LanguageManager.lockedAmount}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          // height: 50,
          borderColor: ThemeManager.colors.amountBorder,
          borderWidth: 1,
          borderRadius: 10,
          width: '100%',
        }}>
        <TextInput
          style={[
            {
              height: 45,
              width: '65%',
              fontFamily: Fonts.regular,
              color: ThemeManager.colors.textColor,
              fontSize: 14,
              marginLeft: 10,
            },
          ]}
          maxLength={15}
          value={inputAmount}
          onChangeText={text => {
            var expression = new RegExp('^\\d*\\.?\\d{0,' + '}$');
            if (expression.test(text)) {
              setAmount(text);
              handler(text);
              getFinalReward(text);
            }
          }}
          placeholder={LanguageManager.enterAmount}
          placeholderTextColor={ThemeManager.colors.placeholderTextColor}
          keyboardType={'numeric'}
        // returnKeyType={'done'}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Image source={Images.saita} style={{ height: 20, width: 20 }} />
            <Text
              style={{
                fontSize: 13,
                fontFamily: fonts.regular,
                color: ThemeManager.colors.textColor,
                marginHorizontal: 5,
              }}>
              {'Saita'}
            </Text>
          </View>
          <View
            style={{
              height: 20,
              width: 1,
              backgroundColor: ThemeManager.colors.amountBorder,
            }}
          />
          <TouchableOpacity
            onPress={() => {
              setLoading(true)
              let amt = exponentialToDecimalWithoutComma(userBal)
              setAmount(isNaN(amt) ? 0 : amt);
              handler(userBal);
              getFinalReward(userBal);
            }}>
            <Text
              style={{
                fontSize: 13,
                fontFamily: fonts.regular,
                color: Colors.buttonColor5,
                marginHorizontal: 10,
              }}>
              {LanguageManager.max}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-end',
          marginTop: 10,
        }}>
        {/* <Text style={{ fontFamily: Fonts.regular, color: ThemeManager.colors.inactiveTextColor, fontSize: 12, }}>
            {LanguageManager.available}:{' '}
          </Text>
          <Text style={{ fontFamily: Fonts.regular, color: ThemeManager.colors.textColor,  fontSize: 12, }}>
            1,00,000 SAITA
          </Text> */}
      </View>
      <View style={{ marginTop: 30 }}>
        <ViewTable first={LanguageManager.apy} second={reward + '%'} />
        <ViewTable
          first={LanguageManager.lockInPeriod}
          second={days + ' Days'}
        />
        <ViewTable first={LanguageManager.finalRewards} second={finalRewards} />
      </View>
      <BasicButton
        onPress={async () => {
          onPressSwap(gasPrice, gasEstimate)
        }}
        // text={
        //   isInsufficientBalance
        //     ? 'Insufficient Balance'
        //     : isApproved
        //     ? 'Stake'
        //     : 'Approval'
        // }
        btnStyle={{
          marginHorizontal: 10,
          height: 50,
          justifyContent: 'center',
          borderRadius: 10,
          marginVertical: 70,
        }}
        customGradient={{
          borderRadius: 10,
          height: 50,
        }}
        text={isApproved ? 'Stake' : 'Approval'}
        textStyle={{ fontSize: 14, fontFamily: fonts.regular }}
      />
    </View>
  );
};
const ViewTable = ({ first, second }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 7,
      }}>
      <Text
        style={{
          fontFamily: Fonts.regular,
          color: colors.lightGrey2,
          fontSize: 12,
        }}>
        {first}
      </Text>
      <Text
        style={{
          fontFamily: Fonts.regular,
          color: ThemeManager.colors.textColor,
          fontSize: 12,
        }}>
        {second}
      </Text>
    </View>
  );
};
export default StakeView;
