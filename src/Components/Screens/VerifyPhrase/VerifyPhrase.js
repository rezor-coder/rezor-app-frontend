/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import {MainStatusBar, Wrap, BasicButton} from '../../common/index';
import {TouchableOpacity} from 'react-native-gesture-handler';
import styles from './VerifyPhraseStyle';
import {connect} from 'react-redux';
import {useSelector} from 'react-redux';
import {walletFormUpdate, createWallet} from '../../../Redux/Actions';
import Loader from '../Loader/Loader';
import {LanguageManager, ThemeManager} from '../../../../ThemeManager';
import HeaderwithBackIcon from '../../common/HeaderWithBackIcon';
import {heightDimen, widthDimen} from '../../../Utils/themeUtils';
import {shuffledArrayFxn, checkExistingWallet} from './VerifyPhraseHelper';

const VerifyPhrase = props => {
  const arr = useSelector(state =>
    state?.createWalletReducer?.walletData?.mnemonics?.split(' '),
  );
  const [shuffledArray, setShuffledArray] = useState([]);
  const DATA = useSelector(state => state?.createWalletReducer?.walletData);
  const walletName = useSelector(
    state => state?.createWalletReducer?.walletName,
  );

  const [isLoading, setisLoading] = useState(false);
  const [selectedArray, setSelectedArray] = useState([]);

  useEffect(() => {
    shuffledArrayFxn(arr, setShuffledArray);
  }, []);

  return (
    <Wrap style={{backgroundColor: ThemeManager.colors.bg}}>
      <MainStatusBar
        backgroundColor={ThemeManager.colors.bg}
        barStyle={
          ThemeManager.colors.themeColor === 'light'
            ? 'dark-content'
            : 'light-content'
        }
      />
      {/* <ImageBackgroundComponent style={{ height: '100%' }}> */}
      <HeaderwithBackIcon iconLeft={ThemeManager.ImageIcons.iconBack} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        bounces={false}
        style={{flex: 1}}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'space-between',
        }}>
        <View>
          <Text
            style={[
              styles.styleLabelHeader,
              {color: ThemeManager.colors.headingText},
            ]}>
            {LanguageManager.VerifyPhrase}
          </Text>

          <View style={styles.descriptionWrapStyle}>
            <Text
              style={[
                styles.descriptionTextStyle,
                {color: ThemeManager.colors.lightTextColor},
              ]}>
              {LanguageManager.correctOrder}
            </Text>
          </View>

          <View
            style={[
              styles.selectedArrMainViewStyle,
              {
                borderColor: ThemeManager.colors.viewBorderColor,
              },
            ]}>
            <View style={styles.viewMnemonicsSelection}>
              {selectedArray.map((item, index) => (
                <View style={[styles.selectedListView]}>
                  <TouchableOpacity
                    onPress={() => {
                      selectedArray.splice(index, 1);
                      setSelectedArray([...selectedArray]);
                    }}
                    style={[styles.selectedListContainerStyle]}>
                    <View
                      style={[
                        styles.selectedListContainerStyle,
                        {
                          backgroundColor: ThemeManager.colors.mnemonicsView,
                          borderWidth: 1,
                          borderColor: ThemeManager.colors.mnemonicsViewBorder,
                        },
                      ]}>
                      <Text
                        style={[
                          styles.mnemonicSelectedNameText,
                          {
                            color: ThemeManager.colors.textColor,
                          },
                        ]}>
                        {item.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <View style={styles.viewClearAll}>
              <TouchableWithoutFeedback
                onPress={() => {
                  setSelectedArray([]);
                }}>
                <View style={styles.clearAllBtnStyle}>
                  <Text
                    style={[
                      styles.clearAllTextStyle,
                      {color: ThemeManager.colors.headingText},
                    ]}>
                    Clear All
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>

          <View
            style={{
              marginTop: heightDimen(12),
              marginHorizontal: widthDimen(16),
            }}>
            <FlatList
              data={shuffledArray}
              numColumns={2}
              contentContainerStyle={styles.contentContainer}
              keyExtractor={(item, index) => index + '  '}
              renderItem={({item, index}) => {
                const isArranged = selectedArray.find(
                  word => word.id === item.id,
                );
                let displayIndex = '';
                selectedArray.map((word, i) => {
                  word.id === item.id ? (displayIndex = i) : null;
                });
                console.log('isArranged::::', isArranged, item, displayIndex);
                return (
                  <View style={styles.listView}>
                    <TouchableOpacity
                      onPress={() => {
                        console.log('isArranged:::', isArranged);
                        if (isArranged) {
                          selectedArray.splice(
                            selectedArray.findIndex(el => el.id === item.id),
                            1,
                          );
                          setSelectedArray([...selectedArray]);
                        } else {
                          setSelectedArray([...selectedArray, item]);
                        }
                      }}
                      style={[
                        styles.listContainerStyle,
                        {
                          borderWidth: 0,
                        },
                      ]}>
                      <View
                        style={[
                          styles.listContainerStyle,
                          {
                            borderColor: isArranged
                              ? ThemeManager.colors.primary
                              : ThemeManager.colors.viewBorderColor,
                            backgroundColor: ThemeManager.colors.mnemonicsView,
                          },
                        ]}>
                        <Text
                          style={[
                            styles.mnemonicNameText,
                            {
                              color: ThemeManager.colors.textColor,
                            },
                          ]}>
                          {item.name}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
          </View>
        </View>

        <View
          style={[
            styles.alignCenter,
            {
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
            },
          ]}>
          <BasicButton
            onPress={() =>
              checkExistingWallet(
                setisLoading,
                selectedArray,
                arr,
                DATA,
                props,
                walletName,
              )
            }
            btnStyle={styles.btnStyle}
            customGradient={styles.customGrad}
            text={LanguageManager.proceed}></BasicButton>
        </View>
      </ScrollView>
      {isLoading && <Loader />}
      {/* </ImageBackgroundComponent> */}
    </Wrap>
  );
};

const mapStateToProp = state => {
  const {walletData, walletName} = state.createWalletReducer;
  return {walletData, walletName};
};

export default connect(mapStateToProp, {walletFormUpdate, createWallet})(
  VerifyPhrase,
);
