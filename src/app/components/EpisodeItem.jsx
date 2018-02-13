import React from 'react'


const Episode = ({id, name, code, score}) => {
    return (<tr>
        <td>{name}</td>
        <td>{code}</td>
        <td>{score}</td>
        <td><button>Delete</button></td>
    </tr>);
}


export default Episode;