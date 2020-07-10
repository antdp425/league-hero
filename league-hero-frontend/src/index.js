const baseURL = "http://localhost:3000"

document.addEventListener("DOMContentLoaded",()=>{
   League.getLeagues()
})

class League{
   constructor(leagueInfo){
      this.name = leagueInfo.name
      this.format = leagueInfo.format
      this.start = leagueInfo.start
      this.end = leagueInfo.end
   }

   static getLeagues(){
      return fetch(`${baseURL}/leagues`)
      .then (resp =>  resp.json())
      .then (leagues => {
         let container = document.querySelector(".container-fluid")
         let leagueRow = document.createElement("div")
         let actionRow = document.createElement("div")
         
         leagueRow.id = "league-rows"
         leagueRow.className = "row"

         actionRow.id = "action-row"
         actionRow.className = "row"
         
         container.appendChild(actionRow)
         container.appendChild(leagueRow)

         actionRow.innerHTML += League.newLeagueButton()
         leagues.forEach(league => {
            let l = new League(league)
            leagueRow.innerHTML += l.renderLeague()
         })
      })
   }

   renderLeague(){
      return `
      <div class="col-xs-10 col-sm-6 col-md-4">
         <div class="card bg-light mb-3">
            <div class="card-header">${this.name}</div>
               <div class="card-body">
                  <h5 class="card-title">Light card title</h5>
                  <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
               </div>
         </div>
      </div>
      `
   }

   static newLeagueButton(){
      return `
      <button type="button" class="btn btn-block btn-outline-primary    ml-auto">Add League</button>
      `
   }

}