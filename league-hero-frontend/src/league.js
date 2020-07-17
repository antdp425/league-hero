
class League{
   static actionRow = document.createElement("div")
   static leagueRow = document.createElement("div")
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
         this.setupLeaguePage()
         leagues.forEach(league => {
            let l = new League(league)
            this.leagueRow.innerHTML += l.renderLeagueShort()
         })
         this.addListeners()
         
      })
   }
   
   static getLeague(leagueId){
      fetch(`${baseURL}/leagues/${leagueId}`)
      .then (resp =>  resp.json())
      .then (leagues => {   
         container.innerHTML = ""
         this.setupLeaguePage()
         this.actionRow.innerHTML =""
         // let actionRow = document.createElement("div")
         // let leagueRow = document.createElement("div")
         
         // actionRow.id = "action-row"
         // actionRow.className = "row"
         
         // leagueRow.id = "league-rows"
         // leagueRow.classList.add("row","justify-content-center")
         // leagueRow.innerHTML = ""
         
         // container.appendChild(actionRow)
         // container.appendChild(leagueRow)         
         let l = new League(leagues)
         this.leagueRow.innerHTML += l.renderLeague()
         
         this.addActionListeners() 
      })
   }

   static addListeners(){
      let leagues = document.querySelector("#league-rows")
      leagues.addEventListener("click",()=>{      
         if (!!(event.target.dataset.leagueId)){
            event.stopPropagation()
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
               if (document.querySelector("form")){
               } else {
                  event.stopPropagation()
                  event.target.parentElement.parentElement.parentElement.parentElement.parentElement.insertAdjacentHTML("afterend",this.editLeagueForm())
                  this.updateLeagueListener()
               }
               break;
            case event.target.dataset.action === "delete":
               event.stopPropagation()
               this.deleteLeague(leagueId)
               break;
               }
            })
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
         document.documentElement.scrollTop = 0;
      })
   }

   static createLeague(){
      let form = event.target
      let actionRow = document.querySelector("#action-row")
      
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

         if (created.errors) {
            this.removeAlerts()
            this.renderLeagueErrors(created.errors)

         } else {
            this.removeAlerts()
            form.parentNode.removeChild(form)

            let successAlert = `
               <div class="alert alert-success text-center" role="alert">
                  League created 👍
               </div>
            `
            
            container.insertAdjacentHTML("afterbegin", successAlert)
            this.setTimeoutOnAlert("success")
            
            let leagueRow = document.querySelector("#league-rows")
            
            let l = new League(created)
            actionRow.innerHTML = ""
            leagueRow.innerHTML = ""
            leagueRow.innerHTML += l.renderLeague()
            this.addActionListeners()
      }})
   }

   static editLeagueForm(){
      const id = document.querySelector("[data-league-id]").dataset.leagueId
      const league = League.all.findIndex(league => league.id == id)
      let leagueData = {
         id: id,
         name: League.all[league].name,
         format: League.all[league].league_format,
         start_date: League.all[league].start_date,
         end_date: League.all[league].end_date
      }

      return `      
         <form>
            <div class="form-group">
               <label for="leage_name">League Name:</label>
               <input type="text" class="form-control" name="league_name" id="league_name" value="${leagueData.name}">
            </div>
            <div class="form-group">
               <label for="league_format">League Format:</label>
               <select class="form-control" name="league_format" id="league_format">
                  <option value="${leagueData.format}">${leagueData.format}</option>
                  <option>3v3</option>
                  <option>5v5</option>
                  <option>7v7</option>
                  <option>11v11</option>
               </select>
            </div>
            <div class="form-group">
            <label for="start_date">Start Date:</label>
            <input type="date" class="form-control" name="start_date" id="start_date" value="${leagueData.start_date}" min="${today}">
         </div>
         <div class="form-group">
            <label for="end_date">End Date:</label>
            <input type="date" class="form-control" name="end_date" id="end_date" value="${leagueData.end_date}">
         </div>
            <button id="update" data-league-id="${leagueData.id}" type="submit" class="btn btn-primary btn-block">Update</button>
         </form>
      `
   }

   static updateLeagueListener(){
      let button = document.querySelector("#update")
      button.addEventListener("click", () => {
         event.preventDefault()
         this.updateLeague(event.target.dataset.leagueId)
         document.documentElement.scrollTop = 0;
   })
   }

   static updateLeague(leagueId){
      const allId = League.all.findIndex(league => league.id == leagueId)

      let form = event.target.parentElement
      let formData = {
         name: form[0].value,
         league_format: form[1].value,
         start_date: form[2].value,
         end_date: form[3].value 
      }

      let configObj = {
         method: "PATCH",
         headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
         },
         body: JSON.stringify(formData)
      }
      
      fetch(`${baseURL}/leagues/${leagueId}`, configObj)
      .then(resp => resp.json())
      .then(created => {
         if (created.errors) {
            this.removeAlerts()
            this.renderLeagueErrors(created.errors)

         } else {
            this.removeAlerts()
            form.parentNode.removeChild(form)

            let successAlert = `
               <div class="alert alert-success text-center" role="alert">
                  League updated 👍
               </div>
            `

            container.insertAdjacentHTML("afterbegin", successAlert)
            this.setTimeoutOnAlert("success")

            let leagueRow = document.querySelector("#league-rows")
            
            let l = new League(created)
            leagueRow.innerHTML = ""
            leagueRow.innerHTML += l.renderLeague()

            this.addActionListeners()

            League.all[allId] = {
               id: leagueId,
               name: form[0].value,
               league_format: form[1].value,
               start_date: form[2].value,
               end_date: form[3].value 
            }
      }})
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
         el.remove()
         League.all.splice((League.all.findIndex(league => league.id == leagueId)),1)
         
         this.removeAlerts()
         
         let deleteAlert = `
         <div class="alert alert-danger text-center" role="alert">
         League deleted ✅
         </div>
         `
         container.innerHTML = ""
         container.insertAdjacentHTML("afterbegin", deleteAlert)
         this.setTimeoutOnAlert("danger")
         this.getLeagues()
      })
   }

   renderLeagueShort(){
      League.store.call(this)

      return `
      <div class="col-xs-12 col-sm-12 col-md-10 col-lg-6 col-xl-6">

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
            <h2 class="card-header text-center league-name">${"" || this.name}</h2>
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
                  
                  <br>
                     <div class="action-buttons text-center">
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
            <input type="date" class="form-control" name="end_date" id="end_date">
         </div>
            <button type="submit" class="btn btn-primary btn-block">Submit</button>
         </form>
      `
   }


   static renderLeagueErrors(errors){
      let errorAlert = `
         <div class="alert alert-danger" role="alert">
            <h5 class="alert-heading">Errors occured:</h5>
         </div>
      `
      
      container.insertAdjacentHTML("afterbegin", errorAlert)

      errors.forEach(error => {
         document.querySelector(".alert").innerHTML += `
            <p class="mb-0"> - ${error}</p>
         `
      })

   }

   static store(){
      if (League.all.findIndex(league => league.id === this.id) === -1) League.all.push(this)   
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
      if ((currentDay < start) && (currentDay < end)){
         return "Upcoming"
      } else if ((currentDay === start) || ((currentDay >= start) && (currentDay < end))) {
         return "In Progress"
      } else if ((end < currentDay)){
         return "Finished"
      } else {
         return "Unkown"
      }
   }

   static setTimeoutOnAlert(alert){
      setTimeout(() => {document.querySelector(`.alert-${alert.toLowerCase()}`).remove()}, 5000);
   }

   static removeAlerts(){
      let alertElement = document.querySelector(".alert-danger")
      let successElement = document.querySelector(".alert-success")
      if (alertElement) alertElement.remove()
      if (successElement) successElement.remove()
   }

   static setupLeaguePage(){
      this.actionRow.innerHTML = ""
      this.actionRow.id = "action-row"
      this.actionRow.className = "row"
      
      this.leagueRow.id = "league-rows"
      this.leagueRow.classList.add("row","justify-content-center")
      this.leagueRow.innerHTML = ""
      
      container.appendChild(this.actionRow)
      container.appendChild(this.leagueRow)

      this.actionRow.innerHTML = this.newLeagueButton()
      this.newLeagueListener()
   }
}