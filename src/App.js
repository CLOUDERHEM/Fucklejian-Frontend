import MapComponent from "./component/MapComponent";
import api from "./api/api";
import {message, notification, Result} from "antd";
import {Component} from "react";

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            show: true
        }
    }

    delayMessage = (msg, type, time,) => {
        setTimeout(() => {
            if (type === 1) {
                message.error(msg).then()
            } else {
                message.success(msg).then()
            }
        }, time)

    }

    componentDidMount() {
        api.queryNotice().then(res => {
            if (res.code !== 0) {
                return
            }
            if (res.data.show === 0) {
                this.setState({show: false})
                return
            }
            if (res.data.type === 2) {
                setTimeout(() => {
                    notification.open({
                        message: res.data.title,
                        description: res.data.msg,
                        placement: 'bottomLeft'
                    });
                }, 1200)
            } else {
                this.delayMessage(res.data.msg, res.data.type, 1200)
            }

        })
    }

    render() {

        if (!this.state.show) {
            return <Result
                status="404"
                title="404"
                subTitle="Sorry, The page can not be found"
            />
        }
        return (
            <div className="App">
                <MapComponent/>
            </div>
        );
    }
}

export default App;
