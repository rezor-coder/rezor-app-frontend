/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import {
  Alert,
  Modal,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Pressable,
} from 'react-native';
import { BasicButton } from '.';
import { ThemeManager } from '../../../ThemeManager';

import { Fonts, Colors, Images } from '../../theme';

const ModalCardTrx = ({
  fromCoin,
  toCoin,
  toValue,
  fromValue,
  txnFee,
  onPress,
  onCancel,
  symbol, showFee, cardFee, cardCurrency
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <Modal
      style={styles.centeredView}
      animationType="fade"
      transparent={true}
      onRequestClose={() => {
        onCancel();
      }}>
      <View style={styles.centeredView}>
        <View
          style={{
            width: '75%',
            backgroundColor: ThemeManager.colors.backgroundColor,
            padding: 15,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: '#C738B1',
          }}>
          <TouchableOpacity
            style={{
              position: 'absolute',
              right: 10,
              top: 10,
              // color: Colors.white,
              // color: ThemeManager.colors.textColor,
              fontWeight: 'bold',
              width: 30, height: 30,
            }}
            onPress={onCancel}>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{
                color: ThemeManager.colors.textColor,
                fontWeight: 'bold',
              }}>
                X
              </Text>
            </View>

          </TouchableOpacity>
          <Text
            style={{
              // color: Colors.white,
              color: ThemeManager.colors.textColor,
              fontSize: 18,
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: '17%',
              marginTop: 15,
            }}>
            Confirm
          </Text>


          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 10,
            }}>
            <Text
              style={{
                color: ThemeManager.colors.textColor,
                fontSize: 14,
                fontWeight: 'bold', width: 44,
              }}>
              From:
            </Text>
            <Text style={{ color: ThemeManager.colors.textColor, fontSize: 14, marginHorizontal: 30, }}>
              {fromCoin}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 10,
            }}>
            <Text
              style={{
                color: ThemeManager.colors.textColor,
                fontSize: 14,
                fontWeight: 'bold', width: 40
              }}>
              To:
            </Text>
            <Text style={{ color: ThemeManager.colors.textColor, fontSize: 14, marginHorizontal: 30 }}>
              {toCoin}
            </Text>
          </View>


          <View
            style={{
              width: '100%',
              height: 0.4,
              // backgroundColor: Colors.white,
              color: ThemeManager.colors.textColor,
              marginVertical: 10,
              borderRadius: 20,
            }}
          />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 10,
            }}>
            <Text
              style={{
                color: ThemeManager.colors.textColor,
                fontSize: 14,
                fontWeight: 'bold',
              }}>
              Transaction Fee
            </Text>
            <Text style={{ color: ThemeManager.colors.textColor, fontSize: 14 }}>
              {txnFee} {symbol}
            </Text>
          </View>

          {showFee &&
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 10,
              }}>
              <Text
                style={{
                  color: ThemeManager.colors.textColor,
                  fontSize: 14,
                  fontWeight: 'bold',
                }}>
                Card Fee
              </Text>
              <Text style={{ color: ThemeManager.colors.textColor, fontSize: 14 }}>
                {cardFee} {cardCurrency.toUpperCase()}
              </Text>
            </View>
          }

          {/* <ButtonPrimary
            onPress={onPress}
            style={{height: 40, marginVertical: '20%'}}
            textstyle={{fontWeight: 'bold'}}
            title={'Confirm Swap'}
          /> */}
          <BasicButton
            // onPress={()=> Actions.SwapScreen()}
            // onPress={() => !isInsufficientBalance && swap()}

            onPress={onPress}
            text={'Confirm'}
            btnStyle={{
              marginVertical: 10,
              borderRadius: 8,
              overflow: 'hidden',
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: '#66666644',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 40,
    height: 81,
    backgroundColor: Colors.bgSuccessCard,
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingLeft: 10,
  },
  successMessageWrap: {
    paddingLeft: 20,
    flex: 1,
  },
});

export { ModalCardTrx };
