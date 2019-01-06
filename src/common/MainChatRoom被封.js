import React, { PureComponent } from 'react';

import {
    StyleSheet,
    View,
    Alert,
    Dimensions,
    Platform,
    NativeAppEventEmitter
} from 'react-native';

import IMUI from 'aurora-imui-react-native';
import { NimSession } from 'react-native-netease-im';

import NavigationHeader from "../navigator/NavigationHeader";

const InputView = IMUI.ChatInput;
const MessageListView = IMUI.MessageList;
const AuroraIController = IMUI.AuroraIMUIController;
const window = Dimensions.get('window');


let themsgid = 1;

/**
 * 消息对象
 */
function constructNormalMessage(data) {
    for (let i=0; i<data.length; i++){
        data[i].isOutgoing = true;
        data[i].fromUser.userId = data[i].fromUser._id;
        data[i].fromUser.displayName = data[i].fromUser.name;
        data[i].fromUser.avatarPath = data[i].fromUser.avatar;
        if(data[i].msgType==='tip') data[i].msgType = 'event';
        if(data[i].msgType==='image') data[i].mediaPath = data[i].extend.url;
    }
    return data
}

export default class MainChatRoom extends PureComponent {
    /**
     * 初始化数据
     * @param props
     */
    constructor(props) {
        super(props);
        let initHeight;
        if (Platform.OS === "ios") {
            initHeight = 46
        } else {
            initHeight = 100
        }
        this.state = {
            inputLayoutHeight: initHeight,
            messageListLayout: { flex: 1, width: window.width, margin: 0 },
            inputViewLayout: { width: window.width, height: initHeight},
        };
    }

    /**
     * 页面前挂载
     */
    componentDidMount() {
        const {navigation} = this.props;
        /**
         * Android only
         * Must set menu height once, the height should be equals with the soft keyboard height so that the widget won't flash.
         * 在别的界面计算一次软键盘的高度，然后初始化一次菜单栏高度，如果用户唤起了软键盘，则之后会自动计算高度。
         */
        if (Platform.OS === "android") {
            //设置软键盘的高度
            this.refs["ChatInput"].setMenuContainerHeight(250)
        }
        this.resetMenu();
        //为MessageListView界面操作添加监听
        AuroraIController.addMessageListDidLoadListener(() => this.getHistoryMessage(navigation));
    }

    /**
     * 初始化时渲染历史消息
     */
    getHistoryMessage(navigation) {
        let item = navigation.getParam('item');
        //初始化会话
        NimSession.startSession(item.contactId, item.sessionType);
        //会话第一屏信息
        NimSession.queryMessageListEx('', 20).then(
            data => {
                console.log('首次加载', data);
                AuroraIController.appendMessages(constructNormalMessage(data));
                AuroraIController.scrollToBottom(true);
            },
            err => {
                console.log(err)
            }
        );
        //监听新消息
        this.sessionListener = NativeAppEventEmitter.addListener(
            'observeReceiveMessage',
            data => {
                console.log('新消息通知', data);
                if (data && data.length > 0) {
                    AuroraIController.appendMessages(constructNormalMessage(data));
                    AuroraIController.scrollToBottom(true);
                }
            }
        );
        //监听信息发送状态变化
        this.msgStatusListener = NativeAppEventEmitter.addListener(
            'observeMsgStatus',
            data => {
                console.log('消息状态', data);
                if (data.length > 0) {
                    let newData = constructNormalMessage(data);
                    if (newData[0].status === 'send_sending') {
                        AuroraIController.appendMessages(newData);
                    } else {
                        newData.map( d => {
                            AuroraIController.updateMessage(d);
                        })
                    }
                    AuroraIController.scrollToBottom(true);
                }
            }
        );
        //监听消息撤回
        this.deleteMessageListener = NativeAppEventEmitter.addListener(
            'observeDeleteMessage',
            data => {
                console.log('消息撤回', data);
                AuroraIController.removeMessage(data.msgId);
            }
        )
    }

