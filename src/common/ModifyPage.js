import React,{PureComponent} from 'react';
import NavigationHeader from "../navigator/NavigationHeader";
import {Input, withTheme} from "react-native-elements";
import {StyleSheet,View} from "react-native";
import Toast from "react-native-root-toast";
import { NimTeam } from 'react-native-netease-im'
import NavigationUtil from "../navigator/NavigationUtil";
import Loading from "./Loading";

/**
 * 修改数据页面
 * @param navigation
 * @param theme
 * @returns {*}
 * @constructor
 */
class ModifyPage extends PureComponent{
    /**
     * 回掉函数
     * @constructor
     */
    Callback(){
        let {navigation} = this.props;
        const item = navigation.getParam('item');
        if(!this.text){
            Toast.show(item.displayName+'为空或未做任何修改');
            return;
        }
        this.refs.loading.show();
        NimTeam.updateTeam(item.contactId,'name',this.text).then(() => {
            this.refs.loading.close();
            NavigationUtil.goBack(navigation);
        })
    }

    render(){
        let {navigation,theme} = this.props;
        const item = navigation.getParam('item');
        return(
            <View style={styles.container}>
                <NavigationHeader
                    back={navigation}
                    right={'determine'}
                    Callback={
                        () => this.Callback()
                    }
                    title={'修改'+ item.displayName}
                />
                <Loading ref={'loading'}/>
                <Input
                    onChangeText={(text) => this.text = text}
                    defaultValue={ item.name }
                    inputStyle={{fontSize:14}}
                    inputContainerStyle={{borderColor:theme.colors.secondary,...styles.input}}
                    placeholder={'请输入'+item.displayName}
                    maxLength={24}
                    shake
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white'
    },
    input:{
        marginTop:5,
        borderBottomWidth: StyleSheet.hairlineWidth
    }
});

export default withTheme(ModifyPage);
