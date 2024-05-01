import { IS_FROM_DAPP, SAVE_SWAP_ITEM } from "./types";

export const saveSwapItem = (item) => {
  console.log("item:::::",item);
    return {
      type: SAVE_SWAP_ITEM,
      payload: item,
    };
  };

  export const saveFromDapp = (item) => {
    console.log("item:::::",item);
      return {
        type: IS_FROM_DAPP,
        payload: item,
      };
    };
  