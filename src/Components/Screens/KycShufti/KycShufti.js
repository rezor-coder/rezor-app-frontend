import React from "react";
import { Dimensions, Image, Modal, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { Grid, Row } from "react-native-easy-grid";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import ShuftiPro from "react-native-shuftipro-kyc";
import { LanguageManager, ThemeManager } from "../../../../ThemeManager";
import Singleton from '../../../Singleton';
import { Colors, Fonts } from "../../../theme";
import { ImageBackgroundComponent, SimpleHeader, Wrap } from "../../common";
import { SettingBar } from "../../common/SettingBar";

import LottieView from 'lottie-react-native';
import { network } from "../../../Constant";
import { BASE_URL_SAITACARDS } from "../../../Endpoints";
import { NavigationStrings } from "../../../Navigation/NavigationStrings";
import { getCurrentRouteName, goBack, navigate } from "../../../navigationsService";
import images from "../../../theme/Images";
// test
// const client_id = 'b62f96f10b6912daa5884f4645df2e29730348402c341b456cf1c76a4bb14bb0';
// const secret_key = '7sTPf887HestGcegqposGQYJovA2PWfq';
//main
const client_id = network == 'testnet' ? 'b62f96f10b6912daa5884f4645df2e29730348402c341b456cf1c76a4bb14bb0' : 'p9SjxHFB24htkYeug73yXGPkWcuvIFM5XxEhWNwz6lPdQCDAHz1677244158';
const secret_key = network == 'testnet' ? '7sTPf887HestGcegqposGQYJovA2PWfq' : '$2y$10$Oy.p3Mdtxk0GbS/T6rkz7ODICEnsPl7ESqXtaSe5MD7sqCtPLrm92';
const windowHeight = Dimensions.get('window').height;
const uncheckedbox = '../../../../assets/images/uncheck_s.png';
const checkedbox = '../../../../assets/images/checked_box_s.png';
const doc_icon = '../../../../assets/images/document_s.png';
const back_icon = '../../../../assets/images/back_icon.png';
const face_icon = '../../../../assets/images/face_s.png';
const image_cam = '../../../../assets/images/imageCam_s.png';
const video_cam = '../../../../assets/images/videoCam_s.png';
const second_screen_icon = '../../../../assets/images/select_type_icon_s.png';
const continue_next = '../../../../assets/images/continue_next_s.png';
const address_icon = '../../../../assets/images/document_s.png';
const consent_icon = '../../../../assets/images/consent_s.png';
const phone_icon = '../../../../assets/images/document_s.png';
const bgChecks_icon = '../../../../assets/images/bgChecks_s.png';

const verificationObj01 = {
  face: false,
  background_checks: {},
  phone: {},
  document: {
    supported_types: [
      'passport',
      'id_card',
      'driving_license',
      'credit_or_debit_card',
    ],
    // name: {
    //   first_name: 'John',
    //   last_name: 'Livone',
    //   middle_name: '',
    // },
    // dob: '1989-09-06',
    // document_number: 'A123456',
    // expiry_date: '2025-09-09',
    // issue_date: '2001-05-02',
    // fetch_enhanced_data: '1',
    // gender: 'm',
    backside_proof_required: '1',
  },
  document_two: {
    supported_types: ['passport', 'id_card', 'driving_license', 'credit_or_debit_card'],
    // name: {
    //     first_name: "John",
    //     last_name: "Livone",
    //     middle_name: ""
    // },
    // dob: "06-09-989",
    // document_number: "A123456",
    // expiry_date: "2025-09-09",
    // issue_date: "2001-05-02",
    // fetch_enhanced_data: "1",
    // gender:"m",
    backside_proof_required: '1',
  },
  address: {
    // full_address: '10 Downing St, Westminister, London SW1A 2AA, UK',
    // name: {
    //   first_name: 'John',
    //   last_name: 'Livone',
    //   middle_name: '',
    //   fuzzy_match: '1',
    //   backside_proof_required: '0',
    // },
    supported_types: ['id_card', 'utility_bill', 'bank_statement'],
  },
  consent: {
    supported_types: ['printed', 'handwritten'],
    text: 'My name is John Doe and I authorize this transaction of $100/-',
  },
};

const verificationObj = {
  face: false,
  background_checks: {},
  phone: {},
  document: {
    supported_types: [
      'passport',
      'id_card',
      'driving_license',
      'credit_or_debit_card',
    ],
    // name: {
    //   first_name: '',
    //   last_name: '',
    //   middle_name: '',
    // },
    // dob: '',
    // document_number: '',
    // expiry_date: '',
    // issue_date: '',
    // fetch_enhanced_data: '',
    // gender: '',
    backside_proof_required: '1',
  },
  document_two: {
    supported_types: ["passport", "id_card", "driving_license", "credit_or_debit_card"],
    // name: {
    //     first_name: "",
    //     last_name: "",
    //     middle_name: ""
    // },
    // dob: "",
    // document_number: "",
    // expiry_date: "",
    // issue_date: "",
    // fetch_enhanced_data: "",
    // gender:"",
    backside_proof_required: '1',
  },
  address: {
    // full_address: '',
    // name: {
    //   first_name: '',
    //   last_name: '',
    //   middle_name: '',
    //   fuzzy_match: '',
    // },
    supported_types: ['id_card', 'utility_bill', 'bank_statement'],
    backside_proof_required: '1',
  },
  consent: {
    supported_types: ['printed', 'handwritten'],
    text: 'My name is John Doe and I authorize this transaction of $100/-',
  },
};

class KycShufti extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      kycmodalFail: true,
      paylaod: {
        country: '',
        language: 'EN',
        email: this.props?.route?.params?.email,
        callback_url: BASE_URL_SAITACARDS + 'user/getKycResponse',
        redirect_url: 'saitamatoken.com',
        show_consent: 0,
        show_results: 1,
        show_privacy_policy: 1,
        allow_offline: "1",
        //allow end user to upload real-time or already	catured proofs
        allow_online: "1",
      },
      config: {
        open_webview: false,
      },
      createdPayload: {},
      services: [
        {
          name: 'Face Verification',
          key: 'face',
        },
        {
          name: 'Document Verification',
          key: 'document',
        },
        // {
        //   name: "Document Two Verification",
        //   key: "document_two"
        // },
        // {
        //   name: 'Address Verification',
        //   key: 'address',
        // },
        // {
        //   name: 'Consent Verification',
        //   key: 'consent',
        // },
        // {
        //   name: 'Two Factor Authentication',
        //   key: 'phone',
        // },
        // {
        //   name: 'Background Checks',
        //   key: 'background_checks',
        // },
      ],
      servicesType: [
        { name: 'Image Proof', key: 'image' },
      ],
      selectedService: [],
      selectedServicesType: 'image',
      screenSelectServices: true,
      switchBetweenServiceAndType: true,
      isOcr: true,
    };
  }

  componentDidMount() {
    global.isCamera = true
    //console.warn('MM',">>>>>statesprops jkyc", this.props?.route?.params?.email);
  }

  UNSAFE_componentWillMount() { }

  serviceSelector(action, id, obj = {}) {
    const { selectedService, createdPayload } = this.state;

    if (action === 'add') {
      createdPayload[id] = obj;
      this.setState({ createdPayload });
    }

    if (action === 'delete') {
      Object.entries(createdPayload).map(item => {
        if (id === item[0]) {
          delete createdPayload[item[0]];
          this.setState({ createdPayload });
        }
      });
    }

    let IsExist = selectedService.some(x => x === id);
    if (!IsExist) {
      selectedService.push(id);
      this.setState({ selectedService });
    } else {
      selectedService.map((item, i) => {
        if (item === id) {
          selectedService.splice(i, 1);
          this.setState({ selectedService });
        }
      });
    }
  }

  servicesTypeSelector(element) {
    this.setState({ selectedServicesType: element.key });
    this.continue();
  }

  continue() {
    const { screenSelectServices } = this.state;
    if (screenSelectServices) {
      this.setState({ screenSelectServices: false });
    } else {
      this.setState({ switchBetweenServiceAndType: false });
    }
  }

  render() {
    const {
      services,
      selectedService,
      screenSelectServices,
      servicesType,
      selectedServicesType,
      switchBetweenServiceAndType,
      createdPayload,
      paylaod,
      config,
      isOcr,
      bgCheck,
    } = this.state;

    const getIconSecondScreen = key => {
      switch (key) {
        case 'video':
          return (
            <Image
              source={require(video_cam)}
              style={{ width: wp('7%'), height: wp('7%'), resizeMode: 'contain' }}
            />
          );
          break;
        case 'image':
          return (
            <Image
              source={require(image_cam)}
              style={{ width: wp('7%'), height: wp('7%'), resizeMode: 'contain' }}
            />
          );
          break;
        default:
          break;
      }
    };

    const getIcon = key => {
      switch (key) {
        case 'face':
          return (
            <Image
              source={require(face_icon)}
              style={{ width: wp('8%'), height: wp('8%'), resizeMode: 'contain' }}
            />
          );
          break;
        case 'document':
          return (
            <Image
              source={require(doc_icon)}
              style={{ width: wp('8%'), height: wp('8%'), resizeMode: 'contain' }}
            />
          );
          break;

        case 'document_two':
          return <Image source={require(doc_icon)} style={{ width: wp('8%'), height: wp('8%'), resizeMode: 'contain' }} />
          break;

        case 'address':
          return (
            <Image
              source={require(address_icon)}
              style={{ width: wp('8%'), height: wp('8%'), resizeMode: 'contain' }}
            />
          );
          break;

        case 'consent':
          return (
            <Image
              source={require(consent_icon)}
              style={{ width: wp('8%'), height: wp('8%'), resizeMode: 'contain' }}
            />
          );
          break;
        case 'phone':
          return (
            <Image
              source={require(phone_icon)}
              style={{ width: wp('8%'), height: wp('8%'), resizeMode: 'contain' }}
            />
          );
          break;
        case 'background_checks':
          return (
            <Image
              source={require(bgChecks_icon)}
              style={{ width: wp('8%'), height: wp('8%'), resizeMode: 'contain' }}
            />
          );
          break;
        default: {

        }
      }
    };

    const parentServicesScreenOne = () => {
      return (
        <Row style={styles.servicesRow}>
          <Grid style={styles.mainContainer}>
            <TouchableHighlight
              underlayColor="none"
              onPress={() => {
                goBack();
              }}>
              <Image
                source={require(back_icon)}
                style={{
                  tintColor: ThemeManager.colors.searchTextColor,
                  width: wp('5'),
                  height: wp('5'),
                  marginLeft: wp('6'),
                  marginTop: wp('6'),
                  resizeMode: 'contain',
                }}
              />
            </TouchableHighlight>
            <Row style={styles.txtRow}>
              <Text style={styles.textM}>Verification</Text>
            </Row>
          </Grid>

          <Row style={styles.txtRowH}>
            <Text style={styles.textS}>
              Select Your Method of{'\n'}Verification
            </Text>
          </Row>
          <Row style={styles.txtRow} />
          <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollStyle} >
            {services.map((element, i) => {
              if (selectedService.indexOf(element.key) > -1) {
                return (
                  <TouchableHighlight
                    underlayColor="none"
                    style={styles.servicesBtn}
                    key={i}
                    onPress={() => {
                      this.serviceSelector(
                        'delete',
                        element.key,
                        isOcr
                          ? verificationObj[element.key]
                          : verificationObj01[element.key],
                      );
                    }}>
                    <>
                      {getIcon(element.key)}
                      <Row
                        style={{
                          justifyContent: 'space-between',
                          paddingRight: hp('2'),
                          paddingLeft: hp('2'),
                        }}>
                        <Text style={styles.serviceText}>{element.name}</Text>
                        <Image
                          source={require(checkedbox)}
                          style={{
                            width: wp('6'),
                            height: wp('6'),
                            resizeMode: 'contain',
                          }}
                        />
                      </Row>
                    </>
                  </TouchableHighlight>
                );
              } else {
                return (
                  <TouchableHighlight
                    underlayColor="none"
                    style={styles.servicesBtn}
                    key={i}
                    onPress={() => {
                      this.serviceSelector(
                        'add',
                        element.key,
                        isOcr
                          ? verificationObj[element.key]
                          : verificationObj01[element.key],
                      );
                    }}>
                    <>
                      {getIcon(element.key)}
                      <Row
                        style={{
                          justifyContent: 'space-between',
                          paddingRight: hp('2'),
                          paddingLeft: hp('2'),
                        }}>
                        <Text style={styles.serviceText}>{element.name}</Text>
                        <Image
                          source={require(uncheckedbox)}
                          style={{
                            width: wp('6'),
                            height: wp('6'),
                            resizeMode: 'contain',
                          }}
                        />
                      </Row>
                    </>
                  </TouchableHighlight>
                );
              }
            })}
          </ScrollView>

          <Row style={styles.btnRow}>
            <TouchableHighlight
              underlayColor="none"
              disabled={selectedService.length < 2}
              style={[
                styles.buttonContinue,
                { opacity: selectedService.length < 2 ? 0.5 : 1 },
              ]}
              onPress={() => {
                this.continue();
              }}>
              <Text style={styles.ContinueText}>Start Verification</Text>
            </TouchableHighlight>
          </Row>
        </Row>
      );
    };

    const parentServicesSecondScreen = () => {

      return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
          <Grid style={styles.mainContainer}>
            <TouchableHighlight
              underlayColor="none"
              onPress={() => {
                this.setState({
                  switchBetweenServiceAndType: true,
                  screenSelectServices: true,
                });
              }}>
              <Image
                source={require(back_icon)}
                style={{
                  tintColor: ThemeManager.colors.searchTextColor,
                  width: wp('5'),
                  height: wp('5'),
                  marginLeft: wp('6'),
                  marginTop: wp('6'),
                  resizeMode: 'contain',
                }}
              />
            </TouchableHighlight>
            <Row style={styles.servicesRow}>
              <Image
                source={require(second_screen_icon)}
                style={{
                  width: wp('55'),
                  height: wp('55'),
                  resizeMode: 'contain',
                }}
              />

              <Row style={styles.select_type_heading}>
                <Text style={styles.type_text}>Choose Verification Type</Text>
              </Row>
              {servicesType.map((element, i) => {
                return (
                  <TouchableHighlight
                    underlayColor="none"
                    style={styles.servicesBtnSecondScreen}
                    key={i}
                    onPress={() => {
                      this.servicesTypeSelector(element);
                    }}>
                    <Row
                      style={{
                        justifyContent: 'flex-start',
                        paddingRight: hp('2'),
                        paddingLeft: hp('2'),
                      }}>
                      {getIconSecondScreen(element.key)}
                      <Text style={styles.serviceTextSecondScreen}>
                        {element.name}
                      </Text>
                      {
                        <Image
                          source={require(continue_next)}
                          style={{
                            width: wp('5'),
                            height: wp('5'),
                            resizeMode: 'contain',
                            marginTop: 5,
                          }}
                        />
                      }
                    </Row>
                  </TouchableHighlight>
                );
              })}

            </Row>
          </Grid>
        </SafeAreaView>
      );
    };

    const parentServices = () => {
      return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
          <Grid style={styles.mainContainer}>

            {screenSelectServices
              ? parentServicesScreenOne()
              : parentServicesSecondScreen()}
          </Grid>
        </SafeAreaView>
      );
    };

    const shuftPro = () => {
      return (
        <ShuftiPro
          requestPayload={{ ...createdPayload, ...paylaod, ...config }}
          isShow={true}
          verificationMode={selectedServicesType}
          basicAuth={{ client_id: client_id, secret_key: secret_key }}
          async={false}
          asyncResponseCallback={response => {
            //console.warn('MM',"???>>>response", response);
            if (!JSON.stringify(response).includes("verification_url") && (JSON.stringify(createdPayload).includes("background_checks") || JSON.stringify(createdPayload).includes("phone") || (JSON.stringify(config).includes("\"open_webview\":true") && response.event != "request.unauthorized"))) {
              this.setState({
                switchBetweenServiceAndType: true,
                screenSelectServices: true,
              });
            }
          }}
          onResponseOkayButton={() => {
            this.setState({
              // switchBetweenServiceAndType: true,
              // screenSelectServices: true,
              // kycmodalFail: true
            });
            Singleton.getInstance().currentCard = 'black'
            getCurrentRouteName() != 'SaitaCardsInfo' && navigate(NavigationStrings.SaitaCardsInfo);
          }}

          cancelBtn={cancelResponse => {
            this.setState({
              // switchBetweenServiceAndType: true,
              // screenSelectServices: true,
            });
            goBack()
          }}
        />
      );
    };
    {/* *********************************************************** MODAL FOR error ********************************************************************** */ }
    <Modal
      animationType="slide"
      transparent={true}
      visible={this.state.kycmodalFail}
      onRequestClose={() => this.setState({ kycmodalFail: false })}>
      <Wrap style={{ backgroundColor: ThemeManager.colors.backgroundColor }}>
        <ImageBackgroundComponent style={{ height: windowHeight }}>
          <SimpleHeader
            title="Retry KYC"
            titleStyle={{ marginRight: 30 }}
            back={false}
            backPressed={() => this.setState({ kycmodalFail: false })}
          />
          <View style={{ height: "35%", alignItems: 'center', justifyContent: 'center', }}>
            <LottieView
              source={images.Kycerror}
              style={{ width: '40%', }}
              autoPlay
              loop
            />

          </View>
          <View style={{ height: "30%", }}>
            <Text style={[styles.txtWelcome, { color: ThemeManager.colors.textColor, marginTop: 20 }]}>Oops…{'\n'}Your Identification Was{'\n'}Declined</Text>
            <Text style={[styles.txtkyc]}>The information you submitted did not{'\n'}pass KYC identification. Please retry{'\n'}Identification or contact support.</Text>
          </View>

          <View style={[styles.card,]}>
            <SettingBar
              disabled={false}
              // iconImage={images.wallet_inactive}
              iconImage={ThemeManager.ImageIcons.manageWallet}
              title={LanguageManager.retryKyc}
              titleStyle={{ color: ThemeManager.colors.textColor, fontFamily: Fonts.light, fontSize: 13, }}
              onPress={() => { this.setState({ kycmodalFail: false }) }}
              style={{ borderBottomWidth: 0 }}
              imgStyle={[styles.img]}
              showArw={false}
              arrowIcon={ThemeManager.ImageIcons.forwardArrowIcon}
            />
          </View>

          <View style={[styles.card,]}>
            <SettingBar
              disabled={false}
              iconImage={ThemeManager.ImageIcons.currencyPreferences}
              title={LanguageManager.contactepay}
              titleStyle={{ color: ThemeManager.colors.textColor, fontFamily: Fonts.light, fontSize: 13, }}
              onPress={() => { this.setState({ kycmodalFail: false }) }}
              style={{ borderBottomWidth: 0 }}
              imgStyle={[styles.img]}
              isseconText={true}
              showArw={false}
              seconText={"Support@epay.me"}
              arrowIcon={ThemeManager.ImageIcons.forwardArrowIcon}
            />
          </View>
        </ImageBackgroundComponent>
      </Wrap>
    </Modal>
    return switchBetweenServiceAndType ? parentServices() : shuftPro();
  }
}

