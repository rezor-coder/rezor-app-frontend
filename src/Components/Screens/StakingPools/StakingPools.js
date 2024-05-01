import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, Alert } from 'react-native';
import { Actions } from 'react-native-router-flux';
import colors from '../../../theme/Colors';
import images from '../../../theme/Images';
import { BasicButton, Inputtext, MainHeader, SubHeader } from '../../common';
import LinearGradient from 'react-native-linear-gradient';
import { Wrap } from '../../common/Wrap';
import { styles } from './StakingPoolsStyle';
import fonts from '../../../theme/Fonts';
import {
  FlatList,
  ScrollView,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import Singleton from '../../../Singleton';
import TOKEN_CONTRACT_ABI from './tokenContract.ABI.json';
import STAKING_CONTRACT_ABI from './SaitaABI.json';
import Colors from '../../../theme/Colors';
import * as constants from '../../../Constant';
import Web3 from 'web3';
import { BigNumber } from 'bignumber.js';
import { ButtonPercentage } from '../../common/ButtonPercentage';
import { APIClient } from '../../../Api/APIClient';
import Loader from '../Loader/Loader';
import { ModalSwap } from '../../common/ModalSwap';
import { BASE_URL } from '../../../Endpoints';
const debounce = require('lodash.debounce');

const stakeData = [
  {
    StakeIcon: images.shirYo,
    coinImg: images.bitcoin,
    coinName: 'Earn Saitama',
    stakeBy: 'Stake $Saitama',
    stakeLock: 'Lock: 90 Days',
    StakeType: 'Earned',
    stakeValue: '0.0 ',
    earnevcurrency: '0 USD',
    month: 'Apr',
    percent: '2%',
    totalStaked: '44,899,045B',
    totalStakeby: '$Saitama',
    value: images.DownArw,
  },
  {
    StakeIcon: images.shirYo,
    coinImg: images.bitcoin,
    coinName: 'Earn Saitama',
    stakeBy: 'Stake $Saitama',
    stakeLock: 'Lock: 90 Days',
    StakeType: 'Earned',
    stakeValue: '0.0 ',
    earnevcurrency: '0 USD',
    month: 'Apr',
    percent: '2%',
    totalStaked: '44,899,045B',
    totalStakeby: '$Saitama',
    value: images.DownArw,
  },
  {
    StakeIcon: images.shirYo,
    coinImg: images.bitcoin,
    coinName: 'Earn Saitama',
    stakeBy: 'Stake $Saitama',
    stakeLock: 'Lock: 90 Days',
    StakeType: 'Earned',
    stakeValue: '0.0 ',
    earnevcurrency: '0 USD',
    month: 'Apr',
    percent: '2%',
    totalStaked: '44,899,045B',
    totalStakeby: '$Saitama',
    value: images.DownArw,
  },
  {
    StakeIcon: images.shirYo,
    coinImg: images.bitcoin,
    coinName: 'Earn Saitama',
    stakeBy: 'Stake $Saitama',
    stakeLock: 'Lock: 90 Days',
    StakeType: 'Earned',
    stakeValue: '0.0 ',
    earnevcurrency: '0 USD',
    month: 'Apr',
    percent: '2%',
    totalStaked: '44,899,045B',
    totalStakeby: '$Saitama',
    value: images.DownArw,
  },
];

// const userAddress = '0xf572c46e8899d3A0B84dfA2c961b3B294ae6189F';
// const userPrivateKey =
//   '6a957c4d079a8055650eec6b9dfa4ce65c781a5e2278f3d2d61065afe52e14f2';

// const userAddress = '0x370f21fC873105807f2143b43c7dCA20A182734d';
// const userPrivateKey =
//   '560b5fdf3201f876527db6555380436fd75058bc1fb15986025e4444011cb882';

const SAITAMA_DECEMALS = 9;
// const TokenContractAddress = '0x0eD81CAe766d5B1a4B3ed4DFbED036be13c6C09C'; testnet
//const StakingContractAddress = '0xd9bcc6474499B397707D3379595f2d27f47B3629'; testnet
// const TokenContractAddress = '0xCE3f08e664693ca792caCE4af1364D5e220827B2'; // saitama address
// const StakingContractAddress = '0x409353a02Ba3CCf60F3c503A6fd842a7A9C20782'; //proxy

const TotalSeconds = 86400;
const GAS_FEE_MULTIPLIER = 0.000000000000000001;
const GAS_BUFFER = 10000;

const StakingPools = () => {
  let userAddress = Singleton.getInstance().defaultEthAddress;
  const TokenContractAddress = Singleton.getInstance().StakeSaitamaAddress; // saitama address
  let StakingContractAddress = Singleton.getInstance().StakingContractAddress; //proxy

  //console.warn('MM','>>>> userAddress ', userAddress);
  const [isEnabled, setIsEnabled] = useState(false);
  const walletList = useSelector(state => state?.walletReducer?.myWallets);

  const [isLoading, setLoading] = useState(false);
  const [privateKey, setPrivateKey] = useState('');
  const [userBal, setUserBal] = useState(0);
  const [activeIndex, setActiveIndex] = useState();
  const [stakingDaysList, setStakingDaysList] = useState([]);
  const [inputAmount, setInputAmount] = useState();
  const [reward, setReward] = useState(0);
  const [gasEstimate, setGasEstimate] = useState(0);
  const [allownceTxnObj, setAllowancetxnObj] = useState({});
  const [transactionFee, setTransactionFee] = useState('0.00');
  const [isApproved, setUserApproval] = useState(true);
  const [gasPrice, setGasPrice] = useState(0);
  const [isInsufficientBalance, setInsufficientBalance] = useState(false);
  const [swapModal, setSwapModal] = useState(false);
  const [dataArray, setDataArray] = useState([]);

  useEffect(() => {
    userAddress = Singleton.getInstance().defaultEthAddress;
    Singleton.getInstance()
      .newGetData(`${Singleton.getInstance().defaultEthAddress}_pk`)
      .then(ethPvtKey => {
        //console.warn('MM','ethPvtKey--------', ethPvtKey);
        setPrivateKey(ethPvtKey);
      });
    getUserBal(userAddress);
    getStakingDays();
    getGasPrice();
    return () => { };
  }, []);

  useEffect(() => {
    getRewardPoints();
  }, [activeIndex]);

  const getGasPrice = () => {
    getWeb3Object()
      .eth.getGasPrice()
      .then(gas => {
        ////console.log(
        // '-----------------gasPrice-----------',
        //   gas,
        //   'ethPvtKey::::',
        //   privateKey,
        // );
        setGasPrice(gas);
      });
  };

  getRewardPoints = async () => {
    if (stakingDaysList.length > 0 && activeIndex >= 0) {
      let contract = await getContractObject(
        StakingContractAddress,
        STAKING_CONTRACT_ABI,
      );
      let rewardPercent = await contract.methods
        .rewardPercent(stakingDaysList[activeIndex] * TotalSeconds)
        .call();
      //console.warn('MM','rewardPercent  ==>>>', rewardPercent, rewardPercent / 100);
      setReward(rewardPercent / 100);
      onChangeText(inputAmount);
    }
  };

  getStakingDays = () => {
    setLoading(true);
    APIClient.getInstance()
      .get('wallet/logging/period', 'usertoken')
      .then(response => {
        //console.warn('MM','getStakingDays-- ', response.data);
        if (response.data?.length > 0) {
          setStakingDaysList(response.data);
        }
      })
      .catch(error => {
        //console.warn('MM','getStakingDays-- ', error);

        // ethereumFail(dispatch, error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const getWeb3Object = () => {
    return constants.network == 'mainnet'
      ? new Web3(
        'https://mainnet.infura.io/v3/39f09bbfb5754cd480eee6c763227883',
      )
      : new Web3(
        'https://rinkeby.infura.io/v3/39f09bbfb5754cd480eee6c763227883',
      ); // 'https://data-seed-prebsc-1-s1.binance.org:8545/',)
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

  const getUserBal = async userAddress => {
    try {
      //console.warn('MM','-------------userAddress-------------', userAddress);

      let userBal = await getTokenBalance(TokenContractAddress, userAddress);
      //console.warn('MM','***********************', userBal);

      setUserBal(
        +Singleton.getInstance().toFixed(userBal / 10 ** SAITAMA_DECEMALS, 8),
      );

      ////console.log(
      // 'user ethBal ===>>tok',
      //   userBal / 10 ** tokenFirst.decimals,
      //   'in wei ',
      //   userBal,
      //   );
      setLoading(false);
      return +userBal;
    } catch (error) {
      setLoading(false);
    }
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

  const approveTransaction = async (
    tokenContractObject,
    spenderAddress,
    userAddress,
    tokenAddress,
  ) => {
    //console.warn('MM','\n\n\n **** APPROVED TRANSACTION ALERT ***** \n\n\n');
    //console.warn('MM',spenderAddress, userAddress, tokenAddress);
    const web3Object = getWeb3Object();
    const approveTrans = tokenContractObject.methods.approve(
      spenderAddress,
      BigNumber(10 ** 25).toFixed(0),
    );
    const approveGasLimit = await approveTrans.estimateGas({ from: userAddress });
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
    return resultApprove;
  };

  const getApproval = () => {
    setLoading(true);
    approveTransaction(
      allownceTxnObj.tokenContractObject,
      StakingContractAddress,
      userAddress,
      TokenContractAddress,
    )
      .then(resultApprove => {
        //console.warn('MM','approve send transaction response ==>>', resultApprove);
        setUserApproval(true);
      })
      .catch(err => {
        //console.warn('MM','approve send transaction err ==>>', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const stake = async () => {
    setLoading(true);
    const web3Object = getWeb3Object();
    let stakingContract = await getContractObject(
      StakingContractAddress,
      STAKING_CONTRACT_ABI,
    );
    // const transactionNo = await contract.methods
    // .stakingTx(userAddress)
    // .call();
    let stakeTransaction = stakingContract.methods.stake(
      stakingDaysList[activeIndex] * TotalSeconds,
      BigNumber(inputAmount) * 10 ** SAITAMA_DECEMALS,
    );
    let gasLimit = await stakeTransaction.estimateGas({ from: userAddress });

    //console.warn('MM','gasLimit ===>>>', gasLimit);
    const nonce = await web3Object.eth.getTransactionCount(userAddress);
    const result = await makeTransaction(
      stakeTransaction.encodeABI(),
      gasPrice,
      gasLimit + 10000,
      nonce,
      '0x0',
      StakingContractAddress,
      privateKey,
      userAddress,
    );
    //console.warn('MM','--------------result---------------', result);
    setAllowancetxnObj({});
    getUserBal(userAddress);
    setLoading(false);
    setInputAmount('');

    Alert.alert(
      'Success',
      `Transaction is broadcasted successfully. Waiting for blockchain confirmation `,
      [
        {
          text: 'Ok',
          onPress: () => {
            // setInputAmount("")
          },
        },
      ],
      { cancelable: false },
    );
    return result;
  };

  const getTheStake = async () => {
    setLoading(true);
    const web3Object = getWeb3Object();
    let stakingContract = await getContractObject(
      StakingContractAddress,
      STAKING_CONTRACT_ABI,
    );
    //console.warn('MM','stakingContract >>', stakingContract);
    const transactionNo = await stakingContract.methods
      .stakingTx(userAddress)
      .call();
    //console.warn('MM','transactionNo', transactionNo);
    let totalTransactions = transactionNo.txNo;
    //console.warn('MM','totalTransactions', totalTransactions);
    let array = [];
    //console.warn('MM','totalTransactions111');
    for (let i = 1; i <= totalTransactions; i++) {
      //console.warn('MM','totalTransactions2222');
      transactionDetails = await stakingContract.methods
        .userTransactions(userAddress, i)
        .call();
      //  //console.warn('MM',"transactionDetails", transactionDetails);
      //console.warn('MM','totalTransactions333');
      let transactionDetailsRewards = await stakingContract.methods
        .rewards(userAddress, i)
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
    setDataArray([...array]);
  };

  const handler = useCallback(
    debounce(text => onChangeText(text), 500),
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
          TokenContractAddress,
          userAddress,
          StakingContractAddress,
          value,
        );
        //console.warn('MM','isApproved ======>>', isApproved);
        if (!isApproved) {
          let tokenContractObject = await getContractObject(
            TokenContractAddress,
          );
          setAllowancetxnObj({ tokenContractObject: tokenContractObject });
          tokenContractObject.methods
            .approve(StakingContractAddress, BigNumber(10 ** 25).toFixed(0))
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
            StakingContractAddress,
            STAKING_CONTRACT_ABI,
          );
          if (!(activeIndex >= 0)) {
            return resolve('');
          }
          let time = stakingDaysList[activeIndex] * TotalSeconds;
          //console.warn('MM','stakingContract time', time);
          ////console.log(
          // 'stakingContract estimate gas ',
          //   stakingDaysList[activeIndex],
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
        amount: value,
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

      // return await getWeb3Object().eth.sendSignedTransaction(serializedTran);

      let result = await getWeb3Object().eth.sendSignedTransaction(
        serializedTran,
      );

      data.tx_hash = result.transactionHash;
      await sendTransactionToBackend(data);
      return result;

      // return await dispatch(sendETH({ data, access_token, blockChain, coin_symbol })).then((res) => {
      //   setLoading(false)
      // }).catch((err) => {
      //   setLoading(false)
      //   Singleton.showAlert(err.message)
      // });
    } catch (err) {
      //console.warn('MM','sendSignedTransaction err', err);
      setLoading(false);
      return;
    }
  };

  const sendTransactionToBackend = (
    data,
    blockChain = 'ethereum',
    coin_symbol = TokenContractAddress,
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

  const letsUnstake = async trans => {
    try {
      setLoading(true);
      let stakingContract = await getContractObject(
        StakingContractAddress,
        STAKING_CONTRACT_ABI,
      );
      let claimTransaction = stakingContract.methods.claim(trans);
      let gasEstimate = await claimTransaction.estimateGas({ from: userAddress });
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
        )} ETH transaction fee for unstaking. `,
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
    try {
      setLoading(true);
      const web3Object = getWeb3Object();
      //console.warn('MM','gasLimit ===>>>', gasLimit);
      const nonce = await web3Object.eth.getTransactionCount(userAddress);
      const result = await makeTransaction(
        claimTransaction.encodeABI(),
        gasPrice,
        gasLimit,
        nonce,
        '0x0',
        StakingContractAddress,
        privateKey,
        userAddress,
      );
      //console.warn('MM','--------------result---------------', result);
      setAllowancetxnObj({});
      getUserBal(userAddress);
      setLoading(false);
      setInputAmount('');

      Alert.alert(
        'Success',
        `Transaction is broadcasted successfully. Waiting for blockchain confirmation `,
        [
          {
            text: 'Ok',
            onPress: () => {
              // setInputAmount("")
            },
          },
        ],
        { cancelable: false },
      );
      return result;
    } catch (err) {
      setLoading(false);
    }
  };

  //let finalRewards = inputAmount && reward ? (inputAmount * reward) / 100 : 0;
  let finalRewards =
    inputAmount && reward
      ? inputAmount * (reward / 100) * (stakingDaysList[activeIndex] / 365)
      : 0;

  return (
    <Wrap>
      <LinearGradient
        colors={['#000000', '#000000', '#1D1D1B', '#1D1D1B']}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}>
        <MainHeader
          onpress2={() =>
            Actions.currentScene != 'SelectBlockchain' &&
            Actions.SelectBlockchain({ blockChainsList: walletList })
          }
          onpress3={() => Singleton.showAlert('soon')}
          styleImg3={{ tintColor: '#B1B1B1' }}
          firstImg={images.Bell}
          secondImg={images.scan}
          thridImg={images.hamburger}
        />
        <View style={styles.roundView}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginVertical: 40,
                }}>
                <Text style={{ color: '#FFF', fontSize: 18 }}>
                  Saitama Balance: {userBal}
                </Text>
              </View>

              <Inputtext
                inputStyle={{
                  borderWidth: 1,
                  borderColor: Colors.fadeDot,
                  borderRadius: 5,
                  width: '100%',
                  color: Colors.white,
                }}
                style={{ paddingHorizontal: 0 }}
                keyboardType={'numeric'}
                placeholderTextColor={Colors.fadeDot}
                // labelStyle={styles.labelStyle}
                // label="Token Contract Address"
                placeholder="0.0000"
                defaultValue={''}
                onChangeNumber={text => {
                  setInputAmount(text);
                  handler(text);
                  // updateContractAddress(text);
                }}
              />

              <View
                style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                {stakingDaysList.map((item, index) => {
                  return (
                    <ButtonPercentage
                      customStyle={[
                        { borderWidth: 1, borderColor: Colors.buttonColor3 },
                        index == activeIndex && {
                          backgroundColor: Colors?.buttonColor2,
                        },
                      ]}
                      title={item + ' days'}
                      onPress={() => {
                        setActiveIndex(index);
                      }}
                    />
                  );
                })}
              </View>
              <Text style={{ color: '#FFF', fontSize: 18, marginTop: 30 }}>
                APY: {reward}%
              </Text>
              <Text style={{ color: '#FFF', fontSize: 18, marginTop: 5 }}>
                Lock-In Period:{' '}
                {activeIndex >= 0 ? stakingDaysList[activeIndex] : 0} Days
              </Text>
              <Text style={{ color: '#FFF', fontSize: 18, marginTop: 5 }}>
                Final Rewards: {finalRewards}
              </Text>
              <BasicButton
                onPress={async () => {
                  if (inputAmount == undefined || inputAmount == 0) {
                    Singleton.showAlert('Please enter amount to swap');
                  } else if (parseFloat(userBal) > parseFloat(inputAmount)) {
                    if (isApproved) {
                      if (!(activeIndex >= 0)) {
                        Singleton.showAlert('Please select number of days');
                        return;
                      }
                      let totalFee = (gasPrice * gasEstimate).toFixed(0);
                      const web3Object = getWeb3Object();
                      let ethBal = await web3Object.eth.getBalance(userAddress);

                      if (
                        ethBal -
                        Singleton.getInstance().exponentialToDecimal(
                          totalFee,
                        ) <
                        0
                      ) {
                        Singleton.showAlert(
                          "You don't have enough eth to perform transaction",
                        );
                        return;
                      }
                      Alert.alert(
                        'Stake',
                        `Pay ${(
                          gasPrice *
                          gasEstimate *
                          GAS_FEE_MULTIPLIER
                        ).toFixed(
                          6,
                        )} ETH transaction fee for staking. `,
                        [
                          {
                            text: 'Approve',
                            onPress: () => {
                              stake();
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
                        Singleton.getInstance().exponentialToDecimal(
                          totalFee,
                        ) <
                        0
                      ) {
                        Singleton.showAlert(
                          "You don't have enough eth to perform transaction",
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
                        )} ETH transaction fee for token approval.`,
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
                    Singleton.showAlert("You don't have enough balance");
                  }
                }}
                btnStyle={{ marginTop: 50 }}
                text={
                  isInsufficientBalance
                    ? 'Insufficient Balance'
                    : isApproved
                      ? 'Stake'
                      : 'Approval'
                }></BasicButton>
              <BasicButton
                onPress={() => {
                  getTheStake();
                }}
                btnStyle={{ marginVertical: 20 }}
                text={'Get your stakings'}></BasicButton>
              {dataArray?.length > 0 &&
                dataArray.map((item, index) => {
                  return (
                    <StakeItem
                      letsUnstake={letsUnstake}
                      item={item}
                      index={index}
                    />
                  );
                })}
            </>
          </ScrollView>
        </View>
      </LinearGradient>
      {isLoading && <Loader smallLoader={false} />}
    </Wrap>
  );
};

const checkDisable = (isClaimed, daysLeft, rewardsget) => {
  //console.warn('MM','>>>>> isClaimed', isClaimed, daysLeft, rewardsget);
  if (isClaimed) {
    //alert("0")
    //console.warn('MM','>>>>> isClaimed', isClaimed);
    return 0.5;
  } else if (!isClaimed) {
    if (daysLeft) {
      //console.warn('MM','>>>>> daysLeft', daysLeft);
      // alert("01")
      return 0.5;
    } else {
      //console.warn('MM','>>>>> daysLeft22222', daysLeft);
      //  alert("02")
      return 1;
    }
  }
};

const StakeItem = ({ item, index, letsUnstake }) => {
  const {
    amount,
    lockInPeriod,
    lockInUntil,
    rewardsget,
    isClaimed,
    transactionNo,
  } = item;

  let daysLeft = true;
  const [timeLeft, setTimeLeft] = useState('');
  const [leftdays, setleftdays] = useState(true);
  let intervalId = React.useRef(null);

  useEffect(() => {
    //console.warn('MM','lockInUntil>>>', lockInUntil);
    let timer = lockInUntil;
    startTimer(timer);

    // intervalId.current = setInterval(() => {
    //   startTimer(timer);
    // }, 1000);

    return () => {
      clearInterval(intervalId?.current);
    };
  }, [item]);

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
    //console.warn('MM','the difference', difference);
    if (difference < 0) {
      //console.warn('MM','the difference 00000000');
      daysLeft = false;
      setTimeLeft('Lockin period is over');
      setleftdays(false);
      // return <>{'Lockin period is over'}</>;
    } else {
      //console.warn('MM','the difference 1111111');
      setleftdays(true);
      setTimeLeft(
        days.toString().padStart(2, 0) +
        ':' +
        hours.toString().padStart(2, 0) +
        ':' +
        minutes.toString().padStart(2, 0) +
        ':' +
        seconds.toString().padStart(2, 0),
      );
    }
  };

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: Colors.buttonColor2,
        marginVertical: 2,
        borderRadius: 10,
        padding: 8,
      }}
      key={transactionNo + ''}>
      <Text style={{ color: '#FFF', fontSize: 18, marginTop: 5 }}>
        Stake Amount: {amount / 10 ** SAITAMA_DECEMALS} Saitama
      </Text>
      <Text style={{ color: '#FFF', fontSize: 18, marginTop: 5 }}>
        Locked in Period: {lockInPeriod / TotalSeconds} Days
      </Text>
      <Text style={{ color: '#FFF', fontSize: 18, marginTop: 5 }}>
        Locked in Until: {timeLeft}
      </Text>
      <Text style={{ color: '#FFF', fontSize: 18, marginTop: 5 }}>
        Rewards: {rewardsget + ' Saitama'}
      </Text>
      <BasicButton
        //!isClaimed && !daysLeft
        //disabled={checkDisable(isClaimed, daysLeft)}
        // disabled={true}

        onPress={() => {
          //alert("ssss" +isClaimed +" "+ daysLeft)
          if (isClaimed == false && daysLeft == false) {
            letsUnstake(transactionNo);
          }
        }}
        //   btnStyle={{ marginVertical: 20, opacity: isClaimed && !daysLeft ? 1 : 0.5 }}
        btnStyle={{
          marginVertical: 20,
          opacity: checkDisable(isClaimed, leftdays, rewardsget),
        }}
        text={isClaimed ? 'Claimed' : `Unstake`}></BasicButton>
    </View>
  );
};

