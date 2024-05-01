import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  ScrollView,
  Dimensions,
  Alert,
  Modal,
  SafeAreaView,
  FlatList,
  Keyboard, TouchableOpacity
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import images from '../../../theme/Images';
import { Colors } from '../../../theme';

import { styles } from './SwapLiquidityStyle';
import { Inputtext, InputtextSearch, MainHeader } from '../../common';
import LinearGradient from 'react-native-linear-gradient';
// import { TouchableOpacity } from 'react-native-gesture-handler';
import { Wrap, BasicButton } from '../../common/index';
import Liquidity from '../Liquidity/Liquidity'
import SwapTab from '../SwapTab/SwapTab'


const SwapLiquidity = () => {
  const [indexPosition, setindexPosition] = useState(0);
  const [slippage, setSlippage] = useState(10);
  const [timeout, setTimeouts] = useState(20);
  const [SettingModal, setSettingModal] = useState(false);
  return (
    <Wrap>
      <LinearGradient
        colors={['#000000', '#000000', '#1D1D1B', '#1D1D1B']}

        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}>
        <MainHeader
          onpress3={() => setSettingModal(true)}
          styleImg3={{ tintColor: '#B1B1B1' }}
          thridImg={images.hamburger}
        />
        <View >
          {indexPosition == 0 ?
            <View style={{ flexDirection: 'row',  alignSelf:'center', margin: 10 }}>
              <TouchableOpacity style={{ backgroundColor: Colors.pink, width: "40%", alignItems: 'center', justifyContent: 'center', height: 40, borderRadius: 10 }}
                onPress={() => {
                  setindexPosition(0)
                }}>
                <Text style={{ textAlign: 'center', color: Colors.White, fontSize: 15 }}>SWAP</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ backgroundColor: Colors.languageItem, width: "40%", alignItems: 'center', justifyContent: 'center', height: 40, borderRadius: 10 }}
                onPress={() => {
                  setindexPosition(1)
                }}>
                <Text style={{ textAlign: 'center', color: Colors.White, fontSize: 15 }}>LIQUIDITY</Text>
              </TouchableOpacity>
            </View>
            :
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', margin: 10 }}>
              <TouchableOpacity style={{ backgroundColor: Colors.languageItem, width: "40%", alignItems: 'center', justifyContent: 'center', height: 40, borderRadius: 10 }}
                onPress={() => {
                  setindexPosition(0)
                }}>
                <Text style={{ textAlign: 'center', color: Colors.White, fontSize: 15 }}>SWAP</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ backgroundColor: Colors.pink, width: "40%", alignItems: 'center', justifyContent: 'center', height: 40, borderRadius: 10 }}
                onPress={() => {
                  setindexPosition(1)
                }}>
                <Text style={{ textAlign: 'center', color: Colors.White, fontSize: 15 }}>LIQUIDITY</Text>
              </TouchableOpacity>
            </View>
          }
        </View>
      </LinearGradient>
      <View style={styles.roundView}>
        {indexPosition == 0 ?
          <View style={{ flex: 1, }}>
            <SwapTab  />
          </View>
          :
          <View style={{ flex: 1, }}>
            <Liquidity />
          </View>
        }
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
              <Text style={{ color: 'white', marginHorizontal: 10, marginVertical: 10 }}> Slippage tolerance </Text>

              <InputtextSearch
                returnKeyType={'done'}
                value={slippage.toString()}
                onChangeNumber={text => {
                  setSlippage(text)
                }}
                style={{ backgroundColor: Colors.headerBg }}
              />
              <Text style={{ color: 'white', marginHorizontal: 10, marginVertical: 10 }}> Transaction Timeout </Text>
              <InputtextSearch
                returnKeyType={'done'}
                value={timeout.toString()}
                onChangeNumber={text => {
                  setTimeouts(text)
                }}
                style={{ backgroundColor: Colors.headerBg }}
              />

              <BasicButton
                btnStyle={{ margin: 20 }}
                text={"Submit"}

                onPress={() => {
                  setSettingModal(false);
                  // alert(slippage + " " + timeout)
                }}>

              </BasicButton>


            </View>
          </Wrap>
        </>
      </Modal>
    </Wrap>
  );
};

export default SwapLiquidity;
