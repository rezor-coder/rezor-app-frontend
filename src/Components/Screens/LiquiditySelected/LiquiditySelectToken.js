import { View, Text, SafeAreaView, TouchableOpacity, Image, Dimensions } from 'react-native';
import React, { useState } from 'react';
import { ButtonPrimary, CustomDropdown, SimpleHeader, Wrap } from '../../common';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import { Images } from '../../../theme';
import styles from './style';
import { useEffect } from 'react';
import { Actions } from 'react-native-router-flux';
import SAITAROUTER_ABI from '../../../../ABI/saitaFactory.ABI.json';
import TOKEN_ABI from '../../../../ABI/tokenContract.ABI.json';
import PAIR_ABI from '../../../../ABI/Pair.ABI.json';
import Loader from '../Loader/Loader';
import Web3 from 'web3';
import Singleton from '../../../Singleton';
import * as constants from '../../../Constant';

// let factoryAddress = constants.SwapFactoryAddress;

function LiquiditySelectToken(props) {
  let factoryAddress = Singleton.getInstance().SwapFactoryAddress;

  const { coinList } = props;
  const [selectedToCoin, setSelectedToCoin] = useState(coinList[0]);
  const [selectedFromCoin, setSelectedFromCoin] = useState(coinList[1]);
  const [fromList, setFromList] = useState([]);
  const [pairBalance, setPairBalance] = useState(0);
  const [pairNonce, setPairNonce] = useState(0);
  const [firstTokenSupply, setFirstTokenSupply] = useState(0);
  const [secondTokenSupply, setSecondTokenSupply] = useState(0);
  const [poolSupply, setPoolSupply] = useState(0);
  const [resultPair, setresultPair] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [showContinue, setShowContinue] = useState(false);
  let userAddress = Singleton.getInstance().defaultEthAddress;

  const [FilteredCoinOne, setFilteredCoinOne] = useState([]);
  const [FilteredCoinTwo, setFilteredCoinTwo] = useState([]);

  useEffect(() => {
    // let newList = coinList.filter(res => res.coin_symbol != selectedToCoin?.coin_symbol,);
    factoryAddress = Singleton.getInstance().SwapFactoryAddress
    setSelectedFromCoin(coinList[1]);
    setFromList(coinList);
    checkPair(selectedToCoin, selectedFromCoin)
  }, []);

  const getWeb3Object = () => {
    let network = new Web3(Singleton.getInstance().ethLink);
    return network;
  };

  const getContractObject = async (tokenAddress, abi = TOKEN_ABI) => {
    try {
      const web3Object = getWeb3Object();
      let tokenContractObject = await new web3Object.eth.Contract(abi, tokenAddress,);
      return tokenContractObject;
    } catch (e) {
      console.error('error ===>>', e);
    }
  };

  const checkPair = async (selectedToCoin, selectedFromCoin) => {
    //console.warn('MM','checkPair ===>>');
    setLoading(true)
    let routerContractObject = await getContractObject(factoryAddress, SAITAROUTER_ABI,);
    // console.error('routerContractObject ===>>', routerContractObject);
    let resultPair = await routerContractObject.methods
      .getPair(selectedToCoin.token_address, selectedFromCoin.token_address)
      .call();
    //console.warn('MM','resultPair ===>>', resultPair, selectedToCoin.token_address, selectedFromCoin.token_address);
    if (resultPair == "0x0000000000000000000000000000000000000000") {
      setShowContinue(false);
      Singleton.showAlert("No Pool Found.")
      setLoading(false);
    } else {
      setresultPair(resultPair)
      const contract = await getContractObject(resultPair);
      // get pair balance
      let pairBalance = await contract.methods.balanceOf(userAddress).call();
      let totalSupply = await contract.methods.totalSupply().call();
      //console.warn('MM','pairBalance ===>>', pairBalance, totalSupply);
      setPairBalance(pairBalance)
      //get reserve
      let PairrouterContractObject = await getContractObject(resultPair, PAIR_ABI,);
      const web3Object = getWeb3Object();

      var nonce = await web3Object.eth.getTransactionCount(userAddress, 'latest');
      setPairNonce(nonce)
      //console.warn('MM','nonce ===>>', nonce, userAddress);
      let reserve = await PairrouterContractObject.methods.getReserves().call();
      let reserve0 = reserve._reserve0;
      let reserve1 = reserve._reserve1;
      let Token0 = await PairrouterContractObject.methods.token0().call();
      let Token1 = await PairrouterContractObject.methods.token1().call();
      const Token0AddressObject = coinList.find(o => o.token_address.toLowerCase() == Token0.toLowerCase())
      let decimal0 = Token0AddressObject.decimals;
      const Token1AddressObject = coinList.find(o => o.token_address.toLowerCase() == Token1.toLowerCase())
      let decimal1 = Token1AddressObject.decimals;
      let value0 = reserve0 / (10 ** decimal0);
      let value1 = reserve1 / (10 ** decimal1);
      setFilteredCoinOne(Token0AddressObject)
      setFilteredCoinTwo(Token1AddressObject)

      let firstTokenSupply = (value0 / totalSupply) * pairBalance
      let secondTokenSupply = (value1 / totalSupply) * pairBalance
      let totalPool = (pairBalance / totalSupply) * 100
      setFirstTokenSupply(firstTokenSupply)
      setSecondTokenSupply(secondTokenSupply)
      setPoolSupply(totalPool)
      //console.warn('MM',">>>>> result  resultPair getReserves >> ", reserve0, reserve1, Token0, Token1, value0, value1, firstTokenSupply, secondTokenSupply, totalPool);



      if (pairBalance == 0) {
        Singleton.showAlert("You have not added Liquidity for this pair.")
        setShowContinue(false)
        setLoading(false);
        return
      } else {
        setShowContinue(true)
        setLoading(false);
      }

    }

  }



  return (
    <Wrap style={{ backgroundColor: ThemeManager.colors.backgroundColor }}>
      <SimpleHeader
        title={LanguageManager.selectToken}
        backImage={ThemeManager.ImageIcons.iconBack}
        titleStyle
        imageShow
        back
      />
      <View style={styles.wrap}>
        <CustomDropdown
          onItemSelect={item => {
            if (item.coin_symbol != selectedFromCoin.coin_symbol) {

              setSelectedToCoin(item);
              checkPair(item, selectedFromCoin)
            }
          }}
          data={coinList}
          selectedItem={selectedToCoin}
        />
        <View style={styles.addBtn}>
          <Image source={Images.addImage} />
        </View>
        <CustomDropdown
          onItemSelect={item => {
            if (item.coin_symbol != selectedToCoin.coin_symbol) {
              setSelectedFromCoin(item);
              checkPair(selectedToCoin, item)

            }
          }}
          data={fromList}
          selectedItem={selectedFromCoin}
        />
        <Text style={styles.liquidityTxt}>
          Select a token to find your liquidity.
        </Text>
        {showContinue && <ButtonPrimary
          onpress={() => {
            Actions.currentScene != 'RemoveLiquidity' &&
              Actions.RemoveLiquidity({
                selectedToCoin, selectedFromCoin, pairBalance, firstTokenSupply, secondTokenSupply, poolSupply, resultPair, pairNonce,
                FilteredCoinOne, FilteredCoinTwo
              });
          }}
          btnstyle={styles.continueBtn}
          text={LanguageManager.continue}
        />
        }
      </View>
      {isLoading && (
        <Loader
          smallLoader={false}
          customheight={{ height: Dimensions.get('window').height }}
        />
      )}
    </Wrap>

  );
}

export { LiquiditySelectToken };
