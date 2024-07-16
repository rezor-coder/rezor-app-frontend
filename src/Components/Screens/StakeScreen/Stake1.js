/* eslint-disable react-native/no-inline-styles */
import { BigNumber } from 'bignumber.js';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Web3 from 'web3';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import { APIClient } from '../../../Api';
import * as constants from '../../../Constant';
import Singleton from '../../../Singleton';
import Colors from '../../../theme/Colors';
import { default as Fonts, default as fonts } from '../../../theme/Fonts';
import { BasicButton, CustomSwitch, SimpleHeader } from '../../common';
import { Wrap } from '../../common/Wrap';
import Loader from '../Loader/Loader';
import STAKING_CONTRACT_ABI from './SaitaABI.json';
import styles from './StakeStyle';
import StakeView from './StakeView';
import TOKEN_CONTRACT_ABI from './tokenContract.ABI.json';
import { goBack } from '../../../navigationsService';

const debounce = require('lodash.debounce');
const RowData = ({ text, customStyle }) => {
  //console.warn('MM','customStyle', customStyle);
  return (
    <Text
      style={[
        {
          flex: 1,
          fontSize: 12,
          fontFamily: fonts.regular,
          color: ThemeManager.colors.inactiveBtnText,
        },
        customStyle,
      ]}>
      {text}
    </Text>
  );
};


const daysSelection = [
  // {days: '0 Days', id: 0, selected: true},
  { days: '30 Days', id: 0, selected: true },
  { days: '60 Days', id: 1, selected: false },
  { days: '90 Days', id: 2, selected: false },
];
const SAITAMA_DECEMALS = 9;
// const TokenContractAddress = '0xCE3f08e664693ca792caCE4af1364D5e220827B2'; // saitama address
// const StakingContractAddress = '0x409353a02Ba3CCf60F3c503A6fd842a7A9C20782'; //proxy

// const TokenContractAddress = constants.StakeSaitamaAddress; // saitama address
// const StakingContractAddress = constants.StakingContractAddress; //proxy
const TotalSeconds = 86400;
const GAS_FEE_MULTIPLIER = 0.000000000000000001;
const GAS_BUFFER = 10000;

