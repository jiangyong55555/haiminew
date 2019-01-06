import GroupDao from "../../expand/dao/GroupDao";
import Types from '../types';
import Utils from '../../util/Utils';

const onLoadGroupListAction = (grouplist) => ({
    type: Types.ONLOAD_GROUP_LIST,
    grouplist: grouplist
});

export const onLoadGroupList = () => {
    return (dispatch) => {
        const groupDao = new GroupDao();
        groupDao.fetchData().then((data) => {
            dispatch(onLoadGroupListAction(data));
        })
    }
};

const addGroupAction = (group) => ({
    type: Types.ADD_GROUP,
    group: group
});

export const addGroup = (team) => {
    return (dispatch) => {
        const utils = new Utils;
        utils.checkGroup(team).then(judge=>{
            if(!judge){
                const groupDao = new GroupDao();
                groupDao.saveData([team]);
                dispatch(addGroupAction(team));
            }
        });
    }
};
