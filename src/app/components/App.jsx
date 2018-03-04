import React, {Component} from 'react';

import Table, {TableBody} from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import {MuiThemeProvider, createMuiTheme} from 'material-ui/styles';
import Reboot from 'material-ui/Reboot';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import Grid from 'material-ui/Grid';
import MenuIcon from 'material-ui-icons/Menu';
import Button from 'material-ui/Button';
import Snackbar from 'material-ui/Snackbar';
import CloseIcon from 'material-ui-icons/Close';
import Episode from "./EpisodeItem";
import TableHeader from "./TableHeader";
import TableChangeRow from "./TableChangeRow";
import TableActionButtons from "./TableActionButtons";

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

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
    },
    table: {
        minWidth: 700,
    },
});

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
                this.setState({episodes: data, rowCount: data.length});
            });
    }

    handleChange(name) {
        return (event) => {
            this.setState({
                [name]: event.target.value,
            });
        };
    }

    handleClose(event, reason) {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({open: false});
    };

    handleSelectAllClick(event, checked){
        if (checked) {
            this.state.episodes.map((episode)=>{
                if (!this.isSelected(episode.id)){
                    this.state.selected.push(episode.id);
                }
            });
            this.setState({selected : this.state.selected});
            return;
        }
        this.setState({ selected: [] });
    };

    handleClick(id){
        let selected = this.state.selected;
        let index = selected.indexOf(id)
        if (index !== -1){
            selected.splice(index,1);
        }else{
            selected.push(id);
        }
        if(selected.length === 1){
            const episode = this.state.episodes.find((e) =>{
                return e.id === selected[0];
            });

            this.setState({
                note: episode.score,
                name: episode.name,
                code: episode.code,
            })
        }
        this.setState({selected: selected})
    }


    isSelected(id){
        return this.state.selected.includes(id);
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
                            <Grid container justify="center">
                                <Grid item xs={6}>
                                    <Paper style={{width: 'auto', textAlign: 'center'}}>
                                        <Table>
                                            <TableHeader handleSelectAllClick={this.handleSelectAllClick.bind(this)}
                                                         length={this.state.selected.length}
                                                         rowCount={this.state.rowCount}/>
                                            <TableBody>
                                                {this.state.episodes.map(episode => {
                                                    return ( <Episode key={episode.id} episode={episode} handleClick={this.handleClick.bind(this)} isSelected={this.isSelected.bind(this)}/>);
                                                })}
                                                <TableChangeRow name={this.state.name}
                                                                note={this.state.note}
                                                                code={this.state.code}
                                                                handleChange={this.handleChange.bind(this)}/>
                                            </TableBody>
                                        </Table>
                                    </Paper>

                                </Grid>
                            </Grid>

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
                            message={<h2>{this.state.message}</h2>}
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
