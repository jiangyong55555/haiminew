import React, {PureComponent} from 'react';
import {Dimensions, View, CameraRoll} from 'react-native';
import NavigationHeader from "../navigator/NavigationHeader";
import {withTheme,Card, Text} from "react-native-elements";
import QRCode from 'react-native-qrcode-svg';
import RNFS from "react-native-fs";
import Toast from "react-native-root-toast";

class QrCodePage extends PureComponent {

    /**
     * 将图片保存到本地
     */
    saveQrToDisk = () => {
        this.svg.toDataURL((data) => {
            RNFS.writeFile(RNFS.CachesDirectoryPath+"/some-name.png", data, 'base64')
                .then((success) => {
                    return CameraRoll.saveToCameraRoll(RNFS.CachesDirectoryPath+"/some-name.png", 'photo')
                })
                .then(() => {
                    Toast.show('保存成功');
                })
        })
    };

    render() {
        let {navigation,theme} = this.props;
        const item = navigation.getParam('item');
        let width = Dimensions.get('window').width;
        let value;
        if(item.account){
            value = JSON.stringify({type:'applyFriend',account:item.account});
        }else {
            value = JSON.stringify({type:'addGroup',teamId:item.teamId});
        }
        const config = {
            key:'2',
            value:value,
            getRef: (c) => {
                this.svg = c;
            },
            size:width*0.6,
            logoSize:50
        };
        if(item.avatar) config.logo = {uri: item.avatar};
        return (
            <View style={{flex: 1,alignItems: 'center',backgroundColor:theme.colors.primary}}>
                <NavigationHeader
                    right={'determine'}
                    name={'保存'}
                    Callback={this.saveQrToDisk}
                    back={navigation}
                    title={item.title}
                />
                <Card
                    title={item.nick}
                    titleStyle={{fontSize:16}}
                    wrapperStyle={{alignItems: 'center'}}
                    containerStyle={{alignItems: 'center',marginTop:60,width:width*0.9}}>
                    <QRCode {...config}/>
                    <Text key={'1'} style={{marginTop:20}}>扫一扫上面的二维码，{item.account?'加我嗨米':'加入群聊'}</Text>
                </Card>
            </View>
        );
    }
}

export default withTheme(QrCodePage);
