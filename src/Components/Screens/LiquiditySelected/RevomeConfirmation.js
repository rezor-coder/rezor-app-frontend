import {View, Text, Modal, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {LanguageManager, ThemeManager} from '../../../../ThemeManager';
import style from './style';
import {Colors, Images} from '../../../theme';
import {ButtonPrimary} from '../../common';
import { LiquidityValue } from './RmLiquidityConfirm';

function RevomeConfirmation(props) {
  return (
    <Modal onRequestClose={props.onClose} transparent visible={props.isVisible}>
      <View style={style.blurBg}>
        <View
          style={{
            backgroundColor: ThemeManager.colors.backgroundColor,
            margin: 20,

            paddingVertical: 15,
            borderRadius: 17,
          }}>
          <View style={[style.row1, {paddingHorizontal: 15}]}>
            <Text
              style={[style.textSm14, {color: ThemeManager.colors.textColor}]}>
              You will receive
            </Text>
            <TouchableOpacity onPress={props.onClose}>
              <Image style={style.closeBtn} source={Images.modal_close_icon} />
            </TouchableOpacity>
          </View>
          <View style={style.line} />
          <View
            style={{
              paddingHorizontal: 15,
            }}>
            <LiquidityValue title={props.selectedToCoin?.coin_symbol.toUpperCase()} value={props.firstTokenSupplyValue} />
            <LiquidityValue title={props.selectedFromCoin?.coin_symbol.toUpperCase()} value={props.secondTokenSupplyValue} />
            
            {/* <Text style={style.liquidityTxt}>
              Output is estimated. If the Price changes by more than 7.5% your
              transaction will revert.
            </Text> */}
            <Text
              style={[
                style.textSm14,
                {color: ThemeManager.colors.textColor, marginTop: 15},
              ]}>
              {props.selectedToCoin?.coin_symbol.toUpperCase()} Deposit
            </Text>
            <Text style={style.liquidityTxt1}>{props.firstTokenSupplyValue}</Text>
            <Text  style={[ style.textSm14, {color: ThemeManager.colors.textColor, marginTop: 15},  ]}>
              {props.selectedFromCoin?.coin_symbol.toUpperCase()} Deposit
            </Text>
            <Text style={style.liquidityTxt1}>{props.secondTokenSupplyValue}</Text>

            <Text  style={[ style.textSm14, {color: ThemeManager.colors.textColor, marginTop: 15},  ]}>
              Transaction Fee
            </Text>
            <Text style={style.liquidityTxt1}>{props.transactionFee} ETH</Text>
            {/* <Text
              style={[
                style.textSm14,
                {color: ThemeManager.colors.textColor, marginTop: 15},
              ]}>
              Price
            </Text>
            <Text style={style.liquidityTxt1}>1 ETH = 1,248,772.38093</Text>
            <Text style={style.liquidityTxt1}>1 BTC = 1,123,248,772.38093</Text> */}
            <ButtonPrimary
              onpress={props.onConfirm}
              btnstyle={[style.continueBtn1, {marginTop: 15}]}
              text={LanguageManager.confirm}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
export {RevomeConfirmation};
