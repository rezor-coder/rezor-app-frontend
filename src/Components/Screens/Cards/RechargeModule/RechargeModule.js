import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Modal, Platform, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { LanguageManager, ThemeManager } from '../../../../../ThemeManager';
import { getCardPrice, getCardWalletList, getVaultSettings } from '../../../../Redux/Actions';
import Singleton from '../../../../Singleton';
import { Images } from '../../../../theme';
import { toFixedExp } from '../../../../utils';
import { areaDimen, height } from '../../../../Utils/themeUtils';
import BlurBottomModal from '../../../common/BlurBottomModal';
import GradientButton from '../../../common/GradientButton';
import ShimmerLoader from '../../../common/ShimmerLoader';
import TextInputWithLabel from '../../../common/TextInputWithLabel';
import Loader from '../../Loader/Loader';
import ListModal from '../../SwapSelected/ListModal';
import { styles } from './styles';
import { useQuery } from '@tanstack/react-query';

const RechargeModule = (props) => {
  const [loader, setLoader] = useState(true);
  const [accountData, setAccountData] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState({});
  const [feeLoader, setFeeLoader] = useState(false);
  const [feeObj, setFeeObj] = useState({});
  const [showAccountList, setShowAccountList] = useState(false);

  useEffect(()=>{
    if(!!props?.visible){
    setFeeLoader(true)
    getCardWalletList({})
      .then(async res1 => {
        console.log(res1,'res1res1res1res1res1');
        
        getVaultSettings()
          .then(async res => {
            let newData = res1?.wallets?.filter(item =>
              res?.WALLETS_TO_CREATE?.includes(item?.currency),
            );
            console.log(newData,'newDatanewData');
            
            await setAccountData(newData);
            console.log("new data::::::", newData);
            await setSelectedAccount(newData[0])
            getCurrencyFee(newData[0]?.currency)
            await setLoader(false);
          })
          .catch(async error => {
            console.error('Failed to fetch wallet list:', error);
            await setLoader(false);
            await Singleton.showAlert(error)
          });

      })
      .catch(async error => {
        await setLoader(false);
        await Singleton.showAlert(error)
        console.error('Failed to fetch wallet list:', error);
      });
            
    }
  },[props?.visible])
  const getCurrencyFee = (currency) => {
    getCardPrice(props?.userCards[0]?.cardRequestId, currency, props?.userCards[0]?.cardProgram)
      .then(res => {
        setFeeObj(res);
        setFeeLoader(false);
      })
      .catch(err => {
        Singleton.showAlert(err);
        setFeeLoader(false);
      });
  };

  const onSelectAccount = (value) => {
    setSelectedAccount(value);
    setFeeLoader(true);
    getCurrencyFee(value.currency);
  };

  const onCloseAllList = () => {
    setShowAccountList(false);
  };

  const renderCustomLeftIcon = () => {
    if (selectedAccount?.iconUrl) {
      return (
        <View style={{}}>
          <FastImage
            source={typeof selectedAccount?.iconUrl === 'string' ? { uri: selectedAccount?.iconUrl } : selectedAccount?.iconUrl}
            style={[
              styles.coinView,
              {
                backgroundColor: 'transparent',
                marginRight: Platform.OS === 'ios' ? areaDimen(12) : 0,
              },
            ]}
            resizeMode="contain"
          />
        </View>
      );
    }
    return (
      <View style={styles.coinView}>
        <Text style={styles.coinText}>
          {selectedAccount?.currency?.charAt(0)}
        </Text>
      </View>
    );
  };

  return (
    <View>
      <BlurBottomModal
        visible={props.visible}
        modalHeight={height / 1.9}
        onPressCloseSheet={props?.onPressCloseSheet}
      >
        <View style={{ paddingHorizontal: areaDimen(22), paddingVertical: areaDimen(18) }}>
          <View>
            <TextInputWithLabel
              editable={false}
              placeHolder={'Choose Currency'}
              rightIcon={Images.dropIconDownDark}
              mainContainerStyle={{ marginBottom: areaDimen(14) }}
              value={selectedAccount?.currency ?? ''}
              label={LanguageManager.chooseCurrencyToPay}
              rightIconStyle={{ height: areaDimen(10), width: areaDimen(10) }}
              onPress={() => setShowAccountList(true)}
              leftIconText={selectedAccount?.currency}
              customLeftIcon={isEmpty(selectedAccount) ? () => {} : renderCustomLeftIcon}
              labelStyle={{ marginBottom: areaDimen(20) }}
              customInputStyle={{ paddingHorizontal: areaDimen(7) }}
            />
            {!!selectedAccount.currency && (
              <Text style={[styles.availableBal, { color: ThemeManager.colors.inActiveColor }]}>
                {LanguageManager.availBal} {selectedAccount?.availableBalance} {selectedAccount.currency}
              </Text>
            )}
            {feeLoader ? (
              <ShimmerLoader style={styles.cardLockImageStyle} />
            ) : (
              <FastImage
                source={Images.circleAddWallet}
                style={styles.cardLockImageStyle}
                resizeMode="contain"
              />
            )}
            {feeLoader ? (
              <ShimmerLoader style={styles.feeTextShimmer} />
            ) : (
              <Text style={[styles.cardLockTitle, { color: ThemeManager.colors.textColor }]}>
                {`${LanguageManager.applyFee}: ${toFixedExp(feeObj?.card?.crypto?.value, 8)} ${feeObj?.card?.crypto?.currency}`}
              </Text>
            )}
            {feeLoader ? (
              <ShimmerLoader style={styles.feeTextShimmer2} />
            ) : (
              <Text style={styles.cardLockSubTitle}>
                {selectedAccount?.availableBalance < feeObj?.card?.crypto?.value
                  ? `${LanguageManager.cardWallet} ${feeObj?.card?.crypto?.currency} ${LanguageManager.rechargeFirst}`
                  : ''}
              </Text>
            )}
            {feeLoader ? (
              <ShimmerLoader style={styles.goToRechargeButton} />
            ) : (
              <GradientButton
                onPress={
                  selectedAccount?.availableBalance < feeObj?.card?.crypto?.value
                    ? props.onDeposit
                    : () => props.onPressConfirm(selectedAccount)
                }
                disabled={props.onPressActive}
                title={
                  selectedAccount?.availableBalance < feeObj?.card?.crypto?.value
                    ? LanguageManager.deposit
                    : LanguageManager.payFee
                }
                buttonStyle={styles.goToRechargeButton}
              />
            )}
          </View>
        </View>
        <Modal
          key={'1'}
          visible={showAccountList}
          animationType="slide"
          transparent
          statusBarTranslucent
          style={{ flex: 1, justifyContent: 'flex-end' }}
          onRequestClose={onCloseAllList}
        >
          <ListModal
            list={accountData}
            onPressItem={onSelectAccount}
            onClose={onCloseAllList}
            title={LanguageManager?.account}
          />
        </Modal>
        {loader && <Loader />}
      </BlurBottomModal>
    </View>
  );
};

export default RechargeModule;
