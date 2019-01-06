import React, { PureComponent } from 'react';
import {
    Clipboard,
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    NativeAppEventEmitter,
    NativeModules,
    Animated,
} from "react-native";

import NavigationHeader from "../navigator/NavigationHeader";
import Toast from 'react-native-root-toast';
import { NimFriend, NimSession } from 'react-native-netease-im';
import ImagePicker from 'react-native-image-crop-picker';
import { MessageList, ChatInput } from 'react-native-imui';
import Svgs from '../util/Svgs';

const ContainerHeightMax = 800;
const ChatInputHeightBg = '#ffffff';
const { width } = Dimensions.get('window');
const sWidth = width - 55 * 4;

const { AuroraIMUIModule } = NativeModules;
const AnimatedImplementation = require('react-native/Libraries/Animated/src/AnimatedImplementation');

const MessageListView = AnimatedImplementation.createAnimatedComponent(MessageList);
const InputView = AnimatedImplementation.createAnimatedComponent(ChatInput);

export default class MainChatRoom extends PureComponent {

    /**
     * 初始化数据
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
            menuContainerHeight: ContainerHeightMax,
            //输入框样式
            chatInputStyle: {
                backgroundColor: ChatInputHeightBg,
                width,
            },
            //输入框高度
            chatInputheight: new Animated.Value(48),
            isDismissMenuContainer: false,
            initList: [],
        };
        this._loadMoreContentAsync = this._loadMoreContentAsync.bind(this);
        this.onSend = this.onSend.bind(this);
    }

    /**
     * 初始化信息以及绑定消息监听
     */
    componentDidMount() {
        let {navigation} = this.props;
        const session = navigation.getParam('item');
        //初始化会话
        NimSession.startSession(session.contactId, session.sessionType);
        //监听新消息通知
        this.sessionListener = NativeAppEventEmitter.addListener(
            'observeReceiveMessage',
            data => {
                if (data && data.length > 0) {
                    AuroraIMUIModule.appendMessages(data);
                    AuroraIMUIModule.scrollToBottom();
                }
            }
        );
        //监听消息状态
        this.msgStatusListener = NativeAppEventEmitter.addListener(
            'observeMsgStatus',
            data => {
                if (data.length > 0) {
                    if (data[0].status === 'send_sending') {
                        AuroraIMUIModule.appendMessages(data)
                    } else {
                        data.map(d => {
                            AuroraIMUIModule.updateMessage(d)
                        })
                    }
                    AuroraIMUIModule.scrollToBottom()
                }
            }
        );
        //监听删除消息
        this.deleteMessageListener = NativeAppEventEmitter.addListener(
            'observeDeleteMessage',
            data => {
                if (data.length > 0) {
                    data.map(d => {
                        AuroraIMUIModule.deleteMessage(d)
                    })
                }
            }
        );
        //加载会话第一屏消息
        NimSession.queryMessageListEx('', 20).then(
            data => {
                if (data.length > 0) {
                    const [first] = data;
                    this._lastMessage = first;
                    this.setState({ initList: data });
                    AuroraIMUIModule.scrollToBottom()
                }
            }
        )
    }

    /**
     * 屏幕卸载时触发
     */
    componentWillUnmount() {
        //还原会话状态
        NimSession.stopSession();
        //卸载时间监听
        this.sessionListener && this.sessionListener.remove();
        this.msgStatusListener && this.msgStatusListener.remove();
        this.deleteMessageListener && this.deleteMessageListener.remove();
    };

    /**
     * 发送文本信息
     * @param text
     * @param ids
     */
    onSend = (text, ids) => {
        let t = text;
        if (!t || !t.trim()) {
            Toast.show('请输入聊天内容');
            return
        }
        t = text.trim();
        NimSession.sendTextMessage(t, ids);
        this.forceUpdate();
    };

    /**
     * 发送图片信息
     */
    handleImagePicker = () => {
        if (!this.state.action) {
            return
        }
        ImagePicker.openPicker({
            mediaType: 'photo',
            loadingLabelText: '请稍候...',
        }).then(image => {
            NimSession.sendImageMessages(image.path, 'myName');
        })
    };

