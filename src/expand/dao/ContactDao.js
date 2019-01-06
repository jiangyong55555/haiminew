import {AsyncStorage} from 'react-native';

export default class ContactDao {
    /**
     * 初始方法
     */
    constructor(){
        this.getFriends = 'getFriends'+globalAccount;
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
     * @param users
     * @param accounts
     * @param callback
     */
    saveData(users,accounts,callback) {
        if(!users || !accounts) return;
        let newUsers = [];
        users.map((v) => {
            newUsers.push([v.account,JSON.stringify(v)]);
        });
        AsyncStorage.multiSet(newUsers,callback);
        this.updateFavoriteKeys(accounts,true);
    }

    /**
     * 更新保存key的集合
     * @param keys
     * @param isAdd
     */
    updateFavoriteKeys(keys,isAdd){
        AsyncStorage.getItem(this.getFriends,(error,result) => {
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
                AsyncStorage.setItem(this.getFriends,JSON.stringify(favoriteKeys));
            }
        })
    }

    /**
     * 获取所有key的集合
     * @returns {Promise<any> | Promise}
     */
    getFavoriteKeys(){
        return new Promise((resolve,reject) => {
            AsyncStorage.getItem(this.getFriends,(error,result) => {
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
                }else {
                    reject(false);
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

        let getFriends = new Promise(function (resolve,reject) {
            nim.getFriends({
                done:(error, responseData) => {
                    if (!error) {
                        resolve(responseData);
                    }else {
                        reject(error);
                    }
                }
            })
        });

        return getFriends.then((data) => {
            return new Promise((resolve,reject) => {
                let accounts = [];
                let allUsers = [];
                data.map((v) => {
                    accounts.push(v.account);
                });
                let frequency = Math.ceil(accounts.length/150);
                for(let i=0;i<frequency;i++){
                    let newAccounts = [...accounts].splice(i*150,150);
                    nim.getUsers({
                        accounts: newAccounts,
                        done: (error, users) => {
                            if(!error){
                                allUsers = allUsers.concat(users);
                                if(i===(frequency-1)){
                                    this.saveData(allUsers,accounts);
                                    resolve(allUsers);
                                }
                            }else {
                                reject(error);
                            }
                        }
                    })
                }
            })
        })

    }

}