// const StakingPools = () => {
//   const [isEnabled, setIsEnabled] = useState(false);
//   const walletList = useSelector(state => state?.walletReducer?.myWallets);
//   const toggleSwitch = () => setIsEnabled(previousState => !previousState);
//   return (
//     <Wrap>
//       <LinearGradient
//         colors={['#000000', '#000000', '#1D1D1B', '#1D1D1B']}
//         style={{ flex: 1 }}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 0 }}>
//         <MainHeader
//           onpress2={() => Actions.currentScene != 'SelectBlockchain' && Actions.SelectBlockchain({ blockChainsList: walletList })}
//           onpress3={() => alert('soon')}
//           styleImg3={{ tintColor: '#B1B1B1' }}
//           firstImg={images.Bell}
//           secondImg={images.scan}
//           thridImg={images.hamburger}
//         />
//         <View style={styles.roundView}>
//           <View style={{ marginLeft: 13, marginRight: 13 }}>
//             <View style={{ marginLeft: 5, marginVertical: 18 }}>
//               <Text style={{ fontFamily: fonts.light, fontSize: 14, color: colors.white }}>
//                 Staking pools
//               </Text>
//             </View>
//             <View style={styles.mainRow}>
//               <TouchableOpacity>
//                 <Image source={images.boxicon} style={styles.img1} />
//               </TouchableOpacity>
//               <TouchableOpacity>
//                 <Image source={images.box2} style={styles.img2} />
//               </TouchableOpacity>
//               <View style={styles.toogleView}>
//                 <Switch
//                   style={{ transform: [{ scaleX: 0.5 }, { scaleY: 0.5 }] }}
//                   trackColor={{ false: 'black', true: '#fff' }}
//                   thumbColor={isEnabled ? 'black' : '#f4f3f4'}
//                   ios_backgroundColor="#fff"
//                   onValueChange={toggleSwitch}
//                   value={isEnabled}
//                 />
//               </View>
//               <View>
//                 <Text style={{ fontSize: 8, color: colors.fadeDot }}>
//                   Staked only
//                 </Text>
//               </View>
//               <View style={styles.livetext}>
//                 <Text style={{ fontSize: 8 }}>Live</Text>
//               </View>
//               <View>
//                 <Text style={{ fontSize: 8, color: colors.fadeDot }}>
//                   Finished
//                 </Text>
//               </View>
//               <View>
//                 <Text style={{ fontSize: 8, color: colors.fadeDot }}>
//                   Short by
//                 </Text>
//               </View>
//               <View style={styles.dropDownView}>
//                 <TouchableOpacity
//                   onPress={() => alert('open soon')}
//                   style={styles.Row}>
//                   <Text style={{ fontSize: 8, color: colors.Darkbg }}>Hot</Text>
//                   <TouchableOpacity onPress={() => alert('open soon')}>
//                     <Image
//                       source={images.DownArw}
//                       style={{ height: 5, width: 7, resizeMode: "contain" }}
//                     />
//                   </TouchableOpacity>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>

