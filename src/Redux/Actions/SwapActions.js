import {IS_FROM_DAPP, SAVE_SWAP_ITEM} from './types';

export const saveSwapItem = item => {
  return {
    type: SAVE_SWAP_ITEM,
    payload: item,
  };
};

export const saveFromDapp = item => {
  return {
    type: IS_FROM_DAPP,
    payload: item,
  };
};
