/* eslint-disable react-native/no-inline-styles */
/* eslint-disable eqeqeq */
/* eslint-disable react/self-closing-comp */
// import React, {useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ImageBackground,
//   Image,
//   TouchableOpacity,
//   TextInput,
//   ScrollView,
//   Dimensions,
// } from 'react-native';
// import {Wrap} from '../../common/Wrap';
// import {ImageBackgroundComponent, SimpleHeader, SubHeader} from '../../common';
// import {Actions} from 'react-native-router-flux';
// import colors from '../../../theme/Colors';
// import LinearGradient from 'react-native-linear-gradient';
// import {DotPagination} from '../../common/DotPagination';
// import {ButtonPrimary} from '../../common/ButtonPrimary';
// import {FlatList} from 'react-native-gesture-handler';
// import {styles} from '../CreateNewWallet/CreateNewWalletStyle';
// import {walletFormUpdate} from '../../../Redux/Actions';
// import {connect, useSelector, useDispatch} from 'react-redux';
// import Singleton from '../../../Singleton';
// import * as Constants from '../../../Constant';
// import Loader from '../Loader/Loader';
// import {getColorList} from '../../../Redux/Actions';
// import {LanguageManager, ThemeManager} from '../../../../ThemeManager';
// import images from '../../../theme/Images';
// import HeaderwithBackIcon from '../../common/HeaderWithBackIcon';
// import {SettingBar} from '../../common/SettingBar';
// import fonts from '../../../theme/Fonts';
// const windowHeight = Dimensions.get('window').height;
// const WalletOption = props => {
//   const dispatch = useDispatch();
//   const [btn, setBtn] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [color_list, setcolor_list] = useState([]);
//   const walletName = useSelector(
//     state => state?.createWalletReducer?.walletName,
//   );
//   const [walletNameText, setWalletNameText] = useState('');

//   const letsStart = async () => {
//     Singleton.getInstance().saveData(Constants.USER_NAME, walletName);
//     ////console.log(
//       'usename00-----',
//       Singleton.getInstance().saveData(Constants.USER_NAME, walletName),
//     );
//     if (props.isFrom != 'multiWallet') {
//       Singleton.getInstance().saveData(
//         Constants.GRADIENT_COLOR,
//         JSON.stringify(
//           btn ? btn : ['#DA539C', '#A73CBE', '#882DD4', '#7C28DD'],
//         ),
//       );
//     }
//     if (walletName.trim().length == 0) {
//       Singleton.showAlert(Constants.VALID_WALLET_NAME);
//       return;
//     }
//     if (walletName.trim().length < 3) {
//       Singleton.showAlert(Constants.VALID_NAME);
//       return;
//     }
//     setLoading(true);
//     setTimeout(() => {
//       Singleton.getInstance()
//         .createWallet()
//         .then(res => {
//           //console.warn('MM','create wallet res--------', res);
//           dispatch(walletFormUpdate({prop: 'walletData', value: res}));
//           if (props.isFrom == 'multiWallet') {
//             Actions.replace('SecureWallet', {isFrom: props.isFrom});
//           } else {
//             Actions.SecureWallet();
//           }

//           setLoading(false);
//         });
//     }, 300);
//   };

//   const walletNameInputChanged = text => {
//     const walletNameRegex = new RegExp(/^\S*$/);
//     if (walletNameRegex.test(text)) {
//       if (text.length > 15) {
//         Singleton.showAlert('Wallet name has maximum length of 15 Character.');
//       } else {
//         dispatch(walletFormUpdate({prop: 'walletName', value: text}));
//       }
//     } else {
//       Singleton.showAlert('Space not allowed in wallet name');
//     }
//   };

//   useEffect(() => {
//     // Singleton.getInstance().saveData(
//     //   Constants.GRADIENT_COLOR,
//     //   JSON.stringify(btn),
//     // );
//     props.navigation.addListener('didFocus', () => {
//       dispatch(walletFormUpdate({prop: 'walletName', value: ''}));
//     });
//     colorList();
//   }, []);

