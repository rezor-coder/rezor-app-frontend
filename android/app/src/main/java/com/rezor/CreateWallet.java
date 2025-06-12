package com.rezor;

import static android.content.ContentValues.TAG;

import android.os.Environment;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import org.bitcoinj.core.DumpedPrivateKey;
import org.bitcoinj.core.SegwitAddress;
import org.bitcoinj.crypto.DeterministicKey;
import org.bitcoinj.crypto.HDUtils;
import org.bitcoinj.params.MainNetParams;
import org.bitcoinj.wallet.DeterministicKeyChain;
import org.bitcoinj.wallet.DeterministicSeed;
import org.json.JSONException;
import org.json.JSONObject;
import org.web3j.crypto.Bip39Wallet;
import org.web3j.crypto.CipherException;
import org.web3j.crypto.Credentials;
import org.web3j.crypto.WalletUtils;

import java.io.File;
import java.io.IOException;
import java.util.List;

public class CreateWallet extends ReactContextBaseJavaModule {
    CreateWallet(ReactApplicationContext context) {
        super(context);
    }

    @NonNull
    @Override
    public String getName() {
        return "CreateWallet";
    }

    @ReactMethod
    public void generateMnemonics(Callback callback) throws CipherException, IOException {
        Log.d("CreateWallet", "Create event called with name: " );

        String packageName = "com.rezor";
        String path = Environment.getDataDirectory().toString() + "/data/" + packageName + "/ACW/";

        writeFile(path);

        Bip39Wallet wallet = WalletUtils.generateBip39Wallet("", new File(path));
        String mnemonics = wallet.getMnemonic();
     JSONObject addresses =  generateAdressFromMnemonics(mnemonics);
        callback.invoke(addresses.toString());

    }

    @ReactMethod
    public void generateAddressFromMnemonics(String mnemonics, Callback callback) throws CipherException, IOException {
        String packageName = "com.rezor";
        JSONObject addresses =  generateAdressFromMnemonics(mnemonics);
        Log.d("CreateWallet", addresses.toString() );
        callback.invoke(addresses.toString());
    }


    public JSONObject generateAdressFromMnemonics(String mnemonics) throws CipherException, IOException {
        long creationTimeSeconds = System.currentTimeMillis() / 1000;
        try {
            DeterministicSeed seed = new DeterministicSeed(mnemonics, null, "", creationTimeSeconds);
            DeterministicKeyChain chain = DeterministicKeyChain.builder().seed(seed).build();

            List keyPathB = HDUtils.parsePath("M/84H/0H/0H/0/0");
            DeterministicKey keyB = chain.getKeyByPath(keyPathB, true);
            DumpedPrivateKey privKeyB = keyB.getPrivateKeyEncoded(MainNetParams.get());
            String btc_address = SegwitAddress.fromKey(MainNetParams.get(), keyB).toString();
            String privateKeyb58 = privKeyB.toBase58();

            final JSONObject objectBTC = new JSONObject();
            try {
                // With put you can add a name/value pair to the JSONObject
                objectBTC.put("address", btc_address);
                objectBTC.put("pvtKey", privateKeyb58);
                // Calling toString() on the JSONObject returns the JSON in string format.
            } catch (JSONException e) {
                Log.e(TAG, "Failed to create JSONObject", e);
            }


            List keyPathETH = HDUtils.parsePath("M/44H/60H/0H/0/0");
            DeterministicKey key = chain.getKeyByPath(keyPathETH, true);
            String ethprivKey = key.getPrivKey().toString(16);
            Credentials credentials = Credentials.create(ethprivKey);
            String coin_address = credentials.getAddress();

            final JSONObject objectEth = new JSONObject();
            try {
                // With put you can add a name/value pair to the JSONObject
                objectEth.put("address", coin_address);
                objectEth.put("pvtKey", "0x"+ethprivKey);
                // Calling toString() on the JSONObject returns the JSON in string format.
            } catch (JSONException e) {
                Log.e(TAG, "Failed to create JSONObject", e);
            }

            final JSONObject addresses = new JSONObject();
            try {
                // With put you can add a name/value pair to the JSONObject
                addresses.put("eth", objectEth);
                addresses.put("btc", objectBTC);
                addresses.put("mnemonics", mnemonics);

                // Calling toString() on the JSONObject returns the JSON in string format.
            } catch (JSONException e) {
                Log.e(TAG, "Failed to create JSONObject", e);
            }

            return addresses;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
    public void writeFile(String PATH){
        File directory = new File(PATH);
        if (! directory.exists()) {
            directory.mkdir();
            // If you require it to make the entire directory path including parents,
            // use directory.mkdirs(); here instead.
        }
    }
}

