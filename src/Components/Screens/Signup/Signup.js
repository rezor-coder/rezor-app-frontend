import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationStrings } from '../../../Navigation/NavigationStrings';
import Singleton from '../../../Singleton';
import { getCurrentRouteName, navigate } from '../../../navigationsService';
import { Images } from '../../../theme';
import Colors from '../../../theme/Colors';
import { MainHeader } from '../../common';
import { Wrap } from '../../common/index';
const Signup = () => {
  return (
    <Wrap>
      <MainHeader
        onpress2={() => Singleton.showAlert('scan')}
        onpress3={() => Singleton.showAlert('soon')}
        styleImg3={{tintColor: '#B1B1B1'}}
        firstImg={Images.Bell}
        secondImg={Images.scan}
        thridImg={Images.hamburger}
        containerStyle={{paddingHorizontal: 0}}
        onChangedText={text => {
          // alert(text)
        }}
      />
      <View style={styles.container}>
        <Text
          onPress={() =>
            getCurrentRouteName() != 'VerifyPhrase' && navigate(NavigationStrings.VerifyPhrase)
          }
          style={styles.signupText}>
          SETTINGS
        </Text>
      </View>
    </Wrap>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.black,
  },
  upperTextWrapStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '15%',
  },
  textSimple: {
    fontSize: 17,
    color: Colors.languageItem,
  },
  signupText: {
    fontSize: 22,
    color: Colors.buttonColor1,
  },
  forgotPassText: {
    fontSize: 17,
    color: Colors.languageItem,
    alignSelf: 'flex-end',
    right: '10%',
    marginTop: 10,
  },
  iconStyle: {
    position: 'absolute',
    width: 22,
    height: 22,
    resizeMode: 'contain',
    top: 43,
    left: '70%',
  },
});

export default Signup;
