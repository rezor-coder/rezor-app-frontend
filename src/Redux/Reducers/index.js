import {combineReducers} from 'redux';
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

export default rootReducer = (state, action) => {
  if (action.type === LOGOUT) {
    state = undefined;
  }
  return appReducer(state, action);
};
