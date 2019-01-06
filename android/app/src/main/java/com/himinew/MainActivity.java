package com.himinew;

import android.content.Intent;
import android.os.Bundle;

import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen;

import com.netease.im.uikit.permission.MPermission;
import com.netease.im.RNNeteaseImModule;
import com.netease.im.ReceiverMsgParser;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "HimiNew";
    }
    /**
     * 重写返回退出事件
     */
   @Override
    public void invokeDefaultOnBackPressed() {
        moveTaskToBack(false);
    }
    /**
     * 第一次安装打开不用重启
     */
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this,true);
        super.onCreate(savedInstanceState);
        if(ReceiverMsgParser.checkOpen(getIntent())){//在后台时处理点击推送消息
             RNNeteaseImModule.launch = getIntent();
         }
        if((getIntent().getFlags() & Intent.FLAG_ACTIVITY_BROUGHT_TO_FRONT) != 0){
            finish();
            return;
        }
    }
}
