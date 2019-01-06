import {
    createStackNavigator,
    createAppContainer,
    createSwitchNavigator
} from 'react-navigation';

import HomePage from '../page/home/HomePage';
import MainChatRoom from '../common/MainChatRoom';
import About from '../page/my/About';
import Setting from '../page/my/Setting';
import SetPassword from '../page/my/SetPassword';
import PersonalInformation from '../page/my/PersonalInformation';
import SearchPage from '../common/SearchPage';
import ModifyPage from '../common/ModifyPage';
import CreateGroupPage from '../common/CreateGroupPage';
import GroupChatList from '../page/contactlist/GroupChatList';
import NewFriendList from '../page/contactlist/NewFriendList';
import FriendInfo from '../page/contactlist/FriendInfo';
import GroupInfo from '../page/contactlist/GroupInfo';
import AllMember from '../page/contactlist/AllMember';
import SignInScreen from '../page/auth/SignInScreen';
import RegLogin from '../page/auth/RegLogin';
import AuthLoadingScreen from '../common/AuthLoadingScreen';
import ScanCodePage from '../common/ScanCodePage';
import QrCodePage from '../common/QrCodePage';

/**
 * 主要页面
 * @type {*[]}
 */
const stackNavigator = [
    {name:'HomePage',page:HomePage},
    {name:'MainChatRoom',page:MainChatRoom},
    {name:'About',page:About},
    {name:'Setting',page:Setting},
    {name:'SetPassword',page:SetPassword},
    {name:'PersonalInformation',page:PersonalInformation},
    {name:'SearchPage',page:SearchPage},
    {name:'ModifyPage',page:ModifyPage},
    {name:'CreateGroupPage',page:CreateGroupPage},
    {name:'GroupChatList',page:GroupChatList},
    {name:'NewFriendList',page:NewFriendList},
    {name:'FriendInfo',page:FriendInfo},
    {name:'GroupInfo',page:GroupInfo},
    {name:'AllMember',page:AllMember},
    {name:'ScanCodePage',page:ScanCodePage},
    {name:'QrCodePage',page:QrCodePage},
];

/**
 * 验证页面
 * @type {*[]}
 */
const AuthNavigator =[
    {name:'SignInScreen',page:SignInScreen},
    {name:'RegLogin',page:RegLogin},
];

/**
 * 格式化主要页面
 * @type {*[]}
 */
const AppStack = () => {
    let data = {};
    stackNavigator.map((item) => {
        data[item.name] = {
            screen: item.page,
            navigationOptions: {
                header: null,
            }
        }
    });
    return data;
};

/**
 * 格式化验证页面
 * @type {*[]}
 */
const AuthStack = () => {
    let data = {};
    AuthNavigator.map((item) => {
        data[item.name] = {
            screen: item.page,
            navigationOptions: {
                header: null,
            }
        }
    });
    return data;
};

/**
 * 创建页面实例
 */
const SwitchNavigator = createSwitchNavigator({
    AuthLoading: AuthLoadingScreen,
    App: createStackNavigator(AppStack()),
    Auth: createStackNavigator(AuthStack()),
},{
    initialRouteName: 'AuthLoading',
});

export default createAppContainer(SwitchNavigator);
