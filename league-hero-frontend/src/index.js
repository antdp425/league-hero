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
         leagues.forEach(league => {
            let l = new League(league)
            l.renderLeague()
         })
      })
   }

   renderLeague(){
      let container = document.querySelector(".container-fluid")
      let card = this.renderLeagueInfo()
      container.innerHTML += card
   }

   renderLeagueInfo(){
      return `
         <div class="card bg-light mb-3" style="max-width: 18rem;">
            <div class="card-header">${this.name}</div>
               <div class="card-body">
                  <h5 class="card-title">Light card title</h5>
                  <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
               </div>
         </div>
      `
   }
}