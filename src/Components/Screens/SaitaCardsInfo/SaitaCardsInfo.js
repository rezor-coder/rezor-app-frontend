/* eslint-disable no-lone-blocks */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect} from 'react';
import { BackHandler } from 'react-native';
import {Actions} from 'react-native-router-flux';
import {ThemeManager} from '../../../../ThemeManager';
import Singleton from '../../../Singleton';
import { MainStatusBar, Wrap } from '../../common';
import SaitaCardBlack from '../SaitaCardBlack';
const SaitaCardsInfo = props => {
  let backHandle = null;
  useEffect(() => {
    console.log("props:::from",props.from);
    props.navigation.addListener('didFocus', () => {
      backHandle = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );
    });
    props.navigation.addListener('didBlur', () => {
      backHandle?.remove();
    });
    return () => {
      backHandle?.remove();
    };
  }, []);

  const backAction = () => {
    Singleton.getInstance().currentCard = 'black';
    if(props?.from=='Main'){
      Actions.currentScene != 'Main' && Actions.reset("Main")
    }else{
      Actions.currentScene != 'Dashboard' && Actions.replace('Dashboard');
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
            <SaitaCardBlack navigation={props.navigation} from={props.from}/>
    </Wrap>
  );
};

export default SaitaCardsInfo;
