import {Platform, StyleSheet} from 'react-native';
import {areaDimen, heightDimen, width,widthDimen} from '../../../../Utils/themeUtils';
import { Colors, Fonts } from '../../../../theme';
import { ThemeManager } from '../../../../../ThemeManager';

export const styles = StyleSheet.create({
  mainContainerStyle: {
    flex: 1,
  },
  borderLineStyle: {
    height: heightDimen(1),
    backgroundColor: ThemeManager.colors.borderColor,
  },
  qrBackGround: {
    alignSelf: 'center',
    padding: areaDimen(12),
    borderRadius: areaDimen(12),
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5, // For Android
  },
  qrTitleText: {
    fontSize: areaDimen(14),
    marginBottom: areaDimen(16),
    fontFamily: Fonts.semibold,
    lineHeight: heightDimen(19),
    textAlign: 'center',
  },
  qrSubTitleText: {
    fontSize: areaDimen(14),
    // flex: 0.9,
    fontFamily: Fonts.semibold,
    lineHeight: heightDimen(19),
    textAlign: 'center',
  },
  qrMainView: {
    width: width - 44,
    alignSelf: 'center',
    padding: areaDimen(20),
    borderRadius: areaDimen(12),
    zIndex: 0,
  },
  copyTextView: {
    width: '98%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: areaDimen(16),
    paddingHorizontal: areaDimen(22),
    borderRadius: areaDimen(25),
    marginTop: areaDimen(16),
  },
  imgCopyInside: {
    height: areaDimen(18),
    width: areaDimen(18),
    flex: 0.1,
  },
  accountMainView: {
    paddingHorizontal: areaDimen(22),
    marginTop: areaDimen(24),
    zIndex: 1,
  },
  addressText: {
    fontSize: areaDimen(14),
    fontFamily: Fonts.medium,
    lineHeight: heightDimen(18),
    marginLeft:areaDimen(22),
    marginBottom: areaDimen(10),
  },
  coinView:{
    borderRadius: widthDimen(20),
    width: widthDimen(30),
    height: widthDimen(30),
    backgroundColor: ThemeManager.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight:Platform.OS === 'ios' ?areaDimen(12):areaDimen(6)
    // flex:0.16
  },
  coinText:{
    color: 'white',
    fontFamily: Fonts.semibold,
    fontSize: areaDimen(15),
    lineHeight: heightDimen(18),
  }
});