const Stake = props => {
  const [stakeSelected, setStakeSelected] = useState(true);
  const [daysSelected, setDaysSelected] = useState('15 Days');
  const [daysSelectedIndex, setDaysSelectedIndex] = useState(0);
  const [inputAmount, setAmount] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [privateKey, setPrivateKey] = useState('');
  const [userBal, setUserBal] = useState(0);
  const [gasPrice, setGasPrice] = useState(0);

  const [reward, setReward] = useState(0);
  const [days, setSelectedDays] = useState(30);
  const [finalRewards, setfinalRewards] = useState(0);
  const [isInsufficientBalance, setInsufficientBalance] = useState(false);
  const [isApproved, setUserApproval] = useState(true);
  const [gasEstimate, setGasEstimate] = useState(0);

  const [userWalletAddress, setUserWalletAddress] = useState('');
  const [allownceTxnObj, setAllowancetxnObj] = useState({});
  const [stakingArray, setStakingArray] = useState([]);

  //const [stakeIndex, setstakeIndex] = useState(0);
  let stakeIndexn = 0

  var userAddress = '';
  const getWeb3Object = () => {
    return constants.network == 'mainnet' ? new Web3(Singleton.getInstance().ethLink)
      : new Web3(constants.testnetEth);
    // 'https://data-seed-prebsc-1-s1.binance.org:8545/',)
  };

  useEffect(() => {

    userAddress = Singleton.getInstance().defaultEthAddress;
    setUserWalletAddress(userAddress);
    Singleton.getInstance()
      .newGetData(`${Singleton.getInstance().defaultEthAddress}_pk`)
      .then(ethPvtKey => {
        //console.warn('MM','ethPvtKey--------', ethPvtKey);
        setPrivateKey(ethPvtKey);
      });
    getUserBal(userAddress);
    // getStakingDays();
    getRewardPoints(0);
    getGasPrice();

    return () => { };
  }, []);

  const getUserBal = async userAddress => {
    try {
      //console.warn('MM','-------------userAddress-------------', userAddress);
      let userBal = await getTokenBalance(Singleton.getInstance().StakeSaitamaAddress, userAddress);
      console.warn('MM','***********************', userBal ,  +Singleton.getInstance().toFixed(userBal / 10 ** SAITAMA_DECEMALS, 8));
      setUserBal(
        +Singleton.getInstance().toFixed(userBal / 10 ** SAITAMA_DECEMALS, 8),
      );
      ////console.log(
      // 'user ethBal ===>>tok',
      //   userBal / 10 ** tokenFirst.decimals,
      //   'in wei ',
      //   userBal,
      // );
      setLoading(false);
      return +userBal;
    } catch (error) {
      setLoading(false);
    }
  };
  const getGasPrice = () => {
    getWeb3Object()
      .eth.getGasPrice()
      .then(gas => {
        // ////console.log(
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
  const getRewardPoints = async index => {
    try {
      if(global.disconnected){
        Singleton.showAlert(constants.NO_NETWORK)
        setLoading(false)
        return
      }
    
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
    //   );
    setfinalRewards(calRewards);
    setLoading(false);
    //  onChangeText(inputAmount);
  } catch (error) {
    setLoading(false);
  console.warn('MM','errrr' , error);   
  }
  };

  const getFinalReward = inputAmount => {
    let calRewards =
      inputAmount && reward ? inputAmount * (reward / 100) * (days / 365) : 0;
    ////console.log(
    // '>>>>..oooo',
    //   inputAmount,
    //   reward / 100,
    //   days,
    //   'calRewards  ' + calRewards,
    //   );
    setfinalRewards(calRewards);
    //  onChangeText(inputAmount);
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

  const getTheStake = async () => {
    try {
      console.warn('MM' , 'getTheStake');
      if(global.disconnected){
        Singleton.showAlert(constants.NO_NETWORK)
        setLoading(false)
        return
      }
    setLoading(true);
    const web3Object = getWeb3Object();
    let stakingContract = await getContractObject(
      Singleton.getInstance().StakingContractAddress,
      STAKING_CONTRACT_ABI,
    );
    //console.warn('MM','stakingContract >>', stakingContract);
    const transactionNo = await stakingContract.methods
      .stakingTx(userWalletAddress)
      .call();
    //console.warn('MM','transactionNo', transactionNo);
    let totalTransactions = transactionNo.txNo;
    //console.warn('MM','totalTransactions', totalTransactions);
    let array = [];
    //console.warn('MM','totalTransactions111');
    for (let i = 1; i <= totalTransactions; i++) {
      //console.warn('MM','totalTransactions2222');
      let transactionDetails = await stakingContract.methods
        .userTransactions(userWalletAddress, i)
        .call();
      //  //console.warn('MM',"transactionDetails", transactionDetails);
      //console.warn('MM','totalTransactions333');
      let transactionDetailsRewards = await stakingContract.methods
        .rewards(userWalletAddress, i)
        .call();
      //  //console.warn('MM',"transactionDetails", transactionDetails);
      array.push({
        amount: transactionDetails[0],
        lockInPeriod: transactionDetails[1],
        lockInUntil: transactionDetails[3],
        rewardsget: transactionDetailsRewards / 10 ** 9,
        isClaimed: transactionDetails[4],
        transactionNo: i,
      });
    }
    setLoading(false);
    array.reverse();
    //console.warn('MM','>>>>>>array', array);
    setStakingArray([...array]);
  } catch (error) {
    console.warn('MM','eror .. f' , error);
    setLoading(false)   
    Singleton.showAlert(error?.message || constants.SOMETHING_WRONG)
  }
  };

  const handler = useCallback(
    debounce(text => onChangeText(text), 1000),
    [],
  );

  const onChangeText = value => {
    return new Promise(async (resolve, reject) => {
      try {
        if (!value || parseFloat(value) <= 0) {
          //empty value
          setUserApproval(true);
          setInsufficientBalance(false);
          return;
        }
        if (userBal < value) {
          setInsufficientBalance(true);
        } else {
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
          tokenContractObject.methods
            .approve(Singleton.getInstance().StakingContractAddress, BigNumber(10 ** 25).toFixed(0))
            .estimateGas({ from: userAddress })
            .then(gasEstimate => {
              setGasEstimate(gasEstimate + GAS_BUFFER);
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
              //console.warn('MM','xx', err.message);
              setLoading(false);
              if (err.message.includes('insufficient funds')) {
                setInsufficientBalance(true);
              }
            });
          return resolve('');
        } else {
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
          //console.warn('MM','stakingContract estimate gas ', gasEstimate);
          setGasEstimate(gasEstimate + GAS_BUFFER);
          resolve('');
        }
      } catch (error) {
        //console.warn('MM','onchnage text error', error);
        reject(error);
      }
    });
  };

  const sendTransactionToBackend = (
    data,
    blockChain = 'ethereum',
    coin_symbol = Singleton.getInstance().StakeSaitamaAddress,
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

  const startTimer = timer => {
    const countDownDate = new Date(timer * 1000);
    const now = new Date().getTime();
    const difference = countDownDate - now;
    const days = Math.floor(difference / (24 * 60 * 60 * 1000));
    const hours = Math.floor(
      (difference % (24 * 60 * 60 * 1000)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((difference % (60 * 60 * 1000)) / (1000 * 60));
    const seconds = Math.floor((difference % (60 * 1000)) / 1000);
    ////console.warn('MM','the difference', difference);
    if (difference < 0) {

      //  daysLeft = false;
      var obj = {
        TimeText: 'Lockin period is over',
        dayLeft: false,
      };
      return obj;
      // setTimeLeft('Lockin period is over');
      // setleftdays(false)
      // return <>{'Lockin period is over'}</>;
    } else {
      ////console.warn('MM','the difference 1111111');
      var obj = {
        TimeText:
          days.toString().padStart(2, 0) +
          ':' +
          hours.toString().padStart(2, 0) +
          ':' +
          minutes.toString().padStart(2, 0),
        dayLeft: true,
      };
      return obj;
      //   return days.toString().padStart(2, 0) + ':' + hours.toString().padStart(2, 0) + ':' + minutes.toString().padStart(2, 0)
      // setleftdays(true)
      // setTimeLeft(days.toString().padStart(2, 0) + ':' + hours.toString().padStart(2, 0) + ':' + minutes.toString().padStart(2, 0) + ':' + seconds.toString().padStart(2, 0),);
    }
  };

  const askUnstake = async trans => {
    // alert(stakeIndex)
    try {
      setLoading(true);
      let stakingContract = await getContractObject(
        Singleton.getInstance().StakingContractAddress,
        STAKING_CONTRACT_ABI,
      );
      let claimTransaction = stakingContract.methods.claim(trans);
      let gasEstimate = await claimTransaction.estimateGas({
        from: userWalletAddress,
      });
      gasEstimate = gasEstimate + GAS_BUFFER;
      setLoading(false);
      Alert.alert(
        'Unstake',
        `Pay ${(
          gasPrice *
          gasEstimate *
          GAS_FEE_MULTIPLIER
        ).toFixed(
          6,
        )} ETH transaction fee for unstaking.`,
        [
          {
            text: 'Approve',
            onPress: () => {
              unStake(claimTransaction, gasEstimate);
            },
          },
          {
            text: 'Cancel',
            onPress: () => { },
          },
        ],
        { cancelable: false },
      );
    } catch (err) {
      //console.warn('MM','letsUnstake err', err);
      setLoading(false);
    }
  };

  const unStake = async (claimTransaction, gasLimit) => {
    //console.warn('MM','--------------unStake---------------', claimTransaction, gasLimit,   stakeIndexn);
    try {

      setLoading(true);
      const web3Object = getWeb3Object();

      const nonce = await web3Object.eth.getTransactionCount(userWalletAddress);
      const result = await makeTransaction(
        claimTransaction.encodeABI(),
        gasPrice,
        gasLimit,
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
      //   setInputAmount('');

      if (result == undefined || result == null) {
        //console.warn('MM','--------------result---------------11111', result);
        return
      }

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
    } catch (err) {
      //console.warn('MM','--------------err---------------', err);
      setLoading(false);
    }
  };


  const makeTransaction = async (transactionData, gasPrice, gasLimit, nonce, value, to, pvtKey, from,) => {
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
        chainId:  constants.network == 'testnet' ? parseInt(constants.CHAIN_ID_ETH)  : 1,
      };
      //console.warn('MM','rawTransaction =>', rawTransaction);
      let txn = await web3Object.eth.accounts.signTransaction(rawTransaction, pvtKey,);
      let blockChain = blockChain;
      let amountunstake = (stakingArray[stakeIndexn].amount) / 10 ** SAITAMA_DECEMALS
      //console.warn('MM','amountunstake =>', amountunstake);
      let data = {
        from: from.toLowerCase(),
        to: to,
        amount: amountunstake,
        gas_price: gasPrice,
        gas_estimate: gasLimit,
        tx_raw: txn.rawTransaction.slice(2),
        tx_type: 'WITHDRAW',
        nonce: nonce,
        chat: 0,
        is_smart: 1,
      };
      //console.warn('MM','serializedTran => data', data);
      let serializedTran = txn.rawTransaction.toString('hex');
      //console.warn('MM','serializedTran =>', serializedTran, data);
      let result = await getWeb3Object().eth.sendSignedTransaction(
        serializedTran,
      );
      data.tx_hash = result.transactionHash;
      await sendTransactionToBackend(data);
      return result;

    } catch (err) {
      setLoading(false);
      //console.warn('MM','sendSignedTransaction err', err);
      //console.warn('MM','sendSignedTransaction err', err.Error);
      if (err.toString().includes("insufficient funds for gas")) {
        Singleton.showAlert("Insufficient Funds")
      } else {
        Singleton.showAlert(err)
      }


      return;
    }
  };

  const ListData = () => {
    return (
      <FlatList
        data={stakingArray}
        // keyboardShouldPersistTaps={'handled'}us
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          var timeLeft = startTimer(item.lockInUntil);

          return (
            <>
              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginHorizontal: 20,
                  marginVertical: 10,
                }}>
                <View style={{ flex: 1, alignItems: 'flex-start' }}>
                  <Text
                    style={{
                      fontSize: 11,
                      fontFamily: fonts.regular,
                      color: ThemeManager.colors.textColor,
                    }}>
                    {item.amount / 10 ** SAITAMA_DECEMALS}
                  </Text>
                  <Text
                    style={{
                      fontSize: 11,
                      fontFamily: fonts.regular,
                      color: ThemeManager.colors.lightTextColor,
                    }}>
                    {'Saitama'}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 11,
                      fontFamily: fonts.regular,
                      color: ThemeManager.colors.textColor,
                    }}>
                    {item.rewardsget}
                  </Text>
                  <Text
                    style={{
                      fontSize: 11,
                      fontFamily: fonts.regular,
                      color: ThemeManager.colors.lightTextColor,
                    }}>
                    {'Saitama'}
                  </Text>
                </View>
                <View
                  style={{
                    alignItems: 'flex-start',
                    // marginRight: -30,
                    flex: 1,
                    paddingLeft: 30,
                  }}>
                  <Text
                    style={{
                      fontSize: 11,
                      fontFamily: fonts.regular,
                      color: ThemeManager.colors.textColor,
                    }}>
                    {item.lockInPeriod / TotalSeconds} Days
                  </Text>
                  <Text
                    style={{
                      fontSize: 11,
                      fontFamily: fonts.regular,
                      color: ThemeManager.colors.lightTextColor,
                      width: '60%',
                    }}>
                    {timeLeft.TimeText}
                  </Text>
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  {!item.isClaimed ? (
                    <BasicButton
                      onPress={() => {
                        if (!timeLeft.dayLeft) {
                          stakeIndexn = index
                          //  setstakeIndex(index)
                          askUnstake(item.transactionNo);
                        }
                      }}
                      btnStyle={{
                        height: 40,
                        justifyContent: 'center',
                        borderRadius: 10,
                        opacity: timeLeft.dayLeft ? 0.5 : 1,
                      }}
                      customGradient={{ borderRadius: 10, height: 30, width: 60 }}
                      text={'Unstake'}
                      textStyle={{
                        fontSize: 9,
                        fontFamily: fonts.regular,
                        color: Colors.White,
                      }}
                    />
                  ) : (
                    <TouchableOpacity
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: ThemeManager.colors.claimBtn,
                        borderRadius: 10,
                        height: 30,
                        width: 60,
                      }}>
                      <Text
                        style={{
                          fontSize: 9,
                          fontFamily: fonts.regular,
                          color: ThemeManager.colors.myEarn,
                        }}>
                        {'Claimed'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              <View
                style={{
                  borderBottomColor: Colors.borderColor,
                  borderBottomWidth: 0.2,
                  marginVertical: 5,
                  opacity: 0.4,
                  marginHorizontal: 20,
                }}
              />
            </>
          );
        }}
        ListEmptyComponent={() => {
          return (
            <View style={{ alignItems: 'center', marginTop: 30, }}>
              <Text style={{ color: ThemeManager.colors.textColor, fontFamily: Fonts.medium }}>No data available</Text>
            </View>
          );
        }}
      />
    );
  };
  return (
    <Wrap style={{ backgroundColor: ThemeManager.colors.backgroundColor }}>
      <SimpleHeader
        title={LanguageManager.stake}
        // rightImage={[styles.rightImgStyle]}
        backImage={ThemeManager.ImageIcons.iconBack}
        titleStyle
        imageShow
        back={false}
        backPressed={() => {
          props.navigation.goBack();
        }}
      />
      <View
        style={{ backgroundColor: Colors.borderColor, height: 0.2, opacity: 0.4 }}
      />
      <ScrollView>
        <CustomSwitch
          firstText={LanguageManager.stake}
          secondText={LanguageManager.getYourStaking}
          onPress={val => {
            //console.warn('MM','print value-==-=->>', val);

            setStakeSelected(val);
            if (!val) {
              getTheStake();
            }
          }}
        />
        <View
          style={[
            styles.mainContainer,
            { backgroundColor: ThemeManager.colors.btcBack },
          ]}>
          <Text style={[styles.earnStyle, { color: ThemeManager.colors.myEarn }]}>
            {LanguageManager.myEarnings}
          </Text>
          <Text
            style={[
              styles.balance,
              { color: ThemeManager.colors.textColor, fontFamily: Fonts.bold },
            ]}>
            {isNaN(userBal) ? '0' : Singleton.getInstance().exponentialToDecimal(userBal?.toString())}
          </Text>
          {/* <Text style={[styles.earnStyle, {color: ThemeManager.colors.myEarn}]}>
            {'$120.0'}
          </Text> */}
        </View>
        {stakeSelected ? (
          <StakeView
            loader={value => {
              setLoading(value);
            }}
          />
        ) : (
          <View>
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                marginHorizontal: 20,
              }}>
              <RowData text={LanguageManager.amount} />
              <RowData text={LanguageManager.Rewards} />
              <RowData
                text={LanguageManager.term}
                customStyle={{ paddingLeft: 25 }}
              />
              <RowData
                text={LanguageManager.action}
                customStyle={{ textAlign: 'center' }}
              />
            </View>
            <View
              style={{
                height: 2,
                width: '90%',
                backgroundColor: ThemeManager.colors.chooseBorder,
                marginTop: 10,
                opacity: 1,
                marginHorizontal: 20,
              }}
            />
            <ListData />
          </View>
        )}
      </ScrollView>
      {isLoading && <Loader />}
    </Wrap>
  );
};
export { Stake };
