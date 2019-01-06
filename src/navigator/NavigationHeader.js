import React from 'react';
import {Header,withTheme} from "react-native-elements";
import ViewUtil from "../util/ViewUtil";

/**
 * 返回头部组件
 * @param props
 * @returns {*}
 * @constructor
 */
const NavigationHeader = (props) => {
    const viewUtil = new ViewUtil();
    let {theme,back,right,title,Callback,name} = props;
    let rightComponent;
    switch (right) {
        case 'more':
            rightComponent = viewUtil.getRightMore();
            break;
        case 'determine':
            rightComponent = viewUtil.getRightDetermine(theme,Callback,name);
            break;
        case 'groupInfo':
            rightComponent = viewUtil.getGroupInfo(back.getParam('item'));
            break;
    }
    let leftComponent = back && viewUtil.getLeftBack(back);
    return (
        <Header
            {...props.styles}
            centerComponent={{ text: title && title, style: { color: '#fff', fontSize: 18 } }}
            rightComponent={rightComponent}
            leftComponent={leftComponent}
        />
    )
};

export default withTheme(NavigationHeader);