//           <View style={styles.listView}>
//             <FlatList
//               data={stakeData}
//               renderItem={({ item }) => (
//                 <View style={styles.listRow}>
//                   <View
//                     style={{ alignItems: 'center', justifyContent: 'center' }}>
//                     <Image
//                       source={item.StakeIcon}
//                       style={{ height: 40, width: 40 }}
//                     />
//                   </View>

//                   <View>
//                     <Text style={styles.textStyle}>{item.coinName}</Text>
//                     <Text style={[styles.textStyle, { color: colors.darkFade }]}>
//                       {item.stakeBy}
//                     </Text>
//                     <Text style={[styles.textStyle, { color: colors.pink }]}>
//                       {item.stakeLock}
//                     </Text>
//                   </View>

//                   <View>
//                     <Text style={styles.textStyle}>{item.StakeType}</Text>
//                     <Text style={[styles.textStyle, { color: colors.darkFade }]}>
//                       {item.stakeValue}
//                     </Text>
//                     <Text style={[styles.textStyle, { color: colors.darkFade }]}>
//                       {item.earnevcurrency}
//                     </Text>
//                   </View>

//                   <View>
//                     <Text style={styles.textStyle}>{item.month}</Text>
//                     <Text style={[styles.textStyle, { color: colors.darkFade }]}>
//                       {item.percent}
//                     </Text>
//                   </View>

