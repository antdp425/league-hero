class League{
   static all = []
   static months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]
   
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
   static addListeners(){
      let leagues = document.querySelector("#league-rows")
      leagues.addEventListener("click",()=>{      
         if (!!(event.target.dataset.leagueId)){   
         let leagueId = event.target.dataset.leagueId
         this.getLeague(leagueId)
         }
      })
   }

   static addActionListeners(){
      let actions = document.querySelector(".action-buttons")
      actions.addEventListener("click",()=>{
         let leagueId = event.target.dataset.leagueId
         switch (true) {
            case event.target.dataset.action === "edit":
               console.log("Its an edit")
               if (document.querySelector("form")){                  
               } else {
                  event.target.parentElement.parentElement.parentElement.parentElement.parentElement.insertAdjacentHTML("beforeend",this.editLeagueForm())
                  this.updateLeagueListener()
               }
               break;
            case event.target.dataset.action === "delete":
               this.deleteLeague(leagueId)
               console.log("Its a delete")
               break;
         }
      })
   }

   static editLeagueForm(){

      // let leagueData = {
      //    id: document.querySelector("[data-team-id]").dataset.teamId,
      //    name: document.querySelector("#team_name").innerText ,
      //    email: document.querySelector("#team_email").innerText ,
      //    phone: document.querySelector("#team_phone").innerText
      // }
      // return `      
      //    <form>
      //       <div class="form-group">
      //          <label for="team_name">Team Name:</label>
      //          <input type="text" class="form-control" name="team_name" id="team_name" value="${teamData.name}">
      //       </div>
      //       <div class="form-group">
      //          <label for="email">Email:</label>
      //          <input type="email" class="form-control" name="email" id="team_email" value="${teamData.email}">
      //       </div>
      //       <div class="form-group">
      //       <label for="phone">Phone:</label>
      //       <input type="text" class="form-control" name="phone" id="team_phone" maxlength="10" value="${teamData.phone}">
      //    </div>
      //       <button type="submit" class="btn btn-block btn-primary" data-team-id="${teamData.id}" id="update">Update</button>
      //    </form>
      // `
   }

   static updateLeagueListener(){
   //    let button = document.querySelector("#update")
   //    button.addEventListener("click", () => {
   //       event.preventDefault()
   //       this.updateTeam(event.target.dataset.teamId)
   //       button.parentNode.removeChild(button)
   // })
}

   static updateLeague(leagueId){
      // console.log(`You passed in ${teamId}`);
      // let form = event.target.parentElement
      // let formData = {
      //    name: form[0].value,
      //    email: form[1].value,
      //    phone: form[2].value
      // }

      // let configObj = {
      //    method: "PATCH",
      //    headers: {
      //       "Content-Type": "application/json",
      //       "Accept": "application/json"
      //    },
      //    body: JSON.stringify(formData)
      // }
      
      // fetch(`${baseURL}/teams/${teamId}`, configObj)
      // .then(resp => resp.json())
      // .then(created => {
      //    let teamRow = document.querySelector("#team-rows")
         
      //    let t = new Team(created)
      //    teamRow.innerHTML = ""
      //    teamRow.innerHTML += t.renderTeam()
      // })
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
      <div class="col-xs-12 col-sm-12 col-md-10 col-lg-6 col-xl-4">

         <div class="card bg-light mb-3">
            <div class="card-header bg-border-dark text-center">
               <a href="#" data-league-id="${this.id}">${this.name}</a>
            </div>
            <div class="card-body bg-white border-dark">
              <div class="row">
                <div class="col-sm-4 league-start-date">
                     <h5 class="card-title bg-secondary text-center date-month">${this.getMonth(this.start_date)}</h5>
                     <h1 class="card-text bg-dark text-center date-number">${this.getDay(this.start_date)}</h1>
               </div>

                <div class="col-sm-4 league-status">
                     <h5 class="card-title bg-secondary text-center">Status</h5>
                     <h3 class="card-text bg-light text-center">${this.getStatus()}</h3>
                </div>
                <div class="col-sm-4 league-teams-count">
                     <h5 class="card-title bg-secondary text-center">Total Teams</h5>
                     <h3 class="card-text bg-light text-center">${this.teams.length}</h3>
                </div>
               </div>
            </div>
         </div>
      </div>
      `
   }

   renderLeague(){
      League.store.call(this)
      
      return `
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-8">
         <div class="card bg-light mb-3">
            <h2 class="card-header text-center">${this.name}</h2>
               <div class="card-body">
                  <div class="row">
                     <div class="col-3">
                        <h5 class="card-title bg-secondary text-center date-month">${this.getMonth(this.start_date)}</h5>
                        <h1 class="card-text bg-dark text-center date-number">${this.getDay(this.start_date)}</h1>
                     </div>
                     <div class="col-9">
                           <h5 class="card-title text-center">Light card title</h5>
                           <p class="card-text text-center">Some quick example text.</p>
                     </div>
                  </div>
                  <br>
                  <div class="action-buttons">
                     <button class="btn btn-info" data-league-id="${this.id}" data-action="edit">Edit League</button>
                     <button class="btn btn-danger" data-league-id="${this.id}" data-action="delete">Delete League</button>
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
            <div class="form-group>
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
            <button type="submit" class="btn btn-primary btn-block">Submit</button>
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

   getMonth(league_date){
      const date = new Date(league_date).getUTCMonth()
      return League.months[date]
   }

   getDay(league_date){
      const date = new Date(league_date).getUTCDate()
      return date
   }

   getStatus(){
      const start = new Date(this.start_date)
      const end = new Date(this.end_date)
      const currentDay = new Date(today)
      if (currentDay < (start && end)){
         return "Upcoming"
      } else if ((currentDay === start) || 
                  ((currentDay > start) && (currentDay < end))) {
         return "In Progress"
      } else {
         return "Finished"
      }
   }
}