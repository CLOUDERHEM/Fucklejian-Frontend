// import './App.css';
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


    componentDidMount() {
        api.queryNotice().then(res => {
            if (res.code !== 0 || res.code.show === 0) {
                return
            }
            if (res.data.show === 0) {
                this.setState({show: false})
            }
            if (res.data.type === 0) {
                setTimeout(() => {
                    message.success(res.data.msg)
                }, 1200)
            } else if (res.data.type === 1) {
                setTimeout(() => {
                    message.error(res.data.msg)
                }, 1200)
            } else if (res.data.type === 2) {
                setTimeout(() => {
                    notification.open({
                        message: res.data.title,
                        description: res.data.msg,
                        onClick: () => {
                            // console.log('Notification Clicked!');
                        },
                        placement: 'bottomLeft'
                    });
                }, 1200)
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
