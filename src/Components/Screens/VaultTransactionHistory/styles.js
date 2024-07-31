import {StyleSheet} from 'react-native';
import { areaDimen, heightDimen, widthDimen } from '../../../Utils/themeUtils';
import { Fonts } from '../../../theme';

export const styles = StyleSheet.create({
  emptyTransactionsView: {
    alignItems: 'center',
    justifyContent:'center',
    flex:1,
  },
  emptyIconStyle: {
    height: heightDimen(76),
    width: widthDimen(87),
    marginBottom: areaDimen(16),
  },
  emptyTextStyle: {
    lineHeight: heightDimen(18),
    fontFamily: Fonts.medium,
    fontSize: areaDimen(14),
  },
  transactionViewshimmer:{
    marginHorizontal: areaDimen(22),
    borderRadius: areaDimen(10),
    height:areaDimen(110),
    width:'90%',
    marginBottom: areaDimen(12),
  },
});
