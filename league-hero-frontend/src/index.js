const baseURL = "http://localhost:3000"
const date = new Date
const today = `${date.getFullYear()}-0${date.getMonth()+1}-${date.getDate()}`
const tomorrow = `${date.getFullYear()}-0${date.getMonth()+1}-${date.getDate()+1}`

document.addEventListener("DOMContentLoaded",()=>{
   League.getLeagues()
})

class League{
   constructor(leagueInfo){
      this.name = leagueInfo.name
      this.format = leagueInfo.league_format
      this.start = leagueInfo.start_date
      this.end = leagueInfo.end_date
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

         actionRow.innerHTML += this.newLeagueButton()
         this.newLeagueListener()

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
               <label for="leage_name">League Name:</label>
               <input type="text" class="form-control" name="league_name" id="league_name">
            </div>
            <div class="form-group">
               <label for="league_format">League Format:</label>
               <select class="form-control" name="league_format" id="league_format" required>
                  <option value="">--Select a League Format --</option>
                  <option>3v3</option>
                  <option>5v5</option>
                  <option>7v7</option>
                  <option>11v11</option>
               </select>
            </div>
            <div class="form-group">
            <label for="start_date">Start Date:</label>
            <input type="date" class="form-control" name="start_date" id="start_date" min="${today}">
         </div>
         <div class="form-group">
            <label for="end_date">End Date:</label>
            <input type="date" class="form-control" name="end_date" id="end_date" min="${tomorrow}">
         </div>
            <button type="submit" class="btn btn-primary">Submit</button>
         </form>
      `
   }

   static newLeagueListener(){
      let button = document.querySelector("#add-league")
      button.addEventListener("click", () => {
         event.target.parentElement.innerHTML += this.newLeagueForm()
         this.createLeagueListener()
      })
   }

   static createLeagueListener(){
      let form = document.querySelector("form")
      form.addEventListener("submit", () => {
         event.preventDefault()
         this.createLeague()
      })
   }

   static createLeague(){
      let form = event.target
      let formData = {
         name: form[0].value,
         league_format: form[1].value,
         start_date: form[2].value,
         end_date: form[3].value
      }
      let configObj = {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(formData)
      }

      return fetch(`${baseURL}/leagues`, configObj)
      .then(resp => resp.json())
      .then(created => {
         let leagueRow = document.querySelector("#league-rows")

         let l = new League(created)
         leagueRow.innerHTML += l.renderLeague()

      })
         // leagues.forEach(league => {
         //    let l = new League(league)
         //    leagueRow.innerHTML += l.renderLeague()
   }
}