//   const colorList = () => {
//     let access_token = Singleton.getInstance().access_token;
//     setLoading(true),
//       setTimeout(() => {
//         dispatch(getColorList({access_token}))
//           .then(async response => {
//             Singleton.getInstance().getData(Constants.GRADIENT_COLOR);
//             setcolor_list(response);
//             setLoading(false);
//           })
//           .catch(error => {
//             //console.warn('MM','error=getColorList====', error);
//             setLoading(false);
//           });
//       }, 500);
//   };
//   return (
//     <Wrap style={{backgroundColor: ThemeManager.colors.backgroundColor}}>
//       {/* <ImageBackgroundComponent style={{height: windowHeight}}> */}
//       <SimpleHeader
//         title={LanguageManager.wallets}
//         // rightImage={[styles.rightImgStyle]}
//         backImage={ThemeManager.ImageIcons.iconBack}
//         titleStyle
//         imageShow
//         back={false}
//         backPressed={() => {
//           // props.navigation.state.params.onGoBack();
//           props.navigation.goBack();
//         }}
//       />
//       <View
//         style={{
//           backgroundColor: ThemeManager.colors.chooseBorder,
//           height: 1,
//           width: '100%',
//         }}
//       />
//       <ScrollView keyboardShouldPersistTaps="handled" bounces={false}>
//         <View style={styles.mainView}>
//           {/* <SubHeader
//           title={LanguageManager.name}
//           Subtitle={LanguageManager.Wallet}
//           headerstyle={{ marginTop: 100 }}
//         /> */}
//           {/*
//             <HeaderwithBackIcon iconLeft={ThemeManager.ImageIcons.iconBack} /> */}

//           <Text
//             style={[
//               styles.txtNameWallet,
//               {color: ThemeManager.colors.textColor},
//             ]}>
//             {LanguageManager.nameYourWallet}
//           </Text>

//           <View
//             style={[
//               styles.textInputView,
//               {borderColor: ThemeManager.colors.inputBorderColor},
//             ]}>
//             <TextInput
//               style={[styles.textInput, {color: ThemeManager.colors.textColor}]}
//               placeholder={LanguageManager.NameWallet}
//               placeholderTextColor={ThemeManager.colors.placeholderTextColor}
//               value={walletName}
//               onChangeText={text => {
//                 if (Constants.NAME_REGEX.test(text)) {
//                   walletNameInputChanged(text);
//                 } else {
//                   Singleton.showAlert(
//                     'Please enter valid name. Only Alphabets are allowed',
//                   );
//                 }
//               }}
//             />
//           </View>

//           <View
//             style={{
//               height: props.isFrom != 'multiWallet' ? 120 : 50,
//             }}>
//             {props.isFrom != 'multiWallet' && (
//               <View style={{marginHorizontal: 25}}>
//                 <Text
//                   style={[
//                     styles.textColor,
//                     {color: ThemeManager.colors.textColor},
//                   ]}>
//                   {LanguageManager.selectColor}
//                 </Text>
//                 <FlatList
//                   showsHorizontalScrollIndicator={false}
//                   data={color_list}
//                   horizontal={true}
//                   keyExtractor={(item, index) => item + index}
//                   renderItem={({item, index}) => (
//                     <View style={{}}>
//                       <TouchableOpacity
//                         onPress={() => {
//                           setBtn(JSON.parse(item.color));
//                           Singleton.getInstance().dynamicColor = JSON.parse(
//                             item.color,
//                           );
//                           ////console.log(
//                             'color list=-=-=-=>>',
//                             JSON.parse(item.color),
//                           );
//                           //console.warn('MM','check custom color:=-=', color_list);
//                         }}
//                         style={{alignSelf: 'center'}}>
//                         <LinearGradient
//                           colors={JSON.parse(item.color)}
//                           style={styles.gradientColorview}
//                           start={{x: 0, y: 1}}
//                           end={{x: 0, y: 0}}
//                         />
//                       </TouchableOpacity>
//                     </View>
//                   )}
//                 />
//               </View>
//             )}
//           </View>
//           <Text
//             style={[
//               styles.txtNameWallet,
//               {color: ThemeManager.colors.textColor},
//             ]}>
//             {LanguageManager.backUpOptions}
//           </Text>
//           <View
//             style={{
//               backgroundColor: ThemeManager.colors.backupView,
//               marginHorizontal: 20,
//               marginTop: 10,
//               borderRadius: 14,
//             }}>
//             <SettingBar
//               // disabled={onPressActive}
//               // iconImage={ThemeManager.ImageIcons.historyIcon}
//               title={LanguageManager.showRecoveryPhrase}
//               titleStyle={{
//                 color: ThemeManager.colors.textColor,
//                 fontSize: 14,
//                 fontFamily: fonts.regular,
//               }}
//               onPress={() => {}}
//               style={{borderBottomWidth: 0, marginVertical: 10}}
//               imgStyle={[styles.img]}
//               arrowIcon={ThemeManager.ImageIcons.forwardArrowIcon}
//             />
//             <View
//               style={{
//                 height: 2,
//                 backgroundColor: ThemeManager.colors.backupBorder,
//                 width: '100%',
//               }}
//             />
//             <SettingBar
//               // disabled={onPressActive}
//               // iconImage={ThemeManager.ImageIcons.historyIcon}
//               title={LanguageManager.exportPublicKeys}
//               titleStyle={{
//                 color: ThemeManager.colors.textColor,
//                 fontSize: 14,
//                 fontFamily: fonts.regular,
//               }}
//               onPress={() => {}}
//               style={{borderBottomWidth: 0, marginVertical: 10}}
//               imgStyle={[styles.img]}
//               arrowIcon={ThemeManager.ImageIcons.forwardArrowIcon}
//             />
//           </View>