    /**
     * 相机拍摄图片
     */
    handleCameraPicker = () => {
        if (!this.state.action) {
            return
        }
        ImagePicker.openCamera({
            mediaType: 'photo',
            loadingLabelText: '请稍候...',
        }).then(image => {
            NimSession.sendImageMessages(image.path, 'myName')
        })
    };

    /**
     * 点击转账按钮
     */
    handleTransferClick = () => {
        if (!this.state.action) {
            return
        }
        Toast.show('向好友转账')
    };

    /**
     * 点击发送红包按钮
     */
    handlePacketClick = () => {
        if (!this.state.action) {
            return
        }
        Toast.show('发红包')
    };

    /**
     * 点击链接
     * @param url
     */
    onOpenURL = (url) => {
        Toast.show(`打开链接${url}`)
    };

    /**
     * 单击消息
     * @param message
     */
    onMessagePress = (message) => {
        const { navigator } = this.props;
        if (message.msgType === 'location') {
            navigator.push({
                screen: 'ImDemo.LocationView',
                title: '查看位置',
                passProps: {
                    region: message.extend,
                },
            })
        }
        if (message.msgType === 'redpacket' && message.extend) {
            Toast.show('红包详情')
        }
        if (message.msgType === 'transfer' && message.extend) {
            Toast.show('转账详情')
        }
        if (message.msgType === 'redpacketOpen' && message.extend) {
            this.onPacketPress(message)
        }
    };

    /**
     * 点击消息列表触发
     */
    onTouchMsgList = () => {
        Animated.timing(this.state.chatInputheight, {
            toValue: 48,
            duration: 200,
        }).start();
        this.setState({
            isDismissMenuContainer: true,
            chatInputStyle: {
                backgroundColor: ChatInputHeightBg,
                width,
            },
        })
    };

    /**
     * 打开红包方法
     * @param message
     */
    onPacketPress = (message) => {
        console.log(message);
        Toast.show('红包详情');
    };

    /**
     * 点击用户头像
     * @param v
     */
    onAvatarPress = (v) => {
        if (v && v.fromUser) {
            NimFriend.getUserInfo(v.fromUser._id).then(data => {
                console.log(data);
            })
        }
    };

    /**
     * 加载更多信息
     * @private
     */
    _loadMoreContentAsync = () => {
        if (!this._lastMessage) {
            return
        }
        NimSession.queryMessageListEx(this._lastMessage.msgId, 20).then(data => {
            if (data.length > 0) {
                const [first] = data;
                this._lastMessage = first;
                AuroraIMUIModule.insertMessagesToTop(data);
            }
        })
    };

    /**
     * 发送文字消息
     * @param text
     */
    onSendText = text => {
        this.onSend(text, [])
    };

    /**
     * 发送语音消息
     * @param path
     * @param duration
     */
    onSendRecordMessage = (path, duration) => {
        NimSession.sendAudioMessage(path, duration);
    };

    /**
     * 输入框获取焦点时
     * @param inputHeight
     * @param showType
     */
    onFeatureView = (inputHeight, showType) => {
        if (showType > 0) {
            Animated.timing(this.state.chatInputheight, {
                toValue: 323,
                duration: 200,
            }).start()
        } else {
            Animated.timing(this.state.chatInputheight, {
                toValue: 48,
                duration: 260,
            }).start()
        }
        this.setState({
            action: showType === 2,
            isDismissMenuContainer: false,
            chatInputStyle: {
                backgroundColor: ChatInputHeightBg,
                width,
            },
            menuContainerHeight: ContainerHeightMax,
        });
        setTimeout(() => {
            AuroraIMUIModule.scrollToBottom()
        }, 500)
    };

    /**
     * 键盘弹起时
     */
    onShowKeyboard = () => {
        setTimeout(() => {
            AuroraIMUIModule.scrollToBottom();
        }, 200)
    };

    /**
     * @用户
     * @param text
     */
    onEditTextChange = text => {
        console.log('用于做@提醒:', text)
    };

