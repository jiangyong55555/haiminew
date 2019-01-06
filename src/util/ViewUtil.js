import React from 'react';
import {Icon, Text, Tooltip} from "react-native-elements";
import {TouchableOpacity, View} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import NavigationUtil from '../navigator/NavigationUtil';
import {headerMenue} from '../model/MenuModel';

class ViewUtil{

    /**
     * 获取内容
     * @returns {*}
     */
    getContent = () => {
        return(
            <View>
                {
                    headerMenue.map((v,i)=>{
                        return(
                            <TouchableOpacity
                                key={i}
                                style={[{flexDirection: 'row',alignItems: 'center'},(i!==0) && {marginTop: 10}]}
                                onPress={
                                    () => {
                                        this.tooltip.toggleTooltip();
                                        NavigationUtil.goPage(v.page,{title:v.name});
                                    }
                                }
                            >
                                <Ionicons
                                    key={'1'}
                                    name={v.icon}
                                    size={22}
                                />
                                <Text key={'2'} style={{fontSize: 16,marginLeft: 10}}>{v.name}</Text>
                            </TouchableOpacity>
                        )
                    })
                }
            </View>
        )
    };

    /**
     * 获取更多按钮
     * @returns {*}
     */
    getRightMore(){
        return(
            <Tooltip
                ref={(tooltip) => this.tooltip = tooltip}
                popover={this.getContent()}
                backgroundColor={'#ffffff'}
                containerStyle={{elevation: 4,shadowColor: 'gray', shadowOffset: {width: 0.5,height: 0.5}, shadowOpacity: 0.4, shadowRadius: 1,}}
                withOverlay={false}
                height={120}
            >
                <Icon
                    name={'add'}
                    size={28}
                    color={'#ffffff'}
                />
            </Tooltip>
        )
    }


    /**
     * 获取返回按钮
     * @returns {*}
     */
    getLeftBack(navigation){
        return(
            <TouchableOpacity
                onPress={() => NavigationUtil.goBack(navigation)}
            >
                <Icon
                    name={'arrow-back'}
                    size={26}
                    color={'#ffffff'}
                />
            </TouchableOpacity>
        )
    }


    /**
     * 获取确认按钮
     * @param theme
     * @returns {*}
     */
    getRightDetermine(theme,Callback,name){
        return(
            <TouchableOpacity
                onPress={
                    () => Callback()
                }
            >
                <Text
                    style={{color:theme.colors.secondary}}
                >{name ? name : '完成'}</Text>
            </TouchableOpacity>
        )
    }

    /**
     * 获取群按钮
     * @returns {*}
     */
    getGroupInfo(item){
        return(
            <TouchableOpacity
                onPress={() => NavigationUtil.goPage('GroupInfo',{item:item})}
            >
                <Icon
                    type={'ionicon'}
                    name={'ios-more'}
                    size={26}
                    color={'#fff'}
                />
            </TouchableOpacity>
        )
    }
}

export default ViewUtil;
