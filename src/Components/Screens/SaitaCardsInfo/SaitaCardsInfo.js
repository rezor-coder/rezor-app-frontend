/* eslint-disable no-lone-blocks */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect } from 'react';
import { BackHandler } from 'react-native';
import { ThemeManager } from '../../../../ThemeManager';
import { NavigationStrings } from '../../../Navigation/NavigationStrings';
import Singleton from '../../../Singleton';
import { getCurrentRouteName, navigate, reset } from '../../../navigationsService';
import { MainStatusBar, Wrap } from '../../common';
import SaitaCardBlack from '../SaitaCardBlack';
const SaitaCardsInfo = props => {
  let backHandle = null;
  useEffect(() => {
    console.log("props:::from",props?.route?.params?.from);
    props.navigation.addListener('focus', () => {
      backHandle = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );
    });
    props.navigation.addListener('blur', () => {
      backHandle?.remove();
    });
    return () => {
      backHandle?.remove();
    };
  }, []);

  const backAction = () => {
    Singleton.getInstance().currentCard = 'black';
    if(props?.from=='Main'){
      getCurrentRouteName() != 'Main' && reset(NavigationStrings.Main)
    }else{
      getCurrentRouteName() != 'Dashboard' && navigate(NavigationStrings.Dashboard);
    }
    return true;
  };

  return (
    <Wrap
      style={{flex: 1, backgroundColor: ThemeManager.colors.bg}}>
                <MainStatusBar
          backgroundColor={ThemeManager.colors.bg}
          barStyle={
            ThemeManager.colors.themeColor === 'light'
              ? 'dark-content'
              : 'light-content'
          }
        />
            <SaitaCardBlack navigation={props.navigation} from={props?.route?.params?.from}/>
    </Wrap>
  );
};

export default SaitaCardsInfo;
