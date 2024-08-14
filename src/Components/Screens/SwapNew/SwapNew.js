import React, {useEffect, useState} from 'react';
import {BackHandler, Text, View} from 'react-native';
import {LanguageManager, ThemeManager} from '../../../../ThemeManager';
import * as constants from '../../../Constant';
import {NavigationStrings} from '../../../Navigation/NavigationStrings';
import Singleton from '../../../Singleton';
import {areaDimen, widthDimen} from '../../../Utils/themeUtils';
import {
  getCurrentRouteName,
  goBack,
  navigate,
  reset,
} from '../../../navigationsService';
import {Fonts} from '../../../theme';
import {BorderLine, SimpleHeaderNew, Wrap} from '../../common';
import SwapSelected from '../SwapSelected/SwapSelected';
const SwapNew = props => {
  const [showSwap, setShowSwap] = useState(false);
  useEffect(() => {
    Singleton.getInstance()
      .newGetData(constants.IS_PRIVATE_WALLET)
      .then(isPrivate => {
        if (
          isPrivate === 'btc' ||
          isPrivate === 'trx' ||
          isPrivate === 'matic'
        ) {
          setShowSwap(false);
        } else {
          setShowSwap(true);
        }
      });
  }, [props]);
  useEffect(() => {
    let backHandle;
    backHandle = BackHandler.addEventListener('hardwareBackPress', () => {
      if (getCurrentRouteName() === 'Trade') {
        getCurrentRouteName() !== 'Main' && reset(NavigationStrings.Main);
      } else {
        goBack();
      }
      return true;
    });
    let focus = props.navigation.addListener('focus', () => {
      backHandle = BackHandler.addEventListener('hardwareBackPress', () => {
        if (getCurrentRouteName() === 'Trade') {
          getCurrentRouteName() !== 'Main' && reset(NavigationStrings.Main);
        } else {
          goBack();
        }
        return true;
      });
      Singleton.getInstance()
        .newGetData(constants.IS_PRIVATE_WALLET)
        .then(isPrivate => {
          if (
            isPrivate === 'btc' ||
            isPrivate === 'trx' ||
            isPrivate === 'matic'
          ) {
            setShowSwap(false);
          } else {
            setShowSwap(true);
          }
        });
    });
    let blur = props.navigation.addListener('blur', () => {
      backHandle?.remove();
    });
    return () => {
      backHandle?.remove();
      blur();
      focus();
    };
  }, [props]);
  const onBackPressed = () => {
    props.navigation.goBack();
  };
  const onPressSettings = () => {
    if (showSwap) {
      getCurrentRouteName() !== 'SwapSettings' &&
        navigate(NavigationStrings.SwapSettings, {
          onGoBack: data => {},
        });
    }
  };
  return (
    <Wrap style={{flex: 1, backgroundColor: ThemeManager.colors.dashboardBg}}>
      <SimpleHeaderNew
        title={LanguageManager.swap}
        titleStyle
        imageShow
        back={false}
        backPressed={onBackPressed}
        img3style={{tintColor: ThemeManager.colors.iconColor}}
        img3={showSwap ? ThemeManager.ImageIcons.setting : null}
        onPress3={onPressSettings}
      />
      <BorderLine />
      {showSwap ? (
        <SwapSelected navigation={props.navigation} />
      ) : (
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <Text
            style={{
              fontSize: areaDimen(16),
              fontFamily: Fonts.medium,
              color: ThemeManager.colors.textColor,
              paddingHorizontal: widthDimen(22),
              textAlign: 'center',
            }}>
            {constants.UNCOMPATIBLE_WALLET}
          </Text>
        </View>
      )}
    </Wrap>
  );
};
export default SwapNew;
