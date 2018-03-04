import {Button, Grid} from "material-ui";
import React from "react";


const TableActionButtons = (props) => {

    const state = props.state;
    const populate = props.populate;
    const setState = props.setState;
    const length = props.length;

    function handleAddClick () {
        if (state.name !== "" && state.code !== "") {
            fetch('/api/episodes/', {
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    name: state.name,
                    code: state.code,
                    score: state.note
                })
            }).then((response) => {
                if (response.status === 201) {
                    populate();
                } else {
                    setState({
                        message: "Une erreur du côté  du serveur s'est produite",
                        open: true
                    })
                }
            })
        } else {
            setState({
                message: "Les champs renseignés sont éronnés",
                open: true
            })
        }
    }

    function handleRemoveClick () {
        let selected = state.selected;
        let promises = [];
        selected.forEach((episodeId) => {
            promises.push(fetch('/api/episodes/' + episodeId, {
                method: 'delete',
            }));
        });

        Promise.all(promises).then((responses) => {
            populate();
            setState({selected: []})
        });
    }

    function handleChangeClick () {
        if (state.name !== "" && state.code !== "") {
            let episodeId = state.selected[0];
            fetch('/api/episodes/' + episodeId, {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    name: state.name,
                    code: state.code,
                    score: state.note
                })
            }).then((response) => {
                if (response.status === 201) {
                    populate();
                } else {
                    setState({
                        message: "Une erreur du côté  du serveur s'est produite",
                        open: true
                    })
                }
            })
        } else {
            setState({
                message: "Les champs renseignés sont éronnés",
                open: true
            })
        }
    }

    return (
        <Grid container justify="center">
            <Grid item xs={12} sm={1}>
                <Button variant="raised" color={'secondary'} onClick={() => handleAddClick()}>
                    Ajouter Episode
                </Button>
            </Grid>
            <Grid item xs={12} sm={1}>
                <Button variant="raised" disabled={length !== 1} onClick={() => handleChangeClick()}>
                    Modifier Episode
                </Button>
            </Grid>
            <Grid item xs={12} sm={1}>
                <Button variant="raised" disabled={length < 1} color={'primary'} onClick={() => handleRemoveClick()}>
                    Supprimer Episode
                </Button>
            </Grid>
        </Grid>
    );
};


export default TableActionButtons;