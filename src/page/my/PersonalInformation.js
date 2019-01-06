import React,{PureComponent} from 'react';
import {Dimensions, StyleSheet, View} from "react-native";
import ImagePicker from 'react-native-image-crop-picker';
import {withTheme, ListItem} from "react-native-elements";
import Toast from "react-native-root-toast";
import {connect} from 'react-redux';
import { NimFriend } from 'react-native-netease-im'

import NavigationHeader from "../../navigator/NavigationHeader";
import NavigationUtil from "../../navigator/NavigationUtil";
import DataStore from "../../expand/dao/DataStore";
import actions from "../../action";
import Loading from "../../common/Loading";

/**
 * 个人信息
 * @param navigation
 * @param theme
 * @returns {*}
 * @constructor
 */
class PersonalInformation extends PureComponent{

    //打开相册剪切图片
    openPicker = () => {
        const {onLoadMyinfo,theme} = this.props;
        const {primary} = theme.colors;
        ImagePicker.openPicker({
            width: 500,
            height: 500,
            cropping: true,
            cropperToolbarTitle: '剪切',
            showCropGuidelines: false,
            hideBottomControls: true,
            cropperStatusBarColor: primary,
            cropperToolbarColor: primary,
        }).then(image => {
            let formData = new FormData();
            let file = {uri: image.path,type: 'multipart/form-data',name: 'image.png'};
            formData.append("file",file);
            this.refs.loading.show();
            DataStore.fetchData('upload',formData,true).then((res) => {
                if(res.code!=0){
                    Toast.show(res.info);
                }else {
                    console.log(res.data.src);
                    NimFriend.updateMyUserInfo(JSON.stringify({name:'aa'})).then(
                        v => {
                            console.log(v);
                            this.refs.loading.close();
                        },
                        err => {
                            console.log(err);
                        }
                    );
                    // nim.updateMyInfo({
                    //     avatar: res.data.src,
                    //     done:(error, user) => {
                    //         if (!error) {
                    //             this.refs.loading.close();
                    //             onLoadMyinfo(user);
                    //         }
                    //     }
                    // });
                }
            })
        });
    };

    /**
     * 列表项视图
     * @returns {any[]}
     * @constructor
     */
    RenderItem = () => {
        let {myinfo} = this.props.myinfo;
        const personalInformationMenue = [
            {title:'头像',avatarPath:{uri:myinfo.avatar}},
            {title:'昵称',subtitle:myinfo.name,name:'name'},
            {title:'账号',subtitle:myinfo.contactId},
            {title:'签名',subtitle:myinfo.signature,name:'signature'},
            {title:'二维码名片',rightIcon:'qrcode'}
        ];
        return personalInformationMenue.map((item,i) => {
            let config = {
                key: i,
                title: item.title,
                containerStyle: {height: (item.avatarPath ? 81 : 48)},
                rightSubtitle: item.subtitle && item.subtitle,
                rightSubtitleStyle: {fontSize:14},
                bottomDivider: (i===4) ? false : true,
                disabled: (i === 2) && true,
                onPress: () => {
                    switch (i) {
                        case 0:
                            this.openPicker();
                            break;
                        case 4:
                            NavigationUtil.goPage(
                                'QrCodePage',
                                {item:{...myinfo,...item}}
                            );
                            break;
                        default:
                            NavigationUtil.goPage(
                                'ModifyPage',
                                item
                            );
                            break;
                    }
                }
            };
            if(item.rightIcon) config.rightIcon = {
                name:item.rightIcon,
                type:'font-awesome',
                size:20
            };
            if(item.avatarPath) config.rightAvatar = {
                ...(myinfo.avatar.length>0 ? {source:item.avatarPath} : {title:myinfo.name[0]}),
                avatarStyle: myinfo.avatar.length>0 && {backgroundColor:'#ffffff'},
                size: 63,
                rounded: false,
            };
            return(
                <ListItem
                    {...config}
                />
            )
        })
    };

    render(){
        let {navigation,theme} = this.props;
        return(
            <View style={[styles.container,{backgroundColor:theme.colors.paper}]}>
                <NavigationHeader
                    back={navigation}
                    title={navigation.getParam('title')}
                />
                <Loading ref={'loading'}/>
                <View style={{width:Dimensions.get('window').width,marginTop: 20}}>
                    {this.RenderItem(navigation,theme)}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
    }
});

const mapDispatchToProps = (dispatch) => ({
    onLoadMyinfo(myInfo){
        dispatch(actions.onLoadMyinfo(myInfo));
    }
});

const mapStateToProps = (state) => ({
    myinfo: state.myinfo
});

export default connect(mapStateToProps,mapDispatchToProps)(withTheme(PersonalInformation));
