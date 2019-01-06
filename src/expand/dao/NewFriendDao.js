import {AsyncStorage} from 'react-native';

export default class NewFriendDao {
    /**
     * 初始方法
     */
    constructor(){
        this.newFriends = 'newFriends'+globalAccount;
    }

    /**
     * 保存数据
     * @param value
     * @param callback
     */
    saveFavoriteItem(value,callback){
        let key = value.account+this.newFriends;
        value = JSON.stringify(value);
        AsyncStorage.setItem(key,value,(error) => {
            if(!error){
                this.updateFavoriteKeys(key,true);
            }
        })
    }

    /**
     * 删除数据
     * @param key
     */
    removeFavoriteItem(key){
        key = key+"";
        AsyncStorage.removeItem(key,(error,result) => {
            if(!error){
                this.updateFavoriteKeys(key,false);
            }
        })
    }

    /**
     * 更新保存key的集合
     * @param key
     * @param isAdd
     */
    updateFavoriteKeys(key,isAdd){
        AsyncStorage.getItem(this.newFriends,(error,result) => {
            if(!error){
                let favoriteKeys = [];
                if(result){
                    favoriteKeys = JSON.parse(result);
                }
                let index = favoriteKeys.indexOf(key);
                if(isAdd){
                    if(index === -1) favoriteKeys.push(key);
                }else {
                    if(index !== -1) favoriteKeys.splice(index,1);
                }
                AsyncStorage.setItem(this.newFriends,JSON.stringify(favoriteKeys));
            }
        })
    }

    /**
     * 获取所有key的集合
     * @returns {Promise<any> | Promise}
     */
    getFavoriteKeys(){
        return new Promise((resolve,reject) => {
            AsyncStorage.getItem(this.newFriends,(error,result) => {
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
     * 获取所有的数据
     * @returns {Promise<any> | Promise}
     */
    getAllItems(){
        return new Promise((resolve,reject) => {
            this.getFavoriteKeys().then((keys) => {
                let items = [];
                if(keys){
                    AsyncStorage.multiGet(keys,(err,stores) => {
                        try {
                            stores.map((v,i) => {
                                let value = v[1];
                                if(value) items.push(JSON.parse(value));
                            });
                            resolve(items);
                        }catch (e) {
                            reject(e);
                        }
                    })
                }
            }).catch((e) => {
                reject(e);
            })
        });
    }
}
