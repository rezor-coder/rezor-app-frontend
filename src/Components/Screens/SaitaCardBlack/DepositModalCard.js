import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { ThemeManager } from '../../../../ThemeManager';
import { Colors, Fonts, Images } from '../../../theme';
import FastImage from 'react-native-fast-image';
import { styles } from './SaitaCardBlackStyle';
const DepositModalCard = (props) => {
  return (
    <TouchableOpacity
      activeOpacity={1}
      style={{
        backgroundColor: '#0002',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onPress={() => {
        props.onClose()
      }}>
      <TouchableOpacity
        onPress={() => {
          console.log('pressed');
        }}
        activeOpacity={1}
        style={{
          backgroundColor: ThemeManager.colors.backgroundColor,
          padding: 25,
          borderRadius: 25,
          alignItems: 'center',
          marginHorizontal: 25,
        }}>
        <FastImage
          source={Images.popUpImage}
          style={{
            height: 79,
            width: 79,
            resizeMode: 'contain',
            marginVertical: 30,
          }}
          resizeMode="contain"
        />
        <Text
          style={{
            fontFamily: Fonts.semibold,
            fontSize: 20,
            color: ThemeManager.colors.textColor,
            textAlign: 'center',
          }}>
          Please select a deposit option
        </Text>
        <TouchableOpacity
          onPress={() => props.onPressPay()}
          style={{
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            borderWidth: 1,
            borderRadius: 12,
            borderColor: Colors.buttonColor1,
            marginTop: 20,
            ...styles.btnStylekyc,
          }}>
          <FastImage
            source={Images.pinkWallet}
            style={{
              marginRight: 10,
              height: 16,
              width: 17,
              resizeMode: 'contain',
            }}
            resizeMode="contain"
          />
          <Text
            style={{
              fontSize: 16,
              fontFamily: Fonts.bold,
              color: Colors.buttonColor1,
            }}>
            Crypto Wallet
          </Text>
        </TouchableOpacity>

        <View>
          <TouchableOpacity
            onPress={() => props.onPress2ndPay()}
            style={{
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              borderRadius: 12,
              ...styles.btnStylekyc,
              marginTop: 20,
              backgroundColor: ThemeManager.colors.black_grey_bpay_deposit,
              position: 'relative',
            }}>
            <FastImage
              source={Images.newIcon}
              style={{
                width: 25,
                height: 25,
                position: 'absolute',
                zIndex: 999,
                right: -10,
                top: -10,
              }}
              resizeMode="contain"
            />
            <FastImage
              source={Images.binance_pay}
              style={{
                width: '100%',
                height: 20,
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </TouchableOpacity>
  )
}

export default DepositModalCard