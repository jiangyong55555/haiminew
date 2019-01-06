import React,{PureComponent} from 'react';
import {createBottomTabNavigator,createAppContainer} from 'react-navigation';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { withTheme } from 'react-native-elements';

import NavigationUtil from '../../navigator/NavigationUtil';

/**
 * 导入页面
 */
import ChatListScreen from '../chatllist/ChatListScreen';
import ContactListScreen from '../contactlist/ContactListScreen';
import MyScreen from '../my/MyScreen';

const bottomTabNavigatorMenu = [
    {title:'消息',page:ChatListScreen,pageName:'ChatListScreen',icon:MaterialCommunityIcons,iconName:'message',reverse:'-outline'},
    {title:'联系人',page:ContactListScreen,pageName:'ContactListScreen',icon:FontAwesome,iconName:'address-book',reverse:'-o'},
    {title:'我的',page:MyScreen,pageName:'MyScreen',icon:FontAwesome,iconName:'user',reverse:'-o'}
];

/**
 * 序列化页面对象
 * @constructor
 */
const TABS = () =>{
    let data = {};
    bottomTabNavigatorMenu.map((item) => {
        data[item.pageName] = {
            screen:item.page,
                navigationOptions:{
                tabBarLabel: item.title,
                tabBarIcon:({tintColor,focused}) => {
                    return <item.icon
                        name={item.iconName+ (focused ? '' : item.reverse)}
                        size={26}
                        color={tintColor}
                    />
                }
            }
        }
    });
    return data;
};

/**
 * 返回底部导航
 * @param props
 * @returns {*}
 * @constructor
 */
class HomePage extends PureComponent{
    render(){
        let {secondary} = this.props.theme.colors;
        NavigationUtil.navigation = this.props.navigation;
        const Tab = createAppContainer(
            createBottomTabNavigator(TABS(),{
                backBehavior: 'none',
                tabBarOptions:{
                    activeTintColor: secondary,
                    style:{
                        height:53
                    },
                    labelStyle: {
                        fontSize: 12,
                    }
                }
            })
        );
        return <Tab/>
    }
}

export default withTheme(HomePage);
