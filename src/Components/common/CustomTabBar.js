/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {useSelector} from 'react-redux';
import {LanguageManager, ThemeManager} from '../../../ThemeManager';
import {Images} from '../../theme';
import {TabIcon} from './TabIcon';
import {areaDimen, heightDimen, widthDimen} from '../../Utils/themeUtils';
import { EventRegister } from 'react-native-event-listeners';
function CustomTabBar(props) {
  const {currentTheme, currentLanguage} = useSelector(
    state => state.mnemonicreateReducer,
  );
const [key,setKey]=useState(0)
  const {state} = props.navigation;
  const activeTabIndex = state.index;
  useEffect(()=>{
      console.log("currentTheme",currentTheme,key);
      setKey(key+1)
  },[currentTheme])
  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        height: heightDimen(80),
        flexWrap: 'nowrap',
        borderWidth: 0.3,
        borderBottomWidth:0,
        borderColor: ThemeManager.colors.tabBorder,
        borderTopStartRadius: areaDimen(20),
        borderTopEndRadius: areaDimen(20),
        overflow: 'hidden',
        backgroundColor: ThemeManager.colors.backgroundColor,
        paddingBottom:Platform.OS=='ios'?heightDimen(20):0,
        borderWidth:1
      }}>
      {state.routes.map((element, index) => {
        switch (element.key) {
          case 'Dashboard': {
            return (
              <TouchableOpacity
                key={key+element.key}
                onPress={() => {
                  Actions[element.key]();
                  console.warn('MM', 'element.key-=-=-=>>>', ThemeManager.colors.themeColor);
                }}>
                <TabIcon
                  focused={activeTabIndex == index}
                  title={LanguageManager.Home}
                  ImgSize={[
                    {width: widthDimen(18), height: areaDimen(20)},
                    activeTabIndex == index ? {tintColor:ThemeManager.colors.primary} : {tintColor: ThemeManager.colors.iconColor},
                  ]}
                  tintColor={activeTabIndex == index ? ThemeManager.colors.primary : ThemeManager.colors.iconColor}
                  activeImg={Images.home_active}
                  defaultImg={Images.home_inactive}
                />
              </TouchableOpacity>
            );
          }

          case 'Market': {
            return (
              <TouchableOpacity
              key={key+element.key}
                onPress={() => Actions[element.key]()}>
                <TabIcon
                  focused={activeTabIndex == index}
                  title={LanguageManager.Market}
                  ImgSize={{width: widthDimen(18), height: areaDimen(20)}}
                  activeImg={ThemeManager.ImageIcons.marketActive}
                  defaultImg={Images.market_inactive}
                  tintColor={activeTabIndex == index ? ThemeManager.colors.primary : ThemeManager.colors.iconColor}
                />
              </TouchableOpacity>
            );
          }
          case 'Trade': {
            return (
              <TouchableOpacity
              key={key+element.key}
                onPress={() => Actions[element.key]({from:'tab'})}>
                <TabIcon
                  focused={activeTabIndex == index}
                  title={'Swap'}
                  ImgSize={{width: widthDimen(18), height: areaDimen(20)}}
                  activeImg={Images.tradeActive}
                  defaultImg={Images.tradeInActive}
                  tintColor={activeTabIndex == index ? ThemeManager.colors.primary : ThemeManager.colors.iconColor}
                />
              </TouchableOpacity>
            );
          }
          case 'Wallet': {
            return (
              <TouchableOpacity
              key={key+element.key}
                onPress={() => Actions[element.key]()}>
                <TabIcon
                  focused={activeTabIndex == index}
                  title={LanguageManager.Wallet_}
                  ImgSize={{width: widthDimen(18), height: areaDimen(20)}}
                  activeImg={Images.wallet_active}
                  defaultImg={Images.wallet_inactive}
                  tintColor={activeTabIndex == index ? ThemeManager.colors.primary : ThemeManager.colors.iconColor}
                />
              </TouchableOpacity>
            );
          }
          case 'DeFi': {
            return (
              <TouchableOpacity
              key={key+element.key}
                onPress={() => Actions[element.key]()}>
                <TabIcon
                  focused={activeTabIndex == index}
                  title={LanguageManager.defi}
                  ImgSize={{
                    width: widthDimen(18),
                    height: areaDimen(20),
                    resizeMode: 'contain',
                  }}
                  activeImg={Images.defiActiveNew}
                  tintColor={activeTabIndex == index ? ThemeManager.colors.primary : ThemeManager.colors.iconColor}
                  defaultImg={Images.defiInActiveNew}
                />
              </TouchableOpacity>
            );
          }
          default:
            null;
        }
      })}
    </View>
  );
}
export {CustomTabBar};
