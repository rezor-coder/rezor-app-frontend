
import * as constants from './Constant';

// const { HDNode, providers, utils, Wallet } = ethers;
import { entropyToMnemonic } from 'ethers/lib/utils';
import { utils, Wallet, providers } from 'ethers';

//const network = (process.env.NODE_ENV === 'production') ? 'mainnet' : 'rinkeby';
const network = constants.network;
// let network = (process.env.NODE_ENV === 'production') ?
//     { name: 'mainnet', ensAddress: '0x314159265dd8dbb310642f98f50c066173c1259b', chainId: 1 } :
//     { name: 'rinkeby', ensAddress: '0xe7410170f87102df0055eb195163a03b7f2bff4a', chainId: 4 };

const PROVIDER = providers.getDefaultProvider(network);

export function generateMnemonics() {
    return entropyToMnemonic(utils.randomBytes(16)).split(' ');
}

export function loadWalletFromMnemonics(mnemonics) {
    // Singleton.showAlert(mnemonics)
    if (!(mnemonics instanceof Array) && typeof mnemonics !== 'string')
        throw new Error('invalid mnemonic');
    else if (mnemonics instanceof Array)
        mnemonics = mnemonics.join(' ');

    const wallet = Wallet.fromMnemonic(mnemonics);
    wallet.provider = PROVIDER;
    return wallet;
}

export function loadWalletFromPrivateKey(pk) {
    try {
        // pk = '0x8dec19723176b11a175927efdd70107ccede5053db1280e89f0d80afbd114fe1'
        //console.warn('MM',pk)
        //console.warn('MM',pk.indexOf('0x'))
        if (pk.indexOf('0x') !== 0) pk = `0x${pk}`;
        //console.warn('MM',"internal pk " + pk)
        return new Wallet(pk, PROVIDER);
    } catch (e) {
        //console.warn('MM',e)
        throw new Error('invalid private key');
    }
}

export function formatBalance(balance) {
    return utils.formatEther(balance);
}

export function reduceBigNumbers(items) {
    if (!(items instanceof Array)) throw new Error('The input is not an Array');
    return items.reduce((prev, next) => prev.add(next), utils.bigNumberify('0'));
}

export function calculateFee({ gasUsed, gasPrice }) {
    return gasUsed * Number(formatBalance(gasPrice));
}

export function estimateFee({ gasLimit, gasPrice }) {
    return utils.bigNumberify(String(gasLimit)).mul(String(gasPrice));
}
