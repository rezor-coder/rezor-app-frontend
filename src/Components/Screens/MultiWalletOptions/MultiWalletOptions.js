/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { ThemeManager } from '../../../../ThemeManager';
import * as Constants from '../../../Constant';
import { BASE_IMAGE } from '../../../Endpoints';
import { NavigationStrings } from '../../../Navigation/NavigationStrings';
import Singleton from '../../../Singleton';
import { heightDimen } from '../../../Utils/themeUtils';
import { getCurrentRouteName, goBack, navigate } from '../../../navigationsService';
import { Colors } from '../../../theme';
import Images from '../../../theme/Images';
import {
  SimpleHeader,
  WalletItem
} from '../../common';
import { BorderLine, Wrap } from '../../common/index';
import Loader from '../Loader/Loader';

const MultiWalletOptions = () => {
  const [List, setList] = useState([]);
  const [isLoader,setIsLoader] = useState(true);

  useEffect(() => {
    Singleton.getInstance()
      .newGetData(Constants.withoutTokenList)
      .then(withoutTokenList => {
        console.warn(
          'MM',
          'chk withoutTokenList:::::',
          JSON.parse(withoutTokenList),
        );
        setIsLoader(false)
        setList(JSON.parse(withoutTokenList));
        //  this.setState({ wallet_Array: JSON.parse(withoutTokenList) })
      }).catch(error=>{
        setIsLoader(false)
      });
  }, []);

  return (
    <Wrap style={{backgroundColor: ThemeManager.colors.backgroundColor}}>
      <SimpleHeader
        back={false}
        backPressed={() => goBack()}
        title={'Import Wallet'}
      />
      <BorderLine
        borderColor={{backgroundColor: ThemeManager.colors.viewBorderColor}}
      />
      <WalletItem
        style={{borderBottomWidth: 0, marginBottom: heightDimen(-10)}}
        onPress={() =>
          getCurrentRouteName() != 'ImportWallet' &&
          navigate(NavigationStrings.ImportWallet,{isFrom: 'multiWallet'})
        }
        imgbck={Colors.saitabg}
        iconimg={Images.walletIcon}
        title={'Multi-Coin Wallet'}
        showImg={true}
      />
      <BorderLine
        borderColor={{backgroundColor: ThemeManager.colors.viewBorderColor}}
      />
      <View style={{marginTop: 5}}>
        <FlatList
          bounces={false}
          data={List}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={()=><BorderLine/>}
          ListFooterComponent={()=>{
            if(!isLoader){
             return   <BorderLine />;
            }
          
        }}
          renderItem={({item, index}) => (
            <WalletItem
              onPress={() =>
                getCurrentRouteName() != 'MultiWalletImportSingleCoin' &&
                navigate(NavigationStrings.MultiWalletImportSingleCoin,{
                  coin_symbol: item.coin_symbol,
                })
              }
              style={{borderBottomWidth: 0, marginBottom: heightDimen(-10)}}
              emptyUrl={item.coin_image == '' ? true : false}
              ImgText={item.coin_symbol?.charAt(0)}
              imgbck={Colors.White}
              iconimg={{
                uri: item.coin_image.includes('https:')
                  ? item.coin_image
                  : BASE_IMAGE + item.coin_image,
              }}
              title={item.coin_name}
              showImg={false}
            />
          )}
        />
      </View>
      {isLoader && <Loader/>}
    </Wrap>
  );
};

export default MultiWalletOptions;
