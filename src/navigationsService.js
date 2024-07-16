import {CommonActions, createNavigationContainerRef} from '@react-navigation/native';

let navigationRef;

const setNavigationReference = ref => {
  if (ref) {
    navigationRef = ref;
  }
};

const navigate = (name, params) => {
  if (navigationRef) {
    navigationRef.navigate(name, params);
  } else {
    console.error('Navigation reference is not set.');
  }
};

const goBack = () => {
  if (navigationRef) {
    navigationRef.goBack();
  } else {
    console.error('Navigation reference is not set.');
  }
};

const reset = (name, params = {}) => {
  if (navigationRef) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: name, params: params}],
      }),
    );
  } else {
    console.error('Navigation reference is not set.');
  }
};

const getCurrentRouteName = () => {
  if (navigationRef && navigationRef.getCurrentRoute()) {
    return navigationRef.getCurrentRoute().name;
  } else {
    console.error(
      'Navigation reference is not set or there is no current route.',
    );
    return null;
  }
};
export const navigation = createNavigationContainerRef();

export {setNavigationReference, navigate, goBack, reset, getCurrentRouteName};
