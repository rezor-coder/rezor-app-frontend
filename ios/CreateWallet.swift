//
//  CreateWallet.swift
//  WalletNativeDemo
//
//  Created by user on 02/03/23.
//

import UIKit
import HDWalletKit
import CryptoSwift
import React
import HDWalletKitBTC
import Foundation

@objc(CreateWallet)
class CreateWallet: NSObject {

  @objc(generateMnemonics:)
 func generateMnemonics(_ callback: RCTResponseSenderBlock) {
   // Date is ready to use!
   let mnemonics = Mnemonic.create()
   let seed = Mnemonic.createSeed(mnemonic:mnemonics)
   let ethObj = generateAddress(seed: seed, coin: .ethereum)
   let btcObj = generateBip84Address(seed: seed, network: .main)
//   let ltcObj = generateBip84Address(seed: seed, network: .ltc)
//   let bchObj = generateBip84Address(seed: seed, network: .bch)
//   let dogeObj = generateDogeAddress(seed: seed, network: .doge, coin: .dogecoin)


   var obj = [String: Any]()
   obj["mnemonics"] =  mnemonics
   obj["eth"] = ethObj
   obj["btc"] = btcObj
//   obj["ltc"] = ltcObj
//   obj["bch"] = bchObj
//   obj["doge"] = dogeObj
   callback([String(data: try! JSONSerialization.data(withJSONObject: obj, options: .prettyPrinted), encoding: .utf8)!])
 }
  
  @objc(generateAddressFromMnemonics:callback:)
  func generateAddressFromMnemonics(menmonicsString:String, callback: RCTResponseSenderBlock) {
    print("fdsfds")
    let seed = Mnemonic.createSeed(mnemonic:menmonicsString)
    
    let ethObj = generateAddress(seed: seed, coin: .ethereum)
    let btcObj = generateBip84Address(seed: seed, network: .main)
//    let ltcObj = generateBip84Address(seed: seed, network: .ltc)
//    let bchObj = generateBip84Address(seed: seed, network: .bch)
//

    var obj = [String: [String: String]]()
    obj["eth"] = ethObj
    obj["btc"] = btcObj
//    obj["ltc"] = ltcObj
//    obj["bch"] = bchObj
//    obj["doge"] = dogeObj
    callback([String(data: try! JSONSerialization.data(withJSONObject: obj, options: .prettyPrinted), encoding: .utf8)!])
  }
  
  func generateBip84Address(seed: Data, network: Network)-> [String: String]{
    let wallet = WalletBTC(seed: seed, network: network)
    let masterPrivateKey = wallet.privateKey
    let purpose = masterPrivateKey.derived(at: 84, hardens: true)
    let coinType = purpose.derived(at: network.coinType, hardens: true)
    let account = coinType.derived(at: 0, hardens: true)
    let change = account.derived(at: 0)
    let firstPrivateKey = change.derived(at: 0)
    let pvtKey = firstPrivateKey.wifiCompressed()
    let publicAddress = wallet.generateAddressBIP84(at: 0)
    
    var obj = [String: String]()
    obj["address"] = publicAddress
    obj["pvtKey"] = pvtKey
    return obj
  }
  
 
 
  func generateAddress(seed: Data, coin: Coin) -> [String: String]{
    let wallet = Wallet(seed: seed, coin: coin)
    let account = wallet.generateAccount()
    let publicAddress = account.address
    let pvtKey = account.rawPrivateKey
    var obj = [String: String]()
    obj["address"] = publicAddress
    obj["pvtKey"] = coin == .ethereum ? "0x"+pvtKey : pvtKey
    return obj
  }

}
