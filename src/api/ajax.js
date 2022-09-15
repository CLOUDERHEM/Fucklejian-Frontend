import axios from "axios";
import {message} from "antd";
import sha1 from 'js-sha1'

function ajax(url, data = {}, param = {}, type = 'GET') {

    const salt = '8292af46b29830b1d7b9275f8233b0594f67d6e5';

    return new Promise((resolve, reject) => {
        let promise;

        let ga = "" + (new Date().getTime() / 1000).toFixed(0);
        let he = url;
        let ak;
        if (type === 'GET') {
            ak = data.ak === undefined ? '' : data.ak;
        } else {
            ak = param.ak;
        }
        let headers = {
            'x-lc-ga': sha1(ga + salt),
            'x-lc-ak': sha1(ak + salt),
            'x-lc-he': sha1(he + salt),
            'x-lc-timestamp': new Date().getTime(),
            // 下面是没有用的
            'x-lc-gb': sha1(new Date().getTime() + 'afsjgio' + salt),
            'x-lc-gc': sha1(new Date().getTime() + 'aadfa' + salt),
            'x-lc-bk': sha1(new Date().getTime() + 'jdifa' + salt),
            'x-lc-hf': sha1(Math.random() * 1010 + 1 + salt),
            'x-lc-url': url,
            'x-lc-id': Math.round(Math.random() * 1010),
            'x-lc-csrf': sha1(new Date().getTime() + 'sdfhjk' + salt),
            'x-lc-auth': sha1(Math.random() * 100 + 'sdf'),
            'x-lc-ip': 0,
            'content-type': 'application/json'
        }
        if (type === 'GET') {
            promise = axios.get(url, {
                params: data,
                headers
            })
        } else {
            promise = axios.post(`${url}?ak=${param.ak}`, JSON.stringify(data), {
                headers
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
            resolve(response.data);

        }).catch(error => {
            message.error(error.message);
        })
    })
}

export default ajax;