    /**
     * 输入组件尺寸变更时触发
     * @param size
     */
    onInputViewSizeChange = (size) => {
        if (this.state.inputLayoutHeight != size.height) {
            this.setState({
                inputLayoutHeight: size.height,
                inputViewLayout: { width: window.width, height: size.height },
                messageListLayout: { flex: 1, width: window.width, margin: 0 }
            })
        }
    };

    /**
     *页面卸载时取消监听
     */
    componentWillUnmount() {
        this.sessionListener && this.sessionListener.remove();
        this.msgStatusListener && this.msgStatusListener.remove();
        this.deleteMessageListener && this.deleteMessageListener.remove();
        AuroraIController.removeMessageListDidLoadListener(this.getHistoryMessage)
    }

    /**
     *重置菜单
     */
    resetMenu() {
        if (Platform.OS === "android") {
            this.refs["ChatInput"].showMenu(false);
            this.setState({
                messageListLayout: { flex: 1, width: window.width, margin: 0 },
            });
            this.forceUpdate();
        } else {
            //隐藏 inputView 的展开视图。
            AuroraIController.hidenFeatureView(true)
        }
    }

    /**
     * 点击输入框触发
     */
    onTouchEditText = () => {
        this.refs["ChatInput"].showMenu(false);
        AuroraIController.scrollToBottom(true);
    };

    /**
     * 摄像机全屏时触发
     */
    onFullScreen = () => {
        console.log("on full screen");
        this.setState({
            messageListLayout: { flex: 0, width: 0, height: 0 },
            inputViewLayout: { flex: 1, width: window.width, height: window.height },
        })
    };

    /**
     * 摄像机取消全屏的时触发
     */
    onRecoverScreen = () => {
        // this.setState({
        //   inputLayoutHeight: 100,
        //   messageListLayout: { flex: 1, width: window.width, margin: 0 },
        //   inputViewLayout: { flex: 0, width: window.width, height: 100 },
        // })
    };

    /**
     * 点击头像触发
     * @param message
     */
    onAvatarClick = (message) => {
        Alert.alert(JSON.stringify(message));
        //根据消息 id 删除消息
        AuroraIController.removeMessage(message.msgId)
    };

    /**
     * 点击消息气泡
     * @param message
     */
    onMsgClick(message) {
        console.log(message);
        Alert.alert("message", JSON.stringify(message));
    };

    /**
     * 长按消息
     * @param message
     */
    onMsgLongClick = (message) => {
        Alert.alert('message bubble on long press', 'message bubble on long press');
    };

    /**
     * 点击消息状态按钮触发
     * @param message
     */
    onStatusViewClick = (message) => {
        message.status = 'send_succeed';
        //更新消息
        AuroraIController.updateMessage(message);
    };

    /**
     * 开始滑动消息列表的时候触发
     */
    onBeginDragMessageList = () => {
        this.resetMenu();
        //隐藏 inputView 的展开视图
        AuroraIController.hidenFeatureView(true)
    };

    /**
     * 点击消息列表触发
     */
    onTouchMsgList = () => {
        //隐藏 inputView 的展开视图
        AuroraIController.hidenFeatureView(true)
    };

    /**
     * 加载更多数据
     */
    onPullToRefresh = () => {
        console.log("on pull to refresh");
        let messages = [];
        for (let i = 0; i < 14; i++) {
            var message = constructNormalMessage();
            message.msgType = "text";
            message.text = "" + i;
            if (i % 3 == 0) {
                message.msgType = "video";
                message.text = "" + i;
                message.mediaPath = "/storage/emulated/0/ScreenRecorder/screenrecorder.20180323101705.mp4";
                message.duration = 12;
            }
            messages.push(message)
        }
        //将消息列表插入到聊天列表顶部
        AuroraIController.insertMessagesToTop(messages);
        if (Platform.OS === 'android') {
            //刷新
            this.refs["MessageList"].refreshComplete()
        }
    };

