import { View, Text, TouchableOpacity ,ScrollView} from 'react-native';
import React, { useState, useEffect, createRef } from 'react';
import { BorderLine, Wrap } from '../../common';
import { SimpleHeader } from '../../common/SimpleHeader';
import { Actions } from 'react-native-router-flux';
import { styles } from './ExportPrivateKeysStyle';
import Singleton from '../../../Singleton';
import Toast, { DURATION } from 'react-native-easy-toast';
import * as Constants from '../../../Constant';
import Clipboard from '@react-native-community/clipboard';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import { BackHandler } from 'react-native';
import { heightDimen } from '../../../Utils/themeUtils';


const ExportPrivateKeys = props => {
  const [ethPvtKey, setEthPvtKey] = useState('');
  const [btcPvtKey, setBtcPvtKey] = useState('');
  const [addressObj, setAddressObj] = useState([{}]);
  const toastRef = createRef();

  useEffect(() => {
    let backHandle = null;
    backHandle = BackHandler.addEventListener('hardwareBackPress', backAction);
    let focus = props.navigation.addListener('didFocus', () => {
      // if (Platform.OS == "android")
      // RNPreventScreenshot?.enabled(true)
      //  console.warn('MM','did Focus called recovery phrase::::::');
      backHandle = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );
    });
    let blur = props.navigation.addListener('didBlur', () => {
      //  console.warn('MM','did Blur called recovery phrase::::::');
      backHandle?.remove();
    });
    return () => {
      if (focus) {
        focus?.remove()
      }
      if (blur) {
        blur?.remove()
      }
      if (backHandle) {
        backHandle?.remove()
      }
    }
  }, [props]);

  const backAction = () => {
    //Actions.jump('BackupOptions');
    props.screenType == 'Editwallet'
      ? Actions.jump('EditWallet')
      : Actions.jump('BackupOptions');
    return true;
  };


  useEffect(() => {
    //  console.warn('MM','chk item:::::::::', JSON.stringify(props.walletItem));
    if (props.walletItem == undefined) {
      Singleton.getInstance().newGetData(`${Singleton.getInstance().defaultEthAddress}_pk`).then(ethPvtKey => {
        // console.warn('MM','ethPvtKey--------', ethPvtKey);
        setEthPvtKey(ethPvtKey);
      });
    } else {
      let address = props.walletItem.loginRequest.address;
      let blockChain = props?.walletItem?.blockChain;
      switch (blockChain) {
        case 'all':
          Singleton.getInstance().newGetData(`${props?.walletItem?.loginRequest?.btcAddress}_pk`).then(btcPvtKey => {
            // console.warn('MM','ethPvtKey--------', ethPvtKey);
            setBtcPvtKey(btcPvtKey);
            Singleton.getInstance().newGetData(`${address}_pk`).then(ethPvtKey => {
              // console.warn('MM','ethPvtKey--------', ethPvtKey);
              Singleton.getInstance().newGetData(`${props?.walletItem?.loginRequest?.trxAddress}_pk`).then(trxPvtKey => {
                setEthPvtKey(ethPvtKey);
                setAddressObj([
                  {
                    coin_symbol: 'ETH',
                    key: ethPvtKey,
                  },
                  {
                    coin_symbol: 'BNB',
                    key: ethPvtKey,
                  },
                  {
                    coin_symbol: 'MATIC',
                    key: ethPvtKey,
                  },
                  {
                    coin_symbol: 'BTC',
                    key: btcPvtKey,
                  },
                  {
                    coin_symbol: 'TRX',
                    key: trxPvtKey,
                  },
                  {
                    coin_symbol: 'STC',
                    key: ethPvtKey,
                  },
                ]);
              })

            })
              .catch(err => {
                //  console.warn('MM','err add', err);
              });
          })
            .catch(err => {
              //  console.warn('MM','err add', err);
            });

          break;

        case 'eth':
          Singleton.getInstance().newGetData(`${address}_pk`).then(ethPvtKey => {
            setEthPvtKey(ethPvtKey);
            setAddressObj([
              {
                coin_symbol: 'ETH',
                key: ethPvtKey,
              },
            ]);
          }).catch(err => {
            //  console.warn('MM','err add', err);
          });
          break;
          case 'stc':
            Singleton.getInstance().newGetData(`${address}_pk`).then(ethPvtKey => {
              setEthPvtKey(ethPvtKey);
              setAddressObj([
                {
                  coin_symbol: 'STC',
                  key: ethPvtKey,
                },
              ]);
            }).catch(err => {
              //  console.warn('MM','err add', err);
            });
            break;
        case 'bnb':
          Singleton.getInstance().newGetData(`${address}_pk`).then(ethPvtKey => {
            // console.warn('MM','ethPvtKey--------', ethPvtKey);
            setEthPvtKey(ethPvtKey);
            setAddressObj([
              {
                coin_symbol: 'BNB',
                key: ethPvtKey,
              },
            ]);
          })
            .catch(err => {
              //  console.warn('MM','err add', err);
            })



          break;
        case 'matic':
          Singleton.getInstance().newGetData(`${address}_pk`).then(ethPvtKey => {
            // console.warn('MM','ethPvtKey--------', ethPvtKey);
            setEthPvtKey(ethPvtKey);
            setAddressObj([
              {
                coin_symbol: 'MATIC',
                key: ethPvtKey,
              },
            ]);
          }).catch(err => {
            //  console.warn('MM','err add', err);
          });
          break;

        case 'btc':
          Singleton.getInstance().newGetData(`${props?.walletItem?.loginRequest?.btcAddress}_pk`).then(btcPvtKey => {
            setBtcPvtKey(btcPvtKey);
            setAddressObj([
              {
                coin_symbol: 'BTC',
                key: btcPvtKey,
              },
            ]);
          })
            .catch(err => {
              //  console.warn('MM','err add', err);
            });
          break;

        case 'trx':
          Singleton.getInstance().newGetData(`${props?.walletItem?.loginRequest?.trxAddress}_pk`).then(btcPvtKey => {

            setBtcPvtKey(btcPvtKey);
            setAddressObj([
              {
                coin_symbol: 'TRX',
                key: btcPvtKey,
              },
            ]);
          })
            .catch(err => {
              //  console.warn('MM','err add', err);
            });
          break;
        default:
          break;
      }

      // let address = props.walletItem.loginRequest.address;
      // Singleton.getInstance()
      //   .getData(`${address}_pk`)
      //   .then(ethPvtKey => {
      //     // console.warn('MM','ethPvtKey--------', ethPvtKey);
      //     setEthPvtKey(ethPvtKey);
      //   })
      //   .catch(err => {
      //  //  console.warn('MM','err add', err);
      //   });
    }
  }, []);

  return (
    <Wrap style={{ backgroundColor: ThemeManager.colors.bg }}>
      <SimpleHeader
        title={LanguageManager.exportPrivateKeys}
        // rightImage={[styles.rightImgStyle]}
        backImage={ThemeManager.ImageIcons.iconBack}
        titleStyle
        imageShow
        back={false}
        backPressed={() => {
          // props.navigation.state.params.onGoBack();
          props.screenType == 'Editwallet'
            ? Actions.jump('EditWallet')
            : Actions.jump('BackupOptions');
          // props.navigation.goBack();
        }}
      />

      <BorderLine
        borderColor={{ backgroundColor: ThemeManager.colors.viewBorderColor }}
      />

      <ScrollView style={styles.mainContainer}>
        {addressObj.map((item,index) => {
          return (
            <View
              style={[
                styles.blockChainWrap,
                { backgroundColor: ThemeManager.colors.mnemonicsView ,
                  shadowColor:ThemeManager.colors.shadowColor,
                  shadowOffset: {
                    width: 0,
                    height: 3,
                  },
                  shadowOpacity: 0.1,
                  shadowRadius: 3.05,
                  elevation: 4,
                  marginBottom:index==addressObj?.length-1? heightDimen(40):0
                },
              ]}>
              <Text
                style={[
                  styles.headingStyle,
                  { color: ThemeManager.colors.textColor },
                ]}>
                {item?.coin_symbol}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  Clipboard.setString(item?.key);
                  toastRef.current.show(Constants.COPIED);
                }}>
                <Text style={styles.textStyle}>{item?.key}</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>

      <Toast ref={toastRef} />
    </Wrap>
  );
};

export default ExportPrivateKeys;