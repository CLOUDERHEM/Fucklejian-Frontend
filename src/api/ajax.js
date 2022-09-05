import axios from "axios";
import {message} from "antd";

export default function ajax(url, data = {}, param = '', type = 'GET') {


    return new Promise((resolve, reject) => {
        let promise;

        console.log(data)
        console.log(param)
        console.log(type)
        if (type === 'GET') {
            promise = axios.get(url, {
                params: data
            })
        } else {
            promise = axios.post(`${url}?ak=${param}`, JSON.stringify(data), {
                headers: {
                    'content-type': 'application/json'
                }
            });
        }

        promise.then(response => {
            if (response.data.msg) {
                if (response.data.code !== 0) {
                    message.error(response.data.msg).then();
                } else {
                    message.success(response.data.msg).then();
                }
            }
            resolve(response.data)

        }).catch(error => {
            message.error(error.message);
        })
    })
}
