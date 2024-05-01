import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  BackHandler
} from 'react-native';
import {
  Wrap,
  BasicButton,
  MainStatusBar,
  SimpleHeader,
  BorderLine,
} from '../../common';
import images from '../../../theme/Images';
import { styles } from './SaitaCardWelcomeStyle';
import { Actions } from 'react-native-router-flux';
import {ThemeManager } from '../../../../ThemeManager';
import { Fonts } from '../../../theme';
import { areaDimen, heightDimen, widthDimen } from '../../../Utils/themeUtils';
const SaitaCardWelcome = (props) => {
  useEffect(() => {
    let backhandle = BackHandler.addEventListener('hardwareBackPress', () => {
      Actions.pop();
      return true
    })

    return () => {
      backhandle?.remove()
    }
  }, [])

  return (
    <Wrap style={{ backgroundColor: ThemeManager.colors.bg }}>
      <MainStatusBar
        backgroundColor={ThemeManager.colors.bg}
        barStyle={
          ThemeManager.colors.themeColor === 'light'
            ? 'dark-content'
            : 'light-content'
        }
      />
      <SimpleHeader
        title={'SaitaCard'}
        backImage={ThemeManager.ImageIcons.iconBack}
        imageShow
        back={false}
        titleStyle={{
          textTransform: 'none'
        }}
        backPressed={() => {
          props.navigation.goBack();
        }}
      />
      <BorderLine
        borderColor={{ backgroundColor: ThemeManager.colors.viewBorderColor }}
      />
      <View
        style={{ flex: 1 }}
      >
        <View
          style={{
            marginTop: heightDimen(22),
          }}>
          <Image style={styles.imgcards1} source={images.physical_card} />
        </View>

        <View style={{ marginTop: heightDimen(30) }}>
          <Text
            style={[
              styles.txtWelcome,
              { color: ThemeManager.colors.textColor },
            ]}>
            Using your Crypto just{' '}
            <Text style={[styles.txtWelcome, { color: ThemeManager.colors.textColor }]}>
              got easier
            </Text>
          </Text>
          <Text style={styles.txtdescribe}>
            Apply now to get a crypto card accepted at over 60 million
            MasterCard terminals with no annual fees.
          </Text>
        </View>
        <View style={{ marginHorizontal: widthDimen(22), marginTop: heightDimen(40) }}>
          {/* <BasicButton
            onPress={() => {
              if (global.disconnected) {
                Singleton.showAlert(NO_NETWORK)
                return
              }
              Actions.currentScene != 'SaitaCardsInfo' &&
                Actions.SaitaCardsInfo();
            }}
            customGradient={styles.customGrad}
            text={LanguageManager.applyCard}
            textStyle={{ fontSize: 16, fontFamily: Fonts.medium }}
          /> */}
          <BasicButton
            onPress={() =>
              Actions.currentScene != 'SaitaCardLogin' &&
              Actions.SaitaCardLogin({ from: 'Dashboard' })
            }
            // customColor={[ThemeManager.colors.backgroundColor,ThemeManager.colors.backgroundColor]}
            customGradient={[styles.customGrad, { marginTop: heightDimen(30) }]}
            text={'Login'}
            textStyle={{ fontSize: areaDimen(16), fontFamily: Fonts.medium }}
          />
          <View style={{ height: 30, }} />
        </View>
      </View>
    </Wrap>
  );
};
export default SaitaCardWelcome;
