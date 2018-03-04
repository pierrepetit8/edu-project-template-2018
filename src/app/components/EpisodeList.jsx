import React from 'react'
import Episode from './EpisodeItem' 

class EpisodeList extends React.Component {
    
    constructor() {
        super();
        this.state = {
            episodes: []
        };
    };
    componentDidMount() {
        fetch('/api/episodes/')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            console.log("yo !");
            this.setState({episodes : data});
        });
    }
    render() {
        return(<div>
            <table className="table">
            <th>Name</th>
            <th>Code</th>
            <th>Score</th>
           { this.state.episodes.map(function(episode) {
               return <Episode id={episode.id} name={episode.name} code={episode.code} score={episode.score}/>;
           }) }
           </table>
        </div>);
    }
}


export default EpisodeList;