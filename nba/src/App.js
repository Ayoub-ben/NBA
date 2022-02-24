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
      tabMatch : [],
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
      axios.get(`https://www.balldontlie.io/api/v1/games?seasons[]=2021&team_ids[]=${this.state.teamId}&per_page=100`)
      .then(async res=> {


        //Créer un tableau de match de la saison en enlevant les match non joué
        for(let i=1; i < res.data.data?.length; i++){
            if(res.data.data[i]?.home_team_score !== 0){
                this.state.tabMatch.push(res.data.data[i])
            }
        //console.log("Toutes les Matchs :" + res.data.data[i])
        }

          //TRIE LE TABLEAU
          this.state.tabMatch.sort(function (a, b) {
              if (a?.date<b?.date)
                return -1;
              if (a?.date>b?.date)
                return 1;
              return 0;
          });

        //Affiche le tableau triee
          for(let i=1; i < this.state.tabMatch?.length; i++){
              console.log(this.state.tabMatch[i])
          }

          //Recupère le dernier match
        this.setState({  lastMatch : this.state.tabMatch[this.state.tabMatch.length-1]})

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

     Date match : {dateFormat(this.state.tabMatch[this.state.tabMatch.length-1]?.date, "dd/mm/yyyy")}
     <br/>
     {this.state.tabMatch[this.state.tabMatch.length-1]?.home_team?.full_name} {this.state.tabMatch[this.state.tabMatch.length-1]?.home_team_score} Vs {this.state.tabMatch[this.state.tabMatch.length-1]?.visitor_team_score} {this.state.tabMatch[this.state.tabMatch.length-1]?.visitor_team?.full_name}
     <br/>
     <br/>

     Date match : {dateFormat(this.state.tabMatch[this.state.tabMatch.length-2]?.date, "dd/mm/yyyy")}
     <br/>
     {this.state.tabMatch[this.state.tabMatch.length-2]?.home_team?.full_name} {this.state.tabMatch[this.state.tabMatch.length-2]?.home_team_score} Vs {this.state.tabMatch[this.state.tabMatch.length-2]?.visitor_team_score} {this.state.tabMatch[this.state.tabMatch.length-2]?.visitor_team?.full_name}
      <br/>
      <br/>

      Date match : {dateFormat(this.state.tabMatch[this.state.tabMatch.length-3]?.date, "dd/mm/yyyy")}
      <br/>
      {this.state.tabMatch[this.state.tabMatch.length-3]?.home_team?.full_name} {this.state.tabMatch[this.state.tabMatch.length-3]?.home_team_score} Vs {this.state.tabMatch[this.state.tabMatch.length-3]?.visitor_team_score} {this.state.tabMatch[this.state.tabMatch.length-3]?.visitor_team?.full_name}
      <br/>
      <br/>


      Date match : {dateFormat(this.state.tabMatch[this.state.tabMatch.length-4]?.date, "dd/mm/yyyy")}
      <br/>
      {this.state.tabMatch[this.state.tabMatch.length-4]?.home_team?.full_name} {this.state.tabMatch[this.state.tabMatch.length-4]?.home_team_score} Vs {this.state.tabMatch[this.state.tabMatch.length-4]?.visitor_team_score} {this.state.tabMatch[this.state.tabMatch.length-4]?.visitor_team?.full_name}
      <br/>
      <br/>

      Date match : {dateFormat(this.state.tabMatch[this.state.tabMatch.length-5]?.date, "dd/mm/yyyy")}
      <br/>
      {this.state.tabMatch[this.state.tabMatch.length-5]?.home_team?.full_name} {this.state.tabMatch[this.state.tabMatch.length-5]?.home_team_score} Vs {this.state.tabMatch[this.state.tabMatch.length-5]?.visitor_team_score} {this.state.tabMatch[this.state.tabMatch.length-5]?.visitor_team?.full_name}
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
