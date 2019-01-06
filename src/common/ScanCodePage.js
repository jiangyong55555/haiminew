import React, {PureComponent} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Platform,
    Dimensions,
    Animated,
    InteractionManager,
    Easing,
    ImageBackground
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import Toast from "react-native-root-toast";
import ImagePicker from 'react-native-image-crop-picker';
import QRCode from '@remobile/react-native-qrcode-local-image';

import NavigationHeader from "../navigator/NavigationHeader";
import NavigationUtil from "../navigator/NavigationUtil";
import Loading from "./Loading";
import {connect} from "react-redux";
const {width, height} = Dimensions.get('window');

class MaxCardScreen extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            show: true,
            anim: new Animated.Value(0)
        };
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.startAnimation()
        });
    }

    startAnimation() {
        if (this.state.show) {
            this.state.anim.setValue(0);
            Animated.timing(this.state.anim, {
                toValue: 1,
                duration: 1500,
                easing: Easing.linear,
            }).start(() => this.startAnimation());
        }
    }

    componentWillUnmount() {
        this.state.show = false;
    }

    //扫描二维码方法
    barcodeReceived = (e) => {
        if (this.state.show) {
            this.state.show = false;
            if (e) {
                console.log('jiaojiao---' + e.data)
            } else {
                Toast.show('扫描失败');
            }
        }
    };

    Callback = (navigation,myinfo) => {
        ImagePicker.openPicker({}).then(images => {
            this.refs.loading.show();
            QRCode.decode(images.path.slice(7), (error, result)=>{
                if(!error){
                    try {
                        let data = JSON.parse(result);
                        switch (data.type) {
                            case 'addGroup':
                                nim.applyTeam({
                                    teamId: data.teamId,
                                    done: (error, obj) => {
                                        if(!error){
                                            Toast.show('成功加入群聊');
                                            NavigationUtil.goBack(navigation);
                                            this.refs.loading.close();
                                        }else {
                                            Toast.show(error.message);
                                            this.refs.loading.close();
                                        }
                                    }
                                });
                                break;
                            case 'applyFriend':
                                nim.applyFriend({
                                    account: data.account,
                                    ps:JSON.stringify(myinfo),
                                    done: (error, obj) => {
                                        if(!error){
                                            Toast.show('申请发送成功');
                                            NavigationUtil.goBack(navigation);
                                            this.refs.loading.close();
                                        }else {
                                            Toast.show(error.message);
                                            this.refs.loading.close();
                                        }
                                    }
                                });
                                break;
                            default:
                                Toast.show(error.message);
                                this.refs.loading.close();
                                break;
                        }
                    }catch (e) {
                        Toast.show(result);
                        this.refs.loading.close();
                    }
                }else {
                    Toast.show(error);
                    this.refs.loading.close();
                }
            });
        });
    };

    render() {
        const {navigation,myinfo} = this.props;
        return (
            <View style={{flex:1}}>
                <NavigationHeader
                    back={navigation}
                    right={'determine'}
                    name={'相册'}
                    Callback={
                        () => this.Callback(navigation,myinfo)
                    }
                    title={navigation.getParam('title')}
                />
                <Loading ref={'loading'}/>
                <View style={styles.container}>
                    <RNCamera
                        style={styles.preview}
                        type={RNCamera.Constants.Type.back}
                        googleVisionBarcodeType={RNCamera.Constants.GoogleVisionBarcodeDetection.BarcodeType.QR_CODE}
                        flashMode={RNCamera.Constants.FlashMode.auto}
                        onBarCodeRead={(e) => this.barcodeReceived(e)}
                    >
                        <View
                            style={{height: Platform.OS == 'ios' ? (height-264)/3:(height-244)/3,width:width,backgroundColor:'rgba(0,0,0,0.5)',}}>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <View style={styles.itemStyle}/>
                            <ImageBackground style={styles.rectangle}>
                                <Animated.View
                                    style={[styles.animatiedStyle, { transform: [{translateY: this.state.anim.interpolate({inputRange: [0,1], outputRange: [0,200]})}]}]}>
                                </Animated.View>
                            </ImageBackground>
                            <View style={styles.itemStyle}/>
                        </View>
                        <View style={{flex:1,backgroundColor:'rgba(0, 0, 0, 0.5)',width:width,alignItems:'center'}}>
                            <Text style={styles.textStyle}>将二维码放入框内,即可自动扫描</Text>
                        </View>
                    </RNCamera>
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: '#efefef'
    },
    itemStyle: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: (width - 200) / 2,
        height: 200
    },
    textStyle: {
        color: '#666',
        marginTop: 20,
        fontSize: 16
    },
    navTitleStyle: {
        color: 'white',
        fontWeight: 'bold',
    },
    leftViewStyle: {
        // 绝对定位
        // 设置主轴的方向
        flexDirection: 'row',
        position: 'absolute',
        left: 10,
        bottom: Platform.OS == 'ios' ? 15 : 12,
        alignItems: 'center',
        width: 30
    },
    animatiedStyle: {
        height: 2,
        backgroundColor: '#00FF00'
    },
    preview: {
        flex: 1,
    },
    rectangle: {
        height: 200,
        width: 200,
    }
});

const mapStateToProps = (state) => ({
    myinfo: state.myinfo.myinfo
});

export default connect(mapStateToProps)(MaxCardScreen);
