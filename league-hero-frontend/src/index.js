const baseURL = "http://localhost:3000"
const date = new Date
const today = `${date.getFullYear()}-0${date.getMonth()+1}-${date.getDate()}`
const tomorrow = `${date.getFullYear()}-0${date.getMonth()+1}-${date.getDate()+1}`
const nav = document.querySelector("nav")
const container = document.querySelector(".container-fluid")

document.addEventListener("DOMContentLoaded",()=>{
   nav.addEventListener("click",() => {navigateTo()})
   League.getLeagues()
   
})

function navigateTo(){
   switch (true) {
      case (event.target.id === "logo-nav") || (event.target.id === "leagues-nav"):
         container.innerHTML = ""
         League.getLeagues()
         break;
      case (event.target.id === "teams-nav"):
         Team.getTeams()
         break;
   }
}

class Team{
   constructor(teamInfo){
      this.name = teamInfo.name
      this.email = teamInfo.email
      this.phone = teamInfo.phone
      this.paid = teamInfo.paid
      this.team_id = teamInfo.id
      this.league_id = teamInfo.league_id
      this.league = teamInfo.league.name
   }

   static getTeams(){
      fetch(`${baseURL}/teams`)
      .then (resp =>  resp.json())
      .then (teams => {         
         container.innerHTML = ""
         let actionRow = document.createElement("div")
         let teamRow = document.createElement("div")

         actionRow.id = "action-row"
         actionRow.className = "row"
         
         teamRow.id = "team-rows"
         teamRow.classList.add("row","justify-content-center")
         teamRow.innerHTML = ""
         
         container.appendChild(actionRow)
         container.appendChild(teamRow)

         teams.forEach(team => {
            let t = new Team(team)
            teamRow.innerHTML += t.renderTeamShort()
         })

         this.addListeners()

      })
   }

   static getTeam(leagueId, teamId){
      fetch(`${baseURL}/leagues/${leagueId}/teams/${teamId}`)
      .then (resp =>  resp.json())
      .then (teams => {         
         container.innerHTML = ""
         let actionRow = document.createElement("div")
         let teamRow = document.createElement("div")
         
         actionRow.id = "action-row"
         actionRow.className = "row"
         
         teamRow.id = "team-rows"
         teamRow.classList.add("row","justify-content-center")
         teamRow.innerHTML = ""
         
         container.appendChild(actionRow)
         container.appendChild(teamRow)
         
         let t = new Team(teams)
         teamRow.innerHTML += t.renderTeam()
         
         this.addListeners()
         
      })
   }

   static addListeners(){
      let teams = document.querySelector("#team-rows")
      teams.addEventListener("click",()=>{
         switch (true) {
            case !!event.target.dataset.teamId:
               let leagueId = event.target.nextElementSibling.firstElementChild.dataset.leagueId
               let teamId = event.target.dataset.teamId
               Team.getTeam(leagueId, teamId)
               break;
            case !!event.target.dataset.leagueId:
               // Team.getTeams()
               console.log("Its a league")
               break;
         }
      })
   }
   
   renderTeamShort(){
      return `
      <div class="col-10">
            <div class="card bg-light mb-3">
               <div class="card-header align-middle">
               <a href="#" data-team-id="${this.team_id}">${this.name}</a>
                     <span>
                        <a href="#" data-league-id="${this.league_id}" class=" badge badge-dark float-right">${this.league}</a>
                     </span>
               </div>
            </div>
      </div>
      `
   }

   renderTeam(){
      return `
      <div class="col-10">
            <div class="card bg-light mb-3">
               <div class="card-header align-middle">
               <a href="#" data-team-id="${this.team_id}">${this.name}</a>
                     <span>
                        <a href="#" data-league-id="${this.league_id}" class=" badge badge-dark float-right">${this.league}</a>
                     </span>
               </div>
                  <div class="card-body">
                  <div class="card-text"><i class="fas fa-envelope"></i> ${this.email}</div>
                  <div class="card-text"><i class="fas fa-mobile"></i> ${this.phone}</div>
                  <br>
                  <button class="btn btn-info">Edit Team</button>
                  <button class="btn btn-danger">Delete Team</button>
               </div>
            </div>
      </div>
      `
   }
}