import {Component} from "react";
import {
    Form, Input, Button, InputNumber

} from 'antd';
import api from "../api/api";
import oneTrim from "../util/trim";
import swal from "sweetalert";

class UploadDetail extends Component {


    render() {
        const layout = {
            labelCol: {span: 5}, wrapperCol: {span: 16},
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
            api.uploadDetail(values, values.ak).then(res => {
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
            required: '${label} is required!',
            types: {
                number: '${label} is not a valid number!',
            },
            number: {
                range: '${label} must be between ${min} and ${max}',
            },
        };
        return (<Form {...layout} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>
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
                name={['mile']}
                label="跑步里程"
                rules={[{
                    type: 'number', min: 1, max: 3, defaultField: 1.23, required: true,
                },]}
            >
                <InputNumber/>
            </Form.Item>
            <Form.Item name={['routeLine']} label="跑步路线">
                <Input.TextArea placeholder="跑步路线, 需满足JSON格式, 如有标记路线则不填"/>
            </Form.Item>
            <Form.Item name={['ak']} label="邀请码" rules={[{required: true}]}>
                <Input placeholder="没有邀请将无法提交任务"/>
            </Form.Item>
            <Form.Item name={['schoolName']} label="学校名称">
                <Input placeholder="可不填"/>
            </Form.Item>
            <Form.Item name={['schoolId']} label="学校ID">
                <Input placeholder="可不填"/>
            </Form.Item>
            <Form.Item wrapperCol={{...layout.wrapperCol, offset: 8}}>
                <Button type="link" htmlType="submit">
                    点击上传
                </Button>
            </Form.Item>
        </Form>)
    }
}

export default UploadDetail
