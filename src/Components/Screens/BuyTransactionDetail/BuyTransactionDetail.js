import moment from 'moment';
import React, { Component } from 'react';
import {
  BackHandler,
  Linking,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import * as Constants from '../../../Constant';
import { getTransactionDetail } from '../../../Redux/Actions';
import { Colors, Images } from '../../../theme';
import { BorderLine, SimpleHeader, Wrap } from '../../common';
import Loader from '../Loader/Loader';
import styles from './BuyTransactionDetailStyle';
import { goBack } from '../../../navigationsService';
class BuyTransactionDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transType: 'DEPOSIT',
      txnDetail: [],
      setImgStyle: false,
      data: this.props?.route?.params?.TxnData,
    };
  }
  componentDidMount() {
    global.isCamera = false;
    //console.warn('MM','Chk txnData::::::::::::', this.props.TxnData);
    //console.warn('MM','Chk txnData::::::::::::dataaa', this.state.data);
    this.props.navigation.addListener('focus', () => {
      //  this.getTxnDetail(this.props.TxnData?.table_id, this.props.TxnData?.type);
      BackHandler.addEventListener('hardwareBackPress', this.backAction);
    });
    this.props.navigation.addListener('blur', this.screenBlur);
  }
  screenBlur = () => {
    BackHandler.removeEventListener('hardwareBackPress', this.backAction);
  };
  backAction = () => {
    //console.warn('MM','i detail');
    goBack();
    return true;
  };
  // getTxnDetail(table_id, trnx_type) {
  //   this.setState({ isLoading: true });
  //   let data = {
  //     table_id: table_id,
  //     trnx_type: trnx_type,
  //   };
  //   let access_token = Singleton.getInstance().access_token;
  //   this.props.getTransactionDetail({ data, access_token }).then(res => {
  //     this.setState({ isLoading: false, txnDetail: res.data[0] });
  //   }).catch(err => {
  //     this.setState({ isLoading: false });
  //     Singleton.showAlert(err.message);
  //   });
  // }
  openExplorer() {
    Linking.openURL(
      Constants.network == 'testnet'
        ? 'https://rinkeby.etherscan.io/tx/' + this.state.data.tx_id
        : 'https://etherscan.io/tx/' + this.state.data.tx_id,
    );
  }
  getStatusImage(item) {
    if (item == 'failed') {
      return Images.modal_close_icon;
    }
    if (item == 'confirmed') {
      return Images.icon_successfully_sent;
    }
    if (item == 'pending') {
      return Images.time_icon;
    }
  }
  getStatus(item) {
    if (item == 'failed') {
      return 'Failed';
    }

    if (item == 'pending') {
      return 'Pending';
    }
    if (item == 'confirmed') {
      return 'Completed';
    }
  }
  render() {
    return (
      <>
        <Wrap style={{ backgroundColor: ThemeManager.colors.backgroundColor }}>
          {/* <SimpleHeader title={LanguageManager.transactionDetails} /> */}
          <SimpleHeader
            title={LanguageManager.transactionDetails}
            // rightImage={[styles.rightImgStyle]}
            backImage={ThemeManager.ImageIcons.iconBack}
            titleStyle
            imageShow
            back={false}
            backPressed={() => {
              // props.navigation.state.params.onGoBack();
              this.props.navigation.goBack();
            }}
          />
          <BorderLine
            borderColor={{ backgroundColor: ThemeManager.colors.chooseBorder }}
          />
          <View style={styles.mainView}>
            <Text
              style={[
                styles.textStyle,
                { color: ThemeManager.colors.textColor },
              ]}>
              {LanguageManager.transactionOn}{' '}
              {moment(this.state.data?.created_at).format(
                'DD MMM, YYYY | hh:mm a',
              )}
            </Text>
            <View style={styles.statusStyle}>
              <FastImage
                tintColor={Colors.pink}
                resizeMode={'contain'}
                style={
                  this.getStatus(this.state.data.blockchain_status) ==
                    'completed' ||
                    this.getStatus(this.state.data.blockchain_status) == 'pending'
                    ? styles.ImgTintStyle
                    : styles.ImgStye2
                }
                source={
                  this.state.data.blockchain_status != undefined &&
                  this.getStatusImage(this.state.data.blockchain_status)
                }
              />
              <Text
                style={[
                  styles.newtextStyle,
                  { marginLeft: 0, color: ThemeManager.colors.textColor },
                ]}>
                {' '}
                {this.getStatus(this.state.data.blockchain_status)}{' '}
              </Text>
            </View>

            <View
              style={[
                styles.cardStyleNew,
                { backgroundColor: ThemeManager.colors.headerBg },
              ]}>
              <View style={styles.cardTextStyle}>
                <FastImage
                  tintColor={Colors.pink}
                  style={styles.ImgStyle}
                  resizeMode={'contain'}
                  source={Images.icon_receive}
                />
                <Text
                  style={[
                    styles.newtextStyle,
                    { marginLeft: 0, color: ThemeManager.colors.textColor },
                  ]}>
                  Buy {this.state.data.crypto_symbol.toUpperCase()}
                </Text>
                <Text
                  style={[
                    styles.newtextStyle,
                    { marginLeft: 0, color: ThemeManager.colors.textColor },
                  ]}>
                  $ {this.state.data?.amount}
                </Text>
              </View>

              <View style={styles.viewStyle}>
                <Text
                  style={[
                    styles.newtextStyle,
                    { marginLeft: 0, color: ThemeManager.colors.textColor },
                  ]}>
                  Order Id: {this.state.data?.order_id}
                </Text>
                {this.state.data?.send_crypto_amount ? (
                  <Text
                    style={[
                      styles.newtextStyle,
                      { marginLeft: 0, color: ThemeManager.colors.textColor },
                    ]}>
                    Purchased: {this.state.data?.send_crypto_amount} {this.state.data.crypto_symbol.toUpperCase()}
                  </Text>
                ) : null}
                {this.state.data.tx_id != null && (
                  <Text
                    style={[
                      styles.newtextStyle,
                      { marginLeft: 0, color: ThemeManager.colors.textColor },
                    ]}>
                    Transaction Id: {this.state.data?.tx_id}
                  </Text>
                )}
              </View>
            </View>

            {this.state.data.tx_id != null && (
              <View style={styles.bottomView}>
                <TouchableOpacity
                  style={{ height: 50, justifyContent: 'center' }}
                  onPress={() => {
                    this.openExplorer();
                  }}>
                  <Text
                    style={[
                      styles.bottomTextStyle,
                      { color: ThemeManager.colors.textColor },
                    ]}>
                    {' '}
                    {LanguageManager.viewInTransactionExplorer}{' '}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          {this.state.isLoading && <Loader color="white" />}
        </Wrap>
        <SafeAreaView style={{ backgroundColor: Colors.black }} />
      </>
    );
  }
}
const mapStateToProp = state => {
  const { } = state.walletReducer;
  return {};
};
export default connect(mapStateToProp, { getTransactionDetail })(
  BuyTransactionDetail,
);
