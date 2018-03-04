import React, {Component, PropTypes} from 'react';

import Table, {TableBody, TableCell, TableHead, TableRow} from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import {MuiThemeProvider, createMuiTheme} from 'material-ui/styles';
import Reboot from 'material-ui/Reboot';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import Grid from 'material-ui/Grid';
import MenuIcon from 'material-ui-icons/Menu';
import TextField from "material-ui/TextField/TextField";
import Button from 'material-ui/Button';
import Snackbar from 'material-ui/Snackbar';
import CloseIcon from 'material-ui-icons/Close';
import Checkbox from 'material-ui/Checkbox';

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

    handleAddClick(){
        if ( this.state.name !== "" && this.state.code !== "") {
            fetch('/api/episodes/', {
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    name: this.state.name,
                    code: this.state.code,
                    score: this.state.note
                })
            }).then((response) => {
                if (response.status === 201){
                    this.populate();
                }else{
                    this.setState({
                        message: "Une erreur du côté  du serveur s'est produite",
                        open: true
                    })
                }
            })
        }else{
            this.setState({
                message: "Les champs renseignés sont éronnés",
                open: true
            })
        }
    }
    
    handleRemoveClick(){
        let selected = this.state.selected;
        let promises = [];
        selected.forEach((episodeId)=>{
            promises.push(fetch('/api/episodes/' + episodeId, {
                method: 'delete',
            }));
        });

        Promise.all(promises).then((responses) => {
            this.populate();
            this.setState({selected: []})
        });
    }

    handleChangeClick(){
        if ( this.state.name !== "" && this.state.code !== "") {
            let episodeId = this.state.selected[0];
            fetch('/api/episodes/' + episodeId, {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    name: this.state.name,
                    code: this.state.code,
                    score: this.state.note
                })
            }).then((response) => {
                if (response.status === 201){
                    this.populate();
                }else{
                    console.log("error code: " + response.status);
                    console.log(response.body);
                    this.setState({
                        message: "Une erreur du côté  du serveur s'est produite",
                        open: true
                    })
                }
            })
        }else{
            this.setState({
                message: "Les champs renseignés sont éronnés",
                open: true
            })
        }
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
                            <Grid item xs={12}>
                                <Grid container justify="center">
                                    <Paper style={{width: 'auto', textAlign: 'center'}}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell padding="checkbox"><Checkbox onChange={(event, checked) => this.handleSelectAllClick(event, checked)} checked={this.state.rowCount === this.state.selected.length}/></TableCell>
                                                    <TableCell padding="none" style={{textAlign: 'flex-start'}}><h3>Name</h3>
                                                    </TableCell>
                                                    <TableCell style={{textAlign: 'center'}}><h3>Code</h3></TableCell>
                                                    <TableCell style={{textAlign: 'flex-end'}} numeric><h3>Note</h3>
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {this.state.episodes.map(episode => {
                                                    return (
                                                        <TableRow key={episode.id}>
                                                            <TableCell padding="checkbox" ><Checkbox onChange={() => this.handleClick(episode.id)} checked={this.isSelected(episode.id)}/></TableCell>
                                                            <TableCell padding="none" style={{textAlign: 'flex-start'}}>
                                                                <h4>{episode.name}</h4></TableCell>
                                                            <TableCell style={{textAlign: 'center'}}>
                                                                <h4>{episode.code}</h4></TableCell>
                                                            <TableCell style={{textAlign: 'flex-end'}}
                                                                       numeric><h4>{episode.score}</h4></TableCell>
                                                        </TableRow>
                                                    );
                                                })
                                                }
                                                <TableRow>
                                                    <TableCell padding="checkbox"/>
                                                    <TableCell padding="none" style={{textAlign: 'flex-start'}}>
                                                        <TextField
                                                            id="name"
                                                            label="name"
                                                            value={this.state.name}
                                                            onChange={this.handleChange('name')}
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                            margin="normal"
                                                        />
                                                    </TableCell>
                                                    <TableCell style={{textAlign: 'center'}}>
                                                        <TextField
                                                            id="code"
                                                            label="code"
                                                            value={this.state.code}
                                                            onChange={this.handleChange('code')}
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                            margin="normal"/>
                                                    </TableCell>
                                                    <TableCell style={{textAlign: 'flex-end'}} numeric>
                                                        <TextField
                                                            id="number"
                                                            label="Number"
                                                            value={this.state.note}
                                                            onChange={this.handleChange('note')}
                                                            type="number"
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                            margin="normal"/>
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </Paper>

                                </Grid>
                            </Grid>

                            <Grid container justify="center">
                                <Grid item xs={12} sm={1}>
                                    <Button variant="raised" color={'secondary'} onClick={() => this.handleAddClick()}>
                                        Ajouter Episode
                                    </Button>
                                </Grid>
                                <Grid item xs={12} sm={1}>
                                    <Button variant="raised"  disabled={this.state.selected.length !== 1} onClick={() => this.handleChangeClick()}>
                                        Modifier Episode
                                    </Button>
                                </Grid>
                                <Grid item xs={12} sm={1}>
                                    <Button variant="raised"  disabled={this.state.selected.length < 1} color={'primary'} onClick={() => this.handleRemoveClick()}>
                                        Supprimer Episode
                                    </Button>
                                </Grid>
                            </Grid>
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
