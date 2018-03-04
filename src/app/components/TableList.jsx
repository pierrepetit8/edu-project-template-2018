import {Grid, Paper, Table, TableBody} from "material-ui";
import React from "react";
import Episode from "./EpisodeItem";
import TableHeader from "./TableHeader";
import TableChangeRow from "./TableChangeRow";


const TableList = (props) => {

    const state = props.state;
    const setState = props.setState;

    function handleChange(name) {
        return (event) => {
            setState({
                [name]: event.target.value,
            });
        };
    }

    function handleSelectAllClick(event, checked) {
        if (checked) {
            state.episodes.map((episode) => {
                if (!isSelected(episode.id)) {
                    state.selected.push(episode.id);
                }
            });
            setState({selected: state.selected});
            return;
        }
        setState({selected: []});
    }

    function handleClick(id) {
        let selected = state.selected;
        let index = selected.indexOf(id);
        if (index !== -1) {
            selected.splice(index, 1);
        } else {
            selected.push(id);
        }
        if (selected.length === 1) {
            const episode = state.episodes.find((e) => {
                return e.id === selected[0];
            });

            setState({
                note: episode.score,
                name: episode.name,
                code: episode.code,
            })
        }
        setState({selected: selected})
    }

    function isSelected(id) {
        return state.selected.includes(id);
    }

    return (
        <Grid container justify="center">
            <Grid item xs={6}>
                <Paper style={{width: 'auto', textAlign: 'center'}}>
                    <Table>
                        <TableHeader handleSelectAllClick={handleSelectAllClick.bind(this)}
                                     length={props.length}
                                     rowCount={state.rowCount}/>
                        <TableBody>
                            {state.episodes.map(episode => {
                                return (<Episode key={episode.id} episode={episode} handleClick={handleClick.bind(this)}
                                                 isSelected={isSelected.bind(this)}/>);
                            })}
                            <TableChangeRow name={state.name}
                                            note={state.note}
                                            code={state.code}
                                            handleChange={handleChange.bind(this)}/>
                        </TableBody>
                    </Table>
                </Paper>

            </Grid>
        </Grid>
    );
};


export default TableList;