import moment from 'moment';
import React, { Component } from 'react';
import {
  BackHandler,
  Linking,
  SafeAreaView,
  Text,
  View
} from 'react-native';
import { connect } from 'react-redux';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import * as Constants from '../../../Constant';
import { getTransactionDetail } from '../../../Redux/Actions';
import Singleton from '../../../Singleton';
import { areaDimen, heightDimen, widthDimen } from '../../../Utils/themeUtils';
import { Colors, Images } from '../../../theme';
import fonts from '../../../theme/Fonts';
import { CommaSeprator3 } from '../../../utils';
import { BasicButton, BorderLine, SimpleHeader, Wrap } from '../../common';
import Loader from '../Loader/Loader';
import styles from './TransactionDetailStyle';
import { goBack } from '../../../navigationsService';
class TransactionDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transType: 'DEPOSIT',
      txnDetail: [],
      setImgStyle: false,
      data: this.props?.route?.params?.TxnData,
      isLoading:false
    };
  }
  componentDidMount() {
    // //console.warn('MM','state--transaction-detail-data-', this.props?.TxnData);
    //console.warn('MM','-transaction-detail-', this.state.data);

    global.isCamera = false;
    //console.warn('MM','Chk txnData::::::::::::', this.props.TxnData);
    this.props.navigation.addListener('focus', () => {
      this.getTxnDetail(this.props.route?.params.TxnData?.table_id, this.props.route?.params.TxnData?.type);
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
  getTxnDetail(table_id, trnx_type) {
    this.setState({ isLoading: true });
    let data = {
      table_id: table_id,
      trnx_type: trnx_type,
    };
    let access_token = Singleton.getInstance().access_token;
    this.props
      .getTransactionDetail({ data, access_token })
      .then(res => {
        console.log("res===",res);
        console.log("native_coin_fiat_price===",res?.data[0]);
        this.setState({ isLoading: false, txnDetail: res.data[0] });
      })
      .catch(err => {
        this.setState({ isLoading: false });
        Singleton.showAlert(err.message);
      });
  }
  openExplorer() {
    if (this.state.txnDetail.coin_family == 1) {
      Linking.openURL(
        Constants.network == 'testnet'
          ? 'https://sepolia.etherscan.io/tx' + this.state.txnDetail.tx_id
          : 'https://etherscan.io/tx/' + this.state.txnDetail.tx_id,
      );
      return;
    } else if (this.state.txnDetail.coin_family == 6) {
      Linking.openURL(
        Constants.network == 'testnet'
          ? 'https://testnet.bscscan.com/tx/' + this.state.txnDetail.tx_id
          : 'https://bscscan.com/tx/' + this.state.txnDetail.tx_id,
      );
      return;
    } else if (this.state.txnDetail.coin_family == 11) {
      Linking.openURL(
        Constants.network == 'testnet'
          ? `https://mumbai.polygonscan.com/tx/${this.state.txnDetail.tx_id}`
          : `https://polygonscan.com/tx/${this.state.txnDetail.tx_id}`,
      );
      return;
    } else if (this.state.txnDetail.coin_family == 2) {
      Linking.openURL(
        Constants.network == 'testnet'
          ? `https://live.blockcypher.com/btc-testnet/tx/${this.state.txnDetail.tx_id}`
          : `https://live.blockcypher.com/btc/tx/${this.state.txnDetail.tx_id}`,
      );
      return;
    } else if (this.state.txnDetail.coin_family == 3) {
      Linking.openURL(
        Constants.network == 'testnet'
          ? 'https://nile.tronscan.org/#/transaction/' + this.state.txnDetail.tx_id
          : 'https://tronscan.org/#/transaction/' + this.state.txnDetail.tx_id,
      );
      return;
    }else if (this.state.txnDetail.coin_family == 4) {
      console.log(Constants.network,'Constants.network ');
      Linking.openURL(
        Constants.network == 'testnet'
        ? 'https://testnet.saitascan.io/tx/' + this.state.txnDetail.tx_id
        : 'https://saitascan.io/tx/' + this.state.txnDetail.tx_id
          // : Singleton.getInstance().stcExplorerLink + this.state.txnDetail.tx_id,
      );
      return;
    }
  }
  getStatusImage(item) {
    var trx_type = this.props.route?.params.TxnData?.type.toLowerCase();
    var status = item?.status?.toLowerCase();
    var blockChain_status =
      item.blockchain_status != null
        ? item.blockchain_status.toLowerCase()
        : item.blockchain_status;
    if (status == 'failed' || blockChain_status == 'failed') {
      return Images.transaction_erro_icon;
    } else if (trx_type == 'withdraw') {
      if (blockChain_status == 'confirmed' && status == 'complete') {
        return Images.icon_successfully_sent;
      }
      if (blockChain_status == null && status == 'complete') {
        return Images.time_icon;
      }
      if (blockChain_status == null && status == 'unconfirmed') {
        return Images.time_icon;
      }
    } else if (trx_type != 'withdraw') {
      if (status == 'complete') {
        return Images.icon_successfully_sent;
      }
      if (status == 'unconfirmed') {
        return Images.time_icon;
      }
    }
  }
  getStatus(item) {
    console.log('--------TX_DAATA', this.props.route?.params.TxnData);
    var trx_type = this.props.route?.params.TxnData?.type.toLowerCase();
    var status = item?.status?.toLowerCase();
    var blockChain_status =
      item.blockchain_status != null
        ? item.blockchain_status.toLowerCase()
        : item.blockchain_status;
    if (status == 'failed' || blockChain_status == 'failed') {
      return 'Failed';
    } else if (trx_type == 'withdraw') {
      if (blockChain_status == 'confirmed' && status == 'complete') {
        return 'Completed';
      }
      if (blockChain_status == null && status == 'complete') {
        return 'Pending';
      }
      if (blockChain_status == null && status == 'unconfirmed') {
        return 'Pending';
      }
    } else if (trx_type != 'withdraw') {
      if (status == 'complete') {
        return 'Completed';
      }
      if (status == 'unconfirmed') {
        return 'Pending';
      }
    }
  }
  getMarketPrice = (itemData) => {
    let selectedPrice = itemData?.fiat_price_per_unit
      ?.find(item => {
        return item.fiat_type == Singleton.getInstance().CurrencySelected.toLowerCase()
      })
    return selectedPrice?.value
  }
  getMarketFeePrice = (itemData) => {
    let selectedPrice = itemData?.native_coin_fiat_price
      ?.find(item => {
        return item.fiat_type == Singleton.getInstance().CurrencySelected.toLowerCase()
      })
    return selectedPrice?.value
  }
  renderItem(data, item, value, symbol = "") {
    return (
      <>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingVertical: heightDimen(17)
        }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '30%'
          }}>
            <Text
              style={[
                styles.titleTextStyle,
                { color: ThemeManager.colors.lightTextColor },
              ]}>
              {item}
            </Text>
          </View>

          <View style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            width: '65%',
            alignItems: 'center',
          }}>
            {item == "Amount" ?
              <>
                <Text
                  style={[
                    styles.amountTextStyle,
                    {
                      color: ThemeManager.colors.headingText,
                      fontSize: areaDimen(18),
                      fontFamily: fonts.semibold
                    },
                  ]}
                  numberOfLines={1}>
                  {value + ' ' + symbol}
                </Text>
                <View style={{
                  backgroundColor: '#536B84',
                  width: 1,
                  height: heightDimen(16),
                  marginHorizontal: widthDimen(4)
                }} />
                <Text
                  style={[
                    styles.amountDollarTextStyle,
                    {
                      color: ThemeManager.colors.lightTextColor,
                      fontSize: areaDimen(16),
                      fontFamily: fonts.semibold
                    },
                  ]}
                  numberOfLines={1}>
                  {Singleton.getInstance().CurrencySymbol}
                  {data?.amount != '' ?
                   this.getMarketPrice(data) ?
                   data?.amount.toString().includes('e')

                        ? CommaSeprator3( this.getMarketPrice(data) * Singleton.getInstance().exponentialToDecimal(
                            parseFloat(data?.amount).toFixed(8),),2 )
                        : (this.getMarketPrice(data) * Singleton.getInstance().toFixed(data?.amount != '' ? 
                         parseFloat(data?.amount) : 0, 5)).toFixed(2) 
                    : "0.00" 
                    : "0.00"}
                </Text>
              </>
              :
              item == "Network Fee" ?
                <>
                  <Text
                    style={[
                      styles.amountTextStyle,
                      { color: ThemeManager.colors.headingText },
                    ]}
                    numberOfLines={1}>
                  {value + ' ' + symbol}
                  </Text>

                  <Text
                    style={[
                      styles.amountDollarTextStyle,
                      { color: ThemeManager.colors.headingText },
                    ]}
                    numberOfLines={1}>
                    {' /' + Singleton.getInstance().CurrencySymbol}
                    {data?.transaction_fee != '' ? this.getMarketFeePrice(data) ? (this.getMarketFeePrice(data) * Singleton.getInstance().toFixed(data?.transaction_fee != '' ? parseFloat(data?.transaction_fee) : 0, 5)).toFixed(2) : "0.00" : "0.00"}
                  </Text>
                </>
                :
                item == "Status" ?
                  <Text
                    style={[
                      styles.mediumTextStyle,
                      {
                        color: value == 'Completed' ? "#34CC79" : value == 'Failed' ? Colors.red : "#FFD041",
                        lineHeight: areaDimen(18)
                      },
                    ]}
                    numberOfLines={1}>
                    {value}
                  </Text>
                  :
                  <Text
                    style={[
                      styles.mediumTextStyle,
                      {
                        color: ThemeManager.colors.headingText,
                        lineHeight: areaDimen(18)
                      },
                    ]}
                    numberOfLines={1}>
                    {value}
                  </Text>
            }
          </View>

        </View>
        {item != "Network Fee" &&
          <BorderLine
            borderColor={{ backgroundColor: ThemeManager.colors.viewBorderColor, marginTop: 0 }}
          />
        }
      </>
    )
  }

  render() {
    return (
      <>
        <Wrap style={{ backgroundColor: ThemeManager.colors.bg }}>
          <SimpleHeader
            title={LanguageManager.transactionDetails}
            backImage={ThemeManager.ImageIcons.iconBack}
            titleStyle
            imageShow
            back={false}
            backPressed={() => {
              this.props.navigation.goBack();
            }}
          />
          <BorderLine
            borderColor={{ backgroundColor: ThemeManager.colors.viewBorderColor }}
          />
          <View style={styles.mainView}>
            {this.state.txnDetail?.amount != undefined &&
            this.renderItem(this.state.txnDetail, "Amount",
              this.state.txnDetail?.amount != undefined
                ? this.state.txnDetail?.amount.toString().includes('e')
                  ? Singleton.getInstance().exponentialToDecimal(
                    parseFloat(this.state.txnDetail?.amount).toFixed(8),
                  )
                  : Singleton.getInstance().toFixednew(
                    this.state.txnDetail?.amount, 6)
                : 0
              ,
              this.state.txnDetail?.coin_symbol != undefined ? this.state.txnDetail?.coin_symbol?.toUpperCase() : ""
            )}

            {this.state.txnDetail?.created_at != undefined && 
            this.renderItem(this.state.txnDetail, "Date", moment(this.state.txnDetail?.created_at).format(
              'DD-MM-YYYY')
            )}

            {this.state.txnDetail?.from_adrs != undefined &&
            this.renderItem(this.state.txnDetail, "From", this.state.txnDetail?.from_adrs == undefined
              ? ''
              : this.state.txnDetail?.from_adrs)}

            { this.state.txnDetail?.to_adrs != undefined &&
             this.renderItem(this.state.txnDetail, "To", this.state.txnDetail?.to_adrs == undefined
              ? ''
              : this.state.txnDetail?.to_adrs)}

            {this.state.txnDetail.status != undefined && 
            this.renderItem(this.state.txnDetail, "Status", this.getStatus(this.state.txnDetail))}

            {this.state.txnDetail?.transaction_fee != undefined && this.state.txnDetail?.transaction_fee != 0 &&
            this.renderItem(this.state.txnDetail, "Network Fee",
            this.state.txnDetail?.transaction_fee != undefined ? this.state.txnDetail?.transaction_fee : '',
            this.state.txnDetail?.coin_symbol != undefined ? (this.state.txnDetail?.coin_family==1?'ETH':this.state.txnDetail?.coin_family==6?'BNB':this.state.txnDetail?.coin_family==3?'TRX':this.state.txnDetail?.coin_family==11?'MATIC':this.state.txnDetail?.coin_family==4?'STC':this.state.txnDetail?.coin_symbol?.toUpperCase() ) : "")}
            <View style={styles.bottomView}>
              <BasicButton
                onPress={() => {
                  this.openExplorer();
                }}
                btnStyle={styles.btnStyle}
                customGradient={styles.customGrad}
                text={LanguageManager.viewInTransactionExplorer}
              />
            </View>
          </View>
          {this.state.isLoading && (
            <Loader color={ThemeManager.colors.textColor} />
          )}
        </Wrap>
        <SafeAreaView
          style={{ backgroundColor: ThemeManager.colors.bg }}
        />
      </>
    );
  }
}
const mapStateToProp = state => {
  const { } = state.walletReducer;
  return {};
};
export default connect(mapStateToProp, { getTransactionDetail })(
  TransactionDetail,
);
