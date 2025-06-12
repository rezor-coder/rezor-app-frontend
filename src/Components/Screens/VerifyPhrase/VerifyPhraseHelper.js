import Singleton from '../../../Singleton';
import * as Constants from '../../../Constant';
import {getCurrentRouteName, navigate} from '../../../navigationsService';
import {NavigationStrings} from '../../../Navigation/NavigationStrings';

const nextPressed = async (
  existingWallets,
  setisLoading,
  selectedArray,
  arr,
  DATA,
  props,
  walletName,
) => {
  setisLoading(true);

  try {
    // Map selectedArray to mnemonicsArr
    const mnemonicsArr = selectedArray?.map(item => item.name);
    console.log('selectedArray:::::', mnemonicsArr);

    // Check if the mnemonics array matches
    if (JSON.stringify(arr) !== JSON.stringify(mnemonicsArr)) {
      setisLoading(false);
      Singleton.showAlert(Constants.VALID_MNEMONICS_ARRANGE);
      return;
    }

    // Prepare wallet addresses
    const walletAddresses = [
      {
        coin_symbol: Constants.COIN_SYMBOL.ETH,
        wallet_address: DATA?.ethAddress,
      },
      {
        coin_symbol: Constants.COIN_SYMBOL.BNB,
        wallet_address: DATA?.ethAddress,
      },
      // {
      //   coin_symbol: Constants.COIN_SYMBOL.STC,
      //   wallet_address: DATA?.ethAddress,
      // },
      {
        coin_symbol: Constants.COIN_SYMBOL.BTC,
        wallet_address: DATA?.btcAddress,
      },
      {
        coin_symbol: Constants.COIN_SYMBOL.MATIC,
        wallet_address: DATA?.ethAddress,
      },
      {
        coin_symbol: Constants.COIN_SYMBOL.TRX,
        wallet_address: DATA?.trxAddress,
      },
      {
        coin_symbol: Constants.COIN_SYMBOL.SOL,
        wallet_address: DATA?.solAddress,
      },
    ];

    // Prepare data for the createWallet API call
    const address = DATA.ethAddress;
    // const walletName = walletName;
    const deviceToken = Singleton.getInstance().device_token;

    // Call createWallet API
    const response = await props.createWallet({
      address,
      wallet_addresses: walletAddresses,
      wallet_name: walletName,
      device_token: deviceToken,
    });

    console.log('-------props-r22es----', JSON.stringify(response));

    const token = response.data.token;
    const refreshToken = response.data.refreshToken;

    // Prepare and save data
    const data = {
      address: DATA.ethAddress,
      btcAddress: DATA?.btcAddress,
      trxAddress: DATA?.trxAddress,
      solAddress: DATA?.solAddress,
      addresses: [
        DATA.ethAddress,
        DATA.btcAddress,
        DATA.trxAddress,
        DATA.solAddress,
      ],
      wallet_addresses: walletAddresses,
      wallet_name: walletName,
      walletName: walletName,
      device_token: deviceToken,
    };

    const loginData = {
      access_token: token,
      defaultEthAddress: DATA.ethAddress,
      defaultBnbAddress: DATA.ethAddress,
      defaultStcAddress: DATA.ethAddress,
      defaultMaticAddress: DATA.ethAddress,
      defaultBtcAddress: DATA.btcAddress,
      defaultTrxAddress: DATA.trxAddress,
      defaultSolAddress: DATA.solAddress,
      walletName: walletName,
    };

    const addrsListKeys = [
      DATA.ethAddress,
      DATA.btcAddress,
      DATA.trxAddress,
      DATA.solAddress,
    ];
    const coinFamilyKeys = [1, 2, 6, 11, 3, 4, 8];

    const walletData = {
      walletName: walletName,
      mnemonics: DATA.mnemonics,
      loginRequest: data,
      defaultWallet: props.route?.params?.isFrom !== 'multiWallet',
      user_jwtToken: token,
      blockChain: 'all',
      login_data: loginData,
      refreshToken: refreshToken,
    };

    // Update Singleton and save data
    const singleton = Singleton.getInstance();
    await Promise.all([
      singleton.newSaveData(
        Constants.addresKeyList,
        JSON.stringify(addrsListKeys),
      ),
      singleton.newSaveData(Constants.login_data, JSON.stringify(loginData)),
      singleton.newSaveData(Constants.coinFamilyKeys, coinFamilyKeys),
      singleton.newSaveData(Constants.access_token, token),
      singleton.newSaveData(Constants.refresh_token, refreshToken),
      singleton.newSaveData(
        Constants.ACTIVE_WALLET,
        JSON.stringify(walletData),
      ),
      singleton.newSaveData(Constants.IS_PRIVATE_WALLET, '0'),
      singleton.newSaveData(Constants.UPDATE_ASYNC_KEY, 'true'),
      singleton.newSaveData(
        Constants.multi_wallet_array,
        JSON.stringify([...existingWallets, walletData]),
      ),
    ]);

    // Update Singleton instance
    Object.assign(singleton, {
      access_token: token,
      defaultEthAddress: DATA.ethAddress,
      defaultMaticAddress: DATA.ethAddress,
      defaultBnbAddress: DATA.ethAddress,
      defaultBtcAddress: DATA.btcAddress,
      defaultTrxAddress: DATA.trxAddress,
      defaultStcAddress: DATA.ethAddress,
      defaultSolAddress: DATA.solAddress,
      walletName: walletName,
    });

    const currentRoute = getCurrentRouteName();
    const destination =
      props.route?.params?.isFrom === 'multiWallet'
        ? NavigationStrings.MultiWalletList
        : NavigationStrings.Congrats;

    if (currentRoute !== destination) {
      navigate(destination);
    }
  } catch (err) {
    Singleton.showAlert(err.message);
  } finally {
    setisLoading(false);
  }
};

export const checkExistingWallet = (
  setisLoading,
  selectedArray,
  arr,
  DATA,
  props,
  walletName,
) => {
  //nextPressed()
  if (props.route?.params?.isFrom === 'multiWallet') {
    Singleton.getInstance()
      .newGetData(Constants.multi_wallet_array)
      .then(res => {
        let data = JSON.parse(res);

        nextPressed(
          data,
          setisLoading,
          selectedArray,
          arr,
          DATA,
          props,
          walletName,
        );
      });
  } else {
    nextPressed([], setisLoading, selectedArray, arr, DATA, props, walletName);
  }
};

const shuffle = array => {
  let currentIndex = array.length;
  let randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

export const shuffledArrayFxn = (arr, setShuffledArray) => {
  const shuffleArr = shuffle(arr);
  console.log('MM', 'shuffleArr', shuffleArr, typeof shuffleArr);
  let jumbleMnemonicsArray = shuffleArr.map((item, index) => {
    return {
      id: index,
      name: item,
    };
  });
  setShuffledArray(jumbleMnemonicsArray);
};
