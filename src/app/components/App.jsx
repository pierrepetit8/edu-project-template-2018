import React, { Component, PropTypes } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import { Provider } from 'react-redux';
import configure from './store';
import EpisodeList from './EpisodeList';
import AddEpisode from './AddEpisode';

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



export default class App extends Component {
    render() {
        return (
            <div>
            <Header/>
            <Provider store={store}>
                <div>
                    <EpisodeList/>
                    <AddEpisode/>
                </div>
            </Provider>
            </div>
        );
    }
};
