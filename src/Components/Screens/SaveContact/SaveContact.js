/* eslint-disable react/self-closing-comp */
import React, {useState} from 'react';
import {Wrap} from '../../common/index';
import {MainStatusBar, SimpleHeader, BasicButton} from '../../common';
import {Colors} from '../../../theme';
import LinearGradient from 'react-native-linear-gradient';
import styles from './SaveContactStyle';
import {View, Text, TextInput} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {LanguageManager, ThemeManager} from '../../../../ThemeManager';

const SaveContact = props => {
  return (
    <Wrap style={{backgroundColor: ThemeManager.colors.backgroundColor}}>
      <LinearGradient
        colors={['#000000', '#000000', '#1D1D1B', '#1D1D1B']}
        style={styles.container}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}>
        {/* <MainStatusBar
          backgroundColor={Colors.black}
          barStyle="light-content"
        /> */}
        <MainStatusBar
          backgroundColor={ThemeManager.colors.backgroundColor}
          barStyle={
            ThemeManager.colors.themeColor === 'light'
              ? 'dark-content'
              : 'light-content'
          }
        />
        {/* <SimpleHeader title={'Buy BTC'} /> */}
        <SimpleHeader
          title={LanguageManager.buyBtc}
          // rightImage={[styles.rightImgStyle]}
          backImage={ThemeManager.ImageIcons.iconBack}
          titleStyle
          imageShow
          back={false}
          backPressed={() => {
            // props.navigation.state.params.onGoBack();
            props.navigation.goBack();
          }}
        />

        <View
          style={{
            height: 2,
            width: '100%',
            backgroundColor: ThemeManager.colors.chooseBorder,
            marginTop: 10,
            opacity: 0.6,
          }}
        />
        <View style={[styles.innerContainer]}>
          <TextInput
            style={styles.priceInput}
            placeholder="$ 980.890"
            placeholderTextColor={Colors.lightGrey}></TextInput>
          <Text style={styles.numOfCoins}>2 BTC</Text>
          <BasicButton
            onPress={() =>
              Actions.currentScene != 'Dashboard' && Actions.Dashboard()
            }
            btnStyle={styles.btnStyle}
            text="Save Contact"
          />
        </View>
      </LinearGradient>
    </Wrap>
  );
};

export default SaveContact;
