import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Linking,
  Dimensions,
  BackHandler,
} from 'react-native';
import styles from './CardHistoryDetailStyle';
import { Actions, ActionConst } from 'react-native-router-flux';
import { Images, Colors, Fonts } from '../../../theme';
import Singleton from '../../../Singleton';
import * as Constants from '../../../Constant';
import { connect } from 'react-redux';
import moment from 'moment';
import { Wrap, SimpleHeader, BorderLine } from '../../common';
import Loader from '../Loader/Loader';
import { getTransactionDetail } from '../../../Redux/Actions';
import FastImage from 'react-native-fast-image';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
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
    //console.warn('MM','Chk txnData::::::::::::', this.props.selectedItem);
    this.props.navigation.addListener('didFocus', () => {
      BackHandler.addEventListener('hardwareBackPress', this.backAction);
    });
    this.props.navigation.addListener('didBlur', this.screenBlur);
  }
  screenBlur = () => {
    BackHandler.removeEventListener('hardwareBackPress', this.backAction);
  };
  backAction = () => {
    //console.warn('MM','i detail');
    Actions.pop();
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
    let date = new Date((this.props.selectedItem?.item?.transaction_date - 12600 )* 1000)
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
                {this.getStatus(this.props.selectedItem?.item?.status)}
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
                  {this.gettxStatus(this.props.selectedItem?.item?.type)}:
                </Text>
                <Text
                  style={[
                    styles.newtextStyle,
                    { marginLeft: 0, color: ThemeManager.colors.textColor },
                  ]}>
                  {Singleton.getInstance().toFixednew(this.props.selectedItem?.item?.debit > 0 ? this.props.selectedItem?.item?.debit : this.props.selectedItem?.item?.credit, 2)} {this.props?.card_currency}
                </Text>
              </View>

              <View style={styles.viewStyle}>
                <Text
                  style={[
                    styles.newtextStyle,
                    { marginLeft: 0, color: ThemeManager.colors.textColor },
                  ]}>
                  Transaction Id: {this.props.selectedItem?.item?.tx_id}
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
