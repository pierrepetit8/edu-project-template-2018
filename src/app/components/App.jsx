import React, {Component} from 'react';
import {MuiThemeProvider, createMuiTheme} from 'material-ui/styles';
import Reboot from 'material-ui/Reboot';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import Grid from 'material-ui/Grid';
import MenuIcon from 'material-ui-icons/Menu';
import Snackbar from 'material-ui/Snackbar';
import CloseIcon from 'material-ui-icons/Close';
import TableActionButtons from "./TableActionButtons";
import TableList from "./TableList";

const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#8e8e8e',
            main: '#616161',
            dark: '#373737',
            contrastText: '#fff',
        },
        secondary: {
            light: '#ffd149',
            main: '#FFA000',
            dark: '#c67100',
            contrastText: '#000',
        },
    },
});


function compare(a, b) {
    if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
    if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
    if (a.code.toLowerCase() < b.code.toLowerCase()) return -1;
    if (a.code.toLowerCase() > b.code.toLowerCase()) return 1;
    return 0;
}

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            episodes: [],
            note: 0,
            name: "",
            code: "",
            open: false,
            message: "",
            selected: [],
            rowCount: 0
        };

        this.render = this.render.bind(this);
    };


    componentDidMount() {
        this.populate();
    };

    populate() {
        fetch('/api/episodes')
            .then(response => response.json())
            .then(data => {
                data.sort(compare);
                this.setState({episodes: data, rowCount: data.length});
            });
    }


    handleClose(event, reason) {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({open: false});
    };

    render() {
        return (
            <div>
                <Reboot/>
                <MuiThemeProvider theme={theme}>
                    <div>
                        <AppBar position="static">
                            <Toolbar>
                                <IconButton color="secondary" aria-label="Menu">
                                    <MenuIcon/>
                                </IconButton>
                            </Toolbar>
                        </AppBar>
                        <Grid>
                            <TableList length={this.state.selected.length}
                                       state={this.state}
                                       setState={this.setState.bind(this)}/>
                            <TableActionButtons length={this.state.selected.length}
                                                state={this.state}
                                                setState={this.setState.bind(this)}
                                                populate={this.populate.bind(this)}/>
                        </Grid>
                        <Snackbar
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            color={'secondary'}
                            open={this.state.open}
                            autoHideDuration={6000}
                            onClose={(event, reason) => this.handleClose(event, reason)}
                            message={<h4>{this.state.message}</h4>}
                            action={[
                                <IconButton
                                    key="close"
                                    aria-label="Close"
                                    color="inherit"
                                    onClick={(event, reason) => this.handleClose(event, reason)}
                                >
                                    <CloseIcon/>
                                </IconButton>,
                            ]}
                        />

                    </div>
                </MuiThemeProvider>
            </div>
        );
    }
};