//                   <View>
//                     <Text style={styles.textStyle}>{'Total staked'}</Text>
//                     <Text style={[styles.textStyle, { color: colors.darkFade }]}>
//                       {item.totalStaked}
//                     </Text>
//                     <Text style={[styles.textStyle, { color: colors.darkFade }]}>
//                       {item.totalStakeby}
//                     </Text>
//                   </View>
//                   <View
//                     style={{ alignItems: 'center', justifyContent: 'center' }}>
//                     <Image
//                       source={item.value}
//                       style={styles.downImg}
//                     />
//                   </View>
//                 </View>
//               )}
//             />
//           </View>

//           <TouchableOpacity
//             onPress={() => alert('soon')}
//             style={{
//               flexDirection: 'row',
//               alignSelf: 'flex-end',
//               marginTop: 10,
//             }}>
//             <Image
//               source={images.learnMore}
//               style={{
//                 width: 200,
//                 height: 30,
//                 resizeMode: 'contain',
//                 marginRight: 15,
//               }}
//             />
//             {/* <Text style={{marginTop:10,color:colors.pink, alignSelf:'flex-end', marginRight:10}}>Learn more about the Staking</Text> */}
//           </TouchableOpacity>
//         </View>
//       </LinearGradient>
//     </Wrap>
//   );
// };

export default StakingPools;
