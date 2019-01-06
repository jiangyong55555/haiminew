import {AsyncStorage} from 'react-native';

export default class GroupDao {
    /**
     * 初始方法
     */
    constructor(){
        this.getTeams = 'getTeams'+globalAccount;
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
     * @param data
     * @param callback
     */
    saveData(data,callback) {
        if(!data) return;
        let newUsers = [];
        let accounts = [];
        data.map((v) => {
            let teamId = v.teamId.toString();
            newUsers.push([teamId,JSON.stringify(v)]);
            accounts.push(teamId);
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
        AsyncStorage.getItem(this.getTeams,(error,result) => {
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
                AsyncStorage.setItem(this.getTeams,JSON.stringify(favoriteKeys));
            }
        })
    }

    /**
     * 获取所有key的集合
     * @returns {Promise<any> | Promise}
     */
    getFavoriteKeys(){
        return new Promise((resolve,reject) => {
            AsyncStorage.getItem(this.getTeams,(error,result) => {
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
        return new Promise((resolve,reject) => {
            nim.getTeams({
                done: (error, responseData) => {
                    if (!error) {
                        this.saveData(responseData);
                        resolve(responseData);
                    }else {
                        reject(error);
                    }
                }
            });
        })
    }

}
