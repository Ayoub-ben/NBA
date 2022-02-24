import React, {Component} from 'react';
import axios from "axios";
import dateFormat from "dateformat"

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      playerName: null,
      teamId: null,
      playerStats: {},
      infoJoueur: {},
      lastMatch: null,
      gameStats: null
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();

    this.getPlayerId();
    this.getinfoJoueur();

    console.log(this.state.playerName);
    console.log(this.state.gameStats);
    console.log(this.state.teamId)

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
          alert("il est blessé ou n'a pas joue");
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


    getGame = () => {
      axios.get(`https://www.balldontlie.io/api/v1/games?seasons[]=2021&team_ids[]=${this.state.teamId}&per_page=50`)
      .then(async res=> {


        //recup dernière date
        let matchtampon=res.data.data[0];
        let datetampon=res.data.data[0]?.date;
        for(let i=1; i < res.data.data?.length; i++){
        //console.log("Toutes les dates :" + res.data.data[i]?.date)

            if(datetampon<res.data.data[i]?.date){
                datetampon=res.data.data[i]?.date;
                matchtampon=res.data.data[i];
            }
            this.setState({  lastMatch : matchtampon})
        }

        
        /**let tabMatchTriee=res.data.data.sort()
          for(let i=1; i < tabMatchTriee.length; i++){
            console.log("Toutes les dates :" + tabMatchTriee[i]?.date)
          }
        */
        //test
        console.log(res.data.data)

        //COMPARE 2 premières dates Test
         let date1 = new Date(res.data.data[0]?.date);
         console.log("date 1 " + dateFormat(res.data.data[0]?.date, "dd/mm/yyyy"))
         let date2 = new Date(res.data.data[1]?.date);
         console.log("date 2 " + dateFormat(res.data.data[1]?.date, "dd/mm/yyyy"))
           if(date1 > date2){
             console.log('date1 est supérieur à date2');
           }
           else{
           console.log('date1 est inferieur à date2');
           }


        this.setState({ gameStats: res.data.data})
      }).catch(err => {
        console.log(err)
      })
    }

    getinfoJoueur = () => {
      axios.get(`https://www.balldontlie.io/api/v1/players?search=${this.state.playerName}`)
      .then(async res=> {
        console.log(res.data.data)
        this.setState({ infoJoueur: res.data.data[0]})
        this.setState({ teamId : res.data.data[0]["team"]?.id})
        this.getGame();
        //console.log("Team id "+res.data.data[0]["team"]?.id + " Ville team " + res.data.data[0]["team"]?.city)
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
     <br/>
     Information joueur : {this.state.infoJoueur?.last_name} {this.state.infoJoueur?.first_name}
     <br/>
     Poste : {this.state.infoJoueur?.position}
     <br/>
     Team id : {this.state.infoJoueur["team"]?.id}
     <br/>
     <br/>
     Dernier Match :
     {this.state.lastMatch?.home_team?.full_name} {this.state.lastMatch?.home_team_score} Vs {this.state.lastMatch?.visitor_team_score} {this.state.lastMatch?.visitor_team?.full_name}
     <br/>
     Date dernier match : {dateFormat(this.state.lastMatch?.date, "dd/mm/yyyy")}
     <br/>
     <br/>
     games played: {this.state.playerStats["games_played"]}
     <br/>
     points averaged: {this.state.playerStats["pts"]}
     <br/>
     rebounds averaged: {this.state.playerStats["reb"]}
     <br/>
     assists averaged: {this.state.playerStats["ast"]}
    </div>
  );
}
}

export default App;
