// /**
//  * @format
//  */
// //  import "@ethersproject/shims"
// import './shim';
// import '@walletconnect/react-native-compat'
//  import 'react-native-get-random-values'
// import 'react-native-gesture-handler'
// import '@react-native-anywhere/polyfill-base64'
// import 'polyfill-object.fromentries'
// import { AppRegistry, LogBox, Text, TextInput } from 'react-native';
// import App from './src/App';
// import messaging from '@react-native-firebase/messaging'
// import crypto from 'crypto'
// global.crypto = crypto
// import { name as appName } from './app.json';
// import * as Sentry from "@sentry/react-native";
// import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
// if (typeof global.globalThis === 'undefined') {
//   global.globalThis = Function('return this')();
// }
// const TextEncodingPolyfill = require('text-encoding');
// Object.assign(global, {
//   TextEncoder: TextEncodingPolyfill.TextEncoder,
//   TextDecoder: TextEncodingPolyfill.TextDecoder,
// });
// if (Text.defaultProps == null) {
//   Text.defaultProps = {};
//   Text.defaultProps.allowFontScaling = false;
// }

// if (TextInput.defaultProps == null) {
//   TextInput.defaultProps = {};
//   TextInput.defaultProps.allowFontScaling = false;
// }

// console.disableYellowBox = true

// AppRegistry.registerComponent(appName, () => Sentry.wrap(gestureHandlerRootHOC(App)));

/**
 * @format
 */
//  import "@ethersproject/shims"
import React from 'react';
import './shim';
import '@walletconnect/react-native-compat';
import 'react-native-get-random-values';
import 'react-native-gesture-handler';
import '@react-native-anywhere/polyfill-base64';
import 'polyfill-object.fromentries';
import {AppRegistry, LogBox, Text, TextInput} from 'react-native';
import App from './src/App'; // Your main App component
import messaging from '@react-native-firebase/messaging';
import crypto from 'crypto';
global.crypto = crypto;
import {name as appName} from './app.json';
import * as Sentry from '@sentry/react-native';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import {Provider} from 'react-redux';

import {PersistGate} from 'redux-persist/integration/react';
import {store, persistor} from './src/Redux/Reducers'; // Adjust path if necessary
// --- END NEW IMPORTS ---

if (typeof global.globalThis === 'undefined') {
  global.globalThis = Function('return this')();
}
const TextEncodingPolyfill = require('text-encoding');
Object.assign(global, {
  TextEncoder: TextEncodingPolyfill.TextEncoder,
  TextDecoder: TextEncodingPolyfill.TextDecoder,
});
if (Text.defaultProps == null) {
  Text.defaultProps = {};
  Text.defaultProps.allowFontScaling = false;
}

if (TextInput.defaultProps == null) {
  TextInput.defaultProps = {};
  TextInput.defaultProps.allowFontScaling = false;
}

console.disableYellowBox = true;

// --- MODIFIED APP REGISTRY ---
const Root = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      {/* Sentry.wrap and gestureHandlerRootHOC should wrap the App component directly */}
      {Sentry.wrap(gestureHandlerRootHOC(App))()}
    </PersistGate>
  </Provider>
);

AppRegistry.registerComponent(appName, () => Root);
// --- END MODIFIED APP REGISTRY ---
