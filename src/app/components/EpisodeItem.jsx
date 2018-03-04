import React from 'react'
import {Checkbox, TableCell, TableRow} from "material-ui";


const Episode = (props) => {
    return (
        <TableRow key={props.episode.id}>
            <TableCell padding="checkbox"><Checkbox onChange={() => props.handleClick(props.episode.id)} checked={props.isSelected(props.episode.id)}/></TableCell>
            <TableCell padding="none" style={{textAlign: 'flex-start'}}><h4>{props.episode.name}</h4></TableCell>
            <TableCell style={{textAlign: 'center'}}><h4>{props.episode.code}</h4></TableCell>
            <TableCell style={{textAlign: 'flex-end'}} numeric><h4>{props.episode.score}</h4></TableCell>
        </TableRow>
    );
};


export default Episode;