/* eslint-disable handle-callback-err */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  FlatList,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { SwipeListView } from 'react-native-swipe-list-view';
import { connect, useDispatch, useSelector } from 'react-redux';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import { APP_NAME } from '../../../Constant';
import { CryptoColors } from '../../../CryptoColors';
import { BASE_IMAGE } from '../../../Endpoints';
import { NavigationStrings } from '../../../Navigation/NavigationStrings';
import { walletFormUpdate } from '../../../Redux/Actions';
import {
  deleteWalletContact,
  getWalletContactList,
  getWalletContactRecentList,
} from '../../../Redux/Actions/ContactsAction';
import Singleton from '../../../Singleton';
import { areaDimen, heightDimen, widthDimen } from '../../../Utils/themeUtils';
import { getCurrentRouteName, goBack, navigate } from '../../../navigationsService';
import { Colors, Fonts } from '../../../theme';
import images from '../../../theme/Images';
import { BasicButton, BorderLine, Wrap } from '../../common';
import { SimpleHeader } from '../../common/SimpleHeader';
import Loader from '../Loader/Loader';
import { styles } from './SendCryptoContactsStyle';
import * as Constants from '../../../Constant';
const rowSwipeAnimatedValues = {};
Array(500)
  .fill('')
  .forEach((_, i) => {
    rowSwipeAnimatedValues[`${i}`] = new Animated.Value(0);
  });
