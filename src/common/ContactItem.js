import {ListItem,withTheme, Text} from "react-native-elements";
import React,{PureComponent} from "react";
import NavigationUtil from "../navigator/NavigationUtil";

/**
 * 联系人列表项
 * @param item
 * @returns {*}
 */
class ContactItem extends PureComponent{
    state={
        checked: false
    };

    /**
     * 切换复选框的状态
     */
    changeChecked = (checked,onPress,item) => {
        onPress(item.account);
        this.setState({checked:!checked});
    };

    /**
     * 跳转到指定页面
     */
    goPage = (gopage,item,index) => {
        NavigationUtil.goPage(gopage,{item:item,index});
    };

    /**
     * 序列化数据
     * @returns {{title: (*|number), subtitle: (string|string|React.ReactElement<{}>), leftAvatar: {size: number, rounded: boolean, avatarStyle: (*|number|{backgroundColor: string}), [p: string]: boolean}, checkBox: (*|{checked: boolean, checkedColor: string}), rightTitle: (*|string), rightTitleStyle: {fontSize: number}, rightSubtitle: (*|string), rightElement: *, bottomDivider: *, containerStyle: {height: number}, onPress: (function(): void)}}
     */
    sequence(){
        let {item,bottomDivider,rightElement,checkbox,theme,gopage,index,onPress} = this.props;
        let {checked} = this.state;
        return {
            title: item.name,
            subtitle: item.content && item.content,
            subtitleProps:{
                numberOfLines:1
            },
            leftAvatar: {
                [item.avatar ? 'source' : 'title']: item.avatar ? (typeof item.avatar === 'string' ? {uri:item.avatar} : item.avatar) : (item.name && item.name[0]),
                size: item.content ? 45 : 40,
                rounded: false,
                avatarStyle: item.avatar && {
                    backgroundColor:'#fff'
                }
            },
            checkBox: checkbox && {
                checked:checked,
                checkedColor:theme.colors.secondary
            },
            rightTitle: item.time,
            rightTitleStyle:{fontSize: 12},
            rightSubtitle: item.unreadCount && ((item.unreadCount=== '0') ? '' : <Text style={{width:25,textAlign: 'center',borderRadius:10,backgroundColor: theme.colors.error,color:'#fff'}}>{item.unreadCount}</Text>),
            rightElement: rightElement && rightElement,
            bottomDivider:bottomDivider,
            containerStyle:{
                height:item.content ? 60 : 54
            },
            onPress:() => checkbox ? this.changeChecked(checked,onPress,item) : this.goPage(gopage,item,index)
        }
    }

    render(){
        return(
            <ListItem
                {...this.sequence()}
            />
        )
    }
}

export default withTheme(ContactItem)
