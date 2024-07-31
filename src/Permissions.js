// permissions.js

import { Alert, Platform } from 'react-native';
import {
    check,
    request,
    PERMISSIONS,
    RESULTS,
    openSettings,
} from 'react-native-permissions';
import Singleton from './Singleton';
import * as Constants from './Constant';

export const checkCameraPermission = async () => {
    const permission = Platform.select({
        ios: PERMISSIONS.IOS.CAMERA,
        android: PERMISSIONS.ANDROID.CAMERA,
    });

    try {
        const result = await check(permission);

        switch (result) {
            case RESULTS.UNAVAILABLE:
                console.log('This Camera feature is not available (on this device / in this context)');
                return false;
            case RESULTS.DENIED:
                console.log('The Camera permission has not been requested / is denied but requestable');
                return false;
            case RESULTS.LIMITED:
                console.log('The Camera permission is limited: some actions are possible');
                return false;
            case RESULTS.GRANTED:
                console.log('The permission is granted');
                return true;
            case RESULTS.BLOCKED:
                console.log('The Camera  permission is denied and not requestable anymore');
                return false;
            default:
                return false;
        }
    } catch (error) {
        Singleton.showAlert(error);
        return false;
    }
};

export const requestCameraPermission = async () => {
    const permission = Platform.select({
        ios: PERMISSIONS.IOS.CAMERA,
        android: PERMISSIONS.ANDROID.CAMERA,
    });

    try {
        const result = await request(permission);

        switch (result) {
            case RESULTS.UNAVAILABLE:
                console.log('This Camera feature is not available (on this device / in this context)');
                return false;;
            case RESULTS.DENIED:
                Alert.alert(Constants.APP_NAME, 'For this feature, camera permission is required. The camera permission has been denied and cannot be requested again. Please enable it manually.', [
                    {
                      text: 'Cancel',
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel',
                    },
                    {text: 'OK', onPress: () => openSettings()},
                  ]);
                return false;;
            case RESULTS.LIMITED:
                console.log('The Camera permission is limited: some actions are possible');
                return false;;
            case RESULTS.GRANTED:
                console.log('The permission is granted');
                return true;;
            case RESULTS.BLOCKED:
                Alert.alert(Constants.APP_NAME, 'For this feature, camera permission is required. The camera permission has been denied and cannot be requested again. Please enable it manually.', [
                    {
                      text: 'Cancel',
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel',
                    },
                    {text: 'OK', onPress: () => openSettings()},
                  ]);
                return false;;
            default:
                return false;;
        }
    } catch (error) {
        Singleton.showAlert(error);
        return false;
    }
};
