import React, { Component, PropTypes } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import { Provider } from 'react-redux';
import configure from './store';

const store = configure();

class Yolo extends Component {
    render() {
        return(<h1>Hello World  !!</h1>);
    }
};

class Swag extends Component {
    render() {
        return(<div></div>);
    }
};

class Header extends Component {
    render() {
        return(<div className="header">
                <nav className="navbar navbar-inverse navbar-fixed-top">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <a className="navbar-brand" href="#">Netfloxe</a>
                        </div>
                    </div>
                </nav>
            </div>);
    }
};

class ListeSerie extends Component {
    
    constructor() {
        super();
        this.episodes= {};
    };
    componentDidMount() {
        fetch('/api/episodes')
        .then(response => response.json())
        .then(data => this.episodes = data);
    }
    render() {
        return(<div>
           

        </div>);
    }
}

export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Router>
                  <div>
                      <Header></Header>
                    <Route path="/" component={ListeSerie}>
                    </Route>
                    <Route path="/new" component={Swag}>
                    </Route>
                  </div>
                </Router>
            </Provider>
        );
    }
};
