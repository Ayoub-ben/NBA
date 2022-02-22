import React, {Component} from 'react';
import axios from "axios";

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      playerName: null,
      playerStats: {},
      gameStats: null
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.getPlayerId();
    console.log(this.state.playerName);
  }

  handleChange = (event) => {
    const replace = event.target.value.split(" ").join("_");
    if (replace.length > 0){
        this.setState({playerName: replace})
    } else{
      alert("nom du joueur"); 
    }
  }

    getPlayerId = () => {
      axios.get(`https://www.balldontlie.io/api/v1/players?search=${this.state.playerName}`)
      .then(async res => {
        console.log(res.data.data);
        if(res.data.data[0] === undefined){
          alert("il est bless ou n'a pas joue");
        } else if(res.data.data.length > 1){
          alert("rentre le nom ou je vais m'enerver");
        } else{
          await this.getPlayerStats(res.data.data[0].id);

        }
      }).catch(err => {
        console.log(err)
      })
    }
  
    getPlayerStats = (playerId) =>{
      axios.get(`https://www.balldontlie.io/api/v1/season_averages?season=2021&player_ids[]=${playerId}`)
      .then(async res=> {
        console.log(res.data.data)
        this.setState({ playerStats: res.data.data[0]})
      }).catch(err => {
        console.log(err)
      })
    }


    getPlayerGame = () => {
      axios.get(`https://www.balldontlie.io/api/v1/games?seasons[]=2018&team_ids[]=1`)
      .then(async res=> {
        console.log(res.data.data)
        this.setState({ gameStats: res.data.data[0]})
      }).catch(err => {
        console.log(err)
      })
    }



  
 render(){
  return (
    <div className="App">
     <form onSubmit={this.handleSubmit}>
       <label>
         Name
         <input 
          type="text"
          value={this.state.value}
          onChange={this.handleChange}
          placeholder="please enter players name"
         />
       </label>
       <input type="submit" value="Submit"/>
     </form>
     games played: {this.state.playerStats["games_played"]}
     <br />
     points averaged: {this.state.playerStats["pts"]}
     <br />
     rebounds averaged: {this.state.playerStats["reb"]}
     <br />
     assists averaged: {this.state.playerStats["ast"]}
    </div>
  );
}
}

export default App;
