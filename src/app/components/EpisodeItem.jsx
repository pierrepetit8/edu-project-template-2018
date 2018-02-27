import React from 'react'
import DeleteEpisode from './DeleteEpisode';
import UpdateEpisode from './UpdateEpisode';


const Episode = ({id, name, code, score}) => {
    return (<tr>
        <td>{name}</td>
        <td>{code}</td>
        <td>{score}</td>
        <td> <UpdateEpisode id={id}/></td>
    </tr>);
}


export default Episode;