export default KycShufti;

const styles = StyleSheet.create({
  txtWelcome: {
    fontFamily: Fonts.semibold,
    fontSize: 20,
    alignSelf: 'center',
    textAlign: 'center',
  },
  txtkyc: {
    fontFamily: Fonts.regular,
    fontSize: 15,
    color: "#989898",
    marginHorizontal: 40,
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 22
  },
  card: {
    // backgroundColor: Colors.inputDarkbg,
    borderRadius: 10,
    resizeMode: 'contain',
    borderBottomColor: Colors.borderColor,
    borderBottomWidth: 0.2,
  },
  img: { width: 26, height: 26, resizeMode: 'contain' },
  mainContainer: {
    height: hp('100'),
    backgroundColor: '#FFFFFF',
  },
  header: {
    ...Platform.select({
      ios: {
        height: hp('7%'),
      },
      android: {
        height: hp('7%'),
      },
    }),
    borderWidth: 0.5,
  },

  btnRow: {
    ...Platform.select({
      ios: {
        bottom: hp('0%'),
      },
      android: {
        bottom: hp('0%'),
      },
    }),
    marginTop: '-200%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    position: 'absolute',
  },

  buttonContinue: {
    backgroundColor: '#2C6CDD',
    ...Platform.select({
      ios: {
        height: hp('6%'),
      },
      android: {
        height: hp('7%'),
      },
    }),
    width: wp('90%'),
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  ContinueText: {
    fontSize: wp('6%'),
    color: '#FFFFFF',
  },

  scrollStyle: {
    marginBottom: '10%',
  },

  txtRow: {
    ...Platform.select({
      ios: {
        height: hp('7%'),
      },
      android: {
        height: hp('8%'),
      },
    }),
    width: wp('100%'),
    alignItems: 'center',
    flexDirection: 'column',
  },
  txtRowH: {
    width: wp('90%'),
    marginLeft: wp('10%'),
    ...Platform.select({
      ios: {
        height: hp('11%'),
        marginBottom: wp('0%'),
        marginTop: wp('10%'),
      },
      android: {
        height: hp('11%'),
        marginBottom: wp('2%'),
        marginTop: wp('10%'),
      },
    }),
  },
  select_type_heading: {
    height: hp('8%'),
    marginTop: wp('4'),
    marginBottom: wp('8'),
    justifyContent: 'center',
  },
  textS: {
    fontWeight: 'bold',
    color: '#1D2C42',
    fontSize: wp('6%'),
  },
  textM: {
    color: '#030303',
    marginTop: '7%',
    justifyContent: 'center',
    fontSize: 20,
  },
  type_text: {
    fontSize: 21,
    color: '#1D2C42',
    fontWeight: 'bold',
  },
  servicesRow: {
    flexDirection: 'column',
    width: wp('100%'),
    ...Platform.select({
      ios: {
        height: hp('80%'),
      },
      android: {
        height: hp('80%'),
      },
    }),
    alignItems: 'center',
    alignSelf: 'center',
  },
  servicesBtn: {
    width: wp('90%'),
    borderWidth: 1,
    borderColor: '#F6F6F6',
    ...Platform.select({
      ios: {
        height: hp('7%'),
      },
      android: {
        height: hp('7%'),
      },
    }),
    paddingLeft: hp('1.5'),
    marginBottom: hp('2'),
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: 'rgba(88,88,88,0.34)',
    elevation: 1,
  },
  servicesBtnSecondScreen: {
    width: wp('85%'),
    borderWidth: 1,
    borderColor: '#F6F6F6',
    ...Platform.select({
      ios: {
        height: hp('7%'),
      },
      android: {
        height: hp('7%'),
      },
    }),
    marginBottom: hp('2'),
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: 'rgba(88,88,88,0.34)',
    elevation: 2,
    shadowOffset: { width: 5, height: 3 },
    shadowOpacity: 0.6,
  },

  serviceTextSecondScreen: {
    color: '#1D2C42',
    fontWeight: '500',
    fontSize: wp('5'),
    width: wp('60'),
    marginLeft: wp('5'),
  },

  serviceText: {
    color: '#1D2C42',
    fontWeight: '900',
    fontSize: wp('4'),
    width: wp('64'),
  },

});