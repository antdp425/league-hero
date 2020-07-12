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
      this.league_id = teamInfo.league_id
      this.league = teamInfo.league.name
   }

   static getTeams(){
      fetch(`${baseURL}/teams`)
      .then (resp =>  resp.json())
      .then (teams => {         
         let container = document.querySelector(".container-fluid")
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
            teamRow.innerHTML += t.renderTeam()
         })
      })
   }

   renderTeam(){
      return `
      <div class="col-10">
            <div class="card bg-light mb-3">
               <div class="card-header align-middle">${this.name}
                  <span>
                     <a href="#" data-league-id="${this.league_id}" class=" badge badge-dark float-right">${this.league}</a>
                  </span>
               </div>
            </div>
      </div>
      `
   }
}