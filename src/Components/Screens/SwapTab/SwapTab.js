/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import {
  Modal,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Colors } from '../../../theme';

import LinearGradient from 'react-native-linear-gradient';
import { InputtextSearch } from '../../common';
import { styles } from './SwapTabStyle';
// import { TouchableOpacity } from 'react-native-gesture-handler';
import { BasicButton, Wrap } from '../../common/index';
import SwapScreen from '../SwapScreen/SwapScreen';
import SwapScreenBnb from '../SwapScreenBnb/SwapScreenBnb';

const SwapTab = () => {
  const [indexPosition, setindexPosition] = useState(0);
  const [slippage, setSlippage] = useState(1);
  const [timeout, setTimeouts] = useState(20);
  const [SettingModal, setSettingModal] = useState(false);
  return (
    <Wrap>
      <LinearGradient
        colors={['#000000', '#000000', '#1D1D1B', '#1D1D1B']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}>
        {/* <MainHeader
          onpress3={() => setSettingModal(true)}
          styleImg3={{ tintColor: '#B1B1B1' }}
          thridImg={images.hamburger}
        /> */}
        <View>
          {indexPosition == 0 ? (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                margin: 10,
              }}>
              <TouchableOpacity
                style={{
                  backgroundColor: Colors.pink,
                  width: '40%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 40,
                  borderRadius: 10,
                }}
                onPress={() => {
                  setindexPosition(0);
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: Colors.White,
                    fontSize: 15,
                  }}>
                  ETH
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: Colors.languageItem,
                  width: '40%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 40,
                  borderRadius: 10,
                }}
                onPress={() => {
                  setindexPosition(1);
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: Colors.White,
                    fontSize: 15,
                  }}>
                  BNB
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                margin: 10,
              }}>
              <TouchableOpacity
                style={{
                  backgroundColor: Colors.languageItem,
                  width: '40%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 40,
                  borderRadius: 10,
                }}
                onPress={() => {
                  setindexPosition(0);
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: Colors.White,
                    fontSize: 15,
                  }}>
                  ETH
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: Colors.pink,
                  width: '40%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 40,
                  borderRadius: 10,
                }}
                onPress={() => {
                  setindexPosition(1);
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: Colors.White,
                    fontSize: 15,
                  }}>
                  BNB
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </LinearGradient>
      <View style={styles.roundView}>
        {indexPosition == 0 ? (
          <View style={{flex: 1}}>
            <SwapScreen slippage={slippage} timeout={timeout} />
          </View>
        ) : (
          <View style={{flex: 1}}>
            <SwapScreenBnb slippage={slippage} timeout={timeout} />
          </View>
        )}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={SettingModal}
        onRequestClose={() => {
          setSettingModal(false);
        }}>
        <>
          <Wrap>
            <View
              style={{
                paddingTop: 25,
                flex: 1,
                backgroundColor: Colors.screenBg,
              }}>
              <Text
                style={{
                  color: 'white',
                  marginHorizontal: 10,
                  marginVertical: 10,
                }}>
                {' '}
                Slippage tolerance{' '}
              </Text>

              <InputtextSearch
                returnKeyType={'done'}
                value={slippage.toString()}
                onChangeNumber={text => {
                  setSlippage(text);
                }}
                style={{backgroundColor: Colors.headerBg}}
              />
              <Text
                style={{
                  color: 'white',
                  marginHorizontal: 10,
                  marginVertical: 10,
                }}>
                {' '}
                Transaction Timeout{' '}
              </Text>
              <InputtextSearch
                returnKeyType={'done'}
                value={timeout.toString()}
                onChangeNumber={text => {
                  setTimeouts(text);
                }}
                style={{backgroundColor: Colors.headerBg}}
              />

              <BasicButton
                btnStyle={{margin: 20}}
                text={'Submit'}
                onPress={() => {
                  setSettingModal(false);
                }}></BasicButton>
            </View>
          </Wrap>
        </>
      </Modal>
    </Wrap>
  );
};

export default SwapTab;
