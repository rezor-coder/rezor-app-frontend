import {StyleSheet} from 'react-native';
import {areaDimen, heightDimen, width, widthDimen} from '../../../../Utils/themeUtils';
import { Colors, Fonts } from '../../../../theme';
import { ThemeManager } from '../../../../../ThemeManager';

export const styles = StyleSheet.create({
  mainContainerStyle: {flex: 1},
  borderLineStyle: {
    height: heightDimen(1),
    backgroundColor: ThemeManager.colors.borderColor,
  },
  cardView: {
    height: heightDimen(210),
    width: width - 42,
    alignSelf: 'center',
    borderRadius: areaDimen(24),
    overflow: 'hidden',
    marginTop: areaDimen(24),
  },
  cardImageStyle: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    zIndex: 0,
  },
  flexRowJustify: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: areaDimen(24),
  },
  cardtitle: {
    lineHeight: heightDimen(18),
    fontFamily: Fonts.regular,
    fontSize: areaDimen(14),
    color: Colors.white,
  },
  cardInnerView: {
    zIndex: 100,
    top: areaDimen(61),
   
  },
  cardInfoDetailView:{
    borderWidth:1,marginHorizontal:areaDimen(22),
    borderColor:ThemeManager.colors.lightBlue,
    paddingVertical:areaDimen(12),
    borderRadius:areaDimen(12),
    marginTop:areaDimen(22)
  },
  cardInfoTitle:{
    lineHeight: heightDimen(15),
    fontFamily: Fonts.semibold,
    fontSize: areaDimen(12),
    color: ThemeManager.colors.inActiveColor,
    flex:0.4
  },
  cardInfoSubTitle:{
    lineHeight: heightDimen(15),
    fontFamily: Fonts.semibold,
    fontSize: areaDimen(12),
    color: ThemeManager.colors.textColor,
    flex:0.6,textAlign:'right'
  },
  borderLine:{
    borderBottomWidth: 1,borderColor:ThemeManager.colors.lightBlue,marginVertical:areaDimen(12)
  },
  iconStyle: {
    height: heightDimen(13),
    width: widthDimen(20),
    resizeMode: 'contain',
    marginLeft: heightDimen(3),
    // padding:5
},
});
