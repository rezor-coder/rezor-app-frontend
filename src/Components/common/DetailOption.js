import React from 'react';
import { StyleSheet, TextInput, View, Image, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ThemeManager } from '../../../ThemeManager';
import { Fonts, Images } from '../../theme';
import Colors from '../../theme/Colors';
import fonts from '../../theme/Fonts';
import { areaDimen, heightDimen, widthDimen } from '../../Utils/themeUtils';
import { BorderLine } from './BorderLine';
import Singleton from '../../Singleton';
import { addTrailingZeros, CommaSeprator3 } from '../../utils';

const DetailOption = props => {
  // console.log( ">>>>>>",props?.fiatValue,props.fiatValue?addTrailingZeros(CommaSeprator3(props?.fiatValue, 2),2):'::::')
  
  
  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingVertical: heightDimen(17),
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            flex: 1,
           
          }}>
          <Text
            style={[
              styles.titleTextStyle,
              { color: ThemeManager.colors.lightTextColor },
            ]}>
            {props?.item}
          </Text>
        </View>
        <View style={{ width: widthDimen(20) }} />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            flex: 2.5,
            alignItems:'center',
          }}>
          {props?.type == 'AmountWithLargeText' ? (
            <>
              <Text
                style={[
                  styles.amountTextStyle,
                  {
                    color: ThemeManager.colors.headingText,
                    fontSize: areaDimen(18),
                    fontFamily: fonts.semibold,
                    textAlign:'right'
                  },
                ]}
               >
                {`${props?.value} ${props?.symbol}`}
              </Text>
              <View
                style={{
                  backgroundColor: '#536B84',
                  width: 1,
                  height: heightDimen(16),
                  marginHorizontal: widthDimen(4),
                }}
              />
              <Text
                style={[
                  styles.amountDollarTextStyle,
                  {
                    color: ThemeManager.colors.lightTextColor,
                    fontSize: areaDimen(16),
                    fontFamily: fonts.semibold,
                  },
                ]}
               >
                {props?.fiatSymbol + addTrailingZeros(CommaSeprator3(props.fiatValue, 2),2)}
              </Text>
            </>
          ) : props?.type == 'AmountWithSmallText' ? (
          <View style={{flexDirection:'column'}}>
              <View>
                <Text
                  style={[
                    styles.amountTextStyle,
                    { color: ThemeManager.colors.headingText, textAlign: 'right', alignSelf: 'flex-end' },
                  ]}
                  >
                  {`${props?.value} ${props?.symbol}`}
                </Text>
              </View>
            <View>
                <Text
                style={[
                  styles.amountDollarTextStyle,
                  { color: ThemeManager.colors.colorLight, textAlign: 'right' },
                ]}
                numberOfLines={1}>
                {
                  props?.fiatSymbol +
                  Singleton.getInstance().toFixednew(props.fiatValue, 2)}
              </Text>
            </View>
          </View>
          ) : props?.type == 'Status' ? (
            <Text
              style={[
                styles.mediumTextStyle,
                {
                  color: '#34CC79',
                  lineHeight: areaDimen(18),
                },
              ]}
              numberOfLines={1}>
              {props?.value}
            </Text>
          ) : (
            <Text
              style={[
                styles.mediumTextStyle,
                {
                  color: ThemeManager.colors.headingText,
                  lineHeight: areaDimen(18),
                },
              ]}
              numberOfLines={1}>
              {props?.value}
            </Text>
          )}
        </View>
      </View>
      {props?.bottomLine && (
        <BorderLine
          borderColor={{
            backgroundColor: ThemeManager.colors.viewBorderColor,
            marginTop: 0,
          }}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  titleTextStyle: {
    fontSize: areaDimen(14),
    fontFamily: Fonts.medium,
  },
  amountTextStyle: {
    fontSize: areaDimen(14),
    fontFamily: Fonts.medium,
  },
  mediumTextStyle: {
    fontSize: areaDimen(14),
    fontFamily: Fonts.medium,
  },

  amountDollarTextStyle: {
    fontSize: areaDimen(14),
    fontFamily: Fonts.medium,
  },
});

export { DetailOption };
