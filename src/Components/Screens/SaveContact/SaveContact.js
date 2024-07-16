/* eslint-disable react/self-closing-comp */
import React from 'react';
import { Text, TextInput, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import { NavigationStrings } from '../../../Navigation/NavigationStrings';
import { getCurrentRouteName, navigate } from '../../../navigationsService';
import { Colors } from '../../../theme';
import { BasicButton, MainStatusBar, SimpleHeader } from '../../common';
import { Wrap } from '../../common/index';
import styles from './SaveContactStyle';

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
              getCurrentRouteName() != 'Dashboard' && navigate(NavigationStrings.Dashboard)
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
