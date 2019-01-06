import store from '../store';
import actions from "../action";

export default class Utils {

    /**
     * 检测是否已是好友
     * @param user
     * @returns {boolean}
     */
    checkContact = async(user) =>{
        if(!user) return false;
        await this.onLoadData('onLoadContactList');
        let contactLength = this.contactList.length;
        for (let i=0; i<contactLength; i++ ){
            if(this.contactList[i].account === user.account){
                return true;
            }
        }
        return false;
    };

    /**
     * 检测是否已加入群
     * @param group
     * @returns {boolean}
     */
    checkGroup = async(group) => {
        if(!group) return false;
        await this.onLoadData('onLoadGroupList');
        let groupLength = this.groupChatlist.length;
        for (let i=0; i<groupLength; i++ ){
            if(this.groupChatlist[i].teamId === group.teamId){
                return true;
            }
        }
        return false;
    };

    /**
     * 检测是否已有申请
     * @param newUser
     * @returns {Promise<boolean>}
     */
    checkNewUser = async(newUser) =>{
        if(!newUser) return false;
        await this.onLoadData('onLoadNewFriend');
        let newfriendLength = this.newfriendlist.length;
        for (let i=0; i<newfriendLength; i++ ){
            if(this.newfriendlist[i].account === newUser.account){
                return true;
            }
        }
        return false;
    };

    /**
     * 检测是否已在群群成员列表
     * @param teamId
     * @param member
     * @returns {Promise<boolean>}
     */
    checkGroupMember = async(teamId,member) =>{
        if(!newUser) return false;
        await this.onLoadData('onLoadMenberGroupList');
        let groupmemberLength = this.groupmember.length;
        for (let i=0; i<groupmemberLength; i++ ){
            if(this.groupmember[teamId][i].id === member.id){
                return true;
            }
        }
        return false;
    };

    /**
     * 加载数据
     * @param method
     */
    onLoadData(method){
        store.dispatch(actions[method]());
        const allData = store.getState();
        this.contactList = allData.contactlist.dataSource;
        this.groupChatlist = allData.groupchatlist.dataSource;
        this.newfriendlist = allData.newfriendlist.dataSource;
        this.groupmember = allData.groupmember.dataSource;
    }

}
