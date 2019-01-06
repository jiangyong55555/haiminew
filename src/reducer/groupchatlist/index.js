import Types from '../../action/types';

const defaultState = {dataSource:[]};

export default (state = defaultState,action) => {
    switch (action.type) {
        case Types.ONLOAD_GROUP_LIST:
            return {
                ...state,
                dataSource: action.grouplist
            };
        case Types.ADD_GROUP:
            return {
                ...state,
                dataSource: [
                    action.group,
                    ...state.dataSource
                ]
            };
        default:
            return state;
    }
};