const RECENTTRANSACTIONTO = [];
const NAMELIST = [];
const SendCryptoContacts = props => {
  const dispatch = useDispatch();
  const openRowRef = useRef(null);
  const [recentContactList, setRecentContactList] =
    useState(RECENTTRANSACTIONTO);
  const [contactList, setContactList] = useState(NAMELIST);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [noOfContacts, setNoOfContacts] = useState(null);
  const walletData = useSelector(state => state?.walletReducer);

  useEffect(() => {
    //  getScreenData();
    let focus = props.navigation.addListener('focus', () => {
      getScreenData();
    });
    return () => {
      focus();
    };
  }, []);

  const getRecent = () => {
    setIsLoading(true);
    let coin_family = props?.route?.params?.item.coin_family;
    let access_token = Singleton.getInstance().access_token;
    props
      .getWalletContactRecentList({coin_family, access_token})
      .then(res => {
        //console.warn('MM','chk recent txn res::::', res);
        setIsLoading(false);
        let newArrayWithColor = [];
        var ColorCode = '';
        for (let i = 0; i < res.length; i++) {
          const element = res[i];
          if (res.length <= CryptoColors.length) {
            ColorCode = CryptoColors[i];
            element.color = ColorCode;
          } else {
            let index = i % CryptoColors.length;
            ColorCode = CryptoColors[index];
            element.color = ColorCode;
          }
          newArrayWithColor.push(element);
        }
        //console.warn('MM','recent: ', newArrayWithColor);
        setRecentContactList(newArrayWithColor);
      })
      .catch(err => {
        setIsLoading(false);
        // Singleton.showAlert(err.message);
      });
  };
  const getContactList = () => {
    setIsLoading(true);
    let access_token = Singleton.getInstance().access_token;
    let network =
      props?.route?.params?.item.coin_family == 1
        ? Constants.NETWORK.ETHEREUM
        : props?.route?.params?.item.coin_family == 6
        ? Constants.NETWORK.BINANCE
        : props?.route?.params?.item.coin_family == 11
        ? Constants.NETWORK.POLYGON
        : props?.route?.params?.item.coin_family == 3
        ? Constants.NETWORK.TRON
        : props?.route?.params?.item.coin_family == 4
        ? Constants.NETWORK.SAITACHAIN
        : Constants.NETWORK.BITCOIN;

    props
      .getWalletContactList({network, access_token})
      .then(res => {
        // console.log('________' , res);
        setIsLoading(false);
        let newArrayWithColor = [];
        var ColorCode = '';
        for (let i = 0; i < res.length; i++) {
          const element = res[i];
          if (res.length <= CryptoColors.length) {
            ColorCode = CryptoColors[i];
            element.color = ColorCode;
          } else {
            let index = i % CryptoColors.length;
            ColorCode = CryptoColors[index];
            element.color = ColorCode;
          }
          newArrayWithColor.push(element);
        }
        // console.warn('MM','contacts: ', newArrayWithColor.length);
        setNoOfContacts(newArrayWithColor.length);
        setContactList(newArrayWithColor);
      })
      .catch(err => {
        Singleton.showAlert(err.message);
        setIsLoading(false);
      });
  };
  const getScreenData = () => {
    getContactList();
    getRecent();
  };
  const deleteContact = id => {
    //console.warn('MM','id', id);
    setIsLoading(true);
    let access_token = Singleton.getInstance().access_token;
    props
      .deleteWalletContact({id, access_token})
      .then(res => {
        setIsLoading(false);
        Alert.alert(
          APP_NAME,
          LanguageManager.contactDeletedSuccessfully,
          [
            {
              text: LanguageManager.ok,
              onPress: () => {
                getContactList();
                getRecent();
                // Actions.Dashboard();
              },
            },
          ],
          {cancelable: false},
        );
      })
      .catch(err => {
        setIsLoading(false);
        Alert.alert(
          APP_NAME,
          LanguageManager.errorWhileDeletingContact,
          [
            {
              text: LanguageManager.ok,
              onPress: () => {
                getCurrentRouteName() != 'Dashboard' && navigate(NavigationStrings.Dashboard);
              },
            },
          ],
          {cancelable: false},
        );
      });
  };
  const deleteAlert = id => {
    Alert.alert(
      APP_NAME,
      LanguageManager.areYouSure,
      [
        {
          text: LanguageManager.yes,
          onPress: () => {
            deleteContact(id);
          },
        },
        {
          text: LanguageManager.cancel,
          onPress: () => {
            setTimeout(() => {
              openRowRef.current.manuallyOpenAllRows(0);
            }, 250);
            //console.warn('MM','Close');
          },
        },
      ],
      {cancelable: true},
    );
  };
  return (
    <Wrap style={{backgroundColor: ThemeManager.colors.bg}}>
      {/* <SimpleHeader
        title={LanguageManager.sendCrypto}
        onpress={() =>
          Actions.AddNewContacts({coinFamily: props?.route?.params?.item.coin_family})
        }
        hamOnpress={() => alert('jj')}
        plusIcon={noOfContacts > 4 ? true : false}
      /> */}
      <SimpleHeader
        title={LanguageManager.sendCrypto}
        // rightImage={[styles.rightImgStyle]}
        backImage={ThemeManager.ImageIcons.iconBack}
        titleStyle
        imageShow
        back={false}
        backPressed={() => {
          // props.navigation.state.params.onGoBack();
          props.navigation.goBack();
        }}
        plusIcon={false} //{noOfContacts > 4 ? true : false}
        plusIconStyle={{
          tintColor: ThemeManager.colors.textColor,
          height: widthDimen(18),
          width: widthDimen(18),
          resizeMode: 'contain',
        }}
        onPressHistory={() => {
          getCurrentRouteName() != 'AddNewContacts' &&
          navigate(NavigationStrings.AddNewContacts,{coinFamily: props?.route?.params?.item.coin_family});
        }}
      />
      <BorderLine
        borderColor={{backgroundColor: ThemeManager.colors.viewBorderColor}}
      />
      <View style={[styles.roundView]}>
        {/* {noOfContacts < 5 && (
          <View
            style={[
              styles.recipientView,
              {
                borderRadius: 14,
                backgroundColor: ThemeManager.colors.inputBorderColor,
              },
            ]}>
            <View style={styles.recipienttxtView}>
              <Text style={styles.recipienttxt}>
                {LanguageManager.selectCryptoContact}
              </Text>
            </View>
            <BasicButton
              onPress={() =>
                getCurrentRouteName() != 'AddNewContacts' &&
                Actions.AddNewContacts({ coinFamily: props?.route?.params?.item.coin_family })
              }
              btnStyle={styles.btnStyle}
              customGradient={styles.customGrad}
              text={LanguageManager.addNew}
            />
          </View>
        )} */}
        <View style={[{marginVertical: heightDimen(20)}]}>
          <FlatList
            data={recentContactList}
            bounces={false}
            showsHorizontalScrollIndicator={false}
            horizontal
            keyExtractor={item => item.id}
            contentContainerStyle={{margin: areaDimen(5),paddingBottom:heightDimen(8)}}
            ListHeaderComponent={<View style={{width: widthDimen(10)}} />}
            renderItem={({item}) => (
              <TouchableOpacity
                // disabled={true}
                onPress={() => {
                  //console.warn('MM','chk data:::::', data);
                  props?.route?.params?.getAddress(item?.address);
                  goBack();
                }}
                style={[
                  styles.flatlistViewHorizontal,
                  {
                    backgroundColor: ThemeManager.colors.bg,
                  },
                ]}>
                <View
                  style={[
                    styles.namewrap,
                    {
                      backgroundColor: item.color,
                      position: 'absolute',
                      zIndex: 2,
                      top: heightDimen(0),
                      borderWidth: widthDimen(5.5),
                      borderColor: ThemeManager.colors.bg,
                    },
                  ]}>
                  <Text
                    style={{
                      fontFamily: Fonts.medium,
                      fontSize: areaDimen(16),
                      color: Colors.white,
                    }}>
                    {item.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: ThemeManager.colors.mnemonicsView,
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    height: heightDimen(84),
                    width: widthDimen(110),
                    paddingVertical: heightDimen(14),
                    paddingHorizontal: widthDimen(14),
                    borderRadius: widthDimen(15),
                    shadowColor: ThemeManager.colors.shadowColor,
                    // shadowColor:'#0000000A',
                    shadowOffset: {
                      width: 0,
                      height: 3,
                    },
                    shadowOpacity: 0.1,
                    shadowRadius: 3.05,
                    elevation: 4,
                    // marginTop: heightDimen(-20)
                  }}>
                  <Text
                    style={{
                      color: ThemeManager.colors.textColor,
                      fontSize: areaDimen(15),
                      fontFamily: Fonts.medium,
                    }}
                    numberOfLines={1}>
                    @{item.name}
                  </Text>
                  <Text
                    style={{
                      color: ThemeManager.colors.lightTextColor,
                      fontSize: areaDimen(13),
                      fontFamily: Fonts.medium,
                      marginTop: widthDimen(4),
                    }}
                    numberOfLines={1}>
                    {item.address.substring(0, 15) + '...'}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
        <View style={styles.horizontallistView}>
          <Text
            style={[
              styles.contactsTextStyle,
              {color: ThemeManager.colors.textColor},
            ]}>
            {LanguageManager.contacts}
          </Text>

          <View style={{marginTop: heightDimen(12), flex: 1}}>
            <SwipeListView
              ref={openRowRef}
              data={contactList}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{paddingHorizontal: widthDimen(5)}}
              renderItem={(data, rowMap) => (
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    //console.warn('MM','chk data:::::', data);
                    props?.route?.params?.getAddress(data?.item?.address);
                    goBack();
                  }}
                  style={{
                    flexDirection: 'row',
                    paddingHorizontal: widthDimen(14),
                    alignItems: 'center',
                    paddingVertical: widthDimen(14),
                    // borderColor: ThemeManager.colors.chooseBorder,
                    // borderWidth: 1,
                    // borderTopWidth: 1,
                    // borderBottomWidth: 1,
                    borderRadius: widthDimen(12),
                    marginVertical: heightDimen(5),
                    backgroundColor: ThemeManager.colors.mnemonicsView,
                    shadowColor: ThemeManager.colors.shadowColor,
                    // shadowColor:'#0000000A',
                    shadowOffset: {
                      width: 0,
                      height: 3,
                    },
                    shadowOpacity: 0.1,
                    shadowRadius: 3.05,
                    elevation: 4,
                  }}>
                  <View
                    style={[
                      styles.nameContactswrap,
                      {
                        alignSelf: 'center',
                        marginRight: widthDimen(6),
                        backgroundColor: data.item.color,
                      },
                    ]}>
                    <Text
                      style={{
                        textAlign: 'center',
                        color: Colors.white,
                        // color: ThemeManager.colors.textColor,
                        fontSize: areaDimen(16),
                        fontFamily: Fonts.semibold,
                      }}>
                      {data.item.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={{flex: 0.8, marginLeft: 5}}>
                    <Text
                      style={{
                        color: ThemeManager.colors.textColor,
                        fontSize: areaDimen(16),
                        fontFamily: Fonts.medium,
                      }}>
                      {data.item.name}
                    </Text>
                    <Text
                      style={{
                        color: ThemeManager.colors.inActiveColor,
                        fontSize: areaDimen(14),
                        fontFamily: Fonts.medium,
                        marginTop: heightDimen(4),
                      }}>
                      {data.item.address}
                    </Text>
                  </View>

                  <View
                    style={{
                      flex: 0.2,
                      paddingVertical: 1,
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                      height: '100%',
                    }}>
                    <View>
                      <FastImage
                        source={{
                          uri: props?.route?.params?.item?.coin_image.includes('https')
                            ? props?.route?.params?.item?.coin_image
                            : BASE_IMAGE + props?.route?.params?.item?.coin_image,
                        }}
                        resizeMode={'contain'}
                        style={{
                          height: widthDimen(18),
                          borderRadius: widthDimen(10),
                          width: widthDimen(18),
                          resizeMode: 'contain',
                        }}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              renderHiddenItem={(item, index) => (
                <View style={[styles.rowBack]}>
                  <TouchableOpacity
                    onPress={() => {
                      getCurrentRouteName() != 'EditContact' &&
                      navigate(NavigationStrings.EditContact,{contactItem: item});
                      setTimeout(() => {
                        openRowRef.current.manuallyOpenAllRows(0);
                      }, 250);
                    }}>
                    <Animated.View style={{transform: [{scale: 1}]}}>
                      <View
                        style={{
                          backgroundColor: Colors.balanceBoxColor1,
                          width: widthDimen(70),
                          height: '80%',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <FastImage
                          style={{
                            width: widthDimen(20),
                            height: widthDimen(20),
                          }}
                          tintColor={Colors.black}
                          resizeMode={FastImage.resizeMode.contain}
                          source={images.edit}
                        />
                        {/* <Text style={{ color: Colors.white }}>Edit</Text> */}
                      </View>
                    </Animated.View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      deleteAlert(item.item.id);
                    }}
                    style={{marginHorizontal: widthDimen(5)}}>
                    <Animated.View style={{transform: [{scale: 1}]}}>
                      <View
                        style={{
                          backgroundColor: Colors.balanceBoxColor2,
                          width: widthDimen(70),
                          height: '80%',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <FastImage
                          style={{
                            width: widthDimen(20),
                            height: widthDimen(20),
                          }}
                          tintColor={Colors.black}
                          resizeMode={FastImage.resizeMode.contain}
                          source={images.bin}
                        />
                        {/* <Text style={{ color: Colors.white }}>Delete</Text> */}
                      </View>
                    </Animated.View>
                  </TouchableOpacity>
                </View>
              )}
              rightOpenValue={widthDimen(-140)}
              previewRowKey={'0'}
              previewOpenValue={-40}
              previewOpenDelay={3000}
              swipeGestureBegan={key => {
                setSelectedIndex(key);
              }}
              swipeGestureEnded={(key, endedData) => {
                setSelectedIndex(endedData.direction == 'left' ? key : null);
              }}
              ListEmptyComponent={() => {
                return (
                  <View
                    style={{width: '100%', alignItems: 'center', padding: 15}}>
                    <Text
                      style={{
                        fontFamily: Fonts.regular,
                        color: ThemeManager.colors.lightTextColor,
                      }}>
                      No Contacts
                    </Text>
                  </View>
                );
              }}
            />
          </View>

          <View>
            <BasicButton
              onPress={() =>
                getCurrentRouteName() != 'AddNewContacts' &&
                navigate(NavigationStrings.AddNewContacts,{
                  coinFamily: props?.route?.params?.item.coin_family,
                  isPop: true,
                })
              }
              btnStyle={styles.btnStyle}
              customGradient={styles.customGrad}
              text={LanguageManager.addNew}
            />
          </View>
        </View>
      </View>
      {isLoading && <Loader />}
    </Wrap>
  );
};
const mapStateToProp = state => {
  const {selectedAddress} = state.createWalletReducer;
  return {selectedAddress};
};
export default connect(mapStateToProp, {
  getWalletContactList,
  getWalletContactRecentList,
  deleteWalletContact,
  walletFormUpdate,
})(SendCryptoContacts);
