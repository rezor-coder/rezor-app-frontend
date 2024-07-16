import moment from 'moment';
import React, { Component } from 'react';
import {
  BackHandler,
  SafeAreaView,
  Text,
  View
} from 'react-native';
import { connect } from 'react-redux';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import { getTransactionDetail } from '../../../Redux/Actions';
import Singleton from '../../../Singleton';
import { Colors } from '../../../theme';
import { BorderLine, SimpleHeader, Wrap } from '../../common';
import Loader from '../Loader/Loader';
import styles from './CardHistoryDetailStyle';
import { goBack } from '../../../navigationsService';
class CardHistoryDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transType: 'DEPOSIT',
      setImgStyle: false,
      data: this.props?.TxnData,
    };
  }
  componentDidMount() {
    global.isCamera = false;
    //console.warn('MM','Chk txnData::::::::::::', this.props?.route?.params?.selectedItem);
    this.props.navigation.addListener('focus', () => {
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



  getDate(date) {
    //16 02 2020
    const data = date.substring(0, 2) + "-" + date.substring(2, 4) + "-" + date.substring(4, 8)
    return data

  }

  gettxStatus(type) {
    switch (type) {
      case 1:
        return "Consume";
      case 2:
        return "Recharge";
      case 3:
        return "Withdrawal";
      case 4:
        return " Transfer In";
      case 5:
        return "Transfer Out";
      case 6:
        return "Other";
      case 7:
        return "Settlement adjustment";
      case 8:
        return "Refund";
      default:
        return "Consume";
    }
  }

  getStatus(item) {
    if (item == 0) {
      return 'Pending';
    }
    if (item == 1) {
      return 'Completed';
    }
    if(item == 2){
      return 'Failed'
    }
  }
  render() {
    let date = new Date((this.props?.route?.params?.selectedItem?.item?.transaction_date - 12600 )* 1000)
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
                { color: ThemeManager.colors.textColor , paddingHorizontal:10},
              ]}>
              {LanguageManager.transactionDate}
              <Text style={{ color: ThemeManager.colors.inActiveColor }
            }>
              {'  '}
              {moment(date).format("DD-MM-YYYY")}
              </Text>
            </Text>
            <View style={styles.statusStyle}>

              <Text
                style={[
                  styles.newtextStyle,
                  { marginLeft: 0, color: ThemeManager.colors.textColor },
                ]}>
                {this.getStatus(this.props?.route?.params?.selectedItem?.item?.status)}
              </Text>
            </View>

            <View
              style={[
                styles.cardStyleNew,
                { backgroundColor: ThemeManager.colors.headerBg },
              ]}>
              <View style={styles.cardTextStyle}>

                <Text
                  style={[
                    styles.newtextStyle,
                    { marginLeft: 10, color: ThemeManager.colors.textColor },
                  ]}>
                  {this.gettxStatus(this.props?.route?.params?.selectedItem?.item?.type)}:
                </Text>
                <Text
                  style={[
                    styles.newtextStyle,
                    { marginLeft: 0, color: ThemeManager.colors.textColor },
                  ]}>
                  {Singleton.getInstance().toFixednew(this.props?.route?.params?.selectedItem?.item?.debit > 0 ? this.props?.route?.params?.selectedItem?.item?.debit : this.props?.route?.params?.selectedItem?.item?.credit, 2)} {this.props?.route?.params?.card_currency}
                </Text>
              </View>

              <View style={styles.viewStyle}>
                <Text
                  style={[
                    styles.newtextStyle,
                    { marginLeft: 0, color: ThemeManager.colors.textColor },
                  ]}>
                  Transaction Id: {this.props?.route?.params?.selectedItem?.item?.tx_id}
                </Text>

              </View>
            </View>


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
  CardHistoryDetail,
);
