class League{
   static all = []
   constructor(leagueInfo){
      this.id = leagueInfo.id
      this.name = leagueInfo.name
      this.league_format = leagueInfo.league_format
      this.start_date = leagueInfo.start_date
      this.end_date = leagueInfo.end_date
      this.teams = leagueInfo.teams
   }

   static getLeagues(){
      fetch(`${baseURL}/leagues`)
      .then (resp =>  resp.json())
      .then (leagues => {
         container.innerHTML = ""
         let actionRow = document.createElement("div")
         let leagueRow = document.createElement("div")

         actionRow.id = "action-row"
         actionRow.className = "row"
         
         leagueRow.id = "league-rows"
         leagueRow.classList.add("row","justify-content-center")
         leagueRow.innerHTML = ""
         
         container.appendChild(actionRow)
         container.appendChild(leagueRow)

         actionRow.innerHTML += this.newLeagueButton()
         this.newLeagueListener()

         leagues.forEach(league => {
            let l = new League(league)
            leagueRow.innerHTML += l.renderLeagueShort()
         })

         this.addListeners()

      })
   }

   static addListeners(){
      let leagues = document.querySelector("#league-rows")
      leagues.addEventListener("click",()=>{      
         if (!!(event.target.dataset.leagueId)){   
         let leagueId = event.target.dataset.leagueId
         this.getLeague(leagueId)
         }
      })
   }

   static getLeague(leagueId){
      fetch(`${baseURL}/leagues/${leagueId}`)
      .then (resp =>  resp.json())
      .then (leagues => {         
         container.innerHTML = ""
         let actionRow = document.createElement("div")
         let leagueRow = document.createElement("div")
         
         actionRow.id = "action-row"
         actionRow.className = "row"
         
         leagueRow.id = "league-rows"
         leagueRow.classList.add("row","justify-content-center")
         leagueRow.innerHTML = ""
         
         container.appendChild(actionRow)
         container.appendChild(leagueRow)
         
         let l = new League(leagues)
         leagueRow.innerHTML += l.renderLeague() 
         
         this.addActionListeners()

      })
   }

   static addActionListeners(){
      let actions = document.querySelector(".action-buttons")
      actions.addEventListener("click",()=>{
         let leagueId = event.target.dataset.leagueId
         switch (true) {
            case event.target.dataset.action === "edit":
               console.log("Its an edit")
               // let leagueId = event.target.nextElementSibling.firstElementChild.dataset.leagueId
               // let teamId = event.target.dataset.teamId
               // this.getTeam(leagueId, teamId)
               break;
            case event.target.dataset.action === "delete":
               League.deleteLeague(leagueId)
               console.log("Its a delete")
               break;
         }
      })
   }

   static deleteLeague(leagueId){
      let el = document.querySelector(`[data-league-id="${leagueId}"]`).parentElement.parentElement.parentElement

      let configObj = {
         method: "DELETE",
         headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          }
      }

      fetch(`${baseURL}/leagues/${leagueId}`, configObj)
      .then(()=>{
         this.getLeagues()
         el.remove()
      })
   }

   renderLeagueShort(){
      League.store.call(this)

      return `
      <div class="col-xs-10 col-sm-6 col-md-4">
         <div class="card bg-light mb-3">
            <div class="card-header">
            <a href="#" data-league-id="${this.id}">${this.name}</a>
            </div>
               <div class="card-body">
                  <h5 class="card-title">Light card title</h5>
                  <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
               </div>
         </div>
      </div>
      `
   }

   renderLeague(){
      League.store.call(this)
      
      return `
      <div class="col-12">
         <div class="card bg-light mb-3">
            <div class="card-header">${this.name}</div>
               <div class="card-body">
                  <h5 class="card-title">Light card title</h5>
                  <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                  <br>
                  <div class="action-buttons">
                     <button class="btn btn-info" data-league-id="${this.id}" data-action="edit">Edit League</button>
                     <button class="btn btn-danger" data-league-id="${this.id}" data-action="delete">Delete League</button>
                  </div>
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
         event.preventDefault()
         if (document.querySelector("form")){
         } else {
            event.target.parentElement.insertAdjacentHTML("beforeend",(this.newLeagueForm()))
            this.createLeagueListener()
         }
      })
   }

   static createLeagueListener(){
      let form = document.querySelector("form")
      form.addEventListener("submit", () => {
         event.preventDefault()
         this.createLeague()
         form.parentNode.removeChild(form)
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

      fetch(`${baseURL}/leagues`, configObj)
      .then(resp => resp.json())
      .then(created => {
         let leagueRow = document.querySelector("#league-rows")

         let l = new League(created)
         leagueRow.innerHTML = ""
         leagueRow.innerHTML += l.renderLeague()
      })
   }

   static store(){
      League.all.findIndex(league => league.id === this.id) === -1 ?
         League.all.push(this) : 
            false
   }
}