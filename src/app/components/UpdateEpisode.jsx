import React from 'react'

class UpdateEpisode extends React.Component {

    constructor(props) {
        super(props);
        this.state = {  
            id : props.id,
            name : '',
            code : '',
            score : ''
        };
    
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleCodeChange = this.handleCodeChange.bind(this);
        this.handleScoreChange = this.handleScoreChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
      }
    
      handleNameChange(event) {
        this.setState({name: event.target.value});
      }

      handleCodeChange(event) {
        this.setState({code: event.target.value});
      }

      handleScoreChange(event) {
        this.setState({score: event.target.value});
      }
    
      componentDidMount() {
        fetch('/api/episodes/' + this.state.id, {
            method: 'get',
            headers: {'Content-Type':'application/json'}
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            this.setState({
                name : data.name,
                code: data.code,
                score : data.score
            });
        });
    }

      handleSubmit(event) {
        event.preventDefault();
        fetch('/api/episodes/' + this.state.id, {
            method: 'patch',
            body: JSON.stringify({
                name: this.state.name,
                code: this.state.code,
                score: this.state.score
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log("salut" +data);
        });
      }
    
      render() {
        return (
          <form onSubmit={this.handleSubmit}>
            <label>
              Name:
              <input required="true" type="text" value={this.state.name} onChange={this.handleNameChange} />
            </label>
            <label>
              Code:
              <input type="text" required="true" value={this.state.code} onChange={this.handleCodeChange} />
            </label>
            <label>
              Score:
              <input type="number" required="true" value={this.state.score} onChange={this.handleScoreChange} />
            </label>
            <input type="submit" value="Submit" />
          </form>
        );
      }



    
}
export default UpdateEpisode;