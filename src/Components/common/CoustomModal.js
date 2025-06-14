/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Image,
  Linking,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { LanguageManager, ThemeManager } from '../../../ThemeManager';
import { NavigationStrings } from '../../Navigation/NavigationStrings';
import Singleton from '../../Singleton';
import { getCurrentRouteName, navigate } from '../../navigationsService';
import { Colors, Fonts, Images } from '../../theme';
import fonts from '../../theme/Fonts';
import { SimpleHeader } from './../common';

const CoustomModal = props => {
  // const [modalVisible, setModalVisible] = useState(false);

  return (
    <Modal
      style={[styles.centeredView, props.ModalStyle]}
      animationType="slide"
      transparent={true}
      visible={props.modalVisible}
      onRequestClose={() => {
        props.close;
      }}>
      <View style={[styles.centeredView, props.ModalStyle]}>
        {/* <SimpleHeader
          title={'Rezor Support'}
          rightImage={styles.rightImgStyle}
        /> */}
        <SimpleHeader
          title={LanguageManager.rezorSupport}
          backImage={ThemeManager.ImageIcons.iconBack}
          titleStyle
          imageShow
          back={false}
          backPressed={props.goBack}
        />

        <View
          style={{
            height: 2,
            width: '100%',
            backgroundColor: props.borderColor,
            marginTop: 10,
            opacity: 0.6,
          }}
        />

        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 25,
            justifyContent: 'space-between',
            marginTop: 60,
          }}>
          <TouchableOpacity
            style={{
              height: 60,
              width: 160,
              borderColor: Colors.borderColorLang,
              borderWidth: 1,
              borderRadius: 12,
              marginEnd: 20,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={styles.textnewlight}>Rezor</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              Linking.openURL('https://fang.art');
            }}
            style={{
              height: 60,
              width: 160,
              borderColor: Colors.borderColorLang,
              borderWidth: 1,
              borderRadius: 12,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <LinearGradient
              // colors={[
              //   Colors.buttonColor1,
              //   Colors.buttonColor2,
              //   Colors.buttonColor3,
              //   Colors.buttonColor4,
              // ]}
              colors={
                Singleton.getInstance().dynamicColor
                  ? Singleton.getInstance().dynamicColor
                  : [
                      Colors.buttonColor1,
                      Colors.buttonColor2,
                      Colors.buttonColor3,
                      Colors.buttonColor4,
                    ]
              }
              style={styles.gradientStyle}
              start={{x: 0, y: 1}}
              end={{x: 0, y: 0}}>
              <Image
                source={Images.imgFangArt}
                style={{height: 20, width: 20, marginHorizontal: 5}}
              />
              <Text style={styles.textnewlight}>FANG Art</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 25,
            justifyContent: 'space-between',
            marginTop: 20,
          }}>
          <TouchableOpacity
            style={{
              height: 60,
              width: 160,
              borderColor: Colors.borderColorLang,
              borderWidth: 1,
              borderRadius: 12,
              marginEnd: 20,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={Images.imgSubTract}
              style={{height: 20, width: 20, marginHorizontal: 5}}
            />
            <Text style={styles.textnewlight}>Rezor Store</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              height: 60,
              width: 160,
              borderColor: Colors.borderColorLang,
              borderWidth: 1,
              borderRadius: 12,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={Images.imgRezorMarket}
              style={{height: 20, width: 20, marginHorizontal: 5}}
            />
            <Text style={styles.textnewlight}>RezorMarket</Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 25,
            justifyContent: 'space-between',
            marginTop: 20,
          }}>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL('https://saitama.academy');
            }}
            style={{
              height: 60,
              width: 160,
              borderColor: Colors.borderColorLang,
              borderWidth: 1,
              borderRadius: 12,
              marginEnd: 20,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={Images.imgLearn}
              style={{height: 20, width: 20, marginHorizontal: 5}}
            />
            <Text style={styles.textnewlight}>Learn</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              getCurrentRouteName() != 'GetSupport' && navigate(NavigationStrings.GetSupport);
            }}
            style={{
              height: 60,
              width: 160,
              borderColor: Colors.borderColorLang,
              borderWidth: 1,
              borderRadius: 12,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={Images.imgRezorMarket}
              style={{height: 20, width: 20, marginHorizontal: 5}}
            />
            <Text style={styles.textnewlight}>Get Support</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  getSuppoert: {
    borderBottomWidth: 1,
    color: Colors.white,
    borderColor: Colors.white,
  },
  row: {flexDirection: 'row', alignItems: 'center', marginTop: 10},
  text5: {
    color: Colors.inputDarkbg,
    fontSize: 15,
    fontFamily: fonts.normal,
    marginLeft: 10,
  },
  text2: {
    color: Colors.white,
    fontSize: 12,
    fontFamily: fonts.normal,
    alignSelf: 'flex-end',
  },
  tex1: {
    color: Colors.white,
    fontSize: 12,
    fontFamily: fonts.normal,
    alignSelf: 'flex-end',
  },
  text4: {
    color: Colors.inputDarkbg,
    fontSize: 15,
    fontFamily: fonts.normal,
    alignSelf: 'flex-end',
    marginLeft: 10,
  },
  text3: {
    color: Colors.fadewhite,
    fontSize: 12,
    fontFamily: fonts.normal,
    alignSelf: 'flex-end',
  },
  textgrey: {
    color: Colors.inputDarkbg,
    fontSize: 14,
    fontFamily: fonts.normal,
    marginLeft: 10,
  },
  roundnew: {
    height: 50,
    width: 50,
    borderRadius: 10,
    backgroundColor: Colors.inputDarkbg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  textnew: {color: Colors.white, fontSize: 14, fontFamily: Fonts.normal},
  textnewlight: {
    color: Colors.lightGrey3,
    fontSize: 14,
    fontFamily: Fonts.semibold,
  },
  centeredView: {
    flex: 1,
    // backgroundColor: '#000000',
  },
  roundView: {
    height: 50,
    width: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 40,
    height: 81,
    backgroundColor: Colors.AccountcardBG,
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingLeft: 10,
  },
  successMessageWrap: {
    paddingLeft: 20,
    flex: 1,
  },

  gradientStyle: {
    width: 160,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    height: 60,
    width: 160,
    flexDirection: 'row',
  },

  rightImgStyle: {tintColor: Colors.White},
});

export { CoustomModal };

