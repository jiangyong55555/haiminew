//实时通讯组件
import NIM from './NIM_Web_NIM_rn_v5.8.0';
import store from '../store';
import actions from '../action';

class Start {

    /**
     * 初始化连接
     */
    constructor(data,callback){
        // store.getState();获取数据
        // store.dispatch();派发数据
        // store.subscribe();订阅数据变化
        global.nim = NIM.getInstance({
            appKey: '03d0677eeaaae530bb6b3a817fc2432b',
            account: 'userid'+data.id,
            token: data.token,
            db: false,
            customTag: 'MO',
            onconnect: this.onConnect(callback),
            onwillreconnect: this.onWillReconnect,
            ondisconnect: this.onDisconnect,
            onerror: this.onError,
            //系统信息
            onofflinesysmsgs: this.onOfflineSysMsgs,
            onsysmsg: this.onSysMsg,
            //普通信息
            onmsg: this.onMsg,
            //离线信息
            onofflinemsgs: this.onOfflineMsgs,
            //漫游消息
            onroamingmsgs: this.onRoamingMsgs,
        });
    }

    /**
     * 连接成功
     */
    onConnect = (callback) => {
        if(callback){
            callback();
        }
    };

    /**
     * 重新连接
     * @param obj
     */
    onWillReconnect = (obj) => {
        console.log('即将重连');
        console.log(obj.retryCount);
        console.log(obj.duration);
    };

    /**
     * 重新连接
     * @param error
     */
    onDisconnect = (error) => {
        console.log('丢失连接');
        console.log(error);
    };

    /**
     * 重新连接
     * @param error
     */
    onError = (error) => {
        console.log(error);
    };

    /**
     * 离线系统通知
     * @param sysMsgs
     */
    onOfflineSysMsgs = (sysMsgs) => {
        sysMsgs.map(v => {
            this.applyFriend(v);
        });
        console.log('收到离线系统通知', sysMsgs);
    };

    /**
     * 系统通知
     * @param sysMsg
     */
    onSysMsg = (sysMsg) => {
        this.applyFriend(sysMsg);
        console.log('收到系统通知', sysMsg);
    };

    /**
     * 收到普通信息
     * @param msg
     */
    onMsg = (msg) => {
        console.log('收到普通消息',msg);
        if(msg.type==='notification'){
            this.notification(msg);
        }
    };

    /**
     * 收到离线消息
     * @param obj
     */
    onOfflineMsgs = (obj) => {
        console.log('收到普通离线消息',obj);
        obj.map(v => {
            if(v.type==='notification'){
                this.notification(v);
            }
        });
    };

    /**
     * 漫游信息
     * @param obj
     */
    onRoamingMsgs = (obj) => {
        console.log('收到漫游信息',obj);
    };

    /**
     * 处理群通知信息
     * @param msg
     */
    notification = (msg) => {
        switch (msg.attach.type) {
            case 'passTeamApply':
                if (msg.attach.account === globalAccount) {
                    store.dispatch(actions.addGroup(msg.attach.team));
                } else {
                    let teamId = msg.attach.team.teamId;
                    let member;
                    let user;
                    for (let i = 0; i < msg.attach.members.length; i++) {
                        if (msg.attach.members[i].account === msg.attach.account) {
                            member = msg.attach.members[i];
                            return;
                        }
                    }
                    for (let i = 0; i < msg.attach.users.length; i++) {
                        if (msg.attach.users[i].account === msg.attach.account) {
                            user = msg.attach.users[i];
                            return;
                        }
                    }
                    store.dispatch(actions.addMenberGroupList(user, member, teamId));
                }
                break;
            case 'addTeamMembers':
                store.dispatch(actions.addGroup(msg.attach.team));
                break;
        }
    };

    /**
     * 申请加为好友
     * @param sysMsg
     */
    applyFriend = (sysMsg) => {
        let data;
        switch (sysMsg.type) {
            case 'applyFriend':
                data = {
                    account : sysMsg.from,
                    idServer : sysMsg.idServer,
                    status: 'unreviewed',
                    ...JSON.parse(sysMsg.ps)
                };
                store.dispatch(actions.addNewFriend(data));
                break;
            case 'passFriendApply':
                data = {
                    account : sysMsg.from,
                    ...JSON.parse(sysMsg.ps)
                };
                store.dispatch(actions.addContact(data));
                break;
        }
    }
}

export default Start;
