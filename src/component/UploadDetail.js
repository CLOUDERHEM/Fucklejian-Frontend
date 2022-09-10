import {Component, useRef} from "react";
import {
    Form, Input, Button, InputNumber, Popconfirm

} from 'antd';
import api from "../api/api";
import oneTrim from "../util/trim";
import swal from "sweetalert";
import React from "react";

class UploadDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            distance: this.props.distance,
            click: true
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            distance: nextProps.distance
        })
    }


    render() {
        const layout = {
            labelCol: {span: 5}, wrapperCol: {span: 17},
        };

        const onFinish = (values) => {

            values = oneTrim(values)

            if (values.routeLine === undefined || values.routeLine === '') {
                values.routeLine = this.props.routeLine
            } else {
                try {
                    values.routeLine = JSON.parse(values.routeLine)
                } catch (e) {
                    swal('跑步路线解析错误', '请检查JSON格式是否有误', 'error')
                    return
                }
                if (values.routeLine.length < 10) {
                    swal("标记点数量不够", "标记点数量最少为10个, 且路线最好合理且平滑", "error")
                    return
                }
            }
            this.setState({click: false})
            api.uploadDetail(values, values.ak).then(res => {
                setTimeout(() => {
                    this.setState({click: true})
                }, 2000)
                if (res.code !== 0) return
                let id = res.data.id

                let crc = setInterval(() => {
                    api.getResult(id, values.ak).then((res) => {
                        if (res.code !== 2) {
                            clearTimeout(crc)
                        }
                    })
                }, 1000)
            })
        };

        const validateMessages = {
            required: '${label} 必填!', types: {
                number: '${label} 不是数字!',
            }, number: {
                range: '${label} 必需在 ${min}.00 ~ ${max}.00 之间',
            },
        };

        return (<Form  {...layout}
                       onFinish={onFinish}
                       validateMessages={validateMessages}
        >
            <Form.Item
                name={['username']}
                label="手机号"
                rules={[{
                    required: true,
                },]}
            >
                <Input placeholder="手机号"/>
            </Form.Item>
            <Form.Item
                name={['password']}
                label="密码"
                rules={[{
                    required: true,
                },]}
            >
                <Input placeholder="密码"/>
            </Form.Item>
            <Form.Item
                tooltip={"1.00 ~ 3.00 km"}
                name={['mile']}
                label="跑步里程"
                rules={[{
                    type: 'number', min: 1, max: 3, required: true,
                },]}
            >
                <InputNumber/>
            </Form.Item>
            <Form.Item name={['routeLine']} label="跑步路线">
                <Input.TextArea placeholder="跑步路线, 需满足JSON格式, 如有标记路线则不填"/>
            </Form.Item>
            <Form.Item name={['ak']} label="邀请码" rules={[{required: true}]}>
                <Input placeholder="没有邀请码将无法提交任务"/>
            </Form.Item>
            <Form.Item wrapperCol={{...layout.wrapperCol, offset: 8}}>
                <Button type={'link'}
                        shape="round"
                        htmlType='submit'
                        disabled={!this.state.click}
                        style={{color: "#4682B4"}}>
                    点击上传
                </Button>
            </Form.Item>
        </Form>)
    }
}

export default UploadDetail
