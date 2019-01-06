import Types from '../../action/types';

const defaultState = {
    dataSource:[]
};

export default (state = defaultState,action) => {
    switch (action.type) {
        case Types.ONLOAD_NEW_FRIEND:
            return{
                ...state,
                dataSource: action.newfriends
            };
        case Types.ADD_NEW_FRIEND:
            return{
                ...state,
                dataSource: [
                    action.newfriend,
                    ...state.dataSource
                ]
            };
        case Types.REVIEW_NEW_FRIEND:
            let dataSource = [...state.dataSource];
            dataSource[action.index] = action.newfriend;
            return{
                ...state,
                dataSource:dataSource
            };
        default:
            return state;
    }
};
