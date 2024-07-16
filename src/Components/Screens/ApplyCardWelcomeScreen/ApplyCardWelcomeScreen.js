import React, { useCallback, useRef, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import LinearGradient from 'react-native-linear-gradient';
import Carousel from 'react-native-reanimated-carousel';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import { getKycId } from '../../../Redux/Actions/SaitaCardAction';
import Singleton from '../../../Singleton';
import { areaDimen, width, widthDimen } from '../../../Utils/themeUtils';
import { Colors, Images } from '../../../theme';
import { SimpleHeader } from '../../common';
import GradientButton from '../../common/GradientButton';
import WraperContainer from '../../common/WraperContainer';
import { styles } from './styles';
import { OndatoSdk } from 'ondato-sdk-react-native';
import Loader from '../Loader/Loader';
import { navigate } from '../../../navigationsService';
import { NavigationStrings } from '../../../Navigation/NavigationStrings';

// import Carousel from 'react-native-snap-carousel';

const ApplyCardWelcomeScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const ondatoSdkRef = useRef(null);
  const {cardUserDetail} = useSelector(state=>state?.saitaCardReducer)
  console.log('cardUserDetail::::',cardUserDetail);
  
  const [carouselData, setCarouselData] = useState([
    {
      title: 'Advantages',
      icon: Images.blueLike,
      discription1: 'Easy online shopping.',
      discription2: 'Credit building potential.',
      discription3: 'Simplified expense tracking.',
    },
    {
      title: 'Advantages',
      icon: Images.blueLike,
      discription1: 'Easy online shopping.',
      discription2: 'Credit building potential.',
      discription3: 'Simplified expense tracking.',
    },
    {
      title: 'Advantages',
      icon: Images.blueLike,
      discription1: 'Easy online shopping.',
      discription2: 'Credit building potential.',
      discription3: 'Simplified expense tracking.',
    },
  ]);

  const [currentPosition, setCurrentPosition] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(1);

  
  const [welcomStep, setWelcomStep] = useState([
    {title: 'Select card', status: 'done'},
    {title: 'KYC', status: 'pending'},
    {title: 'Submit details', status: 'pending'},
    {title: 'Done', status: 'pending'},
  ]);
  const [onPressActive, setPressActive] = useState(false);

  const [config,setConfig] = useState({});
  const [isLoading,setIsLoading]= useState(false);
  const [showOndato,setShowOndato] = useState(false);

  const onStateUpdate = useCallback((state) => {
    console.log('state::::::::',state);

    setShowOndato(false);
  }, []);

  const onPressApplyNow = () => {
    // if(isEmpty(config)){
    //   Singleton.showAlert('KYC config not set ')
    //   return;
    // }
    // setPressActive(true);
    // setTimeout(() => {
    //   setPressActive(false);
    // }, 200);
    // Actions.ApplyCard()
    // setIsLoading(true);
    navigate(NavigationStrings.ApplyCard)
    return
    getKycId({data: {}, token: cardUserDetail?.access_token})
      .then(res => {
        console.log(res,'res???');
        setConfig({
          mode: 'test',
          identityVerificationId: res?.data?.id,
          language: 'en',
          showSplashScreen: true,
          showStartScreen: true,
          showIdentificationWaitingScreen: true,
          showSelfieFrame: true,
          skipRegistrationIfDriverLicense: true,
          showSuccessWindow: true,
          simpleCustomization: {
            primaryColor: 'red',
            textColor: 'green',
            buttonTextColor: 'pink',
          },
        });
        setIsLoading(false);
        setShowOndato(true);
        setTimeout(() => {
          ondatoSdkRef.current?.open();
        }, 1000);
      })
      .catch(error => {
        Singleton.showAlert(error?.message);
        setIsLoading(false);
        setShowOndato(false);
      });
  };
  console.log('showOndato::::',showOndato);
  const renderStepData = ({item, index}) => {
    return (
      <View style={styles.welcomStepView}>
        <View>
          {currentPosition == index ? (
            <View style={styles.indicatorStyle} />
          ) : null}
          <Text
            style={[
              styles.setpTitleStyle,
              {color: ThemeManager.colors.inActiveColor},
            ]}>{`${LanguageManager.step} ${index + 1}`}</Text>
          <Text
            style={[
              styles.setpTitleStyle,
              {color: ThemeManager.colors.textColor},
            ]}>
            {item?.title}
          </Text>
        </View>
        <View>
          {item.status == 'done' ? (
            <FastImage
              style={[
                styles.likeIcon,
                {
                  backgroundColor: ThemeManager.colors.bg,
                  zIndex: 1,
                },
              ]}
              source={Images.circleBlueTick}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.inActiveIndicator} />
          )}
          <View
            style={{
              // borderStyle: item.status == 'done' ? 'solid' : Platform.OS =='android'? 'dashed':'solid',
              opacity: item.status == 'done' ? 1 : 0.5,
              height: index == welcomStep.length - 1 ? 0 : areaDimen(70),
              justifyContent: 'space-evenly',
              overflow:'hidden',
              ...styles.indicatorLine,
            }}>
            {[...Array(6)].map(() => {
              return (
                <View
                  style={{
                    backgroundColor: 'red',
                    height: item.status == 'done'  ?'25%':'5%',
                    zIndex: 1,
                    width: 1,
                    backgroundColor: Colors.buttonColor1,
                    bottom:0
                  }}
                />
              );
            })}
          </View>
        </View>
      </View>
    );
  };
  const renderImageView = ({item,index}) =>{
    return (
      <View
        key={item.id}
        style={[
          styles.box,
          {
            opacity: index == currentIndex ? 1 : 0.5,
            borderRadius: areaDimen(17),
          },
        ]}>
        <LinearGradient
          colors={[Colors.purple, Colors.buttonColor1]}
          start={{x: 0, y: 0}}
          style={[
            styles.gradentView,
            {alignItems: 'center', justifyContent: 'center'},
          ]}
          end={{x: 1, y: 0}}>
          <View
            style={{
              backgroundColor: ThemeManager.colors.bg,
              ...styles.iconBg,
            }}>
            <FastImage
              source={item.icon}
              style={styles.iconStyle}
              resizeMode="contain"
              tintColor={Colors.buttonColor1}
            />
          </View>
          <Text style={[styles.textStyle, {color: ThemeManager.colors.bg}]}>
            {item?.title}
          </Text>
        </LinearGradient>
        <View
          style={[
            styles.gradentView,
            {
              backgroundColor: ThemeManager.colors.bg,
              justifyContent: 'space-evenly',
              paddingVertical: '1%',
              borderTopLeftRadius:areaDimen(0),
              borderTopRightRadius:areaDimen(0),
              borderBottomLeftRadius:areaDimen(17),
              borderBottomRightRadius:areaDimen(17)
            },
          ]}>
          <View style={styles.flexRowCenter}>
            <FastImage
              style={styles.likeIcon2}
              source={Images.circleBlueTick}
              resizeMode="contain"
            />

            <Text
              numberOfLines={1}
              style={[
                styles.discriptionStyle,
                {color: ThemeManager.colors.textColor},
              ]}>
              {item?.discription1}
            </Text>
          </View>
          <View style={styles.flexRowCenter}>
            <FastImage
              style={styles.likeIcon2}
              source={Images.circleBlueTick}
              resizeMode="contain"
            />

            <Text
              numberOfLines={1}
              style={[
                styles.discriptionStyle,
                {color: ThemeManager.colors.textColor},
              ]}>
              {item?.discription2}
            </Text>
          </View>
          <View style={styles.flexRowCenter}>
            <FastImage
              style={styles.likeIcon2}
              source={Images.circleBlueTick}
              resizeMode="contain"
            />

            <Text
              numberOfLines={1}
              style={[
                styles.discriptionStyle,
                {color: ThemeManager.colors.textColor},
              ]}>
              {item?.discription3}
            </Text>
          </View>
        </View>
      </View>
    );
  }


  return (
    <View
      style={{
        flex: 1,
        backgroundColor: ThemeManager.colors.dashboardBg,
        paddingTop: insets.top,
      }}>
      <SimpleHeader
        title={''}
        backImage={ThemeManager.ImageIcons.iconBack}
        titleStyle
        imageShow
        back={false}
        backPressed={() => {
          navigation.goBack();
        }}
      />
      <KeyboardAwareScrollView
        contentContainerStyle={{
          paddingBottom: areaDimen(100),
        }}>
        <Text
          style={[styles.titleStyle, {color: ThemeManager.colors.textColor}]}>
          {LanguageManager.oneCardAccessAll}
        </Text>

        <Carousel
          loop={false}
          width={width}
          height={width / 2}
          style={{alignSelf: 'center'}}
          autoPlay={false}
          windowSize={100}
          mode="parallax"
          data={carouselData}
          scrollAnimationDuration={200}
          renderItem={renderImageView}
          modeConfig={{
            parallaxAdjacentItemScale: 0.76,
            parallaxScrollingScale: 0.88,
            parallaxScrollingOffset: widthDimen(358),
          }}
          onSnapToItem={value => setCurrentIndex(value)}
          defaultIndex={1}
        />

        <View style={styles.dotView}>
          {carouselData.map((item, index) => {
            return (
              <View
                style={[
                  styles.dotStyle,
                  {
                    backgroundColor:
                      index == currentIndex
                        ? Colors.buttonColor1
                        : Colors.lightBlue,
                  },
                ]}
              />
            );
          })}
        </View>

        <View style={styles.welcomCardMailView}>
          <View
            style={{
              backgroundColor: ThemeManager.colors.lightBlue2,
              ...styles.welcomFirstView,
            }}>
            <FastImage
              source={Images.cardBg}
              style={styles.tiltcardStyle}
              resizeMode="stretch"
            />
            <Text
              style={[
                styles.welcomText,
                {color: ThemeManager.colors.textColor},
              ]}>
              {LanguageManager.welcome}
            </Text>
            <Text
              style={[
                styles.welcomSubTitle,
                {color: ThemeManager.colors.textColor},
              ]}>
              {LanguageManager.getYour}{' '}
              <Text style={{color: Colors.buttonColor1}}>
                {LanguageManager.card}
              </Text>{' '}
              {LanguageManager.now}!
            </Text>
            <Text
              style={[
                styles.welcomDecription,
                {color: ThemeManager.colors.textColor},
              ]}>
              {LanguageManager.welcomStepDicription}
            </Text>
          </View>

          <View
            style={{
              shadowOffset: {
                width: 0.2,
                height: 10,
              },
              shadowOpacity: 0.2,
              backgroundColor: ThemeManager.colors.bg,
              shadowRadius: 3.05,
              elevation: 10,
              borderBottomRightRadius: areaDimen(12),
              borderBottomLeftRadius: areaDimen(12),
            }}>
            <FlatList
              data={welcomStep}
              style={{
                ...styles.welcomSecondView,
              }}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderStepData}
              extraData={welcomStep}
            />
          </View>
          <View style={[styles.welcomStepView, {paddingHorizontal: 0}]}>
            <View
              style={{
                ...styles.cardStyle,
                backgroundColor: ThemeManager.colors.aliceBlue,
              }}>
              <FastImage
                style={[
                  styles.manageIconStyle,
                  {transform: [{rotate: '180deg'}]},
                ]}
                source={Images.manage}
                resizeMode="contain"
              />
              <Text
                style={[
                  styles.cardTextStyle,
                  {color: ThemeManager.colors.textColor},
                ]}>
                {LanguageManager.quickSetUpItsFree}
              </Text>
            </View>
            <View
              style={{
                ...styles.cardStyle,
                backgroundColor: ThemeManager.colors.aliceBlue,
              }}>
              <FastImage
                style={styles.manageIconStyle}
                source={Images.blueCrown}
                resizeMode="contain"
              />
              <Text
                style={[
                  styles.cardTextStyle,
                  {color: ThemeManager.colors.textColor},
                ]}>
                {LanguageManager.exclusivEnjoyDiscription}
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
      <GradientButton
        disabled={onPressActive}
        title={LanguageManager.applyNow}
        buttonStyle={styles.buttonView}
        onPress={onPressApplyNow}
      />
      <OndatoSdk
        ref={ondatoSdkRef}
        config={config}
        onStateUpdate={onStateUpdate}
      />
      {isLoading && <Loader />}
    </View>
  );
};

export default ApplyCardWelcomeScreen;