    /**
     * 发送文字
     * @param text
     */
    onSendText = (text) => {
        let message = constructNormalMessage();
        message.msgType = 'text';
        message.text = text;

        AuroraIController.appendMessages([message])
    };

    /**
     * 发送图片
     * @param media
     */
    onTakePicture = (media) => {
        console.log("media " + JSON.stringify(media));
        let message = constructNormalMessage();
        message.msgType = 'image';
        message.mediaPath = media.mediaPath;
        AuroraIController.appendMessages([message]);
        this.resetMenu();
        AuroraIController.scrollToBottom(true)
    };

    /**
     * 点击录音
     * @param e
     */
    onStartRecordVoice = (e) => {
        console.log("on start record voice")
    };

    /**
     * 录音完成
     * @param mediaPath
     * @param duration
     */
    onFinishRecordVoice = (mediaPath, duration) => {
        let message = constructNormalMessage();
        message.msgType = "voice";
        message.mediaPath = mediaPath;
        message.timeString = "safsdfa";
        message.duration = duration;
        AuroraIController.appendMessages([message]);
        console.log("on finish record voice")
    };

    /**
     * 取消录音
     */
    onCancelRecordVoice = () => {
        console.log("on cancel record voice")
    };

    /**
     * 录视屏
     */
    onStartRecordVideo = () => {
        console.log("on start record video")
    };

    /**
     * 完成录制视频
     * @param video
     */
    onFinishRecordVideo = (video) => {
        // var message = constructNormalMessage()

        // message.msgType = "video"
        // message.mediaPath = video.mediaPath
        // message.duration = video.duration
        // AuroraIController.appendMessages([message])
    };

    /**
     * 选中视频或图片后点击发送按钮触发
     * @param mediaFiles
     */
    onSendGalleryFiles = (mediaFiles) => {
        /**
         * WARN: This callback will return original image,
         * if insert it directly will high memory usage and blocking UI。
         * You should crop the picture before insert to messageList。
         *
         * WARN: 这里返回的是原图，直接插入大会话列表会很大且耗内存.
         * 应该做裁剪操作后再插入到 messageListView 中，
         * 一般的 IM SDK 会提供裁剪操作，或者开发者手动进行裁剪。
         *
         * 代码用例不做裁剪操作。
         */
        Alert.alert('fas', JSON.stringify(mediaFiles));
        for (index in mediaFiles) {
            let message = constructNormalMessage();
            if (mediaFiles[index].mediaType == "image") {
                message.msgType = "image";
            } else {
                message.msgType = "video";
                message.duration = mediaFiles[index].duration;
            }

            message.mediaPath = mediaFiles[index].mediaPath;
            message.timeString = "8:00";
            message.status = "send_going";
            AuroraIController.appendMessages([message]);
            AuroraIController.scrollToBottom(true)
        }

        this.resetMenu()
    };

    /**
     * 点击麦克风按钮触发
     */
    onSwitchToMicrophoneMode = () => {
        AuroraIController.scrollToBottom(true)
    };

    /**
     *点击菜单栏表情按钮
     */
    onSwitchToEmojiMode = () => {
        AuroraIController.scrollToBottom(true)
    };

    /**
     * 点击图片按钮触发
     */
    onSwitchToGalleryMode = () => {
        AuroraIController.scrollToBottom(true)
    };

    /**
     * 点击拍照按钮触发
     */
    onSwitchToCameraMode = () => {
        AuroraIController.scrollToBottom(true)
    };

    /**
     * 键盘显示时触发
     * @param keyboard_height
     */
    onShowKeyboard = (keyboard_height) => {
    };

    /**
     * 点击选择相册按钮触发
     */
    onClickSelectAlbum = () => {
        console.log("on click select album")
    };

