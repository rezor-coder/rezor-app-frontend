/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useRef, useCallback} from 'react';
import {BorderLine, Wrap} from '../../common/index';
import {
  MainStatusBar,
  SimpleHeader,
  BasicButton,
  BasicInputBox,
  WalletItem,
} from '../../common';
import {Colors} from '../../../theme';
import {View, Text, TextInput, Linking, Image, FlatList} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Singleton from '../../../Singleton';
import * as Constants from '../../../Constant';
import Images from '../../../theme/Images';
import {LanguageManager, ThemeManager} from '../../../../ThemeManager';
import {BASE_IMAGE} from '../../../Endpoints';
import {heightDimen} from '../../../Utils/themeUtils';

const MultiWalletOptions = () => {
  const [List, setList] = useState([]);

  useEffect(() => {
    Singleton.getInstance()
      .newGetData(Constants.withoutTokenList)
      .then(withoutTokenList => {
        console.warn(
          'MM',
          'chk withoutTokenList:::::',
          JSON.parse(withoutTokenList),
        );
        setList(JSON.parse(withoutTokenList));
        //  this.setState({ wallet_Array: JSON.parse(withoutTokenList) })
      });
  }, []);

  return (
    <Wrap style={{backgroundColor: ThemeManager.colors.backgroundColor}}>
      <SimpleHeader
        back={false}
        backPressed={() => Actions.pop()}
        title={'Import Wallet'}
      />
      <BorderLine
        borderColor={{backgroundColor: ThemeManager.colors.viewBorderColor}}
      />
      <WalletItem
        style={{borderBottomWidth: 0, marginBottom: heightDimen(-10)}}
        onPress={() =>
          Actions.currentScene != 'ImportWallet' &&
          Actions.ImportWallet({isFrom: 'multiWallet'})
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
          ListFooterComponent={()=><BorderLine/>}
          renderItem={({item, index}) => (
            <WalletItem
              onPress={() =>
                Actions.currentScene != 'MultiWalletImportSingleCoin' &&
                Actions.MultiWalletImportSingleCoin({
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
    </Wrap>
  );
};

export default MultiWalletOptions;
