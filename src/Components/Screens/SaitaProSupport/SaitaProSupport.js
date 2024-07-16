/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Linking,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { EventRegister } from 'react-native-event-listeners';
import FastImage from 'react-native-fast-image';
import { useDispatch, useSelector } from 'react-redux';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import { NavigationStrings } from '../../../Navigation/NavigationStrings';
import Singleton from '../../../Singleton';
import { heightDimen, widthDimen } from '../../../Utils/themeUtils';
import { getCurrentRouteName, goBack, navigate } from '../../../navigationsService';
import { Images } from '../../../theme';
import images from '../../../theme/Images';
import { BorderLine, SimpleHeader } from '../../common';
import { Wrap } from '../../common/Wrap';
import * as constants from './../../../Constant';
import styles from './SaitaProSupportStyle';

let showLoader = true;
const SaitaProSupport = props => {
  const dispatch = useDispatch();
  const [enable, setEnable] = useState(true);
  const [linkList, setlinkList] = useState('');
  const [isLoading, setisLoading] = useState(false);
  const [onPressActive, setPressActive] = useState(false);
  const walletList = useSelector(state => state?.walletReducer?.myWallets);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedButton, setSelectedButton] = useState('');

  const supportOptions = [
    // { type: 'SaitaPro', name: LanguageManager.saitaPro, icon: Images.saitaPro_icon },
    // { type: 'FANGArt', name: LanguageManager.fangArt, icon: Images.fang_icon },
    // { type: 'Saitama Store', name: LanguageManager.saitamaStore, icon: Images.saitama_store_icon },
    // { type: 'SaitaMarket', name: LanguageManager.saitaMarket, icon: Images.saita_markit_icon },
    // { type: 'Learn', name: LanguageManager.learn, icon: Images.learn_icon },
    { type: 'GetSupport', name: LanguageManager.getSupport, icon: Images.support_icon },
  ];

  useEffect(() => {
    props.navigation.addListener('focus', () => {
      // getThemeData();
      Singleton.getInstance()
        .newGetData(constants.SOCIAL_LINKS)
        .then(socialLinks => {
          //console.warn('MM','socialLinks', socialLinks);
          if (socialLinks) {
            showLoader = false;
            setlinkList(JSON.parse(socialLinks));
          }
        });

      EventRegister.addEventListener('downModal', data1 => {
        setModalVisible(false);
      });
    });
    // socialLinkList();
  }, []);

  const renderSupportItem = ({ item, index }) => {

    return (
      <TouchableOpacity
        onPress={() => {
          item?.type == 'Learn' ?
            Linking.openURL('https://saitama.academy')
            :
            item?.type == 'GetSupport' ?
              getCurrentRouteName() != 'GetSupport' && navigate(NavigationStrings.GetSupport)
              :
              Linking.openURL('https://fang.art')


        }}
        activeOpacity={1}
        style={[
          styles.languageItemWrapStyle,
          {
            // borderColor:
            //   index == selectedlang
            //     ? ThemeManager.colors.primary
            //     : 'transparent',
            backgroundColor: ThemeManager.colors.backgroundColor,
            shadowColor:ThemeManager.colors.shadowColor,
            shadowOffset: {
              width: 0,
              height: 3,
            },
            shadowOpacity: 0.1,
            shadowRadius: 3.05,
            elevation: 4,
          },
        ]}>
        <View
          style={{
            height: widthDimen(38), width: widthDimen(38),
            backgroundColor: 'transparent',//ThemeManager.colors.primary,
            // borderRadius: widthDimen(20),
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <FastImage source={images.viewWithShadow}
            style={{ height: widthDimen(38), width: widthDimen(38), resizeMode:'contain',
            justifyContent: 'center',
            alignItems: 'center' }}
          />

          <FastImage source={item?.icon}
            style={{ height: widthDimen(16), width: widthDimen(14), resizeMode:'contain',position:'absolute'
           }}
            resizeMode={FastImage.resizeMode.contain}
          />
          
        </View>
        <Text
          style={[
            styles.languageItemStyle,
            {
              color: ThemeManager.colors.textColor
              // color:
              //   index == selectedlang
              //     ? ThemeManager.colors.textColor
              //     : Colors.lightGrey2,
            },
          ]}>
          {item?.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Wrap style={{ backgroundColor: ThemeManager.colors.bg }}>
      <View style={[styles.centeredView, props.ModalStyle]}>
        <SimpleHeader
          title={LanguageManager.saitaProSupport}
          backImage={ThemeManager.ImageIcons.iconBack}
          imageShow
          back={false}
          backPressed={() => goBack()}
          titleStyle={{
            textTransform:'none'
          }}
        />

        <BorderLine
          borderColor={{ backgroundColor: ThemeManager.colors.viewBorderColor }}
        />

        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: widthDimen(22),
            // justifyContent: 'space-between',
            marginTop: heightDimen(20),
          }}>
          <FlatList
            data={supportOptions}
            style={{}}
            scrollEnabled={false}
            renderItem={renderSupportItem}
            keyExtractor={(item, index) => index?.toString()}
            contentContainerStyle={{
              paddingHorizontal:widthDimen(5),
              paddingBottom:heightDimen(10)
            }}
          />


          {/* <BasicButton
            disabled={true}
            onPress={() => {
              setSelectedButton('SaitaPro');
              Linking.openURL('https://fang.art');
            }}
            btnStyle={{
              // flex: 1,
              // marginHorizontal: 10,
              height: 55,
              justifyContent: 'center',
              borderRadius: 10,
              // paddingHorizontal: 25,
              width: '45%',
            }}
            customGradient={{ borderRadius: 10, height: 55, width: '100%' }}
            // colors={Singleton.getInstance().dynamicColor}
            text={'SaitaPro'}
            colorGradient={selectedButton === 'SaitaPro' ? false : true}
            textStyle={{
              fontSize: 14,
              fontFamily: Fonts.regular,
              color:
                selectedButton === 'SaitaPro'
                  ? Colors.white
                  : Colors.lightGrey2,
            }}
            rightImage
            icon={Images.imgFangArt}
            iconStyle={{
              tintColor:
                selectedButton === 'SaitaPro'
                  ? Colors.white
                  : ThemeManager.colors.textColor,
            }}
          // textStyle={{fontSize: 14, fontFamily: fonts.regular}}
          /> */}
          {/* <TouchableOpacity
            disabled
            style={{
              height: 60,
              width: '45%',
              borderColor: Colors.borderColorLang,
              borderWidth: 1,
              borderRadius: 12,
              marginEnd: 20,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={Images.saita}
              style={{height: 20, width: 20, marginHorizontal: 5}}
            />
            <Text
              style={[
                styles.textnewlight,
                {color: ThemeManager.colors.textColor},
              ]}>
              SaitaPro
            </Text>
          </TouchableOpacity> */}
          {/* <BasicButton
            onPress={() => {
              setSelectedButton('FANG Art');
              Linking.openURL('https://fang.art');
            }}
            btnStyle={{
              // flex: 1,
              // marginHorizontal: 10,
              height: 55,
              justifyContent: 'center',
              borderRadius: 10,
              // paddingHorizontal: 25,
              width: '45%',
            }}
            customGradient={{ borderRadius: 10, height: 55, width: '100%' }}
            // colors={Singleton.getInstance().dynamicColor}
            text={'FANG Art'}
            colorGradient={selectedButton === 'FANG Art' ? false : true}
            textStyle={{
              fontSize: 14,
              fontFamily: Fonts.regular,
              color:
                selectedButton === 'FANG Art'
                  ? Colors.white
                  : Colors.lightGrey2,
            }}
            rightImage
            icon={Images.imgFangArt}
            iconStyle={{
              tintColor:
                selectedButton === 'FANG Art'
                  ? Colors.white
                  : ThemeManager.colors.textColor,
            }}
          /> */}
        </View>

        {/* <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 25,
            justifyContent: 'space-between',
            marginTop: 20,
          }}>
          <BasicButton
            disabled={true}
            onPress={() => {
              setSelectedButton('Saitama Store');
              Linking.openURL('https://fang.art');
            }}
            btnStyle={{
              // flex: 1,
              // marginHorizontal: 10,
              height: 55,
              justifyContent: 'center',
              borderRadius: 10,
              // paddingHorizontal: 25,
              width: '45%',
            }}
            customGradient={{ borderRadius: 10, height: 55, width: '100%' }}
            // colors={Singleton.getInstance().dynamicColor}
            text={'Saitama Store'}
            rightImage
            icon={Images.imgFangArt}
            colorGradient={selectedButton === 'Saitama Store' ? false : true}
            textStyle={{
              fontSize: 14,
              fontFamily: Fonts.regular,
              color:
                selectedButton === 'Saitama Store'
                  ? Colors.white
                  : Colors.lightGrey2,
            }}
            iconStyle={{
              tintColor:
                selectedButton === 'Saitama Store'
                  ? Colors.white
                  : ThemeManager.colors.textColor,
            }}
          />
         
          <BasicButton
            disabled={true}
            onPress={() => {
              setSelectedButton('SaitaMarket');
              Linking.openURL('https://fang.art');
            }}
            btnStyle={{
              // flex: 1,
              // marginHorizontal: 10,
              height: 55,
              justifyContent: 'center',
              borderRadius: 10,
              // paddingHorizontal: 25,
              width: '45%',
            }}
            customGradient={{ borderRadius: 10, height: 55, width: '100%' }}
            // colors={Singleton.getInstance().dynamicColor}
            text={'SaitaMarket'}
            rightImage
            icon={Images.imgFangArt}
            colorGradient={selectedButton === 'SaitaMarket' ? false : true}
            textStyle={{
              fontSize: 14,
              fontFamily: Fonts.regular,
              color:
                selectedButton === 'SaitaMarket'
                  ? Colors.white
                  : Colors.lightGrey2,
            }}
            iconStyle={{
              tintColor:
                selectedButton === 'SaitaMarket'
                  ? Colors.white
                  : ThemeManager.colors.textColor,
            }}
          />
          
        </View> */}

        {/* <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 25,
            justifyContent: 'space-between',
            marginTop: 20,
          }}>
          <BasicButton
            disabled={false}
            onPress={() => {
              setSelectedButton('Learn');
              Linking.openURL('https://saitama.academy');
            }}
            btnStyle={{
              // flex: 1,
              // marginHorizontal: 10,
              height: 55,
              justifyContent: 'center',
              borderRadius: 10,
              // paddingHorizontal: 25,
              width: '45%',
            }}
            customGradient={{ borderRadius: 10, height: 55, width: '100%' }}
            // colors={Singleton.getInstance().dynamicColor}
            text={'Learn'}
            rightImage
            icon={Images.imgFangArt}
            colorGradient={selectedButton === 'Learn' ? false : true}
            textStyle={{
              fontSize: 14,
              fontFamily: Fonts.regular,
              color:
                selectedButton === 'Learn' ? Colors.white : Colors.lightGrey2,
            }}
            iconStyle={{
              tintColor:
                selectedButton === 'Learn'
                  ? Colors.white
                  : ThemeManager.colors.textColor,
            }}
          />
       
          <BasicButton
            disabled={false}
            onPress={() => {
              setSelectedButton('Get Support');
              getCurrentRouteName() != 'GetSupport' && Actions.GetSupport();
            }}
            btnStyle={{
              // flex: 1,
              // marginHorizontal: 10,
              height: 55,
              justifyContent: 'center',
              borderRadius: 10,
              // paddingHorizontal: 25,
              width: '45%',
            }}
            customGradient={{ borderRadius: 10, height: 55, width: '100%' }}
            // colors={Singleton.getInstance().dynamicColor}
            text={'Get Support'}
            rightImage
            icon={Images.imgFangArt}
            colorGradient={selectedButton === 'Get Support' ? false : true}
            textStyle={{
              fontSize: 14,
              fontFamily: Fonts.regular,
              color:
                selectedButton === 'Get Support'
                  ? Colors.white
                  : Colors.lightGrey2,
            }}
            iconStyle={{
              tintColor:
                selectedButton === 'Get Support'
                  ? Colors.white
                  : ThemeManager.colors.textColor,
            }}
          />
        
        </View> */}
      </View>
    </Wrap>
  );
};

const mapStateToProp = state => {
  const { } = state.walletReducer;
  return {};
};

// export default connect(mapStateToProp, {
//   getSocialList,
//   logoutUser,
//   enableDisableNoti,
//   getEnableDisableNotiStatus,
// })(SaitaProSupport);
export default SaitaProSupport;
