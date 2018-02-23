import React from 'react'


class DeleteEpisode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {  
            id : props.id 
        };
        this.handleDeleteEp = this.handleDeleteEp.bind(this);
    }
    
    handleDeleteEp(event) {
        fetch('/api/episodes/' + this.state.id, {
            method: 'delete',
            headers: {'Content-Type':'application/json'},
        })
        .then(response => response.json())
        .then(data => {
            console.log("salut" +data);
        });
    }


    render() {
        return (
            <div><button type='button' onClick={this.handleDeleteEp}>Supprimer episode</button></div>
        );
    }
}


export default DeleteEpisode;