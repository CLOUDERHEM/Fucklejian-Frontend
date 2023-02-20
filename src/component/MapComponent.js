import AMapLoader from '@amap/amap-jsapi-loader';
import {Component} from "react";
import swal from 'sweetalert'
import '../App.css';
import './index.css'
import {Button, Input, Modal} from "antd";
import UploadDetail from "./UploadDetail";
import download from "../util/download";
import debounce from "../util/click";

class MapComponent extends Component {
    constructor(props) {
        super(props)
        this.autoComplete = {}
        this.mouseTool = {}
        this.center = [104.185574, 30.827591]
        this.autoOptions = {
            city: '全国'
        }
        this.amap = {}
        this.state = {
            positions: [],
            overlays: [],
            isModalOpen: false,
            inputPos: '',
            inputAk: '',
            distance: 0
        }
    }

    componentDidMount() {
        AMapLoader.load({
            key: "1791c24065505cd8d403ec3cc54b8fb2",
            version: "2.0",
            plugins: ['AMap.MouseTool', 'AMap.AutoComplete'],
        }).then((AMap) => {
                this.amap = AMap
                this.init()
            }
        ).catch(e => {
                console.log(e);
            }
        )
    }

    // 地址跳转
    forward = () => {
        let keywords = this.state.inputPos;
        if (keywords === undefined || keywords === '') {
            swal("还没有输入地址呢!", "", 'error').then()
            return
        }
        this.autoComplete.search(keywords, (status, result) => {
            if (status !== "complete") {
                swal("没有找到该地址", "", 'error').then()
                return;
            }
            let location = result.tips[0].location;
            this.center = [location.lng, location.lat]
            this.init()
        })
    }

    init = () => {
        this.map = new this.amap.Map("container", {
            zoom: 15,
            center: this.center,
        });
        this.mouseTool = new this.amap.MouseTool(this.map);
        this.mouseTool.on('draw', (e) => {

            // let last = this.state.positions.at(-1) 浏览器兼容问题
            let last = this.state.positions[this.state.positions.length - 1]
            let isValid = true
            if (last !== undefined) {
                let add = this.amap.GeometryUtil.distance(
                    [e.obj.getPosition().lng, e.obj.getPosition().lat],
                    [last.longitude, last.latitude]);
                // 距离小于两米的点不加入集合
                if (add < 2) {
                    isValid = false
                } else {
                    let distance = this.state.distance + add
                    this.setState({distance})
                }
            }
            if (isValid) {
                this.state.positions.push({
                    'latitude': e.obj.getPosition().lat,
                    'longitude': e.obj.getPosition().lng
                })
            }
            this.state.overlays.push(e.obj);
        })
        this.mouseTool.marker({});
        // for search
        this.autoComplete = new this.amap.AutoComplete(this.autoOptions);
        this.clear()
    }

    clear = () => {
        this.setState({positions: []})
        this.map.remove(this.state.overlays)
        this.setState({overlays: []})
        this.setState({distance: 0})
    }

    exportData = () => {
        if (this.state.positions.length === 0) {
            swal("你还没有标记点呢!", '', "error").then();
            return
        } else if (this.state.positions.length < 10) {
            swal("有效标记点数量不够", "标记点数量最少为10个, 且路线最好合理且平滑", "error").then();
            return
        }
        download.downloadFile(`${new Date().getTime()}.path.json`, this.state.positions)
    }

    handelChangePos(e) {
        this.setState({
            inputPos: e.target.value
        })
    }

    handelChangeAK(e) {
        this.setState({
            inputAk: e.target.value
        })
    }

    render() {

        const showModal = () => {
            if (this.state.positions.length === 0) {
                swal("没有标点!", '请确认接下来填入的自定义路径合理!', "warning").then();
            } else if (this.state.positions.length < 10) {
                swal("有效标记点数量不够", "有效标记点数量最少为10个, 且路线最好合理且平滑", "error").then();
                return
            }
            if (this.state.distance > 10 * 1000) {
                swal("距离过长!", "标记里程最大为5km", "error").then();
                return;
            }
            this.setState({isModalOpen: true})
        };

        const handleOk = () => {
            this.setState({isModalOpen: false})
        };

        const handleCancel = () => {
            this.setState({isModalOpen: false})
        };

        return (
            <div>
                <div id="container" className="map"/>
                <div className={"info info1"}>操作说明：按路线顺序标记 点勿过稀或过密</div>
                <div className={"info info2"}>
                    <Input placeholder="目标地址跳转" onChange={this.handelChangePos.bind(this)}/>
                    <Button type="link" onClick={debounce(this.forward)}>点击跳转</Button>
                </div>
                <div className="input-card input-card1">
                    <div className={"input-item"}>
                        <input type="radio" checked={true} readOnly={true}/><span
                        className="input-text">画点</span>
                        <span className={"mile"}>{(this.state.distance / 1000).toFixed(2)} km</span>
                    </div>
                    <div className="input-item">
                        <input id="clear" type="button" className={"btn"} onClick={this.clear} value="清除所有"/>
                        <input id="export" type="button" className={"btn"} onClick={debounce(this.exportData)}
                               value="导出路线"/>
                        <input id="upload" type="button" className={"btn"} onClick={showModal} value="点击上传"/>
                        <Modal title="Upload"
                               footer=''
                               open={this.state.isModalOpen}
                               onOk={handleOk}
                               onCancel={handleCancel}>
                            <UploadDetail routeLine={this.state.positions} distance={this.state.distance}/>
                        </Modal>
                    </div>
                </div>
            </div>

        );
    }
}

export default MapComponent;