//           {/* <View style={{}}>
//             <TouchableOpacity
//               onPress={() => Actions.pop()}
//               style={styles.btnView2}>
//               <Text style={{color: colors.white}}>{LanguageManager.Back}</Text>
//             </TouchableOpacity>
//             <DotPagination style={{marginTop: 20}} activeDotNumber={2} />
//           </View> */}
//         </View>
//       </ScrollView>

//       <ButtonPrimary
//         btnstyle={styles.btnView}
//         onpress={() => letsStart()}
//         // colors={Singleton.getInstance().dynamicColor}
//         text={LanguageManager.proceed}
//       />

//       {loading && <Loader />}
//       {/* </ImageBackgroundComponent> */}
//     </Wrap>
//   );
// };
// const mapStateToProp = state => {
//   return {};
// };
// // export default connect(mapStateToProp, {getColorList})(WalletOption);
// export {WalletOption};

import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { SubHeader, Wrap, DotPagination } from '../../common';
import { Actions } from 'react-native-router-flux';
import { colors, Images } from '../../../theme';
import { styles } from '../CreateWallet/CreateWalletStyle';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
const WalletOption = () => {
  return (
    <Wrap style={{ backgroundColor: ThemeManager.colors.backgroundColor }}>
      <View style={styles.mainView}>
        <SubHeader
          title={LanguageManager.title1}
          Subtitle={LanguageManager.Wallet}
          headerstyle={{ marginTop: 40 }}
        />

        <View style={styles.imgView}>
          <View>
            <TouchableOpacity
              onPress={() =>
                // Actions.ImportWallet({isFrom: 'multiWallet'})
                Actions.currentScene != 'MultiWalletOptions' &&
                Actions.MultiWalletOptions({ isFrom: 'multiWallet' })
              }>
              <Image source={Images.Add} style={styles.Img} />
            </TouchableOpacity>
            <Text style={styles.imgText}>{LanguageManager.ImportWallet}</Text>
          </View>

          <View>
            <TouchableOpacity
              onPress={() =>
                Actions.currentScene != 'CreateNewWallet' &&
                Actions.CreateNewWallet({ isFrom: 'multiWallet' })
              }>
              <Image source={Images.Add} style={styles.Img} />
            </TouchableOpacity>
            <Text style={styles.imgText}>{LanguageManager.CreateWallet}</Text>
          </View>
        </View>

        <View style={{ paddingTop: 45 }}>
          <Text style={styles.imgText}>{LanguageManager.needHelp}</Text>
        </View>

        <View style={styles.textView}>
          <Text style={styles.text}>{LanguageManager.walletText}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => Actions.pop()} style={styles.back}>
        <Text style={styles.heading}>{LanguageManager.Back}</Text>
      </TouchableOpacity>
      <DotPagination activeDotNumber={1} />
    </Wrap>
  );
};
export { WalletOption };
