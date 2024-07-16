import React, { createRef, useState } from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import QRCode from 'react-native-qrcode-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import { areaDimen, width } from '../../../Utils/themeUtils';
import { Colors, Fonts, Images } from '../../../theme';
import { BorderLine, SimpleHeader } from '../../common';
import DropDown from '../../common/DropDown';
import { styles } from './styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import ListModal from '../SwapSelected/ListModal';
import TextInputWithLabel from '../../common/TextInputWithLabel';
import { Modal } from 'react-native';
import { isEmpty } from 'lodash';

const DepositScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const toast = createRef();
  const [accountData, setAccountData] = useState([
    {coin_name: 'USDT',coin_image:Images.usdtIcon},
    {coin_name: 'Crypto'},
    {coin_name: 'Bitcoin'},
  ]);
  const [selectedNetWorkData, setSelectedNetWorkData] = useState([
    {coin_name: 'CyberNex'},
    {coin_name: 'TRON'},
    {coin_name: 'MatrixLink'},
    {coin_name: 'DataPulse'},
  ]);

  const[showAccountList,setShowAccountList]= useState(false)
  const[showNetWork,setShowNetWork]= useState(false)

  const [selectedAccount, setSelectedAccount] = useState({});
  const [selectedNetWork, setSelectedNetWork] = useState({});
  
  const onCloseAllList = () =>{
    setShowAccountList(false);
    setShowNetWork(false)
  }

  const onPressCopy = () => {};

  const renderCustomLefticon = () => {
    if (!!selectedAccount?.coin_image) {
      return (
        <FastImage
          source={
            typeof selectedAccount?.coin_image == 'string'
              ? {uri: selectedAccount?.coin_image}
              : selectedAccount?.coin_image
          }
          style={[styles.coinView, {backgroundColor: 'transparent',marginRight:Platform.OS === 'ios' ?areaDimen(12):0}]}
          resizeMode="contain"
        />
      );
    } else {
      return (
        <View style={styles.coinView}>
          <Text style={styles.coinText}>
            {selectedAccount?.coin_name?.charAt(0)}
          </Text>
        </View>
      );
    }
  };
  const renderCustomLefticonTwo = () => {
    if (!!selectedNetWork?.coin_image) {
      return (
        <FastImage
          source={
            typeof selectedNetWork?.coin_image == 'string'
              ? {uri: selectedNetWork?.coin_image}
              : selectedNetWork?.coin_image
          }
          style={[styles.coinView, {backgroundColor: 'transparent',marginRight:Platform.OS === 'ios' ?areaDimen(12):areaDimen(6)}]}
          resizeMode="contain"
        />
      );
    } else {
      return (
        <View style={styles.coinView}>
          <Text style={styles.coinText}>
            {selectedNetWork?.coin_name?.charAt(0)}
          </Text>
        </View>
      );
    }
  };
  return (
    <View
      style={[
        styles.mainContainerStyle,
        {
          backgroundColor: ThemeManager.colors.dashboardBg,
          paddingTop: insets.top,
        },
      ]}>
      <SimpleHeader
        title={LanguageManager.deposit}
        backImage={ThemeManager.ImageIcons.iconBack}
        titleStyle
        imageShow
        back={false}
        backPressed={() => {
          navigation.goBack();
        }}
      />
      <BorderLine
        borderColor={{backgroundColor: ThemeManager.colors.viewBorderColor}}
      />
      {/* <View style={styles.borderLineStyle} /> */}
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        style={{
          flexGrow: 1,
        }}
        contentContainerStyle={{
          paddingBottom: areaDimen(50),
        }}>
        <TextInputWithLabel
          editable={false}
          placeHolder={LanguageManager.chooseAccount}
          rightIcon={Images.dropIconDownLight}
          tintColor={ThemeManager.colors.inActiveColor}
          mainContainerStyle={{
            marginHorizontal: areaDimen(22),
            marginTop: areaDimen(24),
          }}
          value={selectedAccount?.coin_name ?? ''}
          label={LanguageManager.account}
          rightIconStyle={{height: areaDimen(10), width: areaDimen(10)}}
          onPress={() => setShowAccountList(true)}
          leftIconText={selectedAccount?.coin_name}
          customLeftIcon={
            !isEmpty(selectedAccount) ? renderCustomLefticon : () => {}
          }
          customInputStyle={{paddingHorizontal: areaDimen(7)}}
        />
        <TextInputWithLabel
          editable={false}
          placeHolder={LanguageManager.selectNetwork}
          rightIcon={Images.dropIconDownLight}
          tintColor={ThemeManager.colors.inActiveColor}
          mainContainerStyle={{
            marginHorizontal: areaDimen(22),
            marginTop: areaDimen(16),
            marginBottom: areaDimen(16),
          }}
          label={LanguageManager.netWork}
          rightIconStyle={{height: areaDimen(10), width: areaDimen(10)}}
          value={selectedNetWork?.coin_name ?? ''}
          customLeftIcon={
            !isEmpty(selectedNetWork) ? renderCustomLefticonTwo : () => {}
          }
          onPress={() => setShowNetWork(true)}
          customInputStyle={{paddingHorizontal: areaDimen(7)}}
        />

        <Text
          style={[styles.addressText, {color: ThemeManager.colors.textColor}]}>
          {LanguageManager.address}
        </Text>

        <View
          style={{
            ...styles.qrMainView,
            backgroundColor: ThemeManager.colors.lightBlue2,
          }}>
          <Text
            style={[
              styles.qrTitleText,
              {color: ThemeManager.colors.textColor},
            ]}>
            {LanguageManager.onlyDepositUsdtToThisAddress}
          </Text>
          <View
            style={{
              backgroundColor: ThemeManager.colors.iconBg,
              shadowColor: ThemeManager.colors.textColor,
              ...styles.qrBackGround,
            }}>
            <QRCode
              value="http://awesome.link.qr"
              logo={Images.usdtIcon}
              logoSize={areaDimen(26)}
              logoBackgroundColor={Colors.white}
              logoBorderRadius={areaDimen(40)}
            />
          </View>
          <TouchableOpacity
            style={{
              ...styles.copyTextView,
              backgroundColor: ThemeManager.colors.dashboardBg,
            }}
            onPress={onPressCopy}>
            <View style={{flex: 0.9}}>
              <Text
                numberOfLines={1}
                style={[
                  styles.qrSubTitleText,
                  {color: ThemeManager.colors.textColor},
                ]}>
                {'bnb1fwfhpkmhcsh4vz9jsusd...gfda'}{' '}
              </Text>
            </View>
            <FastImage
              style={[styles.imgCopyInside]}
              source={Images.IconCopyInside}
              tintColor={ThemeManager.colors.primary}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        <Text
          style={[
            styles.addressText,
            {color: ThemeManager.colors.textColor, marginTop: areaDimen(16)},
          ]}>
          {LanguageManager.mainDepositAmount}
        </Text>
      </KeyboardAwareScrollView>

      <Modal
        key={'1'}
        visible={showAccountList}
        animationType="slide"
        transparent={true}
        statusBarTranslucent
        style={{flex: 1, justifyContent: 'flex-end'}}
        onRequestClose={onCloseAllList}>
        <ListModal
          list={accountData}
          onPressItem={value => setSelectedAccount(value)}
          onClose={onCloseAllList}
          title={LanguageManager.account}
        />
      </Modal>

      <Modal
        key={'2'}
        visible={showNetWork}
        animationType="slide"
        transparent={true}
        statusBarTranslucent
        style={{flex: 1, justifyContent: 'flex-end'}}
        onRequestClose={onCloseAllList}>
        <ListModal
          list={selectedNetWorkData}
          onPressItem={value => setSelectedNetWork(value)}
          onClose={onCloseAllList}
          title={LanguageManager.netWork}
        />
      </Modal>
    </View>
  );
};

export default DepositScreen;
