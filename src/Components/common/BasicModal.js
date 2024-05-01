import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Fonts, Images } from '../../theme';
import Colors from '../../theme/Colors';
import { BasicButton } from './index';
import { Actions } from 'react-native-router-flux';
import moment from 'moment';
import { ThemeManager } from '../../../ThemeManager';
import { areaDimen, heightDimen, widthDimen } from '../../Utils/themeUtils';
const BasicModal = props => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.showMod}
      onRequestClose={props.requestClose}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          backgroundColor: '#00000059',
        }}>
        <View
          style={[
            styles.container,
            { backgroundColor: ThemeManager.colors.defiBgColor },
            props.containerStyle,
          ]}>
          <View style={styles.amountContainer}>
            <Text style={[styles.amountText, props.textStyle]}>
              {props.amount + ' '+props.coinSymbol}
            </Text>
            
          </View>
          <Text
            style={[
              styles.successDesc,
              props.coinSymbolStyle,
            ]}>{`You successfully sent ${props.coinSymbol
              } to ${props.toAddress?.substring((0, 23) + '...')}`}</Text>
          <Text
            style={[
              styles.transactionInfo,
              props.textStyle,
            ]}>{`Transaction done on ${moment().format(
              'DD MMM,YYYY @ hh:mm a',
            )}`}</Text>
          <Text style={[styles.addressText]}>{props.toAddress}</Text>
          {props.showBtn && (
            <BasicButton
              onPress={props.contact}
              btnStyle={styles.btnStyle}
              text="Add to Contacts"
              customGradient={{ borderRadius: heightDimen(30) }}
            />
          )}
          <TouchableOpacity
            style={{
              height: heightDimen(60),
              backgroundColor: ThemeManager.colors.lightButton,
              marginTop: heightDimen(14),
              alignItems: 'center',
              justifyContent: 'center',
              width: '80%',
              borderRadius: heightDimen(30)
            }}
            onPress={() =>
             {
              props.onClose ? props.onClose():    Actions.currentScene != 'Wallet' && Actions.Wallet()
             }
            }>
            <Text style={[styles.denyText, props.bottomBtn]}>
              {props.showBtn ? 'No Thanks!' : 'Ok!'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: Colors.lightBg,
    width: '90%',
    borderRadius: 12,
    paddingVertical: 30,
    paddingHorizontal: 20,
    //    left: '5%'
  },
  successIcon: {
    width: 70,
    height: 70,
  },
  amountText: {
    fontSize: areaDimen(30),
    fontFamily: Fonts.normal,
    color: Colors.languageItem,
    textAlign:'center'
  },
  currencyText: {
    fontSize: areaDimen(30),
    fontFamily: Fonts.normal,
    // color: Colors.white
    color: ThemeManager.colors.textColor,
  },
  successDesc: {
    fontSize: areaDimen(16),
    color: Colors.lightGrey,
    fontFamily: Fonts.normal,
    textAlign: 'center',
    marginTop: heightDimen(10),
  },
  transactionInfo: {
    fontSize: areaDimen(16),
    // color: Colors.white,
    color: ThemeManager.colors.textColor,
    fontFamily: Fonts.normal,
    textAlign: 'center',
    marginTop: heightDimen(20),
  },
  addressText: {
    fontSize: areaDimen(16),
    color: Colors.darkGrey,
    fontFamily: Fonts.normal,
    textAlign: 'center',
    marginTop: heightDimen(1),
  },
  btnStyle: {
    width: '80%',
    height: heightDimen(60),
    marginTop: '6%',
  },
  amountContainer: {
    flexDirection: 'row',
    marginTop: heightDimen(10),
    paddingHorizontal:widthDimen(10)
  },
  denyText: {
    fontSize: areaDimen(16),
    // color: Colors.white,
    color: ThemeManager.colors.textColor,
    fontFamily: Fonts.normal,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    // marginTop: heightDimen(20),
    padding: widthDimen(5),
    // borderWidth: 1,
    // height: heightDimen(50),
    borderRadius: 4,
    // borderColor: '#fff',
  },
});

export { BasicModal };
