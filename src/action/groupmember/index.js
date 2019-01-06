import GroupMemberDao from "../../expand/dao/GroupMemberDao";
import Types from '../types';
import Utils from "../../util/Utils";

const onLoadMenberGroupListAction = (groupmemberlist,teamId) => ({
    type: Types.ONLOAD_GROUP_MEMBER_LIST,
    groupmemberlist,
    teamId
});

/**
 * 加载数据
 * @param teamId
 * @returns {Function}
 */
export const onLoadMenberGroupList = (teamId) => {
    return (dispatch) => {
        const groupMemberDao = new GroupMemberDao(teamId);
        groupMemberDao.fetchData().then((data) => {
            dispatch(onLoadMenberGroupListAction(data,teamId));
        })
    }
};

const addMenberGroupListAction = (member,teamId) => ({
    type: Types.ADD_GROUP_MEMBER_LIST,
    member,
    teamId
});

/**
 * 添加数据
 * @param user
 * @param member
 * @param teamId
 * @returns {Function}
 */
export const addMenberGroupList = (user,member,teamId) => {
    return (dispatch) => {
        const utils = new Utils;
        utils.checkGroupMember(teamId,member).then(judge=>{
            if(!judge){
                const groupMemberDao = new GroupMemberDao(teamId);
                groupMemberDao.saveData([user],[member]);
                member.nick = user.nick;
                member.avatar = user.avatar;
                dispatch(addMenberGroupListAction(member,teamId));
            }
        });
    }
};
