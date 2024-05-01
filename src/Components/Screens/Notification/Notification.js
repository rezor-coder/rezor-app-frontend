/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Clipboard,
  Modal,
  Alert,
  BackHandler,
} from 'react-native';
import styles from './NotificationStyle';
import { Images, Colors, Fonts } from '../../../theme';
import { ActionConst, Actions } from 'react-native-router-flux';
import Singleton from '../../../Singleton';
import * as Constants from '../../../Constant';
import { connect } from 'react-redux';
import moment from 'moment';
import { BorderLine, SimpleHeader, TitleHeader, Wrap } from '../../common';
import { getNotificationList } from '../../../Redux/Actions/index';
import Loader from '../Loader/Loader';
import FastImage from 'react-native-fast-image';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import { heightDimen, widthDimen } from '../../../Utils/themeUtils';

class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      page: 1,
      limit: 25,
      loadList: false,
      totalRecords: 0,
      showShimmer: true,
      notificationList: [],
    };
  }
  componentDidMount() {
    this.getNotificationList();
    this.props.navigation.addListener('didFocus', this.screenFocus);
    this.props.navigation.addListener('didBlur', this.screenBlur);
  }
  screenBlur = () => {
    BackHandler.removeEventListener('hardwareBackPress', this.backAction);
  };
  screenFocus = () => {
    BackHandler.addEventListener('hardwareBackPress', this.backAction);
  };
  backAction = () => {
    console.log("this.props.from::::",this.props.from);
   if(this.props.from=='Pin'){
    Actions.Main({ type: ActionConst.RESET });
    Actions.jump('Wallet');
    return true;
   }else{
    Actions.pop();
    return true;
   }
  };
  getNotificationList() {
    this.setState({ isLoading: true });
    let page = this.state.page;
    let limit = this.state.limit;
    let access_token = Singleton.getInstance().access_token;
    Singleton.getInstance()
      .newGetData(Constants.addresKeyList)
      .then(addresKeyList => {
        Singleton.getInstance()
          .newGetData(Constants.coinFamilyKeys)
          .then(coinFamilyKey => {
            let addrsListKeys = JSON.parse(addresKeyList);
            let coinFamilyKeys = coinFamilyKey?.split(',');
            this.props
              .getNotificationList({
                page,
                limit,
                addrsListKeys,
                coinFamilyKeys,
                access_token,
              })
              .then(res => {
                console.log(res.data);
                this.setState({
                  notificationList: res.data,
                  totalRecords: res.meta.total,
                  loadList: true,
                  isLoading: false,
                });
              })
              .catch(err => {
                this.setState({ isLoading: false });
                Singleton.showAlert(err.message);
              });
          })
          .catch(err => {
            this.setState({ isLoading: false });
            Singleton.showAlert(err.message);
          });
      });
  }

  isCloseToBottom = async ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 60;
    let bottomReached =
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
    if (bottomReached && this.state.loadList) {
      let page = this.state.page + 1;
      this.setState({ page: page, loadList: false }, () => {
        if (this.state.notificationList.length != this.state.totalRecords) {
          this.setState({ isLoading: true });
          let limit = this.state.limit;
          let access_token = Singleton.getInstance().access_token;
          Singleton.getInstance()
            .newGetData(Constants.addresKeyList)
            .then(addresKeyList => {
              Singleton.getInstance()
                .newGetData(Constants.coinFamilyKeys)
                .then(coinFamilyKey => {
                  let addrsListKeys = JSON.parse(addresKeyList);
                  let coinFamilyKeys = coinFamilyKey?.split(',');
                  this.props
                    .getNotificationList({
                      page,
                      limit,
                      addrsListKeys,
                      coinFamilyKeys,
                      access_token,
                    })
                    .then(response => {
                      ////console.log(
                      // 'response notification list view-- on scroll- ',
                      //   response,
                      // );
                      let new_data = response.data;
                      this.setState({ notificationList: this.state.notificationList.concat(new_data), isLoading: false, loadList: true, });
                    })
                    .catch(error => {
                      this.setState({ isLoading: false });
                      Singleton.showAlert(error.message);
                    });
                })
                .catch(err => {
                  this.setState({ isLoading: false });
                  Singleton.showAlert(err.message);
                });
            });
        }
      });
    }
  };
  render() {
    return (
      <>
        <Wrap style={{ backgroundColor: ThemeManager.colors.bg }}>
          {/* <View
            style={{
              height: 50,
              // width: '100%',
              // backgroundColor: 'red',
              // position: 'absolute',
              zIndex: 1000,
            }}> */}
          <SimpleHeader
            title={LanguageManager.Notifications}
            // rightImage={[styles.rightImgStyle]}
            backImage={ThemeManager.ImageIcons.iconBack}
            titleStyle
            imageShow
            containerStyle={{ zIndex: 4 }}
            back={false}
            backPressed={() => {
              console.log("this.props.from::::",this.props.from);
              if(this.props.from=='Pin'){
                Actions.Main({ type: ActionConst.RESET });
                Actions.jump('Wallet');
               }else{
                Actions.pop();
               }
            }}
          />
          {/* </View> */}

          <BorderLine
            borderColor={{ backgroundColor: ThemeManager.colors.viewBorderColor }}
          />

          <View style={{ flex: 1, }}>
            {this.state.notificationList.length > 0 ? (
              <FlatList
                bounces={false}
                data={this.state.notificationList}
                showsVerticalScrollIndicator={false}
                onScroll={({ nativeEvent }) => {
                  this.isCloseToBottom(nativeEvent);
                }}
                ItemSeparatorComponent={()=><BorderLine/>}
                renderItem={({ item, index }) => {
                  return (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => {
                        Actions.currentScene != 'TransactionDetail' &&
                          Actions.TransactionDetail({ TxnData: item });
                      }}>
                      <View style={[styles.tokenItem]}>
                        <View style={styles.viewStyle}>
                          <View
                            style={{
                             width:'12%',
                              justifyContent: 'flex-start',
                              // alignItems: 'flex-end',
                              marginTop: heightDimen(2),

                            }}>
                            {item.type.toUpperCase() == 'DEPOSIT' &&
                              item.state.toUpperCase() != 'FAILED' ? (
                              <View style={[styles.imgViewStyle, { backgroundColor: ThemeManager.colors.swapBg, borderWidth:ThemeManager.colors.themeColor=='dark'?0:0.5,
                              borderColor:ThemeManager.colors.primary, }]}>
                                <Image
                                  style={[styles.imgStyle,
                                    { tintColor: ThemeManager.colors.headingText }
                                  ]}
                                  resizeMode={'contain'}
                                  source={Images.icon_receive}
                                />
                              </View>
                            ) : item.type.toUpperCase() == 'WITHDRAW' &&
                              item.state.toUpperCase() != 'FAILED' ? (
                              <View style={[styles.imgViewStyle, { backgroundColor: ThemeManager.colors.swapBg, borderWidth:ThemeManager.colors.themeColor=='dark'?0:0.5,
                              borderColor:ThemeManager.colors.primary, }]}>
                                <Image
                                  style={[styles.imgStyle,
                                    { tintColor: ThemeManager.colors.headingText }
                                  ]}
                                  resizeMode={'contain'}
                                  source={Images.icon_send}
                                />
                              </View>

                            ) : (
                              <View style={[styles.imgViewStyle, { backgroundColor: ThemeManager.colors.swapBg,  borderWidth:ThemeManager.colors.themeColor=='dark'?0:0.5,
                              borderColor:ThemeManager.colors.primary, }]}>
                                <Image
                                  style={[styles.imgWarningStyle,{ tintColor: ThemeManager.colors.headingText }]}
                                  resizeMode={'contain'}
                                  source={Images.warning}
                                />
                              </View>
                              // <Image
                              //   style={styles.imgStyle}
                              //   resizeMode={'contain'}
                              //   source={Images.warning}
                              // />
                            )}
                          </View>
                          <View
                            style={{
                              width: '88%',
                              alignContent: 'center',
                              justifyContent: 'center',

                            }}>
                            <Text
                              style={[
                                styles.FlatlistCellText,
                                { color: ThemeManager.colors.textColor },
                              ]}>
                              {item.message}
                            </Text>

                            <View style={[styles.dateViewStyle, ]}>
                              <Text style={[styles.FlatlistCellTextt, { color: ThemeManager.colors.textColor , width: widthDimen(132),backgroundColor:ThemeManager.colors.themeColor=='dark'? ThemeManager.colors.mnemonicsView:'#EFEFEF' }]}>
                                {moment(item.created_at).format(
                                  // 'DD MMM, YYYY | hh:mm a',
                                  'hh:mma, DD/MM/YYYY',
                                )}
                              </Text>
                            </View>

                          </View>
                        </View>
                      </View>

                    </TouchableOpacity>
                  );
                }}
                keyExtractor={item => item.id}
              />
            ) : (
              <View style={styles.mainView}>
                <Text
                  style={[
                    styles.textStyle,
                    { color: ThemeManager.colors.textColor },
                  ]}>
                  {LanguageManager.NoNoti}
                </Text>
              </View>
            )}
          </View>
          {this.state.isLoading == true && <Loader />}
        </Wrap>
        <SafeAreaView style={{ backgroundColor: ThemeManager.colors.bg }} />
      </>
    );
  }
}
const mapStateToProp = state => {
  return {};
};
export default connect(mapStateToProp, { getNotificationList })(Notification);