    /**
     * 消息长按菜单
     * @param message
     * @param opt
     */
    onStatusViewClick = (message, opt) => {
        if (opt === 'copy') {
            //复制信息
            Clipboard.setString(message.text);
        } else if (opt === 'delete') {
            //删除信息
            NimSession.deleteMessage(message.msgId);
            AuroraIMUIModule.deleteMessage([message]);
        } else if (opt === 'revoke') {
            //撤回消息
            NimSession.revokeMessage(message.msgId).then(() => {
                AuroraIMUIModule.deleteMessage([message]);
            })
        }
    };

    /**
     * 消息容器
     * @returns {*}
     */
    renderMessages() {
        return (
            <MessageListView
                style={{ flex: 1 }}
                onMsgClick={this.onMessagePress}
                onLinkClick={this.onOpenURL}
                onAvatarClick={this.onAvatarPress}
                onStatusViewClick={this.onStatusViewClick}
                onTouchMsgList={this.onTouchMsgList}
                onClickChangeAutoScroll={this.onClickChangeAutoScroll}
                onPullToRefresh={this._loadMoreContentAsync}
                initList={this.state.initList}
            />
        )
    }

    /**
     * 底部输入组件
     * @returns {*}
     */
    renderChatInput() {
        return (
            <InputView
                style={[
                    this.state.chatInputStyle,
                    { height: this.state.chatInputheight },
                ]}
                menuContainerHeight={this.state.menuContainerHeight}
                isDismissMenuContainer={this.state.isDismissMenuContainer}
                onSendText={this.onSendText}
                onSendVoice={this.onSendRecordMessage}
                onShowKeyboard={this.onShowKeyboard}
                onFeatureView={this.onFeatureView}
                onEditTextChange={this.onEditTextChange}
            >
                <View style={styles.search}>{this.renderActionBar()}</View>
            </InputView>
        )
    }

    /**
     * 底部菜单页
     * @returns {*}
     */
    renderActionBar() {
        let {navigation} = this.props;
        const session = navigation.getParam('item');
        return (
            <View style={styles.iconRow}>
                <View style={styles.actionCol}>
                    <TouchableOpacity
                        style={styles.iconTouch}
                        onPress={this.handleCameraPicker}
                    >
                        {Svgs.iconCamera}
                    </TouchableOpacity>
                    <Text style={{ marginTop: 6, fontSize: 12 }}>拍照</Text>
                </View>
                <View style={styles.actionCol}>
                    <TouchableOpacity
                        style={styles.iconTouch}
                        onPress={this.handleImagePicker}
                    >
                        {Svgs.iconImage}
                    </TouchableOpacity>
                    <Text style={{ marginTop: 6, fontSize: 12 }}>相册</Text>
                </View>
                <View style={[styles.actionCol]}>
                    <TouchableOpacity
                        style={styles.iconTouch}
                        onPress={this.handlePacketClick}
                    >
                        {Svgs.iconPack}
                    </TouchableOpacity>
                    <Text style={{ marginTop: 6, fontSize: 12 }}>红包</Text>
                </View>
                {session.sessionType === '0' ? (
                    <View style={[styles.actionCol, { marginRight: 0 }]}>
                        <TouchableOpacity
                            style={styles.iconTouch}
                            onPress={this.handleTransferClick}
                        >
                            {Svgs.iconTransfer}
                        </TouchableOpacity>
                        <Text style={{ marginTop: 6, fontSize: 12 }}>转账</Text>
                    </View>
                ) : null}
            </View>
        )
    }

    /**
     * 最终输出视图
     * @returns {*}
     */
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
                {this.renderMessages()}
                {this.renderChatInput()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
    },
    messageList: {
        flex: 1,
        marginTop: 0,
        width: window.width,
        margin: 0,
    },
    inputView: {
        backgroundColor: 'green',
        width: window.width,
        height: 100,
    },
    btnStyle: {
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#3e83d7',
        borderRadius: 8,
        backgroundColor: '#3e83d7',
    },
    iconRow: {
        flexDirection: 'row',
        paddingHorizontal: sWidth / 5 - 1,
        flexWrap: 'wrap',
        paddingVertical: 30,
        flex: 1,
    },
    actionCol: {
        alignItems: 'center',
        marginRight: sWidth / 5,
        height: 95,
    },
    iconTouch: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    search: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff',
    },
});
