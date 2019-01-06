/**
 * 个人中心菜单项
 * @type {*[]}
 */
export const myMenue = [
    {displayName:' ',title:'个人信息',subtitle:' ',sign:'',avatarPath:{uri:'http://pic3.nipic.com/20090619/2637387_110259061_2.jpg'},pageName:'PersonalInformation'},
    {displayName:'修改密码',avatarPath:require('../images/my/security.png'),pageName:'SetPassword'},
    {displayName:'退出登录',avatarPath:require('../images/my/signout.png'),pageName:'SignInScreen'},
    {displayName:'关于我们',avatarPath:require('../images/my/about.png'),pageName:'About'},
    {displayName:'设置',avatarPath:require('../images/my/setup.png'),pageName:'Setting'},
];

/**
 * 联系人菜单项
 * @type {*[]}
 */
export const contactMenue = [
    {name: '新的朋友', avatar: require('../images/contact/newFriend.png'),page:'NewFriendList'},
    {name: '群聊', avatar: require('../images/contact/groupChat.png'),page:'GroupChatList'}
];

/**
 * 头部按钮菜单
 * @type {*[]}
 */
export const headerMenue = [
    {name:'扫一扫',icon:'ios-qr-scanner',page:'ScanCodePage'},
    {name:'添加好友',icon:'ios-search',page:'SearchPage'},
    {name:'创建群聊',icon:'ios-people',page:'CreateGroupPage'}
];

/**
 * 关于我们菜单
 * @type {*[]}
 */
export const aboutMenue = [
    {title:'功能介绍'},
    {title:'投诉'},
    {title:'检测新版本'}
];

/**
 * 设置菜单
 * @type {*[]}
 */
export const settingMenue = [
    {title:'消息推送'},
    {title:'声音提醒'},
    {title:'震动'}
];

/**
 * 设置密码
 * @type {*[]}
 */
export const setPasswordMenue = [
    {title:'账号'},
    {title:'原密码'},
    {title:'新密码'},
    {title:'确认密码'}
];

/**
 * 登录列表
 * @type {*[]}
 */
export const loginMenu = [
    {displayName:'账号',name:'login'},
    {displayName:'密码',name:'password'},
];

/**
 * 注册列表
 * @type {*[]}
 */
export const regMenu = [
    {displayName:'昵称',name:'login'},
    {displayName:'账号',name:'login'},
    {displayName:'密码',name:'login'},
    {displayName:'邀请码',name:'login'},
];
