import React, {useState, useEffect } from 'react';
import {View, StyleSheet, Text,BackHandler} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {ThemeManager, LanguageManager} from '../../../../ThemeManager';
import Singleton from '../../../Singleton';
import {Wrap, SimpleHeaderNew, BorderLine} from '../../common';
import SwapSelected from '../SwapSelected/SwapSelected';
import * as constants from '../../../Constant';
import {areaDimen, heightDimen, widthDimen} from '../../../Utils/themeUtils';
import {Colors, Fonts} from '../../../theme';
const SwapNew = props => {
  const [showSwap, setShowSwap] = useState(false);
  useEffect(() => {
    Singleton.getInstance()
      .newGetData(constants.IS_PRIVATE_WALLET)
      .then(isPrivate => {
        if (isPrivate == 'btc' || isPrivate == 'trx' || isPrivate == 'matic' ) {
          setShowSwap(false);
        } else {
          setShowSwap(true);
        }
      });
  }, [props]);
  useEffect(() => {
    let backHandle
    backHandle= BackHandler.addEventListener('hardwareBackPress',()=>{
      if( Actions.currentScene=='Trade'){
        Actions.currentScene != 'Main' && Actions.reset("Main")
      }else{
        Actions.pop()
      }
      return true
    })
    let focus = props.navigation.addListener('didFocus', () => {
      backHandle= BackHandler.addEventListener('hardwareBackPress',()=>{
        if( Actions.currentScene=='Trade'){
          Actions.currentScene != 'Main' && Actions.reset("Main")
        }else{
          Actions.pop()
        }
        return true
      })
      Singleton.getInstance()
        .newGetData(constants.IS_PRIVATE_WALLET)
        .then(isPrivate => {
          if (
            isPrivate == 'btc' ||
            isPrivate == 'trx' ||
            isPrivate == 'matic'
          ) {
            setShowSwap(false);
          } else {
            setShowSwap(true);
          }
        });
    });
    let blur = props.navigation.addListener('didBlur', () => {
      backHandle?.remove();
    })
    return () => {
      backHandle?.remove();
      blur?.remove();
      focus?.remove();
    };
  }, [props]);
  const onBackPressed=() => {
    props.navigation.goBack();
  }
  const onPressSettings=() => {
    if(showSwap){
      Actions.currentScene != 'SwapSettings' &&
      Actions.SwapSettings({
        onGoBack: data => {},
      })
    }
  }
  return (
    <Wrap style={{flex: 1, backgroundColor: ThemeManager.colors.dashboardBg}}>
      <SimpleHeaderNew
        title={LanguageManager.swap}
        titleStyle
        imageShow
        back={false}
        backPressed={onBackPressed}
        img3style={{tintColor:ThemeManager.colors.iconColor}}
        img3={showSwap ? ThemeManager.ImageIcons.setting : null}
        onPress3={onPressSettings}
      />
      <BorderLine/>
      {showSwap ? (
        <SwapSelected
          navigation={props.navigation}
        />
      ) : (
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <Text
            style={{
              fontSize: areaDimen(16),
              fontFamily: Fonts.medium,
              color: ThemeManager.colors.textColor,
              paddingHorizontal: widthDimen(22),
              textAlign:'center'
            }}>
            {constants.UNCOMPATIBLE_WALLET}
          </Text>
        </View>
      )}
    </Wrap>
  );
};
const styles = StyleSheet.create({
  viewMainButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 12,
    width: '100%',
    alignSelf: 'center',
    marginTop: 16,
  },
  btnStyle: {
    width: '50%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },

  btnStyleInner: {
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },

  gradientStyle: {
    borderRadius: 12,
  },
  tabsContainer: {
    flexDirection: 'row',
    height: heightDimen(44),
    width: widthDimen(370), //370
    backgroundColor: ThemeManager.colors.backgroundColor,
    alignSelf: 'center',
    borderRadius: 100,
    marginTop: heightDimen(20),
    borderColor: '#303030',
    borderWidth: 1,
  },
  tabStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: heightDimen(40),
    width: widthDimen(370), //widthDimen(122.7)
  },
  tabText: {
    color: Colors.white,
    fontSize: areaDimen(16),
    fontFamily: Fonts.medium,
    lineHeight: heightDimen(19),
  },
});

export default SwapNew;
