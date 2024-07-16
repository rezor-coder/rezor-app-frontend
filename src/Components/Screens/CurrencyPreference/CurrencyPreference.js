/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import {
  BackHandler,
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import * as Constants from '../../../Constant';
import { getCurrencyPreferenceList } from '../../../Redux/Actions/index';
import Singleton from '../../../Singleton';
import { widthDimen } from '../../../Utils/themeUtils';
import { Images } from '../../../theme';
import { BorderLine, SimpleHeader, Wrap } from '../../common';
import Loader from '../Loader/Loader';
import styles from './CurrencyPreferenceStyle';
import { goBack } from '../../../navigationsService';

class CurrencyPreference extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      fiatCurrencyList: [],
      selectedIndex: '',
      isSelected: false,
    };
  }
  componentDidMount() {
    this.getCurrencyList();
  }
  getCurrencyList() {
    this.setState({ isLoading: true });
    this.props.navigation.addListener('blur', this.screenBlur);
    this.props.navigation.addListener('focus', this.screenFocus);
    let access_token = Singleton.getInstance().access_token;
    this.props
      .getCurrencyPreferenceList({ access_token })
      .then(res => {
        this.setState({ isLoading: false, fiatCurrencyList: res });
      })
      .catch(err => {
        this.setState({ isLoading: false });
        Singleton.showAlert(err.message);
      });
  }
  screenFocus = () => {
    BackHandler.addEventListener('hardwareBackPress', this.backAction);
  };
  screenBlur = () => {
    BackHandler.removeEventListener('hardwareBackPress', this.backAction);
  };
  backAction = () => {
    //console.warn('MM','i preferences');
    goBack();
    return true;
  };
  itemPressed(item, index) {
    //console.warn('MM','chk item------', item, '-------------', index);
    this.setState({ isSelected: true, selectedIndex: index }, () => {
      Singleton.getInstance().newSaveData(Constants.CURRENCY_SELECTED, item.currency_code);
      Singleton.getInstance().newSaveData(Constants.CURRENCY_SYMBOL, item.currency_symbol);
      Singleton.getInstance().CurrencySymbol = item.currency_symbol;
      Singleton.getInstance().CurrencySelected = item.currency_code;
    });
  }
  render() {
    return (
      <>
        <Wrap style={{ backgroundColor: ThemeManager.colors.bg }}>
          <SimpleHeader
            title={LanguageManager.currencyPreference}
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
            borderColor={{ backgroundColor: ThemeManager.colors.viewBorderColor }}
          />

          <View style={styles.formwrap}>
            <FlatList
              data={this.state.fiatCurrencyList}
              keyExtractor={item => item.currency_id}
              ItemSeparatorComponent={()=>(<BorderLine/>)}
              renderItem={({ item, index }) => (
                <>
                  <TouchableOpacity
                    onPress={() => this.itemPressed(item, index)}
                    style={[
                      styles.currencyStyle,
                    ]}>
                    <Text
                      style={[
                        styles.wrap,
                        {
                          color: this.state.selectedIndex == index &&
                            this.state.isSelected == true ? ThemeManager.colors.headingText : this.state.isSelected == false &&
                              Singleton.getInstance().CurrencySelected ==
                              item.currency_code ? ThemeManager.colors.headingText : ThemeManager.colors.lightTextColor
                        },
                      ]}>
                      {' '}
                      {item.currency_code}
                    </Text>
                    {this.state.selectedIndex == index &&
                      this.state.isSelected == true && (
                        <FastImage
                          style={{ height: widthDimen(18), width: widthDimen(18) }}
                          source={Images.iconSelectedCurrency}
                        />
                      )}
                    {this.state.isSelected == false &&
                      Singleton.getInstance().CurrencySelected ==
                      item.currency_code && (
                        <FastImage
                          style={{ height: widthDimen(18), width: widthDimen(18) }}
                          source={Images.iconSelectedCurrency}
                        />
                      )}
                  </TouchableOpacity>
                  {/* <BorderLine
                    borderColor={{ backgroundColor: ThemeManager.colors.viewBorderColor, marginTop: 0, }}
                  /> */}
                </>
              )}
            />
          </View>
          {this.state.isLoading == true && <Loader color="White" />}
        </Wrap>
        <SafeAreaView
          style={{ backgroundColor: ThemeManager.colors.backgroundColor }}
        />
      </>
    );
  }
}
const mapStateToProp = state => {
  return {};
};
export default connect(mapStateToProp, { getCurrencyPreferenceList })(
  CurrencyPreference,
);
