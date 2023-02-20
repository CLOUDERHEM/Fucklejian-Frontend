import MapComponent from "./component/MapComponent";
import {Component} from "react";

class App extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="App">
                <MapComponent/>
            </div>
        );
    }
}

export default App;
