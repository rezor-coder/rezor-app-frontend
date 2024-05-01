import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StatusBar,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  Dimensions,
  NetInfo,
  AsyncStorage,
  ActivityIndicator,
  Alert,
  FlatList,
  Switch, SafeAreaView
} from 'react-native';
import CountryCodeStyle from './CountryWholeCurrencyStyle';
import { SimpleHeader, BorderLine, SearchBar } from "../../common";
import { Actions, ActionConst } from 'react-native-router-flux';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import { Images, Colors, Fonts } from '../../../theme';
let Search = '';

class CountryWholeCurrency extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    Search = ''
    this.state = {
      searchEnabled: true,
      searchText: "",
      countryCodesArr: [],
      searchArray: [],
      width:Dimensions.get('window').width

    };
  }

  componentDidMount() {

    const SortedArray = this.props.List.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });
    //console.warn('MM','chk respppp--------', SortedArray);
    this.setState({
      countryCodesArr: SortedArray,
    });
  }


  searchClicked() {
    this.setState({
      searchEnabled: !this.state.searchEnabled,
    });
  }
  searchTextChanged(text) {

    this.setState({ searchArray: [], searchText: text })
    let newArray = []
    for (var i = 0; i < this.state.countryCodesArr.length; i++) {
      let item = this.state.countryCodesArr[i]
      if (item.name.toLowerCase().includes(text.toLowerCase())) {
        newArray.push(item);
      }
    }
    this.setState({ searchArray: newArray });
  }
  backClicked() {
    this.props.navigation.goBack();
  }
  countryCodeSelected(item) {
    this.props.onPress(item);
  }
  addToken() {
    this.props.navigation.navigate('AddToken', {});
  }
  render() {
    return (
      <>
        <View
        onLayout={()=>{
          this.setState({
            width:Dimensions.get('window').width
          })
        }}
        style={{ flex: 1, backgroundColor: ThemeManager.colors.backgroundColor }}>
          <SafeAreaView style={CountryCodeStyle.mainViewStyle}>
            <View style={{ width: '100%', }}>
              <SimpleHeader
                title={this.props?.title || "Country"}
                backImage={ThemeManager.ImageIcons.iconBack}
                titleStyle={{ marginRight: 30 }}
                imageShow
                back={false}
                backPressed={() => {
                  this.setState({ searchText: "" })
                  this.props.closeModal()
                }}
              />
              <BorderLine
                borderColor={{ backgroundColor: ThemeManager.colors.chooseBorder, marginBottom: 15 }}
              />
            </View>


            <View style={{ marginTop: 5, paddingHorizontal: 15, }} >
              <SearchBar
                titleStyle={{ color: ThemeManager.colors.textColor }}
                text={Search}
                width="100%"
                placeholder="Search"
                returnKeyType={'done'}
                imgstyle={CountryCodeStyle.imgstyle}
                iconStyle={CountryCodeStyle.length > 0 ? CountryCodeStyle.searchIcon1 : CountryCodeStyle.searchIcon}
                onChangeText={(text) => {
                  Search = text;
                  this.searchTextChanged(text)
                }}
                onSubmitEditing={() => {
           //  console.warn('MM',"fff")
                }}
              />
            </View>


            <View
            style={{
               flex: 1,
               width: this.state.width,
               marginTop: 0,
               alignContent: 'center',
               justifyContent: 'center', 
            }}>
              {this.state.searchEnabled
                ? this.state.searchText.length != 0
                  ? this.state.searchArray.length == 0 && (
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        height: '100%',
                      }}>
                      <Text
                        style={{
                          color: ThemeManager.colors.textColor,
                          fontFamily: Fonts.regular,
                          fontSize: 15,
                          textAlign: 'center',
                        }}>
                        No Country Found
                      </Text>
                    </View>
                  )
                  : this.state.countryCodesArr.length == 0 && (
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        height: '100%',
                      }}>
                      <Text
                        style={{
                          color: ThemeManager.colors.textColor,
                          fontFamily: Fonts.regular,
                          fontSize: 15,
                          textAlign: 'center',
                        }}>
                        No Country Found
                      </Text>
                    </View>
                  )
                : this.state.countryCodesArr.length == 0 && (
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%',
                      height: '100%',
                    }}>
                    <Text
                      style={{
                        color: ThemeManager.colors.textColor,
                        fontFamily: Fonts.regular,
                        fontSize: 15,
                        textAlign: 'center',
                      }}>
                      No Country Found
                    </Text>
                  </View>
                )}

              <FlatList
                style={{ flex: 1, marginTop: 10 }}
                data={this.state.searchText.length != 0 ? this.state.searchArray : this.state.countryCodesArr}
                bounces={false}
                scrollEnabled={true}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={CountryCodeStyle.FlatlistCell}
                    onPress={this.countryCodeSelected.bind(this, item)}>
                    <View style={CountryCodeStyle.FlatListCellSubView}>
                      <View style={CountryCodeStyle.FlatlistCellLeftView}>
                        <Text style={[CountryCodeStyle.coinNameText, { color: ThemeManager.colors.textColor , width:'80%'}]}>
                          {item.name}
                        </Text>
                        <Text style={[CountryCodeStyle.countryCodeStyle, { color: ThemeManager.colors.textColor }]}>
                          {/* {this.props?.hideCode ? '' : item.currency.code} */}
                        </Text>
                      </View>
                    </View>
                    {/* <BorderLine  borderColor={{ backgroundColor: ThemeManager.colors.chooseBorder  }} /> */}
                  </TouchableOpacity>
                )}
              />
            </View>
          </SafeAreaView>
        </View>
        <SafeAreaView style={{ flex: 0 }}></SafeAreaView>

      </>
    );
  }
}

export default CountryWholeCurrency