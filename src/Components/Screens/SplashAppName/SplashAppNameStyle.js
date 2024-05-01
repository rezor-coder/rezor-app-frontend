import {StyleSheet, Dimensions} from 'react-native';
import {ThemeManager} from '../../../../ThemeManager';
import {Images, Colors, Fonts} from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  AppName: {
    height: 120,
    width: 120,
    alignSelf: 'center',
    resizeMode: 'contain',
  },

  AppNamebg: {
    height: '100%',
    width: '100%',
  },
  textContainor: {
    position: 'absolute',
    alignSelf: 'center',
    top: Dimensions.get('screen').height < 670 ? 250 : 300,
  },
  textPro: {
    // color: Colors.white,
    color: ThemeManager.colors.textColor,
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  BYsaita: {
    height: 150,
    width: 'auto',
    position: 'absolute',
    resizeMode: 'contain',
    bottom: 0,
    alignSelf: 'center',
  },
});
