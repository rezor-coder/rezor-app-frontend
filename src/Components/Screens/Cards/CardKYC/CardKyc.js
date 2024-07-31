import { useFocusEffect } from '@react-navigation/native'
import { OndatoSdk } from 'ondato-sdk-react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { LanguageManager, ThemeManager } from '../../../../../ThemeManager'
import { NavigationStrings } from '../../../../Navigation/NavigationStrings'
import { goBack, navigate } from '../../../../navigationsService'
import { finishKYC } from '../../../../Redux/Actions'
import Singleton from '../../../../Singleton'
import colors from '../../../../theme/Colors'
import { BorderLine, SimpleHeader } from '../../../common'
import WrapperContainer from '../../../common/WrapperContainer'
import Loader from '../../Loader/Loader'
import { BackHandler } from 'react-native'

const CardKyc = (props) => {
  const dispatch = useDispatch()
  const ondatoSdkRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);

  const backAction = () => {
    return true;
  };
  const onStateUpdate = useCallback((state) => {
    console.log("state::::::", state);
    if (state.status == 'Cancelled') {
      ondatoSdkRef.current?.close()
        navigate(NavigationStrings.SaitaCardDashBoard)
    }
    if (state.status == 'Failed') {
      ondatoSdkRef.current?.close()
      navigate(NavigationStrings.SaitaCardDashBoard);
    }
    else if (state.status == 'Succeeded') {
      ondatoSdkRef.current?.close()
      finaliseKyc()
    }
  }, []);
  const finaliseKyc = () => {
    setIsLoading(true)
    let data = {
      "identificationId": props.route.params.id,
    }
    dispatch(finishKYC({ data })).then(res => {
      setIsLoading(false)
      console.log("finishKyc:::::res", res);
      navigate(NavigationStrings.SaitaCardDashBoard);
    }).catch(err => {
      setIsLoading(false)
      Singleton.getInstance().showAlert(err)
      console.log("finishKyc:::::err", err);
    })
  }
  useFocusEffect(useCallback(() => {
    console.log(" props.route.params.id:::::::", props.route.params.id);
    Singleton.isCameraOpen = true;
    setTimeout(() => {
      ondatoSdkRef.current?.open()
    }, 500);
  }, []))
  return (
    <WrapperContainer>
      <SimpleHeader
      title={LanguageManager.userKYC}
        backImage={ThemeManager.ImageIcons.iconBack}
        titleStyle
        imageShow
        back={false}
        backPressed={() => {
          navigate(NavigationStrings.SaitaCardDashBoard);
        }}
      />
      <BorderLine
        borderColor={{ backgroundColor: ThemeManager.colors.viewBorderColor }}
      />
      <OndatoSdk
        ref={ondatoSdkRef}
        config={{
          mode: 'live',
          identityVerificationId: props.route.params.id,
          language: 'en',
          showSplashScreen: true,
          showStartScreen: true,
          showIdentificationWaitingScreen: true,
          showSelfieFrame: true,
          skipRegistrationIfDriverLicense: true,
          showSuccessWindow: true,
          simpleCustomization: {
            primaryColor: colors.buttonColor1,
            textColor: colors.black,
            buttonTextColor: colors.white,
          },


        }}
        onStateUpdate={onStateUpdate}
      />
      {/* ********************************************************Loader******************************************************* */}
      {isLoading == true && <Loader isLoading={isLoading} />}
    </WrapperContainer>
  );
}

export default CardKyc