import React from 'react';
import { Text, View } from 'react-native';
import { NavigationStrings } from '../../../Navigation/NavigationStrings';
import { getCurrentRouteName, navigate } from '../../../navigationsService';
import images from '../../../theme/Images';
import { BasicButton, BasicInputBox, Wrap } from '../../common/index';
import styles from './LoginStyle';

const Login = () => {
  return (
    <Wrap>
      <View style={styles.container}>
        <View style={styles.upperTextWrapSty=le}>
          <Text style={styles.textSimple}>Don’t have an account?</Text>
          <Text
            onPress={() => getCurrentRouteName() != 'Signup' && navigate(NavigationStrings.Signup)}
            style={styles.signupText}>
            {' '}
            SIGN UP
          </Text>
        </View>
        <BasicInputBox
          width="80%"
          icon={images.emailIcon}
          iconStyle={styles.iconStyle}
          placeholder="E-mail Address"
        />
        <BasicInputBox
          width="80%"
          icon={images.lockIcon}
          iconStyle={styles.iconStyle}
          placeholder="Password"
          secureTextEntry={true}
        />
        <BasicButton
          onPress={() =>
            getCurrentRouteName() != 'VerifyPhrase' && navigate(NavigationStrings.VerifyPhrase)
          }
          btnStyle={styles.btnStyle}
          text="Log in"
        />
        <Text style={styles.forgotPassText}>Forgot Password?</Text>
      </View>
    </Wrap>
  );
};

export default Login;
