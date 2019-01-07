import {AsyncStorage} from 'react-native';
import Toast from "react-native-root-toast";

const HOST = 'http://10.0.2.2/';

export default class DataStore {
    /**
     * 获取网络数据
     * @param method
     * @param formData
     * @returns {Promise<any> | Promise}
     */
     static fetchData(method,formData,file){
        let url = HOST + method;
        return new Promise(function (resolve, reject) {
            fetch(url, {
                method: 'POST',
                credentials:'include',
                headers:  {
                    "Accept": "application/json",
                    "Content-Type": file ? "multipart/form-data" : "application/json",
                },
                body: file ? formData : JSON.stringify(formData)
            })
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                    console.log(response);
                    Toast.show('网络异常');
                    reject({status:response.status})
                })
                .then((response) => {
                    resolve(response);
                })
                .catch((err)=> {
                    Toast.show('网络异常');
                    reject({status:err});
                })
        })
    }

    /**
     * 保存数据
     * @param key
     * @param data
     * @param callback
     */
    static saveData(key,data,callback) {
        if(!data || !key) return;
        AsyncStorage.setItem(key,JSON.stringify(this._warpData(data)),callback)
    }

    static _warpData(data) {
        return {data:data,timestamp: new Date().getTime()}
    }

    /**
     * 获取本地数据
     * @param key
     * @returns {Promise<any> | Promise}
     */
    static fetchLocalData(key){
        return new Promise((resolve,reject) => {
            AsyncStorage.getItem(key,(error,result) => {
                if(!error){
                    try {
                        resolve(JSON.parse(result));
                    }catch (e) {
                        reject(e);
                        console.error(e);
                    }
                }else {
                    reject(error);
                    console.error(error);
                }
            })
        })
    }

}
