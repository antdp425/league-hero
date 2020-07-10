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
         let actionRow = document.createElement("div")
         let leagueRow = document.createElement("div")

         actionRow.id = "action-row"
         actionRow.className = "row"
         
         leagueRow.id = "league-rows"
         leagueRow.className = "row"
         
         container.appendChild(actionRow)
         container.appendChild(leagueRow)

         actionRow.innerHTML += League.newLeagueButton()
         League.newLeagueListener()

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
      <button type="button" class="btn btn-block btn-outline-primary ml-auto" id="add-league">Add League</button>
      `
   }

   static newLeagueForm(){
      return `      
         <form>
            <div class="form-group">
               <label for="exampleInputEmail1">Email address</label>
               <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email">
               <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
            </div>
            <div class="form-group">
               <label for="exampleInputPassword1">Password</label>
               <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password">
            </div>
            <div class="form-check">
               <input type="checkbox" class="form-check-input" id="exampleCheck1">
               <label class="form-check-label" for="exampleCheck1">Check me out</label>
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
         </form>
      `
   }

   static newLeagueListener(){
      let button = document.querySelector("#add-league")
      button.addEventListener("click", () => {
         event.target.parentElement.innerHTML += League.newLeagueForm()
      })
   }

}