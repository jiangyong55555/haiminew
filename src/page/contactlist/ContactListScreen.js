import React, {PureComponent} from 'react';
import {SectionList, View, NativeAppEventEmitter, StyleSheet, Text, AsyncStorage} from 'react-native';
import {withTheme} from "react-native-elements";
import { NimFriend } from 'react-native-netease-im'

import NavigationHeader from '../../navigator/NavigationHeader';
import ContactItem from '../../common/ContactItem';
import { contactMenue } from '../../model/MenuModel';
import ContactFoot from '../../common/ContactFoot';

function transform(obj) {
    const arr = [];
    for (const item in obj) {
        arr.push(item);
    }
    arr.sort(mySorter);
    return arr;
}

function mySorter(a, b) {
    if (/^\d/.test(a) !== /^\D/.test(b)) return a > b ? 1 : (a = b ? 0 : -1);
    return a > b ? -1 : a == b ? 0 : 1;
}

/**
 * 联系人列表
 */
class ContactListScreen extends PureComponent {

    // 构造
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
        }
    }

    /**
     * 对联系人数据进行排序
     * @param data
     */
    formatData = (data) => {
        const newObj = [];
        const h = transform(data).sort();
        let len = 0;
        h.map(res => {
            newObj.push({
                title: res,
                data: data[res]
            });
            len += data[res].length;
        });
        newObj.length = len;
        return newObj
    };

    componentWillMount() {
        NimFriend.startFriendList();
    }

    /**
     * 加载初始化数据
     */
    componentDidMount() {
        AsyncStorage.getItem('contact'+globalAccount,(error,result) => {
            if(!error){
                if(result){
                    this.setState({
                        dataSource: this.formatData(JSON.parse(result))
                    });
                }
            }
        });
        NimFriend.getFriendList('').then(data=>{
            console.log(data);
        });
        this.friendListener = NativeAppEventEmitter.addListener(
            'observeFriend',
            data => {
                AsyncStorage.setItem('contact'+globalAccount,JSON.stringify(data));
                console.log(data);
                this.setState({
                    dataSource: this.formatData(data)
                })
            }
        )
    }

    /**
     * 删除监听
     */
    componentWillUnmount() {
        NimFriend.stopFriendList();
        this.friendListener && this.friendListener.remove();
    }

    /**
     * 头部组件
     * @returns {*}
     * @constructor
     */
    ListHeaderComponent = () => {
        let len = contactMenue.length-1;
        return(
            <View>
                {
                    contactMenue.map((v,i) => (
                        <ContactItem
                            key={i}
                            item={v}
                            gopage={v.page}
                            bottomDivider={!(len===i)}
                        />
                    ))
                }
            </View>
        )
    };

    /**
     * 每项分组的标题
     * @param section
     * @returns {*}
     * @private
     */
    _renderSectionHeader = ({ section }) => {
        return (
            <View style={styles.headerView}>
                <Text style={styles.headerText}>{section.title}</Text>
            </View>
        )
    };

    /**
     * 输出视图
     * @returns {*}
     */
    render() {
        const {theme} = this.props;
        const {dataSource} = this.state;
        const len = dataSource.length;
        return (
            <View style={{flex: 1,backgroundColor:theme.colors.paper}}>
                <NavigationHeader
                    right={'more'}
                    title={'联系人'}
                />
                <SectionList
                    showsVerticalScrollIndicator={false}
                    keyExtractor={item => item.contactId}
                    sections={dataSource}
                    ListHeaderComponent={this.ListHeaderComponent}
                    renderSectionHeader={this._renderSectionHeader}
                    ListFooterComponent={
                        <ContactFoot
                            statistics={len+'位联系人'}
                        />
                    }
                    renderItem={({ item, index, section }) => {
                        return (
                            <ContactItem
                                item={item}
                                gopage={'FriendInfo'}
                                bottomDivider={section.data.length-1!==index}
                            />
                        )
                    }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    headerView: {
        justifyContent: 'center',
        height: 20,
        paddingLeft: 20
    },
    headerText: {
        fontSize: 13
    }
});

export default withTheme(ContactListScreen);
