import Clipboard from '@react-native-community/clipboard';
import {QueryClient, useQuery} from '@tanstack/react-query';
import {isEmpty} from 'lodash';
import React, {createRef, useEffect, useState} from 'react';
import {AppState, Modal, Platform, Text, TouchableOpacity, View} from 'react-native';
import Toast from 'react-native-easy-toast';
import FastImage from 'react-native-fast-image';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import QRCode from 'react-native-qrcode-svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {LanguageManager, ThemeManager} from '../../../../../ThemeManager';
import {
  getCardWalletList,
  getVaultCardWalletList,
  getVaultSettings,
} from '../../../../Redux/Actions';
import {areaDimen} from '../../../../Utils/themeUtils';
import {Colors, Images} from '../../../../theme';
import {BorderLine, SimpleHeader} from '../../../common';
import TextInputWithLabel from '../../../common/TextInputWithLabel';
import Loader from '../../Loader/Loader';
import ListModal from '../../SwapSelected/ListModal';
import {styles} from './styles';
import Singleton from '../../../../Singleton';
const queryClient = new QueryClient();
const DepositScreen = ({navigation, route}) => {
  const insets = useSafeAreaInsets();
  const toast = createRef();
  const [accountData, setAccountData] = useState([]);
  const [showAccountList, setShowAccountList] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const {
    data: cardWalletListData,
    error: cardWalletListError,
    isLoading: isCardWalletListLoading,
  } = useQuery({
    queryKey: ['walletList'],
    queryFn: () => getCardWalletList({}),
  });
  const {
    data: vaultCardWalletListData,
    error: vaultCardWalletListError,
    isLoading: isVaultCardWalletListLoading,
  } = useQuery({
    queryKey: ['VaultCardWalletList'],
    queryFn: () => getVaultSettings(),
  });
  console.log(vaultCardWalletListData,'selectedAccount');

  useEffect(()=>{
    AppState.addEventListener('change', state => {
      console.log(state, 'statestatestate');
      if (state === 'inactive' || state === 'background') {
        setShowAccountList(false);

      }
    });
  },[])
  useEffect(() => {
    
    if (!isCardWalletListLoading && !isVaultCardWalletListLoading) {
      if (cardWalletListError) {
        Singleton.showAlert(
          cardWalletListError || LanguageManager.somethingWentWrong,
        );
        setIsLoading(false);
        console.error('Failed to fetch wallet list:', cardWalletListError);
        return;
      }

      if (vaultCardWalletListError) {
        Singleton.showAlert(vaultCardWalletListError);
        console.error('Failed to fetch wallet list:', vaultCardWalletListError);
        setIsLoading(false);
        return;
      }

      const newData = cardWalletListData?.wallets?.filter(item =>
        vaultCardWalletListData?.WALLETS_TO_CREATE?.includes?.(item?.currency),
      );
      let obj = null;

      if (route?.params?.account?.currency) {
        obj = newData?.find(
          data => data.currency === route.params.account.currency,
        );
      }

      setAccountData(newData);
      setSelectedAccount(obj ? obj : newData[0]);
      setIsLoading(false);
    }
  }, [
    isCardWalletListLoading,
    isVaultCardWalletListLoading,
    cardWalletListData,
    vaultCardWalletListData,
    cardWalletListError,
    vaultCardWalletListError,
  ]);

  const onCloseAllList = () => {
    setShowAccountList(false);
  };

  const onPressCopy = () => {
    Clipboard.setString(selectedAccount?.address);
    toast.current.show('Copy');
  };

  const renderCustomLefticon = () => {
    if (!!selectedAccount?.iconUrl) {
      return (
        <FastImage
          source={
            typeof selectedAccount?.iconUrl == 'string'
              ? {uri: selectedAccount?.iconUrl}
              : selectedAccount?.iconUrl
          }
          style={[
            styles.coinView,
            {
              backgroundColor: 'transparent',
              marginRight: Platform.OS === 'ios' ? areaDimen(12) : 0,
            },
          ]}
          resizeMode="contain"
        />
      );
    } else {
      return (
        <View style={styles.coinView}>
          <Text style={styles.coinText}>
            {selectedAccount?.currency?.charAt(0)}
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
        bounces={false}
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
            marginBottom: areaDimen(16),
          }}
          value={selectedAccount?.currency ?? ''}
          label={LanguageManager.account}
          rightIconStyle={{height: areaDimen(10), width: areaDimen(10)}}
          onPress={() => setShowAccountList(true)}
          leftIconText={selectedAccount?.currency}
          customLeftIcon={
            !isEmpty(selectedAccount) ? renderCustomLefticon : () => {}
          }
          onPressRightIcon={() => setShowAccountList(true)}
          customInputStyle={{paddingHorizontal: areaDimen(7)}}
        />
        {/* <TextInputWithLabel
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
        /> */}

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
              value={selectedAccount?.address}
              logo={selectedAccount.iconUrl}
              logoSize={areaDimen(26)}
              size={areaDimen(160)}
              logoBackgroundColor={Colors.White}
              logoBorderRadius={areaDimen(40)}
            />
          </View>
          {!isEmpty(selectedAccount) ? (
            <TouchableOpacity
              style={{
                ...styles.copyTextView,
                backgroundColor: ThemeManager.colors.dashboardBg,
              }}
              onPress={onPressCopy}>
              <View style={{flex: 0.84}}>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.qrSubTitleText,
                    {color: ThemeManager.colors.textColor},
                  ]}>
                  {selectedAccount?.address}..{' '}
                </Text>
              </View>
              <FastImage
                style={[styles.imgCopyInside]}
                source={Images.IconCopyInside}
                tintColor={ThemeManager.colors.primary}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ) : null}
        </View>
        {/* <Text
          style={[
            styles.addressText,
            {color: ThemeManager.colors.textColor, marginTop: areaDimen(16)},
          ]}>
          {LanguageManager.mainDepositAmount}
        </Text> */}
      </KeyboardAwareScrollView>
      {isLoading == true && <Loader isLoading={isLoading} />}

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

      {/* <Modal
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
      </Modal> */}
      <Toast ref={toast} />
    </View>
  );
};

export default DepositScreen;
