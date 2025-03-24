import {applyMiddleware, combineReducers, createStore} from 'redux';
import {LOGOUT} from '../Actions/types';
import MnemonicCreateReducer from './MnemonicCreateReducer';
import CreateWalletReducer from './CreateWalletReducer';
import WalletReducer from './WalletReducer';
import BnbReducer from './BnbReducer';
import AddTokenReducer from './AddTokenReducer';
import MultiWalletCreateWalletReducer from './MultiWalletCreateWalletReducer';
import WalletConnectReducer from './WalletConnectReducer';
import SwapReducer from './SwapReducer';
import SaitaCardReducer from './SaitaCardReducer'
// import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import AsyncStorage from '@react-native-async-storage/async-storage';
import persistReducer from 'redux-persist/es/persistReducer';
import persistStore from 'redux-persist/es/persistStore';
import ReduxThunk from 'redux-thunk';

const appReducer = combineReducers({
  mnemonicreateReducer: MnemonicCreateReducer,
  createWalletReducer: CreateWalletReducer,
  walletReducer: WalletReducer,
  BnbReducer: BnbReducer,
  AddTokenReducer: AddTokenReducer,
  MultiWalletCreateWalletReducer: MultiWalletCreateWalletReducer,
  walletConnectReducer:WalletConnectReducer,
  swapReducer:SwapReducer,
  saitaCardReducer:SaitaCardReducer
});
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['walletReducer'],
}

export const rootReducer = (state, action) => {
  if (action.type === LOGOUT) {
    state = undefined;
  }
  return appReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer)
export  const store = createStore(persistedReducer,  {}, applyMiddleware(ReduxThunk))
export  const persistor = persistStore(store)