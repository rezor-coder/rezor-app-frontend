package com.saitapro;
import android.app.Activity;
import android.util.Log;
import android.view.WindowManager;

import androidx.annotation.NonNull;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.File;

public class RootModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;
    private Activity activity;
    RootModule(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
    }
    @NonNull
    @Override
    public String getName() {
        return "RootModule";
    }
    @ReactMethod
    public void rootStatus(Promise promise) {
        Process process = null;
        try {
            process = Runtime.getRuntime().exec("su");
            promise.resolve("It is rooted device");
        } catch (Exception e) {
            String msg = e.getMessage();
            Boolean is_frida = msg.contains("fakecommand");
            if (!is_frida) {
                promise.resolve("It is not rooted device");
            } else {
                promise.resolve("It is rooted device");
            }
        } finally {
            if (process != null) {
                try {
                    process.destroy();
                } catch (Exception e) {
                }
            }
        }
    }
    @ReactMethod
    public void preventScreenshot(boolean _enable) {
        if (this.reactContext.hasCurrentActivity()) {
            if (_enable) {
                this.reactContext.getCurrentActivity().runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        reactContext.getCurrentActivity().getWindow().setFlags(WindowManager.LayoutParams.FLAG_SECURE, WindowManager.LayoutParams.FLAG_SECURE);
                    }
                });
            } else {
                this.reactContext.getCurrentActivity().runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        reactContext.getCurrentActivity().getWindow().clearFlags(WindowManager.LayoutParams.FLAG_SECURE);
                    }
                });
            }
        }
    }
    @ReactMethod
    public void clearApplicationData() {
        File cache = getCurrentActivity().getCacheDir();
        File appDir = new File(cache.getParent());
        if (appDir.exists()) {
            String[] children = appDir.list();
            Log.e("Listtttttt", appDir.list().toString());
            for (String s : children) {
                if (!s.equals("lib") && s.equals("shared_prefs")) {
                    deleteDir(new File(appDir, s));
                }
            }
        }
    }
    public static boolean deleteDir(File dir) {
        if (dir != null && dir.isDirectory()) {
            String[] children = dir.list();
            for (int i = 0; i < children.length; i++) {
                boolean success = deleteDir(new File(dir, children[i]));
                if (!success) {
                    return false;
                }
            }
        }

        return dir.delete();
    }
}
