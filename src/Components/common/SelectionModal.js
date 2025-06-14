import React from 'react'
import { BlurView } from '@react-native-community/blur';
import { Image, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Fonts, Images } from "../../theme";
import { areaDimen, heightDimen, widthDimen } from '../../Utils/themeUtils';
import { LanguageManager, ThemeManager } from '../../../ThemeManager';
import { area } from 'd3-shape';

const SelectionModal = (props) => {
  const List = [{ title: LanguageManager.Huobi, logo: Images.huobi }, { title: LanguageManager.RezorDex, logo: Images.splashLogo }]
  return (
    <>
      <Modal
        statusBarTranslucent
        animationType="fade"
        transparent={true}
        visible={props.openModel}
        onRequestClose={() => { false }}>
        <BlurView
          style={styles.blurView}
          blurType="dark"
          blurAmount={1}
          reducedTransparencyFallbackColor="white"
        />

        <View style={[styles.centeredView]}>
          <TouchableOpacity onPress={props.onPressIn} style={[styles.centeredView1]} />
          <View style={[styles.modalView, { backgroundColor: ThemeManager.colors.bg }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text allowFontScaling={false} style={[styles.textStyle, { color: ThemeManager.colors.textColor }]}>{''}</Text>
              <Text allowFontScaling={false} style={[styles.textStyle, { color: ThemeManager.colors.textColor }]}>{props.title || LanguageManager.SelectProvider}</Text>
              <Pressable style={{ paddingVertical: 5 }} onPressIn={props.onPressIn}>
                <Image style={{ alignSelf: 'center', height: areaDimen(24), width: areaDimen(24) }} source={Images.cross} />
              </Pressable>
            </View>
            {List?.map((item, index) => {
              return (
                <TouchableOpacity key={index + ''} onPress={() => props.onPress(item?.title)} style={[styles.touchableStyle, { borderBottomWidth: index == (List?.length - 1) ? 0 : 1, borderColor: ThemeManager.colors.viewBorderColor }]}>
                  <Image style={styles.imgstyle} source={item.logo} resizeMode='contain'/>
                  <Text allowFontScaling={false} style={[styles.textStyle1, { color: ThemeManager.colors.textColor }]}>{item?.title}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  imgstyle: {
    alignSelf: 'center',
    height: heightDimen(38),
    width: widthDimen(38),
    borderRadius: 30
  },
  touchableStyle: {
    width: '100%',
    flexDirection: 'row',
    paddingVertical: heightDimen(25),
    alignItems: 'center',
    alignSelf: 'center',
    paddingLeft: widthDimen(15),
  },
  textStyle: {
    letterSpacing: areaDimen(0.13),
    lineHeight: areaDimen(49),
    fontFamily: Fonts.semibold,
    fontSize: areaDimen(18),
    textAlign: 'center',
    marginVertical: heightDimen(10),
  },
  textStyle1: {
    lineHeight: areaDimen(19),
    marginLeft: widthDimen(12),
    fontSize: areaDimen(16),
    fontFamily: Fonts.medium,
    textAlign: 'center',
  },
  iconStyle: {
    height: 34,
    width: 34,
    borderRadius: 17,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0,0.6)',
  },
  centeredView1: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  modalView: {
    borderRadius: areaDimen(20),
    width: '100%',
    elevation: 4,
    paddingHorizontal: widthDimen(22),
    paddingVertical: 25,
  },
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    flex: 1,
  },
});

export { SelectionModal }