    /**
     * 关闭相机是触发
     */
    onCloseCamera = () => {
        console.log("On close camera event");
        this.setState({
            inputLayoutHeight: 100,
            messageListLayout: { flex: 1, width: window.width, margin: 0 },
            inputViewLayout: { flex: 0, width: window.width, height: 100 },
        })
    };

    /**
     * 切换相机模式
     */
    switchCameraMode = (isRecordVideoMode) => {
        console.log("Switching camera mode: isRecordVideoMode: " + isRecordVideoMode);
        // If record video mode, then set to full screen.
        if (isRecordVideoMode) {
            this.setState({
                messageListLayout: { flex: 0, width: 0, height: 0 },
                inputViewLayout: { flex: 1, width: window.width, height: window.height },
            })
        }
    };

    render() {
        let {navigation} = this.props;
        let item = navigation.getParam('item');
        return (
            <View style={styles.container}>
                <NavigationHeader
                    right={(item.sessionType==='1') && 'groupInfo'}
                    back={navigation}
                    title={item.name}
                />
                <MessageListView style={this.state.messageListLayout}
                                 ref="MessageList"
                                 isAllowPullToRefresh={true}
                                 onAvatarClick={this.onAvatarClick}
                                 onMsgClick={this.onMsgClick}
                                 onMsgLongClick={this.onMsgLongClick}
                                 onStatusViewClick={this.onStatusViewClick}
                                 onTouchMsgList={this.onTouchMsgList}
                                 onBeginDragMessageList={this.onBeginDragMessageList}
                                 onPullToRefresh={this.onPullToRefresh}
                                 avatarSize={{ width: 50, height: 50 }}
                                 avatarCornerRadius={25}
                                 messageListBackgroundColor={"#f3f3f3"}
                                 sendBubbleTextSize={18}
                                 sendBubbleTextColor={"#000000"}
                                 sendBubblePadding={{ left: 10, top: 10, right: 15, bottom: 10 }}
                                 datePadding={{ left: 5, top: 5, right: 5, bottom: 5 }}
                                 dateBackgroundColor={"#dddddd"}
                                 photoMessageRadius={5}
                                 maxBubbleWidth={0.7}
                                 videoDurationTextColor={"#ffffff"}
                />
                <InputView style={this.state.inputViewLayout}
                           ref="ChatInput"
                           onSendText={this.onSendText}
                           onTakePicture={this.onTakePicture}
                           onStartRecordVoice={this.onStartRecordVoice}
                           onFinishRecordVoice={this.onFinishRecordVoice}
                           onCancelRecordVoice={this.onCancelRecordVoice}
                           onStartRecordVideo={this.onStartRecordVideo}
                           onFinishRecordVideo={this.onFinishRecordVideo}
                           onSendGalleryFiles={this.onSendGalleryFiles}
                           onSwitchToEmojiMode={this.onSwitchToEmojiMode}
                           onSwitchToMicrophoneMode={this.onSwitchToMicrophoneMode}
                           onSwitchToGalleryMode={this.onSwitchToGalleryMode}
                           onSwitchToCameraMode={this.onSwitchToCameraMode}
                           onShowKeyboard={this.onShowKeyboard}
                           onTouchEditText={this.onTouchEditText}
                           onFullScreen={this.onFullScreen}
                           onRecoverScreen={this.onRecoverScreen}
                           onSizeChange={this.onInputViewSizeChange}
                           closeCamera={this.onCloseCamera}
                           switchCameraMode={this.switchCameraMode}
                           showSelectAlbumBtn={true}
                           showRecordVideoBtn={true}
                           onClickSelectAlbum={this.onClickSelectAlbum}
                           inputPadding={{ left: 5, top: 0, right: 5, bottom: 0 }}
                           galleryScale={0.6}//default = 0.5
                           compressionQuality={0.6}
                           customLayoutItems={{
                               // left: ['voice','gallery','camera'],
                               right: ['send'],
                               bottom: ['voice','gallery','camera','emoji']
                           }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    }
});
