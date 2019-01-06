import Types from '../../action/types';

const defaultState = {
    dataSource:{}
};

export default (state = defaultState,action) => {
    switch (action.type) {
        case Types.ONLOAD_GROUP_MEMBER_LIST:
            return {
                ...state,
                dataSource: {
                    ...state.dataSource,
                    [action.teamId] : action.groupmemberlist
                }
            };
        case Types.ADD_GROUP_MEMBER_LIST:
            return {
                ...state,
                dataSource: {
                    ...state.dataSource,
                    [action.teamId] : [
                        ...state.dataSource[action.teamId],
                        action.member
                    ]
                }
            };
        default:
            return state;
    }
};
