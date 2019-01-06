import {AsyncStorage} from 'react-native';

export default class GroupDao {
    /**
     * 初始方法
     */
    constructor(teamId){
        this.getTeamMembers = 'getTeamMembers'+globalAccount+teamId;
        this.teamId = teamId;
    }

    /**
     * 获取数据入口
     * @returns {Promise<any> | Promise}
     */
    fetchData(){
        return new Promise((resolve,reject) => {
            this.fetchLocalData().then((wrapData) => {
                if(wrapData){
                    resolve(wrapData);
                }else {
                    this.fetchNetData().then((data) => {
                        resolve(data);
                    }).catch((error) => {
                        reject(error)
                    })
                }
            }).catch((error) => {
                this.fetchNetData().then((data) => {
                    resolve(data);
                }).catch((error) => {
                    reject(error)
                })
            })
        })
    }

    /**
     * 保存数据
     * @param allUsers
     * @param members
     * @param callback
     */
    saveData(allUsers,members,callback) {
        if(!allUsers || !members) return;
        let newUsers = [];
        let accounts = [];
        let users = [];
        members.map((v,i) => {
            v.nick = allUsers[i].nick;
            v.avatar = allUsers[i].avatar;
            newUsers.push([v.id,JSON.stringify(v)]);
            accounts.push(v.id);
            users.push(v);
        });
        AsyncStorage.multiSet(newUsers,callback);
        this.updateFavoriteKeys(accounts,true);
        return users;
    }

    /**
     * 更新保存key的集合
     * @param keys
     * @param isAdd
     */
    updateFavoriteKeys(keys,isAdd){
        AsyncStorage.getItem(this.getTeamMembers,(error,result) => {
            if(!error){
                let favoriteKeys = [];
                if(result){
                    favoriteKeys = JSON.parse(result);
                }
                keys.map(key => {
                    let index = favoriteKeys.indexOf(key);
                    if(isAdd){
                        if(index === -1) favoriteKeys.push(key);
                    }else {
                        if(index !== -1) favoriteKeys.splice(index,1);
                    }
                });
                AsyncStorage.setItem(this.getTeamMembers,JSON.stringify(favoriteKeys));
            }
        })
    }

    /**
     * 获取所有key的集合
     * @returns {Promise<any> | Promise}
     */
    getFavoriteKeys(){
        return new Promise((resolve,reject) => {
            AsyncStorage.getItem(this.getTeamMembers,(error,result) => {
                if(!error){
                    try {
                        resolve(JSON.parse(result));
                    }catch (e) {
                        reject(error);
                    }
                }else{
                    reject(error);
                }
            })
        })
    }

    /**
     * 获取本地数据
     * @returns {Promise<any> | Promise}
     */
    fetchLocalData(){
        return new Promise((resolve,reject) => {
            this.getFavoriteKeys().then((keys) => {
                let items = [];
                if(keys){
                    AsyncStorage.multiGet(keys,(err,stores) => {
                        try {
                            stores.map((v) => {
                                let value = v[1];
                                value && items.push(JSON.parse(value));
                            });
                            resolve(items);
                        }catch (e) {
                            reject(e);
                        }
                    })
                }else{
                    resolve(false);
                }
            }).catch((e) => {
                reject(e);
            })
        })
    }

    /**
     * 获取网络数据
     * @returns {Promise<any> | Promise}
     */
    fetchNetData(){

        let getTeamMembers = new Promise((resolve,reject) => {
            nim.getTeamMembers({
                teamId: this.teamId,
                done: (error, responseData) => {
                    if (!error) {
                        resolve(responseData.members);
                    }else {
                        reject(error);
                    }
                }
            })
        });

        return getTeamMembers.then((members) => {
            return new Promise((resolve,reject) => {
                let accounts = [];
                let allUsers = [];
                members.map((v) => {
                    accounts.push(v.account);
                });
                let frequency = Math.ceil(accounts.length/150);
                for (let i=0;i<frequency;i++) {
                    let newAccounts = accounts.slice(i*150,150);
                    nim.getUsers({
                        accounts: newAccounts,
                        done: (error, users) => {
                            if (!error) {
                                allUsers = allUsers.concat(users);
                                if(i===(frequency-1)){
                                    allUsers = this.saveData(allUsers,members);
                                    resolve(allUsers);
                                }
                            }else {
                                reject(error);
                            }
                        }
                    })
                }
            });
        })

    }

}
