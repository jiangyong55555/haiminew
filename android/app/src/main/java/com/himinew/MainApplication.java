package com.himinew;

import android.app.Application;

import com.facebook.react.ReactApplication;
import cn.jiguang.imui.messagelist.ReactIMUIPackage;
import com.netease.im.RNNeteaseImPackage;
import com.netease.im.IMApplication;
import com.horcrux.svg.SvgPackage;
import org.reactnative.camera.RNCameraPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.react.rnspinkit.RNSpinkitPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.rnfs.RNFSPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.remobile.qrcodeLocalImage.RCTQRCodeLocalImagePackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
            new RNNeteaseImPackage(),
            new MainReactPackage(),
            new ReactIMUIPackage(),
            new SvgPackage(),
            new RNCameraPackage(),
            new PickerPackage(),
            new RNSpinkitPackage(),
            new SplashScreenReactPackage(),
            new RNGestureHandlerPackage(),
            new RNFSPackage(),
            new VectorIconsPackage(),
            new RCTQRCodeLocalImagePackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    //初始化方法appId以及appKey在小米开放平台获取，小米推送证书名称在网易云信后台设置
    //new IMApplication.MiPushConfig("小米推送证书名称","小米推送appId","小米推送的appKey")
    IMApplication.init(this, MainActivity.class,R.drawable.ic_stat_notify_msg,null);
    SoLoader.init(this, /* native exopackage */ false);
  }
}
