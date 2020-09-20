import React, {Component} from 'react'
import Login from "./Login";
import {Router, Route} from "react-router-dom";
import {createBrowserHistory as createHistory} from 'history';


const history = createHistory()


class App extends Component {


    render() {
        return (
            <Router history={history}>
                <Route path="/Client" exact component={Login}/>
            </Router>
        );
    }
}

export default App