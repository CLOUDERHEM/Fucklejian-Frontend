import AMapLoader from '@amap/amap-jsapi-loader';
import {Component, useState} from "react";
import swal from 'sweetalert'
import '../App.css';
import './index.css'
import {Button, Input, Modal} from "antd";
import UploadDetail from "./UploadDetail";
import download from "../util/download";

class MapComponent extends Component {
    constructor() {
        super()
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
            draw: 1,
            isModalOpen: false,
            inputPos: ''
        }
    }

    componentDidMount() {
        AMapLoader.load({
            key: "1791c24065505cd8d403ec3cc54b8fb2",
            version: "2.0",
            plugins: ['AMap.MouseTool', 'AMap.AutoComplete'],
        }).then((AMap) => {
                this.amap = AMap
                this.map = new AMap.Map("container", {
                    zoom: 15,
                    center: this.center,
                });
                this.mouseTool = new AMap.MouseTool(this.map);
                this.mouseTool.on('draw', (e) => {
                    // console.log(e.obj._position)
                    this.state.positions.push({
                        'latitude': e.obj.getPosition().lat,
                        'longitude': e.obj.getPosition().lng
                    })
                    this.state.overlays.push(e.obj);
                })
                this.mouseTool.marker({});

                AMap.plugin('AMap.Autocomplete', () => {
                    this.autoComplete = new AMap.AutoComplete(this.autoOptions);
                })
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
            if (result.count <= 0) {
                swal("没有找到改地址", "", 'error').then()
                return;
            }
            let location = result.tips[0].location;
            let center = [location.lng, location.lat]
            this.map = new this.amap.Map("container", {
                zoom: 15,
                center: center,
            });
            this.mouseTool = new this.amap.MouseTool(this.map);
            this.mouseTool.on('draw', (e) => {
                // console.log(e.obj._position)
                this.state.positions.push({
                    'latitude': e.obj.getPosition().lat,
                    'longitude': e.obj.getPosition().lng
                })
                this.state.overlays.push(e.obj);
            })
            this.mouseTool.marker({});
        })
    }

    clear = () => {
        this.setState({positions: []})
        this.map.remove(this.state.overlays)
        this.setState({overlays: []})
    }

    exportData = () => {
        if (this.state.positions.length === 0) {
            swal("你还没有标记点呢!", '', "error").then();
            return
        } else if (this.state.positions.length < 10) {
            swal("标记点数量不够", "标记点数量最少为10个, 且路线最好合理且平滑", "error").then();
            return
        }
        download.downloadFile(`Path-${new Date().getTime()}.bak.json`, this.state.positions)
    }

    handelChange(e) {
        this.setState({
            inputPos: e.target.value
        })
    }

    render() {

        const showModal = () => {
            if (this.state.positions.length === 0) {
                swal("没有标点!", '请确认接下来填入的路径合理!', "warning").then();
            } else if (this.state.positions.length < 10) {
                swal("标记点数量不够", "标记点数量最少为10个, 且路线最好合理且平滑", "warning").then();
                return
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
                <div id="container" className="map" style={{height: '800px'}}/>
                <div className={"info"}>操作说明：标点按路线顺序标记 跨度不能太大</div>
                <div className={"info info2"}>
                    <Input placeholder="输入目标区域地址" onChange={this.handelChange.bind(this)}/>
                    <Button type="link" onClick={this.forward}>点击跳转</Button>
                </div>
                <div className="input-card" style={{width: '25rem'}}>
                    <div className={"input-item"}>
                        <input type="radio" checked="true"/><span
                        className="input-text">画点</span>
                    </div>
                    <div className="input-item">
                        <input id="clear" type="button" className={"btn"} onClick={this.clear} value="清除所有"/>
                        <input id="export" type="button" className={"btn"} onClick={this.exportData} value="导出路线"/>
                        <input id="upload" type="button" className={"btn"} onClick={showModal} value="点击上传"/>
                        <Modal title="Upload" open={this.state.isModalOpen} onOk={handleOk}
                               onCancel={handleCancel}>
                            <UploadDetail routeLine={this.state.positions}/>
                        </Modal>
                    </div>
                </div>
            </div>

        );
    }
}

export default MapComponent;
